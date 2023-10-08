<!--大屏幕抽奖展示页-->
<template>
	<div class="preview-container" :style='{background: `url(${background}) 0 0/100% 100% no-repeat`}'>
        <div class='activity-name'>
            {{screenConfig.activityName}}
        </div>
        <div class='preview-area' ref='previewArea'>
            <!--奖项展示--> 
            <div class='prize' v-if='screenConfig.showWhat == 1'>
                <template v-if='screenConfig.prizeId!=null'>
                    <div class='level'>
                        <div>{{screenConfig.drawPrizeGradeName}}</div>
                    </div>
                    <div class='name'>
                        {{screenConfig.prizeName}}
                    </div>
                    <img class='pic' :src='imgFilter(screenConfig.prizeImg)'/>
                    <div class='number'>
                        奖品数量：{{screenConfig.prizeNum}}
                    </div>
                </template>
                <template v-else>
                    <div class='init-bg'>
                        <div class="img"></div>
                        <div class="text">虚位以待</div>
                    </div>
                </template>
            </div>
            <!--二维码展示-->
            <div class='qrcode-area' v-if='screenConfig.showWhat == 2'>
                <div class="qrcode" ref='qrcodeContainer'><div ref="qrcode"></div></div>
                <div class='text' ref='qrcodeTest'>扫描二维码参与互动大屏幕</div>
            </div>
            <!--参与名单滚动-->
            <template v-if='screenConfig.showWhat == 3'>
                <div class='rolling-prize'>
                    <div class='level'>
                        <div>{{screenConfig.drawPrizeGradeName}}</div>
                    </div>
                    <div class='rolling-area'>
                        <div class='left'>
                            <img class='pic' :src='imgFilter(screenConfig.prizeImg)'/>
                            <div class='number'>
                                奖品数量：{{screenConfig.prizeNum}}
                            </div>
                        </div>
                        <vue-seamless-scroll class='right seamless-scroll' ref='seamlessScroll'
                        :class-option="scrollOption" :data="signUpUserList">
                            <ul class="item">
                                <li v-for="(item, index) in signUpUserList" :key="index">
                                    <span class="scroll-name" v-text="item.name"></span>
                                    <span class="scroll-mobile" v-text="item.mobile"></span>
                                </li>
                            </ul>
                        </vue-seamless-scroll>
                    </div>
                </div>
            </template>
            <!--中奖名单-->
            <div class='award-list' v-if='screenConfig.showWhat == 4'>
                <!--全部中奖名单-->
                <div class='all-list' v-if='screenConfig.prizeId == null'>
                    <div class='header'>
                        <div class='cell'>姓名</div>
                        <div class='cell'>手机号</div>
                        <div class='cell'>奖项名称</div>
                        <div class='cell'>奖品信息</div>
                    </div>
                    <vue-seamless-scroll class='seamless-scroll' ref='allListSeamlessScroll'
                        :class-option="awardScrollOption" :data="awardList">
                        <ul>
                            <li v-for='award in awardList' :key='award.id'>
                                <div class='cell'>{{award.userName}}</div>
                                <div class='cell'>{{award.mobile}}</div>
                                <div class='cell'>{{award.gradeName}}</div>
                                <div class='cell'>
                                    <div class='prize-info'>
                                        <img :src='imgFilter(award.imgUrl)'/> 
                                        <div class='prize-name'>{{award.prizeName}}</div>
                                    </div>
                                </div>
                            </li>
                        </ul>   
                    </vue-seamless-scroll>
                </div>
                <!--当期奖项中奖名单-->
                <div class='curr-list' v-else>
                    <div class="prize-info">
                        {{screenConfig.drawPrizeGradeName}}: {{screenConfig.prizeName}}
                    </div>
                    <vue-seamless-scroll class='seamless-scroll' ref='currListSeamlessScroll'
                        :class-option="awardScrollOption" :data="awardList">
                        <ul>
                            <li v-for='award in awardList' :key='award.id'>
                                <span>{{award.userName}}</span>
                                <span>{{award.mobile}}</span>
                            </li>
                        </ul>
                    </vue-seamless-scroll>
                </div>
            </div>
        </div>
	</div>
</template>
<script>
import { utils } from "opcl";
import { deepEqual } from "bislibs/utils/index";
import apihandler from "bislibs/requestHandler/liveRafflehandler";
import vueSeamlessScroll from "vue-seamless-scroll";
import {maskingText, MASKING_TYPE} from 'bislibs/utils/dataMasking'
import { allbuildinIcons } from "bislibs/home/newlottery-lifecycle";
import QRCode from "qrcodejs2";

const DELAY = 2000;//延迟时间

export default {
	comments: { vueSeamlessScroll },
    props: {
        isChild: {//是否是子组件
            type: Boolean,
            default: false
        },
        activityDetailProp:{//活动详情
            type: Object,
            default: {}
        },
        screenConfigProp:{//活动配置
            type: Object,
            default: {}
        },
        currPrizeProp:{//当期奖项
            type: Object,
            default: {}
        }
    },
	data() {
		return {
			activityId: this.$route.query.activityId,
            scrollOption: {//scroll组件配置
                hoverStop: false,//禁止鼠标悬停
                limitMoveNum: 20,//开启无缝滚动的数据量。数量不足时需要填充
                step: 8
            },
            awardScrollOption: {
                limitMoveNum: 20,//开启无缝滚动的数据量.默认设置大一点，实际值需要动态计算
                step: 1
            },
			signUpUserList: [],//参与者列表
            awardList: [],//中奖名单
            screenConfig: this.screenConfigProp,//大屏配置
            background: require('@/themes/default/img/liveRaffle/pic_bg.png'),//页面背景
            qrcodeObj: null
		};
	},
    watch: {
        screenConfigProp: {
            handler(_new){
                this.screenConfig = JSON.parse(JSON.stringify(_new));
            },
            deep: true
        },
        screenConfig: {
            handler(_new, _old){
                this.changeState(_new, _old)
            },
            deep: true
        },
    },
	async created() {
        if(!this.isChild){
            const response = await this.getScreenConfig();
            //活动未启用
            if(response.resultCode == 91100003){
                return;
            }
            this.requestBeats(DELAY)
        }else{
            this.changeState(this.screenConfigProp)
        }
        window.addEventListener('resize', this.onResize)
    },
    beforeDestroy(){
        window.removeEventListener('resize', this.onResize)
    },
	methods: {
        onResize(){
            this.autoFitScrollNum();
            this.resetQrCode();
        },
        /**
         * 切换状态
         */
        changeState(screenConfig, oldScreenConfig = {}){
            if(!!screenConfig.background){
                this.background = screenConfig.background;
            }
            if(screenConfig.showWhat != oldScreenConfig.showWhat){
                switch(screenConfig.showWhat){
                    //展示背景图
                    case 1:
                        break;
                    //展示二维码
                    case 2: 
                        this.$nextTick(() => {
                            //等待弹窗渲染再生成二维码，不然会报错
                            this.qrcode();
                        });
                        break;     
                    //抽奖中
                    case 3: 
                        this.startScroll();
                        break;    
                    //展示中奖名单
                    case 4: 
                        this.getAwardList().then(()=>{
                            //动态计算滚动数量
                            //注意：如果修改了dom结构，需调整下面的算法
                            this.$nextTick(()=>{
                                this.autoFitScrollNum()  
                            })
                        })
                        break;   
                    default: 
    
                }
            }
        },
        autoFitScrollNum(){
            const scrollComp = this.screenConfig.prizeId == null ? this.$refs.allListSeamlessScroll : this.$refs.currListSeamlessScroll;
            const dom = scrollComp.$el
            const parent = dom.parentElement;
            const domMaxHeight = parent.offsetHeight - (dom.offsetTop - parent.offsetTop);
            const row = document.querySelector('.seamless-scroll ul li')
            const rowStyle = window.getComputedStyle(row);
            const rowHeight = parseFloat(rowStyle.height) + parseFloat(rowStyle.marginTop) + parseFloat(rowStyle.marginBottom);
            const length = domMaxHeight / rowHeight
            this.awardScrollOption.limitMoveNum = Math.ceil(length)
            scrollComp.reset()
        },
        /**
         * 是展示网络图片还是本地图片
         */
        imgFilter(val){
            if(!val){
                return val
            }
            if(val.indexOf('http://')>-1 || val.indexOf('https://')>-1){
                return val
            }else{
                let ele = allbuildinIcons.find((item)=>item.key == val)
                return ele.src
            }

        },
        /**
         * 轮询大屏状态
         */
        requestBeats(delay, retryTimes = 3){
            if(retryTimes <= 0){
                return;
            }
            setTimeout(async () => {
                try{
                    const response = await this.getScreenConfig();
                    //活动未启用
                    if(response.resultCode != 0){
                        throw response.resultMessage;
                    }
                }catch(e){
                    retryTimes--;
                    console.error(e)
                }
                //动态配置轮询时间。当开始抽奖时，提高频率；其他场景，降低频率
                if(this.screenConfig.showWhat == 3){
                    delay = 200
                }else{
                    delay = DELAY
                }
                this.requestBeats(delay, retryTimes)
            }, delay);
        },
        /**
         * 获取大屏配置
         */
        async getScreenConfig(){
            try{
                const response = await apihandler.getScreenConfig({activityId: this.activityId});
                this.screenConfig = response.result;
                return response;
            }catch(e){
                console.error('获取大屏配置失败！', e);
                return e
            }
        },
        //生成二维码
        qrcode() {
            let that = this;
            const pathname = location.pathname;
            const htmlName = 'index.html'
            const path = pathname.slice(0, pathname.lastIndexOf('/', pathname.lastIndexOf(htmlName)-htmlName.length))
            let qrCodeHeight = 300;
            //动态计算二维码高度
            try{
                const previewAreaHeight = this.$refs.previewArea.offsetHeight
                const containerStyle = window.getComputedStyle(this.$refs.qrcodeContainer);
                const paddingHeight = parseFloat(containerStyle.paddingTop) + parseFloat(containerStyle.paddingBottom)
                qrCodeHeight = ((parseFloat(previewAreaHeight) - paddingHeight - this.$refs.qrcodeTest.offsetHeight) * .92).toFixed(0);
            }catch(e){}
            this.$refs.qrcode.innerHTML = ''
            this.qrcodeObj = new QRCode(this.$refs.qrcode, {
                width: qrCodeHeight,
                height: qrCodeHeight,
                text: location.origin + path + '/mobile/index.html#/pages/rafflePages/index?activityId=' + this.activityId,
            });
            this.$nextTick(()=>{
                //去掉二维码上的hover
                this.$refs.qrcode.removeAttribute('title')
            })
        },
        /**
         * 重置二维码
         */
        resetQrCode(){
            if(this.screenConfig.showWhat == 2){
                this.qrcode();
            }
        },
        /**
         * 获取中奖者列表
         */
        async getAwardList(){
            const param = {
                activityId: this.activityId,
                prizeId: this.screenConfig.prizeId,//如果screenConfig.prizeId有值表示查单个奖项，没值表示查所有
                pageIndex: 1,
                pageSize: 1000//不分页，查所有
            }
            try{
                const response = await apihandler.getAwardList(param);
                this.awardList = response.result.list || [];
                this.awardList.map(user => {
                    user.mobile = maskingText(MASKING_TYPE.TEL, user.mobile)
                    return user;
                });
            }catch(e){
                console.error('获取中奖名单失败！' + e);
            }
        },
        
        /**
         * 开始滚动屏幕
         */
        async startScroll(){
            await this.getSignUpUserList();
            this.$refs.seamlessScroll.reset()
        },
        /**
         * 获取参加者名单
         */
        async getSignUpUserList(){
            try{
                const response = await apihandler.getSignUpUserList({activityId: this.activityId });
                this.signUpUserList = response.result.userList.map(user => {
                    user.mobile = maskingText(MASKING_TYPE.TEL, user.mobile)
                    return user;
                });
                this.signUpUserList = this.autoFillUserList(this.signUpUserList, this.scrollOption.limitMoveNum)
            }catch(e){
                console.error('获取参与者名单失败！', e);
            }
        },

        autoFillUserList(list, length){
            if(!list || list.length == 0){
                return []
            }
            if(list.length < length){
                return this.autoFillUserList(list.concat(list), length)
            }   
            return list
        }
    }
};
</script>
<style lang="less">
html{
    font-size: 100px;
}
</style>
<style lang="less" scoped>
.preview-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem 0.55rem 0.3rem;
    width: 100%;
    height: 100%;

    .activity-name{
        font-size: .4rem;
        color: #fff;
        flex: none;
        text-align: center;
    }

    .preview-area{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: calc(100% - .2rem - .4rem);
        flex: auto;
        margin-top: .2rem;
        border: 2px solid #FBDCA5;
        border-radius: .16rem;
        background-color: rgba(8, 5, 53, .64);

        .prize{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            height: 100%;
            padding: 0 .3rem;
            color: #fff;

            .level{
                font-size: .48rem;
            }

            .name{
                font-size: .24rem;
                font-weight: bold;
            }

            .pic{
                width: 2rem;
                height: 2rem;
                border-radius: .12rem;
            }

            .number{
                font-size: .2rem;
            }

            .init-bg{
                .img{
                    width: 1.38rem;
                    height: 1.38rem;
                    background: url('@/themes/default/img/liveRaffle/pic_home_xuyidaiwei@2x.png') center no-repeat;
                    background-size: contain;
                }
                .text{
                    font-size: .24rem;
                    color: #fff;
                    margin-top: .24rem;
                    text-align: center;
                }
            }
        }

        .qrcode-area{
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            width: 100%;
            color: #fff;
            .qrcode{
                padding: .2rem;
                background: #fff;
            }

            .text{
                font-size: .24rem;
                padding-top: .2rem;
                text-align: center;
            }
        }


        .rolling-prize{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            height: 100%;
            color: #fff;

            .level{
                font-size: .48rem;
            }
            
            .rolling-area{
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: 80%;
                height: calc(100% - 1rem);
                .left{
                    text-align: center;
                    .pic{
                        width: 2rem;
                        height: 2rem;
                        border-radius: .12rem;
                    }
        
                    .number{
                        font-size: .2rem;
                    }
                }

                .right.seamless-scroll{
                    position: relative;
                    height: 80%;
                    width: calc((100% - 2rem) * .8);
                    padding: 0 .4rem;
                    overflow: hidden;

                    &:before, &:after{
                        display: block;
                        position: absolute;
                        top: 40%;
                        content: '';
                        width: .24rem;
                        height: .24rem;
                    }

                    &:before{
                        left: 0;
                        background: url('@/themes/default/img/liveRaffle/icon_right.png') center no-repeat;
                        background-size: contain;
                    }

                    &:after{
                        right: 0;
                        background: url('@/themes/default/img/liveRaffle/icon_left.png') center no-repeat;
                        background-size: contain;
                    }

                    ul {
                        list-style: none;
                        padding: 0;
                        margin: 0 auto;
                        li {
                            display: block;
                            height: 30px;
                            line-height: 30px;
                            display: flex;
                            justify-content: space-between;
                            font-size: .24rem;
                            margin-bottom: .1rem;
                        }
                    }
                }
            }

        }

        .award-list{
            width: 100%;
            height: 100%;
            padding: .3rem;
            color: #FEF0E5;
            overflow: hidden;

            .seamless-scroll{
                width: 100%;
                overflow: hidden;
            }

            .all-list{
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 100%;
                .header{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    height: .34rem;
                    line-height: .34rem;
                    font-size: .24rem;
                }
    
                ul{
                    position: relative;
                    height: calc(100% - .34rem);
                    font-size: .24rem;
                    color: #fff;
                    list-style: none;
                    overflow-y: auto;
                    -ms-overflow-style: none;
                    scrollbar-width: none;
    
                    &::-webkit-scrollbar{
                        display: none;
                    }
    
                    li{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        height: .4rem;
                        margin-bottom: .2rem;
                        
                        .cell{
                            height: 100%;
                            .prize-info{
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100%;
        
                                .prize-name{
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
        
                                img{
                                    height: 100%;
                                    object-fit: contain;
                                    margin-right: .1rem;
                                }
                            }
                        }
                    }
                }
    
                .cell{
                    text-align: center;
                    padding: 0 .2rem;
                    flex: none;
                    &:nth-of-type(1){
                        width: 20%;
                    }
                    &:nth-of-type(2){
                        width: 25%;
                    }
                    &:nth-of-type(3){
                        width: 20%;
                    }
                    &:nth-of-type(4){
                        width: 35%;
                    }
                }
            }
            
            .curr-list{
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 100%;
                padding: 0 .6rem;
                font-size: .28rem;
                .prize-info{
                    font-size: .3rem;
                    margin-bottom: .3rem;
                    text-align: center;
                }
                ul{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    height: calc(100% - .4rem - .3rem);
                    list-style: none;
                    overflow-y: auto;
                    -ms-overflow-style: none;
                    scrollbar-width: none;
    
                    &::-webkit-scrollbar{
                        display: none;
                    }
                    li{
                        text-align: center;
                        margin-bottom: .2rem;
                        width: 4.6rem;
                        height: .4rem;
                        &>span{
                            display: inline-block;
                            width: 49%;
                            text-align: left;
                        }
                    }
                }
            }
        }
    }

}
</style>