<template>
<div v-if='showFlag' class="detailWrap">
    <div class="tabWrap">
        <div class="lineWrap">
            <div class="left">房费</div>
            <div class="right red font34"><span>¥</span>{{orderAmount}}</div>
        </div>
        <div class="lineWrap font26 gray" :class="{lineDashedB:index == priceCalendar.length-1 && 0 < discount}" v-for="(item,index) in priceCalendar" :key="index">
            <div class="left">{{item.date}} {{breakfastType}}</div>
            <div class="right">¥{{item.salePrice}}x{{roomCount}}</div>
        </div>
        <div class="lineWrap" v-if="0 < discount">
            <div class="left">优惠</div>
            <div class="right red">- ¥{{discount}}</div>
        </div>
        <div class="lineWrap" v-if="!!couponValue">
            <div class="left">优惠券</div>
            <div class="right red">- ¥{{couponValue}}</div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    components: {
    },
    props:{
        couponValue:{
            default:''
        },
        showFlag:{
            type:Boolean,
            default:false
        },
        hotelName:{
            type:String,
            default:''
        },
        orderAmount:{
            type:String,
            default:''
        },
        //房间费用
        totalPrice:{
            type:Number,
            default:0
        },
        //房间数
        roomCount:{
            type:Number,
            default:1
        },
        //入住日期
        inDate:{
            type:Number,
            default:0
        },
        priceCalendar:{
            type:Array,
            default() {
                return []
            }
        },
        breakfastType:{
            type:String,
            default:''
        },
        discount:{
            type:Number,
            default:0
        }
    },
    data() {
        return {
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {

    },
    filters:{
        formatDate:function(val){
            return new Date(parseInt(val)).format('yyyy-MM-dd');
        }
    },
    watch:{
    }
}
</script>

<style scoped lang='less'>
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.detailWrap{
    background: @sub-background-color;
    max-height: 7.5rem;
    overflow-y: auto;
    border-radius: 0.2rem 0.2rem 0 0;
    .tabWrap{
        padding:0.3rem;
        .lineWrap{
            .flex-box;
            .justify-content(space-between);
            .align-items(center);
            font-size:0.3rem;
            line-height: 0.42rem;
            padding-bottom: 0.16rem;
            .left,.right{
                .flex(1);
                color:@text-color;
            }
            .right{
                text-align:right;
                span{
                    font-size: 0.26rem;
                }
            }
            .red{
                color: @danger-color-light;
            }
            .font34{
                font-size: 0.34rem;
            }
        }       
        .font26{
            font-size: 0.26rem;
        }
        .gray{
            .left,.right{
                color: @secondary-text-color;
            }
        }
    }
}

</style>
