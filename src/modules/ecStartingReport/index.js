const template = require('./content.html');
const eventHelper = require('utils/eventHelper');
const emergencyCommandService = require('@/services/emergencyCommandService');
const compiler = require('vue-template-compiler');

// const babel = require("babel-core");
// const result = compiler.compileToFunctions(template).render
// window.babel = babel
// window.t = template
// window.compiler = compiler
module.exports = Vue.extend({
  template: template,
  // render: h => h(template(this)),
  // render: template.render,
  components: {

  },
  data: function () {
    return {
      district: '',
      info: undefined,
      errMsg: '',
    }
  },
  created: function () {

  },
  activated() {

  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if(window.location.href.includes('pjq')) this.district = '蓬江区'
      else if(window.location.href.includes('jhq')) this.district = '江海区'
      else if(window.location.href.includes('xhq')) this.district = '新会区'
      else {
        this.district = '' || '蓬江区'
      }
      this.getInfo()
    },
    getInfo() {
      if(!this.district) {
        return this.$mint.MessageBox({
          title: '错误',
          message: '没有指定的区域',
          showCancelButton: false
        });
      }
      eventHelper.emit('pageLoading')
      emergencyCommandService.getWaterOutInfoData({
        district: this.district,
      }, res => {
        this.info = res
        eventHelper.emit('pageLoadend')
      }, err => {
        eventHelper.emit('pageLoadend')
        if(err && err.msg) {
          this.errMsg = err.msg
        } else if(err && err.message){
          this.errMsg = err.message
        } else {
          this.errMsg = '没有启动最新预警'
        }
      })
    },
    getImgUrl(id) {
      return emergencyCommandService.getImgUrl(id)
    },
    previewImg(imgArr, index) {
      eventHelper.emit('previewImg', imgArr, index)
    }
  },
})
