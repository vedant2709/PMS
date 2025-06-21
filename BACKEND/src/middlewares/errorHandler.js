export const errorHandler = (err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.error("Unexpected Error:", err);

  res.status(500).json({
    status: "error",
    message: "Something went wrong on our side!",
  });
};
