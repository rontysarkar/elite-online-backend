import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { UserController } from "./user.controller";


const router = Router();

router.get('/',auth(Role.ADMIN),UserController.getUsers);
router.get('/:userId',auth(Role.ADMIN),UserController.getUserById);
router.delete('/:userId',auth(Role.ADMIN),UserController.deleteUserById);


export const UserRoutes = router