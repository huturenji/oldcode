<template>
	<view class="achievement">
        <w-loading ref="loading"></w-loading>
        <u-navbar title="高考季" :bgColor="navbarBg" :titleStyle="{ color: titleColor, fontWeight: '500' }">
            <template slot="left">
                <text class="iconfont icon_arrow_left" @click="$Router.push({path: '/views/topic/index', query: {topicId: '120005'}})"></text>
            </template>
        </u-navbar>
		<view class="achievement_box">
			<view class="text flex_row_between_center">
				<view class="score"><text class="num-font">{{score}}</text>分 </view>
				<view class="open_btn" @click="share"></view>
			</view>
            <view class="share_btn">
                <view class="showMaskBox">
                    <view class="showMask">分享至好友或朋友圈立刻获取更多奖励~
                        <view class="sanjiao"></view>
                    </view>
                </view>
                <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/btn_gaokao_fenxiang1.png" class="share flex_row_center_center" @click="share"></image>
                <view class="flex_row_center_center reanswer"  @click="retest">重新答题</view>
            </view>
		</view>
        
		<view class="reward">
            <view class="ticket">
                <view class="ticket_item" v-for="(item, index) in ticketArr" :key="index">
                    <view class="task flex_row_center_center">
                        <image :src="`https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/${item.taskState ? 'radio_sel2' : 'btn_common_radio_sel'}.png`"></image>
                        <view>
                            任务{{ 1 + index + ': ' + item.task }}
                        </view>
                    </view>
                    <view class="ticket_item_content flex_row_between_center" :class="{received: item.taskState}" v-if="item.ticket">
                        <view class="ticket_intro flex_row_around_center">
                            <view class="ticket_num flex_row_center_center">
                                <view><text>¥</text><text class="num-font">{{ item.taskState ? item.ticket.publishValue : '?' }}</text></view>
                            </view>
                            <view class="ticket_desc">
                                <view class="ticket_name">{{ item.ticket ? item.ticket.couponName : '' }}</view>
                                <view class="ticket_time">
                                    {{ item.ticket && item.ticket.publishStartTime ? item.ticket.publishStartTime.split(' ')[0] + ' ~ ' + item.ticket.publishEndTime.split(' ')[0] : '' }}
                                </view>
                            </view>
                        </view>
                        <view class="go_shopping flex_column_center_center" :class="!item.taskState ? 'hidden' : ''">
                            <text>{{ item.taskState ? '已发放' : '待分享' }}</text>
                            <view class="btn" :class="{received : item.taskState}" @click="goShopping(item)">{{ item.taskState ? '去使用' : '去分享' }}</view>
                        </view>
                        <view class="left_top_tag" v-if="index === 1 && !item.taskState">随机红包</view>
                    </view>
                    <view class="share_intro flex_row_center_center" v-if="index === 1 && item.taskState == false">
                        <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/btn_gaokao_fenxiang2.png" @click="share"></image>
                    </view>
                </view>
            </view>
            <view class="bg_end"></view>
		</view>
        <!-- 成绩单弹框 start -->
        <uniPopup ref="popup" class="score_popup">
            <view class="score_box flex_column_between_start">
                <input type="nickname" @change="getNickName" placeholder-class="nick_name_placeholder" :maxlength="8" class="nick_name" placeholder="获取微信昵称" />
                <image class="notice_box" :src="admittedSchool.sharedImg" mode="widthFix"></image>
                <view class="btn_box">
                    <image mode="widthFix" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/icon_cj_hby_anniu.png" @click="shareToFriends"></image>
                </view>
            </view>
        </uniPopup>
        <!-- 运费规则弹框 end -->
        <!-- 生成分享图 -->
        <poster
            v-if="postList && postList.length" 
            :list="postList" 
            background-color="#FFF" 
            :width="750" 
            :height="1000"
            ref="poster"
            @on-success="posterSuccess" 
            @on-error="posterError"
        >
        </poster>
	</view>
</template>

<script>
import uniPopup from "@/common/components/uni-popup/uni-popup.vue";
import uniPopupDialog from "@/common/components/uni-popup/uni-popup-dialog.vue";
import poster from "@/views/components/poster/index.vue"; // 生成海报的组件
import goodsHandler from "@/views/components/goods/handler";
import ticketEnum from './gaokaoTicket';
import { getStorageSync, setStorageSync, skipTo } from '@/utils/common'

export default {
	components: {
		uniPopup,
		uniPopupDialog,
        poster
	},
	data() {
		return {
            defaultShareCode: '', // 小程序码
            postList: [], // 绘制canvas需要的元素
            ticketArr: [{ task: '完成高考模拟试题', taskState: false, ticket: '' }, { task: '分享至好友/朋友圈', taskState: false, ticket: '' }],
            score: 0, // 分数
            pointRange: [ // 分数区间
                [400, 500],
                [589, 609],
                [620, 649],
                [660, 689],
                [700, 729]
            ],
            schoolList: {
                0: [ { name: '深圳职业技术学院', inden: 'shenzhenzhiye', sharedImg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/beida.png' } ],
                1: [ { name: '厦门大学', inden: 'xiada', sharedImg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/beida.png' }, { name: '中山大学', inden: 'zhongshan', sharedImg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/beida.png' } ],
                2: [ { name: '武汉大学', inden: 'wuda', sharedImg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/beida.png' }, { name: '浙江大学', inden: 'zheda', sharedImg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/beida.png' } ],
                3: [ { name: '中国人民大学', inden: 'renda', sharedImg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/beida.png' }, { name: '复旦大学', inden: 'fudan', sharedImg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/beida.png' } ],
                4: [ { name: '清华大学', inden: 'qinghua', sharedImg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/beida.png' }, { name: '北京大学', inden: 'beida', sharedImg: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/beida.png' } ]
            },
            nickName: '', // 用户昵称
            couponIds: ticketEnum[process.env.ENV || 'pro'], // 优惠券id
            codeUrl: process.env.ENV === 'pro' ? 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/code-pro.jpg' : 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/code.jpg',
            navbarBg: 'transparent',
            titleColor: '#fff',
		};
	},
	onShow() {
		this.checkShare();
	},
    onPageScroll(e) {
        if (e.scrollTop > 60) {
            this.navbarBg = '#fff';
            this.titleColor = '#000';
        } else {
            this.navbarBg = 'transparent';
            this.titleColor = '#fff';
        }
    },
	mounted() {
        this.score = this.$Route.query.score;
	},
	watch: {
        admittedSchool(val) {
            console.log('admittedSchool', val)
        }
    },
	computed: {
		admittedSchool() {
            let index = this.pointRange.findIndex(e => e[0] <= this.score && e[1] >= this.score);
            if (index === -1) {
                index = 0;
            }
            let schoolList = this.schoolList[index],
                schoolLen = schoolList.length;
            if (schoolLen === 1) {
                return schoolList[0]
            } 
			return Math.random() > 0.5 ? schoolList[1] : schoolList[0];
		},
	},
	methods: {
        // 获取昵称
        getNickName(e) {
            this.nickName = e.detail.value;
        },
		// 分享事件
		share() {
            this.$refs.popup.open();
		},
        // 重新答题
        retest() {
            this.$Router.push({
                path: '/views/activities/gaokao/index'
            })
        },
        // 去购物
        goShopping(ticket) {
            if (!ticket.taskState) {
                this.share()
                return;
            }
            const item = ticket.ticket;
            if (item.promotionType == 406) {//消费券跳转
                this.$Router.push({
                    path: '/views/coupon/myCoupon',
                    query: {
                        activeIndex: 2
                    }
                })
            } else if (item.promotionType == 404) { //红包跳转
                uni.switchTab({
                    url: '/pages/index/index'
                })
            } else if(item.promotionType == 405) {//运费券跳转
                if (item.linkInfo != null) {
                    let tempLinkInfo = item.linkInfo.replace(/wx_url/g,"url");
                    let skipUrl = {};
                    try{
                        skipUrl = JSON.parse(tempLinkInfo);
                        skipTo(skipUrl, this);
                    } catch(error) {
                        uni.switchTab({
                            url: '/pages/index/index'
                        })
                    }
                } else {
                    uni.switchTab({
                        url: '/pages/index/index'
                    })
                }
            } else {
                if (item.linkInfo != null) {
                    let tempLinkInfo = item.linkInfo.replace(/wx_url/g,"url");
                    let skipUrl = {};
                    try{
                        skipUrl = JSON.parse(tempLinkInfo);
                        skipTo(skipUrl,this);
                    } catch(error) {
                        this.gotoDefaultList(item);
                    }
                }else{
                    this.gotoDefaultList(item);
                }  
            }
        },
        // 去活动商品列表页面
        gotoDefaultList(item) {
            if (item.receivedState == 2 || (item.receivedState == 3 && item.notUseCount != 0)) {
                let params = {}
                if (item.storeId > 0) {
                    params.storeId = item.storeId
                }
                if (item.useType == 2 && item.skus) { ////指定商品 跳转到活动商品列表页面
                    params.skus = item.skus;
                    this.$Router.push({
                        path: '/views/coupon/list/index',
                        query: {
                            source: 'coupon',
                            ...params
                        }
                    })
                    return 
                } else if (item.useType == 3 && item.couponCategoryVO) { //指定分类 跳转到商品列表页面
                    params.categoryIds = item.couponCategoryVO.categoryId
                }
                this.$Router.push({
                    path: '/views/goods/list/index',
                    query: {
                        source: 'coupon',
                        ...params
                    }
                })
            }
        },
        // 分享给朋友
        shareToFriends() {
            this.$refs.loading?.open()
            this.postList = [
                {
                    type: 'image',
                    path: this.admittedSchool.sharedImg,
                    x: 0,
                    y: 0,
                    width: 750,
                    height: 1120
                },
                {
                    type: 'text',
                    x: 100,
                    y: 490,
                    text: this.nickName || '拾小惠',
                    size: 28,
                    color: '#222'
                },
                {
                    type: 'image',
                    path: this.codeUrl,
                    x: 560,
                    y: 20,
                    width: 170,
                    height: 170
                }
            ];
        },
        //获取优惠券列表
        getCouponList() {
            this.getFreightCouponList();
            this.getRedPacketList();
        },
        // 获取运费券
        getFreightCouponList() {
            let param = {};
            param.current = 1;
            param.pageSize = 1000;
            param.couponIdList = [this.couponIds.id1]
            goodsHandler.freightCouponCenter(param).then(res => {
                if (res.state == 200) {
                    const coupon = res.data.list[0] || {};
                    coupon.publishStartTime = coupon.effectiveStart?.replace(/-/g, '.');
                    coupon.publishEndTime = coupon.effectiveEnd?.replace(/-/g, '.');
                    this.ticketArr[0].ticket = coupon;
                    if (coupon.receivedState == 2 || (coupon.receivedState == 3 && coupon.notUseCount != 0)) {
                        this.ticketArr[0].taskState = true;
                    }
                    const isFirstJoin = getStorageSync('2023gaokaoJoin');
                    if (!isFirstJoin) {
                        this.receive(this.ticketArr, 0)
                    }
                } else {
                    uni.showToast({ title: res.msg, icon: 'none' })
                }
            }).catch((e) => {
                //异常处理
                console.log('getFreightCouponList', e)
            })
        },
        // 获取红包
        getRedPacketList() {
            let param = {};
            param.current = 1;
            param.pageSize = 1000;
            param.couponIds = this.couponIds.id2;
            goodsHandler.getRedPacketList(param).then(res => {
                if (res.state == 200) {
                    const coupon = res.data.couponList[0] || {};
                    this.ticketArr[1].ticket = coupon;
                    if (coupon.receivedState == 2) {
                        this.ticketArr[1].taskState = true;
                        delete param.couponIds;
                        param.useState = 1;
                        goodsHandler.getMyRedpacketList(param).then(res => {
                            if (res.state == 200) {
                                const redPacketList = res.data?.page?.list || [];
                                const redpacket = redPacketList.find(e => e.couponId == this.couponIds.id2) || {};
                                this.ticketArr[1].ticket.publishValue = redpacket.randomAmount || 0;
                            } else {
                                uni.showToast({ title: res.msg, icon: 'none' })
                            }
                        }).catch(err => {
                            console.log('getMyRedpacketList', err)
                        });
                    }
                } else {
                    uni.showToast({ title: res.msg, icon: 'none' })
                }
            }).catch(e => {
                console.log('getRedPacketList', e)
            })
        },
        // 领取优惠券
        receive(arr, index) {
            const item = arr[index].ticket;
            let params = {}
            params.couponInfoVOs = []
            params.couponInfoVOs.push({
                promotionType: item.promotionType ? item.promotionType : 404,
                promotionId: item.couponId
            })
            goodsHandler.reveiverAllCoupon(params).then(res => {
                if (res.state !== 200) {
                    uni.showToast({
                        title: '优惠券发放失败!',
                        icon:'none'
                    })
                } else {
                    if (index === 0) {
                        setStorageSync('2023gaokaoJoin', true)
                    } else {
                        setStorageSync('2023gaokaoShare', true)
                    }
                }
                this.getCouponList()
            })
        },
		// 调用接口查询是否分享过了
		checkShare() {
			this.getCouponList();
		},
        // 生产图片失败函数
        posterError(err) {
            console.log('err', err);
            this.$refs.loading?.close()
        },
        // 生成图片成功，会把临时路径在这里返回
        posterSuccess(url) {
            // 分享图片
            wx.showShareImageMenu({
                path: url,
                success: (res) => {
                    if (res.errMsg === 'showShareImageMenu:ok') {
                        if (!this.ticketArr[1].taskState) {
                            // 调接口发券 改状态
                            this.receive(this.ticketArr, 1)
                        }
                    }
                },
                fail: (err) => {
                    console.log('reason:', err);
                },
                complete: () => {
                    this.postList = [];
                    this.$refs.loading?.close()
                }
            });
        },
	},
};
</script>

<style lang='scss' scoped>
page {
    width: 750rpx;
    margin: 0 auto;
    background: #FFFFFF;
    -webkit-touch-callout: none;
    /*系统默认菜单被禁用*/
    -webkit-user-select: none;
    /*webkit浏览器*/
    -khtml-user-select: none;
    /*早期浏览器*/
    -moz-user-select: none;
    /*火狐*/
    -ms-user-select: none;
    /*IE10*/
    user-select: none;
    -webkit-touch-callout: none;
    -moz-touch-callout: none;
    -ms-touch-callout: none;
    touch-callout: none;
}

.achievement {
    padding-top: 2rpx;
    width: 100%;
    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/bg_gaokao_jieguo.png') no-repeat;
    background-size: cover;
    padding-bottom: 104rpx;

    .text {
        padding-top: 128rpx;
        height: 200rpx;
        position: relative;
        margin-bottom: 200rpx;
        .score {
            position: absolute;
            top: 40rpx;
            left: 430rpx;
            color: #F30300;
            font-size: 32rpx;
            text {
                font-size: 64rpx;
                font-weight: 700;
                letter-spacing: 2rpx;
                margin-right: 6rpx;
            }
        }
        .open_btn {
            position: absolute;
            top: 240rpx;
            left: 326rpx;
            background: transform;
            width: 100rpx;
            height: 100rpx;
        }
    }

    &_box {
        width: 100%;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/pic_gaokao_jieguo1.png');
        background-size: cover;
        margin-top: 180rpx;
        padding-bottom: 150rpx;
    }
    
    .share_btn {
        .share {
            width: 552rpx;
            height: 104rpx;
            margin: 140rpx auto 24rpx;
        }
        .showMaskBox {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            height: 0;
            top: 86rpx;
            z-index: 100;
            left: 50%;
            transform: translateX(-50%);
            .showMask {
                font-size: 26rpx;
                font-family: PingFang SC, PingFang SC-Semibold;
                padding: 12rpx 20rpx;
                background-color:#272827;
                opacity: 0.9;
                box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(204,204,204,0.50); 
                color:#fff;
                display:flex;
                align-items: center;
                justify-content: center;
                border-radius: 8rpx;
                position: relative;
                animation: jump 1.5s 1s infinite;
                .sanjiao {
                    width: 0;
                    height: 0;
                    border: 20rpx solid;
                    border-top-color: #272827;
                    border-bottom-color: transparent;
                    border-left-color: transparent;
                    border-right-color: transparent;
                    position: absolute;
                    bottom: -34rpx;
                }
            }
        }
        .reanswer {
            font-size: 28rpx;
            color: #222;
            width: 130rpx;
            margin: auto;
        }
    }

    .reward {
        width: 100%;
        .ticket {
            width: 100%;
            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/pic_gaokao_jieguo2.png');
            background-size: contain;
            &_item {
                padding-top: 36rpx;
                .task {
                    margin-bottom: 12rpx;
                    image {
                        width: 32rpx;
                        height: 32rpx;
                        margin-right: 4rpx;
                    }
                }
                &_content {
                    width: 590rpx;
                    height: 162rpx;
                    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/bg_gaokao_youhuiquan2.png');
                    background-size: cover;
                    margin: auto;
                    position: relative;
                    &.received {
                        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/bg_gaokao_youhuiquan1.png');
                        background-size: cover;
                    }
                    .ticket_intro {
                        width: 434rpx;
                        height: 100%;
                        padding: 16rpx;
                    }
                    .ticket_num {
                        flex: 1;
                        text {
                            color: #f30300;
                            font-size: 24rpx;
                            font-weight: 600;
                        }
                        .num-font {
                            font-size: 48rpx;
                        }
                    }
                    .ticket_desc {
                        flex: 2;
                        .ticket_name {
                            color: #222;
                            font-size: 28rpx;
                            font-weight: 600;
                        }
                        .ticket_time {
                            font-size: 22rpx;
                            color: #666;
                            margin-top: 24rpx;
                            white-space: nowrap;
                        }
                    }
                    .go_shopping {
                        flex: 1;
                        text {
                            font-size: 26rpx;
                            color: #fff;
                        }
                        .btn {
                            margin-top: 24rpx;
                            color: #f36600;
                            text-align: center;
                            line-height: 48rpx;
                            width: 120rpx;
                            height: 48rpx;
                            background: #ffffff;
                            border-radius: 24rpx;
                            &.received {
                                color: #f30300;
                            }
                        }
                    }
                    .left_top_tag {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 124rpx;
                        height: 36rpx;
                        background: #ffda95;
                        border-radius: 16rpx 0rpx 20rpx 0rpx;
                        text-align: center;
                        line-height: 36rpx;
                        color: #f30300;
                        font-size: 20rpx;
                        font-weight: 500;
                    }
                }
                .share_intro {
                    width: 552rpx;
                    height: 104rpx;
                    margin: 40rpx auto 0;
                }
            }
        }
        .bg_end {
            width: 100%;
            height: 60rpx;
            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/operations/gaokao/pic_gaokao_jieguo3.png') no-repeat;
            background-size: contain;
        }
    }

    .score_popup {
        .score_box {
            position: relative;
            .notice_box {
                width: 670rpx;
                border-radius: 20rpx;
                margin: 20rpx auto;
            }
            .nick_name {
                width: 210rpx;
                position: absolute;
                top: 442rpx;
                left: 130rpx;
                font-size: 26rpx;
                color: #222;
            }
            .btn_box {
                width: 750rpx;
                image {
                    width: 100%;
                }
            }
        }
    }
}

@keyframes jump {
    0%, 100% {
        top: 0
    }
    50% {
        top: -20rpx;
    }
}

::v-deep {
    .nick_name_placeholder {
        color: orange;
        font-size: 32rpx
    }
}
</style>
