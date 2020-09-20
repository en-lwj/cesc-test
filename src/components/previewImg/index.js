const template = require('./content.html');
const eventHelper = require('utils/eventHelper');
// 定义组件
module.exports = Vue.extend({
  template: template,
  data() {
    return {
      visible: false,
      clickTime: 0, // 点击开始时间
      clickTouch: {
        x: 0, // 点击x坐标
        y: 0 // 点击y坐标
      },
      swiperOption: {
        initialSlide: 0, // 索引
        loop: true,
        setWrapperSize: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        },
        zoom: {
          containerClass: 'swiper-zoom-container',
        },
        iOSEdgeSwipeDetection: true,
        iOSEdgeSwipeThreshold: 50,
        passiveListeners: false,
        resistanceRatio: 0,
        on: {
          touchStart: (e) => {
            e.preventDefault()
            this.clickTouch.x = e.changedTouches[0].clientX
            this.clickTouch.y = e.changedTouches[0].clientY
            this.clickTime = Date.now()
          },
          touchEnd: (e) => {
            e.preventDefault()
            let time = Date.now() - this.clickTime
            let moveX = e.changedTouches[0].clientX - this.clickTouch.x
            let moveY = e.changedTouches[0].clientY - this.clickTouch.y
            // console.log(time, moveX, moveY)
            if (time < 200 && Math.abs(moveX) < 10 && Math.abs(moveY) < 10) this.close()
          },
        },
      },
      swiperSlides: {
        picList: []
      }
      // swiperSlides: {
      //     index: 0,
      //     picList: [{url: 'http://61.144.51.115:9002/ewater77/iot/uploadFile/downloadFileById?id=1106&token=165299da7ec640079d34eccaae4b06d9'}]
      // }
    }
  },
  methods: {
    open(temp = {
      picList: [],
      index: 0
    }) {
      this.swiperSlides.picList = temp.picList
      this.swiperOption.initialSlide = temp.index
      this.visible = true
    },
    close() {
      this.visible = false
    },
  },
  mounted() {
    eventHelper.on('previewImg', (picList, index = 0) => {
      this.swiperSlides.picList = picList
      this.swiperOption.initialSlide = index
      this.visible = true
    })
  }
});