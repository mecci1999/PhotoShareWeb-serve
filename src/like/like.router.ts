import express from 'express';
import * as likeMiddleware from './like.middleware';
import * as likeController from './like.controller';

const router = express.Router();

/**
 * 导出默认接口
 */
export default router;