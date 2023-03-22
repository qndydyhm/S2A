import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import db from './db'
import cookieParser from 'cookie-parser'
import router from './router'
import accessControl from './tools/access-control';
import logger from './tools/logger';

logger.error("S2A starts running")

const PORT: Number = parseInt(process.env.EXPRESS_PORT!)
const app: express.Application = express();
app.use(cookieParser())
app.use(express.json())
app.use("/", router) // main router

accessControl.loadGlobalDeveloper().then(
  () => logger.error("Global developer list loaded")
)


db.on('error', (stream) => {
  logger.error(stream)
})

app.listen(PORT, (err?: any) => {
  if (err) {
    return logger.error(err);
  }
  return logger.error(`Server is listening on ${PORT}`);
});

