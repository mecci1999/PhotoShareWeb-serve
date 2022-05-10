import { connection } from '../app/database/mysql';
import {
  AccessCountListItem,
  allowedAccessCounts,
  allowedActionAdminGlobal,
  allowedActionAdminPost,
  allowedActionAdminUser,
} from './dashboard.provider';

/**
 * 访问次数列表
 */
export interface GetAccessCountsOptions {
  filter: {
    name: string;
    sql?: string;
    param?: string;
  };
  range?: string;
}

export const getAccessCounts = async (options: GetAccessCountsOptions) => {
  // 解构数据
  const {
    filter: { sql: whereDateTimeRange },
  } = options;

  // 允许的动作
  const allowedActions = allowedAccessCounts
    .map(accessCount => accessCount.action)
    .map(action => `'${action}'`)
    .join(',');

  // 允许的动作条件
  const andWhereActionIn = `AND action IN (${allowedActions})`;

  // 准备查询
  const statement = `
    SELECT
      access_log.action,
      COUNT(access_log.id) AS value
    FROM
      access_log
    WHERE
      ${whereDateTimeRange} ${andWhereActionIn}
    GROUP BY
      access_log.action
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement);

  // 提供数据
  const results = data as Array<AccessCountListItem>;

  return allowedAccessCounts.map(accessCount => {
    const result = results.find(result => result.action === accessCount.action);
    accessCount.value = result && result.value ? result.value : 0;
    return accessCount;
  });
};

/**
 * 按动作分时段访问次数
 */
interface GetAccessCountByAcitonResult {
  action: string;
  datetime: string;
  value: number;
}

interface AccessCount {
  title: string;
  action: string;
  dateset: [Array<string>, Array<number>];
}

interface GetAccessCountByActionOptions {
  action: string;
  filter: {
    name: string;
    sql?: string;
    param?: string | Array<string | number>;
  };
}

export const getAccessCountByAction = async (
  options: GetAccessCountByActionOptions,
) => {
  // 解构选项
  const {
    action,
    filter: { sql: whereDateTimeRange, param: dateTimeFormat },
  } = options;

  // 查询条件
  const andWhereAction = `AND access_log.action = ?`;

  // SQL 参数
  const params = [action];

  // 准备查询
  const statement = `
    SELECT
      access_log.action,
      DATE_FORMAT(access_log.created, '${dateTimeFormat}') AS datetime,
      COUNT(access_log.id) AS value
    FROM
      access_log
    WHERE
      ${whereDateTimeRange} ${andWhereAction}
    GROUP BY
      access_log.action,
      DATE_FORMAT(access_log.created, '${dateTimeFormat}')
    ORDER BY
      DATE_FORMAT(access_log.created, '${dateTimeFormat}')
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, params);

  const results = data as Array<GetAccessCountByAcitonResult>;

  // 数据集合
  const dateset = results.reduce(
    (accumulator, result) => {
      const [datetimeArray, valueArray] = accumulator;
      datetimeArray.push(result.datetime);
      valueArray.push(result.value);
      return accumulator;
    },
    [[], []],
  );

  //动作标题
  const title = allowedAccessCounts.find(
    accessCount => accessCount.action === action,
  ).title;

  // 提供数据
  return { title, action, dateset } as AccessCount;
};

/**
 * 管理员新增显示接口
 */
export const getAdminContentCardAction = async (
  options: GetAccessCountsOptions,
) => {
  // 解构数据
  const {
    filter: { sql: whereDateTimeRange },
    range,
  } = options;

  // 允许的动作
  const allowedActions = allowedAccessCounts
    .map(accessCount => accessCount.action)
    .map(action => `'${action}'`)
    .join(',');

  // 允许的动作条件
  const andWhereActionIn = `AND action IN (${allowedActions})`;

  // 准备查询
  const statement = `
    SELECT
      access_log.action,
      COUNT(access_log.id) AS value
    FROM
      access_log
    WHERE
      ${whereDateTimeRange} ${andWhereActionIn}
    GROUP BY
      access_log.action
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement);

  // 提供数据
  const results = data as Array<AccessCountListItem>;

  let item;
  switch (range) {
    case 'global':
      item = allowedActionAdminGlobal;
      break;
    case 'user':
      item = allowedActionAdminUser;
      break;
    case 'post':
      item = allowedActionAdminPost;
      break;
  }

  return item.map(accessCount => {
    const result = results.find(result => result.action === accessCount.action);
    accessCount.value = result && result.value ? result.value : 0;
    return accessCount;
  });
};

// 根据不同动作获取总数据
export const getActionTypeSum = async (action: string) => {
  let selectedActionType: string;
  let sql: string;
  let whereAccessLog: string = '';

  switch (action) {
    case 'createUser':
      selectedActionType = 'user';
      sql = `COUNT(${selectedActionType}.id)`;
      break;
    case 'createPost':
      selectedActionType = 'post';
      sql = `COUNT(${selectedActionType}.id)`;
      break;
    case 'createOrder':
      selectedActionType = '`order`';
      sql = `COUNT(${selectedActionType}.id)`;
      break;
    case 'login':
      selectedActionType = `access_log`;
      sql = `COUNT(${selectedActionType}.id)`;
      whereAccessLog = `WHERE access_log.action = 'login'`;
      break;
    case 'getPosts':
      selectedActionType = `access_log`;
      sql = `COUNT(${selectedActionType}.id)`;
      whereAccessLog = `WHERE access_log.action = 'getPosts'`;
      break;
    case 'getPostById':
      selectedActionType = `access_log`;
      sql = `COUNT(${selectedActionType}.id)`;
      whereAccessLog = `WHERE access_log.action = 'getPostById'`;
      break;
    case 'createDownload':
      selectedActionType = `download`;
      sql = `COUNT(${selectedActionType}.id)`;
      break;
    case 'createComment':
      selectedActionType = `comment`;
      sql = `COUNT(${selectedActionType}.id)`;
      break;
    case 'createUserLikePost':
      selectedActionType = `user_like_post`;
      sql = `COUNT(user_like_post.userId)`;
      break;
  }

  // 准备查询
  const statement = `
      SELECT
        ${sql} AS sumCount
      FROM
        ${selectedActionType}
      ${whereAccessLog}
    `;

  // 执行查询
  const [data] = await connection.promise().query(statement);

  // 提供数据
  return JSON.parse(JSON.stringify(data[0]));
};

/**
 * 获取不同时期的收益以及总收益
 */
export const getIncomeByDateTime = async (options: GetAccessCountsOptions) => {
  // 解构数据
  const {
    filter: { sql: whereDateTimeRange },
  } = options;

  // 准备查询
  const statement = `
    SELECT
      SUM(\`order\`.totalAmount) AS value,
      (
      	SELECT
      	 SUM(\`order\`.totalAmount)
      	FROM
        \`order\`
        WHERE \`order\`.status = 'completed'
      ) AS sumCount
    FROM
    \`order\`
    WHERE
      ${whereDateTimeRange} AND \`order\`.status = 'completed'
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement);

  // 提供数据
  return data[0];
};
