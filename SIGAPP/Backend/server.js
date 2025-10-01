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

// -----------------------------
// Environment Variables Check
// -----------------------------
console.log("🔧 Environment Variables Check:");
console.log("   GOOGLE_CREDENTIALS:", process.env.GOOGLE_CREDENTIALS ? "✅ Set" : "❌ Missing");
console.log("   EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Missing");
console.log("   EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing");
console.log("   PORT:", process.env.PORT || "5000 (default)");

const app = express();
// Enhanced CORS configuration
app.use(cors({
  origin: [
    'https://acm-sigapp-production.up.railway.app', // Backend URL
    'https://acm-sigapp-yho1-f836xfqdi-shantanus-projects-bddb91ff.vercel.app', // Vercel deployment URL
    'https://srmacmsigapp.xyz', // Custom domain
    'https://www.srmacmsigapp.xyz', // Custom domain with www
    'http://localhost:8080', // Local development
    'http://localhost:3000'  // Alternative local development
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Express built-in JSON parser (preferred over bodyParser)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Keep bodyParser as fallback for compatibility
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log("📥 Incoming request:", {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    userAgent: req.headers['user-agent']?.substring(0, 50) + '...',
    timestamp: new Date().toISOString()
  });
  next();
});

// Handle preflight OPTIONS requests
app.options('*', (req, res) => {
  console.log("🔄 OPTIONS request received:", {
    path: req.path,
    method: req.method,
    origin: req.headers.origin,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  });
  console.log("🌐 CORS: Allowing request from origin:", req.headers.origin);
  res.status(200).end();
});

// -----------------------------
// Google Sheets setup (from env)
// -----------------------------
if (!process.env.GOOGLE_CREDENTIALS) {
  throw new Error("❌ Missing GOOGLE_CREDENTIALS env var in Railway");
}

const CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS);
console.log("📊 Google Sheets Configuration:");
console.log("   Client Email:", CREDENTIALS.client_email);
console.log("   Project ID:", CREDENTIALS.project_id);
console.log("   Private Key:", CREDENTIALS.private_key ? "✅ Present" : "❌ Missing");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES
);
const sheets = google.sheets({ version: "v4", auth });
console.log("✅ Google Sheets API initialized successfully");

const SHEET_ID = "1xtUrGgPrWkL-6EgaPcLzKYJBLNeR8uz92OhKz6DsH_4";
const RANGE = "Sheet1!A:E"; // Email | Timestamp | Status | Token | Expiry
console.log("📋 Spreadsheet Configuration:");
console.log("   Sheet ID:", SHEET_ID);
console.log("   Range:", RANGE);

// -----------------------------
// Email verification removed - direct subscription
// -----------------------------

// -----------------------------
// Regex for SRM emails
// -----------------------------
const SRM_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@srmist\.edu\.in$/;

// -----------------------------
// Root Route
// -----------------------------
app.get("/", (req, res) => {
  console.log("🏠 Root route accessed:", {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  });
  res.json({ 
    message: "ACM SIGAPP Backend is running!", 
    status: "success",
    endpoints: ["/subscribe"]
  });
});

// -----------------------------
// Subscribe Route
// -----------------------------
app.post("/subscribe", async (req, res) => {
  try {
    console.log("📧 Subscribe request received:", {
      body: req.body,
      headers: req.headers,
      timestamp: new Date().toISOString()
    });

    let { email } = req.body;
    
    // Enhanced validation with detailed error messages
    if (!email) {
      console.log("❌ No email provided");
      return res.status(400).json({ 
        error: "Email is required",
        code: "MISSING_EMAIL"
      });
    }

    email = email.trim().toLowerCase();
    console.log("📧 Processing email:", email);

    if (!SRM_EMAIL_REGEX.test(email)) {
      console.log("❌ Invalid email format:", email);
      return res.status(400).json({ 
        error: "Only @srmist.edu.in emails are allowed",
        code: "INVALID_EMAIL_DOMAIN"
      });
    }

    // Check duplicates with error handling
    console.log("🔍 Checking for duplicate emails...");
    let existingEmails = [];
    try {
      console.log("📡 Making Google Sheets API call to get existing emails...");
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: "Sheet1!A:A",
      });
      console.log("📊 Google Sheets API response:", {
        status: "success",
        valuesCount: response.data.values ? response.data.values.length : 0,
        hasValues: !!response.data.values
      });
      existingEmails = response.data.values ? response.data.values.flat().map(e => e.toLowerCase()) : [];
      console.log("📊 Found existing emails:", existingEmails.length);
      console.log("📧 Existing emails list:", existingEmails.slice(0, 5)); // Log first 5 for debugging
    } catch (sheetsError) {
      console.error("❌ Google Sheets API error:", {
        message: sheetsError.message,
        code: sheetsError.code,
        status: sheetsError.status,
        details: sheetsError.details
      });
      return res.status(500).json({ 
        error: "Database connection failed. Please try again later.",
        code: "SHEETS_API_ERROR"
      });
    }

    if (existingEmails.includes(email)) {
      console.log("❌ Duplicate email found:", email);
      return res.status(400).json({ 
        error: "Email already subscribed",
        code: "DUPLICATE_EMAIL"
      });
    }

    // Generate token + timestamp + expiry
    const token = crypto.randomBytes(20).toString("hex");
    const timestamp = new Date().toISOString();
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Append to sheet with error handling
    console.log("📝 Adding email to spreadsheet...");
    console.log("📋 Data to append:", {
      email,
      timestamp,
      status: "Pending",
      token: token.substring(0, 8) + "...", // Log partial token for security
      expiry
    });
    try {
      const appendResponse = await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: RANGE,
        valueInputOption: "RAW",
        requestBody: {
          values: [[email, timestamp, "Pending", token, expiry]],
        },
      });
      console.log("✅ Email added to spreadsheet successfully:", {
        updatedRows: appendResponse.data.updates?.updatedRows,
        updatedColumns: appendResponse.data.updates?.updatedColumns,
        updatedCells: appendResponse.data.updates?.updatedCells
      });
    } catch (appendError) {
      console.error("❌ Failed to append to spreadsheet:", {
        message: appendError.message,
        code: appendError.code,
        status: appendError.status,
        details: appendError.details
      });
      return res.status(500).json({ 
        error: "Failed to save subscription. Please try again later.",
        code: "SHEETS_APPEND_ERROR"
      });
    }

    // Mark as verified directly (no email verification needed)
    console.log("✅ Marking email as verified without email verification");
    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `Sheet1!C${existingEmails.length + 1}`,
        valueInputOption: "RAW",
        requestBody: { values: [["Verified"]] },
      });
      
      console.log("✅ Email marked as verified successfully");
      res.json({ 
        success: true, 
        message: "Subscribed successfully!" 
      });
    } catch (updateErr) {
      console.error("❌ Failed to update status:", {
        message: updateErr.message,
        code: updateErr.code,
        status: updateErr.status
      });
      return res.status(500).json({ 
        error: "Failed to complete subscription. Please try again later.",
        code: "SHEETS_UPDATE_ERROR"
      });
    }
  } catch (err) {
    console.error("🚨 Unhandled error in subscribe route:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

// -----------------------------
// Verify Route removed - no email verification needed
// -----------------------------

// -----------------------------
// Cron Job removed - no email verification needed
// -----------------------------

// -----------------------------
// Global error handler
// -----------------------------
app.use((err, req, res, next) => {
  console.error("🚨 Unhandled error:", err);
  res.status(500).json({ 
    error: "Internal server error",
    code: "INTERNAL_ERROR"
  });
});

// -----------------------------
// Start server
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🚀 Server startup complete!");
  console.log(`✅ Backend running on port ${PORT}`);
  console.log(`🌐 Server URL: https://acm-sigapp-production.up.railway.app`);
  console.log(`📊 Health check: https://acm-sigapp-production.up.railway.app/`);
  console.log("📧 Subscribe endpoint: https://acm-sigapp-production.up.railway.app/subscribe");
  console.log("🚀 Deployed on Railway!");
});
