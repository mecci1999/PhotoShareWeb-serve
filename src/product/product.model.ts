export enum productType {
  license = 'license',
  subscription = 'subscription',
}

export interface productModel {
  id?: number;
  userId?: number;
  type?: productType;
  title?: string;
  description?: Array<string>;
  price?: number;
  salePrice?: number;
  meta?: any;
  created?: Date;
  updated?: Date;
}
