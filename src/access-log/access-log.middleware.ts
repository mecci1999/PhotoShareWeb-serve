import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { createAccessLog, getSumData } from './access-log.service';

/**
 * 访问日志
 */
interface AccessLogOptions {
  action: string;
  resourceType?: string;
  resourceParamName?: string;
  payloadParam?: string;
}

interface SumDataOptions {
  value: number;
}

export const accessLog = (options: AccessLogOptions) => async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 解构选项
  const { action, resourceType, resourceParamName, payloadParam } = options;

  let payload = null;

  if (payloadParam) {
    payload = _.get(request, payloadParam, null);
  }

  // // 判断当前是不是游客访问
  // if (request.user.name === 'anonymous') {
  // }

  // 当前用户
  const { id: userId, name: userName } = request.user;

  // 资源 ID
  let resourceId;
  if (resourceType === 'comment') {
    resourceId = _.get(request, resourceParamName, null);
  } else {
    resourceId = resourceParamName
      ? parseInt(request.params[resourceParamName], 10)
      : null;
  }

  // 头部数据
  const {
    referer,
    origin,
    'user-agent': agent,
    'access-language': language,
  } = request.headers;

  // 请求
  const {
    ip,
    originalUrl,
    method,
    query,
    params,
    route: { path },
  } = request;

  const data = (await getSumData(action)) as SumDataOptions;

  // 日志数据
  const accessLog = {
    userId,
    userName,
    action,
    resourceType,
    resourceId,
    payload,
    ip,
    origin,
    referer,
    agent,
    language,
    originalUrl,
    method,
    query: Object.keys(query).length ? JSON.stringify(query) : null,
    params: Object.keys(params).length ? JSON.stringify(params) : null,
    path,
    sumData: data.value,
  };

  // 创建日志
  createAccessLog(accessLog);

  // 下一步
  next();
};
