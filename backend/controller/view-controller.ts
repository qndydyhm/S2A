import express from 'express'
import auth from '../auth'
import View from '../models/view-model'
import App from '../models/app-model'
import globalLogger, { getLogger } from '../tools/logger'


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
            if (userfilter) {
                if (typeof (userfilter) != "string") {
                    globalLogger.info('User filter must be a string')
                    return res.status(400).json({
                        status: 'User filter must be a string'
                    })
                }
                existingView.userfilter = userfilter
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
                appLogger.info("Fail to find view " + owner.views[key])
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
        appLogger.info("Table views fetched")
        return res.status(200).json({
            status: "OK",
            views: viewlist
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
    getViews
}
