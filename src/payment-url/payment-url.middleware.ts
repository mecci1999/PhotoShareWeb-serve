import { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';
import { getPaymentUrlByToken, updatePaymentUrl } from './payment-url.service';
import { DATE_TIME_FORMAT } from '../app/app.config';

/**
 * 支付地址守卫
 */
export const paymentUrlGuard = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    query: { token },
  } = request;

  try {
    // 检查 Token
    if (!token) throw new Error('BAD_REQUEST');

    // 检查支付地址
    const paymentUrl = await getPaymentUrlByToken(`${token}`);
    const isValidPaymentUrl = paymentUrl && !paymentUrl.used;

    if (!isValidPaymentUrl) throw new Error('BAD_REQUEST');

    // 检查支付地址是否过期
    const isExpired = dayjs()
      .subtract(2, 'hours')
      .isAfter(paymentUrl.created);

    if (isExpired) throw new Error('PAYMENT_EXPIRED');

    // 更新支付地址
    await updatePaymentUrl(paymentUrl.id, {
      used: dayjs().format(DATE_TIME_FORMAT),
    });

    // 设置请求主体
    request.body = {
      paymentUrl,
    };
  } catch (error) {
    return next(error);
  }

  // 下一步
  next();
};
