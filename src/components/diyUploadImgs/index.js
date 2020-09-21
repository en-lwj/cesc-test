const template = require('./content.html');
const diyUploadImgsService = require('services/diyUploadImgsService');
const eventHelper = require('utils/eventHelper');

function dataURItoBlob(dataURI, options = {}) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    //New Code
    return new Blob([ab], Object.assign(options, {
        type: mimeString,
        lastModifiedDate: new Date()
    }));


}

const comm = Vue.extend({
    template: template,
    components: {
        
    },
    props: {
        /**
         * v-model回显结构[{
         * id: 图片id-如果不用再次提交图片id可以不传, 
         * url: 图片url, 
         * status: 图片上传状态根据，回显用success
         * }]
         */
        value: {
            type: Array,
            default: () => []
        },
        // 上传图片必传参数，如果只是view模式可以不传
        bizType: String,
        // 一般指图片对应表单的id,可以不传，然后后续再保存表单的时候把图片id对应绑定起来
        bizId: [String, Number],
        // 是否自动上传 默认：true
        autoUpload: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        value: {
            handler(value) {
                if(this.imgList === value) return
                this.imgList = value
            },
            immediate: true,
            deep: true
        },
        imgList: {
            handler(value) {
                if(this.value === value) return
                this.$emit('input', value)
            },
            immediate: true,
            deep: true
        }
    },
    created() {
        // this.init()
        window.a = this
    },
    data() {
        return {
            imgList: [],
            showImgUpload: false, // 弹出图片上传模式选择框
            imgUploadChoosen: [
                {
                    label: '拍照',
                    callback: () => {
                        this.selectCamera()
                    }
                },
                {
                    label: '从相册中选择',
                    callback: () => {
                        this.selectPhotolibrary()
                    }
                }
            ],
        }
    },
    methods: {
        // 暴露出去的方法
        // 上传所有未上传的文件
        upload() { 
            let promiseArr = []
            this.imgList.forEach(file => {
                if(file.status && file.status != 'success' && file.raw) {
                    promiseArr.push(this.handleUpload(file))
                }
            })
            return Promise.all(promiseArr).then(() => {
                return this.imgList
            })
        },
        /**
         * 上传附件处理
         * @param {*} file {raw: Blob, status: 'ready', url}
         */
        handleUpload(file) {
            return new Promise((resolve, reject) => {
                if(!this.autoUpload) {
                    return resolve(file)
                }
                this.uploadFile({
                    bizId: this.bizId || 0,
                    bizType: this.bizType,
                    file_data: file.raw
                }, progressEvent => {
                    file.status = 'uploading'
                    this.$set(file, 'percentage', (progressEvent.loaded / progressEvent.total * 100 | 0))
                }).then(res => {
                    file.id = res.id
                    file.status = 'success'
                    resolve(file)
                }).catch(err => {
                    if(this.autoUpload) {
                        let index = this.imgList.findIndex(item => item == file)
                        this.imgList.splice(index, 1)
                        this.$message.error('文件上传失败')
                    }
                    reject(err)
                })
            })
        },
        // 上传附件
        uploadFile(params, progressListener) {
            let formData = new FormData()
            formData.append('bizId', params.bizId)
            formData.append('bizType', params.bizType)
            formData.append('file_data', params.file_data)
            formData.append('filename', params.filename || 'blob.jpg')
            return new Promise((resolve, reject) => {
                diyUploadImgsService.uploadFile(formData, res => {
                    resolve(res)
                }, err => {
                    reject(err)
                }, progressEvent => {
                    progressListener(progressEvent)
                })
            })
        },
        /**
         * 删除图片
         * @param index
         */
        deleteImg(file) {
            let index = this.imgList.findIndex(v => v == file)
            if(!!this.imgList[index].id) {
                return this.deleteFileById(this.imgList[index].id)
            }
        },
        // 删除附件
        deleteFileById(id) {
            this.pageLoading = true
            this.pageLoadingText = '正在删除附件，请稍后'
            return new Promise((resolve, reject) => {
                diyUploadImgsService.deleteFileById({
                    id
                }, res => {
                    this.pageLoading = false
                    resolve(res)
                }, err => {
                    this.$message.error('删除失败')
                    this.pageLoading = false
                    reject()
                })
            })
        },
        /**
         * 浏览大图
         * @param picList
         * @param index
         */
        showBigImg(file) { //放大图片
            let index = this.imgList.findIndex(v => v == file)
            const temp = {
                index,
                picList: this.imgList
            };
            eventHelper.emit('previewImg', temp.picList, temp.index);
        },
    },
});
module.exports = comm;