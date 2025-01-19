import express from "express";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import todoRoute from "../backend/routes/todo.routes.js";
import userRoute from "../backend/routes/user.route.js";
import cookieParser from "cookie-parser";
const app = express();

dotenv.config();

const PORT = process.env.PORT || 4002;
const DB_URI = process.env.MONGODB_URI;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"], //add other headers
  })
);

// Database connection
try {
  await mongoose.connect(DB_URI);
  console.log("connected to mongodb");
} catch (error) {
  console.log(error);
}

// routes defined for todos

app.use("/todo", todoRoute); //routes for todos
app.use("/user", userRoute); //routes for user
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
