import expressWinston from 'express-winston';
import winston from 'winston';
import config from '../config';

const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: config.REQUEST_LOG })],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: config.ERROR_LOG })],
  format: winston.format.json(),
});

export { errorLogger, requestLogger };
