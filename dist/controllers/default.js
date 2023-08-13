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
exports.getRoot = void 0;
const game_1 = __importDefault(require("../models/game"));
const user_1 = __importDefault(require("../models/user"));
// import { Schema } from "mongoose";
const getRoot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\n\n\n\n\n\n\n\n\n\n\n\n here \n\n\n\n\n\n\n\n\n\n\n\n');
    try {
        const response = {
            games: null,
            users: null,
            // locations: null,
        };
        const games = yield game_1.default.find().exec();
        if (!games) {
            response.games = null;
        }
        else {
            response.games = games;
        }
        const users = yield user_1.default.find().exec();
        if (!users) {
            response.users = null;
        }
        else {
            response.users = users;
        }
        // const locations = await GameModel.find().exec();
        // response.locations = locations;
        // const commissioners = await GameModel.find().exec();
        // response.commissioners = commissioners;
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.getRoot = getRoot;
