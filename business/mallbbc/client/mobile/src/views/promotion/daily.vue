<!-- 天天专场下周预告页面 -->
<template>
    <view class="nextWeek_container">
        <view v-if="!loading && list.length > 0" class="wrapper">
            <thumbComp 
                class="notice_item"
                v-for="(item) in list" 
                :key="item.promotionId" 
                :thumb="item"
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
import dailyHandler from './daily/common/handler'
import thumbComp from './daily/components/thumb';
import empty from '@/components/empty';
import {isNotEmpty} from '@/utils/common.js'
export default {
    components: {
        thumbComp,
        empty
    },
    data() {
        return {
            loading: true,
            list: [], // 列表数据
            startDate: '', // 开始日期
            endDate: '' // 开始日期
        };
    },
    created() {
        // 初始化url上面的参数
        this.initQuery();
        // 初始化列表数据
        this.initDate();
    },
    mounted(){
       
    },
    onShow(){

    },
    computed: {

    },
    methods: {
        // 初始化url上面的参数 开始日期和结束日期
        initQuery(){
            this.startDate = this.$Route.query.startDate;
            this.endDate = this.$Route.query.endDate;
        },
        /***
         * 初始化天天专场一周预告列表
         */
        initDate(){
            this.loading = true;
            let params = {};
            if (isNotEmpty(this.startDate)){
                params = {...params, startDate: this.startDate, endDate: this.endDate}
            }
            uni.showLoading()
            dailyHandler.getDailyList(params).then(res => {
                if (res.state == 200 && res.data.promotions && res.data.promotions.length){
                    this.list = res.data.promotions;
                }
            }).catch(e => {
                console.log(e);
            }).finally(() => {
                this.loading = false;
                uni.hideLoading();
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.wrapper{
    padding: 0 30rpx 30rpx;
}
</style>
