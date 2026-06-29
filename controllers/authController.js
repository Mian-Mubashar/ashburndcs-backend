const authService = require("../services/authService");
const asyncHandler = require("../middleware/asyncHandler");

exports.register = asyncHandler((req) => authService.register(req.body));
exports.login = asyncHandler((req) => authService.login(req.body));
exports.verifyEmail = asyncHandler((req) => authService.verifyEmail(req.params.token));

exports.resendVerification = asyncHandler((req) =>
  authService.resendVerification(req.body)
);

exports.forgotPassword = asyncHandler((req) => authService.forgotPassword(req.body));

exports.resetPassword = asyncHandler((req) => authService.resetPassword(req.body));
