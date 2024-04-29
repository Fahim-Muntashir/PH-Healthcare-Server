import express from 'express';
import { AuthController } from './auth.controller';
import { UserRole } from '@prisma/client';
import auth from '../../middleware/auth';

const router = express.Router();

router.post('/login',AuthController.loginUser);

router.post('/refresh-token',AuthController.refreshToken);
router.post('/change-password',auth(UserRole.SUPER_ADMIN,UserRole.ADMIN,UserRole.DOCTOR,UserRole.PATIENT),AuthController.changePassword);

router.post('/forgot-password',AuthController.forgotpassword);

router.post('/reset-password',AuthController.resetPassword)

export const authRoutes = router;