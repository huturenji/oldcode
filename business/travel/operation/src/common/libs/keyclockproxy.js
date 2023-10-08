
import VueKeyCloak from '@dsb-norge/vue-keycloak-js'
const NODE_ENV = process.env.NODE_ENV;
/**
 * keycloak登录的代理类，封装了第三方库vue-keycloak-js，
 * 用于keycloak的标准登录流程
 *  
 */
class keyclockproxy {
    /**
     * 
     * @param {*}   
     */
    constructor() {
        this.loginJsonConfig = null;
        this.clientId = 'TRAVEL_operation_front'
    }

    /**
     * 获取keycloak登录的一些配置参数
     */
    getLoginJsonConfig() {
        const that = this
        return new Promise(function (resolve, reject) {
            if (that.loginJsonConfig) {
                resolve(that.loginJsonConfig)
                return;
            }
            var req = new XMLHttpRequest();
            let jsonFilePath = NODE_ENV == 'production' ? `../keycloak.json` : '../thirdparty/keycloak/keycloak.json'
            req.open('GET', jsonFilePath, true);
            req.setRequestHeader('Accept', 'application/json');
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        try {
                            var config = JSON.parse(req.responseText)
                            console.log("loginJsonConfig=" + JSON.stringify(config))

                            that.loginJsonConfig = {
                                url: config['auth-server-url'],
                                realm: config['realm']
                            }
                            resolve(that.loginJsonConfig)
                        } catch (e) {
                            console.error(e);
                            reject()
                        }
                    } else {
                        reject()
                    }
                }
            }
            req.send();
        })
    }

    /**
     * keycloak开始执行
     */
    start(vue) {
        const that = this
        return new Promise(function (resolve, reject) {
            that.getLoginJsonConfig().then(option => {
                vue.use(VueKeyCloak, {
                    config: Object.assign({
                        clientId: that.clientId,
                    }, option),
                    //无论任何页面，发生登录退出，都推到首页
                    logout: {
                        redirectUri: window.origin + "/travel/static/operation/index.html"
                    },
                    //登录成功后，返回结果可以使用全局变量Vue.prototype.$keycloak来访问
                    onReady: kc => {
                        resolve(kc)
                    }
                })
            }).catch(e => {
                reject(e)
            })
        })
    }
};

export default new keyclockproxy();

