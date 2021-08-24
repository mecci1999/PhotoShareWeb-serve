import express from 'express';
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
 * 默认导出
 */
export default router;
