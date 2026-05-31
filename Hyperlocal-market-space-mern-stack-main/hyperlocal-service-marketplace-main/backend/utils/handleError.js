const handleError = (res, error, status = 500, message = "Internal server error") => {
  const errorMessage = error?.message || error;
  const errorStack = process.env.NODE_ENV === "development" ? error?.stack : undefined;

  if (process.env.NODE_ENV === "development") {
    console.error(`[Error] ${message}: ${errorMessage}`);
  }

  return res.status(status).json({
    success: false,
    message,
    error: errorMessage,
    ...(errorStack && { errorStack }),
  });
};

export default handleError;
