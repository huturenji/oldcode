import Vue from 'vue'
import loadingComponent from './loading.vue'

const LoadingConstructor = Vue.extend(loadingComponent)
const instance = new LoadingConstructor({
  el: document.createElement('div')
})

const loading = {
  isShow: false,
  show(options = {text:'', dom: document.body}) { // 显示方法
    if(!options.dom){
      options.dom = document.body;
    }
    !!options.text && (instance.text = options.text);
    options.dom.appendChild(instance.$el)
    this.isShow = true;
  },
  hide() { // 隐藏方法
    instance.$el.remove();
    this.isShow = false;
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
