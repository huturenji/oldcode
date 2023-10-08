import Vue from 'vue'
import BarComp from './index.vue'
let TabBarComp = Vue.extend(BarComp);

export async function tabBarInstall(config = {}, events = {}) {
    Vue.$tabBar && Vue.$tabBar.$destroy();

    const elID = 'tabBar'
    let el = document.getElementById(elID);
    if (!el) {
        let container = document.createElement('div');
        el = document.createElement('div');
        container.id = elID;
        //使用两层div,vue组件挂载dom时会替换第一层dom
        container.appendChild(el)
        document.querySelector('uni-app').appendChild(container);
    }
    
    let instance = new TabBarComp({
        el: el,
        propsData: config,
        methods: events
    })
    window.tabBar = Vue.prototype.$tabBar = instance;
    await instance.install();
    return instance;
}