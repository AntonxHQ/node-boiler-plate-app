const express = require("express");
const expressLogger = require("express-bunyan-logger");
const cors = require("cors");
const router = require("./routes");
const responseHandler = require("./middlewares/responseHandler");
const errorHandler = require("./middlewares/errorHandler");

require("./models");
// error handling by
process.on("uncaughtException", (e) => {
  console.log(e);
});

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));
app.use(
  expressLogger({
    excludes: [
      "headers",
      "req",
      "user-agent",
      "short-body",
      "http-version",
      "req-headers",
      "res-headers",
      "body",
      "res",
    ],
  })
);
app.use(cors());

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
