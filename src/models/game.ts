import { InferSchemaType, model, Schema } from "mongoose";

// Create Game Schema
const gameSchema = new Schema({
    title: { type: String, required: true },
    location: { type: String },
    commissioner: { type: Schema.Types.ObjectId, required: true}
}, {
    timestamps: true
});

// Create Game Type
type Game = InferSchemaType<typeof gameSchema>;

export default model<Game>("Game", gameSchema);