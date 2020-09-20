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