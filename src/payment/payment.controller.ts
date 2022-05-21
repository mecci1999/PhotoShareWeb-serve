import { Request, Response, NextFunction } from 'express';
import {
  getPayments,
  getUserInfoByOrderId,
  paymentRecived,
  updateAccountAmount,
} from './payment.service';
import { getUserById } from '../user/user.service';

/**
 * 支付方法
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const payment = await getPayments();

    // 作出响应
    response.send(payment);
  } catch (error) {
    next(error);
  }
};

/**
 * 支付结果通知：微信
 */
export const wxpayNotify = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    //1. 处理通知数据
    //2. 验证通知数据
    //3. 处理完成付款
    //4. 作出响应

    response.send('收到！');
  } catch (error) {
    next(error);
  }
};

/**
 * 支付结果通知：支付宝
 */
export const alipayNotify = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    //1. 处理通知数据
    //2. 验证通知数据
    //3. 处理完成付款
    //4. 作出响应

    response.send('收到！');
  } catch (error) {
    next(error);
  }
};

/**
 * 使用余额完成余额
 */
export const accountAmountPay = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    // 解构数据
    const {
      user: { id: userId },
      body: { order },
    } = request;

    // 判断一下订单的主人是不是当前用户
    if (order.userId !== userId) new Error('订单信息有误');

    // 拿到用户的账户余额
    const userInfo = await getUserById(userId);

    //扣除费用
    const amount = parseFloat(userInfo.amount) - parseFloat(order.totalAmount);

    // 更新用户账户金额
    await updateAccountAmount(userId, amount);

    // 拿到素材作者信息
    const authorInfo = await getUserInfoByOrderId(order.id);

    // 更新作品作者账户余额
    const addIncome =
      parseFloat(authorInfo.amount) + parseFloat(order.totalAmount);

    await updateAccountAmount(authorInfo.id, addIncome);

    //完成付款
    let paymentResult;
    if (order.payment === 'amount') {
      paymentResult = '使用账户余额完成订单支付';
    }

    const result = await paymentRecived(order.id, paymentResult);

    //作出响应
    response.send(result);
  } catch (error) {
    next(error);
  }
};
