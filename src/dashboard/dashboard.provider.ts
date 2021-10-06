export interface AccessCountListItem {
  action: string;
  title?: string;
  value?: number;
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
    title: '新增内容',
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
    action: 'createUserLikePost',
    title: '点赞内容',
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
];
