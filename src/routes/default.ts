import express from "express";
import * as DefaultController from "../controllers/default";

const router = express.Router();

router.get("/", DefaultController.getRoot);

export default router;