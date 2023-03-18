import express from 'express'
import user from '../controller/UserController'


const app = express.Router()


app.get('/', (req, res) => {
    res.send('Hello World!');
});

// user authentication
app.get('/auth/login', user.loginUser)
app.get('/auth/logout', user.logoutUser)
app.get('/auth/loggedIn', user.getLoggedIn)
app.get('/auth/google-callback', user.googleCallback)

export default app