<template>
    <!--火车票退票UI组件-->
    <div class="refundTicketHotel">
        <div class="normalUI">
            <div class="bookBtnWrap">
                <div
                    class="buttonAble"
                    :class="{ buttonNoAble: bookBtnUnable }"
                    @click.stop="tryShowDialog"
                >
                    {{ bookBtnText }}
                </div>
                <div class="addReceodShow content" v-if="isShowReceiveTip">
                    <div class="content">{{ addReceodNameTips }}</div>
                </div>
            </div>
            <div v-transfer-dom :show="isLoading">
                <Loading
                    :show="isLoading"
                    :text="loadingText"
                    class="couponLoading"
                ></Loading>
            </div>
            <div v-transfer-dom v-show="showRefundTicketFlag">
                <hotelconfirm
                    :toGetMsg="isToGetMsg"
                    :ticket="ticket"
                    @closeTheDialog="closeTheDialog"
                    @submitManualRefund="submitManualRefund"
                />
            </div>
        </div>
        <div class="emptyUI"></div>
    </div>
</template>

<script>
import utils from "bislibs/utils";
import permissionManager from "bislibs/permissionhandler";
import InfoLabel from "biscomponents/infolabel/msglabel.vue";
const hotelconfirm = () => import("./hotelconfirm.vue");

export default {
    directives: {},
    components: {
        InfoLabel,
        hotelconfirm,
    },
    props: {
        ticket: {
            type: Object,
            default: {},
            required: true,
        },
    },

    data() {
        return {
            isLoading: false, //是否显示提交加载框
            loadingText: "操作中...", //提交加载框提示语
            showRefundTicketFlag: false, //显示退票弹框
            isToGetMsg: false, //是否退票弹框要获取详情数据
            addReceodNameTips: "有权限才能退票", //退票按钮提示语
            checkAuthError: "您没有操作权限", //退票按钮权限校验提示语
        };
    },
    created() {},
    mounted() {},
    watch: {},
    computed: {
        /**
         * 退票按钮显示文字
         */
        bookBtnText: function () {
            let result = "退订";
            return result;
        },
        /**
         * 退票按钮状态是否置灰,true置灰，false不置灰
         *
         */
        bookBtnUnable: function () {
            let result = "";

            return result;
        },
        /**
         * 退票按钮是否显示 领取 提示框
         *
         */
        isShowReceiveTip: function () {
            //待领取状态 需要提示先领取
            let result = false;
            return result;
        },
    },
    methods: {
        checkAuth(id) {
            return permissionManager.hasAuth(id);
        },
        /**
         * 尝试弹出退票页面
         */
        tryShowDialog() {
            const that = this;
            if (that.bookBtnUnable) {
                return;
            }
            //校验一下当前用户是否有权限
            if (!this.checkAuth("46003008")) {
                return utils.showToast(that.checkAuthError);
            }

            that.isToGetMsg = true;
            that.openTheDialog();
        },
        /**
         * 退票框显示
         */
        openTheDialog() {
            this.showRefundTicketFlag = true;
        },
        /**
         * 退票框关闭
         */
        closeTheDialog() {
            this.showRefundTicketFlag = false;
            this.isToGetMsg = false;
        },
        /**
         * 提交退票功能
         */
        submitManualRefund() {
            this.closeTheDialog();
            //退票成功，刷新页面数据
            this.$emit("refreshPage");
        },
    },
};
</script>
<style scoped lang="less">
@import "~styles/common.less";
//订单详情
@font-color-text1: #333333;
//已出票
@font-color-text2: #478aee;
//订单号
@font-color-text3: #7f7f7f;
//总金额数字
@font-color-text4: #f39800;
//退票成功
@font-color-text5: #25cb67;
//顺丰速递
@font-color-text6: #191919;
.refundTicketHotel {
    background: white;
    .normalUI {
        width: 130px;

        .buttonAble {
            margin: 0px auto 0;
            width: 100px;
            line-height: 19px;
            // color: @primary;
            border: 1px solid @primary;
            text-align: center;
            border-radius: 2px;
            cursor: pointer;
            // float: right;
            font-size: 12px;
            margin-top: 5px;
            word-break: break-all;
            // &:hover {
            background: @primary;
            color: #fff;
            // }
        }

        .buttonNoAble {
            float: none;
            cursor: auto;
            color: #7f7f7f;
            border: 1px solid #7f7f7f;
            // &:hover {
                background: #fff;
            //     color: #7f7f7f;
            // }
        }
        .buttonResultOk {
            float: none;
            color: #51d25e;
            cursor: auto;
            border: 1px solid #51d25e;
            &:hover {
                background: #fff;
                color: #51d25e;
            }
        }
        .buttonResultFail {
            float: none;
            color: red;
            cursor: auto;
            border: 1px solid red;
            &:hover {
                background: #fff;
                color: red;
            }
        }
        .bookBtnWrap {
            position: relative;
            margin-bottom: 10px;
            .addReceodShow {
                position: absolute;
                display: none;
                top: 25px;
                left: 15px;
                // height: 35px;
                line-height: 20px;
                width: 100px;
                padding: 5px;
                box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
                background: #fff;
                z-index: 1;
                border-radius: 5px;
                .content {
                    color: #7f7f7f;
                    text-align: center;
                }
            }
        }
        .bookBtnWrap:hover .addReceodShow {
            display: block;
        }
    }
    .emptyUI {
        font-size: 20px;
    }
}
</style>
