import { Router } from "express";
import { loginUser } from "../controllers/user.controller.js";

const router = Router()

router.route('/register').post(loginUser)

export default router