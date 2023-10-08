/*
 * news的全局混入js
 */
import titleBar from 'commonComp/title/install';
// import extendUtils from 'common/lib/utils';
var newsMixin = {
    data(){
        return {
            titleBarInstance: null,
            showBackIcon: true,
            showOperation: false
        }
    },
    mounted() {
       
    },   
    beforeRouteEnter (to, from, next) {
        next(vm => {
        // 通过 `vm` 访问组件实例
            vm.installTitleBar(to, vm);
        })
    } ,
    beforeRouteLeave (to, from, next) {
        this.destroyInstance();
        next()
    },
    destroyed() {
      
    },
   
    methods: {
        /** 
      * 创建titleBar实例
      */
        installTitleBar(to, vm){
            let showTitleBar = to.meta && to.meta.showTitleBar;  
            let title = to.meta && to.meta.title;
            let dom = document.body;
            if( !!showTitleBar && !!!vm.titleBarInstance){
                vm.titleBarInstance = titleBar.install({
                    propsData:{
                        dom,
                        titleText: title,
                        showBackIcon: vm.showBackIcon,
                        showOperation: vm.showOperation,
                        operationText: vm.operationText,
                        titleGoBack: vm.H5AppBack,
                        operationFun: vm.operation
                    }
                })
                //次数用setTimeout的原因是因为页面前进后退是有动画的，动画会冲掉下面的样式，因为页面左右滑动的动画时间是250ms,故此处定义事件为300ms
                setTimeout(() => {
                    let childView = document.getElementsByClassName('child-view')[0];
                    childView.style.top = '.88rem';
                }, 300)
            }
        },
    
        /** 
      * 销毁titleBar实例
      */
        /* eslint-disable */
        destroyInstance(){
            !!this.titleBarInstance && this.titleBarInstance.$destroy();
            !!this.titleBarInstance && this.titleBarInstance.$el.remove();
            this.titleBarInstance = null;
            let childView = document.getElementsByClassName('child-view')[0];
            childView.style.top = '0rem';
        }
        /* eslint-enable */
    }
}

export default newsMixin;
