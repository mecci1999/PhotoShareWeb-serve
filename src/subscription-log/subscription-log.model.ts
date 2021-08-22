export enum SubscriptionLogAction {
  create = 'create',
  upgrade = 'upgrade',
  renew = 'renew',
  resubscribe = 'resubscribe',
  statusChanged = 'statusChanged',
  renewed = 'renewed',
  upgraded = 'upgraded',
  resubscribed = 'resubscribed',
}

export class SubscriptionLogModel {
  id?: number;
  subscriptionId?: number;
  userId?: number;
  orderId?: number;
  action?: SubscriptionLogAction;
  meta?: any;
  created?: string;
}
