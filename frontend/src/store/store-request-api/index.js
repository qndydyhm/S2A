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

const createNewDataSource = (ds)=>(`/api/ds`,ds);

// api.post('/api/ds', ds.createDS)
// api.post('/api/ds/:id', ds.updateDS)
// api.get('/api/ds/:id', ds.getDS)
// api.delete('/api/ds/:id', ds.deleteDS)

const apis = {
    getIdAppPairs,
    createApp,
    updateApp,
    getApp
}

export default apis
