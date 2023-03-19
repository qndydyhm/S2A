import express from 'express'
import auth from '../auth'
import App from '../models/app-model'
import DataSource from '../models/datasource-model'


const createApp = async (req: express.Request, res: express.Response) => {
    try {
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        const {name, roleM, published} = req.body;
        if (typeof(name) != "string" || name === "" || 
            typeof(roleM) != "string" || roleM === "" || typeof(published) != "boolean")
            return res.status(400).json({
                status: "Missing or wrong parameter"
            })
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
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        const appId = req.params.id;
        const {name, datasources, views, roleM, published} = req.body;
        if (typeof(name) != "string" || name === "" || !Array.isArray(datasources) || !Array.isArray(views) || 
            typeof(roleM) != "string" || roleM === "" || typeof(published) != "boolean")
            return res.status(400).json({
                status: "Missing parameter"
            })
        for (let key in datasources) {
            if (typeof(datasources[key]) != "string") {
                return res.status(400).json({
                    status: "Datasources must be a list of string(datasources id)"
                })
            }
            try {
                const existingDS = await DataSource.findById(datasources[key]);
                if (!existingDS) {
                    return res.status(400).json({
                        status: "Fail to find Datasource " + datasources[key]
                    })
                }
                if (existingDS.owner != appId) {
                    return res.status(400).json({
                        status: "Missmatch app id " + appId + " and datasource owner " + existingDS.owner
                    })
                }
            }
            catch (e) {
                return res.status(400).json({
                    status: "Fail to find Datasource id " + datasources[key]
                })
            }
        }
        for (let key in views) {
            if (typeof(views[key]) != "string") {
                return res.status(400).json({
                    status: "Views must be a list of string(views id)"
                })
            }
            // TODO check view owner
        }
        const existingApp = await App.findOne({_id: appId});
        if (!existingApp)
            return res.status(401).json({
                status: "Fail to find App " + appId
            })
        existingApp.name = name;
        existingApp.datasources = datasources as [string]; //TODO remove deleted datasources
        existingApp.views = views as [string]
        existingApp.roleM = roleM
        existingApp.published = published


        await res.send({status: "OK", app: existingApp});
    }
    catch (e) {
        console.log(e)
    }
}

const getApp = async (req: express.Request, res: express.Response) => {
    try {
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        const appId = req.params.id;
        if (typeof(appId) != "string") 
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
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        const appId = req.params.id;
        if (typeof(appId) != "string") 
            return res.status(400).json({
                status: "Missing parameter"
            })
        const existingApp = await App.findOneAndDelete({_id: appId}); //TODO remove deleted datasources
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
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
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
