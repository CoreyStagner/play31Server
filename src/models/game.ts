import { InferSchemaType, model, Schema } from "mongoose";

// Create Game Schema
const gameSchema = new Schema({
    title: { type: String, required: true },
    variation: { type: String },
    location: { type: String },
    commissioner: { type: Schema.Types.ObjectId, required: true},
    players: [{ type: Schema.Types.ObjectId }],
    completed: {type: Boolean, required: true, default: false},
    winners: [{ type: Schema.Types.ObjectId }],
}, {
    timestamps: true
});

// Create Game Type
type Game = InferSchemaType<typeof gameSchema>;

export default model<Game>("Game", gameSchema);