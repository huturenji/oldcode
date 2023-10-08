/**
 * 禁止ios16上，body上的橡皮筋效果。
 */
export var disableIosBounce = {
    onShow(){
        document.documentElement.style.overflow='hidden'
        document.body.style.overflow='hidden'
    },
    beforeRouteLeave(to, from, next) {   
        document.documentElement.style.overflow='initial'
        document.body.style.overflow='initial'
        next();
    },
    onHide() {   
        document.documentElement.style.overflow='initial'
        document.body.style.overflow='initial'
    }
}