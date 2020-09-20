define(['./serviceHelper'], function (serviceHelper) {
    const sendGet = (name, param, cb, fail) => {
        let parameter = {
            id: name,
            parameter: param
        }
        serviceHelper.axiosGet(parameter, {
            responseType: 'json'
        }).then((result) => {
            if (!!result.success) cb(result.data)
            else fail && fail(result)
        }).catch(err => {
            console.error('[请求出错]', err)
            if (err && err.code == 401) return false
            fail && fail(err)
        })
    }
    const sendPost = (name, param, cb, fail) => {
        serviceHelper.axiosPost(name, param, {
            transformRequest: [function (data) {
                for (let key in data)
                    if (typeof data[key] == 'object') data[key] = JSON.stringify(data[key])
                return window.qs.stringify(data, {
                    indices: false
                })
            }]
        }).then((result) => {
            if (!!result.success) cb(result.data)
            else fail && fail(result)
        }).catch(err => {
            console.error('[Post请求出错]', err)
            if (err && err.code == 401) return false
            fail && fail(err)
        })
    }
    const upload = (name, param, cb, fail, uploadProgress) => {
        serviceHelper.axiosPost(name, param, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            transformRequest: [function (data) {
                return data
            }],
            onUploadProgress: function (progressEvent) { //原生获取上传进度的事件
                if (progressEvent.lengthComputable) {
                    //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
                    //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
                    uploadProgress && uploadProgress(progressEvent);
                }
            },
        }).then((result) => {
            if (!!result.success) {
                cb(result.data);
            } else {
                fail && fail(result.msg)
            }
        }).catch((error) => {
            fail && fail(error.msg)
        })
    }
    return {
        // 上传附件
        uploadFile: (params, cb, fail, uploadProgress) => {
            upload('uploadFilePsgs', params, cb, fail, uploadProgress)
        },
        // 删除附件
        deleteFileById: (param, cb, fail) => {
            sendGet('deleteFilePsgs', param, cb, fail)
        },
        // 查找附件
        getFileList: (param, cb, fail) => {
            sendGet('getFileListPsgs', param, cb, fail)
        },
        // 根据图片id获取图片
        getImgUrl: (id) => {
            return serviceHelper.getPath('getFilePsgs') + '?id=' + id
        },
    };
});
