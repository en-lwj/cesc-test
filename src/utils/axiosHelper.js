define(['axios','qs','vue'],function (axios,qs,vue) {
    //将axios设置为全局变量
    window.axios = axios;
    window.qs = qs;
    return {
        //初始化axios实例，设置默认参数
        initAxios: (callback) =>{
            let errorCallback = callback;
            let axiosIns = axios.create({});
            axiosIns.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
            axiosIns.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
            axiosIns.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            axiosIns.defaults.responseType = 'json';
            axiosIns.defaults.transformRequest = [
                function (data) {
                    //数据序列化
                    return window.qs.stringify(data, {indices: false});
                }
            ];
            axiosIns.defaults.validateStatus = function (status) {
                return true;
            };
            axiosIns.interceptors.request.use(function (config) {
                //配置config
                config.headers.Accept = 'application/json';
                return config;
            });
            axiosIns.interceptors.response.use(function (response) {
                let data = response.data;
                let status = response.status;
                if (status === 200) {
                    //请求返回正常
                    return Promise.resolve(data);
                } else if(status==401){
                    //token过期，提示重新登录
                    errorCallback(response.data)
                } else {
                    //请求异常
                    return Promise.reject(response);
                }
            });
            let ajaxMethod = ['get', 'post', 'delete', 'put'];
            let api = {};
            ajaxMethod.forEach((method)=> {
                api[method] = (url, data, config) => {
                    let params = {
                        url: url,
                        method: method,
                    }
                    if(method == 'get' || method == 'delete') params.params = data
                    if(method == 'post' || method == 'put') params.data = data
                    Object.assign(params, config)
                    return axiosIns(params)
                }
            });
            return api;
        }
    }
});