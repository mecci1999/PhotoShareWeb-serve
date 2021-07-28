import express from 'express';
import * as tagMiddleware from './tag.middleware';
import * as tagController from './tag.controller';
import { authGuard } from '../auth/auth.middleware';

const router = express.Router();

/**
 * 创建标签
 */
router.post('/tags', authGuard, tagController.store)

/**
 * 导出默认路由
 */
export default router;