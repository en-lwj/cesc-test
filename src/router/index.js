import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/',
    redirect: 'login',
  },
  {
    path: '/login',
    component: resolve => require(['modules/appLogin/index'], resolve),
    name: 'appLogin',
  },
  {
    path: '/uploadDemo',
    component: resolve => require(['modules/uploadDemo/index'], resolve),
    name: 'uploadDemo',
  },
  {
    path: '/ecStartingReport',
    component: resolve => require(['modules/ecStartingReport/index'], resolve),
    name: 'ecStartingReport',
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})