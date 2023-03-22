import express from 'express'
import auth from '../auth'
import View from '../models/view-model'
import App from '../models/app-model'
import globalLogger from '../tools/logger'


const createView = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        // TODO: check user is developer
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        // check parameters
        const { name, table, columns, viewtype, allowedactions, roles, filter, userfilter, editfilter, editablecolumns, owner } = req.body;
        if (typeof (name) != "string" || name === "" || typeof (table) != "string" || table === "" ||
            !Array.isArray(columns) || typeof (viewtype) != "string" || viewtype === "" ||
            !Number.isInteger(allowedactions) || allowedactions < 0 ||
            allowedactions > 7 || !Array.isArray(roles) || typeof (owner) != "string" || owner == "")
            return res.status(400).json({
                status: "Missing parameter"
            })
        const existingApp = await App.findOne({ _id: owner });
        if (!existingApp)
            return res.status(400).json({
                status: "Fail to find app " + owner
            })
        // create and save datasource
        if (viewtype != TYPE.TABLE && viewtype != TYPE.DETAIL)
            return res.status(400).json({
                status: 'View type must be one of "table" or "detail"'
            })
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
                if (typeof (filter) != "string")
                    return res.status(400).json({
                        status: 'Filter must be a string'
                    })
                newView.filter = filter
            }
            if (userfilter) {
                if (typeof (userfilter) != "string")
                    return res.status(400).json({
                        status: 'User filter must be a string'
                    })
                newView.userfilter = userfilter
            }
        }
        else if (viewtype == TYPE.DETAIL) {
            if (editfilter) {
                if (typeof (editfilter) != "string")
                    return res.status(400).json({
                        status: 'Edit filter must be a string'
                    })
                newView.editfilter = editfilter
            }
            if (editablecolumns) {
                if (!Array.isArray(editablecolumns))
                    return res.status(400).json({
                        status: 'Editable columns must be an Array'
                    })
                // TODO: check editable columns are valid
                for (let key in editablecolumns) {
                    if (typeof (editablecolumns[key]) != "string")
                        return res.status(400).json({
                            status: 'Editable columns must be an Array of string'
                        })
                }
                newView.editablecolumns = editablecolumns as [string]
            }
        }
        const savedView = await newView.save();
        existingApp.views.push(savedView._id.toString())
        existingApp.save()
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
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        // check parameters
        const viewId = req.params.id;
        const { name, table, columns, viewtype, allowedactions, roles, filter, userfilter, editfilter, editablecolumns } = req.body;
        if (!viewId || typeof (name) != "string" || name === "" || typeof (table) != "string" ||
            table === "" || !Array.isArray(columns) || typeof (viewtype) != "string" ||
            viewtype === "" || !Number.isInteger(allowedactions) || allowedactions < 0 ||
            allowedactions > 7 || !Array.isArray(roles))
            return res.status(400).json({
                status: "Missing parameter"
            })
        // TODO check owner, table, columns, roles is valid
        // create and save datasource
        if (viewtype !== TYPE.TABLE && viewtype !== TYPE.DETAIL)
            return res.status(400).json({
                status: 'View type must be one of "table" or "detail"'
            })
        const existingView = await View.findOne({ _id: viewId })
        if (!existingView)
            return res.status(400).json({
                status: 'Fail to find view'
            })
        existingView.name = name
        existingView.table = table
        existingView.columns = columns as [string]
        existingView.viewtype = viewtype
        existingView.allowedactions = allowedactions
        existingView.roles = roles as [string]
        // TODO: check filters are valid columns
        if (viewtype === TYPE.TABLE) {
            if (filter) {
                if (typeof (filter) != "string")
                    return res.status(400).json({
                        status: 'Filter must be a string'
                    })
                existingView.filter = filter
            }
            if (userfilter) {
                if (typeof (userfilter) != "string")
                    return res.status(400).json({
                        status: 'User filter must be a string'
                    })
                existingView.userfilter = userfilter
            }
        }
        else if (viewtype === TYPE.DETAIL) {
            if (editfilter) {
                if (typeof (editfilter) != "string")
                    return res.status(400).json({
                        status: 'Edit filter must be a string'
                    })
                existingView.editfilter = editfilter
            }
            if (editablecolumns) {
                if (!Array.isArray(editablecolumns))
                    return res.status(400).json({
                        status: 'Editable columns must be an Array'
                    })
                // TODO: check editable columns are valid
                for (let key in editablecolumns) {
                    if (typeof (editablecolumns[key]) != "string")
                        return res.status(400).json({
                            status: 'Editable columns must be an Array of string'
                        })
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
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        // check parameters
        const viewId = req.params.id;
        if (!viewId)
            return res.status(400).json({
                status: "Missing parameter"
            })
        // find and return view
        const existingView = await View.findOne({ _id: viewId });
        if (!existingView)
            return res.status(400).json({
                status: "Fail to find View " + viewId
            })
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
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        // check parameters
        const viewId = req.params.id;
        if (!viewId)
            return res.status(400).json({
                status: "Missing parameter"
            })
        // find and delete view
        const existingView = await View.findOneAndDelete({ _id: viewId });
        if (!existingView)
            return res.status(400).json({
                status: "Fail to find view " + viewId
            })
        // find its owner and drop view
        try {
            const owner = await App.findById(existingView.owner)
            if (!owner)
                return res.status(400).json({
                    status: "Fail to owner " + existingView.owner
                })
            owner.views = owner.views.filter((a) => { return a != viewId })
            owner.save()
        }
        catch (e) {
            globalLogger.error(e)
        }
        await res.send({ status: "OK", view: existingView });
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
    deleteView
}
