import http from 'http';
import { Server } from 'socket.io';
import ShortUniqueId from 'short-unique-id';
import log4js from 'log4js';
import { ALLOW_ORIGIN } from './app.config';
import app from './index';

/**
 * Http 服务器
 */
const httpServer = http.createServer(app);

/**
 * IO实时服务器
 */
export const socketIoServer = new Server(httpServer, {
  cors: {
    origin: ALLOW_ORIGIN,
    allowedHeaders: ['X-Total-Count'],
  },
});

/**
 * UID
 */
export const uid = new ShortUniqueId();

/**
 * 日志记录器
 */
log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: 'app.log',
      layout: {
        type: 'pattern',
        pattern: '%r %p - %m',
      },
    },
  },
  categories: {
    default: {
      appenders: ['file'],
      level: 'debug',
    },
  },
});

export const logger = log4js.getLogger();

/**
 * 默认导出
 */
export default httpServer;
