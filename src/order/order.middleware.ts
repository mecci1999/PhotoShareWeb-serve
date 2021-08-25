import { Request, Response, NextFunction } from 'express';
import _, { filter } from 'lodash';
import { getLicenseByOrderId } from '../license/license.service';
import { PaymentName } from '../payment/payment.model';
import { getPostById, PostStatus } from '../post/post.service';
import { ProductStatus, productType } from '../product/product.model';
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

/**
 * 订单支付守卫
 */
export const payOrderGuard = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    params: { orderId },
    user: { id: userId },
  } = request;

  try {
    // 检查订单是否存在
    const order = await getOrderById(parseInt(orderId, 10));
    const isValideOrder = order && order.status === OrderStatus.pending;

    if (!isValideOrder) throw new Error('BAD_REQUEST');

    // 检查用户是否为订单的拥有者
    const isOwner = order.userId === userId;

    if (!isOwner) throw new Error('FORBIDDEN');

    // 设置请求主体
    request.body = { order };
  } catch (error) {
    return next(error);
  }

  // 下一步
  next();
};

/**
 * 订单列表过滤器
 */
export interface OrderIndexAllowedFilter {
  order?: string;
  user?: string;
  payment?: string;
  status?: OrderStatus | string;
  owner?: number;
  created?: Array<string>;
  productType?: productType;
}

export const orderIndexFilter = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 过滤参数
  let filters: OrderIndexAllowedFilter = _.pick(request.query as any, [
    'order',
    'user',
    'payment',
    'status',
  ]);

  // 订单日期
  const { created } = request.query;

  if (created) {
    const dates = decodeURI(`${created}`).split('|');
    filters.created = dates;
  }

  // 当前用户
  const { id: userId } = request.user;
  filters.owner = userId;

  // 管理模式
  const { admin, productType } = request.query as any;
  if (admin === 'true' && userId === 1) {
    delete filters.owner;

    if (productType) {
      filters.productType = productType;
    }
  }

  // 过滤条件 sql
  let filterSql = 'order.id IS NOT NULL';

  // SQL 参数
  let params = [];

  Object.entries(filters).map(item => {
    const [type, value] = item;
    let sql = '';

    switch (type) {
      case 'status':
        sql = 'order.status = ?';
        break;
      case 'order':
        sql = 'order.id = ?';
        break;
      case 'user':
        sql = 'user.name LIKE ?';
        break;
      case 'payment':
        sql = 'order.payment = ?';
        break;
      case 'created':
        sql = 'DATE(order.created) between ? AND ?';
        break;
      case 'owner':
        sql = 'post.userId = ?';
        break;
      case 'productType':
        sql = 'product.type = ?';
        break;
    }
    filterSql = `${filterSql} AND ${sql}`;

    if (Array.isArray(value)) {
      params = [...params, ...value];
    } else {
      params = [...params, value];
    }
  });

  request.filter = {
    name: 'orderIndex',
    sql: filterSql,
    param: params,
  };

  // 下一步
  next();
};

/**
 * 订单许可项目守卫
 */
export const orderLicenseItemGuard = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    params: { orderId },
    user: { id: userId },
  } = request;

  // 放行管理员
  if (userId === 1) next();

  try {
    // 查看许可是否存在
    const license = await getLicenseByOrderId(parseInt(orderId, 10));

    if (!license) throw new Error('BAD_REQUEST');

    const isOwner = userId === license.resource.user.id;

    if (!isOwner) throw new Error('FORBIDDEN');
  } catch (error) {
    return next(error);
  }

  // 下一步
  next();
};
