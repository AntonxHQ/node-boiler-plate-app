module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  req.log?.error(err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    body: null,
  });
};
