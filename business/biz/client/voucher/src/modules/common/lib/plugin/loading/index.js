import Vue from 'vue'
import loadingComponent from 'common/components/loading/loading';

const LoadingConstructor = Vue.extend(loadingComponent)
const instance = new LoadingConstructor({
    el: document.createElement('div')
})

const loading = {
    isShowLoading: false,
    show({dom=document.body, text='', position='fixed'} = {}) { // 显示方法    

        instance.text = text;
        instance.position = position;
        dom.appendChild(instance.$el);
        this.isShowLoading = true;
    },
    hide() { // 隐藏方法
        instance.$el.remove();
        this.isShowLoading = false;
    }
}

export default {
    install() {
        if (!Vue.$loading) {
            Vue.$loading = loading
        }
        Vue.mixin({
            created() {
                this.$loading = Vue.$loading
            }
        })
    }
}
