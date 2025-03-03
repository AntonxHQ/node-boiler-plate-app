module.exports = (req, res, next) => {
  // Success response method
  res.success = (data, status = 200) => {
    return res.status(status).json({ success: true, error: null, body: data });
  };

  // Internal server error response method
  res.internalServerError = (error) => {
    next(error); // Pass error to errorHandler middleware
  };

  next();
};
