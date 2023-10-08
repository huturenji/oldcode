<template>
    <div class="wrapperHotelDetail">
        <div class="swiperWrap">
            <div class="tipsText"></div>
            <div class="wrapTipsType"></div>
            <div class="wrapTipsNum"></div>
        </div>
        <div class="hoteItem">
            <div class="itemWarp">
                <div class="item">
                    <div class="left">
                        <div class="itemText"></div>
                        <div class="itemTips">
                            <span class="nearText"></span><span class="nearText"></span>
                        </div>
                    </div>
                    <div class="right map"></div>
                </div>
            </div>
            <div class="textLine">
                <span class="text"></span>
                <div class="right"></div>
            </div>
        </div>
        <div class="hotelDate">
            <div class="tab">
                <div class="panel-box panel-box_attend">
                    <div class="panel-box_bd leftPart">
                        <p class="panel-box_title top"><span class="checkin"></span></p>
                        <p class="panel-box_title blueActive"></p>
                    </div>
                    <div class="panel-box_bd">
                        <p class="panel-box_title mid"><span class="day"></span></p>
                    </div>
                    <div class="panel-box_bd rightPart">
                        <p class="panel-box_title top"> <span class="checkin"></span></p>
                        <p class="panel-box_title blueActive"></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="tagFilter">
            <div class="tagItem"></div>
            <div class="tagItem"></div>
            <div class="tagItem"></div>
            <div class="tagItem"></div>
            <div class="tagItem"></div>
            <div class="tagItem"></div>
        </div>
        <div class="hotelRoom lineBorderB" v-for="(item,index) in roomNum" :key="index">
            <div class="panel">
                <div class="panel_attend">
                    <div class="panel_border">
                        <div class="leftBg"></div>
                        <div class="left_box">
                            <div class="left_title name"></div>
                            <p class="left_title tips"></p>
                        </div>
                        <div class="money">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {  
       
    data: function () {
        return {
            roomNum:10
        }
    },
    mounted() {
    },
    methods: {
            
    }
}
</script>
<style lang="less" scoped>
    @import '~styles/core/common.less';
    @import '~styles/mixins/mixinsStyle.less';
    .wrapperHotelDetail{
        .animated-background {
            animation-name: placeHolderShimmer;
            animation-duration: 0.75s;
            animation-iteration-count: infinite;
            animation-direction: alternate;
            animation-timing-function: ease;
            background: @background-color;
            position: relative;
        }
        @keyframes placeHolderShimmer {
            0% {
                opacity:1;
            }
            100% {
                opacity:0.14;
            }
        }
        .swiperWrap{
            position: relative;
            height: 3.66rem;
            background: @sub-background-color;
            .tipsText{
                .animated-background;
                width: 6rem;
                height: 0.4rem;
                position: absolute;
                bottom: 0.8rem;
                left: 0.3rem;
            }
            .wrapTipsType{
                .animated-background;
                width: 2rem;
                height: 0.36rem;
                position: absolute;
                bottom: 0.27rem;
                left: 0.3rem;
            }     
            .wrapTipsNum{
                .animated-background;
                height: 0.36rem;
                width: 2rem;
                position: absolute;
                bottom: 0.27rem;
                right: 0.3rem;
                line-height: 0.27rem;
            }
        }
        .hoteItem{
            margin-bottom: 0.1rem;
            background: @sub-background-color;
            .itemWarp{
                padding:0.25rem 0.3rem;
                .item{
                    .flex-box();
                    .justify-content(space-between);
                    border-bottom: 1px dashed @border-color-base;
                    padding-bottom:0.25rem;
                    .left{
                        width: 6rem;
                        .itemText{
                            .animated-background;
                            height: 0.36rem;
                            margin-bottom: 0.15rem;
                        }
                        .itemTips{
                            .nearText{
                                .animated-background;
                                width: 2rem;
                                height: 0.3rem;
                                display: inline-block;
                                margin-right: 0.15rem;
                            }
                        }
                    }
                    .right{
                        .animated-background;
                        height: 0.82rem;
                        width: 1.2rem;
                        margin-left: 0.3rem;
                    }
                }
            }
            .textLine{
                position: relative;
                padding-right: 1rem;
                padding-left: 0.3rem;
                padding-bottom: 0.3rem;
                .text{
                    .animated-background;
                    width: 2rem;
                    height: 0.56rem;
                    display: inline-block;
                }
                .right{
                    .animated-background;
                    width: 1.2rem;
                    height: 0.32rem;
                    position: absolute;
                    right: 0;
                    top: 50%;
                    margin-top: -0.32rem;
                    margin-right: 0.3rem;
                }
            }
            
        }
        .hotelDate{
            padding: 0 0.3rem;
            background: @sub-background-color;
            .tab{
                .panel-box {
                    position: relative;
                }
                .panel-box_attend {   
                    .flex-box();
                    .justify-content(space-between);
                    .align-items(center);
                    height: 1.59rem;
                    border-bottom: 1px dashed @border-color-base;
                    p{
                        font-size: .32rem;
                    }
                    .panel-box_bd {
                        .flex(1);
                        min-width: 0;
                        text-align: center;
                        &.leftPart{
                            text-align: left;
                        }
                        &.rightPart{
                            text-align: right;
                        }
                    }
                    .panel-box_title {
                        width: auto;
                        .checkin{
                            .animated-background;
                            width: 2rem;
                            height: 0.28rem;
                            display: inline-block;
                        }
                        .day{
                            .animated-background;
                            width: 1.2rem;
                            height: 0.6rem;
                            display: inline-block;
                        }
                    }
                    .panel-box_title.top{
                        margin-top: 0;
                    }
                    .panel-box_title.mid{
                        margin-top: 0;
                        padding-top: 0;
                    }
                    .blueActive{
                        .animated-background;
                        width: 2rem;
                        height: 0.48rem;
                        display: inline-block;
                    }
                }
            }
        }
        .tagFilter{
            background: @sub-background-color;
            margin-bottom: 0.1rem;
            display: block;
            padding-top: 0.2rem;
            padding-left: 0.2rem;
            padding-right: 0.2rem;
            .tagItem{
                .animated-background;
                width: 1.2rem;
                height: 0.64rem;
                display: inline-block;
                margin: 0.1rem 0.1rem 0.3rem 0.1rem;
            }
        }
        .hotelRoom.lineBorderB:after{
            left: 2rem;
        }
        .hotelRoom{
            margin-bottom: 0;
            .panel{
                background: @sub-background-color;
                .panel_attend{
                    padding: 0 .2rem;
                    .panel_border{
                        padding: .2rem 0 ;
                        .flex-box();
                        .justify-content(space-between);
                        .align-items(center);
                        .leftBg{
                            .animated-background;
                            margin-right: 0.2rem;
                            width: 1.6rem;
                            height: 1.39rem;
                        }
                        .left_box{
                            .flex(1);
                            .name{
                                .animated-background;
                                width: 2rem;
                                height: 0.36rem;
                            }
                            .tips{
                                .animated-background;
                                width: 4rem;
                                height: 0.34rem;
                                margin-top: 0.1rem;
                            }
                        }
                        .money{
                            .animated-background;
                            width: 2rem;
                            height: 0.48rem;
                        }
                    }
                }
            }
        }
    }  
</style>