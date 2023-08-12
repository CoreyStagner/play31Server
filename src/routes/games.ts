import express from "express";
import * as GamesController from "../controllers/games";

const router = express.Router();

router.get("/", GamesController.getGames);

router.get("/:gameId", GamesController.getGame);

router.post("/", GamesController.createGame);

router.patch("/:gameId", GamesController.updateGame);

router.delete("/:gameId", GamesController.deleteGame);

export default router;