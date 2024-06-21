const asyncHandler = (requestHandler) => {
  // A function that takes a request handler as an argument and returns a new function
  return (req, res, next) => {
    // Resolve the request handler and catch any errors
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

// const asyncHandler = () => {};
// const asyncHandler = (func) => () => {};
// const asyncHandler = (func) => async () => {};

// const asyncHandler = (fn) => (req, res, next) => {
//   try {
// await fn(req, res, next){}

//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message || "Internal Server Error",
//     });
//   }
// };
