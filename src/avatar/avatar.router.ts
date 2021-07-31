import express, { Router } from 'express';
import * as avatarMiddleware from './avatar.middleware';
import * as avatarController from './avatar.controller';

const router = express.Router();

/**
 * 默认导出接口
 */
export default router;