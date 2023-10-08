<!--
    商品缩略图及相应的各个状态
-->
<template>
    <div class="pay-success-container">
        <div class='content'>
            <section>
                <Icon type='icon_common_success'></Icon>
                <div class="label">支付成功</div>
            </section>
            <div class="btn cursorp" @click="toOrder">查看订单</div>
        </div>
    </div>
</template>
<script>
    import Icon from 'commonComp/base/Icon';
    import extendUtils from 'common/lib/utils';
    import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';

    export default {
        mixins: [tChatEventMixin],
        data(){
            return {

            }
        },
        components:{
            Icon
        },
        methods: {
             /**
             * T信回退事件的注册回调 必须是goBackFun
             */
            goBackFun(){
            //    let fromPage = this.$route.query.fromPage;
            //    if(!!fromPage && fromPage.startsWith('/order/list')){//订单列表过来的，直接返回上一个页面即可
            //      this.$router.back()
            //    }else{//其他情况，都继续走toOrderDetail的逻辑
            //      this.toOrder();
            //    }
                
                this.toOrder();
            },
            /**
             * 前往查看订单
             * 这里特地使用比较复杂的写法，这样逻辑更加清晰。除非有更好的办法，否则后续继续使用这种写法
             */
            toOrder(){
                let that = this;
                setTimeout(()=>{
                    let fromPage = that.$route.query.fromPage;
                    that.$router.push({
                        path: '/order/list/all',
                        query: {
                            backSteps: 'home',//订单详情再返回，需要回到首页
                            t: new Date().getTime()//增加时间戳，保证session中的判断都是forward
                        }
                    })
                }, 500);

                //TODO 【必看说明！】
                /*
                 * 原来的业务流程是下面注释的代码。但由于以下两个原因，改成了上述代码：
                 * 1. 在支付成功后，立即返回到订单详情，订单状态可能没及时更新。所以延迟操作，且统一返回到订单列表。
                 * 2. 支付成功后，订单可能会拆单，此时返回到订单列表更合理
                 */ 

                // if(!fromPage){
                //   this.$router.push({
                //     path: '/order/detail/'+this.$route.query.orderNo,
                //     query: {
                //       backSteps: 'home',//默认情况下，订单详情页再返回，直接回到首页
                //     }
                //   })
                // }else if(fromPage=='/order/confirm'){//下单页面过来的，需要路由跳转到详情页
                //   this.$router.push({
                //     path: '/order/detail/'+this.$route.query.orderNo,
                //     query: {
                //       backSteps: 'home',//订单详情再返回，需要回到首页
                //     }
                //   })
                // }else if(fromPage.startsWith('/order/list')){//订单列表页面过来的，需要路由跳转到详情页
                //   this.$router.push({
                //     path: '/order/detail/'+this.$route.query.orderNo,
                //     query: {
                //       backSteps: 2,//订单详情再返回，需要返回2步，才能到订单列表页
                //     }
                //   })
                // }else if(fromPage.startsWith('/order/detail')){//订单详情页面过来的，直接返回上一个页面即可
                //   this.$router.back()
                // }
            }
        }
    }

</script>
<style scoped lang="less">
  @import '~themes/default/styles/order/orderSuccess/orderSuccess.less';
</style>
