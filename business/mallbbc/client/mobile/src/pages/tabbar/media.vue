<template>
    <view class="container sales_container">
        
        <home-deco ref="homeDecoComp" cacheKey="sales" :deco_info="deco_data" :topic_name="topic_name" :is_from_found="true" :isDecoReady="isDecoReady"></home-deco>
        
        <!-- 页面悬浮的购物车按钮-->
        <!-- <template v-if="!disabledModule && showCartThumb">
            <cartThumb></cartThumb>
        </template> -->
    </view>
</template>

<script>
import indexMixin from "@/common/mixin/indexMixin.vue";
import {disableIosBounce} from "@/common/mixin/bounceMixin";
import homeDeco from '@/components/decorate';
export default {
    mixins: [indexMixin, disableIosBounce],
    components: {homeDeco},
    data() {
        return {
            topic_id:null, //专题id
            topicKey:'mediaId',//页面key
            decoInfoSetStorage:false//页面数据是否存缓存
        };
    },
    methods: {

    }
}
</script>

<style lang="scss">
//document不可滚动，至少从装修容器这一级才可滚动
page{
    height: 100%;
    overflow: hidden;
}
.sales_container{
    height: 100%;
    background: $bg-color-split;
    ::v-deep .container{
        padding-bottom: 0;
    }

}
uni-page-body{
    font-size: 0;
}
</style>
