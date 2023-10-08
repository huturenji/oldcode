<template>
    <div class="description-container cursorp pcDialog" @click="$emit('closeDesc')">
        <div class="title">
            退改/行李额
        </div>
        <!-- cabinRules为null表示没有数据，{}表示正在获取数据，其他情况（-1）表示获取失败 -->
        <template v-if="!!cabinRules && Object.keys(cabinRules).length>0 || cabinRules===null">
            <div class="sub-desc">
                暂不支持购买婴儿票、儿童票
            </div>
            <article>
                <div class="title">成人退改签说明</div>
                <div class="content">
                    <table>
                        <tbody>
                        <tr>
                            <td>退票费</td>
                            <td v-if="!!passengerRules">
                                <template v-if="!!passengerRules.refundDescriptions && passengerRules.refundDescriptions.length>0">
                                    <template v-for="refund in passengerRules.refundDescriptions">
                                        <div class="clear">
                                            <div class="fLeft">
                                                <div>{{refund.title}}</div>
                                            </div>
                                            <div class="fRight">
                                                <div>
                                                    {{refund.description}}
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </template>
                                <template v-else>
                                    <div>
                                        <div>未查询到该舱位退票政策，</div>
                                        <div>如实际发生退改费用请以航司审核为准</div>
                                    </div>
                                </template>
                            </td>
                            <td v-else-if="!passengerRules" rowspan="4">
                                <div>
                                    <div>抱歉，未查询到该舱位退改政策，</div>
                                    <div>如实际发生退改费用请以航司审核为准</div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>同舱改期费</td>
                            <td v-if="!!passengerRules">
                                <template v-if="!!passengerRules.changeDescriptions && passengerRules.changeDescriptions.length>0">
                                    <template v-for="change in passengerRules.changeDescriptions">
                                        <div class="clear">
                                            <div class="fLeft">
                                                <div>{{change.title}}</div>
                                            </div>
                                            <div class="fRight">
                                                <div>
                                                    {{change.description}}
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </template>
                                <template v-else>
                                    <div>
                                        <div>未查询到该舱位同舱改期政策，</div>
                                        <div>如实际发生同舱改期费用请以航司审核为准</div>
                                    </div>
                                </template>
                            </td>
                        </tr>
                        <tr>
                            <td>签转</td>
                            <td v-if="!!passengerRules">
                                <template v-if="!!passengerRules.endtDesc">
                                    {{passengerRules.endtDesc}}
                                </template>
                                <template v-else>
                                    <div>
                                        <div>未查询到该舱位签转政策，</div>
                                        <div>如实际发生签转费用请以航司审核为准</div>
                                    </div>
                                </template>
                            </td>
                        </tr>
                        <tr>
                            <td>特殊说明</td>
                            <td v-if="!!cabinRules">
                                <template v-if="!!cabinRules.otherDesc">
                                    {{cabinRules.otherDesc}}
                                </template>
                                <template v-else>
                                    <div>
                                       无特殊说明
                                    </div>
                                </template>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </article>
            <article>
                <div class="title">行李额</div>
                <div class="content">
                    <table>
                        <tbody>
                        <tr>
                            <td>行李额说明</td>
                            <td v-if="!!cabinRules && !!cabinRules.baggageAllowance">
                                <div v-for='ab in cabinRules.baggageAllowance'>
                                    {{ab.title}}: {{ab.description}}
                                </div>
                            </td>
                            <td v-else>
                                <div>
                                    <div>未查询到该舱位行李额说明，</div>
                                    <div>请前往航司官网或航班值机台咨询了解</div>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </article>
            <article>
                <div class="title">供应商</div>
                <div class="content">
                    <table>
                        <tbody>
                        <tr>
                            <td>供应商说明</td>
                            <td>
                                本产品由{{providerName}}提供服务
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </article>
            <article>
                <div class="title">其他说明</div>
                <div class="content">
                    <p>
                        预订提供的航班信息均为计划信息，若实际乘坐航班因航空公司机型调整有所变化，以实际乘坐航班为准。
                    </p>
                    <p>
                        兆日国际旅行社不加收任何退改服务费，具体费用按航空公司官网规定收取。
                    </p>
                </div>
            </article>
        </template>
        <template v-else-if="!!cabinRules && Object.keys(cabinRules).length==0">
            <div class="loading-data">
                <img src="./img/loading.gif"/>
                <div>正在获取数据，请稍后</div>
            </div>
        </template>
        <template v-else>
            <div class="empty-data">
                <div>数据获取失败，请稍后重试</div>
            </div>
        </template>
        <!-- <div v-transfer-dom> -->
            <!-- <div id="closeBtn" class="modal-close-btn cursorp" :class="type=='order'?'right-top': 'bottom'" @click="$emit('closeDesc')"></div>
            <div v-if="type=='order'" class="btn-group">
                <div class="btn-info">
                    <div class="amount"><span class="unit">￥</span>{{cabin.fare}}</div>
                    <div class="info">
                        <span>{{cabin.cabinName}}</span>
                        <span class="discount" v-if="cabin.discount<100">{{cabin.discount / 10}}折</span>
                    </div>
                </div>
                <div id="btn-confirm" class="btn-confirm cursorp" @click="$emit('toOrder')">立即预订</div>
            </div> -->
        <!-- </div> -->
    </div>
</template>

<script>
import { TransferDom } from 'vux'
export default {
    directives: {
        TransferDom
    },
    components: {
    },
    props: {
        bodyLock:{
            type: Boolean,
            default: false,
        },
        // type: {
        //     type: String,
        // },
        providerName: {
            type: String,
        },
        // cabin: {
        //     default: () => { return {} }
        // },
        cabinRules: {
            default: () => { return null }
        }
    },
    data: function () {
        return {
        }
    },
    watch: {
    },
    computed: {
        //乘客客规。实际有三个数据，分别是：ADULT,CHILD,BABY。但由于现在机票只支持成人购票（且服务器改造不方便），所以只拿取成人的客规（也就是数组第一个）
        passengerRules(){
            if(!this.cabinRules){
                return null;
            }
            return !!this.cabinRules.passengerRules && this.cabinRules.passengerRules.length>0 ? this.cabinRules.passengerRules[0] : {}
        }
    },
    created: function () {
        try{
            document.getElementsByTagName('html')[0].classList.add('body-noscroll')
        }catch (e) {}
    },
    mounted: function () {
    },
    beforeDestroy: function () {
        try{
            document.getElementsByTagName('html')[0].classList.remove('body-noscroll')
        }catch (e) {}
    },
}
</script>
<style scoped lang="less">
@import '~styles/variables.less';
@import '~styles/mixins/mixins.less';

.modal-close-btn {
    width: 20px;
    height: 20px;
    display: block;
    background: url(./img/icon_close_nor.png) no-repeat center #fff;
    background-size: contain;
    margin: 0 auto;
    z-index: 502;

    &.right-top{
        position: fixed;
        top: 10px;
        right: 10px;
    }

    &.bottom{
        position: fixed;
        bottom: 10px;
        left: 50%;
        margin-left: -10px;
    }

    &:active {
        background: url(./img/icon_close_pre.png) no-repeat center #fff;
        background-size: contain;
    }
}

.description-container {
    // position: fixed;
    // top: 0;
    // left: 0;
    // bottom: 0;
    // padding: 20px 10px 2rem;
    // width: 100%;
    // background: rgba(255, 255, 255, .98);
    // color: @fc-normal;
    // z-index: 99999;
    // overflow: scroll;
    // box-sizing: border-box;
    // -webkit-overflow-scrolling: initial;

    .empty-data {
        background: url(./img/empty.png) center 0 no-repeat;
        background-size: 100px;
        padding-top: 100px;
        text-align: center;
        color: #999999;
        font-size: 14px;
        .background-info;
    }

    .loading-data{
        background: url(./img/loading.png) center 0 no-repeat;
        background-size: 80px;
        padding-top: 100px;
        text-align: center;
        color: #999999;
        font-size: 14px;
        .background-info;

        img{
            width: 70px;
            margin-bottom: 25px;
        }
    }

    .background-info {
        position: absolute;
        left: 0;
        right: 0;
        top: calc(~'50% - 80px');
        transform: translateY(-50%);
    }

    .fLeft {
        float: left;
    }

    .fRight {
        float: right;
    }

    .clear {
        clear: both;
    }

    .title {
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
    }

    .sub-desc {
        font-size: 14px;
        border-bottom: 1px dashed #c2c2c2;
        padding-bottom: 30px;
        margin-bottom: 30px;
    }

    article {
        margin: 30px 0;

        &:first-of-type {
            margin-top: 30px;
        }

        .title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            text-align: left;
        }

        .content {
            font-size: 14px;
            color: #555;
            line-height: 30px;

            p{
                margin: 20px 0;
            }
        }

        .font-red {
            color: #F83939;
        }

        .font-gray {
            color: @fc-info;
        }

        .font-blue {
            color: @font-blue;
        }

        table {
            table-layout: fixed;
            border-collapse: collapse;
            width: 100%;
            font-size: 14px;

            tr {

                th,
                td {
                    color: #555;
                    border: 1px solid #C2C2C2;
                    vertical-align: center;
                    padding: 20px 15px;
                    text-align: left;

                    &:first-of-type {
                        width: 30%;
                    }
                }

                th {
                    font-weight: bold;
                }
            }
        }

        .remark {
            font-size: 14px;
            color: #555;
        }
    }

}
.btn-group {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 502;
    height: 80px;
    line-height: 80px;
    display: flex;
    box-shadow: 0 0 9px 0 rgba(21, 57, 120, 0.14);

    .btn-info {
        padding-left: 20px;
        background: #fff;
        flex: 1;
        display: flex;

        .amount {
            color: @font-red;
            font-size: 24px;

            .unit {
                font-size: 14px;
            }
        }

        .info {
            margin-left: 20px;
            font-size: 14px;
            color: #999;

            .discount {
                color: #333;
            }
        }
    }

    .btn-confirm {
        font-size: 14px;
        text-align: center;
        background: @font-blue;
        color: #fff;
        flex: 1;
        &:active{
            background: @font-blue-active;
        }
    }
}
@media screen and (min-width: @screen-lg-min) {
.modal-close-btn {
    &.right-top{
        right: calc((100vw - 1050px) / 2)!important;
    }
}    
}    
</style>
<style>
.body-noscroll,
.body-noscroll body {
    overflow: hidden;
}
.body-noscroll body {
    position: relative;
}
</style>
