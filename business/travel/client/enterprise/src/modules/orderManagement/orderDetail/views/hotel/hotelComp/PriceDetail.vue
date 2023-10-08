<template>
    <div v-if='showFlag' class="detailWrap">
        <div class="tabWrap">
            <div class="lineWrap">
                <div class="left">房费</div>
                <div class="right red">¥{{OrderAmount}}</div>
            </div>
            <div class="lineWrap font24" v-for="(item,index) in PriceCalendar" :key="index">
                <div class="left">{{item.date}} {{BreakfastType}}</div>
                <div class="right">¥{{item.salePrice}}x{{RoomCount}}</div>
            </div>
            <div class="lineWrap font24" v-if="!!CouponValue">
                <div class="left">优惠券</div>
                <div class="right" style="color:#25cb67">- ¥{{CouponValue}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {
    },
    props:{
        CouponValue:{
            default:''
        },
        showFlag:{
            type:Boolean,
            default:false
        },
        HotelName:{
            type:String,
            default:''
        },
        OrderAmount:{
            type:String,
            default:''
        },
        //房间费用
        TotalPrice:{
            type:Number,
            default:0
        },
        //房间数
        RoomCount:{
            type:Number,
            default:1
        },
        //入住日期
        // InDate:{
        //     type:Number,
        //     default:''
        // },
        InDate:Number,
        PriceCalendar:{
            type:Array,
            default: function() {
                return []
            }     
        },
        BreakfastType:{
            type:String,
            default:''  
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
@import '~themes/default/styles/common/index.less';
@import '~styles/mixins/mixinsStyle.less';
.detailWrap{
    background: #fff;
    max-height: 7.5rem;
    overflow-y: auto;
    .tabWrap{
        padding:0.3rem 0.55rem;
        .lineWrap{
            .flex-box;
            .justify-content(space-between);
            .align-items(center);
            font-size:0.32rem;
            .left,.right{
                .flex(1);
                line-height:0.6rem;
                color:@text-color;
            }
            .right{
                text-align:right;
            }
            .red{
                color: #f83939;
            }
        }       
        .font24{
            font-size: 0.24rem;
        }
    }
}
    
</style>