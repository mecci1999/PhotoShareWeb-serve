import express from 'express';
import { accessLog } from '../access-log/access-log.middleware';
import { accessControl, authGuard } from '../auth/auth.middleware';
import * as orderController from './order.controller';
import { orderGuard, updateOrderGuard } from './order.middleware';

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
 * 更新订单
 */
router.patch(
  '/orders/:orderId',
  authGuard,
  accessControl({ prossession: true }),
  updateOrderGuard,
  accessLog({
    action: 'updateOrder',
    resourceType: 'order',
    resourceParamName: 'orderId',
  }),
  orderController.update,
);

/**
 * 默认导出
 */
export default router;
