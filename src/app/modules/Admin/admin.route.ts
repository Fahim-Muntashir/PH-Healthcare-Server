import express, { NextFunction, Response } from 'express';
import { AdminController } from './admin.controller';

const router = express.Router();
import validateRequest from '../../middleware/validateRequest';
import { adminValidationSchemas } from './admin.validations';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';






router.get('/', auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminController.getAllFromDB)


router.get('/:id',auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminController.getByIdFromDB)


router.patch('/:id',auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), validateRequest(adminValidationSchemas.update), AdminController.updateIntoDB)


router.delete('/:id',auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminController.deleteFromDB)


router.delete('/soft/:id',auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), AdminController.softDeleteFromDB)

export const adminRoutes = router;