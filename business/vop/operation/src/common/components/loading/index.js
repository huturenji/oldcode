import loadingx from "./loadingx";
let instanse = null
export default {
    install(Vue) {
        if (!instanse) {
            let myLoadingComponet = Vue.extend(loadingx)
            instanse = new myLoadingComponet({ el: document.createElement('div') })
            document.body.appendChild(instanse.$el)
        }
        instanse.isSHow = false

        let customerMethods = {
            show(info) {
                if (info) {
                    instanse.tipsText = info
                }
                instanse.isSHow = true
            },
            hide() {
                instanse.isSHow = false
            }
        }
        if (!Vue.$iLoading) {
            Vue.$iLoading = customerMethods
            Vue.prototype.$iLoading = Vue.$iLoading
        }
    }

}