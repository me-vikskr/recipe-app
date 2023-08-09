import express from "express";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import { userRouter } from './routes/users.js';
import { recipeRouter } from "./routes/recipe.js"

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipeRouter);

dbConnect();

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server running on PORT: ${PORT}`)
});