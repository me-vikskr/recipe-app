import express from "express";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try{
        const response = await RecipeModel.find({});
        res.status(200).json(response);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//create a recipe
router.post("/", verifyToken, async (req, res) => {
    const newRecipe = new RecipeModel(req.body);

    try{
        const response = await newRecipe.save();
        res.status(201).json(response);
    }
    catch(err){
        res.status(500).json(err);
    }
});

//save a recipe
router.put("/", verifyToken, async (req, res) => {
    try{
        const recipe = await RecipeModel.findById(req.body.recipeID);
        const user = await UserModel.findById(req.body.userID);
        user.savedRecipes.push(recipe);
        await user.save();

        res.status(201).json({savedRecipes: user.savedRecipes});
    }
    catch(err){
        res.status(500).json(err);
    }
});

//Get ids of saved recipes
router.get("/savedRecipes/ids/:userID", async (req, res) => {
    try{
        const user = await UserModel.findById(req.params.userID);
        res.status(201).json({savedRecipes: user?.savedRecipes});
    }
    catch(err){
        res.status(500).json(err);
    }
});

//get saved recipes
router.get("/savedRecipes/:userID", async (req, res) => {
    try{
        const user = await UserModel.findById(req.params.userID);
        const savedRecipes = await RecipeModel.find({
            _id: { $in: user.savedRecipes },
        });

        res.status(201).json({savedRecipes});
    }
    catch(err){
        res.status(500).json(err);
    }
});

export {router as recipeRouter};
