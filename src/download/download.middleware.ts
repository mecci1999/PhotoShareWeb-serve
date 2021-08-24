import { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';
import { getPostById, PostStatus } from '../post/post.service';
import { getUserValidLicense } from '../license/license.service';
import { getUserValidSubscription } from '../subscription/subscription.service';
import { SubscriptionType } from '../subscription/subscription.model';
import { countDownloads } from './download.service';
import { STANDARD_SUBSCRIPTION_DOWNLOAD_LIMIT_PER_WEEK } from '../app/app.config';

/**
 * 下载守卫
 */
export const downloadGuard = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    body: { resourceType, resourceId },
    user: { id: userId },
  } = request;

  try {
    // 检查资源
    const resource = await getPostById(resourceId, {
      currentUser: { id: userId },
    });

    const isValidResource =
      resource && resource.status === PostStatus.published;

    if (!isValidResource) {
      throw new Error('BAD_REQUEST');
    }

    // 调用用户资源许可
    const license = await getUserValidLicense(userId, resourceType, resourceId);

    if (license) {
      request.body.license = license;
    }

    // 调用用户订阅
    const subscription = await getUserValidSubscription(userId);

    // 检查用户是否拥有有效订阅
    const isValidSubscription =
      subscription && dayjs().isBefore(subscription.expired);

    // 检查用户许可和订阅
    if (!license && !isValidSubscription) throw new Error('FORBIDDEN');

    // 检查用户订阅最近一个礼拜下载次数
    if (
      isValidSubscription &&
      !license &&
      subscription.type === SubscriptionType.standard
    ) {
      const { count } = await countDownloads({
        userId,
        type: 'subscription',
        datetime: '7-day',
      });

      if (count >= STANDARD_SUBSCRIPTION_DOWNLOAD_LIMIT_PER_WEEK) {
        throw new Error('DOWNLOAD_LIMIT_REACHED');
      }
    }
  } catch (error) {
    return next(error);
  }

  // 下一步
  next();
};
