import jwt from "jsonwebtoken"
import express from 'express'
import User from '../models/user-model'
import globalLogger from "../tools/logger"


const getUser = async (req: express.Request) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const id = jwt.verify(token, process.env.JWT_SECRET!);
            if (id) {
                const user = await User.findById(id);
                if (user) {
                    return user
                }
            }
        }
        return undefined;
    }
    catch (e) {
        globalLogger.error(e);
    }
}

const signToken = (id: any) => {
    // encrypt _id
    return jwt.sign({
        _id: id
    }, process.env.JWT_SECRET!);
}

export default {
    getUser,
    signToken
}