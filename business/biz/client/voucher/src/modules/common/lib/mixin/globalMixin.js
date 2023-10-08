/*
 * 全局混入js
 */
import extendUtils from 'common/lib/utils';
var globalMixin = {
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
            vm.setTitleStyle(to);
        })
    } ,
    methods: {
        setTitleStyle(to){
            let titleBarConfig = to.meta?.titleBar;
            let titleOption = {};
            let statusOption = {};
            if (extendUtils.isNotEmpty(titleBarConfig?.title)){
                titleOption = {
                    opacity: titleBarConfig?.title?.opacity ?? 1,
                    showBack: titleBarConfig?.title?.showBack,
                    showMenu: titleBarConfig?.title?.showMenu,
                    themeMode: titleBarConfig?.title?.themeMode,
                    color: titleBarConfig?.title?.color,
                    show: titleBarConfig?.title?.show,
                    showTitle: titleBarConfig?.title?.showTitle,
                    backStyle: titleBarConfig?.title?.backStyle,
                    suspend: titleBarConfig?.title?.suspend
                }
            }
            if (extendUtils.isNotEmpty(titleBarConfig?.status)){
                statusOption = {
                    opacity: titleBarConfig?.status?.opacity ?? 1,
                    themeMode: titleBarConfig?.status?.themeMode,
                    show: titleBarConfig?.status?.show,
                    suspend: titleBarConfig?.status?.suspend
                }
            }
            window.titleBar.reset();
            if (extendUtils.isNotEmpty(titleOption) || extendUtils.isNotEmpty(statusOption)){
                window.titleBar.set({
                    title: titleOption,
                    status: statusOption
                })
            }
        }
    }
}

export default globalMixin;
