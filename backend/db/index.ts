import mongoose from 'mongoose'
import logger from '../tools/logger';

mongoose.connect(process.env.MONGO_URL!, {
    dbName: process.env.MONGO_DBNAME,
    // user: process.env.MONGO_USER, // TODO: add authentication to db
    // pass: process.env.MONGO_PASS
})
    .then(() => {
        logger.error('Connected to database')
    })
    .catch(e => {
        logger.error('Connection error', e.message)
    })

export default mongoose.connection;