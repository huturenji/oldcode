
import useTurn from "../useTurn";
import useSquarenine from "../useSquarenine";
import useHiteggs from "../useHiteggs";
import useGiftrain from "../useGiftrain";
import systemMixin from '@/common/mixin/system.js'
import { getUrlParams } from '@/utils/common.js'
export default {
    mixins: [useTurn, useSquarenine, useHiteggs, useGiftrain, systemMixin],
    computed: {
        // 抽奖背景样式
        contentBg() {
            if (this.type === 1) {
                return {
                    background: `url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/turntable/bg_cj_dzp_bg.png") center center`,
                    backgroundSize: "cover",
                };
            } else if (this.type === 2) {
                return {
                    background: `url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/hiteggs/icon_cj_zjd_bj.png")`,
                    backgroundSize: "100% 100%",
                };
            } else if (this.type === 3) {
                return {
                    background: `url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/squarenine/bg_cj_jgg_bg.png") center center`,
                    backgroundSize: "cover",
                };
            } else if (this.type === 4) {
                return {
                    background: `url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/giftrain/bg_cj_hby_bg.png") center 58%`,
                    backgroundSize: "cover",
                };
            } else {
                return {
                    backgroundColor: '#fff'
                };
            }
        },
        // 抽奖主体样式  大转盘和九宫格需要进行缩放兼容不同尺寸手机
        contentStyle() {
            if (this.type === 1 || this.type === 3) {
                return {
                    transform: `translateY(-50%) scale(${this.scaleNum})`,
                    marginTop: `${this.navigationBarHeight / 2}px`
                }
            } else {
                return ''
            }
        },
        // 抽奖页标题样式
        draw_title() {
            let styleObj = {};
            if (this.type === 1) {
                styleObj.backgroundImage = `url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/turntable/icon_cj_dzp_bt.png")`;
            } else if (this.type === 2) {
                styleObj.backgroundImage = `url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/hiteggs/icon_cj_zjd_bt.png")`
                styleObj.marginTop = parseInt(this.navHeight) + 'px'
            } else if (this.type === 3) {
                styleObj.backgroundImage = `url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/squarenine/icon_cj_jgg_bt.png")`
            } else if (this.type === 4) {
                styleObj.backgroundImage = `url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/giftrain/icon_cj_hby_bt.png")`
                styleObj.marginTop = parseInt(this.navHeight) + 'px'
            }
            styleObj.backgroundRepeat = "no-repeat";
            styleObj.backgroundSize = "100% 100%";
            return styleObj;
        },
        // 剩余抽奖次数样式
        tipsStyle() {
            if (this.type === 1) {
                return {
                    marginTop: '140rpx'
                }
            } else if (this.type === 2) {
                return {
                    position: 'absolute',
                    color: '#fff',
                    bottom: '140rpx'
                };
            } else if(this.type === 3) {
                return {
                    marginTop: '40rpx'
                };
            } else if (this.type === 4) {
                return {
                    position: 'absolute',
                    bottom: '214rpx'
                };
            } else {
                return "";
            }
        },
        // 活动规则标签样式
        rule_style() {
            let styleObj = {};
            if (this.type === 1) {
                styleObj.backgroundImage = `url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/images/icon_cj_dzp_guize.png")`;
            } else if (this.type === 2) {
                styleObj.backgroundImage = `url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/images/icon_cj_zjd_guize.png")`
            } else if (this.type === 3) {
                styleObj.backgroundImage = `url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/images/icon_cj_jgg_guize.png")`
            } else if (this.type === 4) {
                styleObj.backgroundImage = `url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/images/icon_cj_hby_guize.png")`
                styleObj.zIndex = this.rainGaming ? 90 : 100
            }
            styleObj.backgroundRepeat = "no-repeat";
            styleObj.backgroundSize = "cover";
            styleObj.top = 10 + parseInt(this.navHeight) + 'px';
            return styleObj;
        },
        // 我的奖品标签样式
        winprize_style(){
            let styleObj = {};
            if (this.type === 1) {
                styleObj.backgroundImage = `url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/images/icon_cj_zjd_wodejiangpin1.png")`;
            } else if (this.type === 2) {
                styleObj.backgroundImage = `url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/images/icon_cj_zjd_wodejiangpin1.png")`
            } else if (this.type === 3) {
                styleObj.backgroundImage = `url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/images/icon_cj_zjd_wodejiangpin1.png")`
            } else if (this.type === 4) {
                styleObj.backgroundImage = `url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/images/icon_cj_zjd_wodejiangpin2.png")`
                styleObj.zIndex = this.rainGaming ? 90 : 100
            }
            styleObj.backgroundRepeat = "no-repeat";
            styleObj.backgroundSize = "cover";
            return styleObj;
        }
    },
    data() {
        return {
            scaleNum: 1,  // 缩放比例
            contentClass: {
                1: 'scaleContent1',
                2: 'scaleContent2',
                3: 'scaleContent1',
                4: 'scaleContent2'
            },
            type: 0,
            count: 0,
            // 转盘和九宫格内未中奖图标 (笑脸)
            emptyPrize: {
                id: 0,
                name: "谢谢参与",
                imgUrl: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/images/icon_cj_xiexiecanyu2.png'
            },
            // 未中奖弹框图标 (哭脸)
            emptyPrize1: {
                name: "谢谢参与",
                imgUrl: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/images/icon_cj_weizhongjiang.png'
            },
            prizeList: [],
            prizeIndex: -1,
            activityId: '',// 活动id
            loading: true,
            winPrizeInfo: {}, // 中奖信息
            tipsMessage: '', // 弹窗提示信息
            activityState: 2, // 活动状态 1-待启动；2-已启用；3-已结束
            rainGaming: false, // 红包雨是否游戏中，用于控制规则的z-index
            // 错误状态码提示语
            errCode: {
                91100001: '参数错误，无法访问',
                91100002: '当前活动已结束',
                91100008: '抱歉，您的抽奖机会已用完',
                91100009: '抱歉，您的抽奖机会已用完',
                88000999: '活动太火爆了，稍后再试！',
                91100032: '抱歉，您未被邀请参加本次活动！',
            }
        };
    },
    onLoad({ activityId, q }) {
        if (q) {
            // 扫码获取参数
            const url = decodeURIComponent(q);
            this.activityId = getUrlParams('activityId', url);
        } else {
            // 跳转页面获取参数
            this.activityId = activityId
        }
    },
    onShow() {
        // 处理跳转后回退时标题又消失的问题
    },
    mounted() {
        this.getLuckDetail();
    },
    methods: {
        // 设置抽奖活动缩放比
        setScale(type) {
            // 大转盘和九宫格需要根据屏幕高度进行缩放兼容不同手机尺寸
            if (type === 1 || type === 3) {
                const scaleNum = (this.windowHeight - this.navHeight) / 724
                this.scaleNum = scaleNum < 1 ? scaleNum : 1
            }
        },
        // 对获取的奖品填充谢谢参与
        setEmptyPrize(list, type) {
            if (type === 1) {
                const prizeLength = list.length
                if (prizeLength === 1) {
                    this.prizeList = [
                        list[0],
                        this.emptyPrize,
                        list[0],
                        this.emptyPrize
                    ]
                } else if (prizeLength % 2) {
                    this.prizeList =  list.concat(this.emptyPrize);  
                } else {
                    list.splice(prizeLength, 0, this.emptyPrize)
                    list.splice(prizeLength / 2, 0, this.emptyPrize)
                    this.prizeList = list
                }
            } else if (type === 3) {
                // 九宫格填充谢谢参与，小于等于7时为九宫格，8-11为12宫格
                const prizeLength = list.length
                const leftLength = prizeLength <= 7 ? (8 - prizeLength) : (12 - prizeLength)
                for (let i = leftLength; i > 0; i--) {
                    list.splice(parseInt((prizeLength / leftLength) * i), 0, this.emptyPrize)
                }
                this.prizeList = list
            } else {
                this.prizeList = list.concat(this.emptyPrize)
            }
        },
        // 显示抽奖结果弹窗
        showLotteryResultModal() {
            this.$refs.lotteryResultPopup.open();
        },
        // 关闭抽奖结果弹窗
        closeLotteryResultModal() {
            this.$refs.lotteryResultPopup.close();
        },
        // 验证是否还能抽奖
        checkRun(callback) {
            // 活动状态未非启动状态弹出提示
            let isRun = true
            if (this.activityState !== 2){
                this.$refs.tipsPopup.open();
                isRun =  false;
            }

            if (this.count === 0) {
                this.tipsMessage = '抱歉，您的抽奖次数已用完！';
                this.$refs.tipsPopup.open();
                isRun =  false;
            }
            callback(isRun)
        },
        // 再次抽奖
        drawAgain(){
            this.closeLotteryResultModal();
            switch (this.type) {
                case 1:
                    this.$refs.turntable.startTurns();
                    break;
                case 2:
                    this.closeLotteryResultModal();
                    break;
                case 3:
                    this.$refs.squarenine.startDraw();
                    break;
                case 4:
                    this.$refs.giftrain.start();
                    break;
                default:
                    break;
            }
        },
    },
};