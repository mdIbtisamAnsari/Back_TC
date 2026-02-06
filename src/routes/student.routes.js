import { Router } from "express";
import {createStudentPost, getStudentPosts, deletePost} from "../controllers/student.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

router.route('/createpost').post(verifyJWT, createStudentPost)
router.route('/getposts').get(verifyJWT, getStudentPosts)
router.route('/posts/:postID').delete(verifyJWT, deletePost)


export default router