// server/services/auth/token.service.js
import jwt from 'jsonwebtoken';

export const tokenService = {
  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  },

  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
};
