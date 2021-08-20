import express from 'express';
import * as paymenyController from './payment.controller';

/**
 * 定义接口
 */
const router = express.Router();

/**
 * 支付方法
 */
router.get('/payments', paymenyController.index);

/**
 * 默认导出
 */
export default router;
