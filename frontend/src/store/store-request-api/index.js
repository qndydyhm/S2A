import axios from "axios"; 
// import {App, Datasource} from '../../DataType/dataType'
axios.defaults.withCredentials = true;
const api = axios.create()

//app
const getIdAppPairs = () =>api.get(`/api/app`);
const createApp=(app)=>api.post(`/api/app`,app);
const updateApp=(id,app) => api.post(`/api/app/${id}`,app);
const getApp = (id) =>api.get(`/api/app/${id}`);
const deleteApp=(id)=>api.delete(`/api/app/${id}`);
//data source

const createNewDataSource = (ds)=>api.post(`/api/ds`,ds);
const getDataSource =(id)=>api.get(`api/ds/${id}`);
const updateDataSource =(id,datasource) =>api.post(`/api/ds/${id}`,datasource);
const deleteDataSource=(id)=>api.delete(`/api/ds/${id}`);
// api.post('/api/ds', ds.createDS)
// api.post('/api/ds/:id', ds.updateDS)
// api.get('/api/ds/:id', ds.getDS)
// api.delete('/api/ds/:id', ds.deleteDS)

//view

const createNewView = (v) =>api.post(`/api/view`,v);
const getView = (id) =>api.get(`/api/view/${id}`);
const updateView = (id, v) => api.post(`/api/view/${id}`,v);
const deleteView = (id) => api.delete(`/api/view/${id}`);
// api.post('/api/view', view.createView)
// api.post('/api/view/:id', view.updateView)
// api.get('/api/view/:id', view.getView)
// api.delete('/api/view/:id', view.deleteView)


const getIdTableViewPairs=(id)=>api.get(`/api/view`,{params: {id:id}});
const getTableData=(id)=>api.get(`/api/table/${id}`)                                                                                                                                
const getDetailView=(id,key)=>api.get(`/api/detail/${id}`,{params:{key:key}})
//api.get('/api/view', view.getViews)
// api.get('/api/table/:id', view.getTableView)
// api.get(`/api/detail/:id`,view.getDetailView)

const apis = {
    getIdAppPairs,
    createApp,
    updateApp,
    getApp,
    deleteApp,
    createNewDataSource,
    deleteDataSource,
    createNewView,
    getView,
    getDataSource,
    updateDataSource,
    updateView,
    deleteView,
    getIdTableViewPairs,
    getTableData,
    getDetailView
}

export default apis
