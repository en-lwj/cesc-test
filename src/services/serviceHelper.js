define(['config', 'utils/axiosHelper'], function (config, axiosHelper) {
    console.log('当前环境：', RUNNING_ENV)
    let userToken = ''
    let { 
        service, 
        basicUrl, 
        ewaterUrl, 
        iotUrl, 
        psgsUrl, 
        gwxjUrl, 
        emerCommandUrl,
        wsEmerUrl,
        versionUrl,
    } = config.getModulesPath(RUNNING_ENV)

    let serviceEndpoint = {
        basicPath: basicUrl,
        ewaterUrl: ewaterUrl,
        gwxjUrl: gwxjUrl,
        psgsUrl: psgsUrl,
        wsEmerUrl: wsEmerUrl,
        //登录
        login: psgsUrl + '/login/loginValidNew2',
        refreshToken: ewaterUrl + '/login/updateToken',

        // 应急事中报告
        getWaterOutInfoData: emerCommandUrl + '/submittedInfo/getWaterOutInfoData',// 事中报告-获取数据
        getWaterOutImage: emerCommandUrl + '/submittedInfo/getWaterOutImage',// 事中报告-下载图片

        /**
         * psgs附件相关
         */
        deleteFilePsgs: psgsUrl + '/uploadFile/deleteById',//删除图片
        uploadFilePsgs: psgsUrl + '/uploadFile/batchUploadFile',//上传附件
        getFileListPsgs: psgsUrl + '/uploadFile/getUploadFilesByBizId',//获取图片类型和id
        getFilePsgs: psgsUrl + '/uploadFile/downloadFileById',//获取图片
        
    };
    //初始化axios
    let $axios = axiosHelper.initAxios();
    window.$axios = $axios
    return {
        setToken: function (token) {
            userToken = token;
        },
        getToken: function () {
            return userToken;
        },
        getUrl: function (id) {
            return serviceEndpoint[id];
        },
        getPath: function (connectionObj) {
            var url;
            if (!( connectionObj instanceof Object ) && !!serviceEndpoint[connectionObj]) {
                url = serviceEndpoint[connectionObj];
            } else {
                url = serviceEndpoint[connectionObj.id];
            }
            if (!url) {
                console.error('ERROR:Cant get the url with id:', connectionObj);
                return serviceEndpoint.basicUrl;
            }
            if (!!connectionObj.parameter) {
                var parameters = connectionObj.parameter;
                var parameterURL = '?';
                for (var key in parameters) {
                    parameterURL += key + '=' + parameters[key] + '&';
                }
                parameterURL += 'r=' + Math.random();
                return encodeURI(url + parameterURL.substring(0, parameterURL.length - 1));
            }
            return url;
        },
        /***
         * axiosGet封装调用
         *
         * @param serviceEndpoint 传入服务Id，自动加入token和随机数
         * @param config axios动态配置信息，具体参考axios官网
         * @returns {*}
         */
        axiosGet(serviceEndpoint, config) {
            let fullUrl = this.getPath(serviceEndpoint);
            return $axios.get(fullUrl, {}, config);
        },
        /***
         * axiosDelete封装调用
         *
         * @param serviceEndpoint 传入服务Id，自动加入token和随机数
         * @param config axios动态配置信息，具体参考axios官网
         * @returns {*}
         */
        axiosDelete(serviceEndpoint, config) {
            let fullUrl = this.getPath(serviceEndpoint);
            return $axios.delete(fullUrl, {}, config);
        },
        /***
         * axiosPost封装调用
         *
         * @param serviceEndpoint 传入服务Id，自动加入token和随机数
         * @param formData 传入要提交的表单数据
         * @param config axios动态配置信息，具体参考axios官网
         * @returns {*}
         */
        axiosPost(serviceEndpoint, formData, config) {
            let fullUrl = this.getPath(serviceEndpoint);
            return $axios.post(fullUrl, formData, config);
        },
        /***
         * axiosPost封装调用
         *
         * @param serviceEndpoint 传入服务Id，自动加入token和随机数
         * @param formData 传入要提交的表单数据
         * @param config axios动态配置信息，具体参考axios官网
         * @returns {*}
         */
        axiosPut(serviceEndpoint, formData, config) {
            let fullUrl = this.getPath(serviceEndpoint);
            return $axios.put(fullUrl, formData, config);
        },
    }
});
