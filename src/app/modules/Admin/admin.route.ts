import express, { NextFunction, Response } from 'express';
import { AdminController } from './admin.controller';

const router = express.Router();
import validateRequest from '../../middleware/validateRequest';
import { adminValidationSchemas } from './admin.validations';






router.get('/',AdminController.getAllFromDB)
router.get('/:id',AdminController.getByIdFromDB)
router.patch('/:id',validateRequest(adminValidationSchemas.update), AdminController.updateIntoDB)
router.delete('/:id', AdminController.deleteFromDB)
router.delete('/soft/:id', AdminController.softDeleteFromDB)

export const adminRoutes = router;