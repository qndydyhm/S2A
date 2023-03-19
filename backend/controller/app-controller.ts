import express from 'express'
import auth from '../auth'
import App from '../models/app-model'
import User from '../models/user-model'



const createApp = async (req: express.Request, res: express.Response) => {
    try {
        const userId = (req as any)._id;
        if (!userId)
            return res.status(401).json({
                status: "User not loggin"
            })
        const loggedInUser: any = await User.findOne({ _id: userId });
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        const {name, datasources, views, roleM, published} = req.body;
        if (!name || !datasources || !views || !roleM || !published) 
            return res.status(400).json({
                status: "Missing parameter"
            })
        const newApp = new App({
            name: name,
            creator: loggedInUser.id,
            datasources: datasources,
            views: views,
            roleM: roleM,
            published: published
        })
        const savedApp = await newApp.save();
        console.info("New App created: ", savedApp)
        await res.send({status: "OK", id: savedApp._id});
    }
    catch (e) {
        console.log(e)
    }
}

const updateApp = async (req: express.Request, res: express.Response) => {
    try {
        const userId = (req as any)._id;
        if (!userId)
            return res.status(401).json({
                status: "User not loggin"
            })
        const loggedInUser: any = await User.findOne({ _id: userId });
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        const appId = req.params.id;
        const {name, datasources, views, roleM, published} = req.body;
        if (!name || !datasources || !views || !roleM || !published || !appId) 
            return res.status(400).json({
                status: "Missing parameter"
            })
        const existingApp = await App.findOneAndUpdate({_id: appId},{
            name: name,
            creator: loggedInUser.id,
            datasources: datasources,
            views: views,
            roleM: roleM,
            published: published
        }, { new: true });
        if (!existingApp)
            return res.status(401).json({
                status: "Fail to find App " + appId
            })
        await res.send({status: "OK", app: existingApp});
    }
    catch (e) {
        console.log(e)
    }
}

const getApp = async (req: express.Request, res: express.Response) => {
    try {
        const userId = (req as any)._id;
        if (!userId)
            return res.status(401).json({
                status: "User not loggin"
            })
        const loggedInUser: any = await User.findOne({ _id: userId });
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        const appId = req.params.id;
        if (!appId) 
            return res.status(400).json({
                status: "Missing parameter"
            })
        const existingApp = await App.findOne({_id: appId});
        if (!existingApp)
            return res.status(401).json({
                status: "Fail to find App " + appId
            })
        await res.send({status: "OK", app: existingApp});
    }
    catch (e) {
        console.log(e)
    }
}

const deleteApp = async (req: express.Request, res: express.Response) => {
    try {
        const userId = (req as any)._id;
        if (!userId)
            return res.status(401).json({
                status: "User not loggin"
            })
        const loggedInUser: any = await User.findOne({ _id: userId });
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        const appId = req.params.id;
        if (!appId) 
            return res.status(400).json({
                status: "Missing parameter"
            })
        const existingApp = await App.findOneAndDelete({_id: appId});
        if (!existingApp)
            return res.status(401).json({
                status: "Fail to find App " + appId
            })
        await res.send({status: "OK", app: existingApp});
    }
    catch (e) {
        console.log(e)
    }
}

export default {
    createApp,
    updateApp,
    getApp,
    deleteApp
}
