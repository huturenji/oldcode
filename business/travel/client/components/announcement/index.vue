<template>
    <div>
        <div ref='announcementEl'></div>
    </div>
</template>
<script>
var extendUtils = SnTravel.functional;
export default {
    components: {},
    data: function () {
        return {
            serviceReminders: null//服务提醒组件
        }
    },
    props: {
        config: {
            type: Object,
            default: () => {}
        },
        version: {
            type: String,
            default: ''
        }
    },
    mounted: function () {
        this.renderServiceReminders();
    },
    activated(){
        this.renderServiceReminders();
    },
    methods: {
        renderServiceReminders() {
            let that = this;
            extendUtils.loadScript({
                src: extendUtils.HTTP_CONT.ORIGIN + '/' + extendUtils.APP_URL_MAP.swplib.path + extendUtils.APP_URL_MAP.swplib.child.serviceReminders.prefix + that.version + extendUtils.APP_URL_MAP.swplib.child.serviceReminders.entry,
                id: 'swpServiceReminders',
                onload: function(){
                    swpServiceReminders.install(that.$refs.announcementEl, that.config, {
                        onClose(){
                            if (window.top === window.self && (!window.opener || history.length<=1)){
                                sinosdk.sino.showReturnBtn(false);
                            }
                        },
                        onShow(){
                            sinosdk.sino.showReturnBtn(true);
                        }
                    })
                }
            })
        }
    }
}
</script>
