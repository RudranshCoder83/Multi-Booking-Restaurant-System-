import { Router } from "express";
import { getMe, loginUser, registerUser } from "../controller/authController.js";

const authRouter = Router();

authRouter.post("/register", registerUser)
authRouter.post("/login", loginUser)
authRouter.post("/me", getMe)

export default authRouter