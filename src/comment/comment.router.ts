import express from 'express';
import * as commentMiddleware from './comment.middleware';
import * as commentController from './comment.controller';

const router = express.Router();

/**
 * 导出默认接口
 */
export default router;