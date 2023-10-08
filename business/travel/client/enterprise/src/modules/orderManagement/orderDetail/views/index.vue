<template>
    <div class="indexWrap">
    </div>
</template>
<script>
// import extendUtils from 'orderCommon/extend.js';
import requestHandler from 'orderCommon/requestHandler.js';
export default {
    directives: {
    },
    mixins: [requestHandler.mixin.tChatEventMixin],
    components: {
    },
    data: function () {
        return {
        }
    },
    activated: function () {
    },
    created: function () {
        //注册并监听t信返回事件

        // extendUtils.appBack(function (data) { //点击app返回事件
        //     extendUtils.throttle(function () {
        //         extendUtils.closePage('');
        //     }, this);
        // }.bind(this));
        this.$router.push({
            // path: this.$route.query.productName + '/orderDetail',
            path: '/order/detail/'+`${this.$route.query.productName}/app`,
            query: {
                orderNo: this.$route.query.orderNo || this.$route.query.orderNo,
                pageFrom: this.$route.query.pageFrom
            }
        })
    },
    mounted: function () {
    },
    watch: {
    },
    methods: {
        goBackFun(){
            extendUtils.closePage('');
        }
    }
}
</script>
