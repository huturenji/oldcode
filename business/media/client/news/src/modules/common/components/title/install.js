import titleBar from "./index";
const titleBarComp = window.Vue.extend(titleBar);
export default {
    install(options) {
        let el = document.createElement('div');
        let instance = new titleBarComp({
            el: el,
            propsData: options.propsData
        })
        options.propsData.dom.appendChild(instance.$el);
        return instance;
    }
}