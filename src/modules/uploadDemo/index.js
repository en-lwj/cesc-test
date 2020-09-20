const template = require('./content.html');
const eventHelper = require('utils/eventHelper');
const diyUploadImgsService = require('services/diyUploadImgsService');
const diyUploadImgs = require('@/components/diyUploadImgs');

module.exports = Vue.extend({
  template: template,
  components: {
    diyUploadImgs
  },
  data: function () {
    return {
      pageState: 'edit',
      imgs: [],
      row: {
        id: 1
      }
    }
  },
  created: function () {
    this.getFileList(this.row.id, 'clearDredgeOrderBefore', files => {
      let arr = files || []
      let imgList = arr.map(file => ({
        id: file.id,
        url: this.getImgUrl(file.id),
        status: 'success'
      }))
      this.imgs = imgList
    })
  },
  activated() {

  },
  mounted() {

  },
  methods: {
    // 获取附件列表
    getFileList(bizId, bizType, cb) {
      this.loading = true
      diyUploadImgsService.getFileList({
        bizId: bizId,
        bizType: bizType
      }, res => {
        this.loading = false
        cb(res)
      }, err => {
        this.loading = false
        this.$message.error('获取附件列表失败')
      })
    },
    // 根据图片id获取图片
    getImgUrl: (id) => {
      return diyUploadImgsService.getImgUrl(id)
    },
  },
})
