import jwt from "jsonwebtoken"
import express from 'express'
import { User } from '../models/user-model'
import dotenv from 'dotenv'
dotenv.config();


const verify = (req: any, res: express.Response, next: express.NextFunction) => {
    try {
        // try to decrypt _id from cookie
        const token = req.cookies.token;
        if (!token) {
            req._id = '';
        }
        else {
            const verified: any = jwt.verify(token, process.env.JWT_SECRET!);
            req._id = verified._id;
        }
        next();
    } catch (err) {
        console.error(err);
        return res.redirect("/login");
    }
}

const signToken = (user: User) => {
    // encrypt _id
    return jwt.sign({
        _id: (user as any)._id
    }, process.env.JWT_SECRET!);
}

export default {
    verify,
    signToken
}