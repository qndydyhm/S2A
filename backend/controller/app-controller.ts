import express from 'express'
import auth from '../auth'
import App from '../models/app-model'
import DataSource from '../models/datasource-model'
import View from '../models/view-model'
import User from '../models/user-model'
import GlobalDevelopers from '../tools/global-developer'
import SheetParser from '../tools/sheet-parser'
import googleWrapper from '../tools/google-wrapper'
import globalLogger, { getLogger } from '../tools/logger'


const createApp = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser) {
            globalLogger.info("User not loggin or cookie expired")
            return res.status(401).json({
                status: "Fail to find User"
            })
        }
        if (!GlobalDevelopers.isInGlobalDevelopers(loggedInUser.email)) {
            globalLogger.info("Unauthorized user tried to create App")
            return res.status(401).json({
                status: "Must be in the global developer list to create App"
            })
        }
        // check parameters
        const { name, roleM, published } = req.body;
        if (typeof (name) != "string" || name === "" ||
            typeof (roleM) != "string" || roleM === "" || typeof (published) != "boolean") {
            globalLogger.info("Missing or wrong parameters when creating App" + { name, roleM, published })
            return res.status(400).json({
                status: "Missing or wrong parameter"
            })
        }
        if (!SheetParser.sheetUrlParser(roleM)) {
            globalLogger.info("Fail to parse role membership sheet" + roleM)
            return res.status(400).json({
                status: "Role membership sheet must in the form of https://docs.google.com/spreadsheets/d/spreadsheetId/edit#gid=sheetId"
            })
        }

        // check if the creator can access role membership sheet
        const sheet = await googleWrapper.getSheet(roleM, loggedInUser.rtoken, loggedInUser.atoken, loggedInUser.expire)
        if (!sheet) {
            globalLogger.info("Fail to access " + roleM + " with " + loggedInUser.email + "'s credential")
            return res.status(400).json({
                status: "Fail to access " + roleM + " with " + loggedInUser.email + "'s credential"
            })
        }
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
        const appLogger = getLogger(savedApp._id.toString())
        appLogger.info("New App created: ", savedApp)
        await res.send({ status: "OK", id: savedApp._id });
    }
    catch (e) {
        globalLogger.error(e)
    }
}

const updateApp = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser){
            globalLogger.info("User not loggin or cookie expired")
            return res.status(401).json({
                status: "Fail to find User"
            })
        }
        // check parameters
        const appId = req.params.id;
        const { name, roleM, published } = req.body;
        if (typeof (name) != "string" || name === "" || typeof (roleM) != "string" || roleM === "" || typeof (published) != "boolean"){
            globalLogger.info("Missing or wrong parameters when creating App" + { name, roleM, published })
            return res.status(400).json({
                status: "Missing parameter"
            })
        }
        if (!SheetParser.sheetUrlParser(roleM)){
            globalLogger.info("Fail to parse role membership sheet" + roleM)
            return res.status(400).json({
                status: "Role membership sheet must in the form of https://docs.google.com/spreadsheets/d/spreadsheetId/edit#gid=sheetId"
            })
        }
        // find app, update, and save
        const existingApp = await App.findOne({ _id: appId });
        if (!existingApp){
            globalLogger.info("Fail to find App "+appId)
            return res.status(400).json({
                status: "Fail to find App " + appId
            })
        }
        // check if the creator can access role membership sheet
        const creator = await User.findOne({ id: existingApp.creator })
        if (!creator){
            globalLogger.info("Fail to find creator "+existingApp.creator)
            return res.status(400).json({
                status: "Fail to find creator " + existingApp.creator
            })
        }
        const sheet = googleWrapper.getSheet(roleM, creator.rtoken, creator.atoken, creator.expire)
        if (!sheet){
            globalLogger.info("Fail to access " + roleM + " with " + loggedInUser.email + "'s credential")
            return res.status(400).json({
                status: "Fail to access " + roleM + " with " + creator.email + "'s credential"
            })
        }
        existingApp.name = name;
        existingApp.roleM = roleM
        existingApp.published = published
        existingApp.save()
        const appLogger = getLogger(existingApp._id.toString())
        appLogger.info("App updated: ", existingApp)
        await res.send({ status: "OK" });
    }
    catch (e) {
        globalLogger.error(e)
    }
}

const getApp = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser){
            globalLogger.info("Fail to find User")
            return res.status(401).json({
                status: "Fail to find User"
            })
        }
        // check parameters
        const appId = req.params.id;
        if (typeof (appId) != "string"){
            globalLogger.info("Missing Parameter:appId is not String")
            return res.status(400).json({
                status: "Missing parameter"
            })
        }
        // find App and return
        // TODO: check end user
        const existingApp = await App.findOne({ _id: appId });
        if (!existingApp){
            globalLogger.info("Fail to find App "+appId)
            return res.status(400).json({
                status: "Fail to find App " + appId
            })
        }
        const datasources = [], views = []
        try {
            const creator = await User.findOne({ id: existingApp.creator })
            if (!creator) {
                globalLogger.info("Fail to find Creator " + existingApp.creator)
                return res.status(400).json({
                    status: "Fail to find Creator " + existingApp.creator
                })
            }
            existingApp.creator = creator.name
            for (let key in existingApp.datasources) {
                const datasource = await DataSource.findOne({ _id: existingApp.datasources[key] })
                if (!datasource){
                    globalLogger.info("Fail to find data source " + existingApp.datasources[key])
                    return res.status(400).json({
                        status: "Fail to find data source " + existingApp.datasources[key]
                    })
                }
                datasources.push({ id: datasource._id, name: datasource.name })
            }

            for (let key in existingApp.views) {
                const view = await View.findOne({ _id: existingApp.views[key] })
                if (!view){
                    globalLogger.info("Fail to find view " + existingApp.views[key])
                    return res.status(400).json({
                        status: "Fail to find view " + existingApp.views[key]
                    })
                }
                views.push({ id: view._id, name: view.name })
            }
        }
        catch (e) {
            globalLogger.error(e)
        }
        await res.send({
            status: "OK",
            app: {
                _id: existingApp._id,
                name: existingApp.name,
                creator: existingApp.creator,
                datasources: datasources,
                views: views,
                roleM: existingApp.roleM,
                published: existingApp.published
            }
        });
        const appLogger = getLogger(existingApp._id.toString())
        appLogger.info("App retrieved: ", existingApp)
        
    }
    catch (e) {
        globalLogger.error(e)
    }
}

const deleteApp = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser){
            globalLogger.info("Fail to find User")
            return res.status(401).json({
                status: "Fail to find User"
            })
        }
        // check parameters
        const appId = req.params.id;
        if (typeof (appId) != "string"){
            globalLogger.info("Missing parameter")
            return res.status(400).json({
                status: "Missing parameter"
            })
        }
        // find app and delete
        const existingApp = await App.findOneAndDelete({ _id: appId });
        if (!existingApp){
            globalLogger.info("Fail to find App " + appId)
            return res.status(401).json({
                status: "Fail to find App " + appId
            })
        }
        // Delete datasources and views
        for (let key in existingApp.datasources) {
            try {
                DataSource.findOneAndDelete({ _id: existingApp.datasources[key] })
            }
            catch (e) {
                globalLogger.error(e)
            }
        }
        for (let key in existingApp.views) {
            try {
                View.findOneAndDelete({ _id: existingApp.views[key] })
            }
            catch (e) {
                globalLogger.error(e)
            }
        }
        const appLogger = getLogger(existingApp._id.toString())
        appLogger.info("App deleted: ", existingApp)
        await res.send({ status: "OK", app: existingApp });
    }
    catch (e) {
        globalLogger.error(e)
    }
}

const getApps = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser){
            globalLogger.info("Fail to find User")
            return res.status(400).json({
                status: "Fail to find User"
            })
        }
        // find apps and return
        // TODO: check end user
        const apps = await App.find({ $or: [{ creator: loggedInUser.id }, { published: true }] });
        if (!Array.isArray(apps)){
            globalLogger.info("Apps not found")
            return res.status(400).json({
                status: "Apps not found"
            })
        }
        let applist = []
        for (let key in apps) {
            let app = apps[key];
            let pair = {
                id: app._id,
                name: app.name
            };
            applist.push(pair)
        }
        await res.send({ status: "OK", apps: applist });
    }
    catch (e) {
        globalLogger.error(e)
    }
}

export default {
    createApp,
    updateApp,
    getApp,
    getApps,
    deleteApp
}
