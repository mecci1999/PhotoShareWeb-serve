import { Request, Response, NextFunction } from 'express';
import { PaymentName } from '../payment/payment.model';
import { getPostById, PostStatus } from '../post/post.service';
import { ProductStatus } from '../product/product.model';
import { getProductById } from '../product/product.service';
import { OrderStatus } from './order.model';
import { getOrderById } from './order.service';

/**
 * 订单守卫
 */
export const orderGuard = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    user: { id: userId },
    body: { payment, productId, resourceType, resourceId },
  } = request;

  try {
    // 检查支付方法
    const isValidPayment = payment in PaymentName;

    if (!isValidPayment) {
      throw new Error('BAD_REQUEST');
    }

    // 检查资源类型
    const isValidResourceType = ['post', 'subscription'].includes(resourceType);

    if (!isValidResourceType) {
      throw new Error('BAD_REQUEST');
    }

    // 检查资源
    if (resourceType === 'post') {
      const post = await getPostById(resourceId, {
        currentUser: { id: userId },
      });

      const isValidPost = post && post.status === PostStatus.published;

      if (!isValidPost) {
        throw new Error('BAD_REQUEST');
      }
    }

    // 检查产品
    const product = await getProductById(productId);

    const isValidProduct =
      product && product.status === ProductStatus.published;

    if (!isValidProduct) {
      throw new Error('BAD_REQUEST');
    }

    // 准备订单数据
    const order = {
      userId,
      productId,
      status: OrderStatus.pending,
      payment,
      totalAmount: product.salePrice,
    };

    // 设置请求主体
    request.body = {
      ...request.body,
      order,
      product,
    };
  } catch (error) {
    return next(error);
  }

  // 下一步
  next();
};

/**
 * 更新订单守卫
 */
export const updateOrderGuard = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 解构数据
  const {
    params: { orderId },
    body: { payment },
  } = request;

  try {
    // 检查支付方法
    const isValidPayment = payment && payment in PaymentName;

    if (!isValidPayment) {
      throw new Error('BAD_REQUEST');
    }

    // 检查订单
    const order = await getOrderById(parseInt(orderId, 10));
    const isValidOrder =
      order &&
      order.status === OrderStatus.pending &&
      order.payment !== payment;

    if (!isValidOrder) {
      throw new Error('BAD_REQUEST');
    }

    // 准备主体数据
    request.body = {
      dataForUpdate: {
        payment,
      },
      order,
    };
  } catch (error) {
    return next(error);
  }

  // 下一步
  next();
};
