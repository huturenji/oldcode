<template>
    <div class="orderStatusTab">
        <div class="classifyMenu">
            <ul class="clearfix">
                <li
                    v-for="(item,index) in tabList"
                    :key="item"
                    class="cursorp"
                    :class="[selectedTab==index && 'selected',tabList.length < 9 && 'liFormat']"
                    @click.stop="switchTab(index)"
                >
                    <div v-if="!item.showPop">{{item.name}}</div>
                    <div v-else class="lastChildDiv">
                        <div class="showNormalDiv">{{item.name}}</div>
                        <div class="invoiceButtonWrap">
                            <div class="invoiceButton cursorp"></div>
                            <div class="invoiceDialogShow cursorp">
                                <!-- solt的名字 带上index，这样可以保证多个弹框的实现 -->
                                <slot :name="'tabPop'+index"></slot>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        tabList: {
            type: Array,
            required: true,
            default: []
        },
        specifiedIndex: {
            type: Number,
            default: 0
        },
        value: {
            //v-model
            type: Number,
            default: 0
        }
    },
    directives: {},
    components: {},
    data() {
        return {
            selectedTab: 0 //页面显示的 标签栏
        };
    },
    created() {},
    mounted() {},

    watch: {
        tabList: {
            handler(val) {
                // console.log('tabList...');
            },
            deep: true,
            immediate: true
        },
        specifiedIndex: {
            handler(val) {
                // console.log("value..." + val);
                this.selectedTab = val >= 0 ? val : 0;
            },
            deep: true,
            immediate: true
        }
    },

    methods: {
        /**
         * 切换订单状态标签
         * @param statusIndex
         */
        switchTab(statusIndex) {
            if (this.selectedTab == statusIndex) {
                //  console.log('switchTab...');
                return;
            }
            this.selectedTab = statusIndex;
            //切换页签的时候，也调用一次接口返回选中的下标statusIndex
            this.$emit("input", statusIndex); //v-model
        }
    }
};
</script>
<style scoped lang="less">
@import "~styles/common.less";
@line-height: 32px;
@font-color: #191919;
@placeholder-color: #b2b2b2;
.orderStatusTab {
    .flex-box;
    .flex-flow(column, nowrap);
    padding: 0px 30px;
    .classifyMenu {
        margin-top: 16px;
        padding-top: 10px;
        border-top: 1px dashed #e5e5e5;
        li {
            float: left;
            width: fit-content;
            width: -moz-fit-content;
            width: -webkit-fit-content;
            height: 34px;
            line-height: 34px;
            text-align: center;
            font-size: 14px;
            border: 1px solid #c2c2c2;
            border-left: none;
            padding: 0 15px;
            margin: 5px 0px;
            cursor: pointer;
            &:hover,
            &.selected {
                color: #fff;
                background-color: @primary;
                border-color: @primary;
            }
            &:first-child {
                border-radius: @radius 0 0 @radius;
                border-left: 1px solid #c2c2c2;
            }
            &:last-child {
                border-radius: 0 @radius @radius 0;
            }
            .lastChildDiv {
                display: flex;
                .showNormalDiv {
                    margin-left: 15px;
                }
                .invoiceButtonWrap {
                    position: relative;
                    .invoiceButton {
                        background: url(~assets//icon_wait_pay.png)
                            no-repeat right;
                        background-size: 15px;
                        height: 15px;
                        width: 15px;
                    }
                    .invoiceDialogShow {
                        position: absolute;
                        display: none;
                        top: 30px;
                        right: 0;
                        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
                        z-index: 1;
                        border-radius: 5px;
                        height: fit-content;
                        height: -moz-fit-content;
                        height: -webkit-fit-content;
                        width: 480px;
                        padding: 25px;
                        background: #ffffff;
                        .line1 {
                            color: #333333;
                        }
                        .line2 {
                            color: #7f7f7f;
                            line-height: 25px;
                            margin-bottom: 15px;
                        }
                        .line3 {
                            color: #7f7f7f;
                            line-height: 25px;
                        }
                    }
                }
                .invoiceButtonWrap:hover .invoiceDialogShow {
                    display: block;
                }
            }
        }
        .liFormat {
            width: 117px;
            padding: 0;
        }
    }
}
</style>

