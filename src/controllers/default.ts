import { RequestHandler } from "express";
import GameModel from "../models/game";

export const getRoot: RequestHandler = async (req, res, next) => {
  try {
    const games = await GameModel.find().exec();
    res.status(200).json(games);
  } catch (error) {
    next(error);
  }
};
