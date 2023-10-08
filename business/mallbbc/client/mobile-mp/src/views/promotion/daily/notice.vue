<!-- 天天专场一周预告页面 -->
<template>
    <view class="notice_container">
        <w-loading ref="loading"></w-loading>
        <view v-if="!loading && list.length > 0" class="wrapper">
            <thumbComp 
                class="notice_item"
                v-for="(item, index) in list" 
                :key="item.promotionId" 
                :thumb="item"
                @change="stateChange($event, index)"
            />
        </view>

        <template v-if="!loading && list.length <= 0">
            <empty 
                tips="暂无内容"
            />
        </template>
    </view>
</template>

<script>

import dailyHandler from './common/handler'
import thumbComp from './components/thumb';
import empty from '@/common/components/empty';

export default {
    components: {
        thumbComp,
        empty
    },
    data() {
        return {
            loading: true,
            list: [] // 列表数据
        };
    },
    mounted() {
        this.initDate();
    },
    methods: {
        /***
         * 初始化天天专场一周预告列表
         */
        initDate(){
            this.loading = true;
            this.$refs?.loading?.open();
            dailyHandler.getDailyList().then(res => {
                if (res.state == 200 && res.data.promotions && res.data.promotions.length){
                    this.list = res.data.promotions;

                }
            }).catch(e => {
                console.log(e);
            }).finally(() => {
                this.loading = false;
                this.$refs?.loading?.close();
            })
        },
        stateChange(data, index) {
            this.$set(this.list[index], data.key, data.value)
        }
    }
}
</script>

<style lang='scss' scoped>
.wrapper{
    padding: 0 30rpx 30rpx;
}
</style>
