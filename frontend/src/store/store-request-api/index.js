import axios from "axios"; 
// import {App, Datasource} from '../../DataType/dataType'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost',
})

//app
const getIdAppPairs = () =>api.get(`/api/app`);
const createApp=(app)=>api.post(`/api/app`,app);
const updateApp=(id,app) => api.post(`/api/app/${id}`,app);
const getApp = (id) =>api.get(`/api/app/${id}`);


//data source

const createNewDataSource = (ds)=>api.post(`/api/ds`,ds);
// api.post('/api/ds', ds.createDS)
// api.post('/api/ds/:id', ds.updateDS)
// api.get('/api/ds/:id', ds.getDS)
// api.delete('/api/ds/:id', ds.deleteDS)

//view

const createNewView = (v) =>api.post(`/api/view`,v);
const getView = (id) =>api.get(`/api/view/${id}`);

// api.post('/api/view', view.createView)
// api.post('/api/view/:id', view.updateView)
// api.get('/api/view/:id', view.getView)
// api.delete('/api/view/:id', view.deleteView)


const apis = {
    getIdAppPairs,
    createApp,
    updateApp,
    getApp,
    createNewDataSource,
    createNewView,
    getView
}

export default apis
