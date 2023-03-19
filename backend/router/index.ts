import express from 'express'
import user from '../controller/user-controller'
import app from '../controller/app-controller'
import ds from '../controller/datasource-controller'

const api = express.Router()


api.get('/', (req, res) => {
    res.send('Hello World!');
});

// user authentication
api.get('/auth/login', user.loginUser)
api.get('/auth/logout', user.logoutUser)
api.get('/auth/loggedIn', user.getLoggedIn)
api.get('/auth/google-callback', user.googleCallback)


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

export default api