import express from 'express'
import auth from '../auth'
import DataSource from '../models/datasource-model'


const createDS = async (req: express.Request, res: express.Response) => {
    try {
        const loggedInUser: any = await auth.getUser(req, res);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        const {name, URL, sheetindex, key, columns, appid} = req.body;
        if (!name || !URL || !sheetindex || !key || !columns || !appid) 
            return res.status(400).json({
                status: "Missing parameter"
            })
        const newDS = new DataSource({
            name: name,
            URL: URL,
            sheetindex: sheetindex,
            key: key,
            columns: columns,
            appid: appid
        })
        const savedDS = await newDS.save();
        console.info("New Datasource created: ", savedDS)
        await res.send({status: "OK", id: savedDS._id});
    }
    catch (e) {
        console.log(e)
    }
}

const updateDS = async (req: express.Request, res: express.Response) => {
    try {
        const loggedInUser: any = await auth.getUser(req, res);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        const dsId = req.params.id;
        const {name, URL, sheetindex, key, columns, appid} = req.body;
        if (!name || !URL || !sheetindex || !key || !columns || !appid) 
            return res.status(400).json({
                status: "Missing parameter"
            })
        const existingDS = await DataSource.findOneAndUpdate({_id: dsId},{
            name: name,
            URL: URL,
            sheetindex: sheetindex,
            key: key,
            columns: columns,
            appid: appid
        }, { new: true });
        if (!existingDS)
            return res.status(401).json({
                status: "Fail to find Datasource " + dsId
            })
        await res.send({status: "OK", datasource: existingDS});
    }
    catch (e) {
        console.log(e)
    }
}

const getDS = async (req: express.Request, res: express.Response) => {
    try {
        const loggedInUser: any = await auth.getUser(req, res);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        const dsId = req.params.id;
        if (!dsId) 
            return res.status(400).json({
                status: "Missing parameter"
            })
        const existingDS = await DataSource.findOne({_id: dsId});
        if (!existingDS)
            return res.status(401).json({
                status: "Fail to find DataSource " + dsId
            })
        await res.send({status: "OK", datasource: existingDS});
    }
    catch (e) {
        console.log(e)
    }
}

const deleteDS = async (req: express.Request, res: express.Response) => {
    try {
        const loggedInUser: any = await auth.getUser(req, res);
        if (!loggedInUser)
            return res.status(401).json({
                status: "Fail to find User"
            })
        const dsId = req.params.id;
        if (!dsId) 
            return res.status(400).json({
                status: "Missing parameter"
            })
        const existingDS = await DataSource.findOneAndDelete({_id: dsId});
        if (!existingDS)
            return res.status(401).json({
                status: "Fail to find DataSource " + dsId
            })
        await res.send({status: "OK", datasource: existingDS});
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
