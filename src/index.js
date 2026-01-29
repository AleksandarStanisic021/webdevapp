import dotenv from "dotenv";
import {app} from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./.env"
});
console.log(process.env.PORT);

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}..`);
    });
}).catch((err) => {
    console.log(err);
});

