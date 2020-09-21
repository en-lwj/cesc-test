// polyfill这里引入 可以配合babel-preset-env更具浏览器需要引入，减少polyfill的体积
// 其实也是代码里有很多amd语法，用不了transform-runtime，否则就不需要polyfill了
import 'babel-polyfill'
import '../lib/rem.js'
import Vue from 'vue'
import './utils/interceptVue'
import store from './store/index'
import router from './router'
import './router/intercept' // 路由拦截器
window.eventHelper = require('./utils/eventHelper')

// 引入swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)
// 引入mint-ui
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.prototype.$mint = MintUI
Vue.use(MintUI)

// 引入样式
import './css/main.scss'

// 引入cesc-app-components
import {appUploadImgs} from 'cesc-app-components'
Vue.use(appUploadImgs);
// import cescAppComponents from 'cesc-app-components'
// Vue.use(cescAppComponents);

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