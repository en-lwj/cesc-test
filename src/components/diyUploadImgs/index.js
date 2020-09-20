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
        type: { // view | edit , view: 只能查看。 edit: 查看新增修改
            type: String,
            default: 'edit'
        },
        // 图片压缩：false:不压缩，传数字：放大倍数
        compress: {
            type: [Boolean, String, Number],
            default: false
        },
        // 上传图片必传参数，如果只是view模式可以不传
        bizType: String,
        // 一般指图片对应表单的id,可以不传，然后后续再保存表单的时候把图片id对应绑定起来
        bizId: [String, Number],
        // 限制上传数量
        limit: {
            type: [String, Number],
            default: 'edit'
        },
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
         * 调用相机拍照
         */
        selectCamera() {
            try {
                this.openCarma(Camera.PictureSourceType.CAMERA);
            } catch (error) {
                this.openCarma()
            }
            
        },
        /**
         * 调用相册
         */
        selectPhotolibrary() {
            try {
                this.openCarma(Camera.PictureSourceType.PHOTOLIBRARY);
            } catch (error) {
                this.openCarma()
            }
        },
        /**
         * 调用手机相机方法
         * @param sourceType
         */
        openCarma(sourceType) {
            const callback = (imageUri) => {
                this.getPic({
                    imageUri
                }).then(base64Url => {
                    let file = {
                        status: 'ready',
                        url: base64Url
                    }
                    file.raw = dataURItoBlob(file.url)
                    this.imgList.push(file)
                    if(this.autoUpload) {
                        this.handleUpload(file)
                    }
                })
            }
            if(this.limit && this.imgList.length >= this.limit) {
                let msg = '最多选择'+ this.limit +'张图片'
                this.$message.error(msg)
                return false
            }
            try {
                const cameraOptions = {
                    quality: 50, //相片质量0-100
                    destinationType: Camera.DestinationType.FILE_URI, //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
                    sourceType: sourceType, //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
                    allowEdit: false, //在选择之前允许修改截图
                    encodingType: Camera.EncodingType.JPEG, //保存的图片格式： JPEG = 0, PNG = 1
                    targetWidth: 1024, //照片宽度
                    targetHeight: 768, //照片高度
                    mediaType: 0, //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
                    cameraDirection: 0, //枪后摄像头类型：Back= 0,Front-facing = 1
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: sourceType === Camera.PictureSourceType.CAMERA
                };
                navigator.camera.getPicture(
                    imageUri => {
                        callback(imageUri)
                    },
                    error => {
                    },
                    cameraOptions
                );
            } catch(err) {
                let input = document.createElement('input')
                input.type = 'file'
                input.click()
                input.onchange = () => {
                    let file = input.files[0]
                    if(!file) return
                    let imageUri = URL.createObjectURL(file)
                    callback(imageUri)
                }
            }
        },
        /**
         *  把图片本地路径转化为图片文件
         */
        getPic(params) {
            return new Promise((resolve, reject) => {
                const img = new Image;
                img.src = params.imageUri;
                img.onload = () => {
                    window.img = img
                    const canvas = document.createElement('canvas');
                    let compress = this.compress || 1
                    let width = img.width
                    let height = img.height
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', compress))
                };
            })
        },
        /**
         * 上传附件处理
         * @param {*} file {raw: Blob, status: 'ready', url}
         */
        handleUpload(file) {
            return new Promise((resolve, reject) => {
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
            if(!!this.imgList[index].id){
                this.deleteFileById(this.imgList[index].id).then(res => {
                    this.imgList.splice(index, 1)
                })
            }else{
                this.imgList.splice(index, 1)
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