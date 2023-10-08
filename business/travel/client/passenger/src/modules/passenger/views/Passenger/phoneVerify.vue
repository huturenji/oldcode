<template>
    <div class='phoneVerify'>
        <div class="operation-box">
            <div class="title">请按照以下提示完成核验</div>
            <div class="content">
                <div class="item">
                    <p class="lable">发短信</p>
                    <div class="des">请通知乘客
                        <i>{{showName}}</i>
                        使用手机号 
                        <i>{{psgInfo.phone?psgInfo.phone:''}}</i> 
                        在30分钟内发送下方核验码至12306 完成核验</div>
                </div>
                <div class="item">
                    <p class="lable">核验码 </p>
                    <div class="des">
                        <p>
                            <span id="checkNum">{{checkNum}}</span>
                            <span class="copy" @click="copyFun">复制</span>
                        </p>
                        <p class="tipsNew">核验码30分钟内有效</p>
                    </div>
                </div>
            </div>
            <div v-if="!isPC" class="checkBtn"><a :href="'sms://12306?body=' + checkNum" @click="infoClick($event)">本人手机核验</a></div>
        </div>
        <div class="operation-box">
            <div class="title">当前核验状态</div>
            <div class="content">
                <div>
                    <span class="status">待核验</span>
                    <span class="refresh">
                        <i>{{time}}</i>s后自动刷新
                    </span>
                </div>
            </div>
            <div @click="queryResult" class="checkBtn result">我已完成核验，刷新结果</div>
        </div>
    </div>
</template>

<script>
import passengerHandler from './passengerHandler.js';
export default {
    name:'phoneVerify',
    components: {

    },
    props: {
        psgInfo:{
            type: Object,
            required: true
        },
        checkNum:{
            type: Number,
            required: true
        }
    },
    data(){
        return {
            time: 60,//倒计时的时间
            isPC: passengerHandler.isPC(),
            timer: null
        }
    },
    created(){
        this.init();
    },
    computed:{
        //需要显示的校验的姓名
        showName(){
            if (!!this.psgInfo.name){
                return this.psgInfo.name;
            }
            if (!!this.psgInfo.firstName){
                return this.psgInfo.firstName + this.psgInfo.lastName
            }
            return ''
                    
                
        },

        isAndroid(){
            // 触发手机自带发短信,上面的代码只适用于Android，当为ios时需要将上面的?改为&
            var u = navigator.userAgent;
            return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        }

    },
    methods:{
        init(){
            let that = this;
            that.time = 60;
            that.clearinterval();
            that.timer = setInterval(()=>{
                if (that.time >= 1){
                    that.time--
                } else {
                    that.clearinterval();
                    that.queryIdentityVerification();
                }
            },1000)
        },

        //取消计时器
        clearinterval(){
            let that = this;
            !!that.timer && clearInterval(that.timer)
            that.timer = null;
        },

        //查询验证结果
        queryIdentityVerification(){
            let that = this;
            let param = {
                passengerId: that.psgInfo.passengerId
            }
            passengerHandler.queryIdentityVerification(param).then(res=>{
                that.clearinterval();
                if (res.resultCode == 0){
                    if (!!res.result.mobileVerifyComplete){
                        let text = '已核验成功';
                        passengerHandler.showConfirm(text, function(){
                            that.$emit('checkSucess', res.result.mobileVerifyComplete, res.result.identityCardVerifyComplete)
                        }, 1, '我知道了', null, '温馨提示', null, true);
                    } else {
                        let text = '核验未完成，请通知乘车人尽快完成核验。';
                        passengerHandler.showConfirm(text, function(){
                            that.init();
                        }, 1, '我知道了', null, '温馨提示', null, true);
                    }
                }
            }).catch(e=>{
                console.log(e);
            })
        },

        //我已完成核验，刷新结果
        queryResult(){
            this.queryIdentityVerification()
        },

        //兼容ios手机拉取发短信的功能
        infoClick(e) {
            // 触发手机自带发短信,上面的代码只适用于Android，当为ios时需要将上面的?改为&
            var u = navigator.userAgent;
            // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isiOS){
                var hr = e.target.getAttribute('href')
                hr = hr.replace("?","&");
                e.target.setAttribute("href",hr);
            }
        },

        //复制功能实现
        copyFun(){
            let that = this;
            var save = function (e){
                e.clipboardData.setData('text/plain', that.checkNum);//下面会说到clipboardData对象
                e.preventDefault();//阻止默认行为
            }
            document.addEventListener('copy', save);
            document.execCommand("copy");//使文档处于可编辑状态，否则无效
            passengerHandler.showToast('复制核验码成功');
        }
 
    }
}
</script>
<style>
.weui-mask{
    z-index: 3000;
}
</style>
<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
    *{
        box-sizing: border-box;
    }
    //移动端显示样式
    @media screen and (max-width:@screen-sm) { 
        .phoneVerify{
            padding: 1.96rem .3rem 0 .3rem;
        }
    }
    //PC端显示样式
    @media screen and (min-width:@screen-sm) { 
        .phoneVerify{
            padding: 2.96rem .3rem 0 .3rem;
        }
    }
    .phoneVerify{
        width: 100%;
        height: 8rem;
        background: url(~themes/default/img/phone_top_new.png) top center no-repeat;
        background-size: 100% auto;
        .operation-box{
            box-shadow:0px 4px 16px -4px rgba(125,155,250,0.1);
            border-radius: .16rem;
            background: #fff;
            padding: .32rem .28rem .56rem .28rem;
            .title{
                font-size: .3rem;
                font-weight: bold;
                margin-bottom: .24rem;
            }
            .content{
                background:rgba(246,249,253,1);
                padding: .28rem .24rem;
                .item{
                    width: 100%;
                    display: flex;
                    font-size: .26rem;
                    margin-bottom: 0.24rem;
                    &:last-child{
                        margin-bottom: 0rem;
                    }
                    line-height: .36rem;
                    .lable{
                        width: 1.26rem;
                        
                    }
                    .des{
                        flex: 1;
                        .copy{
                            color: @theme-color;
                            cursor: pointer;
                            margin-left: .4rem;
                            &:active{
                                opacity: 0.8;
                            }
                        }
                        i{
                            font-style: normal;
                            color: @price-color;
                        }
                        .tipsNew{
                            color: #A4ACB2;
                            margin-top: 0.08rem;
                        }
                    }
                }
                .status{
                    font-size: .28rem;
                    color: @warning-color;
                }
                .refresh{
                    i{
                        font-style: normal;
                    }
                }
            }
            .checkBtn{
                cursor: pointer;
                margin-top: .4rem;
                border-radius:.20rem;
                height:.88rem;
                line-height: .88rem;
                text-align: center;
                border:1px solid @theme-color;
                color: @theme-color;
                font-size: .32rem;
                &:active{
                    opacity: 0.8;
                }
                &.result{
                    background: @theme-color;
                    color: #fff;
                }
                a{
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
</style>