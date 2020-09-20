// polyfill这里引入 可以配合babel-preset-env更具浏览器需要引入，减少polyfill的体积
// 其实也是代码里有很多amd语法，用不了transform-runtime，否则就不需要polyfill了
import 'babel-polyfill'
import './css/main.scss'
import '../lib/rem.js'
import Vue from 'vue'
Vue._extend = Vue.extend
Vue.extend = function(params) {
    if(!params.render && params.template) {
        if(typeof params.template == 'object') {
            if(params.template.render) {
                return Vue._extend(Object.assign({}, params, {
                    render: params.template.render,
                    template: undefined,
                    // 每个 Vue 实例都有一个独立的 staticRenderFns，用来保存实例本身的静态 render
                    staticRenderFns: params.template.staticRenderFns || []
                }))
            } else if(params.template.html) {
                return Vue._extend(Object.assign({}, params, {
                    template: params.template.html
                }))
            }
        } else if(typeof params.template == 'function') {
            return Vue._extend(Object.assign({}, params, {
                render: params.template(params).render,
                template: undefined
            }))
        }
    }
    return Vue._extend(params)
}
import store from './store/index'
import router from './router'
import './router/intercept' // 路由拦截器
window.eventHelper = require('./utils/eventHelper')

// 引入swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
// 引入mint-ui
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.prototype.$mint = MintUI

Vue.use(VueAwesomeSwiper)
Vue.use(MintUI)
const previewImg = require('components/previewImg')

eventHelper.on('pageLoading', ()=> {
    MintUI.Indicator.open('加载中...')
})
eventHelper.on('pageLoadend', ()=> {
    MintUI.Indicator.close()
})

var app = new Vue({
    router,
    store,
    components: {
        previewImg
    }, 
    created() {
        this.$store.commit('app/setUpVue', this)
    },

}).$mount('#app');