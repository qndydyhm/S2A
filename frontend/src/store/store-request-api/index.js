import axios from "axios"; 
// import {App, Datasource} from '../../DataType/dataType'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost',
})
const getIdAppPairs = () =>api.get(`/api/app`);
const createApp=(app)=>api.post(`/api/app`,app);
const updateApp=(id,app) => api.post(`/api/app/${id}`,app);
const getApp = (id) =>api.get(`/api/app/${id}`);



// api.post('/api/app', app.createApp)
// api.post('/api/app/:id', app.updateApp)
// api.get('/api/app/:id', app.getApp)
// api.get('/api/app', app.getApps)
// api.delete('/api/app/:id', app.deleteApp)

const apis = {
    getIdAppPairs,
    createApp,
    updateApp,
    getApp
}

export default apis
