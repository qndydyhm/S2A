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


const createView = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        // TODO: check user is developer
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser) {
            globalLogger.info("Fail to find User")
            return res.status(401).json({
                status: "Fail to find User"
            })
        }
        // check parameters
        const { name, table, columns, viewtype, allowedactions, roles, filter, userfilter, editfilter, editablecolumns, owner } = req.body;
        if (typeof (name) != "string" || name === "" || typeof (table) != "string" || table === "" ||
            !Array.isArray(columns) || typeof (viewtype) != "string" || viewtype === "" ||
            !Number.isInteger(allowedactions) || allowedactions < 0 ||
            allowedactions > 7 || !Array.isArray(roles) || typeof (owner) != "string" || owner == "") {
            globalLogger.info("Missing parameter")
            return res.status(400).json({
                status: "Missing parameter"
            })
        }
        const existingApp = await App.findOne({ _id: owner });
        if (!existingApp) {
            globalLogger.info("Fail to find app " + owner)
            return res.status(400).json({
                status: "Fail to find app " + owner
            })
        }
        // create and save datasource
        if (viewtype != TYPE.TABLE && viewtype != TYPE.DETAIL) {
            globalLogger.info('View type must be one of "table" or "detail"')
            return res.status(400).json({
                status: 'View type must be one of "table" or "detail"'
            })
        }
        const newView = new View({
            name: name,
            table: table,
            columns: columns,
            viewtype: viewtype,
            allowedactions: allowedactions,
            roles: roles,
            owner: owner
        })
        // TODO: check filters are valid columns
        if (viewtype == TYPE.TABLE) {
            if (filter) {
                if (typeof (filter) != "string") {
                    globalLogger.info('Filter must be a string')
                    return res.status(400).json({
                        status: 'Filter must be a string'
                    })
                }
                newView.filter = filter
            }
            if (userfilter) {
                if (typeof (userfilter) != "string") {
                    globalLogger.info('User filter must be a string')
                    return res.status(400).json({
                        status: 'User filter must be a string'
                    })
                }
                newView.userfilter = userfilter
            }
        }
        else if (viewtype == TYPE.DETAIL) {
            if (editfilter) {
                if (typeof (editfilter) != "string") {
                    globalLogger.info('Edit filter must be a string')
                    return res.status(400).json({
                        status: 'Edit filter must be a string'
                    })
                }
                newView.editfilter = editfilter
            }
            if (editablecolumns) {
                if (!Array.isArray(editablecolumns)) {
                    globalLogger.info("Editable columns must be an Array")
                    return res.status(400).json({
                        status: 'Editable columns must be an Array'
                    })
                }
                // TODO: check editable columns are valid
                for (let key in editablecolumns) {
                    if (typeof (editablecolumns[key]) != "string") {
                        globalLogger.info('Editable columns must be an Array of string')
                        return res.status(400).json({
                            status: 'Editable columns must be an Array of string'
                        })
                    }
                }
                newView.editablecolumns = editablecolumns as [string]
            }
        }
        const savedView = await newView.save();
        existingApp.views.push(savedView._id.toString())
        existingApp.save()
        const appLogger = getLogger(existingApp._id.toString())
        appLogger.info("New View Created: ", savedView)
        globalLogger.info("New View created: ", savedView)
        await res.send({ status: "OK", id: savedView._id });
    }
    catch (e) {
        globalLogger.error(e)
    }
}

const updateView = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        // TODO: check user is developer
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser) {
            globalLogger.info("Fail to find User")
            return res.status(401).json({
                status: "Fail to find User"
            })
        }
        // check parameters
        const viewId = req.params.id;
        const { name, table, columns, viewtype, allowedactions, roles, filter, userfilter, editfilter, editablecolumns } = req.body;
        if (!viewId || typeof (name) != "string" || name === "" || typeof (table) != "string" ||
            table === "" || !Array.isArray(columns) || typeof (viewtype) != "string" ||
            viewtype === "" || !Number.isInteger(allowedactions) || allowedactions < 0 ||
            allowedactions > 7 || !Array.isArray(roles)) {
            globalLogger.info("Missing parameter")
            return res.status(400).json({
                status: "Missing parameter"
            })
        }
        // TODO check owner, table, columns, roles is valid
        // create and save datasource
        if (viewtype !== TYPE.TABLE && viewtype !== TYPE.DETAIL) {
            globalLogger.info('View type must be one of "table" or "detail"')
            return res.status(400).json({
                status: 'View type must be one of "table" or "detail"'
            })
        }
        const existingView = await View.findOne({ _id: viewId })
        if (!existingView) {
            globalLogger.info('Fail to find view')
            return res.status(400).json({
                status: 'Fail to find view'
            })
        }
        // check if the creator can access role membership sheet
        const existingApp = await App.findOne({ _id: existingView.owner })
        if (!existingApp) {
            globalLogger.info("Fail to find App " + existingView.owner)
            return res.status(401).json({
                status: "Fail to find App " + existingView.owner
            })
        }
        const creator = await User.findOne({ id: existingApp.creator })
        if (!creator) {
            globalLogger.info("Fail to find creator " + existingApp.creator)
            return res.status(400).json({
                status: "Fail to find creator " + existingApp.creator
            })
        }
        // check if the user is in role membership list
        if (loggedInUser.id !== creator.id && !await accessControl.isInDeveloperList(loggedInUser.email, existingApp.roleM, creator.rtoken, creator.atoken, creator.expire, existingApp._id.toString())) {
            globalLogger.info("User " + loggedInUser.id + " is not in developer role of app " + existingApp._id)
            return res.status(400).json({
                status: "User " + loggedInUser.email + " is not in developer role of app " + existingApp._id
            })
        }



        existingView.name = name
        existingView.table = table
        existingView.columns = columns as [string]
        existingView.viewtype = viewtype
        existingView.allowedactions = allowedactions
        existingView.roles = roles as [string]
        // TODO: check filters are valid columns
        if (viewtype === TYPE.TABLE) {
            if (filter) {
                if (typeof (filter) != "string") {
                    globalLogger.info('Filter must be a string')
                    return res.status(400).json({
                        status: 'Filter must be a string'
                    })
                }
                existingView.filter = filter
            }
            else {
                existingView.filter = undefined
            }
            if (userfilter) {
                if (typeof (userfilter) != "string") {
                    globalLogger.info('User filter must be a string')
                    return res.status(400).json({
                        status: 'User filter must be a string'
                    })
                }
                existingView.userfilter = userfilter
            }
            else {
                existingView.userfilter = undefined
            }
        }
        else if (viewtype === TYPE.DETAIL) {
            if (editfilter) {
                if (typeof (editfilter) != "string") {
                    globalLogger.info('Edit filter must be a string')
                    return res.status(400).json({
                        status: 'Edit filter must be a string'
                    })
                }
                existingView.editfilter = editfilter
            }
            else {
                existingView.editfilter = undefined
            }
            if (editablecolumns) {
                if (!Array.isArray(editablecolumns)) {
                    globalLogger.info('Editable columns must be an Array')
                    return res.status(400).json({
                        status: 'Editable columns must be an Array'
                    })
                }
                // TODO: check editable columns are valid
                for (let key in editablecolumns) {
                    if (typeof (editablecolumns[key]) != "string") {
                        globalLogger.info('Editable columns must be an Array of string')
                        return res.status(400).json({
                            status: 'Editable columns must be an Array of string'
                        })
                    }
                }
                existingView.editablecolumns = editablecolumns as [string]
            }
        }
        await existingView.save();
        globalLogger.info("View updated: ", existingView)
        await res.send({ status: "OK" });
    }
    catch (e) {
        globalLogger.error(e)
    }
}

const getView = async (req: express.Request, res: express.Response) => {
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
        // check parameters
        const viewId = req.params.id;
        if (!viewId) {
            globalLogger.info("Missing parameter")
            return res.status(400).json({
                status: "Missing parameter"
            })
        }
        // find and return view
        const existingView = await View.findOne({ _id: viewId });
        if (!existingView) {
            globalLogger.info("Fail to find View " + viewId)
            return res.status(400).json({
                status: "Fail to find View " + viewId
            })
        }
        globalLogger.info("View retrieved: ", existingView._id)
        await res.send({ status: "OK", view: existingView });
    }
    catch (e) {
        globalLogger.error(e)
    }
}

const deleteView = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        // TODO: check user is developer
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser) {
            globalLogger.info("Fail to find User")
            return res.status(401).json({
                status: "Fail to find User"
            })
        }
        // check parameters
        const viewId = req.params.id;
        if (!viewId) {
            globalLogger.info("Missing parameter")
            return res.status(400).json({
                status: "Missing parameter"
            })
        }
        // find and delete view
        const existingView = await View.findOneAndDelete({ _id: viewId });
        if (!existingView) {
            globalLogger.info("Fail to find view " + viewId)
            return res.status(400).json({
                status: "Fail to find view " + viewId
            })
        }
        // find its owner and drop view
        try {
            const owner = await App.findById(existingView.owner)
            if (!owner) {
                globalLogger.info("Fail to owner " + existingView.owner)
                return res.status(400).json({
                    status: "Fail to owner " + existingView.owner
                })
            }
            owner.views = owner.views.filter((a) => { return a != viewId })
            owner.save()
        }
        catch (e) {
            globalLogger.error(e)
        }
        globalLogger.info("View deleted: ", existingView)
        await res.send({ status: "OK", view: existingView });
    }
    catch (e) {
        globalLogger.error(e)
    }
}

const getViews = async (req: express.Request, res: express.Response) => {
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
            globalLogger.info("missing app id")
            return res.status(400).send({
                status: "missing app id"
            })
        }
        const owner = await App.findById(id);
        if (!owner) {
            globalLogger.info("Fail to find app " + id)
            return res.status(400).json({
                status: "Fail to find owner " + id
            })
        }
        // TODO access control
        const appLogger = getLogger(id)
        const viewlist = Array();
        for (let key in owner.views) {
            const view = await View.findById(owner.views[key]);
            if (!view) {
                globalLogger.info("Fail to find view " + owner.views[key])
                return res.status(400).json({
                    status: "Fail to find view " + owner.views[key]
                })
            }
            if (view.viewtype == TYPE.TABLE) {
                viewlist.push({
                    name: view.name,
                    id: view._id
                })
            }
        }
        globalLogger.info("Table views fetched")
        return res.status(200).json({
            status: "OK",
            views: viewlist
        })
    }
    catch (e) {
        globalLogger.error(e)
    }

}

const getTableView = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        // TODO check user is end user
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser) {
            globalLogger.info("Fail to find User")
            return res.status(401).json({
                status: "Fail to find User"
            })
        }
        const viewId = req.params.id;
        if (!viewId) {
            globalLogger.info("Missing view id")
            return res.status(400).json({
                status: "Missing view id"
            })
        }
        const view = await View.findById(viewId)
        if (!view) {
            globalLogger.info("Fail to get view " + viewId)
            return res.status(400).json({
                status: "Fail to get view " + viewId
            })
        }
        if (view.viewtype != TYPE.TABLE) {
            globalLogger.info("View type is not table")
            return res.status(400).json({
                status: "View type is not table"
            })
        }
        const datasource = await DataSource.findById(view.table)
        if (!datasource) {
            globalLogger.info("Fail to get datasource" + view.table)
            return res.status(400).json({
                status: "Fail to get datasource" + view.table
            })
        }
        const sheet = await googleWrapper.getSheet(datasource.URL)
        if (!sheet) {
            globalLogger.info("Fail to get sheet" + datasource.URL)
            return res.status(400).json({
                status: "Fail to get sheet" + datasource.URL
            })
        }
        let data = []
        try {
            for (let key in view.columns) {
                data.push(sheetParser.getValuesByColumn(sheet, view.columns[key]))
            }
        }
        catch (e) {
            globalLogger.info(e)
            return res.status(400).json({
                status: e
            })
        }
        data = sheetParser.transposeTable(data)
        const columns = data.splice(0, 1)[0];
        let keys = []
        try {
            keys = sheetParser.getValuesByColumn(sheet, datasource.key)
        }
        catch (e) {
            globalLogger.info(e)
            return res.status(400).json({
                status: e
            })
        }
        keys.splice(0, 1)
        if (!sheetParser.checkUniqueness(keys)) {
            globalLogger.info("key column in datasource " + datasource._id + " is not unique")
            return res.status(400).json({
                status: "key column in datasource " + datasource._id + " is not unique"
            })
        }
        if (view.filter) {
            let index = undefined
            for (let key in columns) {
                if (columns[key] == view.filter) {
                    index = key
                    break
                }
            }
            if (index === undefined) {
                globalLogger.info("filter " + view.filter + " is not in columns")
                return res.status(400).json({
                    status: "filter " + view.filter + " is not in columns"
                })
            }
            let oldData = data
            let oldKeys = keys
            data = [];
            keys = [];
            for (let key in oldData) {
                if (oldData[key][index as any] === "TRUE") {
                    data.push(oldData[key])
                    keys.push(oldKeys[key])
                }
            }
        }
        if (view.userfilter) {
            let index = undefined
            for (let key in columns) {
                if (columns[key] == view.userfilter) {
                    index = key
                    break
                }
            }
            if (index === undefined) {
                globalLogger.info("user filter " + view.userfilter + " is not in columns")
                return res.status(400).json({
                    status: "user filter " + view.userfilter + " is not in columns"
                })
            }
            let oldData = data
            let oldKeys = keys
            data = [];
            keys = [];
            for (let key in oldData) {
                if (oldData[key][index as any] === "TRUE") {
                    data.push(oldData[key])
                    keys.push(oldKeys[key])
                }
            }
        }
        return res.status(200).json({
            status: "OK",
            id: view._id,
            data: data,
            columns: columns,
            keys: keys
        })
    }
    catch (e) {
        globalLogger.error(e)
    }
}
const getDetailView = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        // TODO check user is end user
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser) {
            globalLogger.info("Fail to find User")
            return res.status(401).json({
                status: "Fail to find User"
            }) 
        }
        const viewId = req.params.id;
        const keyValue: any = req.query.key
        if (!viewId) {
            globalLogger.info("Missing view id")
            return res.status(400).json({
                status: "Missing view id"
            })
        }
        const view = await View.findById(viewId)
        if (!view) {
            globalLogger.info("Fail to get view " + viewId)
            return res.status(400).json({
                status: "Fail to get view " + viewId
            })
        }
        if (view.viewtype != TYPE.TABLE) {
            globalLogger.info("View type is not table")
            return res.status(400).json({
                status: "View type is not table"
            })
        }
        //iterate the view to find a detail view with the same datasource
        const viewArray = await View.find({ table: view.table });
        let detailView =null;
        for(let i=0;i<viewArray.length;i++){
            if(viewArray[i]._id!=view._id&&viewArray[i].viewtype==TYPE.DETAIL){
                detailView = viewArray[i]
                break;
            }
        }
        if(detailView==null){
            globalLogger.info("Fail to get detail view for table" + view.table)
            return res.status(400).json({
                status: "Fail to get detail view for table" + view.table
            })
        }
        const datasource = await DataSource.findById(view.table)
        if (!datasource) {
            globalLogger.info("Fail to get datasource" + view.table)
            return res.status(400).json({
                status: "Fail to get datasource" + view.table
            })
        }
        const sheet = await googleWrapper.getSheet(datasource.URL)
        if (!sheet) {
            globalLogger.info("Fail to get sheet" + datasource.URL)
            return res.status(400).json({
                status: "Fail to get sheet" + datasource.URL
            })
        }
        let data = []
        try {
            for (let key in detailView.columns) {
                data.push(sheetParser.getValuesByColumn(sheet, detailView.columns[key]))
            }
        }
        catch (e) {
            globalLogger.info(e)
            return res.status(400).json({
                status: e
            })
        }
        data = sheetParser.transposeTable(data)
        const columns = data.splice(0, 1)[0];
        let keys: any[] = []
        try {
            keys = sheetParser.getValuesByColumn(sheet, datasource.key)
        }
        catch (e) {
            globalLogger.info(e)
            return res.status(400).json({
                status: e
            })
        }
        keys.splice(0, 1)
        if (!sheetParser.checkUniqueness(keys)) {
            globalLogger.info("key column in datasource " + datasource._id + " is not unique")
            return res.status(400).json({
                status: "key column in datasource " + datasource._id + " is not unique"
            })
        }

        // apply filter
        let oldData = data
        let oldKeys = keys
        data = [];
        keys = [];
        for (let key in oldKeys) {
            if (oldKeys[key] == keyValue ) {
                data.push(oldData[key])
                keys.push(oldKeys[key])
                break
            }
        }

        return res.status(200).json({
            status: "OK",
            id: detailView._id,
            data: data,
            columns: columns,
            keys: keys
        })
    }
    catch (e) {
        globalLogger.error(e)
    }
}


enum TYPE {
    TABLE = "table",
    DETAIL = "detail"
}

export default {
    createView,
    updateView,
    getView,
    deleteView,
    getViews,
    getTableView,
    getDetailView
}
