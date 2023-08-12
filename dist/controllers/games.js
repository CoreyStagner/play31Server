"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGame = exports.updateGame = exports.createGame = exports.getGame = exports.getGames = void 0;
const game_1 = __importDefault(require("../models/game"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = __importDefault(require("mongoose"));
const assertIsDefined_1 = require("../util/assertIsDefined");
const getGames = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedUser = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUser);
        const games = yield game_1.default.find().exec();
        res.status(200).json(games);
    }
    catch (error) {
        next(error);
    }
});
exports.getGames = getGames;
const getGame = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { gameId } = req.params;
    const authenticatedUser = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUser);
        if (!mongoose_1.default.isValidObjectId(gameId)) {
            throw (0, http_errors_1.default)(400, `An invalid game ID was provided: ${gameId}`);
        }
        const game = yield game_1.default.findById(gameId).exec();
        if (!game) {
            throw (0, http_errors_1.default)(404, `Game was not found: ${gameId}`);
        }
        if (!game.commissioner.equals(authenticatedUser)) {
            throw (0, http_errors_1.default)(401, "You are unable to access this note.");
        }
        res.status(200).json(game);
    }
    catch (error) {
        next;
    }
});
exports.getGame = getGame;
const createGame = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, location } = req.body;
    const authenticatedUser = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUser);
        if (!title) {
            throw (0, http_errors_1.default)(400, `Bad Request: title is missing from the payload ${JSON.stringify(req.body, null, 2)}`);
        }
        const newGame = yield game_1.default.create({
            title,
            location,
            commissioner: authenticatedUser,
        });
        res.status(201).json(newGame);
    }
    catch (error) {
        next(error);
    }
});
exports.createGame = createGame;
const updateGame = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { gameId } = req.params;
    const { title: updatedTitle, location: updatedLocation } = req.body;
    const authenticatedUser = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUser);
        if (!updatedTitle || !updatedLocation) {
            throw (0, http_errors_1.default)(400, `Payload does not contain the needed changes, requires { title: string, location: string }: ${JSON.stringify(req.body, null, 2)}`);
        }
        if (!mongoose_1.default.isValidObjectId(gameId)) {
            throw (0, http_errors_1.default)(400, `An invalid game ID was provided: ${gameId}`);
        }
        const game = yield game_1.default.findById(gameId).exec();
        if (!game) {
            throw (0, http_errors_1.default)(404, `Game was not found: ${gameId}`);
        }
        if (!game.commissioner.equals(authenticatedUser)) {
            throw (0, http_errors_1.default)(401, "You are unable to access this note.");
        }
        game.title = updatedTitle;
        game.location = updatedLocation;
        const updatedGame = yield game.save();
        res.status(200).json(updatedGame);
    }
    catch (error) {
        next(error);
    }
});
exports.updateGame = updateGame;
const deleteGame = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { gameId } = req.params;
    const authenticatedUser = req.session.userId;
    try {
        (0, assertIsDefined_1.assertIsDefined)(authenticatedUser);
        if (!mongoose_1.default.isValidObjectId(gameId)) {
            throw (0, http_errors_1.default)(400, `An invalid game ID was provided: ${gameId}`);
        }
        const game = yield game_1.default.findById(gameId).exec();
        if (!game) {
            throw (0, http_errors_1.default)(404, `Game was not found: ${gameId}`);
        }
        if (!game.commissioner.equals(authenticatedUser)) {
            throw (0, http_errors_1.default)(401, "You are unable to access this note.");
        }
        yield game_1.default.findByIdAndDelete(gameId);
        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteGame = deleteGame;
