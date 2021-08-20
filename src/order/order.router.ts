import express from 'express';
import { accessLog } from '../access-log/access-log.middleware';
import { authGuard } from '../auth/auth.middleware';
import * as orderController from './order.controller';
import { orderGuard } from './order.middleware';

/**
 * 定义路由
 */
const router = express.Router();

/**
 * 创建订单
 */
router.post(
  '/orders',
  authGuard,
  orderGuard,
  accessLog({ action: 'createOrder', resourceType: 'order' }),
  orderController.store,
);

/**
 * 默认导出
 */
export default router;
