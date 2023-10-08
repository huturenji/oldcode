<template>
    <view class="container">
        
        <home-deco ref="homeDecoComp" :deco_info="deco_data" :topic_name="topic_name" :is_from_found="false" :isDecoReady="isDecoReady" :isPageShowCart="true"></home-deco>
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
            topicKey:'mromallId',//页面key
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
.container{
    height: 100%;
}
</style>
