import express, { request, response } from 'express';
import { getOrderById } from '../order/order.service';
import { paymentRecived } from '../payment/payment.service';
import { productType } from '../product/product.model';
import { getProductById } from '../product/product.service';
import { postProcessSubscription } from '../subscription/subscription.service';
import { UserMetaType } from '../user_meta/user-mate.model';
import {
  createUserMeta,
  getUserMetaByWeixinUnionId,
  updateUserMeta,
} from '../user_meta/user-meta.service';
import { logger, xmlBuilder, xmlParser } from './app.service';

const router = express.Router();

router.get('/', (request, response) => {
  response.send({ title: '小白兔的开发之路' });
});

router.post('/echo', async (request, response) => {
  const xmlDate = xmlBuilder.buildObject({
    message: '您好!',
  });

  logger.info('xmlDate', xmlDate);

  const data = await xmlParser.parseStringPromise(xmlDate);

  logger.debug('data', data);

  response.status(201);
});

router.post('/payments/notify', async (request, response) => {
  // const { orderId } = request.body;
  // await paymentRecived(orderId, { message: '通知信息 ~~' });

  response.sendStatus(200);
});
/**
 * 导出默认接口
 */
export default router;
