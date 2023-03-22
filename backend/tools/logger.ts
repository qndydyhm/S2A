import winston from 'winston'

const logPath = process.env.LOG_PATH || "./"


// const levels = {
//     error: 0,
//     warn: 1,
//     info: 2,
//     http: 3,
//     verbose: 4,
//     debug: 5,
//     silly: 6
//   };
const globalLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: logPath + 's2a.log' }),
        new winston.transports.File({ filename: logPath + 'error.log', level: 'error' })
    ],
});

export const getLogger = (filename: string) => {
    return winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: logPath + filename + '.log' }),
            new winston.transports.File({ filename: logPath + 'error.log', level: 'error' })
        ],
    });
}

export default globalLogger;