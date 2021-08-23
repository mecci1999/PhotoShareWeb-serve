import dayjs from 'dayjs';
import { Request, Response, NextFunction } from 'express';
import { SubscriptionModel } from './subscription.model';
import {
  getSubscriptionHistory,
  getUserValidSubscription,
} from './subscription.service';

/**
 * 有效订阅
 */
export interface ValidSubscription extends SubscriptionModel {
  isExpired: boolean;
  daysRemaining: number;
}

export const validSubscription = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    user: { id: userId },
  } = request;

  try {
    const subscription = await getUserValidSubscription(userId);

    const validSubscription = subscription
      ? (subscription as ValidSubscription)
      : null;

    if (validSubscription) {
      // 订阅是否过期
      validSubscription.isExpired = dayjs().isAfter(subscription.expired);

      //离过期还有多少天
      validSubscription.daysRemaining = validSubscription.isExpired
        ? 0
        : dayjs(subscription.expired).diff(dayjs(), 'days');
    }

    // 做出响应
    response.send(validSubscription);
  } catch (error) {
    next(error);
  }
};

/**
 * 订阅历史
 */
export const history = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { subscriptionId } = request.params;

  try {
    const history = await getSubscriptionHistory(parseInt(subscriptionId, 10));

    // 做出响应
    response.send(history);
  } catch (error) {
    next(error);
  }
};
