import express from 'express'
import auth from '../auth'
import User from '../models/user-model'
import {
    google   // The top level object used to access services
} from 'googleapis';

import dotenv from 'dotenv'
dotenv.config();


const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.PROTOCOL + "://" + process.env.DOMAIN_NAME + "/auth/google-callback"
);

const scopes = [
    "email",
    "profile",
    "openid",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
];

const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    /** Pass in the scopes array defined above.
      * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    // include_granted_scopes: true
});

const loginUser = async (req: express.Request, res: express.Response) => {
    return res.redirect(authorizationUrl);
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
        auth.verify(req, res, async function () {
            console.log(req._id)
            if (!req._id) {
                return res.status(200).json({
                    status: "OK",
                    loggedIn: false
                });
            }
            const loggedInUser: any = await User.findOne({ _id: req._id });
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
        })
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
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });
        // get user info
        const info = await oauth2.userinfo.get();

        // detect whether the user exists
        let existingUser = await User.findOne({ id: info.data.id });
        if (existingUser) {
            // if so, update and return
            const savedUser: any = await User.findOneAndUpdate({ id: info.data.id }, {
                name: info.data.name,
                email: info.data.email,
                profile: info.data.picture,
                id: info.data.id,
                rtoken: tokens.refresh_token || (existingUser as any).refresh_token,
                atoken: tokens.access_token,
                expire: tokens.expiry_date
            }, {
                new: true
            });
            console.info("Existing user login: ", savedUser)
            const token = auth.signToken(savedUser);
            await res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            }).redirect('http://localhost');
        }
        else {
            // else create a new user
            const newUser = new User({
                name: info.data.name,
                email: info.data.email,
                profile: info.data.picture,
                id: info.data.id,
                rtoken: tokens.refresh_token,
                atoken: tokens.access_token,
                expire: tokens.expiry_date
            });
            const savedUser = await newUser.save();
            console.info("New user login: ", savedUser)
            const token = auth.signToken(savedUser);
            await res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            }).redirect('http://localhost');
        }
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
