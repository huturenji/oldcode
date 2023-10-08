<template>
    <view class="container service_container">
        <home-deco ref="homeDecoComp" cacheKey="service" :deco_info="deco_data" :inputValue="true" :topic_name="topic_name" :is_from_found="true" :isDecoReady="isDecoReady"></home-deco>
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
            topicKey:'servicesId',//页面key
            decoInfoSetStorage:false//页面数据是否存缓存
        };
    }
}
</script>

<style lang="scss">
//document不可滚动，至少从装修容器这一级才可滚动
page{
    height: 100%;
    overflow: hidden;
}
.service_container{
    height: 100%;
    background: $bg-color-split;
}
</style>
