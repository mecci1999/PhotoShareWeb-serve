import dayjs from 'dayjs';
import { Request, Response, NextFunction } from 'express';
import { STANDARD_SUBSCRIPTION_DOWNLOAD_LIMIT_PER_WEEK } from '../app/app.config';
import { countDownloads } from '../download/download.service';
import { SubscriptionModel, SubscriptionType } from './subscription.model';
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
  weeklyDownloads: number;
  weeklyDownloadsLimit: number;
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

      // 统计用户当前下载文件数量和下载限制
      const { count } = await countDownloads({
        userId,
        type: 'subscription',
        datetime: '7-day',
      });

      validSubscription.weeklyDownloads = count;

      if (validSubscription.type === SubscriptionType.standard) {
        validSubscription.weeklyDownloadsLimit = STANDARD_SUBSCRIPTION_DOWNLOAD_LIMIT_PER_WEEK;
      } else {
        validSubscription.weeklyDownloadsLimit = null;
      }
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
