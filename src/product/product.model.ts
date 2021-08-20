export enum productType {
  license = 'license',
  subscription = 'subscription',
}

export enum ProductStatus {
  published = 'published',
  draft = 'draft',
  archived = 'archived',
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
  status?: ProductStatus;
  created?: Date;
  updated?: Date;
}
