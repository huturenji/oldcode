import turntable from "@/components/turntable";
import hiteggs from "@/components/hiteggs";
import squarenine from "@/components/squarenine";
import giftrain from "@/components/giftrain";
import oneyuanflashkill from "@/components/oneyuanflashkill";
import useTurn from "../useTurn";
import useSquarenine from "../useSquarenine";
import useHiteggs from "../useHiteggs";
import useGiftrain from "../useGiftrain";
import useOneyuanflashkill from "../useOneyuanflashkill";
import Result from "@/pages/result/result.vue";
import Oneyuanflashkillresult from "@/pages/result/oneyuanflashkillresult.vue";
export default {
    components: {
        turntable,
        hiteggs,
        squarenine,
        giftrain,
        oneyuanflashkill,
        Result,
        Oneyuanflashkillresult
    },
    mixins: [useTurn, useSquarenine, useHiteggs, useGiftrain, useOneyuanflashkill],
    computed: {
        // 抽奖背景样式
        contentBg() {
            if (this.type === 1) {
                return {
                    background: `url("${this.imgUrl}turntable/bg_cj_dzp_bg.png") center center`,
                    backgroundSize: "cover",
                };
            } else if (this.type === 2) {
                return {
                    background: `url("${this.imgUrl}hiteggs/icon_cj_zjd_bj.png")`,
                    backgroundSize: "100% 100%",
                };
            } else if (this.type === 3) {
                return {
                    background: `url("${this.imgUrl}squarenine/bg_cj_jgg_bg.png") center center`,
                    backgroundSize: "cover",
                };
            } else if (this.type === 4) {
                return {
                    background: `url("${this.imgUrl}giftrain/bg_cj_hby_bg.png") center 58%`,
                    backgroundSize: "cover",
                };
            } else if (this.type === 6) {
                return {
                    background: `url("${this.imgUrl}oneyuanflashkill/bg_yiyuan_backdrop1.png") center center`,
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
                    marginTop: `${window.titleBarHeight / 2}px`
                }
            } if (this.type === 6) {
                return {
                    transform: `translateY(-50%) scale(${this.scaleNum})`,
                    marginTop: `${window.titleBarHeight / 2}px`
                }
            } else {
                return ''
            }
        },
        // 抽奖页标题样式
        draw_title() {
            let styleObj = {};
            if (this.type === 1) {
                styleObj.backgroundImage = `url("${this.imgUrl}turntable/icon_cj_dzp_bt.png")`;
            } else if (this.type === 2) {
                styleObj.backgroundImage = `url("${this.imgUrl}hiteggs/icon_cj_zjd_bt.png")`
                styleObj.marginTop = '10rpx'
            } else if (this.type === 3) {
                styleObj.backgroundImage = `url("${this.imgUrl}squarenine/icon_cj_jgg_bt.png")`
            } else if (this.type === 4) {
                styleObj.backgroundImage = `url("${this.imgUrl}giftrain/icon_cj_hby_bt.png")`
                styleObj.marginTop = '0'
            } else if (this.type === 6) {
                styleObj.backgroundImage = `url("${this.imgUrl}oneyuanflashkill/pic_yiyuan_biaoti.png")`
                styleObj.marginTop = '0';
                styleObj.marginLeft = 'auto';
                styleObj.marginRight = 'auto';
                styleObj.marginBottom = '-58rpx';
                styleObj.width = '640rpx';
                styleObj.height = '384rpx';
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
            } else if(this.type === 6) {
                return {
                    marginTop: '40rpx'
                };
            } else {
                return "";
            }
        },
        // 活动规则标签样式
        rule_style() {
            let styleObj = {};
            if (this.type === 1) {
                styleObj.backgroundImage = `url("${this.imgUrl}images/icon_cj_dzp_guize.png")`;
            } else if (this.type === 2) {
                styleObj.backgroundImage = `url("${this.imgUrl}images/icon_cj_zjd_guize.png")`
            } else if (this.type === 3) {
                styleObj.backgroundImage = `url("${this.imgUrl}images/icon_cj_jgg_guize.png")`
            } else if (this.type === 4) {
                styleObj.backgroundImage = `url("${this.imgUrl}images/icon_cj_hby_guize.png")`
                styleObj.zIndex = this.rainGaming ? 90 : 100
            } else if (this.type === 6) {
                styleObj.backgroundImage = `url("${this.imgUrl}images/icon_cj_yyg_guize.png")`
            }
            styleObj.backgroundRepeat = "no-repeat";
            styleObj.backgroundSize = "cover";
            return styleObj;
        },
        // 我的奖品标签样式
        winprize_style(){
            let styleObj = {};
            if (this.type === 1) {
                styleObj.backgroundImage = `url("${this.imgUrl}images/icon_cj_zjd_wodejiangpin1.png")`;
            } else if (this.type === 2) {
                styleObj.backgroundImage = `url("${this.imgUrl}images/icon_cj_zjd_wodejiangpin1.png")`
            } else if (this.type === 3) {
                styleObj.backgroundImage = `url("${this.imgUrl}images/icon_cj_zjd_wodejiangpin1.png")`
            } else if (this.type === 4) {
                styleObj.backgroundImage = `url("${this.imgUrl}images/icon_cj_zjd_wodejiangpin2.png")`
                styleObj.zIndex = this.rainGaming ? 90 : 100
            } else if (this.type === 6) {
                styleObj.backgroundImage = `url("${this.imgUrl}images/icon_cj_zjd_wodejiangpin1.png")`
            } 
            styleObj.backgroundRepeat = "no-repeat";
            styleObj.backgroundSize = "cover";
            return styleObj;
        }
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            scaleNum: 1,  // 缩放比例
            contentClass: {
                1: 'scaleContent1',
                2: 'scaleContent2',
                3: 'scaleContent1',
                4: 'scaleContent2',
                6: 'scaleContent1'
            },
            type: 0,
            count: 0,
            // 转盘和九宫格内未中奖图标 (笑脸)
            emptyPrize: {
                id: 0,
                name: "谢谢参与",
                imgUrl: require("../../../static/shared/images/icon_cj_xiexiecanyu2.png")
            },
            // 未中奖弹框图标 (哭脸)
            emptyPrize1: {
                name: "谢谢参与",
                imgUrl: require("../../../static/shared/images/icon_cj_weizhongjiang.png")
            },
            // 未中奖弹框图标一元秒杀
            emptyPrize6: {
                name: "很遗憾，您来晚一步，下期好运哦~",
                imgUrl: require("../../../static/shared/images/icon_yiyuan_weizhongjiang.png")
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
                91100032: '抱歉，您未被邀请参加本次活动'
            }
        };
    },
    onLoad({ activityId }) {
        this.activityId = activityId
    },
    onShow() {
        // 处理跳转后回退时标题又消失的问题
        this.setTitle()
    },
    mounted() {
        this.getLuckDetail();
    },
    methods: {
        // 设置抽奖活动缩放比
        setScale(type) {
            // 大转盘和九宫格需要根据屏幕高度进行缩放兼容不同手机尺寸
            if (type === 1 || type === 3 || type === 6) {
                const scaleNum = (document.body.clientHeight - window.titleBarHeight) / 724
                this.scaleNum = scaleNum < 1 ? scaleNum : 1
            }
        },
        // 设置title显示 目前 大转盘，砸金蛋，九宫格显示，红包雨不显示
        setTitle() {
            if ([1,2,3].includes(this.type)) {
                window.titleBar.set({
                    "title": {
                        "show": true,
                        "showTitle": true,
                        "color": "#fff",
                        "themeMode": "light",
                        "suspend": true,
                        "opacity": 0
                    },
                    "status": {
                        "show": true,
                        "themeMode": "light",
                        "opacity": 0,
                        "suspend": true
                    }
                })
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
            } else if (type === 6) {
                // 一元秒杀
                const prizeLength = list.length;
                const leftLength = 5 - prizeLength;
                for (let i = leftLength; i > 0; i--) {
                    list.push(this.emptyPrize)
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
        checkRun() {
            // 活动状态未非启动状态弹出提示
            if (this.activityState !== 2){
                this.$refs.tipsPopup.open();
                return false;
            }

            if (this.count === 0) {
                this.tipsMessage = '抱歉，您的抽奖次数已用完！';
                this.$refs.tipsPopup.open();
                return false;
            }
            return true;
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
                case 6:
                    this.$refs.oneyuanflashkill.startDraw();
                    break;
                default:
                    break;
            }
        },
    },
};