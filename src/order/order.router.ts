import express from 'express';
import { accessLog } from '../access-log/access-log.middleware';
import { ORDER_PER_PAGE } from '../app/app.config';
import { accessControl, authGuard } from '../auth/auth.middleware';
import { paginate } from '../post/post.middleware';
import * as orderController from './order.controller';
import {
  orderGuard,
  orderIndexFilter,
  payOrderGuard,
  updateOrderGuard,
} from './order.middleware';

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
 * 订单支付
 */
router.post(
  '/orders/:orderId/pay',
  authGuard,
  payOrderGuard,
  orderController.pay,
);

/**
 * 订单列表
 */
router.get(
  '/orders',
  authGuard,
  paginate(ORDER_PER_PAGE),
  accessLog({ action: 'getOrders', resourceType: 'order' }),
  orderIndexFilter,
  orderController.index,
);

/**
 * 默认导出
 */
export default router;
