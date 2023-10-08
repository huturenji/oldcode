import protocol from './index.vue';

// 定义插件对象
const Protocol = {};
// vue的install方法，用于定义vue插件
Protocol.install = function(Vue) {
    const AgreeMentInstance = Vue.extend(protocol);
    let curentAgreement;
    // 实例化vue实例
    const initInstance = () => {
        curentAgreement = new AgreeMentInstance();
        let msgBoxEl = curentAgreement.$mount().$el;
        msgBoxEl.id = 'Protocols';
        document.body.appendChild(msgBoxEl);
    };
    // 在Vue的原型上添加实例方法，以全局调用
    Vue.prototype.$agreeMent = {
        showTip(options) {
            document.getElementById('Protocols')?.remove();
            initInstance();
            if (typeof options === 'string') {
                curentAgreement.content = options;
            } else if (typeof options === 'object') {
                Object.assign(curentAgreement, options);
            }
            return curentAgreement; // 为了链式调用
        }
    };

};
export default Protocol;