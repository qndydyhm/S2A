import express from 'express'
import user from '../controller/user-controller'
import app from '../controller/app-controller'
import ds from '../controller/datasource-controller'
import view from '../controller/view-controller'
import data from '../controller/data-controller'

const api = express.Router()


api.get('/', (req, res) => {
    res.send('Hello World!');
});

// user authentication
api.get('/auth/login', user.loginUser)
api.get('/auth/logout', user.logoutUser)
api.get('/auth/loggedIn', user.getLoggedIn)
api.get('/auth/google-callback', user.googleCallback)
api.get('/auth/globaldeveloper', user.isGlobalDeveloper)


// app
api.post('/api/app', app.createApp)
api.post('/api/app/:id', app.updateApp)
api.get('/api/app/:id', app.getApp)
api.get('/api/app', app.getApps)
api.delete('/api/app/:id', app.deleteApp)


// data source
api.post('/api/ds', ds.createDS)
api.post('/api/ds/:id', ds.updateDS)
api.get('/api/ds/:id', ds.getDS)
api.delete('/api/ds/:id', ds.deleteDS)

// view
api.post('/api/view', view.createView)
api.post('/api/view/:id', view.updateView)
api.get('/api/view/:id', view.getView)
api.get('/api/view', view.getViews)
api.delete('/api/view/:id', view.deleteView)
api.get('/api/table/:id', view.getTableView)
api.get(`/api/detail/:id`,view.getDetailView)

// data
api.post('/api/data/:id', data.updateRecord)
api.delete('/api/data/:id', data.deleteRecord)
export default api