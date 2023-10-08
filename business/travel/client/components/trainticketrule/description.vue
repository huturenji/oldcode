<template>
    <div class="description-container" >
        <!-- 标题 -->
        <div class="pop-title">
            <span>取票/退改/改签说明</span>
            <span class="icon" @click="$emit('closeDesc')"><icon type="close" size='.24' /></span>
        </div>
        <!-- 导航 -->
        <nav>
            <ul>
                <li 
                    v-for="(item, index) in tabList" :key="index" 
                    class="cursorp" 
                    :class="{selected: currLi==index}" 
                    @click="clickTab(item, index)"
                >
                    {{item.name}}
                </li>
            </ul>
        </nav>
        <div class="content-box">
            <div id="container" class="content-wrap">
                <div id="buyTicket">
                    <article >
                        <div class="title"><i><icon type="icon_common_prompt" size='.3' /></i>购票说明</div>
                        <div class="content">
                            我司通过铁路客运机构官方网站或授权代售点为客户提供火车票预订和增值服务。<br />
                            因本服务需通过铁路客运机构出票，无法承诺百分之百出票成功，我司预先收取您的票款，如果无法成功出票，退款会原渠道返回您支付的账户。
                        </div>
                    </article>
                    <article>
                        <div class="title"><i><icon type="icon_common_prompt" size='.3' /></i>取票说明</div>
                        <div class="content">
                            发车前凭预订时使用的证件原件，可在全国任意火车
                            站窗口、自动售取票机或客票代售点取票。<br />
                            部分高铁动车，可持二代居民身份证直接检票进站。
                        </div>
                    </article>
                </div>
                <div id="ticketBack">
                    <article>
                        <div class="title"><i><icon type="icon_common_prompt" size='.3' /></i>退票说明</div>
                        <div class="content">
                            未取纸质车票，且在发车时间之前，可在线办理退票，办理时间为06:00--23:00，其他时间须去火车站窗口办理。<br />
                            其他不能在线退票的情况需在发车前至火车站窗口办理。
                        </div>
                    </article>
                    <article>
                        <div class="title"><i><icon type="icon_common_prompt" size='.3' /></i>退票手续费</div>
                        <div class="content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>申请退票日期距发车时间</th>
                                        <th>退票手续费</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>8天及以上</td>
                                        <td><span class="font-gray">无</span></td>
                                    </tr>
                                    <tr>
                                        <td>48小时-7天(含)</td>
                                        <td>票价<span class="font-red">5%</span></td>
                                    </tr>
                                    <tr>
                                        <td>24小时-48小时（不含）</td>
                                        <td>票价<span class="font-red">10%</span></td>
                                    </tr>
                                    <tr>
                                        <td>不足24小时</td>
                                        <td>票价<span class="font-red">20%</span></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="remark">
                                注：收取手续费时，手续费不足2元按2元收取
                            </div>
                        </div>
                    </article>
                </div>

                <div id="modifyTicket">
                    <article>
                        <div class="title"><i><icon type="icon_common_prompt" size='.3' /></i>改签说明</div>
                        <div class="content">
                            单次改签操作仅支持改签一张票，不可同时改签多张，且每张票仅可成功改签一次。<br />
                            未取纸质车票，开车前48小时（不含）以上，可改签预售期内的其他列车。开车前48小时内，可改签开车前的其他列车，也可改签开车后至票面日期当日24:00之间的其他列车，不办理票面日期次日及以后的改签。<br />
                            办理时间为06:00--23:00，其他时间须去火车站窗口办理。<br />
                            其他不能在线改签的情况需在发车前至火车站窗口办理。
                        </div>
                    </article>
                    <article>
                        <div class="title"><i><icon type="icon_common_prompt" size='.3' /></i>可改签车次</div>
                        <div class="content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>申请改签距发车时间</th>
                                        <th>可改签车次</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>48小时（不含）以上</td>
                                        <td>预售期内的车次</td>
                                    </tr>
                                    <tr>
                                        <td>48小时</td>
                                        <td>开车前的其他列车和开车后至票面日期当日24:00之间其他列车</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="remark">
                                注：发车后，旅客只能在票面出发站办理改签，且发车后的改签票不能退票
                            </div>
                        </div>
                    </article>
                    <article>
                        <div class="title"><i><icon type="icon_common_prompt" size='.3' /></i>改签支付及手续费</div>
                        <div class="content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>改签方式</th>
                                        <th>支付方式及手续费</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div>原票价</div>
                                            <div>低于改签票价</div>
                                        </td>
                                        <td>
                                            <div>支付方式：支付改签后票款、退回原票款</div>
                                            <div>手续费：无</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div>原票价</div>
                                            <div>高于改签票价</div>
                                        </td>
                                        <td>
                                            <div>支付方式：无需补差价，退还差额（差额部分扣除手续费）</div>
                                            <div>手续费：按退票标准收取</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="remark">
                                注：收取手续费时，手续费不足2元按2元收取
                            </div>
                        </div>
                    </article>
                </div>

                <div id="crossBorder">
                    <article>
                        <div class="title"><i><icon type="icon_common_prompt" size='.3' /></i>跨境列车乘车说明</div>
                        <div class="content">
                            旅客必须持有有效车票并按票面载明的日期、车次、席别乘车，同时携带有效的出入境证件及签注。<br />
                            建议于列车出发前至少45分钟到站取票并办理出入境手续。<br />
                            大陆网站购买的车票如在中国香港西九龙站取票，将会收取一定的手续费。
                        </div>
                    </article>
                    <article>
                        <div class="title">中国香港西九龙站取票手续费</div>
                        <div class="content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>票价</th>
                                        <th>取票手续费</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            不足200RMB
                                        </td>
                                        <td>
                                            <span class="font-red">10HKD</span>/张
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            200-300RMB
                                        </td>
                                        <td>
                                            <span class="font-red">20HKD</span>/张
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            高于300RMB
                                        </td>
                                        <td>
                                            <span class="font-red">30HKD</span>/张
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </article>
                    <article>
                        <div class="title"><i><icon type="icon_common_prompt" size='.3' /></i>跨境列车退票说明</div>
                        <div class="content">
                            未取纸质票，且离发车时间大于35分钟，可在线办理
                            退票，办理时间为06:00--23:00，其他时间须去火车站
                            窗口办理。<br />
                            其他不能在线退票的情况需在发车前至火车站窗口办理。<br />
                            内地网站购买的车票，仅限内地办理退票。
                        </div>
                    </article>
                    <article>
                        <div class="title"><i><icon type="icon_common_prompt" size='.3' /></i>跨境列车退票手续费</div>
                        <div class="content">
                            <table>
                                <thead>
                                    <tr>
                                        <th>申请退票日期距发车时间</th>
                                        <th>退票手续费</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            15天及以上
                                        </td>
                                        <td>
                                            票价<span class="font-red">5%</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            48小时-14天
                                        </td>
                                        <td>
                                            票价<span class="font-red">30%</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            48小时内
                                        </td>
                                        <td>
                                            票价<span class="font-red">50%</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="remark">
                                注：退票费按元计算，不足一元的部分舍去免收。
                            </div>
                        </div>
                    </article>
                    <article>
                        <div class="title"><i><icon type="icon_common_prompt" size='.3' /></i>跨境列车改签说明</div>
                        <div class="content">
                            每张车票<span class="font-blue">仅可改签一次</span>，改签后的车票<span class="font-blue">不得退票</span>。<br />
                            跨境车次不可办理变更到站。<br />
                            未取纸质票，且离发车时间大于35分钟，可在线办理
                            改签，办理时间为06:00--23:00，其他时间须去火车站
                            窗口办理。<br />
                            其他不能在线改签的情况需在发车前至火车站窗口办理。
                        </div>
                    </article>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import icon from "components/icon/index.vue"
import { TransferDom } from 'vux'
export default {
    directives: {
        TransferDom
    },
    components: {
        icon
    },
    data: function () {
        return {
            currLi: 0,
            tabList: [
                {
                    name: '取票',
                    node: 'buyTicket'
                },
                {
                    name: '退票',
                    node: 'ticketBack'
                },
                {
                    name: '改签',
                    node: 'modifyTicket'
                },
                {
                    name: '广深港跨境列车',
                    node: 'crossBorder'
                }
            ],
            buyTicketHeight:0,
            ticketBackHeight:0,
            modifyTicketHeight:0,
            crossBorderHeight:0,
            containerDom: null
        }
    },
    created: function () { },
    mounted: function () {
        this.initDom();
    },
    destroyed () { //离开该页面需要移除这个监听的事件
        !!this.containerDom && this.containerDom.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        // 初始化dom的样式
        initDom(){
            let buyTicket = document.getElementById('buyTicket');
            let ticketBack = document.getElementById('ticketBack');
            let modifyTicket = document.getElementById('modifyTicket');
            let crossBorder = document.getElementById('crossBorder');
            this.buyTicketHeight = parseInt(this.getStyle(buyTicket, 'height'));
            this.ticketBackHeight = parseInt(this.getStyle(ticketBack, 'height'));
            this.modifyTicketHeight = parseInt(this.getStyle(modifyTicket, 'height'));
            this.crossBorderHeight = parseInt(this.getStyle(crossBorder, 'height'));

            this.containerDom = document.getElementById('container');
            this.addScrollEvent();
        },

        //监听滚动事件
        addScrollEvent(){
            this.containerDom.addEventListener('scroll', this.handleScroll)
        },

        handleScroll(){
            if (this.containerDom.scrollTop >= 0 && this.containerDom.scrollTop < this.buyTicketHeight){
                this.currLi = 0
            } else if (this.containerDom.scrollTop >= this.buyTicketHeight && this.containerDom.scrollTop < (this.buyTicketHeight + this.ticketBackHeight)){
                this.currLi = 1
            } else if (this.containerDom.scrollTop >= (this.buyTicketHeight + this.ticketBackHeight) && this.containerDom.scrollTop < (this.buyTicketHeight + this.ticketBackHeight + this.modifyTicketHeight)){
                this.currLi = 2
            } else if (this.containerDom.scrollTop >= (this.buyTicketHeight + this.ticketBackHeight + this.modifyTicketHeight)){
                this.currLi = 3
            }
                
        },

        clickTab(item, index){
            this.currLi = index;
            let container = document.getElementById('container');
            if (this.currLi == 0){
                container.scrollTop = '0';
            } else if (this.currLi == 1){
                container.scrollTop = this.buyTicketHeight;
            } else if (this.currLi == 2){
                container.scrollTop = this.buyTicketHeight + this.ticketBackHeight;
            } else if (this.currLi == 3){
                container.scrollTop = this.buyTicketHeight + this.ticketBackHeight + this.modifyTicketHeight;
            }
        },

        /**
             * 获取计算后的属性。  如果attr不传，则返回整个style对象
             */
        getStyle(obj, attr){
            if (obj.currentStyle) {
                return attr ? obj.currentStyle[attr] : obj.currentStyle;
            } 
            return attr ? document.defaultView.getComputedStyle(obj, null)[attr] : document.defaultView.getComputedStyle(obj, null);
                
        }
    }
}
</script>
<style scoped lang="less">
    @import '~styles/core/common.less';
    @import '~styles/mixins/mixinsStyle.less';
    

    nav {
        padding: 0 .4rem;
        height: .7rem;
        line-height: .7rem;
        font-size: .3rem;        
        background: #fff;
        text-align: center;
        color: @secondary-text-color;
        ul {
            .flex-box;
            .justify-content(space-between);
            li {
                cursor: pointer;
                position: relative;
                &.selected::after{
                    content: "";
                    position: absolute;
                    background: @theme-color;
                    width: .52rem;
                    height: .04rem;
                    bottom: 0rem;
                    left: 50%;
                    margin-left: -.26rem;
                }
                
            }
        }
    }

    .content-box{
        position: absolute;
        height: calc(~"100% - 1.12rem - .7rem");
        top: 1.82rem;
        background: #fff;
        width: 100%;
        overflow: hidden;
        padding: 0 .4rem;
    }

    .content-wrap{
        position: absolute;
        top: 0;
        transition: all .5s;
        left: .4rem;
        right: .4rem;
        overflow-x: hidden;
        overflow-y: auto;
        max-height: 98%;
    }
    .description-container {
        background: rgb(109, 96, 96);
        color: @secondary-text-color;
        z-index: 999;
        box-sizing: border-box;
        font-size: .26rem;
        border-radius: .2rem .2rem 0 0;
        overflow: hidden;
        height: 100%;
        position: relative;
        
        .pop-title{
            border-radius: .2rem .2rem 0 0;
            font-size: .3rem;
            height: 1.12rem;
            line-height: 1.12rem;
            text-align: center;
            background: #F6F9FD;
            font-weight: 600;
            position: relative;
            .icon{
                display: inline-block;
                width: .24rem;
                height: .24rem;
                position: absolute;
                right: 0.2rem;
                top: 50%;
                margin-top: -.12rem;
                .close{
                    fill:@placeholder-color ;
                }
                &:active{
                    opacity: .8;
                }
            }
        }


        article {
            margin: .3rem 0;

            &:first-of-type {
                margin-top: .3rem;
            }

            .title {
                font-size: .3rem;
                font-weight: bold;
                margin-bottom: .06rem;
                display: flex;
                align-items: center;
                i{
                    margin-right: .1rem;
                    margin-top: .08rem;
                    .icon_common_prompt{
                        fill: @third-text-color;
                    }
                }
            }

            .content {
                font-size: .26rem;
                color: @secondary-text-color;
                line-height: .52rem;
            }

            .font-red {
                color: #F83939;
            }

            .font-gray {
                color: @third-text-color;
            }

            .font-blue {
                color: @theme-color;
            }

            table {
                table-layout: fixed;
                border-collapse: collapse;
                width: 100%;
                font-size: .26rem;

                th,
                td {
                    color: #555;
                    background: #f2f3f5;
                    border: 1px solid #C2C2C2;
                    vertical-align: center;
                    padding: .32rem .2rem;
                    text-align: left;
                }

                th {
                    font-weight: bold;
                }
            }

            .remark {
                font-size: .24rem;
                color: #555;
            }
        }

    }
   
</style>