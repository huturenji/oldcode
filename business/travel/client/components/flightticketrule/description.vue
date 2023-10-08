<template>
    <div class="description-container cursorp" @click="$emit('closeDesc')">
        <div class="title title-bar">
            退改/行李额
            <Icon type='btn_common_close' size='.3' class='modal-close-btn cursorp' @click="$emit('closeDesc')"/>
        </div>
        <!-- cabinRules为null表示没有数据，{}表示正在获取数据，其他情况（-1）表示获取失败 -->
        <div class='article-content' v-if="!!cabinRules && Object.keys(cabinRules).length>0 || cabinRules===null">
            <div class="sub-desc">
                <Icon type='icon_common_prompt' size='.28' class='icon'/>
                暂不支持购买婴儿票、儿童票
            </div>
            <article>
                <div class="title">
                    <Icon type='icon_common_prompt' size='.3' class='icon'/>
                    成人退改签说明
                </div>
                <div class="content">
                    <table>
                        <tbody>
                        <tr>
                            <td>退票费</td>
                            <td v-if="!!passengerRules">
                                <template v-if="!!passengerRules.refundDescriptions && passengerRules.refundDescriptions.length>0">
                                    <template v-for="(refund,index) in passengerRules.refundDescriptions">
                                        <div class="clear" :key="index">
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
                                    <template v-for="(change,index) in passengerRules.changeDescriptions">
                                        <div class="clear" :key="index">  
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
                <div class="title">
                    <Icon type='icon_plane_baggage' size='.3' class='icon'/>
                    行李额
                </div>
                <div class="content">
                    <table>
                        <tbody>
                        <tr>
                            <td>行李额说明</td>
                            <td v-if="!!cabinRules && !!cabinRules.baggageAllowance">
                                <div v-for='(ab,index) in cabinRules.baggageAllowance' :key="index">
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
                <div class="title">
                    <Icon type='icon_plane_supplier' size='.3' class='icon'/>
                    供应商
                </div>
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
                <div class="title">
                    <Icon type='icon_common_prompt' size='.3' class='icon'/>
                    其他说明
                </div>
                <div class="content">
                    <p>
                        预订提供的航班信息均为计划信息，若实际乘坐航班因航空公司机型调整有所变化，以实际乘坐航班为准。
                    </p>
                    <p>
                        兆日国际旅行社不加收任何退改服务费，具体费用按航空公司官网规定收取。
                    </p>
                </div>
            </article>
        </div>
        <template v-else-if="!!cabinRules && Object.keys(cabinRules).length==0">
            <div class='loading-data-container'>
                <div class="loading-data">
                    <img src="./img/loading.gif"/>
                    <div>正在获取数据，请稍后</div>
                </div>
            </div>  
        </template>
        <template v-else>
            <div class='empty-data-container'>
                <div class="empty-data">
                    <div>数据获取失败，请稍后重试</div>
                </div>
            </div>
        </template>
        <div v-transfer-dom>
            <div class="bottomBar" v-if="type=='order'">
                <div class="price-info">
                    <div>
                        <div class="price num-font"><span class='rmb'>&yen;</span>{{cabin.fare}}</div>
                        <div class="info">
                            <span>{{cabin.cabinName}}</span>
                            <span class="discount" v-if="cabin.discount<100">{{cabin.discount / 10}}折</span>
                        </div>
                    </div>
                </div>
                <div class="submit linear-gra-waring normal-btn cursorp" @click="$emit('toOrder')">
                    <span>立即预订</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { TransferDom } from 'vux'
import Icon from 'components/icon'
export default {
    directives: {
        TransferDom
    },
    components: {
        Icon
    },
    props: {
        bodyLock:{
            type: Boolean,
            default: false
        },
        type: {
            type: String
        },
        providerName: {
            type: String
        },
        cabin: {
            default: () => { return {} }
        },
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
            if (!this.cabinRules){
                return null;
            }
            return !!this.cabinRules.passengerRules && this.cabinRules.passengerRules.length>0 ? this.cabinRules.passengerRules[0] : {}
        }
    },
    created: function () {
        try {
            document.body.classList.add('body-noscroll')
        } catch (e) {}
    },
    mounted: function () {
    },
    beforeDestroy: function () {
        try {
            document.body.classList.remove('body-noscroll')
        } catch (e) {}
    }
}
</script>
<style scoped lang="less">
    @import '~styles/core/common.less';
    @import '~styles/mixins/hairLine.less';
.modal-close-btn {
    display: block;
    margin: 0 auto;
    z-index: 502;
    position: absolute;
    top: 50%;
    right: .3rem;
    transform: translateY(-50%);
    fill: @placeholder-color;
}

.description-container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    border-radius: @border-radius-base @border-radius-base 0 0;
    z-index: 999;
    -webkit-overflow-scrolling: initial;

    .empty-data-container,.loading-data-container{
        height: calc(~'100% - 1.12rem');
        background: #fff;
        color: @third-text-color;
    }

    .empty-data {
        background: url(./img/img_defpage_nocontent@2x.png) center 0 no-repeat;
        background-size: 3rem;
        padding-top: 3rem;
        text-align: center;
        font-size: .3rem;
        .background-info;
    }

    .loading-data{
        background: url(./img/loading.png) center 0 no-repeat;
        background-size: .9rem;
        padding-top: 1.2rem;
        text-align: center;
        font-size: .3rem;
        .background-info;

        img{
            width: .8rem;
            margin-bottom: .35rem;
        }
    }

    .background-info {
        position: absolute;
        left: 0;
        right: 0;
        top: calc(~'50% - .2rem');
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

    .title-bar{
        background: @background-color;
        border-radius: @border-radius-base @border-radius-base 0 0;
        position: relative;
    }

    .title {
        height: 1.12rem;
        line-height: 1.12rem;
        font-size: .3rem;
        font-weight: bold;
        color: @secondary-text-color;
        text-align: center;
    }

    .article-content{
        height: calc(~'100% - 1.12rem');
        overflow-y: auto;
        padding-bottom: 1rem;
        background: @sub-background-color;
    }

    .sub-desc {
        .bbpx();
        display: flex;
        align-items: center;
        height: .94rem;
        line-height: .94rem;
        font-size: .26rem;
        padding: 0 .6rem;
        color: #FF4E3A;
        fill: #FF4E3A;

        .icon{
            margin-right: .08rem;
        }
    }

    article {
        padding: 0 .6rem;

        .title {
            margin-top: .2rem;
            display: flex;
            align-items: center;
            text-align: left;
            height: .84rem;
            line-height: .84rem;
            .icon{
                margin-right: .08rem;
            }
        }

        .content {
            color: @secondary-text-color;
            font-size: .26rem;
            line-height: .52rem;
        }

        .font-red {
            color: #F83939;
        }

        .font-gray {
            color: #999;
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
                    color: @secondary-text-color;
                    border: 1px solid #C2C2C2;
                    vertical-align: middle;
                    padding: .12rem .2rem;
                    text-align: left;

                    &:first-of-type {
                        width: 30%;
                        font-weight: bold;

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

}
.bottomBar{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 502;
    height: 1rem;
    background: @sub-background-color;
    box-shadow:0px .06rem .2rem 0px rgba(101,112,242,0.12);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .price-info{
        flex: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 1rem;
        padding-left: .4rem;
        font-size: .24rem;
        color: @third-text-color;

        .info{
            margin-left: .2rem;
        }

        &>div{
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }

        .price{
            color: @warning-color;
            font-size: 24px;

            .rmb{
                font-size: 14px;
                margin-right: .04rem;
            }
        }
    }

    .submit{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 100%;
        color: #fff;
        font-size: .3rem;
    }
}

</style>
<style>
.body-noscroll {
    overflow: hidden;
}
.body-noscroll {
    position: relative;
}
</style>
