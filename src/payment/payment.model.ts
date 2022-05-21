export enum PaymentName {
  wxpay = 'wxpay',
  alipay = 'alipay',
  amount = 'amount',
}

export enum PaymentStatus {
  published = 'published',
  draft = 'draft',
  archived = 'archived',
}

export interface PaymentMeta {
  color?: string;
  buttonText?: string;
  canOffsite?: boolean;
}

export class paymentModel {
  id?: number;
  name?: PaymentName;
  title?: string;
  description?: string;
  index?: number;
  meta?: PaymentMeta;
  status?: PaymentStatus;
}
