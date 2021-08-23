import express from 'express';
import { authGuard } from '../auth/auth.middleware';
import * as subscriptionController from './subscription.controller';

/**
 * 定义路由
 */
const router = express.Router();

/**
 * 有效订阅
 */
router.get(
  '/valid-subscription',
  authGuard,
  subscriptionController.validSubscription,
);

/**
 * 默认导出
 */
export default router;
