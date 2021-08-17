import { Request, Response, NextFunction } from 'express';
import { prossess } from '../auth/auth.service';
import { AuditLogStatus } from './audit-log.model';
import { getAuditLogByResource } from './audit-log.service';

/**
 * 审核日志守卫
 */
export const auditLogGuard = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备用户
  const { id: userId, name: userName } = request.user;

  // 准备数据
  const { resourceType, resourceId, note, status } = request.body;

  // 验证资源类型
  const isValidResourceType = ['post', 'comment'].includes(resourceType);

  if (!isValidResourceType) return next(new Error('BAD_REQUEST'));

  // 准备日志数据
  request.body = {
    userId,
    userName,
    resourceType,
    resourceId,
    status,
    note,
  };

  // 管理员
  const isAdmin = userId === 1;

  if (!isAdmin) {
    request.body.status = AuditLogStatus.pending;

    // 检查是否拥有资源
    try {
      const ownResource = await prossess({ resourceId, resourceType, userId });

      if (!ownResource) return next(new Error('USER_DOES_NOT_OWN_RESOURCE'));
    } catch (error) {
      return next(error);
    }
  }

  // 检查审核日志状态是否相同
  try {
    const [auditLog] = await getAuditLogByResource({
      resourceType,
      resourceId,
    });

    const isSameStatus = auditLog && auditLog.status === status;

    // 进行判断
    if (isSameStatus) {
      return next(new Error('BAD_REQUEST'));
    }
  } catch (error) {
    return next(error);
  }

  // 下一步
  next();
};
