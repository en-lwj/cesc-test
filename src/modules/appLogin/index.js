const template = require('./content.html');
const eventHelper = require('utils/eventHelper');
const encodeUtils = require('utils/encodeUtils');
const serviceHelper = require('@/services/serviceHelper');
const loginService = require('@/services/loginService');

module.exports = Vue.extend({
  template: template,
  components: {},
  data: function () {
    return {
      userName: 'eadmin',
      password: '07502020@cescit',
      // 刷新token定时器
      refreshTokenTimer: undefined
    }
  },
  created: function () {

  },
  activated() {

  },
  mounted() {

  },
  methods: {
    /**
     * 登陆
     */
    login() {
      eventHelper.emit('loading-start');
      var base = new encodeUtils.Base64();
      var encypass = base.encode(this.password);
      let param = {
        username: this.userName,
        password: encypass,
        hasParam: 1,
        clientIP: '',
        clientOS: 'web',
        clientBrowser: navigator.appCodeName + navigator.appVersion
      };
      loginService.login(param, (result) => {
        if (!!result.token) {
          eventHelper.emit('loading-end');
          serviceHelper.setToken(result.token);
          this.setRefreshTokenTimer()
          this.$router.push({name: 'uploadDemo'})
        } else {
          this.$dialog.toast({
            mes: '登录失败',
            timeout: 1500,
            icon: 'error'
          });
        }
      }, (errorMsg) => {
        eventHelper.emit('loading-end');
        this.$dialog.toast({
          mes: '登录失败，' + errorMsg,
          timeout: 1500,
          icon: 'error'
        });
      })
    },
    // 刷新token
    refreshToken() {
      loginService.refreshToken({}, res => {

      }, err => {
        this.$dialog.confirm({
          title: '登录过期提示',
          mes: '您的登录已过期，请重新登录,谢谢',
          opts: [{
            txt: '确定',
            color: '#005ea4',
            callback: () => {
              this.reLogin();
            }
          }]
        });
      })
    },
    reLogin: function () {
      this.$router.push({
        name: 'appLogin',// appLogin appIndex deviceRecord  problemReporting patrolPoint appLastQuestion
        query: { mode: 'reLogin' } // 如果你使用钩子函数，your path 可以替换成to.fullPath
      })
    },
    // 刷新token轮询
    setRefreshTokenTimer() {
      if (this.refreshTokenTimer) {
        clearInterval(this.refreshTokenTimer)
        this.refreshTokenTimer = undefined
      }
      this.refreshTokenTimer = setInterval(() => {

      }, 60000)
    }
  },
})
