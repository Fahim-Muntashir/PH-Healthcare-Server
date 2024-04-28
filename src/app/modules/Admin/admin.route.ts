import express from 'express';
import { AdminController } from './admin.controller';

const router = express.Router();


router.get('/',AdminController.getAllFromDB)
router.get('/:id',AdminController.getByIdFromDB)
router.patch('/:id',AdminController.updateIntoDB)
router.delete('/:id', AdminController.deleteFromDB)

export const adminRoutes = router;