/*
 * @Descripttion: vue组件打包为js使用的例子
 * @version: 
 * @Author: yg
 * @Date: 2019-08-16 15:40:33
 * @LastEditors: yg
 * @LastEditTime: 2020-10-09 10:29:22
 */

/**
 * vue组件
 */
import example from './example.vue';//vue文件例子，在该vue文件中一定要有name属性，并且不能与其他vue文件重名
const components = [
    example
]
const install = function(Vue, opts = {}) {
    components.forEach(component => {
        Vue.component(component.name, component);
    });
}
if (typeof window !== 'undefined' && window.Vue) {//如果是在vue环境下，挂载到vue上
  install(window.Vue);
}
 
export default {
    install,
    example
}
