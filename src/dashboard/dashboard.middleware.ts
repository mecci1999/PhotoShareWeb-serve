import { Request, Response, NextFunction } from 'express';
import { allowedAccessCounts } from './dashboard.provider';

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
      filter.param = '%Y%m%d';
      break;
    case '1-month':
      filter.sql = 'access_log.created > now() - INTERVAL 1 MONTH';
      filter.param = '%Y%m%d';
      break;
    case '3-month':
      filter.sql = 'access_log.created > now() - INTERVAL 3 MONTH';
      filter.param = '%Y%m';
      break;
    case '6-month':
      filter.sql = 'access_log.created > now() - INTERVAL 6 MONTH';
      filter.param = '%Y%m';
      break;
    case '1-year':
      filter.sql = 'access_log.created > now() - INTERVAL 1 YEAR';
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

/**
 * 访问次数过滤器
 */
export const orderDateFilter = async (
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
      filter.sql = '`order`.updated > now() - INTERVAL 1 DAY';
      filter.param = '%Y%m%d%H';
      break;
    case '7-day':
      filter.sql = '`order`.updated > now() - INTERVAL 7 DAY';
      filter.param = '%Y%m%d';
      break;
    case '1-month':
      filter.sql = '`order`.updated > now() - INTERVAL 1 MONTH';
      filter.param = '%Y%m%d';
      break;
    case '3-month':
      filter.sql = '`order`.updated > now() - INTERVAL 3 MONTH';
      filter.param = '%Y%m';
      break;
    case '6-month':
      filter.sql = '`order`.updated > now() - INTERVAL 6 MONTH';
      filter.param = '%Y%m';
      break;
    case '1-year':
      filter.sql = '`order`.updated > now() - INTERVAL 1 YEAR';
      filter.param = '%Y%m';
      break;
    default:
      filter.sql = '`order`.updated > now() - INTERVAL 1 DAY';
      filter.param = '%Y%m%d%H';
      break;
  }

  request.filter = filter;

  // 下一步
  next();
};

/**
 * 访问次数守卫
 */
export const accessCountsGuard = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const {
    params: { action },
  } = request;

  const allowedAccessCountsActions = allowedAccessCounts.map(
    accessCount => accessCount.action,
  );

  const isAllowedAction = allowedAccessCountsActions.includes(action);

  if (!isAllowedAction) {
    next(new Error('BAD_REQUEST'));
  }

  // 下一步
  next();
};

/**
 * 改变时间显示问题的中间件
 */
export interface changeDateTimeOption {
  datetimeArray: Array<string>;
  valueArray: Array<number>;
}
