import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import db from './db'
import cookieParser from 'cookie-parser'
import router from './router'
import GlobalDevelopers from './tools/global-developer';


const PORT: Number = parseInt(process.env.EXPRESS_PORT!)
const app: express.Application = express();
app.use(cookieParser())
app.use(express.json())
app.use("/", router) // main router

GlobalDevelopers.loadGlobalDeveloper().then(
  () => console.log("Global developer list loaded")
)


db.on('error', console.error.bind(console, 'MongoDB connection error: '))

app.listen(PORT, (err?: any) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`Server is listening on ${PORT}`);
});

