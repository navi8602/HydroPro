// server/controllers/auth.controller.js
import { smsService } from '../services/auth/sms.service.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export const authController = {
  async requestVerification(req, res, next) {
    try {
      const { phone } = req.body;
      const code = smsService.generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await User.findOneAndUpdate(
        { phone },
        {
          phone,
          verificationCode: { code, expiresAt },
          isVerified: false
        },
        { upsert: true }
      );

      await smsService.sendVerificationCode(phone, code);

      res.status(200).json({
        message: 'Verification code sent',
        expiresAt
      });
    } catch (error) {
      next(error);
    }
  },

  async verifyCode(req, res, next) {
    try {
      const { phone, code } = req.body;

      const user = await User.findOne({
        phone,
        'verificationCode.code': code,
        'verificationCode.expiresAt': { $gt: new Date() }
      });

      if (!user) {
        throw new ApiError(401, 'Invalid or expired code');
      }

      user.isVerified = true;
      user.verificationCode = undefined;
      await user.save();

      res.json({
        message: 'Phone verified successfully',
        user: {
          id: user._id,
          phone: user.phone,
          name: user.name
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
