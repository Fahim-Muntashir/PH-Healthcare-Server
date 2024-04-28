import express from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { adminRoutes } from '../modules/Admin/admin.route';

const router = express.Router();

const moduleRoutes = [
    {
        path: "/user",
        route:UserRoutes
    }, {
        path: "/admin",
        route:adminRoutes
    }
]

moduleRoutes.forEach(route=>router.use(route.path,route.route))

export default router;