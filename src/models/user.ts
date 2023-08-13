import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, select: false, unique: true },
  password: { type: String, required: true, select: false },
  friends: { type: Schema.Types.ObjectId, ref: "User" },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
