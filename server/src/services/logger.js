const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, json } = format;
const morgan = require('morgan');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');

const logDirectory = path.join(__dirname, 'logs');

// Custom format for the logs
const myFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const httpFilter = format((info, opts) => {
    return info.level === 'http' ? info : false;
});

const logger = createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console({
            format: combine(
                format.colorize(),
                myFormat
            ),
            level: 'debug'
        }),
        new DailyRotateFile({
            filename: path.join(logDirectory, 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: combine(
                timestamp(),
                myFormat
            ),
            level: 'info'
        }),
        new DailyRotateFile({
            filename: path.join(logDirectory, 'request-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m', 
            maxFiles: '14d',
            format: combine(httpFilter(), timestamp(), myFormat),
            level: 'http'
        })
    ],
    exceptionHandlers: [
        new transports.Console({
            format: combine(
                format.colorize(),
                myFormat
            ),
        }),
        // Exception handler to catch unhandled exceptions and log them
        new DailyRotateFile({
            filename: path.join(logDirectory, 'exceptions-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m', 
            maxFiles: '14d',
            format: combine(
                timestamp(),
                myFormat
            ),
        })
    ],
    exitOnError: false // do not exit on handled exceptions
});

const errorLogger = createLogger({
    level: 'error',
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new DailyRotateFile({
            filename: path.join(logDirectory, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m', 
            maxFiles: '14d' 
        })
    ]
})


const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
      stream: {
        // Configure Morgan to use our custom logger with the http severity
        write: (message) => logger.http(message.trim()),
      },
    }
)

module.exports = {
    logger,
    morganMiddleware,
    errorLogger
};

