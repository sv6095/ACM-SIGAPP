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
  origin: ['https://acm-sigapp-production.up.railway.app'],
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

// Handle preflight OPTIONS requests
app.options('*', (req, res) => {
  console.log("🔄 OPTIONS request received:", {
    path: req.path,
    method: req.method,
    origin: req.headers.origin,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  });
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
// Multiple email transporter configurations for fallback
// -----------------------------
const createTransporter = (config = {}) => {
  console.log("📧 Creating email transporter with config:", {
    service: config.service || "gmail",
    host: config.host || "smtp.gmail.com",
    port: config.port || 587,
    secure: config.secure || false,
    hasAuth: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
  });
  
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
  console.log("🏠 Root route accessed:", {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  });
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

    // Send verification email with retry logic
    const verifyLink = `https://acm-sigapp-production.up.railway.app/verify?token=${token}`;

    const sendEmailWithRetry = async () => {
      console.log("📧 Preparing to send verification email...");
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
      console.log("📧 Email data prepared:", {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        verifyLink: verifyLink.substring(0, 50) + "..."
      });

      // Try each configuration
      for (let configIndex = 0; configIndex < transporterConfigs.length; configIndex++) {
        const config = transporterConfigs[configIndex];
        console.log(`📧 Trying email configuration ${configIndex + 1}/${transporterConfigs.length}:`, {
          service: config.service,
          host: config.host,
          port: config.port,
          secure: config.secure
        });
        
        try {
          const transporter = createTransporter(config);
          
          console.log("🔌 Testing email connection...");
          // Quick connection test with shorter timeout
          await Promise.race([
            transporter.verify(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Connection timeout')), 5000)
            )
          ]);
          
          console.log(`✅ Configuration ${configIndex + 1} connected successfully`);
          
          console.log("📤 Sending email...");
          const result = await transporter.sendMail(emailData);
          console.log("✅ Email sent successfully:", {
            messageId: result.messageId,
            response: result.response,
            accepted: result.accepted,
            rejected: result.rejected
          });
          return result;
          
        } catch (configErr) {
          console.error(`❌ Configuration ${configIndex + 1} failed:`, {
            message: configErr.message,
            code: configErr.code,
            command: configErr.command,
            response: configErr.response
          });
          
          // If this is the last configuration, throw the error
          if (configIndex === transporterConfigs.length - 1) {
            throw new Error(`All email configurations failed. Last error: ${configErr.message}`);
          }
          
          // Wait briefly before trying next configuration
          console.log("⏳ Waiting 1 second before trying next configuration...");
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    };

    try {
      console.log("📧 Attempting to send verification email...");
      await sendEmailWithRetry();
      console.log("✅ Email sent successfully, responding with success");
      res.json({ success: true, message: "Verification email sent!" });
    } catch (mailErr) {
      console.error("❌ Failed to send email after all retries:", {
        message: mailErr.message,
        stack: mailErr.stack,
        timestamp: new Date().toISOString()
      });
      
      // Fallback: Mark as verified without email if email service is down
      console.log("🔄 Attempting fallback: Mark as verified without email...");
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `Sheet1!C${existingEmails.length + 1}`,
          valueInputOption: "RAW",
          requestBody: { values: [["Verified (No Email)"]], },
        });
        
        console.log("✅ Fallback successful: Marked email as verified without sending email");
        return res.json({ 
          success: true, 
          message: "Subscribed successfully! (Email service temporarily unavailable)" 
        });
      } catch (fallbackErr) {
        console.error("❌ Fallback also failed:", {
          message: fallbackErr.message,
          code: fallbackErr.code,
          status: fallbackErr.status
        });
        return res.status(500).json({ 
          error: "Email service temporarily unavailable. Please try again later.",
          details: mailErr.message 
        });
      }
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
  console.log("🔗 Verify endpoint: https://acm-sigapp-production.up.railway.app/verify");
  console.log("🚀 Deployed on Railway!");
});
