import { Request, Response, NextFunction } from 'express';
import {
  allowedActionUserOther,
  allowedActionUserPost,
} from './dashboard.provider';
import {
  getAccessCountByAction,
  getPostAccessCounts,
  GetAccessCountsOptions,
  getActionTypeSum,
  getIncomeByDateTime,
  getAdminContentCardAction,
  getSumDataByAction,
  getAddIncomeByDatetime,
  getCommentAccessCounts,
  getLikeAccessCounts,
  getSumPostAccessCounts,
  getSumCommentAccessCounts,
  getSumLikeAccessCounts,
  addIncomeUser,
  addIncomeUserSum,
  createDownloadUser,
  createDownloadUserSum,
  createPostUser,
  createPostUserSum,
  getAccessCountsByDateTime,
  getCreatePostByDateTime,
  getPostDownloadByDateTime,
  getAddIncomeByDateTime,
} from './dashboard.service';

/**
 * 用户作品访问次数列表
 */
export const accessCountIndex = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    filter,
    query: { range },
    user: { id: userId },
  } = request;

  try {
    let item;
    switch (range) {
      case 'post':
        item = allowedActionUserPost;
        break;
      case 'other':
        item = allowedActionUserOther;
        break;
    }

    // 得到用户作品访问次数
    const post = await getPostAccessCounts({
      filter,
      userId,
    } as GetAccessCountsOptions);

    const postSum = await getSumPostAccessCounts({
      userId,
    } as GetAccessCountsOptions);

    // 得到用户作品评论数量
    const comment = await getCommentAccessCounts({
      filter,
      userId,
    } as GetAccessCountsOptions);

    const commentSum = await getSumCommentAccessCounts({
      userId,
    } as GetAccessCountsOptions);

    // 得到用户作品评论数量
    const like = await getLikeAccessCounts({
      filter,
      userId,
    } as GetAccessCountsOptions);

    const likeSum = await getSumLikeAccessCounts({
      userId,
    } as GetAccessCountsOptions);

    // 得到用户作品评论数量
    const income = await addIncomeUser({
      filter,
      userId,
    } as GetAccessCountsOptions);

    const incomeSum = await addIncomeUserSum({
      userId,
    } as GetAccessCountsOptions);

    // 得到用户作品评论数量
    const download = await createDownloadUser({
      filter,
      userId,
    } as GetAccessCountsOptions);

    const downloadSum = await createDownloadUserSum({
      userId,
    } as GetAccessCountsOptions);

    // 得到用户作品评论数量
    const createPost = await createPostUser({
      filter,
      userId,
    } as GetAccessCountsOptions);

    const createPostSum = await createPostUserSum({
      userId,
    } as GetAccessCountsOptions);

    item.map(accessCount => {
      if (accessCount.action === 'getPostById') {
        let result = post.find(item => item.action === accessCount.action);
        let sum = postSum.find(item => item.action === accessCount.action);
        accessCount.value = result && result.value ? result.value : 0;
        accessCount.sumCount = sum && sum.sumCount ? sum.sumCount : 0;
      }

      if (accessCount.action === 'createComment') {
        let result = comment.find(item => item.action === accessCount.action);
        let sum = commentSum.find(item => item.action === accessCount.action);
        accessCount.value = result && result.value ? result.value : 0;
        accessCount.sumCount = sum && sum.sumCount ? sum.sumCount : 0;
      }

      if (accessCount.action === 'createUserLikePost') {
        let result = like.find(item => item.action === accessCount.action);
        let sum = likeSum.find(item => item.action === accessCount.action);
        accessCount.value = result && result.value ? result.value : 0;
        accessCount.sumCount = sum && sum.sumCount ? sum.sumCount : 0;
      }

      if (accessCount.action === 'addIncome') {
        let result = income.find(item => item.action === accessCount.action);
        let sum = incomeSum.find(item => item.action === accessCount.action);
        accessCount.value = result && result.value ? result.value : 0;
        accessCount.sumCount = sum && sum.sumCount ? sum.sumCount : 0;
      }

      if (accessCount.action === 'createDownload') {
        let result = download.find(item => item.action === accessCount.action);
        let sum = downloadSum.find(item => item.action === accessCount.action);
        accessCount.value = result && result.value ? result.value : 0;
        accessCount.sumCount = sum && sum.sumCount ? sum.sumCount : 0;
      }

      if (accessCount.action === 'createPost') {
        let result = createPost.find(
          item => item.action === accessCount.action,
        );
        let sum = createPostSum.find(
          item => item.action === accessCount.action,
        );
        accessCount.value = result && result.value ? result.value : 0;
        accessCount.sumCount = sum && sum.sumCount ? sum.sumCount : 0;
      }

      return accessCount;
    });

    // 做出响应
    response.send(item);
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
 * 用户按动作分时段访问次数
 */
export const accessCountShowUser = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    params: { action },
    filter,
    user: { id: userId },
  } = request;

  // 调用服务方法
  try {
    // 作品相关动作
    if (
      action === 'getPostById' ||
      action === 'createComment' ||
      action === 'createUserLikePost'
    ) {
      const accessCount = await getAccessCountsByDateTime({
        action,
        filter,
        userId,
      });

      // 做出响应
      response.send(accessCount);
    }

    // 新增收益
    if (action === 'addIncome') {
      const accessCount = await getAddIncomeByDateTime({
        action,
        filter,
        userId,
      });

      // 做出响应
      response.send(accessCount);
    }

    // 作品下载
    if (action === 'createDownload') {
      const accessCount = await getPostDownloadByDateTime({
        action,
        filter,
        userId,
      });

      // 做出响应
      response.send(accessCount);
    }

    // 发布作品
    if (action === 'createPost') {
      const accessCount = await getCreatePostByDateTime({
        action,
        filter,
        userId,
      });

      // 做出响应
      response.send(accessCount);
    }
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

    if (data && data.value === null) {
      data.value = 0;
    }

    const result = {
      action: 'addIncome',
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

/**
 * 获取不同时间段的数据总数
 */
export const getSumDataByDatetime = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    params: { action },
    filter,
  } = request;

  try {
    const sumData = await getSumDataByAction({ action, filter });

    response.send(sumData);
  } catch (error) {
    next(error);
  }
};

/**
 * 获取不同时间段的订单收益
 */
export const AddIncomeAccessCount = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { filter } = request;

  try {
    const data = await getAddIncomeByDatetime({ filter });

    response.send(data);
  } catch (error) {
    next(error);
  }
};
