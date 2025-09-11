"use strict";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { google } from "googleapis";
import fs from "fs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// -----------------------------
// Google Sheets setup
// -----------------------------
const CREDENTIALS = JSON.parse(fs.readFileSync("credentials.json"));
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES
);
const sheets = google.sheets({ version: "v4", auth });

const SHEET_ID = "1xtUrGgPrWkL-6EgaPcLzKYJBLNeR8uz92OhKz6DsH_4";
const RANGE = "Sheet1!A:E"; // Email | Timestamp | Status | Token | Expiry

// -----------------------------
// Nodemailer setup
// -----------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// -----------------------------
// Regex for SRM emails
// -----------------------------
const SRM_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@srmist\.edu\.in$/;

// -----------------------------
// Subscribe Route
// -----------------------------
app.post("/subscribe", async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    email = email.trim().toLowerCase();
    if (!SRM_EMAIL_REGEX.test(email))
      return res.status(400).json({ error: "Only @srmist.edu.in emails allowed" });

    // Check duplicates
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:A",
    });
    const existingEmails = response.data.values ? response.data.values.flat().map(e => e.toLowerCase()) : [];
    if (existingEmails.includes(email))
      return res.status(400).json({ error: "Email already subscribed" });

    // Generate token + timestamp + expiry
    const token = crypto.randomBytes(20).toString("hex");
    const timestamp = new Date().toISOString();
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Append to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: RANGE,
      valueInputOption: "RAW",
      requestBody: {
        values: [[email, timestamp, "Pending", token, expiry]],
      },
    });

    // Send verification email
    const verifyLink = `${process.env.BACKEND_URL || "http://localhost:5000"}/verify?token=${token}`;

    try {
      const info = await transporter.sendMail({
        from: `"SRM Club" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your SRM Club subscription",
        text: `Hi, thanks for subscribing to SRM Club! 
Please verify your email by clicking this link: ${verifyLink} 
If you didn’t request this, just ignore this email.`,
        html: `<h2>Welcome to SRM Club 🎉</h2>
               <p>Thanks for subscribing with your SRM email. Please click below to verify:</p>
             <a href="${verifyLink}" target="_blank"
   style="display:inline-block; 
          padding: 12px 28px;
          color: #fff;
          font-size: 16px;
          font-weight: bold;
          text-decoration: none;
          border-radius: 12px;
          background: rgba(30, 30, 30, 0.75);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 4px 20px rgba(0,0,0,0.6),
                      inset 0 1px 1px rgba(255,255,255,0.2);">
   Verify Email
</a>

               <p>This link expires in 24 hours. If you didn’t request this, you can safely ignore it.</p>
               <br/>
               <small>SRM Club | srmist.edu.in | Do not reply</small>`,
      });

      console.log("Verification email sent:", info.response);
    } catch (mailErr) {
      console.error("Failed to send email:", mailErr);
      return res.status(500).json({ error: "Failed to send verification email" });
    }

    res.json({ success: true, message: "Verification email sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

// -----------------------------
// Verify Route (now with HTML pages)
// -----------------------------
app.get("/verify", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send(`
        <html>
          <head><title>Invalid Link</title></head>
          <body style="font-family: Arial; text-align: center; margin-top: 50px;">
            <h2>Invalid Verification Link</h2>
            <p>The token is missing or incorrect.</p>
          </body>
        </html>
      `);
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });
    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[3] === token);

    if (rowIndex === -1) {
      return res.status(400).send(`
        <html>
          <head><title>Expired or Invalid</title></head>
          <body style="font-family: Arial; text-align: center; margin-top: 50px;">
            <h2>Link Expired or Invalid</h2>
            <p>Your verification link is invalid or has already been used.</p>
          </body>
        </html>
      `);
    }

    // Update status to Verified
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `Sheet1!C${rowIndex + 1}`,
      valueInputOption: "RAW",
      requestBody: { values: [["Verified"]] },
    });

    return res.send(`
      <html>
        <head><title>Verified</title></head>
        <body style="font-family: Arial; text-align: center; margin-top: 50px;">
          <h2>Email Verified Successfully!</h2>
          <p>Thank you for verifying your email with SRM ACM SIGAPP</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    return res.status(500).send(`
      <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial; text-align: center; margin-top: 50px;">
          <h2>Verification Failed</h2>
          <p>Something went wrong while verifying your email. Please try again later.</p>
        </body>
      </html>
    `);
  }
});

// -----------------------------
// Cron Job: Remove expired Pending emails
// -----------------------------
cron.schedule("0 * * * *", async () => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });
    const rows = response.data.values || [];
    const now = new Date();

    for (let i = rows.length - 1; i >= 0; i--) {
      const [email, , status, , expiry] = rows[i];
      if (status === "Pending" && new Date(expiry) < now) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SHEET_ID,
          requestBody: {
            requests: [
              {
                deleteDimension: {
                  range: { sheetId: 0, dimension: "ROWS", startIndex: i, endIndex: i + 1 },
                },
              },
            ],
          },
        });
        console.log(`🗑 Removed expired email: ${email}`);
      }
    }
  } catch (err) {
    console.error("Cron job failed:", err);
  }
});

// -----------------------------
// Start server
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
