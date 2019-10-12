export default [
    { path: '/', name: "默认", redirect: 'index' },
    { path: '/index', name: '主页', component: () => import('~/view/index.vue') },
    
]
