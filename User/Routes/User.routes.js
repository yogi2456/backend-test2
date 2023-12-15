import { Router } from "express";
import { CreateUser, DeleteUser, ReadOwnData, ReadUsers } from "../Controllers/User.controllers.js";


const router = Router();

router.post("/create-user", CreateUser)
router.post("/delete-user", DeleteUser)
router.get('/readUsers', ReadUsers);
router.post('/readOwnData', ReadOwnData);


export default router;