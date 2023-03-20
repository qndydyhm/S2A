import express from 'express'
import auth from '../auth'
import User from '../models/user-model'
import googleWrapper from '../tools/google-wrapper'


const loginUser = async (req: express.Request, res: express.Response) => {
    return res.redirect(googleWrapper.getAuthUrl());
}

const logoutUser = async (req: express.Request, res: express.Response) => {
    // return empty cookies
    return await res.cookie("token", '', {
        httpOnly: true,
        secure: false, // TODO !!! temp solution! change to true after setting up https
        sameSite: "none"
    }).status(200).send({
        message: "Bye",
        status: "OK"
    })
}

const getLoggedIn = async (req: any, res: express.Response) => {
    try {
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser) {
            return res.status(200).json({
                status: "OK",
                loggedIn: false
            });
        }
        return res.status(200).json({
            status: "OK",
            loggedIn: true,
            user: {
                name: loggedInUser.name,
                email: loggedInUser.email,
                profile: loggedInUser.profile
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

const googleCallback = async (req: express.Request, res: express.Response) => {
    try {
        // extract code from query
        const code: any = req.query.code
        if (!code) return res.status(400).send({
            status: "missing token"
        })
        const tokens = await googleWrapper.getToken(code);
        if (!tokens.access_token) {
            return res.status(400).send({
                status: "Fail to get access token"
            })
        }

        // get user info
        const info = await googleWrapper.getUserInfo(tokens);
        if (!info || !info.name || !info.email || !info.picture || !info.id) {
            return res.status(400).send({
                status: "Fail to access user info"
            })
        }

        // detect whether the user exists
        let existingUser = await User.findOne({ id: info.id });
        if (!tokens.refresh_token && !existingUser) {
            return res.status(400).send({
                status: "Fail to get refresh token and cannot find user from database"
            })
        }
        const getToken = async () => {
            if (existingUser) {
                // if so, update and return
                existingUser.name = info.name as string;
                existingUser.email = info.email as string;
                existingUser.profile = info.picture as string;
                existingUser.id = info.id;
                existingUser.rtoken = tokens.refresh_token || existingUser.rtoken;
                existingUser.atoken = tokens.access_token as string;
                existingUser.expire = tokens.expiry_date as number;
                await existingUser.save()
                console.info("Existing user login: ", existingUser)
                return auth.signToken(existingUser._id);
            }
            else {
                // else create a new user
                const newUser = new User({
                    name: info.name,
                    email: info.email,
                    profile: info.picture,
                    id: info.id,
                    rtoken: tokens.refresh_token,
                    atoken: tokens.access_token,
                    expire: tokens.expiry_date
                });
                const savedUser = await newUser.save();
                console.info("New user login: ", savedUser)
                return auth.signToken(savedUser._id);
            }
        }
        const cookie = await getToken();
        await res.cookie("token", cookie, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).redirect('/');

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

export default {
    loginUser,
    logoutUser,
    getLoggedIn,
    googleCallback
}
