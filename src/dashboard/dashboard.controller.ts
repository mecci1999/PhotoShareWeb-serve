import { Request, Response, NextFunction } from 'express';
import { getAccessCounts, GetAccessCountsOptions } from './dashboard.service';

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
