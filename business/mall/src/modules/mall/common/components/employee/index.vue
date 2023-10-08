<template>
    <div class="employee_wrap">
        <div class="price">
            <div class="left">
                <div><priceLabel :amount='goodsDetailsObj.promotionalPrice' :format="false" :floatMin="true"/></div>
                <div v-if="!!goodsDetailsObj.limitNum && goodsDetailsObj.limitNum>0" class="limit_num"><span class="num">限量{{goodsDetailsObj.limitNum}}件</span></div>
            </div>
        </div>
        <div class="supplier_price">
            <div @click="gotoJD" class="middle">
                <div><priceLabel :amount='goodsDetailsObj.supplierPrice' :format="false" :floatMin="true"/></div>
                <div class="limit_num">
                    <span class="num">京东价</span>
                    <Icon type='icon_common_rightarrowthemes' size='.18'></Icon>
                </div>
            </div>
        </div>
        <div class="cut_down">
            <div class="right">
                <div class="img"><img src="./img/activityType.png" alt=""></div>
                <cutDown @cutDownEnded="cutDownEnded" :deadline="goodsDetailsObj.marketingEndTime" useType="detail"/>
            </div>
        </div>
    </div>
</template>

<script>
const Icon = ()=>import('common/components/base/Icon.vue');
const priceLabel = ()=>import('common/components/base/priceLabel.vue');
const cutDown = ()=>import('common/components/base/cutDown.vue');
export default {
    components:{priceLabel, Icon, cutDown},
    props:{
        //传递的商品详情
        goodsDetailsObj:{
            type: Object,
            required: true,
        },
    },
    data(){
        return {
           
        }
    },
    watch:{

    },
 
    mounted(){
       
    },

    computed:{
   
    },
    methods:{
        gotoJD(){
            this.$emit('showJdPop')
        },
        cutDownEnded(){
            this.$emit('cutDownEnded')
        }
    }
  
}
</script>

<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/hairLine.less';

.employee_wrap{
    width: 100%;
    height: 1.32rem;
    background: transparent url(./img/bg.png) top left no-repeat;
    background-size: auto 100%;
    display: flex;
   
    .price{
        width: 35%;
        color: #fff;
        font-size: .52rem;
        display: flex;
        align-items: center;
        padding-left: .2rem;
        overflow: hidden;
        .left{
            & > div{
                width: 100%;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: flex;
                &.limit_num{
                    .num{
                        font-size: .22rem;
                        padding: .04rem .2rem;
                        background: rgba(189,10,0,.6);
                        border-radius: .5rem;
                    }
                }
            }
        }

    }

    .supplier_price{
        color: @theme-color;
        width: 28%;
        font-size: .4rem;
        display: flex;
        align-items: center;
        padding-left: .36rem;
        overflow: hidden;
        .middle{
            cursor: pointer;
            margin-top: .3rem;
            & > div{
                width: 100%;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: flex;
                &.limit_num{
                    display: flex;
                    align-items: center;
                    .num{
                        font-size: .22rem;
                    }
                    /deep/ svg{
                        display: flex;
                        align-items: center;
                        margin-left: .06rem;
                    }
                }
            }
        }
    }
    .cut_down{
        width: 36%;
        display: flex;
        align-items: center;
        padding-right: .3rem;
        justify-content: flex-end;
        .right{
            margin-top: .22rem;
            .img{
                width: 1.8rem;
                height: .4rem;
                img{
                    width: 100%;
                    height: auto;
                }
            }
        }
    }

}
// pc端样式特殊定制，字体的大小需要调大
@media screen and (min-width: @screen-sm) {
    .employee_wrap{
        width: 480px;
        height: 84px;
        .price{
            font-size: .55rem;
            margin-top: .16rem;
            .left{
                & > div{
                    &.limit_num{
                        .num{
                            font-size: .24rem;
                        }
                    }
                }
            }
        }
        .supplier_price{

            font-size: .42rem;
           
            .middle{
                margin-top: .32rem;
                & > div{
                    &.limit_num{
                        .num{
                            font-size: .27rem;
                        }   
                    }
                }
            }
        }

        .cut_down{
            .right{
                margin-top: .3rem;
                .img{
                    width: 2rem;
                    height: auto;
                    img{
                        width: 100%;
                        height: auto;
                    }
                }
            }
        }

    }
}
</style>