// 路由拦截器
import router from '@/router'
import store from '@/store'

router.beforeEach((to, from, next) => {
  const upVue = store.getters.upVue
  // 图片预览状态时，执行退出预览
  if(upVue && upVue.$refs.previewImg && upVue.$refs.previewImg.visible) {
    upVue.$refs.previewImg.close()
    return next(false);
  }
  next()
})
