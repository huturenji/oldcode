<template>
    <div class="description-container cursorp" @click="$emit('closeDesc')">
        <div class="modal-close-btn cursorp" @click="$emit('closeDesc')"></div>
        <div class="title">
            退改/行李额
        </div>
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
                            <td>
                                <div class="fLeft">
                                    <div>起飞前2小时前</div>
                                    <div>起飞前2小时后</div>
                                </div>
                                <div class="fRight">
                                    <div>
                                        ￥{{orderDetail.beforeTwoHoursRefundFee || 0}}/人
                                    </div>
                                    <div>
                                        ￥{{orderDetail.afterTwoHoursRefundFee || 0}}/人
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>同舱改期费</td>
                            <td>
                                <div class="fLeft">
                                    <div>起飞前2小时前</div>
                                    <div>起飞前2小时后</div>
                                </div>
                                <div class="fRight">
                                    <div>
                                        ￥{{orderDetail.beforeTwoHoursRechangeFee || 0}}/人
                                    </div>
                                    <div>
                                        ￥{{orderDetail.afterTwoHoursRechangeFee || 0}}/人
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>签转</td>
                            <td>不可签转</td>
                        </tr>
                        <tr>
                            <td>特殊说明</td>
                            <td>
                                <p>
                                    1.补收票价差额后允许签转。客票变更时，需同时收取票价价差和变更手续费
                                </p>
                                <p>
                                    2.改签后退票可能需要旅客凭证件到航空公司柜台办理
                                </p>
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
                            <td>
                                免费托运行李额20KG
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
    </div>
</template>

<script>
export default {
    props: ['providerName', 'orderDetail'],
    data: function () {
        return {
            currLi: 1
        }
    },
    created: function () { },
    mounted: function () {
    },
    methods: {
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/common/index.less';
    @import '~styles/mixins/mixinsStyle.less';

    .description-container {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        padding: .6rem .3rem;
        width: 100%;
        background: rgba(255, 255, 255, .98);
        color: @text-color;
        z-index: 99999;
        overflow: scroll;

        .fLeft {
            float: left;
        }

        .fRight {
            float: right;
        }

        .title {
            font-size: .32rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: .6rem;
        }

        .sub-desc {
            font-size: .3rem;
            border-bottom: 1px dashed #c2c2c2;
            padding-bottom: .46rem;
            margin-bottom: .46rem;
        }

        article {
            margin: .46rem 0;

            &:first-of-type {
                margin-top: .5rem;
            }

            .title {
                font-size: .3rem;
                font-weight: bold;
                margin-bottom: .06rem;
                text-align: center;
            }

            .content {
                font-size: .28rem;
                color: #555;
                line-height: .52rem;
            }

            .font-red {
                color: #F83939;
            }

            .font-gray {
                color: @third-text-color;
            }

            .font-blue {
                color: @theme-color;
            }

            table {
                table-layout: fixed;
                border-collapse: collapse;
                width: 100%;
                font-size: .26rem;

                tr {

                    th,
                    td {
                        color: #555;
                        border: 1px solid #C2C2C2;
                        vertical-align: center;
                        padding: .32rem .2rem;
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
                font-size: .24rem;
                color: #555;
            }
        }

        .modal-close-btn {
            width: 100%;
            height: .62rem;
            display: block;
            background: url(~assets/img/compment/icon_close_nor.png) no-repeat center #fff;
            background-size: .7rem;
            position: fixed;
            padding: .5rem 0;
            box-sizing: border-box;
            bottom: 0;
            left: 0;
            z-index: 100000;

            &:active {
                background: url(~assets/img/compment/icon_close_pre.png) no-repeat center #fff;
                background-size: .7rem;
            }
        }
    }
</style>