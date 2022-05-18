import { connection } from '../app/database/mysql';
import {
  AccessCountListItem,
  allowedAccessCounts,
  allowedActionAdminGlobal,
  allowedActionAdminPost,
  allowedActionAdminUser,
  allowedActionUserOther,
  allowedActionUserPost,
} from './dashboard.provider';

/**
 * 访问次数列表
 */
export interface GetAccessCountsOptions {
  filter: {
    name?: string;
    sql?: string;
    param?: string | Array<string | number> | null;
  };
  range?: string;
  userId?: number;
}

// 得到用户作品访问次数
export const getPostAccessCounts = async (options: GetAccessCountsOptions) => {
  // 解构数据
  const {
    filter: { sql: whereDateTimeRange },
    userId,
  } = options;

  // 准备查询
  const statement = `
    SELECT
      access_log.action,
      COUNT(access_log.id) AS value
    FROM
      access_log
    LEFT JOIN post ON post.id = access_log.resourceId
    WHERE
      ${whereDateTimeRange} AND access_log.action = 'getPostById' AND post.userId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

  // 提供数据
  const results = data as Array<AccessCountListItem>;

  return results;
};

// 得到用户作评论数
export const getCommentAccessCounts = async (
  options: GetAccessCountsOptions,
) => {
  // 解构数据
  const {
    filter: { sql: whereDateTimeRange },
    userId,
  } = options;

  // 准备查询
  const statement = `
    SELECT
      access_log.action,
      COUNT(access_log.id) AS value
    FROM
      access_log
    LEFT JOIN comment ON comment.id = access_log.resourceId
    LEFT JOIN post ON post.id = comment.postId
    WHERE
      ${whereDateTimeRange} AND access_log.action = 'createComment' AND post.userId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

  // 提供数据
  const results = data as Array<AccessCountListItem>;

  return results;
};

// 得到用户作品点赞次数
export const getLikeAccessCounts = async (options: GetAccessCountsOptions) => {
  // 解构数据
  const {
    filter: { sql: whereDateTimeRange },
    userId,
  } = options;

  // 准备查询
  const statement = `
    SELECT
      access_log.action,
      COUNT(access_log.id) AS value
    FROM
      access_log
    LEFT JOIN user_like_post ON user_like_post.postId = access_log.resourceId
    LEFT JOIN post ON post.id = user_like_post.postId
    WHERE
      ${whereDateTimeRange} AND access_log.action = 'createUserLikePost' AND post.userId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

  // 提供数据
  const results = data as Array<AccessCountListItem>;

  return results;
};

// 得到用户作品总访问次数
export const getSumPostAccessCounts = async (
  options: GetAccessCountsOptions,
) => {
  // 解构数据
  const { userId } = options;

  // 准备查询
  const statement = `
    SELECT
      access_log.action,
      COUNT(access_log.id) AS sumCount
    FROM
      access_log
    LEFT JOIN post ON post.id = access_log.resourceId
    WHERE
      access_log.action = 'getPostById' AND post.userId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

  // 提供数据
  const results = data as Array<AccessCountListItem>;

  return results;
};

// 得到用户作品总评论数
export const getSumCommentAccessCounts = async (
  options: GetAccessCountsOptions,
) => {
  // 解构数据
  const { userId } = options;

  // 准备查询
  const statement = `
  SELECT
    access_log.action,
    COUNT(access_log.id) AS sumCount
  FROM
    access_log
  LEFT JOIN comment ON comment.id = access_log.resourceId
  LEFT JOIN post ON post.id = comment.postId
  WHERE access_log.action = 'createComment' AND post.userId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

  // 提供数据
  const results = data as Array<AccessCountListItem>;

  return results;
};

// 得到用户作品点赞总次数
export const getSumLikeAccessCounts = async (
  options: GetAccessCountsOptions,
) => {
  // 解构数据
  const { userId } = options;

  // 准备查询
  const statement = `
  SELECT
    access_log.action,
    COUNT(access_log.id) AS sumCount
  FROM
    access_log
  LEFT JOIN user_like_post ON user_like_post.postId = access_log.resourceId
  LEFT JOIN post ON post.id = user_like_post.postId
  WHERE access_log.action = 'createUserLikePost' AND post.userId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

  // 提供数据
  const results = data as Array<AccessCountListItem>;

  return results;
};

/**
 * 用户新增收益
 */
export const addIncomeUser = async (options: GetAccessCountsOptions) => {
  // 解构数据
  const {
    filter: { sql: whereDateTimeRange },
    userId,
  } = options;

  // 准备查询
  const statement = `
  SELECT
  'addIncome' as action,
  IF(SUM(\`order\`.totalAmount) > 0,SUM(\`order\`.totalAmount), 0) as value
  FROM
    license
  LEFT JOIN \`order\` ON \`order\`.id = license.orderId
  LEFT JOIN post ON post.id = license.resourceId
  WHERE
    ${whereDateTimeRange.replace(
      'access_log',
      'license',
    )} AND license.status = 'valid' AND \`order\`.status = 'completed' AND post.userId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

  // 提供数据
  const results = data as Array<AccessCountListItem>;

  return results;
};

/**
 * 用户总收益
 */
export const addIncomeUserSum = async (options: GetAccessCountsOptions) => {
  // 解构数据
  const { userId } = options;

  // 准备查询
  const statement = `
  SELECT
  'addIncome' as action,
  IF(SUM(\`order\`.totalAmount) > 0,SUM(\`order\`.totalAmount), 0) as sumCount
  FROM
    license
  LEFT JOIN \`order\` ON \`order\`.id = license.orderId
  LEFT JOIN post ON post.id = license.resourceId
  WHERE
    license.status = 'valid' AND \`order\`.status = 'completed' AND post.userId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

  // 提供数据
  const results = data as Array<AccessCountListItem>;

  return results;
};

/**
 * 用户作品下载次数
 */
export const createDownloadUser = async (options: GetAccessCountsOptions) => {
  // 解构数据
  const {
    filter: { sql: whereDateTimeRange },
    userId,
  } = options;

  // 准备查询
  const statement = `
  SELECT
    'createDownload' as action,
    COUNT(download.id) as value
  FROM
    download
  LEFT JOIN post ON post.id = download.resourceId
  WHERE
    ${whereDateTimeRange.replace('access_log', 'download')} AND post.userId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

  // 提供数据
  const results = data as Array<AccessCountListItem>;

  return results;
};

/**
 * 用户新增下载总次数
 */
export const createDownloadUserSum = async (
  options: GetAccessCountsOptions,
) => {
  // 解构数据
  const { userId } = options;

  // 准备查询
  const statement = `
  SELECT
    'createDownload' as action,
    COUNT(download.id) as sumCount
  FROM
    download
  LEFT JOIN post ON post.id = download.resourceId
  WHERE
    post.userId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

  // 提供数据
  const results = data as Array<AccessCountListItem>;

  return results;
};

// 得到用户发布作品数量
export const createPostUser = async (options: GetAccessCountsOptions) => {
  // 解构数据
  const {
    filter: { sql: whereDateTimeRange },
    userId,
  } = options;

  // 准备查询
  const statement = `
    SELECT
      access_log.action,
      COUNT(access_log.id) AS value
    FROM
      access_log
    WHERE
      ${whereDateTimeRange} AND access_log.action = 'createPost' AND access_log.userId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

  // 提供数据
  const results = data as Array<AccessCountListItem>;

  return results;
};

// 得到用户发布作品总数量
export const createPostUserSum = async (options: GetAccessCountsOptions) => {
  // 解构数据
  const { userId } = options;

  // 准备查询
  const statement = `
    SELECT
      access_log.action,
      COUNT(access_log.id) AS sumCount
    FROM
      access_log
    WHERE
      access_log.action = 'createPost' AND access_log.userId = ?
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

  // 提供数据
  const results = data as Array<AccessCountListItem>;

  return results;
};

/**
 * 按动作分时段访问次数
 */
interface GetAccessCountByAcitonResult {
  action?: string;
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
  userId?: number;
}

/**
 * 用户不同时间段的访问次数
 */
export const getAccessCountsByDateTime = async (
  options: GetAccessCountByActionOptions,
) => {
  // 解构选项
  const {
    action,
    filter: { sql: whereDateTimeRange, param: dateTimeFormat },
    userId,
  } = options;

  // 查询条件
  const andWhereAction = `AND access_log.action = ?`;

  // SQL 参数
  const params = [action, userId];

  // 根据不同动作定义查询语句
  let andLeftJoin;
  switch (action) {
    case 'getPostById':
      andLeftJoin = 'LEFT JOIN post ON post.id = access_log.resourceId';
      break;
    case 'createComment':
      andLeftJoin = `
      LEFT JOIN comment ON comment.id = access_log.resourceId
      LEFT JOIN post ON post.id = comment.postId`;
      break;
    case 'createUserLikePost':
      andLeftJoin = `
      LEFT JOIN user_like_post ON user_like_post.postId = access_log.resourceId
      LEFT JOIN post ON post.id = user_like_post.postId`;
      break;
  }

  // 准备查询
  const statement = `
    SELECT
      access_log.action,
      DATE_FORMAT(access_log.created, '${dateTimeFormat}') AS datetime,
      COUNT(access_log.id) AS value
    FROM
      access_log
    ${andLeftJoin}
    WHERE
      ${whereDateTimeRange} ${andWhereAction} AND post.userId = ?
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
  const title = allowedActionUserPost.find(
    accessCount => accessCount.action === action,
  ).title;

  // 提供数据
  return { title, action, dateset } as AccessCount;
};

/**
 * 用户不同时间段的收益情况
 */
export const getAddIncomeByDateTime = async (
  options: GetAccessCountByActionOptions,
) => {
  // 解构选项
  const {
    action,
    filter: { sql: whereDateTimeRange, param: dateTimeFormat },
    userId,
  } = options;

  // 准备查询
  const statement = `
    SELECT
    'addIncome' as action,
    DATE_FORMAT(license.created, '${dateTimeFormat}') AS datetime,
    IF(SUM(\`order\`.totalAmount) > 0,SUM(\`order\`.totalAmount), 0) as value
    FROM
      license
    LEFT JOIN \`order\` ON \`order\`.id = license.orderId
    LEFT JOIN post ON post.id = license.resourceId
    WHERE
    ${whereDateTimeRange.replace('access_log', 'license')}
    AND license.status = 'valid'
    AND \`order\`.status = 'completed'
    AND post.userId = ?
    GROUP BY
      DATE_FORMAT(license.created, '${dateTimeFormat}')
    ORDER BY
      DATE_FORMAT(license.created, '${dateTimeFormat}')
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

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
  const title = allowedActionUserOther.find(
    accessCount => accessCount.action === action,
  ).title;

  // 提供数据
  return { title, action, dateset } as AccessCount;
};

/**
 * 用户不同时间段的作品下载次数
 */
export const getPostDownloadByDateTime = async (
  options: GetAccessCountByActionOptions,
) => {
  // 解构选项
  const {
    action,
    filter: { sql: whereDateTimeRange, param: dateTimeFormat },
    userId,
  } = options;

  // 准备查询
  const statement = `
  SELECT
    'createDownload' as action,
    DATE_FORMAT(download.created, '${dateTimeFormat}') AS datetime,
    COUNT(download.id) as value
  FROM
    download
  LEFT JOIN post ON post.id = download.resourceId
  WHERE
    ${whereDateTimeRange.replace('access_log', 'download')} AND post.userId = ?
  GROUP BY
    DATE_FORMAT(download.created, '${dateTimeFormat}')
  ORDER BY
    DATE_FORMAT(download.created, '${dateTimeFormat}')
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

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
  const title = allowedActionUserOther.find(
    accessCount => accessCount.action === action,
  ).title;

  // 提供数据
  return { title, action, dateset } as AccessCount;
};

/**
 * 用户不同时间段的作品发布次数
 */
export const getCreatePostByDateTime = async (
  options: GetAccessCountByActionOptions,
) => {
  // 解构选项
  const {
    action,
    filter: { sql: whereDateTimeRange, param: dateTimeFormat },
    userId,
  } = options;

  // 准备查询
  const statement = `
  SELECT
    'createPost' as action,
    DATE_FORMAT(access_log.created, '${dateTimeFormat}') AS datetime,
    COUNT(access_log.id) AS value
  FROM
    access_log
  WHERE
    ${whereDateTimeRange} AND access_log.userId = ?
  GROUP BY
    DATE_FORMAT(access_log.created, '${dateTimeFormat}')
  ORDER BY
    DATE_FORMAT(access_log.created, '${dateTimeFormat}')
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, userId);

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
  const title = allowedActionUserOther.find(
    accessCount => accessCount.action === action,
  ).title;

  // 提供数据
  return { title, action, dateset } as AccessCount;
};

/**
 * 管理员模式下不同时间段不同动作的访问数据
 */
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

/**
 * 根据不同动作获取不同时间的数据总数
 */
export const getSumDataByAction = async (
  options: GetAccessCountByActionOptions,
) => {
  // 解构数据
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
      MAX(access_log.sumData) AS value
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
 * 获取不同时段的新增收益数据
 */
export const getAddIncomeByDatetime = async (
  options: GetAccessCountsOptions,
) => {
  // 解构数据
  const {
    filter: { sql: whereDateTimeRange, param: dateTimeFormat },
  } = options;

  // 准备查询
  const statement = `
    SELECT
      DATE_FORMAT(\`order\`.updated, '${dateTimeFormat}') AS datetime,
      SUM(order.totalAmount) AS value
    FROM
      \`order\`
    WHERE
      ${whereDateTimeRange} AND \`order\`.status = 'completed'
    GROUP BY
      DATE_FORMAT(\`order\`.updated, '${dateTimeFormat}')
    ORDER BY
      DATE_FORMAT(\`order\`.updated, '${dateTimeFormat}')
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement);

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

  const title = '新增收益';
  const action = 'addIncome';

  // 提供数据
  return { title, action, dateset } as AccessCount;
};
