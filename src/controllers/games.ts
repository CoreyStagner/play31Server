import { RequestHandler } from "express";
import GameModel from "../models/game";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

export const getGames: RequestHandler = async (req, res, next) => {
  const authenticatedUser = req.session.userId;
  try {
    assertIsDefined(authenticatedUser);
    const games = await GameModel.find().exec();
    res.status(200).json(games);
  } catch (error) {
    next(error);
  }
};

export const getGame: RequestHandler = async (req, res, next) => {
  const { gameId } = req.params;
  const authenticatedUser = req.session.userId;
  try {
    assertIsDefined(authenticatedUser);
    if (!mongoose.isValidObjectId(gameId)) {
      throw createHttpError(400, `An invalid game ID was provided: ${gameId}`);
    }

    const game = await GameModel.findById(gameId).exec();
    if (!game) {
      throw createHttpError(404, `Game was not found: ${gameId}`);
    }

    if (!game.commissioner.equals(authenticatedUser)) {
      throw createHttpError(401, "You are unable to access this note.");
    }

    res.status(200).json(game);
  } catch (error) {
    next;
  }
};

interface CreateGamePayload {
  title?: string;
  location?: string;
}

export const createGame: RequestHandler<
  unknown,
  unknown,
  CreateGamePayload,
  unknown
> = async (req, res, next) => {
  const { title, location } = req.body;
  const authenticatedUser = req.session.userId;
  try {
    assertIsDefined(authenticatedUser);
    if (!title) {
      throw createHttpError(
        400,
        `Bad Request: title is missing from the payload ${JSON.stringify(
          req.body,
          null,
          2
        )}`
      );
    }

    const newGame = await GameModel.create({
      title,
      location,
      commissioner: authenticatedUser,
    });
    res.status(201).json(newGame);
  } catch (error) {
    next(error);
  }
};

interface UpdateGameParams {
  gameId: string;
}

interface UpdateGamePayload {
  title?: string;
  location?: string;
}

export const updateGame: RequestHandler<
  UpdateGameParams,
  unknown,
  UpdateGamePayload,
  unknown
> = async (req, res, next) => {
  const { gameId } = req.params;
  const { title: updatedTitle, location: updatedLocation } = req.body;
  const authenticatedUser = req.session.userId;
  
  try {
    assertIsDefined(authenticatedUser);
    if (!updatedTitle || !updatedLocation) {
      throw createHttpError(
        400,
        `Payload does not contain the needed changes, requires { title: string, location: string }: ${JSON.stringify(
          req.body,
          null,
          2
        )}`
      );
    }
    if (!mongoose.isValidObjectId(gameId)) {
      throw createHttpError(400, `An invalid game ID was provided: ${gameId}`);
    }

    const game = await GameModel.findById(gameId).exec();
    if (!game) {
      throw createHttpError(404, `Game was not found: ${gameId}`);
    }

    if (!game.commissioner.equals(authenticatedUser)) {
      throw createHttpError(401, "You are unable to access this note.");
    }

    game.title = updatedTitle;
    game.location = updatedLocation;

    const updatedGame = await game.save();

    res.status(200).json(updatedGame);
  } catch (error) {
    next(error);
  }
};

interface DeleteGameParams {
  gameId: string;
}

interface DeleteGamePayload {
  title?: string;
  location?: string;
}

export const deleteGame: RequestHandler<
  DeleteGameParams,
  unknown,
  DeleteGamePayload,
  unknown
> = async (req, res, next) => {
  const { gameId } = req.params;

   const authenticatedUser = req.session.userId;
  
  try {
    assertIsDefined(authenticatedUser);
    if (!mongoose.isValidObjectId(gameId)) {
      throw createHttpError(400, `An invalid game ID was provided: ${gameId}`);
    }

    const game = await GameModel.findById(gameId).exec();

    if (!game) {
      throw createHttpError(404, `Game was not found: ${gameId}`);
    }

    if (!game.commissioner.equals(authenticatedUser)) {
      throw createHttpError(401, "You are unable to access this note.");
    }
    
    await GameModel.findByIdAndDelete(gameId);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
