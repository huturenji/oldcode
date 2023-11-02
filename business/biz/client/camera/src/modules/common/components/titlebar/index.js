import Vue from 'vue'
import bar from './index.vue';

let barComp = Vue.extend(bar);

export function install(config={},events={}){
    Vue.$titleBar&&Vue.$titleBar.$destroy();
    window.titleBar = null;

    const elementID = 'titleBar'
    let el = document.getElementById(elementID);
    if(!el){
        let container = document.createElement('div');
        el = document.createElement('div');
        container.id = elementID;
        container.appendChild(el);
        document.body.appendChild(container);
    }
    let instance = new barComp({
        el:el,
        propsData:config,
        methods:events
    });
    window.titleBar = Vue.prototype.$titleBar = instance;
    return instance;
}
