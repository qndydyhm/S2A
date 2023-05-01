import express from 'express'
import auth from '../auth'
import View from '../models/view-model'
import App from '../models/app-model'
import DataSource from '../models/datasource-model'
import googleWrapper from '../tools/google-wrapper'
import sheetParser from '../tools/sheet-parser'
import globalLogger, { getLogger } from '../tools/logger'
import accessControl from '../tools/access-control'
import User from '../models/user-model'

const updateRecord = async (req: express.Request, res: express.Response) => {
}

const deleteRecord = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        // TODO: check user is end user
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser) {
            globalLogger.info("Fail to find User")
            return res.status(401).json({
                status: "Fail to find User"
            })
        }
        const id: any = req.query.id
        if (!id) {
            globalLogger.info("missing view id")
            return res.status(400).send({
                status: "missing view id"
            })
        }
        const existingView = await View.findById(id);
        if (!existingView) {
            globalLogger.info("Fail to find view " + id)
            return res.status(400).json({
                status: "Fail to find view " + id
            })
        }
        const existingDS = await DataSource.findById(existingView._id);
        if (!existingDS) {
            globalLogger.info("Fail to find data source " + existingView._id)
            return res.status(400).json({
                status: "Fail to find data source " + existingView._id
            })
        }
        const existingApp = await App.findById(existingDS.owner);
        if (!existingApp) {
            globalLogger.info("Fail to find app " + existingDS.owner)
            return res.status(400).json({
                status: "Fail to find app " + existingDS.owner
            })
        }
        const creator = await User.findById(existingApp.creator);
        if (!creator) {
            globalLogger.info("Fail to find user " + existingApp.creator)
            return res.status(400).json({
                status: "Fail to find user " + existingApp.creator
            })
        }
        const sheet = await googleWrapper.getSheet(existingDS.URL, creator.rtoken, creator.atoken, creator.expire);
        if (!sheet || sheet.length === 0) {
            globalLogger.info("Fail to get sheet " + existingDS.URL)
            return res.status(400).json({
                status: "Fail to get sheet " + existingDS.URL
            })
        }
        if (!sheetParser.checkUniqueness(sheet[0])) {
            globalLogger.info("Columns are not unique: " + existingDS.URL)
            return res.status(400).json({
                status: "Columns are not unique: " + existingDS.URL
            })
        }
        try {
            const keyColumn = sheetParser.getValuesByColumn(sheet, req.query.key as string)
            keyColumn.splice(0, 1);
            if (!sheetParser.checkUniqueness(keyColumn)) {
                globalLogger.info("Key column is not unique")
                return res.status(400).json({
                    status: "Key column is not unique"
                })
            }
            let index = undefined;
            for (let i = 0; i < keyColumn.length; ++i) {
                if (keyColumn[i] === req.query.key) {
                    index = i
                    break
                }
            }
            if (index === undefined) {
                globalLogger.info("Fail to find key in " + existingDS.URL)
                return res.status(400).json({
                    status: "Fail to find key in " + existingDS.URL
                })
            }
            sheet.splice(index+1, 1)
            try {
                googleWrapper.updateSheet(existingDS.URL, sheet, creator.rtoken, creator.atoken, creator.expire)
                globalLogger.info(existingDS.URL + " delete " + req.query.key + " success")
                return res.status(200).json({
                    status: "OK"
                })
            }
            catch (e) {
                globalLogger.info(e)
                return res.status(400).json({
                    status: "Fail to updata sheet " + existingDS.URL 
                })
            }
        }
        catch (e) {
            globalLogger.info(e)
            return res.status(400).json({
                status: e
            })
        }
    }
    catch (e) {
        globalLogger.error(e)
    }

}


export default {
    updateRecord,
    deleteRecord
}
