export enum SubscriptionLogAction {
  create = 'create',
  upgrade = 'upgrade',
  renew = 'renew',
  resubscribe = 'resubscribe',
  statusChanged = 'statusChanged',
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
