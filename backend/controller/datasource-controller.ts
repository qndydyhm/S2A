import express from 'express'
import auth from '../auth'
import DataSource from '../models/datasource-model'
import App from '../models/app-model'


const createDS = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        // TODO: check user is developer
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        // check parameters
        const { name, URL, sheetindex, key, columns, owner } = req.body;
        if (typeof (name) != "string" || name === "" || typeof (URL) != "string" || URL === "" ||
            typeof (sheetindex) != "number" || typeof (key) != "string" || key === "" ||
            !Array.isArray(columns) || typeof (owner) != "string" || owner === "")
            return res.status(400).json({
                status: "Missing parameter"
            })
        const existingApp = await App.findOne({ _id: owner });
        if (!existingApp)
            return res.status(400).json({
                status: "Fail to find app " + owner
            })
        // check columns
        let newColumn = []
        let hasLabel: boolean = false
        for (let key in columns) {
            const column = columns[key]
            if (typeof (column) != "object" || typeof (column.name) != "string" || typeof (column.initvalue) != "string" ||
                typeof (column.label) != "boolean" || typeof (column.reference) != "string" ||
                (column.type !== "Boolean" && column.type !== "Number" && column.type !== "Text" && column.type != "URL")) {
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
                if (hasLabel)
                    return res.status(400).json({
                        status: "At most one column lable is true"
                    })
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
        console.info("New Datasource created: ", savedDS)
        await res.send({ status: "OK", id: savedDS._id });
    }
    catch (e) {
        console.log(e)
    }
}

const updateDS = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        // TODO: check user is developer
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        // check parameters
        const dsId = req.params.id;
        const { name, URL, sheetindex, key, columns } = req.body;
        if (!dsId || typeof (name) != "string" || name === "" || typeof (URL) != "string" || URL === "" ||
            typeof (sheetindex) != "number" || typeof (key) != "string" || key === "" || !Array.isArray(columns))
            return res.status(400).json({
                status: "Missing parameter"
            })
        // check columns
        let newColumn = []
        let hasLabel: boolean = false
        for (let key in columns) {
            const column = columns[key]
            if (typeof (column) != "object" || typeof (column.name) != "string" || typeof (column.initvalue) != "string" ||
                typeof (column.label) != "boolean" || typeof (column.reference) != "string" ||
                (column.type !== "Boolean" && column.type !== "Number" && column.type !== "Text" && column.type != "URL")) {
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
                if (hasLabel)
                    return res.status(400).json({
                        status: "At most one column lable is true"
                    })
                hasLabel = true
            }
        }
        // find and update datasource
        const existingDS = await DataSource.findOne({ _id: dsId });
        if (!existingDS)
            return res.status(401).json({
                status: "Fail to find Datasource " + dsId
            })
        existingDS.name = name
        existingDS.URL = URL
        existingDS.sheetindex = sheetindex
        existingDS.key = key
        existingDS.columns = newColumn as [{
            name: string,
            initvalue: string,
            label: boolean,
            reference: string,
            type: string
        }]
        await existingDS.save()
        await res.send({ status: "OK" });
    }
    catch (e) {
        console.log(e)
    }
}

const getDS = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        // TODO: check user is end user
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        // check parameters
        const dsId = req.params.id;
        if (!dsId)
            return res.status(400).json({
                status: "Missing parameter"
            })
        // find and return datasource
        const existingDS = await DataSource.findOne({ _id: dsId });
        if (!existingDS)
            return res.status(401).json({
                status: "Fail to find DataSource " + dsId
            })
        await res.send({ status: "OK", datasource: existingDS });
    }
    catch (e) {
        console.log(e)
    }
}

const deleteDS = async (req: express.Request, res: express.Response) => {
    try {
        // get user info
        // TODO: check user is developer
        const loggedInUser: any = await auth.getUser(req);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        // check parameters
        const dsId = req.params.id;
        if (!dsId)
            return res.status(400).json({
                status: "Missing parameter"
            })
        // find and delete datasource
        // TODO remove this, only remove when app change/delete
        const existingDS = await DataSource.findOneAndDelete({ _id: dsId });
        if (!existingDS)
            return res.status(400).json({
                status: "Fail to find DataSource " + dsId
            })
        try {
            const owner = await App.findById(existingDS.owner)
            if (!owner)
                return res.status(400).json({
                    status: "Fail to owner " + existingDS.owner
                })
            owner.datasources = owner.datasources.filter((a) => { a != dsId })
            owner.save()
        }
        catch (e) {
            console.log(e)
        }
        await res.send({ status: "OK", datasource: existingDS });
    }
    catch (e) {
        console.log(e)
    }
}

export default {
    createDS,
    updateDS,
    getDS,
    deleteDS
}
