<template>
    <view class="container container_binjia">  
        <home-deco
            ref="homeDecoComp"
            :moreTabOffsetTop="moreTabOffsetTop"
            :deco_info="deco_data"
            :is_from_found="false"
            :isPageShowTop="isPageShowTop"
        />

    </view>
</template>
<script>
import homeDeco from '@/components/decorate';

export default {
    data() {
        return {
            deco_data: null,
            moreTabOffsetTop: 0
        };
    },
    components: {
        homeDeco
    },
    mounted() {
        window.addEventListener('message',e=>{
            console.log('e.data.decoParams',e.data.decoParams)
            this.deco_data = e.data.decoParams
            if (e.data.decoType && e.data.decoType=='home') {
                this.isPageShowTop = true
            } else {
                this.isPageShowTop = false
            }
        },false)
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
.container_binjia{
    height: 100%;
    ::v-deep .nav_wrap{
        .u-scroll-list{
            padding: 30rpx 0 0rpx 0;
        }
    }
}
</style>
