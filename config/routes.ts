
/**
 * state 参数说明
 * @param {boolean} roles true：登录所有角色都有权限访问
 * @param {array} roles 所包含的角色具有权限访问
 */

export default [
  {
    path: '/login',
    exact: true,
    component: '@/pages/login/index',
    title: '登入'
  },
  {
    exact: false,
    path: '/',
    title: 'yubo 的个人技术博客',
    component: '@/layouts/index',
    routes: [
      {
        path: '/',
        exact: true,
        component: '@/pages/home/index',
        title: '首页',
      },
      {
        path: '/note',
        exact: false,
        component: '@/pages/note/index',
        title: '个人笔记',
      },
      {
        path: '/skill',
        exact: false,
        component: '@/pages/skill/index',
        title: '技术分享',
      },
      {
        path: '/chat',
        exact: true,
        component: '@/pages/chat/index',
        title: '聊天室',
      },
      {
        path: '/about',
        exact: true,
        component: '@/pages/about/index',
        title: '关于我',
        // state: { roles: ['user'] },
      },
      {
        path: '/user',
        exact: true,
        component: '@/pages/user/index',
        title: '我的账号',
        state: { roles: true },
      },
      {
        component: '@/pages/not-found/index',
        title: '找不到页面'
      }
    ]
  },
]
