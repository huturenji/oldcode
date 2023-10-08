<!--
  展示格式如下：
  ---【订单号】-------------------
  ---【支付时间】-----------------
  ---【名称】-【图片】---------------------
  -------------------------------
 -->
<template>
    <div class="thumb-container" v-if='order'>
        <div class='order-no'>
            <span class='label'>订单号</span>:
            <span class='content'>{{order.orderNo}}</span>
        </div>
        <div class='order-date'>
            <span class='label'>支付日期</span>:
            <span class='content'>{{order.paymentTime | timeFliter}}</span>
        </div>
        <div class='name no-wrap' v-if="productLength <= 1">
            <span class='label'>名称</span>:
            <span class='content'>{{order.products[0].name}}</span>
        </div>
        <div class='picture'>
            <span class='label'>图片</span>:
            <div class="content product-content">
                <div ref='imgContainer' :class="{moreImg: productLength > 1}" class='img'>
                    <thumbnail ref='thumbnail' class='img-comp' v-for='(product, index) in order.products||[]'
                        :key='index' :src='product.imageUrl' />
                </div>
                <div v-if='hideMoreImg' class='shadow'></div>
            </div>
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
            /**
             * 获取一个订单中是否有多个商品 目前暂时用img的数组length判断的 
             */
            productLength() {
                return this.order.products.length;
            }
        },
        filters: {
            timeFliter(val){
                return new Date(val*1).format('yyyy-MM-dd');
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
    @import '~themes/default/styles/goodsThumb/thumb08.less';
</style>