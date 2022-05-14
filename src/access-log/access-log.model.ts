export interface AccessLogModel {
  id?: number;
  userId?: number | null;
  userName?: string;
  action?: string;
  resourceType?: string;
  resourceId?: number | null;
  payload?: string;
  ip?: string;
  origin?: string | string[];
  referer?: string;
  agent?: string;
  language?: string | string[];
  originalUrl?: string;
  method?: string;
  query?: Object | null;
  params?: Object | null;
  sumData?: number | null;
  created?: number;
}
