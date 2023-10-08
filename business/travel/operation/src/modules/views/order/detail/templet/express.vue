<template>
    <div class="order-detail">
        <div class="orderExpressDiv">
            <div class="orderExpressLine0">
                <div class="line0Left">{{orderStatusDes||"已下单"}}</div>
            </div>
            <div class="orderExpressLine1">
                <div class="infoLeft">
                    <div class="expressCompany">快递公司：</div>
                    <div class="expresscompanyImg"></div>
                    <span>申通快递(</span>
                    <img class="expressPhoneImg" src alt />
                    <span class="expressPhoneNo">95588)</span>
                </div>
                <div class="infoMiddle">
                    <span>订单编号：</span>
                    <span>12345678945678</span>
                </div>
                <div class="infoRight">
                    <span>运单号：</span>
                    <span>--</span>
                </div>
            </div>
            <div class="orderExpressLine2">
                <div class="line2Date">
                    <span>下单日期：</span>
                    <span>2018-10-02 16:44</span>
                </div>
                <div class="line2Person">
                    <span>下单用户：</span>
                    <span>渣渣辉</span>
                </div>
                <div class="line2Phone">
                    <span>联系电话：</span>
                    <span>15777777777</span>
                </div>
                <div class="line2Pop">
                    <span>分销渠道：</span>
                    <span>中信银行</span>
                </div>
                <div class="line2Right">
                    <span>企业：</span>
                    <span>中国移动</span>
                </div>
            </div>
        </div>
        <div class="orderExpressDetail">
            <div class="expressDetailAddress">
                <div class="startAddress">深圳</div>
                <div class="addressMiddle"></div>
                <div class="arriveAddress">北京</div>
            </div>
            <div class="addressLine0">
                <span>物品信息：</span>
                <span>文件/1.0公斤</span>
            </div>
            <div class="addressLine1">
                <span>上门取件时间：</span>
                <span>2019-07-23</span>
                <span>13:00-15:00</span>
            </div>
            <div class="addressLine2">
                <span>留言：</span>
                <span>快递小哥来的时候带一个大点的纸箱</span>
            </div>
            <div class="addressLine3">
                <div class="addressSend">寄</div>
                <span class="sendName">吴彦祖</span>
                <span class="sendPhone">13466666666</span>
                <span>详细地址：</span>
                <span class="sendAddress">广东省，深圳市，福田区，车公庙泰然八路泰然大厦C座16层</span>
            </div>
            <div class="addressLine4">
                <div class="addressReceive">收</div>
                <span class="receiveName">陈冠希</span>
                <span class="receivePhone">16666666666</span>
                <span>详细地址：</span>
                <span class="receiveAddress">北京市，海淀区，五道口职业技术学院</span>
            </div>
        </div>
        <div class="expressStatus">
            <div class="expressStatusCell" v-for="(item,index) in expressStatusArr" :key="item">
                <div class="statusImgs">
                    <div class="expressImgL1" v-if="index>0 && item.statusLife<3"></div>
                    <div class="expressImgL" v-else-if="index>0 && item.statusLife==3"></div>
                    <div v-else class="expressImgE"></div>
                    <div class="expressImgP" v-if="item.statusLife<3"></div>
                    <div class="expressImgPF" v-else></div>

                    <div
                        class="expressImgL1"
                        v-if="index<(expressStatusArr.length-1)&& item.statusLife==1"
                    ></div>
                    <div
                        class="expressImgL"
                        v-else-if="index<(expressStatusArr.length-1)&& item.statusLife>1"
                    ></div>
                    <div v-else class="expressImgE"></div>
                </div>
                <div class="statusText" v-if="item.statusLife<3">{{item.statusTxt}}</div>
                <div class="statusText1" v-else>{{item.statusTxt}}</div>

                <div v-for="cell in item.detailArr" :key="cell">
                    <div class="statusDetailCell">{{cell}}</div>
                </div>
            </div>
        </div>
        <div class="statusDescribe7">
            <div class="statusDescribe8"></div>
        </div>
        <div class="expressCourse">
            <div
                v-for="(item,index) in expressDataArr"
                :key="item"
                class="expressCourseCell"
                :class="[index==0&&'expressCourseCellTop',index==(expressDataArr.length-1)&&'expressCourseCellBottom']"
            >
                <div class="time">{{item.time}}</div>
                <div class="dataImgs">
                    <div class="dataImgL" v-if="index>0 "></div>
                    <div class="dataImgP" v-if="index==0"></div>
                    <div class="dataImgPF" v-else></div>
                    <div class="dataImgL" v-if="index!=(expressDataArr.length-1)"></div>
                </div>
                <div class="dataText">{{item.statusTxt}}</div>
            </div>
        </div>
    </div>
</template>
<script>
//公共模板

import utils from "bislibs/utils";
import  * as travelfun from "bislibs/traveloperationfun.js";
export default {
    props: {
        orderDetail: {
            type: Object,
            required: true
        },
        orderType: {
            type: String,
            required: true
        }
    },
    components: {},
    data() {
        return {
            //物流数据流
            expressDataArr: [
                {
                    statusTxt: "北京市昌平区回龙观已配送",
                    time: "2019-07-22 15：40"
                },
                {
                    statusTxt:
                        "北京市昌平区回龙观正在进行派件，派件人渣渣辉，联系电话15778989789",
                    time: "2019-07-22 15：40"
                },
                {
                    statusTxt:
                        "北京市昌平区回龙观正在进行派件，派件人渣渣辉，联系电话15778989789",
                    time: "2019-07-22 15：40"
                }
            ],
            //物流状态数据流
            expressStatusArr: [
                {
                    statusLife: 1, //状态的生命周期，已过期1，当前状态2，未过期3，
                    statusTxt: "已揽件",
                    detailArr: [
                        "2019-07-22 15：40",
                        "快递员：黎明  15423125698"
                    ]
                },
                {
                    statusLife: 1,
                    statusTxt: "已揽件",
                    detailArr: [
                        "2019-07-22 15：40",
                        "快递员：黎明  15423125698"
                    ]
                },
                {
                    statusLife: 1,
                    statusTxt: "已揽件",
                    detailArr: [
                        "2019-07-22 15：40",
                        "快递员：黎明  15423125698 15423125698",
                        "快递员：黎明  15423125698 15423125698"
                    ]
                },
                {
                    statusLife: 1,
                    statusTxt: "已揽件",
                    detailArr: [
                        "2019-07-22 15：40",
                        "快递员：黎明  15423125698"
                    ]
                },
                {
                    statusLife: 2,
                    statusTxt: "已揽件",
                    detailArr: [
                        "2019-07-22 15：40",
                        "快递员：黎明  15423125698"
                    ]
                },
                {
                    statusLife: 3,
                    statusTxt: "已揽件",
                    detailArr: []
                }
            ]
        };
    },
    computed: {
        orderStatusDes: function() {
            var result = "";
            if (this.orderDetail) {
                result = utils.getExpressOrderStatus(this.orderDetail.orderStatus);
            }
            return result;
        }
    }
};
</script>
<style lang='less' scoped>
@import "../detail.less";
/**已下单*/
@font-color-text1: #333;

.orderExpressDiv {
    width: 1280px;
    margin: 0 auto;
    padding: 32px 32px 0 32px;
    background: white;
    color: #333;

    .orderExpressLine0 {
        .line0Left {
            font-size: 18px;
            color: #23b45d;
            margin-bottom: 24px;
        }
    }

    .orderExpressLine1 {
        height: 19px;
        line-height: 19px;

        span {
            display: inline;
        }

        .infoLeft {
            float: left;

            .expressCompany {
                float: left;
            }

            .expresscompanyImg {
                float: left;
                background: url(~assets///cpy_sht.png)
                    no-repeat;
                width: 28px;
                height: 28px;
                margin-right: 5px;
                margin-top: -4.5px;
            }
        }

        .infoMiddle {
            float: left;
            margin-left: 40px;
        }

        .infoRight {
            float: left;
            margin-left: 40px;
        }
    }

    .orderExpressLine2 {
        height: 19px;
        line-height: 19px;
        padding-bottom: 50px;
        margin-top: 16px;
        border-bottom: 1px solid #ebebeb;

        div {
            float: left;
        }

        .line2Person,
        .line2Phone,
        .line2Pop,
        .line2Right {
            margin-left: 40px;
        }
    }
}

.orderExpressDetail {
    width: 1280px;
    margin: 0 auto;
    padding: 30px 40px;
    background: white;
    color: #333;

    .expressDetailAddress {
        font-weight: bold;
        margin-bottom: 24px;
        display: flex;
        align-items: center;

        .startAddress,
        .addressMiddle,
        .arriveAddress {
            font-size: 18px;
        }

        .addressMiddle {
            background: url(~assets///express_line.png)
                no-repeat;
            width: 40px;
            height: 40px;
            margin: 0 10px;
            background-size: 100%;
        }
    }

    .addressLine0,
    .addressLine1 {
        height: 19px;
        line-height: 19px;
        margin-bottom: 16px;
    }
    .addressLine2 {
        height: 19px;
        line-height: 19px;
    }

    .addressLine3 {
        display: flex;
        align-items: center;
        margin-top: 32px;
        .addressSend {
            background: #5193fc;
            padding: 1px 10px;
            margin-right: 20px;
            color: #fff;
        }
        .sendName,
        .sendPhone {
            margin-right: 20px;
        }
    }

    .addressLine4 {
        display: flex;
        align-items: center;
        margin-top: 16px;
        .addressReceive {
            background: orange;
            background-size: 100%;
            padding: 1px 10px;
            color: #fff;
            margin-right: 20px;
        }
        .receiveName,
        .receivePhone {
            margin-right: 20px;
        }
    }
}

.expressStatus {
    background-color: #fff;
    padding: 30px 40px;
    color: #333;
    font-size: 14px;
    display: flex;
    flex-flow: wrap;
    width: 1280px;
    .expressStatusCell {
        width: 190px;
        .statusImgs {
            display: flex;
            justify-content: center;
        }
        .expressImgP {
            background: url(~assets///icon_express_true.png)
                no-repeat;
            background-size: 100% 100%;
            width: 40px;
            height: 40px;
        }
        .expressImgPF {
            background: url(~assets///icon_express_false.png)
                no-repeat;
            background-size: 100% 100%;
            width: 40px;
            height: 40px;
        }
        .expressImgL {
            background: url(~assets///icon_express_colum.png)
                no-repeat;
            background-size: 100% 100%;
            width: 80px;
            height: 5px;
            align-self: center;
        }
        .expressImgL1 {
            background: url(~assets///icon_express_colum1.png)
                no-repeat;
            background-size: 100% 100%;
            width: 80px;
            height: 5px;
            align-self: center;
        }
        .expressImgE {
            background: transparent;
            background-size: 100% 100%;
            width: 80px;
            height: 5px;
            align-self: center;
        }
        .statusText {
            font-weight: bold;
            font-size: 16px;
            text-align: center;
        }
        .statusText1 {
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            color: #999999;
        }
        .statusDetailCell {
            text-align: center;
        }
    }
}

.statusDescribe7 {
    width: 1280px;
    margin: 0 auto;
    background-color: #fff;
    padding: 0 40px;

    .statusDescribe8 {
        background: url(~assets///icon_express_list.png)
            no-repeat;
        background-size: 100%;
        height: 20px;
    }
}
.expressCourse {
    width: 1280px;
    margin: 0 auto;
    padding: 30px 100px;
    background-color: #fff;

    .expressCourseCell {
        display: flex;
        align-items: center;
        .time {
            // margin-right: 10px;
            height: fit-content;
            height: -moz-fit-content;
            height: -webkit-fit-content;
        }
        .dataImgs {
            margin: 0 10px;
            .dataText {
                height: fit-content;
                height: -moz-fit-content;
                height: -webkit-fit-content;
            }
            .dataImgL {
                background: url(~assets///icon_express_colum_shu.png)
                    no-repeat;
                background-size: 100% 100%;
                width: 2px;
                height: 20px;
                margin: 0 auto;
            }
            .dataImgP {
                background: url(~assets///icon_express_red.png)
                    no-repeat;
                background-size: 100% 100%;
                width: 20px;
                height: 20px;
                margin: 0 auto;
            }
            .dataImgPF {
                background: url(~assets///icon_express_false.png)
                    no-repeat;
                background-size: 100% 100%;
                width: 20px;
                height: 20px;
                margin: 0 auto;
            }
        }
    }
    .expressCourseCellTop {
        align-items: flex-start;
    }
    .expressCourseCellBottom {
        align-items: flex-end;
    }
}
</style>