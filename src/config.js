define(function () {
    let service = {
        // 测试环境
        // test: '19.121.251.155:51010',
        test: '19.121.251.155:51010', // 需要连vpn
        testNoVpn: '157.122.102.134:51010', // 不需要连vpn
        // 正式环境
        prd: '19.121.251.154:51010',
        prdNoVpn: '157.122.102.134:51010',
        // 开发环境
        dev: '157.122.102.134:51010',

    }
    return {
        // 最新阿里图标库地址...
        aliUrl: '//at.alicdn.com/t/font_1767550_iei8qdan65q.css',  
        // 基础路径
        getPath(key) {
            let serviceUrl = service[key]
            return {
                service: serviceUrl,
                basicURL: 'http://' + serviceUrl
            }
        },
        // 模块路径
        getModulesPath(runningEnv = RUNNING_ENV) {
            let result = {}
            let urlConfig = {}
            if(runningEnv==='dev') {
                urlConfig = this.getPath('dev');
            } else if(runningEnv==='prd-test') {
                urlConfig = this.getPath('testNoVpn');
            } else if(runningEnv==='test') {
                urlConfig = this.getPath('testNoVpn');
            } else if(runningEnv==='browser') {
                urlConfig = this.getPath('prdNoVpn');
            } else if(runningEnv==='prd' || runningEnv==='alpha') {
                urlConfig = this.getPath('prdNoVpn');
            } else {
                console.error('无法获取basicUrl等url配置')
                return false
            }
            result.basicUrl = urlConfig.basicURL;
            result.service = urlConfig.service
        
            if(['browser', 'prd', 'alpha'].includes(runningEnv)){
                // 正式环境 154 无需vpn
                result.ewaterUrl = urlConfig.basicURL + '/154Ewater';
                result.iotUrl = urlConfig.basicURL + '/154iot'; //iot接口路径（在线监测业务接口）
                result.psgsUrl = urlConfig.basicURL + '/154Psgs';//排水公司接口路径（在线监测业务接口）
                result.gwxjUrl = urlConfig.basicURL + '/154Gwxj';//管网巡检接口
                result.emerCommandUrl = urlConfig.basicURL + '/154emg';//应急调度平台接口路径
                result.wsEmerUrl = 'ws://' + urlConfig.service + '/154emg/webSocketH5ReserveStart' // websocket-应急调度
                result.versionUrl = this.getPath('prdNoVpn').basicURL + '/154Psgs'; //获取版本信息，需要外网-用psgs接口
            } else if (['prd-test', 'test', 'dev'].includes(runningEnv)){
                // 测试环境 155 无需vpn
                result.ewaterUrl = urlConfig.basicURL + '/testEwater';
                result.iotUrl = urlConfig.basicURL + '/testIot'; //iot接口路径（在线监测业务接口）
                result.psgsUrl = urlConfig.basicURL + '/testPsgs';//排水公司接口路径（在线监测业务接口）
                result.gwxjUrl = urlConfig.basicURL + '/testGwxj';//管网巡检接口
                result.emerCommandUrl = urlConfig.basicURL + '/testEmg';//应急调度平台接口路径
                result.wsEmerUrl = 'ws://' + urlConfig.service + '/testEmg/webSocketH5ReserveStart' // websocket-应急调度
                result.versionUrl = this.getPath('testNoVpn').basicURL + '/testPsgs'; //获取版本信息，需要外网-用psgs接口
            } else if ([].includes(runningEnv)) {
                // 正式环境 需要vpn
                result.ewaterUrl = urlConfig.basicURL + '/ewater';
                result.iotUrl = urlConfig.basicURL + '/iot'; //iot接口路径（在线监测业务接口）
                result.psgsUrl = urlConfig.basicURL + '/psgs';//排水公司接口路径（在线监测业务接口）
                result.gwxjUrl = urlConfig.basicURL + '/gwxj';//管网巡检接口
                result.emerCommandUrl = urlConfig.basicURL + '/emg';//应急调度平台接口路径
                result.wsEmerUrl = 'ws://' + urlConfig.service + '/emg/webSocketH5ReserveStart' // websocket-应急调度
                result.versionUrl = this.getPath('prdNoVpn').basicURL + '/154Psgs'; //获取版本信息，需要外网-用psgs接口
            }
            return result
        }
    }
});
