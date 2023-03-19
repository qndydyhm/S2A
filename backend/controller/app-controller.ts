import express from 'express'
import auth from '../auth'
import App from '../models/app-model'



const createApp = async (req: express.Request, res: express.Response) => {
    try {
        const loggedInUser: any = await auth.getUser(req, res);
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
        const loggedInUser: any = await auth.getUser(req, res);
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
        const loggedInUser: any = await auth.getUser(req, res);
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
        const loggedInUser: any = await auth.getUser(req, res);
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

const getApps = async (req: express.Request, res: express.Response) => {
    try {
        const loggedInUser: any = await auth.getUser(req, res);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        const apps = await App.find({ $or:[{creator: loggedInUser.id}, {published: true}]});
        if (!apps)
            return res.json({
                status: "Apps not found"
            })
        let applist = []
        for (let key in apps) {
            let app = apps[key];
            let pair = {
                id: app._id,
                name: app.name
            };
            applist.push(pair)
        }
        await res.send({status: "OK", apps: applist});
    }
    catch (e) {
        console.log(e)
    }
}

export default {
    createApp,
    updateApp,
    getApp,
    getApps,
    deleteApp
}
