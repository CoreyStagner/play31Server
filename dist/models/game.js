"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Create Game Schema
const gameSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    location: { type: String },
    commissioner: { type: mongoose_1.Schema.Types.ObjectId, required: true }
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)("Game", gameSchema);
