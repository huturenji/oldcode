<!-- 天天专场一周预告每一个条目的组件 -->
<template>
    <view class="notice_thumb">
        <view class="top">
            <!-- 日期 -->
            <view class="date">{{dateFormateDay()}} {{ thumb.promotionTime}}</view>
            <!-- 是否订阅 -->
            <view 
                @click="remind(thumb)" 
                class="remind flex_row_center_center" 
                :class="{reminded: thumb.ifSubscribe, disable: judgeDisable(thumb)}"
            >
                {{thumb.ifSubscribe ? '已订阅' : '订阅'}}
            </view>
        </view>
        <view class="banner" :style="style(thumb)"></view>
    </view>
</template>

<script>
import dailyHandler from '../common/handler'
export default {
    components: {
       
    },
    props:{
        thumb:{
            type: Object,
            default: ()=>{}
        }
    },
    data() {
        return {
            
        };
    },
    created() {
    },
    mounted(){
       
    },
   
    computed: {

    },
    
    methods: {
        /**
         * 处理背景图的样式
         */
        style(item){
            return {
                backgroundImage: `url(${item.bannerUrl})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% auto',
                backgroundPosition: 'center'
            }
        },

        // 订阅消息
        remind(thumb){
            if (!!this.judgeDisable(thumb)){ return } // 已过期的不能操作订阅功能
            let duration = thumb.ifSubscribe ? 3000 : 5000;
            let title = thumb.ifSubscribe ? `已取消订阅` : `活动将在${this.dateFormate()}0点开始，我们会在当天8点钟提醒你`;
            let params = {
                promotionId: this.thumb.promotionId,
                type : thumb.ifSubscribe ? 2 : 1 //1-订阅,2-取消订阅
            }
            uni.showLoading()
            dailyHandler.subscribeOrCancel(params).then(res => {
                if (res.state == 200){
                    uni.showToast({
                        icon: 'none',
                        title,
                        duration,
                        mask: true
                    })
                    this.$set(this.thumb, 'ifSubscribe', !this.thumb.ifSubscribe)
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: res.msg
                    })
                }
            }).catch(e => {
                console.log(e);
            }).finally(()=>{
                uni.hideLoading();
            })            
        },

        // 格式化日期，格式化成 “**月**日”
        dateFormate(){
            if (!!!this.thumb.promotionTime){ return '' }
            return new Date(this.thumb.promotionTime).format('MM月dd日')
        },

        // 格式化日期，格式化成周* “周*”
        dateFormateDay(){
            if (!!!this.thumb.promotionTime){ return '' }
            let index = new Date(this.thumb.promotionTime).getDay();
            return SnUtils.indexToWeek(index)
        },

        // 判断订阅按钮是否是禁用状态
        judgeDisable(thumb){
            let flag = false;
            try {
                let promotionDate = new Date(thumb.promotionTime).getTime()
                let nowDate = new Date().getTime()
                return promotionDate <= nowDate; // 当活动时间小于当前时间的时候，此时为disable状态
            } catch (error) {
                console.log(error);
            }
            return flag;
        }
    }
}
</script>

<style lang='scss' scoped>
.notice_thumb{
    width: 100%;
    border-radius: 20rpx;
    margin-top: 20rpx;
    background-color: #fff;
    padding: 0 28rpx 30rpx 28rpx;
    .banner{
        width: 100%;
        height: 240rpx;
        border-radius: 16rpx;
    }
    .top{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 80rpx;
        .date{
            color: #222;
            font-size: 28rpx;
        }
        .remind{
            min-width: 112rpx;
            height: 48rpx;
            border-radius: 8rpx;
            background: var(--tagColor);
            font-size: 28rpx;
            color: #ffffff;
            cursor: pointer;
            border: 2rpx solid var(--tagColor);
            font-weight: bold;
            //已订阅
            &.reminded{
                background: #fff;
                color: var(--tagColor);
            }
            &.disable{
                opacity: .4;
                cursor: auto;
            }
        }
    }
}
</style>
