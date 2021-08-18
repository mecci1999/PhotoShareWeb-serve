import { Request, Response, NextFunction } from 'express';

/**
 * 访问次数过滤器
 */
export const accessCountFilter = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { dateTimeRange = '1-day' } = request.query;

  const filter = {
    name: 'dateTimeRange',
    sql: '',
    param: '',
  };

  switch (dateTimeRange) {
    case '1-day':
      filter.sql = 'access_log.created > now() - INTERVAL 1 DAY';
      filter.param = '%Y%m%d%H';
      break;
    case '7-day':
      filter.sql = 'access_log.created > now() - INTERVAL 7 DAY';
      filter.param = '%Y%m%d%H';
      break;
    case '1-month':
      filter.sql = 'access_log.created > now() - INTERVAL 1 MONTH';
      filter.param = '%Y%m%d';
      break;
    case '3-month':
      filter.sql = 'access_log.created > now() - INTERVAL 3 MONTH';
      filter.param = '%Y%m';
      break;
    default:
      filter.sql = 'access_log.created > now() - INTERVAL 1 DAY';
      filter.param = '%Y%m%d%H';
      break;
  }

  request.filter = filter;

  // 下一步
  next();
};
