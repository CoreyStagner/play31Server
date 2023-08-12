"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const validateEnv_1 = __importDefault(require("./util/validateEnv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const { EXPRESS_PORT, MONGO_CONNECTION_STRING } = validateEnv_1.default;
const portToUse = process.env.PORT || EXPRESS_PORT;
// Check Express Configurations
if (!portToUse || !app_1.default) {
    console.error("ERROR: Missing Express Configurations Values");
}
else {
    // Check Mongo and Mongoose configurations
    if (!MONGO_CONNECTION_STRING) {
        console.log("ERROR: Missing Mongoose Configuration Values");
    }
    else {
        // Connect to Database
        mongoose_1.default.connect(MONGO_CONNECTION_STRING).then(() => {
            console.log("Connection was successful to database");
            app_1.default.listen(portToUse, () => {
                console.log(`Server is running on port: ${portToUse}`);
            });
        }).catch((err) => {
            console.error(`ERROR: Unable to connect to database ${err}`);
        });
    }
}
