import { Request, Response, NextFunction } from 'express';
import { getProductByType } from './product.service';

/**
 * 许可产品
 */
export const showLicenseProduct = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const licenseProduct = await getProductByType('license');

    // 作出响应
    response.send(licenseProduct);
  } catch (error) {
    next(error);
  }
};

/**
 * 充值产品
 */
export const showRechargeProduct = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const rechargeProduct = await getProductByType('recharge');

    // 作出响应
    response.send(rechargeProduct);
  } catch (error) {
    next(error);
  }
};

/**
 * 订阅产品
 */
export const showSubscriptionProduct = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const data = [];

    // 标准订阅
    const standardSubscriptionProduct = await getProductByType('subscription', {
      meta: {
        subscriptionType: 'standard',
      },
    });

    if (standardSubscriptionProduct) {
      data.push(standardSubscriptionProduct);
    }

    // 专业订阅
    const proSubscriptionProduct = await getProductByType('subscription', {
      meta: {
        subscriptionType: 'pro',
      },
    });

    if (proSubscriptionProduct) {
      data.push(proSubscriptionProduct);
    }

    // 作出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};
