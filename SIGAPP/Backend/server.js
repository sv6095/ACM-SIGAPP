"use strict";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { google } from "googleapis";
import crypto from "crypto";
import nodemailer from "nodemailer";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// -----------------------------
// Google Sheets setup (from env)
// -----------------------------
if (!process.env.GOOGLE_CREDENTIALS) {
  throw new Error("❌ Missing GOOGLE_CREDENTIALS env var in Render");
}

const CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS);

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
// Multiple email transporter configurations for fallback
// -----------------------------
const createTransporter = (config = {}) => {
  const defaultConfig = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 15000, // 15 seconds
    greetingTimeout: 8000, // 8 seconds
    socketTimeout: 15000, // 15 seconds
    pool: false,
    tls: {
      rejectUnauthorized: false
    },
    ...config
  };
  
  return nodemailer.createTransporter(defaultConfig);
};

// Alternative configurations
const transporterConfigs = [
  // Primary Gmail config
  {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  },
  // Alternative Gmail config with different port
  {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  },
  // Gmail with different TLS settings
  {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    connectionTimeout: 8000,
    greetingTimeout: 3000,
    socketTimeout: 8000,
    tls: {
      rejectUnauthorized: false,
      ciphers: 'TLSv1.2'
    }
  }
];

// -----------------------------
// Regex for SRM emails
// -----------------------------
const SRM_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@srmist\.edu\.in$/;

// -----------------------------
// Root Route
// -----------------------------
app.get("/", (req, res) => {
  res.json({ 
    message: "ACM SIGAPP Backend is running!", 
    status: "success",
    endpoints: ["/subscribe", "/verify"]
  });
});

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

    // Send verification email with retry logic
    const verifyLink = `https://acm-sigapp-production.up.railway.app/verify?token=${token}`;

    const sendEmailWithRetry = async () => {
      const emailData = {
        from: `"SRM Club" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your SRM Club subscription",
        html: `<h2>Welcome to SRM Club 🎉</h2>
               <p>Thanks for subscribing with your SRM email. Please click below to verify:</p>
               <a href="${verifyLink}" target="_blank"
                  style="display:inline-block;padding:12px 28px;
                         color:#fff;font-size:16px;font-weight:bold;
                         text-decoration:none;border-radius:12px;
                         background:rgba(30,30,30,0.75);">
                  Verify Email
               </a>
               <p>This link expires in 24 hours.</p>`,
      };

      // Try each configuration
      for (let configIndex = 0; configIndex < transporterConfigs.length; configIndex++) {
        const config = transporterConfigs[configIndex];
        console.log(`Trying email configuration ${configIndex + 1}/${transporterConfigs.length}`);
        
        try {
          const transporter = createTransporter(config);
          
          // Quick connection test with shorter timeout
          await Promise.race([
            transporter.verify(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Connection timeout')), 5000)
            )
          ]);
          
          console.log(`Configuration ${configIndex + 1} connected successfully`);
          
          const result = await transporter.sendMail(emailData);
          console.log("Email sent successfully:", result.messageId);
          return result;
          
        } catch (configErr) {
          console.error(`Configuration ${configIndex + 1} failed:`, configErr.message);
          
          // If this is the last configuration, throw the error
          if (configIndex === transporterConfigs.length - 1) {
            throw new Error(`All email configurations failed. Last error: ${configErr.message}`);
          }
          
          // Wait briefly before trying next configuration
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    };

    try {
      await sendEmailWithRetry();
      res.json({ success: true, message: "Verification email sent!" });
    } catch (mailErr) {
      console.error("Failed to send email after all retries:", mailErr);
      
      // Fallback: Mark as verified without email if email service is down
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `Sheet1!C${existingEmails.length + 1}`,
          valueInputOption: "RAW",
          requestBody: { values: [["Verified (No Email)"]], },
        });
        
        console.log("Fallback: Marked email as verified without sending email");
        return res.json({ 
          success: true, 
          message: "Subscribed successfully! (Email service temporarily unavailable)" 
        });
      } catch (fallbackErr) {
        console.error("Fallback also failed:", fallbackErr);
        return res.status(500).json({ 
          error: "Email service temporarily unavailable. Please try again later.",
          details: mailErr.message 
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

// -----------------------------
// Verify Route (same as before)
// -----------------------------
app.get("/verify", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send("Invalid Verification Link");
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });
    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[3] === token);

    if (rowIndex === -1) {
      return res.status(400).send("Link Expired or Invalid");
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `Sheet1!C${rowIndex + 1}`,
      valueInputOption: "RAW",
      requestBody: { values: [["Verified"]] },
    });

    return res.send("Email Verified Successfully!");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Verification Failed");
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
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
