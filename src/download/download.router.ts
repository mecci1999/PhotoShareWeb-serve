import express from 'express';
import { authGuard } from '../auth/auth.middleware';
import * as downloadController from './download.controller';
import { downloadGuard } from './download.middleware';

/**
 * 定义路由
 */
const router = express.Router();

/**
 * 创建下载
 */
router.post('/downloads', authGuard, downloadGuard, downloadController.store);

/**
 * 默认导出路由
 */
export default router;
