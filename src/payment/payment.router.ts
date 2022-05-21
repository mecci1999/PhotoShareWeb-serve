import express from 'express';
import { authGuard } from '../auth/auth.middleware';
import * as paymentController from './payment.controller';

/**
 * 定义接口
 */
const router = express.Router();

/**
 * 支付方法
 */
router.get('/payments', paymentController.index);

/**
 * 支付结果通知: 微信支付
 */
router.post('/payments/wxpay/notify', paymentController.wxpayNotify);

/**
 * 支付结果通知：支付宝支付
 */
router.post('/payments/alipay/notify', paymentController.alipayNotify);

/**
 * 使用账户余额完成支付
 */
router.post(
  '/payments/accountpay',
  authGuard,
  paymentController.accountAmountPay,
);

/**
 * 默认导出
 */
export default router;
