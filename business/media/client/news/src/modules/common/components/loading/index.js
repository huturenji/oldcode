
import loadingComponent from './loading.vue'

const LoadingConstructor = window.Vue.extend(loadingComponent)

const loading = {
    instance: null,
    show({dom=document.body, text='', position='absolute'}) { // 显示方法  
        this.instance = null;
        this.instance = new LoadingConstructor({
            el: document.createElement('div')
        })  
        this.instance.text = text;
        this.instance.position = position;
        dom.appendChild(this.instance.$el);
        this.isShowLoading = true;
        return this.instance;
    },
    hide(instance) { // 隐藏方法
        // eslint-disable-next-line no-unused-expressions
        !!instance && instance.$el.remove();
    }
}

export {
    loading,
    loadingComponent
};
