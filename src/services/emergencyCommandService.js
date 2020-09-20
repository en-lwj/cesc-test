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
    return {
        // 事中报告-获取数据
        getWaterOutInfoData: (param, cb, fail) => {
            sendGet('getWaterOutInfoData', param, cb, fail)
        },
        // 事中报告-下载图片
        getImgUrl: (id, cache = true) => {
            let url = serviceHelper.getPath('getWaterOutImage')
            return url + '?id=' + id + (cache ? '' : '&r=' + Math.random());
        },
    };
});
