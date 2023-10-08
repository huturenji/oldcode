/*
 * @Descripttion: 
 * @version: 
 * @Author: yg
 * @Date: 2019-08-16 15:40:33
 * @LastEditors: yg
 * @LastEditTime: 2019-08-20 16:34:39
 */

/**
 * vue组件
 */
import invoiceCard from './invoiceCard.vue';
const components = [
    invoiceCard
]
const install = function(Vue) {
    components.forEach(component => {
        Vue.component(component.name, component);
    });
}
if (typeof window !== 'undefined' && window.Vue) { //如果是在vue环境下，挂载到vue上
    install(window.Vue);
}
 
export default {
    install,
    invoiceCard
}
