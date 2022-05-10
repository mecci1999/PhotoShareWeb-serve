import { Request, Response, NextFunction } from 'express';
import {
  getAccessCountByAction,
  getAccessCounts,
  GetAccessCountsOptions,
  getActionTypeSum,
  getAdminContentCardAction,
  getIncomeByDateTime,
} from './dashboard.service';

/**
 * 访问次数列表
 */
export const accessCountIndex = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { filter } = request;

  try {
    const accessCounts = await getAccessCounts({
      filter,
    } as GetAccessCountsOptions);

    // 做出响应
    response.send(accessCounts);
  } catch (error) {
    next(error);
  }
};

/**
 * 按动作分时段访问次数
 */
export const accessCountShow = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    params: { action },
    filter,
  } = request;

  // 调用服务方法
  try {
    const accessCount = await getAccessCountByAction({ action, filter });

    // 做出响应
    response.send(accessCount);
  } catch (error) {
    next(error);
  }
};

/**
 * 访问次数列表
 */
export const accessCountIndexAdmin = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    filter,
    query: { range },
  } = request;

  try {
    const accessCounts = await getAdminContentCardAction({
      filter,
      range,
    } as GetAccessCountsOptions);

    // 拿到总用户量
    const globalUserAmount = await getActionTypeSum('createUser');
    // 拿到总素材量
    const globalPostAmount = await getActionTypeSum('createPost');
    // 拿到总订单量
    const globalOrderAmount = await getActionTypeSum('createOrder');
    // 拿到总用户活跃量
    const globalLoginAmount = await getActionTypeSum('login');
    // 拿到总网站访问量
    const globalAppAccessAmount = await getActionTypeSum('getPosts');
    // 拿到总内容访问量
    const globalPostAccessAmount = await getActionTypeSum('getPostById');
    // 拿到总下载量
    const globalDownloadAmount = await getActionTypeSum('createDownload');
    // 拿到总评论量
    const globalCommentAmount = await getActionTypeSum('createComment');
    // 拿到总点赞量
    const globalLikeAmount = await getActionTypeSum('createUserLikePost');

    const result = accessCounts.map(item => {
      switch (item.action) {
        case 'createUser':
          item.sumCount = globalUserAmount.sumCount;
          break;
        case 'createPost':
          item.sumCount = globalPostAmount.sumCount;
          break;
        case 'createOrder':
          item.sumCount = globalOrderAmount.sumCount;
          break;
        case 'login':
          item.sumCount = globalLoginAmount.sumCount;
          break;
        case 'getPosts':
          item.sumCount = globalAppAccessAmount.sumCount;
          break;
        case 'getPostById':
          item.sumCount = globalPostAccessAmount.sumCount;
          break;
        case 'createDownload':
          item.sumCount = globalDownloadAmount.sumCount;
          break;
        case 'createComment':
          item.sumCount = globalCommentAmount.sumCount;
          break;
        case 'createUserLikePost':
          item.sumCount = globalLikeAmount.sumCount;
          break;
      }

      return item;
    });

    // 做出响应
    response.send(result);
  } catch (error) {
    next(error);
  }
};

/**
 * 得到订单相关的数据
 */
export const getOrderData = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { filter } = request;

  try {
    const data = await getIncomeByDateTime({
      filter,
    } as GetAccessCountsOptions);
    console.log(data);

    if (data && data.value === null) {
      data.value = 0;
    }

    const result = {
      title: '新增收益',
      ...data,
      icon: 'add_shopping_cart',
    };

    // 做出响应
    response.send(result);
  } catch (error) {
    next(error);
  }
};
