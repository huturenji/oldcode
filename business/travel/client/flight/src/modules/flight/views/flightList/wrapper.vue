<template>
    <div>
        <div class="atten_wrapper">
            <div class="list">
                <div class="flight cursorp" v-for="(flight, index) in flightList" :key="index">
                    <div class="flightLabel">
                        <!-- <div class="label">
                            <span class="blank-span"></span><span class="icon-low"></span>
                        </div> -->
                        <div class="flightDetail">
                            <div class="trip">
                                <div class="station">
                                    <div class="time"></div>
                                    <div class="airport"></div>
                                </div>
                                <div class="arrow">
                                    <div class="code">
                                        <div class="detail"></div>
                                    </div>
                                    <div class="code">
                                        <div class='adress'></div>
                                    </div>
                                </div>
                                <div class="station stationRight">
                                    <div class="time"><span class="plus"></span></div>
                                    <div class="airport"></div>
                                </div>
                            </div>
                            <div class="right">
                                <div class="price"><span style="font-size: .3rem"></span></div>
                                <div class="border-box">
                                    <span class="cabinName"></span>
                                    <span class="discount"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="plane">
                        <div class="startAdress"></div>
                        <div class="startAdress-right"></div>
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
            tripDatatList: [
                { index: 1 },
                { index: 2 },
                { index: 3 },
                { index: 4 },
                { index: 5 }
            ],
            flightList: [
                { flight: 1 },
                { flight: 2 },
                { flight: 3 },
                { flight: 4 },
                { flight: 5 },
                { flight: 6 },
                { flight: 7 },
                { flight: 8 },
                { flight: 9 },
                { flight: 10 }
            ]
        }
    },
    mounted() {
    },
    methods: {

    }
}
</script>
<style lang="less" scoped>
    @charset "utf-8";
    @import '~styles/mixins/mixinsStyle.less';
    @import '~themes/default/styles/common/index.less';

    .animated-background {
        animation-name: placeHolderShimmer;
        animation-duration: 0.75s;
        animation-iteration-count: infinite;
        animation-direction: alternate;
        animation-timing-function: ease;
        background: @background-color;
        // background-color: red;
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
    .atten_wrapper {
        position: absolute;
        left: 0;
        right: 0;
        top: 2.2rem;
        bottom: 0;
        overflow: hidden;
        .list {
            width: 100%;
            overflow: auto;
            overflow-y: scroll;
            overflow-x: hidden;

            .flight {
                background: #ffffff;
                margin: .08rem 0;

                &:active {
                    background: #e5e5e5;
                }

                .flightLabel {
                    padding: .2rem 0;

                    .label {
                        .flex-box;
                        height: .29rem;
                        padding: 0 .3rem;
                        margin-top: -.2rem;

                        .blank-span {
                            .flex(3);
                        }

                        .icon-low {
                            .flex(1);
                            height: .4rem;
                        }

                    }

                    .flightDetail {
                        display: -ms-flexbox;
                        display: -webkit-box;
                        display: -webkit-flex;
                        display: flex;
                        justify-content: space-between;
                        margin: 0 .3rem;
                        text-align: center;

                        .right {
                            flex: 1;
                            position: relative;
                            // width: 1.08rem;
                            width: 100%;
                            top: .23rem;
                            // left: .2rem;
                            text-align: right;
                            display: flex;
                            flex-direction: column;
                            align-items: flex-end;
                            .price {
                                .animated-background;
                                color: #f83939;
                                font-size: .42rem;
                                // width: 1.44rem;
                                width: 75%;
                                height: .44rem;
                                border-radius: .12rem;
                                background:rgba(246,204,204,1);
                            }

                            .border-box{
                                // width: 1.44rem;
                                 width: 75%;
                                height: .2rem;
                                margin-top: .25rem;
                                border-radius: .04rem;
                                 .animated-background;
                            }
                        }

                        .trip {
                            flex: 3;
                            display: -ms-flexbox;
                            display: -webkit-box;
                            display: -webkit-flex;
                            display: flex;
                            justify-content: space-between;

                            .station {
                                flex: 1;
                                font-size: .30rem;
                                text-align: left;

                                .airport {
                                    color: #999999;
                                    font-size: .28rem;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    // width: 1.4rem;
                                    width: 75%;
                                    height: .2rem;
                                    .animated-background;
                                    // max-width: 1.4rem;
                                    margin-top: .22rem;
                                    border-radius: .04rem;
                                }

                                .time {
                                    font-family: Arial Narrow, sans-serif;
                                    // text-align: left;
                                    // width: 1.4rem;
                                    width: 75%;
                                    height: .44rem;
                                    .animated-background;
                                    // max-width: 1.4rem;
                                    font-size: .44rem;
                                    border-radius: .08rem;

                                    /* font-weight: 600; */
                                    .plus {
                                        color: #f83939;
                                        font-size: .26rem;
                                        display: inline-block;
                                        vertical-align: text-top
                                    }
                                }
                            }

                            .stationRight {
                                text-align: right;
                            }

                            .arrow {
                                padding-top: .08rem;
                                flex: 1;
                                text-align: center;
                                font-size: .24rem;


                                // margin-right: .2rem;
                                .code {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;

                                    // .detail {
                                    //     width: .48rem;
                                    //     height: .28rem;
                                    //     .animated-background;
                                    // }

                                    .adress {
                                        // width: 1.17rem;
                                        width: 75%;
                                        margin-left: -20%;
                                        height: .24rem;
                                        border-radius: .06rem;
                                        .animated-background;
                                    }

                                }

                                .through {
                                    color: @theme-color;
                                }

                                span {
                                    color: #999999;
                                    display: block
                                }

                                .code {
                                    font-size: .24rem;
                                    color: @theme-color;
                                    height: .32rem;
                                }
                            }
                        }
                    }
                }

                .plane {
                    height: .7rem;
                    margin: 0 .3rem;
                    display: -ms-flexbox;
                    display: -webkit-box;
                    display: -webkit-flex;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    /* border-top: 1px solid #dadada; */
                    font-size: .26rem;
                    color: #999999;

                    .startAdress {
                        flex: 2.2;
                        // width: 4.67rem;
                        height: .2rem;
                        border-radius: .04rem;
                        .animated-background;
                    }
                    .startAdress-right{
                        flex: 1;
                    }
                }
            }
        }
    }


    // @media screen and (min-width: @pc-width) {
    //     .atten_wrapper{
    //         display: none;
    //     }
    // }
</style>
