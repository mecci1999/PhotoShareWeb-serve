import { connection } from '../app/database/mysql';
import { productModel } from './product.model';

/**
 * 按类型调取产品
 */
export interface GetProductByTypeOptions {
  meta?: {
    subscriptionType: string;
  };
}

export const getProductByType = async (
  type: string,
  options: GetProductByTypeOptions = {},
) => {
  // 解构选项
  const { meta } = options;

  // SQL 参数
  const params = [type];

  // 订阅类型条件
  let andWhereSubscriptionType = '';

  if (meta && meta.subscriptionType) {
    andWhereSubscriptionType = `AND JSON_EXTRACT(product.meta, "$.subscriptionType") = ?`;
    params.push(meta.subscriptionType);
  }

  // 准备查询
  const statement = `
    SELECT
      product.id,
      product.type,
      product.title,
      product.description,
      product.price,
      product.salePrice,
      product.meta
    FROM
      product
    WHERE
      product.type = ?
      AND product.status = "published"
      ${andWhereSubscriptionType}
    ORDER BY
      product.id DESC
    LIMIT 1
  `;

  // 执行查询
  const [data] = await connection.promise().query(statement, params);

  // 提供数据
  return data[0] as productModel;
};
