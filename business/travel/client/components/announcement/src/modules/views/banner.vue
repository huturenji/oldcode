<template>
    <div>
        <div v-if="showBanner" class="container">
            <nav>
                <div>
                    <span class="index" v-if="serviceReminders.length>1">{{serviceReminders.length}}</span>
                    <div class="list">
                        <ul class="serviceRemindersList animate">
                            <li v-for="(notice, index) in serviceReminders" :key="index" @click="openReminder">
                                {{notice.remindContent}}
                            </li>
                        </ul>
                        <ul class="serviceRemindersList animate hideFlag hide">
                            <li v-for="(notice, index) in serviceReminders" :key="index" @click="openReminder()">
                                {{notice.remindContent}}
                            </li>
                        </ul>
                    </div>
                </div>
                <div>
                    <a class="close" @click.stop="close"></a>
                </div>
            </nav>
        </div>

        <div v-transferDom>
            <Popup v-model="showReminderList" v-if='showReminderList' class='reminderList' position="right" height="100%" width="100%">
                <ul>
                    <li v-for="(reminder,index) in serviceReminders" :key="index" @click="showDetail(reminder)">
                        <div>{{reminder.remindContent}}</div>
                    </li>
                </ul>
            </Popup>
        </div>
        <div v-transferDom>
            <Popup v-model='showReminderDetail' v-if='showReminderDetail' class='reminderDetail' position="right" height="100%" width="100%">
                <div class="content">
                    <div>{{currDetail.remindContent}}</div>
                </div>
            </Popup>
        </div>
    </div>
</template>
<script>
import {TransferDom, Popup} from 'vux';
import requestHandler from '../common/requestHandler'
import {getCurrBisType} from '../common/config'
import extendUtils from '../common/extend'
export default {
    name: 'swpServiceReminders',
    directives: {
        TransferDom
    },
    components: {Popup},
    data: function () {
        let that = this;
        let title = document.title;
        return Object.assign(extendUtils.stateManager.setData([
            {
                name: 'showReminderDetail',
                parent: '$announcement',
                show: {
                    title: '服务提醒',
                    callback(){
                        //如果只有一条，则抛出这个事件
                        if (that.serviceReminders && that.serviceReminders.length==1){
                            that.onShow && that.onShow();
                        }
                    }
                },
                hide: {
                    callback(){
                        //如果只有一条，则抛出这个事件
                        if (that.serviceReminders && that.serviceReminders.length==1){
                            that.onClose && that.onClose();
                            document.title = title;
                        }
                    }
                }
            },
            {
                name: 'showReminderList',
                parent: '$announcement',
                show: {
                    title: '服务提醒',
                    callback(){
                        that.onShow && that.onShow();
                    }
                },
                hide: {
                    title: title,
                    callback(){
                        that.onClose && that.onClose();
                    }
                }
            }
        ], null, 1), {
            showBanner: false,
            serviceReminders: [],
            currDetail: '',
            inter: null
        })
    },
    props: {
        config: {
            type: String,
            default: () => {}
        }
    },
    created: function () {
        this.noticeDiscovery();
    },
    beforeDestroy: function () {
        clearInterval(this.inter);
    },
    deactivated(){
        clearInterval(this.inter);
    },
    methods: {
        noticeDiscovery() {
            let {businessTypes = getCurrBisType()} = this.config || {}
            //如果当前url没有按规则匹配到，说明不用展示提醒
            if (businessTypes==null || businessTypes==undefined){
                return;
            }
            requestHandler.getServiceReminder({businessType: businessTypes, pageIndex: 1, pageSize: 20}).then(res => {
                this.serviceReminders = res.result.serviceReminders;
                if (!!this.serviceReminders && this.serviceReminders.length>0){
                    this.showBanner = true;
                    this.serviceReminders.length>1 && this.$nextTick(()=>{
                        this.loopAnimate();
                    })
                }
            })
        },

        showDetail(detail){
            this.currDetail = detail;
            this.showReminderDetail = true;
        },

        async openReminder(){
            if (this.serviceReminders && this.serviceReminders.length==1){
                this.showDetail(this.serviceReminders[0]);
            } else {
                this.showReminderList = true;
            }
        },

        /**
             * 循环列表，找出需要执行动画的dom，并执行动画
             */
        loopAnimate(){
            let domArray = document.getElementsByClassName('serviceRemindersList');
            Array.prototype.forEach.call(domArray, dom => {
                if (Array.prototype.findIndex.call(dom.classList, _class=>{
                    return _class == 'hideFlag';
                })==-1){
                    this.animate(dom);
                }
            })
        },

        /**
             * 上下轮播效果
             * @param dom
             */
        animate(dom){
            if (!dom){
                return
            }
            clearInterval(this.inter);
            this.inter = setInterval(()=>{
                if (!dom || !dom.children || dom.children.length==0){
                    return;
                }
                let space = dom.children[0].offsetHeight;//单个li的高度是每次上移的距离
                let domHeight = space * dom.children.length;//不能直接拿dom的offsetHeight，由于rem有精度问题，会导致高度计算不对
                let top = parseFloat(dom.style.top) || 0;
                top -= space;

                //当前dom轮播完毕后，执行下一个dom的动画
                if (top*-1 >= domHeight){
                    let nextAnimateDom;//下一个执行动画的dom
                    Array.prototype.forEach.call(document.getElementsByClassName('serviceRemindersList'), _dom => {
                        if (_dom != dom){
                            nextAnimateDom = _dom;
                        } else {
                            _dom.classList.add('hideFlag');//用于标识是需要隐藏的dom，仅作为判断使用
                            //等待最后一次动画执行完毕后再将当前dom移到最下方
                            setTimeout(()=>{
                                _dom.classList.add('hide');//实际隐藏dom的样式
                                _dom.style.top = space+'px';
                            }, 2000);//这里的2秒与.animate动画的时间一致
                            clearInterval(this.inter);
                        }
                    })
                    if(nextAnimateDom){
                        //必须在遍历dom后再执行动画，否则由于执行顺序的原因，loopAnimate可能两个dom都没有hideFlag，都开始执行动画
                        nextAnimateDom.classList.remove('hideFlag');
                        nextAnimateDom.classList.remove('hide');
                        nextAnimateDom.style.top = '0px';
                        this.loopAnimate(nextAnimateDom);
                    }
                }
                dom.style.top = top+'px';
            }, 5000)
        },

        close(){
            this.showBanner = false;
        }
    }
}
</script>

<style scoped lang="less">
    @import '../styles/default.less';
    .container{
        height: .6rem;
        overflow: hidden;
        nav{
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            cursor: pointer;
            height: .6rem;
            line-height: .6rem;
            position: relative;
            z-index: 99998;
            overflow: hidden;
            background-color: #FFE5E4;
            color: #F30300;
            padding: 0 .2rem 0 .16rem;

            &>div{
                &:nth-child(1){
                    flex: auto;
                    display: flex;
                    margin-right: .12rem;
                }
                &:nth-child(2){
                    flex: none;
                }
            }

            .close{
                display: block;
                height: .34rem;
                width: .34rem;
                background: url("../img/icon_close_nor.svg") center no-repeat;
                background-size: contain;
                &:active{
                    background: url("../img/icon_close_hov.svg") center no-repeat;
                    background-size: contain;
                }
            }
            .index{
                font-size: 13px;
                background: #F30300;
                color: #fff;
                width: 16px;
                height: 16px;
                border-radius: 8px;
                display: inline-block;
                text-align: center;
                line-height: 17px;
                margin: calc(~'(.6rem - 16px) / 2') 0;
                margin-right: .07rem;
            }
            .list{
                height: .6rem;
                display: inline-block;
                position: relative;
                width: calc(~'100% - 20px');
                ul{
                    display: block;
                    font-size: .26rem;
                    position: absolute;
                    top: 0px;
                    width: 100%;
                    opacity: 1;
                    &.hide{
                        top: .6rem;
                        opacity: 0;
                    }
                    li{
                        height: .6rem;
                        line-height: .6rem;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        width: 100%;
                    }
                }
            }
        }
    }

    .animate{
        transition: top 2s;
    }

    .reminderDetail{
        z-index: 99999;
        .content{
            background: #fff;
            font-size: .28rem;
            color: #333;
            div{
                margin: .6rem;
                white-space: pre-line;
                padding: .3rem 0;
            }
        }
    }
    
    .reminderList{
         z-index: 99999;
        ul{
            font-size: .28rem;
            color: #333;

            li{
                border-radius: .08rem;
                background: #fff;
                margin: .2rem .3rem;
                padding: .35rem;
                cursor: pointer;

                div{
                    white-space: pre-line;
                    width: 100%;
                    display: -webkit-box; /* 弹性盒模型*/
                    -webkit-box-orient: vertical; /* 文字垂直排列 */
                    -webkit-line-clamp:3; /*文字显示的行数*/
                    overflow: hidden; /*超出部分溢出隐藏*/
                }
            }
        }
    }
</style>
