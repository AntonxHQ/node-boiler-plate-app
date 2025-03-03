const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./routes");
const responseHandler = require("./middlewares/responseHandler");
const errorHandler = require("./middlewares/errorHandler");
const { v4: uuidv4 } = require("uuid");

require("./models");

// Error handling for uncaught exceptions
process.on("uncaughtException", (e) => {
  console.error(e);
});

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

// Custom Morgan Tokens
morgan.token("id", (req) => req.id || "N/A");
morgan.token("real-ip", (req) => req.ip || req.connection.remoteAddress);
morgan.token("body", (req) => JSON.stringify(req.body));
morgan.token("user-agent", (req) => req.headers["user-agent"]);

// Request ID Middleware
app.use((req, res, next) => {
  req.id = uuidv4(); // Unique request ID
  next();
});

// Advanced Morgan Logger
app.use(
  morgan((tokens, req, res) => {
    return JSON.stringify({
      request_id: tokens.id(req, res),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number(tokens.status(req, res)),
      response_time: `${tokens["response-time"](req, res)} ms`,
      ip: tokens["real-ip"](req, res),
      user_agent: tokens["user-agent"](req, res),
      timestamp: new Date().toISOString(),
    });
  })
);

// Middleware for response handling
app.use(responseHandler);

// API routes
app.use("/api", router);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Error 404, Route not found",
    body: null,
  });
});

// Global error handler middleware
app.use(errorHandler);

module.exports = app;
