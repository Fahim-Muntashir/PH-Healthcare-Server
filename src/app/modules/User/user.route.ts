import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import auth from '../../middleware/auth';
const router = express.Router();



router.post('/',auth("ADMIN","SUPER_ADMIN"),userController.createAdmin);

export const UserRoutes= router;