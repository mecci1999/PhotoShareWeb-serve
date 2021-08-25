/**
 * 订单查询片断
 */
export const orderSqlFragment = {
  orderFileds: `
    order.id,
    order.payment,
    order.totalAmount,
    order.status,
    order.created,
    order.updated
  `,

  productFiled: `
    JSON_OBJECT(
      'id', product.id,
      'title', product.title,
      'type', product.type
    ) AS product
  `,

  leftJoinTables: `
    LEFT JOIN product ON order.productId = product.id
    LEFT JOIN user ON order.userId = user.id
    LEFT JOIN avatar ON user.id = avatar.userId
    LEFT JOIN license ON order.id = license.orderId
    LEFT JOIN post ON license.resourceId = post.id
  `,
};
