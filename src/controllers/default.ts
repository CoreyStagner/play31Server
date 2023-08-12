import { RequestHandler } from "express";
import GameModel from "../models/game";
// import { Schema } from "mongoose";

export const getRoot: RequestHandler = async (req, res, next) => {
  try {
    interface Iresponse {
      games: Array<{
        title: string;
        locations?: string | null;
        // commissioners?: Schema.Types.ObjectId;
      }> | null;
    }
    const response: Iresponse = {
      games: null,
      // locations: null,
      // commissioners: null,
    };
    const games = await GameModel.find().exec();
    if (!games) {
      response.games = null;
    } else {
      response.games = games;
    }
    // const locations = await GameModel.find().exec();
    // response.locations = locations;
    // const commissioners = await GameModel.find().exec();
    // response.commissioners = commissioners;
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
