import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import auth from '../../middleware/auth';

import { fileUploader } from '../../../helpers/filUploader';
import { UserRole } from '@prisma/client';
import { userValidation } from './user.validation';

const router = express.Router();



router.get('/',auth(UserRole.SUPER_ADMIN,UserRole.ADMIN),userController.getAllFromDB)

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
      req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
      return userController.createAdmin(req, res, next)
  }
);

router.post(
  "/create-doctor",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
      req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data))
      return userController.createDoctor(req, res, next)
  }
);

router.post(
  "/create-patient",
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
      req.body = userValidation.createPatient.parse(JSON.parse(req.body.data))
      return userController.createPatient(req, res, next)
  }
);


router.patch('/:id/status',auth(UserRole.SUPER_ADMIN,UserRole.ADMIN),userController.changeProfileStatus)


export const UserRoutes= router;