import express from 'express';
import { authGuard } from '../auth/auth.middleware';
import * as auditLogController from './audit-log.controller';
import { auditLogGuard } from './audit-log.middleware';

// 定义路由
const router = express.Router();

/**
 * 创建审核
 */
router.post('/audit-logs', authGuard, auditLogGuard, auditLogController.store);

/**
 * 取消审核
 */
router.post('/revoke-audit', authGuard, auditLogController.revoke);

/**
 * 默认导出
 */
export default router;
