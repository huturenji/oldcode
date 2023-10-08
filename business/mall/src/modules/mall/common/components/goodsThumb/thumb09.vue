<!--
  展示格式如下：
  ---【图片】-【名称】--------------------
  ---【支付时间】-----------------
  ---【订单号】-------------------
  -------------------------------
 -->
<template>
    <div class="thumb-container" v-if='order'>
        <div class='name no-wrap'>
            <span class="supplierIcon" :style="'backgroundImage:url('+supplierMap[order.supplierId]+')'"></span>{{order.products[0].name}}
        </div>
        <div class='order-date'>
            <span class='content'>{{order.paymentTime | timeFliter}}</span>
        </div>
        <div class='order-no'>
            <span class='content'>订单号：{{order.orderNo}}</span>
        </div>

        <div class='price'>
            <priceLabel :amount='order.paymentAmount'/>
        </div>
    </div>
</template>
<script>
    import thumbBase from "./thumbBase";
    import extendUtils from 'common/lib/utils'
    export default {
        props: {
            order: {
                type: Object,
                default: ()=>{},
            }
        },
        extends: thumbBase,
        computed: {
        },
        filters: {
            timeFliter(val){
                return new Date(val*1).format('yyyy-MM-dd HH:mm');
            }
        },
        data(){
            return {
                supplierMap:{
                    '1001':require('../../../../../themes/default/img/icon/icon_jindong@2x.png'),
                    '1002':require('../../../../../themes/default/img/icon/icon_suning@2x.png'),
                    '1':require('../../../../../themes/default/img/icon/icon_jindong@2x.png'),
                    '2':require('../../../../../themes/default/img/icon/icon_suning@2x.png')
                }
            }

        },
        mounted(){
            this.hideMoreImgFunc();
        },
        methods: {
            /**
               * 是否添加阴影遮住图片
               */
            hideMoreImgFunc() {
                let img = this.$refs.thumbnail;
                let container = this.$refs.imgContainer;
                if (extendUtils.domOverflow(container, img)) {
                    this.hideMoreImg = true;
                }
            },
        }
    };
</script>
<style scoped lang="less">
    @import '~themes/default/styles/goodsThumb/thumb09.less';
</style>