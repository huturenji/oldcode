import {industryWrap} from './index';

const industryWrapConstructor = window.Vue.extend(industryWrap);


export default {
    //@param el 需要vue组件实例插入的dom 
    install(el, options){
        // eslint-disable-next-line no-unused-expressions
        window.Vue.$industryWrap && window.Vue.$industryWrap.$destroy();
        if(!el){ return }
        el.innerHTML = '';
        //实例化组件
        let instance = new industryWrapConstructor({
            el: el,
            propsData: {
                list: options.list
            }
        })
        window.Vue.prototype.$industryWrap = instance;
    }
}