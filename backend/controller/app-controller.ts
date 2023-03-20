import express from 'express'
import auth from '../auth'
import App from '../models/app-model'
import DataSource from '../models/datasource-model'
import View from '../models/view-model'


const createApp = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        // check parameters
        const {name, roleM, published} = req.body;
        if (typeof(name) != "string" || name === "" || 
            typeof(roleM) != "string" || roleM === "" || typeof(published) != "boolean")
            return res.status(400).json({
                status: "Missing or wrong parameter"
            })
        // create and save app
        const newApp = new App({
            name: name,
            creator: loggedInUser.id,
            datasources: [],
            views: [],
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
        // get user info
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        // check parameters
        const appId = req.params.id;
        const {name, roleM, published} = req.body;
        if (typeof(name) != "string" || name === "" || typeof(roleM) != "string" || roleM === "" || typeof(published) != "boolean")
            return res.status(400).json({
                status: "Missing parameter"
            })
        // find app, update, and save
        const existingApp = await App.findOne({_id: appId});
        if (!existingApp)
            return res.status(401).json({
                status: "Fail to find App " + appId
            })
        existingApp.name = name;
        existingApp.roleM = roleM
        existingApp.published = published
        existingApp.save()
        await res.send({status: "OK"});
    }
    catch (e) {
        console.log(e)
    }
}

const getApp = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        // check parameters
        const appId = req.params.id;
        if (typeof(appId) != "string") 
            return res.status(400).json({
                status: "Missing parameter"
            })
        // find App and return
        // TODO: check end user
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
        // get user info
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        // check parameters
        const appId = req.params.id;
        if (typeof(appId) != "string") 
            return res.status(400).json({
                status: "Missing parameter"
            })
        // find app and delete
        const existingApp = await App.findOneAndDelete({_id: appId});
        if (!existingApp)
            return res.status(401).json({
                status: "Fail to find App " + appId
            })
        // Delete datasources and views
        for (let key in existingApp.datasources) {
            try {
                DataSource.findOneAndDelete({_id: existingApp.datasources[key]})
            }
            catch (e) {
                console.error(e)
            }
        }
        for (let key in existingApp.views) {
            try {
                View.findOneAndDelete({_id: existingApp.views[key]})
            }
            catch (e) {
                console.error(e)
            }
        }
        await res.send({status: "OK", app: existingApp});
    }
    catch (e) {
        console.log(e)
    }
}

const getApps = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        // find apps and return
        // TODO: check end user
        const apps = await App.find({ $or:[{creator: loggedInUser.id}, {published: true}]});
        if (!Array.isArray(apps))
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
