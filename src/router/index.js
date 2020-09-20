import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/',
    redirect: 'ecStartingReport',
    component: resolve => require(['modules/ecStartingReport/index'], resolve),
    children: [
      {
        path: 'ecStartingReport',
        component: resolve => require(['modules/ecStartingReport/index'], resolve),
        name: 'ecStartingReport',
        meta: {}
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})