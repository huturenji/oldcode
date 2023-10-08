import Vue from 'vue'
import GuideComp from './index.vue'
let GuideVueComp = Vue.extend(GuideComp);

export async function guideInstall() {

    let channelOptions = await window.getChannelOptions;
    // 如果配置了开启， guideSwitch有值且为true
    if (channelOptions.guideSwitch) {
        const id = 'guide';
        let el = document.getElementById(id);
        if (!el) {
            let container = document.createElement('div');
            el = document.createElement('div');
            container.id = id;
            //使用两层div,vue组件挂载dom时会替换第一层dom
            container.appendChild(el)
            document.querySelector('uni-app').appendChild(container);
        }
        // outerHtml instead
        new GuideVueComp().$mount(el);
    }

}