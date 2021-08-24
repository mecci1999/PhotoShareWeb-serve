import http from 'http';
import { Server } from 'socket.io';
import ShortUniqueId from 'short-unique-id';
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
 * 默认导出
 */
export default httpServer;
