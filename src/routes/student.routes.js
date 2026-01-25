import { Router } from "express";
import {createStudentPost} from "../controllers/student.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

router.route('/createpost').post(verifyJWT, createStudentPost)


export default router