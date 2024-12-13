// server/controllers/auth/register.controller.ts
import { Request, Response } from 'express';
import { User } from '../../models/User';
import { validateEmail, validatePassword, validatePhone } from '../../utils/validation';
import { hashPassword } from '../../utils/auth';
import { ApiError } from '../../utils/ApiError';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, password } = req.body;

        // Validation
        if (!validateEmail(email)) {
            throw new ApiError(400, 'Invalid email format');
        }
        if (!validatePhone(phone)) {
            throw new ApiError(400, 'Invalid phone format');
        }
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            throw new ApiError(400, passwordValidation.errors.join(', '));
        }

        // Check existing user
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });
        if (existingUser) {
            throw new ApiError(400, 'User with this email or phone already exists');
        }

        // Create user
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        next(error);
    }
};
