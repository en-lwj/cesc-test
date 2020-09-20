define(['vue'], function (Vue) {
    const vm = new Vue();
    return {
        // 获取所有事件
        getAll() {
            return vm._events
        },
        // 触发事件监听
        emit(eventName, ...params) {
            vm.$emit(eventName, ...params);
        },
        // 挂载监听到相应的事件
        on(eventName, cb){
            if(!(cb instanceof Function)) {
                console.error('监听类型错误', cb)
                return false
            }
            vm.$on(eventName, cb);
            return {
                fn: cb,
                remove: () => {
                    this.remove(eventName, cb)
                }
            }
        },
        // 移除事件
        off(eventName) {
            vm.$off(eventName)
        },
        // 移除事件里的某个监听
        remove(eventName, obj) {
            if(!vm._events[eventName]) {
                console.error(`未找到${eventName}事件`)
                return false
            } else {
                let index = vm._events[eventName].findIndex(e => e == obj)
                if(index == -1) {
                    console.error(`${eventName}事件中未找到该监听：`, obj)
                    return false
                }
                vm._events[eventName].splice(index, 1)
                return true
            }
        }
    }
});