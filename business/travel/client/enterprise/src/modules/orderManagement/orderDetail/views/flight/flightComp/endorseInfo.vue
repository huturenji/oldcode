<template>
    <div class="endorse-container">
        <ul class="content">
            <li>
                <span>乘机人</span>
                <span>{{psgNames}}</span>
            </li>
            <li>
                <span>出发地</span>
                <span>{{startCity}}</span>
            </li>
            <li>
                <span>目的地</span>
                <span>{{endCity}}</span>
            </li>
            <li class="normal-btn cursorp" @click="showCanlendar">
                <span>出发时间</span>
                <span class="blue">{{newStartDate | dateFormat}}<Icon size='.24' class="icon-arrow" type="right"/></span>
            </li>
            <li class="normal-btn cursorp" @click="showCabinPop=true">
                <span>舱位</span>
                <span>{{newCabinName}}<Icon size='.24' class="icon-arrow" type="right"/></span>
            </li>
        </ul>
        <div class="endorse-notice" v-if='providerType==0'>
            <div class="title">改签须知</div>
            <div>
                365商旅在线改签时间为07:00-23:59，其他时间将暂停服务。
            </div>
        </div>
        <div class="description icon-btn cursorp" @click="$emit('showDescription')">
            <Icon size='.24' type="icon_common_prompt" class="icon icon-btn"/>
            退改签 行李额
        </div>
        <div class='btn-group'>
            <SnButton class="search-btn normal-btn cursorp" type="primary" @click="searchFlight">搜索航班</SnButton>
        </div>

        <!-- 遮罩层：当前页作为子组件引入父组件时，当前popup自带的遮罩层会和父组件的popup遮罩层冲突而不可使用，所以需要自己实现一个 -->
        <div class="mask cursorp" v-if="showCalendar || showCabinPop" @click="showCalendar=false;showCabinPop=false">
        </div>
        <!-- 日历控件 -->
        <popup v-model="showCalendar" position="bottom" :show-mask='false' style="min-height: 10rem;background: #ffffff ">
            <div class="calendar">
                <CalendarNewX ref="endorseCalendar" @changeDate="chooseDate" :displayMode="3"></CalendarNewX>
            </div>
        </popup>
        <!-- 选择舱位控件 -->
        <popup v-model="showCabinPop" position="bottom" :show-mask='false' class="showCabinPop">
            <div class="title">请选择舱位<i class="icon-close cursorp" @click="showCabinPop=false"></i></div>
            <ul>
                <li v-for="(val,key) in cabinObj" :key="key" class="normal-btn cursorp"
                    :class="{disable: key<cabinRank}"
                    @click.stop="chooseCabin(key, $event)">
                    {{val}}
                    <Icon type='icon_common_select' size='.32' v-if='newCabinRank==key'/>
                </li>
            </ul>
            <div class="tips-container">
                <div class="tips">改签票支持同舱或升舱改签</div>
            </div>
        </popup>
    </div>
</template>
<script>
import extendUtils from 'orderCommon/extend.js';
import CalendarNewX from "components/calendarNew/CalendarNewX.vue";
import {
    TransferDom,
    Popup
} from 'vux';
import { CabinEnum } from 'orderCommon/enum/cabinEnum.js';
const Icon = ()=>import('components/icon');
const SnButton = ()=>import('components/button');
export default {
    directives: {
        TransferDom
    },
    components: {
        CalendarNewX, Popup, SnButton, Icon
    },
    props: {
        startCity: null,
        endCity: null,
        startDate: null,
        cabinName: null,
        cabinRank: null,
        providerType: null,
        psgList: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    data: function () {

        let managerData = extendUtils.stateManager.setData([
            {
                name: 'showCalendar',
                parent: '$refs.endorseInfo',
                show: {
                    callback: function () {
                        document.body.classList.add('body-noscroll');
                    }
                },
                hide: {
                    callback: function () {
                        document.body.classList.remove('body-noscroll');
                    },
                    title: '申请改签'
                }
            },
            {
                name: 'showCabinPop',
                parent: '$refs.endorseInfo',
                hide: {
                    title: '申请改签'
                }
            }])

        return Object.assign(managerData, {
            psgNames: null,
            newStartDate: null,
            newCabinName: null,
            newCabinRank: null,
            cabinObj: CabinEnum
        })
    },
    filters: {
        dateFormat: function (value) {
            try {
                let startDate = new Date(value);
                let dateStr = startDate.format("MM月dd日");
                let week = extendUtils.indexToWeek(startDate.getDay());
                return dateStr + " " + week;
            } catch (e) {
                return null;
            }
        }
    },
    watch: {
        startDate: function (newValue) {
            this.newStartDate = newValue;
        },
        cabinRank: function (newValue) {
            this.newCabinRank = newValue;
            this.newCabinName = CabinEnum[newValue];
        },
        psgList: function (newValue) {
            if (newValue) {
                let psgNameArr = [];
                newValue.forEach((e) => {
                    e && psgNameArr.push(e.psgName);
                });
                this.psgNames = psgNameArr.join(",");
            }
        }
    },
    created: function () {
    },
    mounted() {
    },
    computed: {
    },
    methods: {
        /**
             * 展开日历
             */
        showCanlendar() {
            this.$refs.endorseCalendar.setDate(new Date(this.newStartDate).getTime() / 1000);
            this.showCalendar = true;
            this.showCabinPop = false;
        },
        /**
             * 日历选中日期回调
             * @param date
             */
        chooseDate(date) {
            this.newStartDate = date * 1000;
            this.showCalendar = false;
        },
        /**
             * 选则舱位
             * @param rank
             */
        chooseCabin(rank, event) {
            //不支持降仓
            if (event.target.classList.contains("disable")) {
                return;
            }
            this.newCabinRank = rank;
            this.newCabinName = this.cabinObj[rank];
            this.showCabinPop = false;
            this.showCalendar = false;
        },
        /**
             * 查询航班
             */
        searchFlight() {
            this.$emit("searchFlight", {
                beginDate: new Date(this.newStartDate).format("yyyy/MM/dd"),
                cabinRank: this.newCabinRank
            });
        }

    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/common/index.less';
    @import '~styles/mixins/hairLine.less';
    @import '~styles/mixins/mixinsStyle.less';

    .endorse-container {
        font-size: .32rem;
        height: 100%;
        color: @text-color;
        background: #f2f3f5;

        ul.content {
            width: 100%;
            padding: 0 .3rem;
            background: #fff;

            li {
                position: relative;
                display: flex;
                align-items: center;
                height: 1.1rem;
                line-height: 1.1rem;
                font-size: .32rem;

                &:not(:last-of-type) {
                    .bbpx(1px, @border-color-base);
                }

                span {
                    .no-wrap;

                    .icon-arrow {
                        fill: @third-text-color;
                        margin-left: @white-space-sm;
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translateY(-50%);
                    }

                    &:first-of-type {
                        width: 1.86rem;
                        color: @secondary-text-color;
                    }

                    &:last-of-type {
                        max-width: calc(~"100% - 1.5rem");
                        color: @text-color;
                        text-align: right;

                        &.blue {
                            color: @theme-color;
                        }
                    }
                }
            }
        }

        .description {
            padding: .3rem;
            text-align: right;
            color: @theme-color;
            font-size: .26rem;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            .icon {
                margin-right: @white-space-sm;
                fill: @theme-color;
            }
        }

        .btn-group{
            margin: 0 .3rem;
        }

        .search-btn {
            margin-top: .5rem;
        }
    }

    .showCabinPop {
        background: #fff;

        .title {
            .bbpx(1px, @border-color-base);
            height: .92rem;
            line-height: .92rem;
            padding: 0 .1rem 0 .3rem;

            .icon-close {
                background: url(~assets/img/compment/icon_close_simple.png) center no-repeat;
                background-size: contain;
                height: .6rem;
                width: .6rem;
                margin: .16rem 0;
                float: right;
                display: inline-block;
                vertical-align: bottom;
            }
        }

        .tips-container {
            text-align: center;

            .tips {
                display: inline-block;
                height: .92rem;
                line-height: .92rem;
                font-size: .26rem;
                color: #F83939;
                background: url(~assets/img/compment/icon_tips_red.png) left center no-repeat;
                background-size: .4rem;
                text-indent: .56rem;
            }
        }

        ul {
            li {
                .bbpx(1px, @border-color-base);
                margin-left: .62rem;
                height: .92rem;
                line-height: .92rem;
                font-size: .32rem;
                text-align: left;

                .icon_common_select {
                    fill: @theme-color;
                }

                &.disable {
                    color: @disable-color;
                }
            }
        }
    }

    .mask {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
        tap-highlight-color: transparent;
        z-index: 501;
        transition: opacity .4s;
    }

    .endorse-notice {
        color: @third-text-color;
        font-size: .26rem;
        padding: 0 .3rem;
        margin: .2rem 0 1rem;

        .title {
            font-weight: bold;
            font-size: .28rem;
            margin-bottom: .15rem;
        }
    }

</style>
