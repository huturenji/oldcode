<template>
<div  class="roomServer" @touchmove.stop="eventStop" @scroll.stop="eventStop">
    <div class="roomTop" :class="{bbpxfull:-1!=productIndex}" @touchmove.prevent>{{room.roomName}}
        <div class="btnWrap icon-btn" @click="$emit('close','')">
            <Icon class="closeBtn" type="icon_common_close" size=".4"/>
        </div>
    </div>
    <!--tab-->
    <div class="tab">
        <div>
            <div class="topImgWrap" v-if="-1 == productIndex">
                <div class="topImg" v-bind:style="{backgroundImage: 'url(' + changUrlToHttps(room.imageUrl) + ')'}"></div>
            </div>
            <div class="panel pd3 bbpxd3">
                <div class="panel-box panel-box_attend roomServer">
                    <div class="panel-box_bd">
                        <p class="panel-box_title"><Icon class="closeBtn" type="icon_hotel_fangxinsheshi" size=".32"/><span class="tit titStyle">房型设施</span></p>
                    </div>
                </div>
                <div class="panel-box panel-box_attend">
                    <div class="panel-box_bd">
                        <p class="panel-box_title"><span class="tit">楼层</span>{{room.floorDistribution}} </p>
                    </div>
                    <div class="panel-box_bd">
                        <p class="panel-box_title"><span class="tit">面积</span>{{room.area}}㎡ </p>
                    </div>
                </div>
                <div class="panel-box panel-box_attend">
                    <div class="panel-box_bd" v-if="-1 != productIndex">
                        <p class="panel-box_title"><span class="tit">早餐</span>{{room.roomProducts[productIndex].breakfastType}} </p>
                    </div>
                    <div class="panel-box_bd">
                        <p class="panel-box_title"><span class="tit">床型</span>{{room.bedType}}</p>
                    </div>
                </div>
            </div>
            <div class="panel pd3" :class="{bbpxd3:-1!=productIndex}">
                <div class="panel-box panel-box_attend">
                    <div class="panel-box_bd">
                        <p class="panel-box_title"><Icon class="closeBtn" type="icon_hotel_hotelservice" size=".32"/><span class="tit titStyle">酒店服务</span></p>
                    </div>
                </div>
                <div class="panel-box panel-box_attend">
                    <div class="panel-box_bd">
                        <span class="panel-box_desc"> {{service}} </span>
                    </div>
                </div>
            </div>
            <div class="panel pd3 bbpxd3"  v-if="-1 != productIndex">
                <div class="panel-box panel-box_attend">
                    <div class="panel-box_bd">
                        <p class="panel-box_title"><Icon class="circle" type="icon_common_clamation-circle" size=".32"/><span class="tit titStyle">取消规则</span></p>
                    </div>
                </div>
                <div class="panel-box panel-box_attend">
                    <div class="panel-box_bd">
                        <span class="panel-box_desc showAll" v-html="getPrepayRule()"></span>
                    </div>
                </div>
            </div>
            <div class="panel pd3" v-if="-1 != productIndex">
                <div class="panel-box panel-box_attend">
                    <div class="panel-box_bd">
                        <p class="panel-box_title"><Icon class="baggage" type="icon_plane_baggage" size=".32"/><span class="tit titStyle">入住离店</span></p>
                    </div>
                </div>
                <div class="panel-box panel-box_attend">
                    <div class="panel-box_bd">
                        <span class="panel-box_desc"> 入住请在当日14点以后办理，早到店可能需要等待，离店请在当日12点以前办理 </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="booking" v-if="-1 != productIndex && page!='order'" @touchmove.prevent>
        <div class="bookingWrap" v-if='useTypeConfig'>
            <div class="left">¥{{room.roomProducts[productIndex].perDayPrice}}</div>
            <div class="right cursorp noauth normal-btn linear-gra-waring" v-if="useTypeConfig.isPublic(myTripModelData.hotelUseType) && !myTripModelData.haveAuth && myTripModelData.tripListLength == 0 && !myTripModelData.getAuthing" @click.stop="toApplyFromRserver">出差申请</div>
            <div class="right cursorp normal-btn linear-gra-danger" v-else-if="(!myTripModelData.getAuthing || useTypeConfig.isPrivate(myTripModelData.hotelUseType)) && room.roomProducts[productIndex].canBook" @click.stop="toApplyFromRserver">预订</div>
            <div class="right gray normal-btn linear-gra-disable" v-else-if="!myTripModelData.getAuthing || useTypeConfig.isPrivate(myTripModelData.hotelUseType)">订完</div>
        </div>
    </div>
    <div class="bottomButtonWrap" v-if="-1 == productIndex && page!='order'" @touchmove.prevent>
        <div class="buttonWrapOut">
            <Button class="primaryButton" type="primary" @click.native.stop="showRoomproduct">查看全部{{(room.roomProducts||[]).length}}个价格</Button>
        </div>
    </div>
</div> 
</template>

<script>
// import ScrollLock from 'hotelComponent/scrollLock/vue-scroll-lock.vue';
import Icon from 'components/icon';
import Button from 'components/button';
import hotelHandler from 'hotelHandler/hotelHandler.js'
export default {
    components: {
        // ScrollLock,
        Button,
        Icon
    },
    props:{
        room:{
            type:Object,
            default(){
                return {}
            }
        },
        service:{
            type:String,
            default:'无'
        },
        productIndex:{
            type:Number,
            default:-1
        },
        roomIndex:{
            type:Number,
            default:0
        },
        roomInfoShow:{
            type:Boolean,
            default:false
        },
        page:{
            type:String,
            default:''
        },
        myTripModelData:{
            type:Object,
            default(){
                return {
                    'choosedTrip':'',
                    'haveAuth':false,
                    'tripListLength':0,
                    'hotelUseType': hotelHandler.USE_TYPE_ENUM.PUBLIC.name,
                    'getAuthing':true
                }
            }
        }
    },
    data() {
        return {
            // room:this.room,
            // productIndex:this.productIndex,
            // roomIndex:this.roomIndex,
            paymentTypeTextMap:{
                0:'到店支付',
                1:'在线支付'
            },
            useTypeConfig: null
        }
    },
    async created() {
        this.useTypeConfig = await hotelHandler.useTypeConfig()
    },
    mounted() {
    },
    methods: {
        /**
             * 艺龙图片使用https
             */ 
        changUrlToHttps(url){
            return hotelHandler.changUrlToHttps(url);
        },
        getPrepayRule(){
            let _this = this;
            let text = '';
            if (1 == _this.room.roomProducts[_this.productIndex].paymentType){ //在线付
                text = _this.room.roomProducts[_this.productIndex].prepayRule.description;
            } else { //到店付
                text = '1.如需担保，则订单一经确认，不可取消或变更；若未能如约入住，您支付的担保金将不予退还；若成功入住并付款离店，我们将在确认后的7个工作日内解冻或返还您的担保金</br>2.如无需担保，则您在入住前可免费取消'
            }
            return '<span>'+text+'</span>';
        },
        toApplyFromRserver(){
            let _this=this;
            _this.$emit('openApplyFunFromRserver',{roomInfo:_this.room,index:_this.productIndex});
        },
        showRoomproduct(){
            let _this=this;
            _this.$emit('showRoomproduct',_this.roomIndex);
                
        },
        eventStop(){
            try {
                event.stopPropagation();
            } catch (error) {

            }

        }


    }
}
</script>
<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.bbpxfull{
    .bbpx(1px, @border-color-base, 0, 0, solid);
}
.bbpxd3{
    .bbpx(1px, @border-color-base, 0.3rem, 0.3rem, dashed);
}
.roomServer{
    border-radius: 0.2rem 0.2rem 0 0;
    background: @sub-background-color;
    .roomTop{
        padding: 0.28rem 0;
        font-size: 0.32rem;
        line-height: 0.44rem;
        color: @text-color;
        position: relative;
        text-align: center;
        .btnWrap {
            position: absolute;
            top: 0;
            right: 0;
            width: 1rem;
            height: 1rem; 
            .flex-box();
            .align-items(center);
            .justify-content(center);               
            .closeBtn{
                fill: @third-text-color;
            }
        }
    }
    .tab{
        .topImgWrap{
            padding: 0 0.3rem 0.3rem;
            .topImg{
                height: 3.2rem;
                background: url(~assets/img/hotel/empty.png) no-repeat center;
                background-size: cover;
                border-radius: 0.2rem;
            }
        }
        .pd3{
            padding: 0.15rem .3rem;
        }
        .panel{
            background: @sub-background-color;
            .panel-box {
                padding: .1rem 0;
                position: relative;
            }
            .panel-box_attend {
                &.roomServer{

                }
                display: flex;
                align-items: center;
                p{
                    font-size: .32rem;
                }
                .panel-box_hd {
                    margin-right: .1rem;
                    width: 2rem;
                    height: 2rem;
                    line-height: 2rem;
                    text-align: center;
                }
                .panel-box_bd {
                    flex: 1;
                    min-width: 0;
                    .name{
                        font-size:0.32rem;
                        font-weight: 500;
                    }
                    .address{
                        font-size: .30rem;
                        padding-top: 0;
                    }
                    h4{
                        span{
                            margin-left: .15rem;
                            font-size: .25rem;
                        }
                        i{
                            font-size: .24rem;
                            color: @danger-color;
                            font-style:initial;
                            border: 1px solid @danger-color;
                            margin-left: .15rem;
                            padding: .01rem .06rem;
                        }
                    }
                    .box_commit{
                        color: @theme-color;
                        padding-top: 0.03rem;
                        text-align: right;
                    }
                }
                .panel-box_img {
                    width: 80%;
                    max-height: 100%;
                    vertical-align: middle;
                    border-radius: .06rem;
                }
                .panel-box_mask{
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    margin-left: -0.1rem;
                    text-align: center;
                    background: rgba(255, 255, 255, 0.8);
                    .btn{
                        position: absolute;
                        color: @danger-color;
                        border: 1px solid @danger-color;
                        left: 35%;
                        bottom: .3rem;
                        text-align: center;
                        padding: 0 .6rem;

                    }
                }
                .panel-box_title {
                    font-weight: 400;
                    width: auto;
                    font-size: .3rem;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    line-height: 0.42rem;
                    padding-right: 0.1rem;
                    color: @secondary-text-color;
                    .baggage{
                        fill: @theme-color;
                    }
                    .circle{
                        fill: @warning-color;
                    }
                    .flex-box();
                    .align-items(center);
                    .rate{
                        color: @warning-color;
                        font-weight:600;
                    }
                    .comment{
                        margin-left: .2rem;
                    }
                    .icon{
                        font-size: .25rem;
                        img{
                            width: .24rem;
                            margin-left: .1rem;
                            margin-right: .06rem;
                        }
                        &:first-child{
                            img{
                                margin-left: 0;
                            }
                        }
                    }
                }
                .tit{
                    color: @third-text-color;
                    padding-right: 0.25rem;
                }
                .titStyle{
                    font-size: 0.3rem;
                    padding-left: 0.16rem;
                    color: @secondary-text-color;
                }
                .panel-box_money{
                    text-align: right;
                    margin-right: .12rem;
                    font-size: .36rem;
                    color:@danger-color;
                }
            }
            .panel-box_desc {
                color: @text-color;
                font-size: .28rem;
                line-height: 0.4rem;
                display: -webkit-box;
                &.showAll{
                    overflow:initial;
                    text-overflow:initial;
                    -webkit-line-clamp:initial;
                }
            }
            .panel-box_time{
                flex: 1;
                -webkit-flex: 1;
                display: -webkit-box;
                display: -webkit-flex;
                display: flex;
            }
            .box_time {
                padding-top: 0.2rem;
            }
            .box_icon_img {
                width: .42rem;
            }
        }
    }
    .booking{
        box-shadow:0px 0.06rem 0.2rem 0px rgba(101,112,242,0.12);
        .bookingWrap{
            .flex-box();
            .justify-content(space-between);
            .align-items(center); 
            background: @sub-background-color;
            .left{
                .flex(1);
                line-height: 1.1rem;
                color: @danger-color;
                font-size: 0.5rem;
                padding-left: 0.3rem;
            }
             .right{
                width: 3rem;
                // background: @theme-color;
                color: @sub-background-color;
                font-size: 0.32rem;
                text-align: center;
                line-height: 1.1rem;
                cursor: pointer;
            
             }
            .right.noauth{
                // background: @warning-color;
                color: @sub-background-color;
            }
             .gray{
                 background: @third-text-color;
             }
        }
    }
    .bottomButtonWrap{
        .buttonWrapOut{
            padding: 0.4rem 0.3rem;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.37) 0%, rgba(255, 255, 255, 0.84) 6%, #FFFFFF 100%);

        }
    }
}

</style>

