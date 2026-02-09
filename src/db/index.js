import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

/**
 * Connects to MongoDB database
 * @returns {Promise<mongoose.Connection>} MongoDB connection instance
 */
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected successfully to host: ${connectionInstance.connection.host}`);
        return connectionInstance;
    } catch (error) {

        console.log(`\n MongoDB connection error: ${error}`);
        process.exit(1);
    }
};

export default connectDB;
