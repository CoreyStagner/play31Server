import express from "express";
import * as UserController from "../controllers/users";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();

// Get details about the currently authenticated user.
router.get("/", 
requiresAuth,UserController.getAuthenticatedUser);

router.get("/retrieve", UserController.getUsers);

router.post("/signup", UserController.signUp);

router.post("/login", UserController.login);

router.post("/logout", UserController.logout);

export default router;