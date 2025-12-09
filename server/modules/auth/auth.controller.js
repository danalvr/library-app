const { authService } = require("./auth.service.js");
const { loginSchema, registerSchema } = require("./auth.validation.js");

exports.authController = {
  async register(req, res, next) {
    try {
      const dto = registerSchema.parse(req.body);
      const result = await authService.register(dto);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const dto = loginSchema.parse(req.body);
      const result = await authService.login(dto);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
