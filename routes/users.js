import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {UserModel} from "../models/Users.js"

const router = express.Router();

router.post("/register", async (req, res) => {
    const {username, password} = req.body;

    const user = await UserModel.findOne({username});

    if(user){
        return res.status(400).json({
            message: "User already exist!",
        });
    }

    //hashing the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
        username, password: hashedPassword
    });

    await newUser.save();

    res.json({
        message: "User registered successfully",
    });
});

router.post("/login", async (req, res) => {
    const {username, password} = req.body;

    const user = await UserModel.findOne({username});
    
    if(!user){
        return res.status(400).json({
            message: "Username or Password is incorrect",
        });
    }

    // we cannot unhash the hashed password
    // so what to do to check if password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Username or password is Incorrect",
        });
    }

    const token = jwt.sign({id: user._id}, "secret");
    res.json({token, userID: user._id });
});

export {router as userRouter};

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      jwt.verify(authHeader, "secret", (err) => {
        if (err) {
          return res.sendStatus(403);
        }
        next();
      });
    } else {
      res.sendStatus(401);
    }
};