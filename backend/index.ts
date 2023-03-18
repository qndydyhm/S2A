import express from 'express';
import dotenv from 'dotenv'
import db from './db'
import cookieParser from 'cookie-parser'
import router from './router'
dotenv.config();

const PORT: Number = parseInt(process.env.EXPRESS_PORT!)
const app: express.Application = express();
app.use(cookieParser())
app.use("/", router) // main router



db.on('error', console.error.bind(console, 'MongoDB connection error: '))

app.listen(PORT, (err?: any) => {
  if (err) {
    return console.error(err);
  }
  return console.log(`Server is listening on ${PORT}`);
});

