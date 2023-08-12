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
exports.logout = exports.login = exports.signUp = exports.getAuthenticatedUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_errors_1 = __importDefault(require("http-errors"));
const user_1 = __importDefault(require("../models/user"));
const auth_1 = require("../middleware/auth");
const getAuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        auth_1.requiresAuth;
        const user = yield user_1.default.findById(req.session.userId)
            .select("+email")
            .exec();
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getAuthenticatedUser = getAuthenticatedUser;
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password: passwordRaw } = req.body;
    try {
        if (!username || !email || !passwordRaw) {
            throw (0, http_errors_1.default)(400, "Parameters are missing");
        }
        // Check to make sure that the username is unique
        const existingUserName = yield user_1.default.findOne({
            username: username,
        }).exec();
        if (existingUserName) {
            throw (0, http_errors_1.default)(409, "Username already exists. Please choose a different one or log in instead.");
        }
        // Check to make sure that the email is unique
        const existingEmail = yield user_1.default.findOne({ email: email }).exec();
        if (existingEmail) {
            throw (0, http_errors_1.default)(409, "email already exists. Please choose a different one or log in instead.");
        }
        // Hash Password
        const passwordHashed = yield bcrypt_1.default.hash(passwordRaw, 10);
        const newUser = yield user_1.default.create({
            username,
            email,
            password: passwordHashed,
        });
        req.session.userId = newUser._id;
        res.status(201).json(newUser);
    }
    catch (error) {
        next(error);
    }
});
exports.signUp = signUp;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            throw (0, http_errors_1.default)(400, "Username or Password is missing");
        }
        const user = yield user_1.default.findOne({ username: username })
            .select("+password +email")
            .exec();
        if (!user) {
            throw (0, http_errors_1.default)(401, "Invalid credentials");
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            throw (0, http_errors_1.default)(401, "Invalid credentials");
        }
        req.session.userId = user._id;
        res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const logout = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            next(error);
        }
        else {
            res.sendStatus(200);
        }
    });
};
exports.logout = logout;
