import { Router } from "express";
import { CreateUser, DeleteUser } from "../Controllers/User.controllers.js";


const router = Router();

router.post("/create-user", CreateUser)
router.post("/delete-user", DeleteUser)


export default router;