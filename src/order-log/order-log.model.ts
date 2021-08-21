export enum OrderLogAciton {
  orderCreated = 'orderCreated',
  orderUpdated = 'orderUpdated',
  orderStatusChanged = 'orderStatusChanged',
  orderPaymentRecived = 'orderPaymentRecived',
}

export class OrderLogModel {
  id?: number;
  userId?: number;
  orderId?: number;
  action?: OrderLogAciton;
  meta?: any;
  created?: string;
}
