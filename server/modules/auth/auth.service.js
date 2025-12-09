const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { authRepository } = require("./auth.repository");

const SECRET = process.env.JWT_SECRET;

exports.authService = {
  async register({ email, password }) {
    const existing = await authRepository.findByEmail(email);
    if (existing) {
      throw new Error("Email already registered");
    }

    const hashed = await bcrypt.hash(password, 10);

    return authRepository.create({
      email,
      password: hashed,
    });
  },

  async login({ email, password }) {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new Error("Invalid email or password");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid email or password");

    const token = jwt.sign({ email: user.email }, SECRET, {
      expiresIn: "1h",
    });

    return { token, user: { email: user.email } };
  },
};
