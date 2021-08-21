import { Request, Response, NextFunction } from 'express';
import {
  getLicenses,
  getLicensesTotalCount,
  getUserValidLicense,
} from './license.service';

/**
 * 用户有效许可证
 */
export const ValidLisence = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 解构数据
  const {
    user: { id: userId },
    query: { resourceType, resourceId },
  } = request;

  try {
    const data = await getUserValidLicense(
      userId,
      `${resourceType}`,
      parseInt(`${resourceId}`, 10),
    );

    // 作出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 许可证列表
 */
export const index = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const {
    user: { id: userId },
    pagination,
  } = request;

  // 过滤器
  const filters = {
    user: userId,
  };

  try {
    const licenses = await getLicenses({ filters, pagination });

    const totalCount = await getLicensesTotalCount({ filters });

    // 设置响应头部
    response.header('X-Total-Count', totalCount);

    // 做出响应
    response.send(licenses);
  } catch (error) {
    next(error);
  }
};
