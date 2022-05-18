export interface AccessCountListItem {
  action: string;
  title?: string;
  value?: number;
  icon?: string;
  sumCount?: number | null;
}

export const allowedAccessCounts: Array<AccessCountListItem> = [
  {
    action: 'getPosts',
    title: '列表访问',
  },
  {
    action: 'getPostById',
    title: '内容访问',
  },
  {
    action: 'createPost',
    title: '新增素材',
  },
  {
    action: 'createComment',
    title: '新增评论',
  },
  {
    action: 'createUser',
    title: '新增用户',
  },
  {
    action: 'createOrder',
    title: '新增订单',
  },
  {
    action: 'createUserLikePost',
    title: '新增点赞',
  },
  {
    action: 'searchTags',
    title: '搜索标签',
  },
  {
    action: 'searchUser',
    title: '搜索用户',
  },
  {
    action: 'searchCamera',
    title: '搜索相机',
  },
  {
    action: 'searchLens',
    title: '搜索镜头',
  },
  {
    action: 'addIncome',
    title: '新增收益',
  },
  {
    action: 'login',
    title: '用户活跃量',
  },
  {
    action: 'createDownload',
    title: '新增下载',
  },
];

/**
 * 管理员获取全站后台相关动作数据
 */
export const allowedActionAdminGlobal: Array<AccessCountListItem> = [
  {
    action: 'createUser',
    title: '新增用户',
    icon: 'perm_identity',
    sumCount: 0,
  },
  {
    action: 'createPost',
    title: '新增素材',
    icon: 'photo_camera',
    sumCount: 0,
  },
  {
    action: 'createOrder',
    title: '新增订单',
    icon: 'cloud_queue',
    sumCount: 0,
  },
];

/**
 * 管理员获取用户后台相关动作数据
 */
export const allowedActionAdminUser: Array<AccessCountListItem> = [
  {
    action: 'createUser',
    title: '新增用户',
    icon: 'person_add',
    sumCount: 0,
  },
  {
    action: 'login',
    title: '用户活跃量',
    icon: 'local_fire_department',
    sumCount: 0,
  },
  {
    action: 'getPosts',
    title: '网站访问量',
    icon: 'perm_identity',
    sumCount: 0,
  },
  {
    action: 'getPostById',
    title: '素材访问量',
    icon: 'local_library',
    sumCount: 0,
  },
];

/**
 * 管理员获取作品后台相关动作数据
 */
export const allowedActionAdminPost: Array<AccessCountListItem> = [
  {
    action: 'createPost',
    title: '新增素材',
    icon: 'photo_camera',
    sumCount: 0,
  },
  {
    action: 'createDownload',
    title: '新增下载',
    icon: 'cloud_queue',
    sumCount: 0,
  },
  {
    action: 'createComment',
    title: '新增评论',
    icon: 'comment',
    sumCount: 0,
  },
  {
    action: 'createUserLikePost',
    title: '新增点赞',
    icon: 'favorite',
    sumCount: 0,
  },
];

/**
 * 用户获取后台作品相关动作数据
 */
export const allowedActionUserPost: Array<AccessCountListItem> = [
  {
    action: 'getPostById',
    title: '作品访问量',
    icon: 'local_library',
    sumCount: 0,
  },
  {
    action: 'createComment',
    title: '作品评论量',
    icon: 'comment',
    sumCount: 0,
  },
  {
    action: 'createUserLikePost',
    title: '作品点赞量',
    icon: 'favorite',
    sumCount: 0,
  },
];

/**
 * 用户获取后台作品相关动作数据
 */
export const allowedActionUserOther: Array<AccessCountListItem> = [
  {
    action: 'addIncome',
    title: '收益情况',
    icon: 'add_shopping_cart',
    sumCount: 0,
  },
  {
    action: 'createDownload',
    title: '作品下载量',
    icon: 'cloud_queue',
    sumCount: 0,
  },
  {
    action: 'createPost',
    title: '发布作品量',
    icon: 'photo_camera',
    sumCount: 0,
  },
];
