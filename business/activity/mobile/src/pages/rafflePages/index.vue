<template>
    <view class="raffle-container">
        <view v-if='isRegisted === false' class='regist-panel'>
            <img class='logo' src='@/static/shared/rafflePages/icon_jsh_share2@2x.png'/>
            <view class='input-panel'>
                <input v-model="user.name" class='user-name' readonly disabled placeholder="用户名"/>
                <input v-model="user.mobile" class='user-mobile' readonly disabled placeholder="手机号"/>
            </view>
            <view class='button' @click="regist">参与抽奖</view>
        </view>
        <view v-if='!!isRegisted' class='result-panel'>
            <view class='header'>
                <view class='info'>
                    <view class='title'>{{raffleDetail.name}}</view>
                </view>
            </view>
            <view class='result-area'>
                <view class='result-info'>
                    <img class='state' :src='resultConfig[state].logo'/>
                    <view class='text'>{{resultConfig[state].text}}</view>
                    <view class='info' v-if='resultConfig[state].info'>
                        {{resultConfig[state].info}}
                    </view>
                    <view v-if='state == 1' class='prize-btn' @click='myPrize'>查看奖品</view>
                </view>
            </view>
        </view>
        <view v-if="isRegisted" class='myPrize' @click="myPrize">
        </view>
    </view>
</template>

<script>
import { userRegistrationValid, userRegistration, liveRaffleDetail, userDrawState, getLiveRaffleConfig } from '@/common/lib/handler.js'
export default {
    data() {
        return {
            activityId: this.$route.query.activityId,
            isRegisted: null,//是否已报名
            raffleDetail: {},//活动详情
            user: {
                name: '',
                mobile: '',
            },
            state: 0,//0: 等待开奖，1: 中奖， 2: 未中奖
            resultConfig: [
                {
                    logo: require('@/static/shared/rafflePages/img_result_waiting.png'),
                    text: '报名成功，等待开奖',
                },
                {
                    logo: require('@/static/shared/rafflePages/img_result_zhongjiang.png'),
                    text: '中奖啦',
                    info: '快到我的奖品查看获奖奖品吧！',
                },
                {
                    logo: require('@/static/shared/rafflePages/img_result_failure.png'),
                    text: '哎呀，差一点就中奖啦！',
                }
            ]
        };
    },
    async created(){
        sinosdk.sino.getUserInfo().then(userInfo => {
            this.user = {
                name: userInfo.uName,
                mobile: userInfo.uPhone,
            }
        });
        uni.showLoading()
        await this.getDetail();
        //如果活动已结束，就不能报名了
        if(this.raffleDetail.state != 3){
            this.isRegisted = await this.getRegistInfo();
        }else{
            this.isRegisted = false;
            uni.showToast({title: '抽奖活动已停用', icon: 'none'})
            return;
        }
        //如果报名了，就获取开奖状态
        if(this.isRegisted !== false){
            //修改titlebar样式
            this.setImmersive();
            this.getState();
        }
        uni.hideLoading()
    },
    activated(){
        //如果报名了，就修改titlebar样式
        if(this.isRegisted !== false){
            this.setImmersive();
        }
    },
    methods: {
        async getDetail(){
            try{
                this.raffleDetail = (await liveRaffleDetail({activityId: this.activityId})).result || {}
            }catch(e){
                console.error('获取活动详情失败！', e);
            }
        },
        /**
         * 是否报名
         */
        async getRegistInfo(){
            try{
                const param = {
                    activityId: this.activityId
                }
                uni.showLoading()
                const response = await userRegistrationValid(param)
                uni.hideLoading()
                return response.result.registry
            }catch(e){
                console.error(e);
                return false;
            }
        },
        /**
         * 获取开奖状态
         */
        async getState(){
            const param = {
                activityId: this.activityId,
            }
            uni.showLoading()
            const response = await userDrawState(param);
            uni.hideLoading()
            if(response.resultCode != 0){
                uni.showToast({title: response.resultMessage, icon: 'none'})
                return;
            }
            if(response.result.drawState == 1){//drawState 1：未开始；2：已开始
                this.state = 0;//未开奖
            }else{
                if(response.result.drawResult == 1){//drawResult 1：已中奖；2：未中奖
                    this.state = 1;//中奖
                }
                //简化逻辑，暂不显示不中奖的页面
                // else{
                //     this.state = 2;//未中奖
                // }
            }
        },
        /**
          * 报名参加活动
         */
        async regist(){
            try{
                const param = {
                    activityId: this.activityId,
                    mobile: this.user.mobile,
                    name: this.user.name,
                }
                uni.showLoading()
                const response = await userRegistration(param)
                uni.hideLoading()
                if(response.resultCode != 0){
                    uni.showToast({title: response.resultMessage, icon: 'none'})
                }else{
                    this.isRegisted = true;
                    //修改titlebar样式
                    this.setImmersive();
                }
            }catch(e){
                console.error(e);
            }
        },
        myPrize(){
            this.$Router.push({
                path: '/pages/winprizelist/winprizelist',
                query: {
                    activityId: this.activityId
                }
            })
        },
        /**
         * 设置沉浸式
         */
        setImmersive(){
             window.titleBar.set({
                color: '#fff',
                themeMode: 'light',
                opacity: 0
            })
        }
    },
};
</script>

<style lang="scss" scoped>
page{
    height: 100%;
}
.raffle-container {
    position: relative;
    height: 100%;
    .regist-panel{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: calc(.56rem + var(--titleBarHeight)) .8rem .56rem;

        .logo{
            width: 1.44rem;
            height: 1.44rem;
            margin-bottom: 1.44rem;
        }

        input{
            position: relative;
            padding: .24rem 0 .24rem .56rem;
            border-bottom: 1px solid #E8E8E8; 
            font-size: .36rem;
            box-sizing: content-box;

            &:before{
                content: '';
                position: absolute;
                left: 0;
                bottom: .24rem;
                width: .44rem;
                height: .44rem;
            }

            &.user-name:before{
                background: url('@/static/shared/rafflePages/btn_common_zhanghao@2x.png') center/contain no-repeat;
            }
            &.user-mobile:before{
                background: url('@/static/shared/rafflePages/btn_common_mobile@2x.png') center/contain no-repeat;
            }
        }

        .button{
            width: 100%;
            height: .88rem;
            line-height: .88rem;
            font-size: .3rem;
            margin-top: 1.88rem;
            text-align: center;
            color: #fff;
            background-color: #FF711E;
            border-radius: .44rem;
            cursor: pointer;
        }
    }

    .result-panel{
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        height: 100%;
        background: url('@/static/shared/rafflePages/bg_sh_bg@2x.png') left top/100% no-repeat;


        .header{
            flex: none;
            width: 100%;
            height: 1.66rem;
            margin-top: calc(0.92rem + var(--titleBarHeight));
            color: #fff;
 
            .title{
                font-size: .48rem;
                text-align: center;
            }
        }

        .result-area{
            flex: 1;
            position: relative;
            margin: 0 .3rem .92rem;
            width: calc(100% - .6rem);
            background: #fff;
            border-radius: .2rem;
            .result-info{
                position: absolute;
                top: 15%;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                height: 3rem;
    
                .state{
                    width: 2.8rem;
                    height: 2.8rem;
                }
                .text{
                    font-size: .34rem;
                }
                .info{
                    color: #666666;
                    font-size: .3rem;
                    margin-top: .2rem;
                }
                .prize-btn{
                    margin-top: .24rem;
                    font-size: .28rem;
                    border: 1px solid #F30300;
                    border-radius: .32rem;
                    height: .64rem;
                    line-height: .64rem;
                    padding: 0 .3rem;
                    background: #fff;
                    color: #F30300;
                    cursor: pointer;
                }
            }
        }
    }
}

.myPrize{
    position: absolute;
    right: 0;
    top: calc(var(--titleBarHeight) + .2rem);
    width: 1.52rem;
    height: .56rem;
    background: url('@/static/shared/rafflePages/btn_cj_myprize.png') left top/100% no-repeat;
    cursor: pointer;
}
</style>