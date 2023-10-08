import Vue from 'vue'
import BarComp from './index.vue'
let TitleBarComp = Vue.extend(BarComp);

export function install(config = {}, events = {}) {
    Vue.$titleBar && Vue.$titleBar.$destroy();
    window.titleBar = null;

    const elID = 'titleBar'
    let el = document.getElementById(elID);
    if (!el) {
        let container = document.createElement('div');
        el = document.createElement('div');
        container.id = elID;
        container.appendChild(el)
        document.body.appendChild(container);
    }
    let instance = new TitleBarComp({
        el: el,
        propsData: config,
        methods: events
    })
    window.titleBar = Vue.prototype.$titleBar = instance ;
    return instance;
}