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
import RemindersBanner from './views/banner';

var RemindersComp = window.Vue.extend(RemindersBanner)


export function install(el, config, options={}) {
    return new Promise((resolve, reject)=>{
        try {
            Vue.prototype.$announcement && Vue.prototype.$announcement.$destroy();

            if (!el){
                //创建dom
                const elID = 'announcement'
                let old = document.getElementById(elID);
                if (!!old) {
                    old.remove();
                }
                el = document.createElement('div');
                el.id = elID;
                document.body.appendChild(el);
            } else {
                el.innerHTML = '';
            }

            //实例化组件
            let instance = new RemindersComp({
                el: el,
                propsData: {
                    config: config
                },
                methods:{
                    onShow: options.onShow,
                    onClose: options.onClose
                }
            })
            Vue.prototype.$announcement = instance;
            resolve({
                $instance: instance
            })
        } catch (e){
            console.error(e);
            reject();
        }
    })
}


