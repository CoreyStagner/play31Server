import { RequestHandler } from "express";
import GameModel from "../models/game";
import UserModel from "../models/user";
// import { Schema } from "mongoose";

export const getRoot: RequestHandler = async (req, res, next) => {
  console.log('\n\n\n\n\n\n\n\n\n\n\n\n here \n\n\n\n\n\n\n\n\n\n\n\n')
  try {
    interface Iresponse {
      games: Array<{
        title: string;
        locations?: string | null;
        // commissioner?: Schema.Types.ObjectId;
      }> | null,
      users: Array<{
        username: string
      }> | null
    }
    const response: Iresponse = {
      games: null,
      users: null,
      // locations: null,
    };
    const games = await GameModel.find().exec();
    if (!games) {
      response.games = null;
    } else {
      response.games = games;
    }
    const users = await UserModel.find().exec();
    if (!users) {
      response.users = null;
    } else {
      response.users = users
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
