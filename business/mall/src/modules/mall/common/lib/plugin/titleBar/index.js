import BarComp from './index.vue'
let TitleBarComp = Vue.extend(BarComp);

export function install(config = {}, events = {}) {
    Vue.$titleBar && Vue.$titleBar.$destroy();

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
    Vue.$titleBar = instance;
    return instance;
}