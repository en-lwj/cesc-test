const template = require('./content.html');
const eventHelper = require('utils/eventHelper');
// 定义组件
module.exports = Vue.extend({
  template: template,
  data() {
    return {
      // 组件实例
      vueInstance: undefined
    }
  },
  computed: {
    visible() {
      return this.vueInstance ? this.vueInstance.visible : false
    }
  },
  methods: {
    // 注册事件
    regEvents(vueInstance) {
      this.vueInstance = vueInstance
      eventHelper.on('previewImg', (picList, index = 0) => {
        vueInstance.preview(picList, index)
      })
    },
    // 关闭弹窗
    /**
     * content.html代码
     */
    close() {
      this.$refs.cescAppPicturePreview && this.$refs.cescAppPicturePreview.close()
    }
  }
});