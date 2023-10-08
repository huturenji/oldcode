<template>
    <div class="btn-group" v-if="btnGroup && btnGroup.length>0">
        <block v-for="(btn,i) in btnGroup" :key="i">
            <SnButton v-if="btn.show()" class="btn cursorp" inline size="medium" shape="round" :ghost="btn.ghostModel" :class="!judgeOrderBook() && 'disable'" :type="btn.type" @click.native="judgeOrderBook() && btn.onClick()" >
                {{btn.text}}
            </SnButton>
            <!-- <SnButton v-if="btn.show()" class="btn cursorp" inline size="medium" shape="round" :ghost="btn.ghostModel" :class="!judgeOrderBook() && 'disable'" :type="btn.type" @click="judgeOrderBook() && btn.onClick()">
                {{btn.guarantee}}
            </SnButton> -->
            <!--<div v-if="btn.show()" class="btn cursorp" :class="!!btn.class ? btn.class : ''" :style="getOtherBookBtnStyle()" @click="judgeOrderBook() && btn.onClick()">{{btn.text}}</div>-->
        </block>

        <!--<swp-pay v-if="showPay" ref="payComp"-->
                 <!--:useType="transUseType()" :amount="orderItem.payAmount"-->
                 <!--:orderNo="orderItem.orderNo" :noLimit="true" :goodsDesc="order.getGoodsDesc()"-->
                 <!--productType="orderItem.typeCode" @paySuccCallback="toPaySuccess" @payError="payError">-->

            <!--<component :is="currProduct" slot="abnormalProductInfo" slot-scope="{exceedStandard}" :exceedStandard="exceedStandard" :amount="orderItem.payAmount"-->
                       <!--:airline="abnormalInfo.airline"-->
                       <!--:train="abnormalInfo.train"-->
                       <!--:hotel="abnormalInfo.hotel"-->
            <!--&gt;</component>-->
        <!--</swp-pay>-->
    </div>
</template>

<script>
import extendUtils from 'orderCommon/extend.js';
import requestHandler from 'orderCommon/requestHandler.js';
// import { getStatusByCategory } from 'orderCommon/enum/orderStatusEnum.js';
import mixin from 'orderCommon/orderMixin.js';
const SnButton = ()=>import('components/button');
export default {
    props: {
        orderItem:{
            type: Object,
            default: ()=>{}
        }
    },
    components: {SnButton},
    mixins: [mixin],
    data() {
        let that = this;
        let order = requestHandler.getOrderObj(that.orderItem.typeCode);
        this['set'+that.orderItem.typeCode+'Data'](order);
        return {
            order: order,
            abnormalInfo: {
                airline: {},
                train: {},
                hotel: {}
            },
            btnGroup: [
                {
                    text: '取消',
                    guarantee:'去担保',
                    ghostModel: true,
                    show: ()=>{
                        //用车暂时屏蔽
                        if (this.orderItem.typeCode == 'Car'){
                            return false;
                        }
                        //酒店列表中只有未支付的订单展示取消
                        return ['UNPAID','WAIT_FOR_PAY'].indexOf(that.orderItem.orderStatus)>-1;
                    },
                    onClick: ()=>{
                        order.cancelOrder(this.orderItem.orderNo).then(res => {
                            if (res.result && res.result.success){
                                that.$emit('togglePopLoading', true);
                                that.refreshOrderDetail().then(()=>{
                                    that.$emit('togglePopLoading', false);
                                });
                            } else {
                                extendUtils.showToast('取消失败');
                            }
                        }).catch(() => {
                        });
                    }
                },
                {
                    text: '去支付',
                    ghostModel: false,
                    type: 'warning',
                    show: ()=>{
                        //TODO 缺少支付行程异常/超标时所需的产品信息，本功能屏蔽
                        return false;
                        // that.showPay && that.setAbnormalProductInfo();
                        // return that.showPay;
                    },
                    onClick: ()=>{
                        this.$refs.payComp.showPayPop();
                    }
                },
                {
                    text: '补开报销凭证',
                    ghostModel: true,
                    show: ()=>{
                        //TODO 缺少invoiceFlag，本功能屏蔽
                        return false;
                        // return order.showInvoice();
                    },
                    onClick: ()=>{
                        order.toReimburse();
                    }
                },
                {
                    text: '订酒店',
                    ghostModel: true,
                    show: ()=>{
                        //TODO 火车票缺少起始城市名字，因此本功能屏蔽
                        return false;
                        // //酒店订单就不展示这个按钮了
                        // if(that.orderItem.typeCode=='Hotel'){
                        //     return false;
                        // }
                        // return getStatusByCategory(1, 1).concat(getStatusByCategory(2, 1, ['FAILED_OUT_TICKET'])).indexOf(that.orderItem.OrderStatus)>-1
                    },
                    onClick: ()=>{
                        order.toHome('hotel.html#/');
                    }
                },
                {
                    text: '再次预订',
                    type: 'warning',
                    show: ()=>{
                        return false;//TODO 酒店缺少城市信息

                        // //‘客房不足，已取消’ 和 ‘出票失败’显示“再次预订”
                        // return ['FAILED_OUT_TICKET', 'HOTEL_REJECT_ORDER'].indexOf(that.orderItem.orderStatus)>-1;
                    },
                    onClick: ()=>{
                        order.toHome()
                    }
                }
            ]
        }
    },
    computed: {
        showPay(){
            return ['UNPAID','WAIT_FOR_PAY'].indexOf(this.orderItem.orderStatus)>-1;
        },
        currProduct(){
            return this.orderItem.typeCode.toLowerCase()+'Info';
        }
    },
    mounted() {
        this.selfOrder = this.orderItem.selfOrder;
    },
    methods: {
        /**
             * 刷新订单信息，从详情接口获取信息
             */
        refreshOrderDetail(){
            return new Promise((resolve, reject) => {
                let that = this;
                //查询详情，获取最新状态
                this.order.getOrderDetail(this.orderItem.orderNo).then(res => {
                    that.orderItem.orderStatus = that.order.orderDetail.orderStatus;
                    that.$emit('refreshOrderDetail','')
                    resolve(res);
                }).catch(e=>{
                    reject(e);
                });
            })
        },
        /**
             * 支付失败时的处理
             */
        payError(){
            this.refreshOrderDetail();
        },

        /**
             * 设置支付行程异常或超标时，显示的产品信息
             */
        setAbnormalProductInfo(){
            let orderItem = this.orderItem;
            switch (this.orderItem.typeCode) {
            case 'Flight':{
                let flightDepartTimeArr = orderItem.departTime.split(' ');
                let flightArriveTimeArr = orderItem.arriveTime.split(' ');
                this.abnormalInfo.airline = {
                    beginDate: flightDepartTimeArr[0],
                    sAirportName: orderItem.sAirportName,
                    sTerminal: orderItem.sTerminal,//TODO 缺失
                    eTerminal: orderItem.eTerminal,//TODO 缺失
                    beginTime: flightDepartTimeArr[1],
                    arriveTime: flightArriveTimeArr[1],
                    eAirportName: orderItem.eAirportName,
                    airLineName: orderItem.airLineName,
                    flightNo: orderItem.flightNo,
                    cabinName: orderItem.cabinName
                };
            }
                break;
            case 'Train':{
                let trainDepartTimeArr = orderItem.startTime.split(' ');
                let trainArriveTimeArr = orderItem.endTime.split(' ');
                this.abnormalInfo.train = {
                    startDate: trainDepartTimeArr[0],
                    startTime: trainDepartTimeArr[1],
                    endTime: trainArriveTimeArr[1],
                    startStation: orderItem.startStation,//TODO 缺失
                    endStation: orderItem.endStation,//TODO 缺失
                    trainNo: orderItem.trainNo,
                    seatType: orderItem.seatType//TODO 缺失
                };
            }
                break;
            case 'Hotel':
                this.abnormalInfo.hotel = {
                    hotelName: orderItem.hotelName,
                    inDate: orderItem.departDate,
                    outDate: orderItem.arriveDate,
                    roomName: orderItem.roomTypeName
                };
                break;
            default:
                break;
            }
        },
        /**
             * 支付成功回调
             */
        toPaySuccess(){
            // let that = this;
            //查询详情，获取最新状态
            this.refreshOrderDetail();
            //跳转到支付成功页面
            let param = this.order.toSuccessParam();
            param.query.pageFrom = 'orderList';
            let paramArr = [];
            for (let key in param.query){
                paramArr.push(key+'='+param.query[key]);
            }
            requestHandler.openPage('order/index.html#'+param.path+'?'+paramArr.join('&'))
        },
        /**
             * 转换因公因私，1： PRIVATE；0：PUBLIC
             */
        transUseType(useType=this.orderItem.useType){
            switch (useType) {
            case 0:
                return extendUtils.USE_TYPE_ENUM.PUBLIC.name;
            case 1:
                return extendUtils.USE_TYPE_ENUM.PRIVATE.name;
            default:
                return extendUtils.USE_TYPE_ENUM.PRIVATE.name;
            }
        },
        setFlightData(OrderClass){
            let orderItem = this.orderItem;
            let departTime = orderItem.departTime.split(' ');//日期+时间
            let arriveTime = orderItem.arriveTime.split(' ');
            OrderClass.setOrderDetail({
                orderStatus: orderItem.orderStatus,
                orderNo: orderItem.orderNo,
                useType: this.transUseType(),
                tripNo: orderItem.tripNo,//TODO 缺失
                providerType: orderItem.providerType//TODO 缺失
            }).setInvoiceDetail({
                invoiceFlag: orderItem.invoiceFlag,//TODO 少一个invoiceFlag参数，需要服务器提供
                invoiceDone: orderItem.invoiceDone//TODO 缺失
            }).setAirline({
                departDate: departTime[0],
                arriveDate: arriveTime[0],
                departTime: departTime[1],
                arriveTime: arriveTime[1],
                departCityName: orderItem.departCityName,
                arriveCityName: orderItem.arriveCityName,
                departAirportName: orderItem.sAirportName,
                arriveAirportName: orderItem.eAirportName
            })
        },

        setTrainData(OrderClass){
            let orderItem = this.orderItem;
            let departTime = orderItem.startTime.split(' ');//日期+时间
            let arriveTime = orderItem.endTime.split(' ');
            OrderClass.setOrderDetail({
                orderStatus: orderItem.orderStatus,
                orderNo: orderItem.orderNo,
                useType: this.transUseType(),
                tripNo: orderItem.tripNo,//TODO 缺失
                providerType: orderItem.providerType//TODO 缺失
            }).setInvoiceDetail({
                invoiceFlag: orderItem.invoiceFlag,//TODO 少一个invoiceFlag参数，需要服务器提供
                invoiceDone: orderItem.invoiceDone//TODO 缺失
            }).setTrain({
                departDate: departTime[0],
                arriveDate: arriveTime[0],
                departTime: departTime[1],
                arriveTime: arriveTime[1],
                departCityName: orderItem.startCity,//TODO 这里实际是站点名，也就是说，并没有给城市名
                arriveCityName: orderItem.endCity,
                departStation: orderItem.startStation || orderItem.startCity,//TODO 缺失
                arriveStation: orderItem.endStation || orderItem.endCity//TODO 缺失
            })
        },

        setHotelData(OrderClass){
            let orderItem = this.orderItem;
            let departTime = orderItem.departDate.split(' ');//日期+时间
            let arriveTime = orderItem.arriveDate.split(' ');
            OrderClass.setOrderDetail({
                orderStatus: orderItem.orderStatus,
                orderNo: orderItem.orderNo,
                useType: this.transUseType(),
                tripNo: orderItem.tripNo,//TODO 缺失
                providerType: orderItem.providerType//TODO 缺失
            }).setInvoiceDetail({
                invoiceFlag: orderItem.invoiceFlag,//TODO 缺失
                invoiceDone: orderItem.invoiceDone//TODO 缺失
            }).setHotel({
                departDate: departTime[0],
                arriveDate: arriveTime[0],
                departCityName: orderItem.cityName,//TODO 缺失
                arriveCityName: orderItem.cityName,//TODO 缺失
                hotelName: orderItem.hotelName,
                roomType: orderItem.roomType,
                invoiceMode: orderItem.invoiceMode//TODO 缺失
            })
        },

        setCarData(OrderClass){
            let orderItem = this.orderItem;
            OrderClass.setOrderDetail({
                orderStatus: orderItem.orderStatus,
                orderNo: orderItem.orderNo,
                useType: this.transUseType()
            }).setInvoiceDetail({
            }).setCar({
                departDate: orderItem.departTime
            })
        }
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/common/index.less';
    .btn-group{
        display: flex;
        justify-content: flex-end;
        padding: 0 .3rem;

        .btn{
            &.disable{
                color: @disable-color;
                cursor: no-drop;
            }
        }
    }
</style>
