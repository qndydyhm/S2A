import express from 'express'
import auth from '../auth'
import DataSource from '../models/datasource-model'
import App from '../models/app-model'
import User from '../models/user-model'
import SheetParser from '../tools/sheet-parser'
import googleWrapper from '../tools/google-wrapper'
import globalLogger, { getLogger } from '../tools/logger'


const createDS = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        // TODO: check user is developer
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser){
            globalLogger.info("User not loggin or cookie expired");
            return res.status(401).json({
                status: "Fail to find User"
            })
        }
        // check parameters
        const { name, URL, sheetindex, key, columns, owner } = req.body;
        if (typeof (name) != "string" || name === "" || typeof (URL) != "string" || URL === "" ||
            typeof (sheetindex) != "number" || typeof (key) != "string" || key === "" ||
            !Array.isArray(columns) || typeof (owner) != "string" || owner === ""){
            globalLogger.info("Missing or wrong parameters when creating data source" + {name, URL, sheetindex, key, columns, owner})
            return res.status(400).json({
                status: "Missing parameter"
            })
        }
        if (!SheetParser.sheetUrlParser(URL)){
            globalLogger.info("Fail to parse data source sheet" + URL)
            return res.status(400).json({
                status: "Data source URL must in the form of https://docs.google.com/spreadsheets/d/spreadsheetId/edit#gid=sheetId"
            })
        }
        const existingApp = await App.findOne({ _id: owner });
        if (!existingApp){
            globalLogger.info("Fail to find app " + owner)
            return res.status(400).json({
                status: "Fail to find app " + owner
            })
        }

        const appLogger = getLogger(existingApp._id.toString());

        // check if the creator can access data source URL
        const creator = await User.findOne({ id: existingApp.creator })
        if (!creator){
            appLogger.info("Fail to find app creator " + existingApp.creator)
            return res.status(400).json({
                status: "Fail to find app creator " + existingApp.creator
            })
        }

        const sheet = await googleWrapper.getSheet(URL, creator.rtoken, creator.atoken, creator.expire)
        if (!sheet){
            appLogger.info("Fail to access " + URL + " with " + creator.email + "'s credential")
            return res.status(400).json({
                status: "Fail to access " + URL + " with " + creator.email + "'s credential"
            })
        }

        // check columns
        let newColumn = []
        let hasLabel: boolean = false
        for (let key in columns) {
            const column = columns[key]
            if (typeof (column) != "object" || typeof (column.name) != "string" || typeof (column.initvalue) != "string" ||
                typeof (column.label) != "boolean" || typeof (column.reference) != "string" ||
                (column.type != TYPE.BOOLEAN && column.type != TYPE.NUMBER && column.type != TYPE.TEXT && column.type != TYPE.URL)) {
                appLogger.info("Column attributes have wrong type "+ JSON.stringify(column))
                return res.status(400).json({
                    status: "Wrong column " + JSON.stringify(column)
                })
            }
            newColumn.push({
                name: column.name,
                initvalue: column.initvalue,
                label: column.label,
                reference: column.reference,
                type: column.type
            })
            if (column.label) {
                if (hasLabel){
                    appLogger.info("More than one column has label")
                    return res.status(400).json({
                        status: "At most one column label is true"
                    })
                }
                hasLabel = true
            }
        }
        // create and save datasource
        const newDS = new DataSource({
            name: name,
            URL: URL,
            sheetindex: sheetindex,
            key: key,
            columns: newColumn,
            owner: owner
        })
        const savedDS = await newDS.save();
        existingApp.datasources.push(savedDS._id.toString());
        existingApp.save();
        appLogger.info("New Datasource created: ", savedDS)
        await res.send({ status: "OK", id: savedDS._id });
    }
    catch (e) {
        globalLogger.error(e)
    }
}

const updateDS = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        // TODO: check user is developer
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser){
            globalLogger.info("User not loggin or cookie expired");
            return res.status(401).json({
                status: "Fail to find User"
            })
        }
        // check parameters
        const dsId = req.params.id;
        const { name, URL, sheetindex, key, columns } = req.body;
        if (!dsId || typeof (name) != "string" || name === "" || typeof (URL) != "string" || URL === "" ||
            typeof (sheetindex) != "number" || typeof (key) != "string" || key === "" || !Array.isArray(columns)){
                globalLogger.info("Missing or wrong parameters when updating data source" + {name, URL, sheetindex, key, columns})
                return res.status(400).json({
                    status: "Missing parameter"
                })
            }
        if (!SheetParser.sheetUrlParser(URL)){
            globalLogger.info("Fail to parse data source sheet" + URL)
            return res.status(400).json({
                status: "Data source URL must in the form of https://docs.google.com/spreadsheets/d/spreadsheetId/edit#gid=sheetId"
            })
        }
        // check columns
        let newColumn = []
        let hasLabel: boolean = false
        for (let key in columns) {
            const column = columns[key]
            if (typeof (column) != "object" || typeof (column.name) != "string" || typeof (column.initvalue) != "string" ||
                typeof (column.label) != "boolean" || typeof (column.reference) != "string" ||
                (column.type != TYPE.BOOLEAN && column.type != TYPE.NUMBER && column.type != TYPE.TEXT && column.type != TYPE.URL)) {
                globalLogger.info("Column attributes have wrong type "+ JSON.stringify(column))
                return res.status(400).json({
                    status: "Wrong column " + JSON.stringify(column)
                })
            }
            newColumn.push({
                name: column.name,
                initvalue: column.initvalue,
                label: column.label,
                reference: column.reference,
                type: column.type
            })
            if (column.label) {
                if (hasLabel){
                    globalLogger.info("More than one column has label")
                    return res.status(400).json({
                        status: "At most one column lable is true"
                    })
                }
                hasLabel = true
            }
        }
        // find datasource and the app owns it
        const existingDS = await DataSource.findOne({ _id: dsId });
        if (!existingDS){
            globalLogger.info("Fail to find Datasource " + dsId)
            return res.status(400).json({
                status: "Fail to find Datasource " + dsId
            })
        }
        const existingApp = await App.findOne({ _id: existingDS.owner });
        if (!existingApp){
            globalLogger.info("Fail to find app " + existingDS.owner)
            return res.status(400).json({
                status: "Fail to find App " + existingDS.owner
            })
        }
        // check if the creator can access data source URL
        const appLogger = getLogger(existingApp._id.toString());
        const creator = await User.findOne({ id: existingApp.creator })
        if (!creator){
            appLogger.info("Fail to find app creator " + existingApp.creator)
            return res.status(400).json({
                status: "Fail to find app creator " + existingApp.creator
            })
        }
        const sheet = googleWrapper.getSheet(URL, creator.rtoken, creator.atoken, creator.expire)
        if (!sheet){
            appLogger.info("Fail to access " + URL + " with " + creator.email + "'s credential")
            return res.status(400).json({
                status: "Fail to access " + URL + " with " + creator.email + "'s credential"
            })
        }
        // update datasources
        existingDS.name = name
        existingDS.URL = URL
        existingDS.sheetindex = sheetindex
        existingDS.key = key
        existingDS.columns = newColumn
        await existingDS.save()
        appLogger.info("Datasource updated: ", existingDS)
        await res.send({ status: "OK" });
    }
    catch (e) {
        globalLogger.error(e)
    }
}

const getDS = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        // TODO: check user is end user
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser){
            globalLogger.info("User not loggin or cookie expired");
            return res.status(401).json({
                status: "Fail to find User"
            })
        }
        // check parameters
        const dsId = req.params.id;
        if (!dsId){
            globalLogger.info("Missing or wrong id when retrieving data source ")
            return res.status(400).json({
                status: "Missing parameter"
            })
        }
        // find and return datasource
        const existingDS = await DataSource.findOne({ _id: dsId });
        if (!existingDS){
            globalLogger.info("Fail to find Datasource " + dsId)
            return res.status(400).json({
                status: "Fail to find DataSource " + dsId
            })
        }
        await res.send({ status: "OK", datasource: existingDS });
    }
    catch (e) {
        globalLogger.error(e)
    }
}

const deleteDS = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        // TODO: check user is developer
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser){
            globalLogger.info("User not loggin or cookie expired");
            return res.status(401).json({
                status: "Fail to find User"
            })
        }
        // check parameters
        const dsId = req.params.id;
        if (!dsId){
            globalLogger.info("Missing or wrong id when retrieving data source ")
            return res.status(400).json({
                status: "Missing parameter"
            })
        }
        // find and delete datasource
        const existingDS = await DataSource.findOneAndDelete({ _id: dsId });
        if (!existingDS){
            globalLogger.info("Fail to find Datasource " + dsId)
            return res.status(400).json({
                status: "Fail to find DataSource " + dsId
            })
        }
        // find its owner and drop it from data source list
        try {
            const owner = await App.findById(existingDS.owner)
            if (!owner){
                globalLogger.info("Fail to owner " + existingDS.owner)
                return res.status(400).json({
                    status: "Fail to owner " + existingDS.owner
                })
            }
            const appLogger = getLogger(owner._id.toString());
            owner.datasources = owner.datasources.filter((a) => { return a != dsId })
            appLogger.info("Datasource deleted: ", existingDS)
            owner.save()
        }
        catch (e) {
            globalLogger.error(e)
        }
        await res.send({ status: "OK", datasource: existingDS });
    }
    catch (e) {
        globalLogger.error(e)
    }
}

enum TYPE {
    BOOLEAN = "Boolean",
    NUMBER = "Number",
    TEXT = "Text",
    URL = "URL"
}

export default {
    createDS,
    updateDS,
    getDS,
    deleteDS
}
