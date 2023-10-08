<template>
  <div class="outWrapHotel" :class="{showPadding:showPadding}">
        <OrderCard
            class="orderCardWrap"
            :inDate="inDate"
            page="order"
            :outDate="outDate"
            :inDays="inDays"
            :roomName="roomName"
            :roomCount="roomNum"
            :hotelName="hotelName"
            @showHotelRoomInfo="showHotelRoomInfo"
            :room="hotelRoomInfo.roomInfo"
            :productIndex="hotelRoomInfo.productIndex"
            :Service="hotelRoomInfo.Service"
        />
        <div class="topbgOutWrap">
            <div class="topbgWrap" v-bind:style="{backgroundImage: 'url(' + changUrlToHttps(hotelRoomInfo.hotelImg) + ')'}">
                <div class="topbgitem"></div>
            </div>
        </div>
        <!--tab-->
        <div class="tab">
            <div>
                <div class="tabtit bbpxs">入住信息</div>
                <div class="downWrap bbpxs cursorp normal-btn" @click="roomNumWrapShow=!roomNumWrapShow">
                    <div class="text">房间数</div>
                    <div class="middle">{{roomNum}}间</div>
                    <Icon v-if="roomNumWrapShow" type='icon_common_uparrow' class="downWrapIcon" size=".24"/>
                    <Icon v-else type='icon_common_downarrow' class="downWrapIcon" size=".24"/>
                </div>
                <div class="roomNumWrap" v-show="roomNumWrapShow">
                    <div
                        class="roomItem cursorp"
                        :class="{active:item==roomNum}"
                        v-for="(item,index) in roomNumList"
                        :key="index"
                        @click="onRoomNumChange(item)"
                    >{{item}}间</div>
                </div>
                <div class="roomUserSumWrap notabborder">
                    <div class="left">
                        <div
                            class="panel pd3 bbpxs leftColor roomUserSum bbpxs"
                            v-for="(item,index) in roomNumArr"
                            :key="index"
                        >
                            <flexbox class="panel_flex">
                                <flexbox-item :span="titleFlex">
                                    <div
                                        v-if="index==0"
                                        class="form_input_title cursorp normal-btn"
                                        @click="showNameRulePop=true"
                                    >
                                        入住人{{index+1}}
                                        <Icon type='icon_common_clamation-circle' class="circle normal-btn" size=".28"/>
                                    </div>
                                    <div v-else class="form_input_title">入住人{{index+1}}</div>
                                </flexbox-item>
                                <flexbox-item>
                                    <div class="form_input">
                                        <span v-if="userLoading" class="inline-loading">
                                            <LoadingX
                                                v-if="userLoading"
                                                :spinning="userLoading"
                                                :turn="userLoading"
                                                size="default"
                                                tip="正在获取用户数据"
                                            />
                                        </span>
                                        <input
                                            v-else
                                            type="text"
                                            :readonly="false && (passengerArr[index]||{}).userId"
                                            ref="pName"
                                            v-model="(passengerArr[index]||{}).name"
                                            placeholder="请输入入住人姓名"
                                            style="text-align:left;"
                                        />
                                    </div>
                                </flexbox-item>
                            </flexbox>
                            <template v-if='needIdNo'>
                                <flexbox class="panel_flex line_top">
                                    <flexbox-item :span="titleFlex">
                                    <div class="form_input_title">身份证号</div>
                                    </flexbox-item>
                                    <flexbox-item>
                                            <div class="form_input"> 
                                                    <span v-if='userLoading' class='inline-loading'>
                                                        <LoadingX
                                                            v-if="userLoading"
                                                            :spinning="userLoading"
                                                            :turn="userLoading"
                                                            size="default"
                                                            tip="正在获取用户数据"
                                                        />
                                                    </span>
                                                    <input v-else type="text"
                                                    v-model='(passengerArr[index]||{}).hotelIdCardNo' placeholder="请输入身份证号" style="text-align:left;"/>
                                                </div>
                                    </flexbox-item>
                                </flexbox>
                            </template>
                        </div>
                    </div>
                    <div class="right cursorp normal-btn" @click="addPsg">
                        <Icon type='icon_common_useradd' class="useradd normal-btn" size=".38"/>
                    </div>
                </div>
                <div class="roomUserSumWrap notabborder mb20 btpxs">
                    <div class="left">
                        <div class="panel pd3 leftColor roomUserSum">
                            <flexbox class="panel_flex">
                                <flexbox-item :span="titleFlex">
                                    <div class="form_input_title">联系电话</div>
                                </flexbox-item>
                                <flexbox-item>
                                    <div class="form_input">
                                        <span v-if="telLoading" class="inline-loading">
                                            <LoadingX
                                                v-if="telLoading"
                                                :spinning="telLoading"
                                                :turn="telLoading"
                                                size="default"
                                                tip="正在获取用户数据"
                                            />
                                        </span>
                                        <input
                                            v-else
                                            type="text"
                                            maxlength="13"
                                            ref="contactMobile"
                                            placeholder="用于接受预定信息"
                                            v-model="orderInfo.contactMobile"
                                            style="text-align:left;"
                                            @focus="focusFun"
                                        />
                                    </div>
                                </flexbox-item>
                            </flexbox>
                        </div>
                    </div>
                    <div class="right cursorp normal-btn" @click="choosePhone" v-if="!inwxmini">
                        <Icon type='btn_conmmon_phone' class="useradd normal-btn" size=".38"/>
                    </div>
                </div>
                
                <div class="tabtit bbpxs" v-if="isShowEndTime">最晚抵店时间</div>
                <div
                    class="panel pd3 time bbpxs cursorp"
                    @click="changeGuarantee(false)"
                    v-if="isShowEndTime"
                >
                    <div class="panel-box panel-box_attend box_select">
                        <div class="panel-box_bd">
                            <p class="panel-box_title">
                                {{guaranteeRule.endTime}} 至 {{(!guaranteeRule.isTomorrow ? '次日' : '' ) +
                                guaranteeRule.startTime}}
                            </p>
                            <p class="panel-box_title box_select_third">{{noNeedGuaranteeHint}}</p>
                        </div>
                        <div class="panel-box_time">
                            <div class="panel-box_bd">
                                <p class="panel-box_title box_commit"></p>
                            </div>
                            <div class="box_icon">
                                <Icon v-if="!isGuaranteeShow" type='btn_common_radio_sel2' class="normal-btn" size=".4"/>
                                <Icon v-else type='btn_common_radio_nor' class="normal-btn" size=".4"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="panel pd3 time bbpxs cursorp"
                    @click="changeGuarantee(true)"
                    v-if="isShowEndTime"
                >
                    <div class="panel-box panel-box_attend box_select">
                        <div class="panel-box_bd">
                            <p class="panel-box_title">
                                {{guaranteeRule.startTime}} 至{{(guaranteeRule.isTomorrow ? '次日' : '' ) +
                                guaranteeRule.endTime}}
                            </p>
                            <p class="panel-box_title box_select_warn">{{needGuaranteeHint}}</p>
                        </div>
                        <div class="panel-box_time">
                            <div class="panel-box_bd">
                                <p class="panel-box_title box_commit"></p>
                            </div>
                            <div class="box_icon">
                                <Icon v-if="!isGuaranteeShow" type='btn_common_radio_nor' class="normal-btn" size=".4"/>
                                <Icon v-else type='btn_common_radio_sel2' class="normal-btn" size=".4"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="reimburse"
                    v-if="1 == orderInfo.paymentType && 'BusinessTrip' == invoiceMode"
                >
                    <div class="reimburseTitWrap" :class="{bbpxsr:showReim}">
                        <div class="leftWrap">
                            <div class="tit">报销凭证</div>
                            <div class="tip red" v-if="showReim">离店后1-2个工作日内，可在订单详情中查看发票</div>
                            <div class="tip" v-else>离店后30天内可进入订单详情补开</div>
                        </div>
                        <div class="orderRightWrap cursorp">
                            <SnSwitch slot="right-icon" v-model="showReim" />
                        </div>
                    </div>
                    <div v-show="showReim" class="reimDetail">
                        <div class="list bbpxsr">
                            <div class="title">发票类型</div>
                            <div class="content">
                                <span class="text" style="color:#999999">增值税普通发票（电子）</span>
                            </div>
                        </div>
                        <div class="list bbpxsr">
                            <div class="title">发票抬头</div>
                            <div class="content cursorp" @click="showInvoice">
                                <div
                                    v-if="reimDetail.name"
                                    class="text"
                                >{{reimDetail.name}}</div>
                                <div v-else class="text placeholder">添加或选择发票抬头</div>
                                <!-- 定位的导入企业发票抬头的icon图标 -->
                                <div v-if="isBizMate() && showImportInvoice" @click.stop="importInvoiceFun" class="importInvoice"><Icon type="svg_icon_invoice_import" size='.4' /></div>
                                
                                <div class="right"></div>
                            </div>
                        </div>
                        <div class="list bbpxsr">
                            <div class="title">发票内容</div>
                            <div class="content">
                                <span class="text">{{reimDetailOther.content}}</span>
                            </div>
                        </div>
                        <div class="list" @click="isCheck =!isCheck">
                            <div class="title">发票备注</div>
                            <div class="content">
                                <span class="text" style="color:#999999">
                                    <span>注明酒店名和入离时间</span>
                                </span>
                                <span
                                    class="arrow cursorp"
                                    :class="{active:isCheck}"
                                ></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lineOutWrap" v-else>
                    <div class="label">报销凭证</div>
                    <div class="content">如需报销凭证，请向酒店前台索取</div>
                </div>
                <!-- <CouponItem
                    ref="couponItem"
                    :productType="2"
                    :couponList="hotelRoomInfo.roomInfo.roomProducts[hotelRoomInfo.productIndex].CanUseCoupon"
                    @setCoupon="setCoupon"
                /> -->

                 <!-- 用户下单协议的dom部分 -->
                <div class="protocols_part">
                  <protocols ref="protocolComp" @initAppBackFun="initAppBackFun"/>
                </div>
                
                <div class="line bottomTit">取消规则：</div>
                <div class="line bottomText" v-if="1 == orderInfo.paymentType">{{prepayRuleDesc}}</div>
                <div
                    class="line bottomText"
                    v-if="0 == orderInfo.paymentType"
                >{{guarantee?guaranteeRule.guaranteeDesc:cancelCashRule}}</div>
                <div class="line bottomTit">入住离店：</div>
                <div
                    class="line bottomText"
                    v-if="1 == orderInfo.paymentType"
                >入住请在当日14点以后办理，早到店可能需要等待，离店请在当日12点以前办理</div>
                <div
                    class="line bottomText"
                    v-if="0 == orderInfo.paymentType"
                >入住请在当日14点以后办理，早到店可能需要等待，离店请在当日12点以前办理</div>
            </div>
           
        </div>
        <!--价格明细-->
        <div v-transfer-dom class="hotelPriceDetailWrap">
            <popup
                v-model="pDetailFlag"
                position="bottom"
                class="popBox2 hotelPriceDetail"
                is-transparent
            >
                <PriceDetail
                    v-if="!!hotelRoomInfo.roomInfo"
                    :showFlag="true"
                    :inDate="inDate"
                    :orderAmount="orderInfo.fareAmount"
                    :roomCount="roomNum"
                    :hotelName="hotelName"
                    :totalPrice="orderInfo.totalPrice"
                    :discount="getDiscount()"
                    :breakfastType="hotelRoomInfo.roomInfo.roomProducts[hotelRoomInfo.productIndex].breakfastType"
                    :priceCalendar="hotelRoomInfo.roomInfo.roomProducts[hotelRoomInfo.productIndex].priceCalendar"
                    :couponValue="!!currCoupon?currCoupon.couponValue:''"
                />
            </popup>
        </div>
        <div v-transfer-dom v-show="isOriginHei || isPc">
            <div class="orderBottomButWrap buttWrap">
                <div class="left">
                    <div class="leftText num-font"><span class="rmb">￥</span>{{+orderInfo.fareAmount}}</div>
                    <span class="lineH"></span>
                    <div class="leftTps">
                        共
                        <span>{{roomNum}}</span>间
                    </div>
                </div>
                <div class="middle cursorp" @click="pDetailFlag=!pDetailFlag">
                    <span>明细</span>
                    <Icon v-if="pDetailFlag" type='icon_common_downarrow' class="downWrapIcon normal-btn" size=".2"/>
                    <Icon v-else type='icon_common_uparrow' class="downWrapIcon normal-btn" size=".2"/>
                </div>
                <div class="right">
                    <div class="bottombuttonWrap">
                        <div v-if="orderInfo.paymentType == 1 || !guarantee" class="subButton normal-btn linear-gra-dange" @click="createOrder">提交订单</div>
                        <div v-if='orderInfo.paymentType == 0 && guarantee' class="subButton normal-btn linear-gra-dange" @click="createOrder">去担保</div>
                    </div>
                </div>
            </div>
        </div>
        <!--编辑发票抬头-->
        <div v-transfer-dom>
            <popup v-model="showReceiptEdit" class="editDetail" height="100%">
                <swp-invoice-card
                    v-if="showInvoiceComp"
                    ref="invoiceCard"
                    v-model="reimDetail"
                    @showImportInvoiceFun="checkImportInvoiceBtn"
                    @closeInvoiceList="showReceiptEdit=false"
                ></swp-invoice-card>
            </popup>
        </div>
        <!-- loading -->
        <div v-transfer-dom>
            <loading :show="popLoading" text="加载中"></loading>
        </div>
        <!--日历选择-->
        <div v-transfer-dom>
            <popup
                v-model="showCalendar"
                position="bottom"
                :show-mask="true"
                hide-on-blur
                style="min-height: 8rem;background: #ffffff "
            >
                <div class="calendar">
                    <CalendarX
                        ref="calendar"
                        @changeMonth="choseDay"
                        :agoDayHide="agoDayHideDate"
                        :displayMode=5
                    ></CalendarX>
                </div>
            </popup>
        </div>

        <!--添加旅客信息-->
        <div v-transfer-dom>
            <popup
                v-model="showPsg"
                height="100%"
                width="100%"
                position="right"
                :show-mask="true"
                hide-on-blur
                style="background: #f2f3f5 "
            >
                <div>
                    <swp-psg-list
                        v-if="showPsgCom"
                        :maxLength="roomNum"
                        v-model="passengerArr"
                        :showPsgFlag="showPsg"
                        :addPsgFlag="true"
                        ref="psg"
                        @SLloginUserInfo="SLloginUserInfoFun"
                        @TchatLoginUserInfo="TchatLoginUserInfoFun"
                        @closePsgList="closePsgListFun"
                        psgType="hotel"
                    ></swp-psg-list>
                    <!-- <Passenger 
            v-if="showPsgCom" 
            :maxLength='roomNum' 
            v-model='PassengerArr' 
            :showPsgFlag="showPsg"
            :addPsgFlag='true' 
            ref='psg' 
            @SLloginUserInfo="SLloginUserInfoFun"
            @TchatLoginUserInfo="TchatLoginUserInfoFun"
            @closePsgList="closePsgListFun"
            psgType='hotel'>
                    </Passenger>-->
                </div>
            </popup>
        </div>
        <!--无审批单-->
        <div v-transfer-dom>
            <popup
                v-model="showNoApply"
                @on-cancel="showNoApply=false"
                height="100%"
                width="100%"
                position="right"
                class="confirmPay"
            >
                <gotoApplyTravel></gotoApplyTravel>
                <!-- <div class="tips">抱歉，未发现有效出差申请，无法提交因公出行订单</div>
        <div class="footer cursorp" @click="toTravelReq">
          发起出差申请
                </div>-->
            </popup>
        </div>
        <div v-transfer-dom>
            <popup v-model="roomInfoShow" height="auto" is-transparent>
                <hotelReserve @touchmove.prevent @scroll.prevent page="order" :room="hotelRoomInfo.roomInfo" :productIndex="hotelRoomInfo.productIndex" :service="hotelRoomInfo.Service" @close="roomInfoShow=false"/>
            </popup>
        </div>
        <div v-transfer-dom>
            <popup
                v-model="showNameRulePop"
                class="payTypeNameRule"
                position="bottom"
                :show-mask="false"
                is-transparent
            >
                <div class="bg cursorp"></div>
                <div class="textcontent" @click="showNameRulePop=false">
                    <div class="realContent">
                        <div class="title">入住人填写须知</div>
                        <div class="desc">
                            <p>1.入住人姓名需与实际入住人证件上的姓名保持一致</p>
                            <p>2.中文姓名中不能包含非中文字符</p>
                            <p>3.英文姓和名请用“/”隔开 ，且不可包含数字，其余特殊字符</p>
                            <p>4.姓名不能出现先生、小姐、女士、张三、李四、王五、测试、test、ms、mr、mrs等名称</p>
                            <p>5.预订多个房间时请填写多个不同的入住人姓名</p>
                        </div>
                        <div class="footer cursorp normal-btn" @click="showNameRulePop=false">我知道了</div>
                    </div>
                </div>
            </popup>
        </div>
        <!-- 下单进度条 -->
        <div v-transfer-dom class="progressDia" v-show="showOrderProcess">
            <div class="hotelMask"></div>
            <div class="hotelDetailDialog">
                <div class="orderProgress">
                    <div class="header"></div>
                    <div class="main">
                        <div class="hotelDetailNew">
                            <div class="name">{{hotelName}}</div>
                            <div class="date">
                                <Icon type='icon_common_calendar' class="common_calendar" size=".28"/>{{new Date(parseInt(inDate)).format('MM月dd日')+'入住 - '+new Date(parseInt(outDate)).format('MM月dd日')+'离店 住'+inDays+'晚'}}
                            </div>
                            <div class="room"><Icon type='icon_common_clamation-circle' class="clamation-circle" size=".28"/>{{roomName+' '+roomNum}}间</div>
                        </div>
                        <div class="passenger">
                            入住人：<span
                                class="names"
                                v-for="(user,index) in passengerArr"
                                :key="index"
                            >{{user.name}}</span>
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="bottom_tips">正在预订房间，请稍候 {{processPrecent}}%</div>
                        <div class="progress" :style="{'width':processPrecent+'%'}"></div>
                    </div>
                </div>
            </div>
        </div>

        <div v-transfer-dom>
            <popup
                v-model="showSuccess"
                height="100%"
                width="100%"
                position="right"
            >
                <SuccessPage :orderNo='orderNo'/>
            </popup>
        </div>
    </div>
</template>

<script>
// import CouponItem from 'components/coupon/couponItem.vue';优惠券先行屏蔽不要删除2020-6-3
import hotelHandler from 'hotelHandler/hotelHandler.js'
import PriceDetail from 'hotelComponent/hotelcomp/PriceDetail.vue';
import LoadingX from "components/loading";
import CalendarX from "components/calendar/CalendarX.vue";
import HotelReserve from "hotelComponent/hotelcomp/HotelReserve";
import gotoApplyTravel from 'components/travelAbnormal/gotoApplyTravel/index.vue';
import Icon from 'components/icon';
import OrderCard from 'hotelComponent/hotelcomp/OrderCard.vue';
import protocols from 'components/protocols/comp/protocols.vue';
import customerService from "components/customer-service/index";
import SnSwitch from 'components/switch';
import {
    // Group,
    // Cell,
    // CellBox,
    Flexbox,
    FlexboxItem,
    // PopupRadio,
    Popup,
    // XSwitch,
    // XInput,
    TransferDom,
    // Confirm,
    // XButton,
    // XDialog,
    Loading
} from 'vux';
const BisType = hotelHandler.BisType;
var extendUtils = SnTravel.functional;
const SuccessPage = ()=>import('./orderSuc')
export default {
    mixins: [hotelHandler.mixin.tChatEventMixin],
    directives: {
        TransferDom
    },
    components: {
        //   CouponItem,优惠券先行屏蔽不要删除2020-6-3
        // XSwitch,
        // XInput,
        // XDialog,
        // Group,
        // Cell,
        // CellBox,
        Flexbox,
        FlexboxItem,
        // PopupRadio,
        OrderCard,
        CalendarX,
        Popup,
        // Confirm,
        // XButton,
        PriceDetail,
        HotelReserve,
        LoadingX,
        gotoApplyTravel,
        Loading,
        Icon,
        SnSwitch,
        protocols,
        SuccessPage
        // Passenger
    },
    props: {},
    data() {
        // let that = this;
        let managerData = hotelHandler.stateManager.setData([
            //人员添加界面  
            //以下两个callback 解决酒店编辑订单页面,新增多个乘客时选择乘客后不确认再直接返回,改变房间数量时会记录上次的选择
            {
                name: 'showPsg',
                show:{
                    callback(){}
                },
                hide: {
                    title: '编辑订单',
                    callback(){}
                }
            },
            //没有审批单
            {
                name: 'showNoApply',
                hide: {
                    title: '编辑订单'
                }
            },
            //TODO 需要修改为统一处理方式
            //发票信息
            // {
            //   name: 'showReceiptEdit',
            //   hide: {
            //     title: '编辑订单',
            //   },
            // },
            {
                name: 'showSuccess',
                show:{
                    title: '结果',
                    callback(){}
                },
                hide: {
                    title: '编辑订单',
                    callback(){}
                }
            }
        ], this);
        return Object.assign(managerData, {
            orderNo: null,
            userLoading: true,
            telLoading: true,
            currCoupon: null,//当前选择的优惠券
            showDetailDom: false, //价格明细
            cancelCashRule: '入住前可免费取消', //取消规则-现付非担保情况
            isCheck: true,//是否勾选发票备注
            showReim: false, //是否显示报销凭证
            showReceiptEdit: false, //编辑发票抬头界面
            pIIDType: 1, //证件类型
            psgTypeFlag: false, //旅客来源
            psg: {}, //旅客信息
            reimDetail: {},
            reimDetailOther: { //发票信息其他
                content: '*旅游服务*代订酒店费',
                remarks: ''
            },
            pDetailFlag: false, //价格明细显示
            hid: 0, //酒店ID
            inDate: 0, //入住时间
            outDate: 0, //离店时间
            inDays: 0, //入住天数
            roomName: '', //房型名称
            hotelName: '', //酒店名称
            returnCash: 0, //返现
            salePrice: 0, //售价
            roomNumArr: [1], //酒店入住人信息
            roomNum: 1, //房间数量
            roomIndex: 0, //房间索引数，也是人员索引数
            roomNumList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            idTypeList: [ //身份证 = 0,   护照 = 1,   其他 = 2
                {
                    key: 0,
                    value: '身份证'
                },
                {
                    key: 1,
                    value: '护照'
                },
                {
                    key: 2,
                    value: '其他'
                }
            ],
            idTypeListMap: { //证件类型map
                0: '身份证',
                1: '护照',
                2: '其他'
            },
            iIdTypeList: [ //证件类型参数
                {
                    key: 1,
                    value: '身份证',
                    index: 1
                },
                {
                    key: 2,
                    value: '护照',
                    index: 2
                },
                {
                    key: 3,
                    value: '港澳通行证',
                    index: 3
                },
                {
                    key: 4,
                    value: '台湾通行证',
                    index: 4
                },
                {
                    key: 5,
                    value: '台胞证',
                    index: 5
                },
                {
                    key: 6,
                    value: '回乡证',
                    index: 6
                },
                {
                    key: 7,
                    value: '其他',
                    index: 7
                }
            ],
            //idType:0,
            titleFlex: 3,
            guarantee: false, //是否需要担保
            isGuaranteeShow: false, //是否担保，选择入住时间显示选中状态
            orderInfo: { //预订信息
                inDate: new Date(parseInt(this.$route.query.inDate)).format('yyyy/MM/dd'), //入住时间
                outDate: new Date(parseInt(this.$route.query.outDate)).format('yyyy/MM/dd'), //离店时间
                hid: this.$route.query.hid,
                roomId: this.$route.query.roomId,
                roomsCount: 1,
                productId: this.$route.query.productId,
                roomTypeId: this.$route.query.roomTypeId,
                paymentType: this.$route.query.paymentType,
                // returnCash: this.$route.query.returnCash,//返现
                orderAmount: this.$route.query.settlePrice, //售价
                settlePrice: this.$route.query.settlePrice, //售价
                totalPrice: this.$route.query.totalPrice,
                fareAmount: this.$route.query.totalPrice,
                contactMobile: ''
            },
            contactMobileCopy:'',
            focusNum:0,//是否编辑过需要脱敏的信息
            prepayRuleDesc: this.$route.query.prepayRuleDesc, //取消规则描述
            showCalendar: false, //显示时间插件
            expiration: new Date(new Date(parseInt(this.$route.query.outDate)).getFullYear(), new Date(parseInt(this.$route.query.outDate)).getMonth()+1, 1).format('yyyy/MM'),
            agoDayHideDate: new Date(new Date(parseInt(this.$route.query.outDate)).getFullYear(), new Date(parseInt(this.$route.query.outDate)).getMonth()+1, 1).getTime(),
            //信用卡信息
            creditCard: {
                idType: 0
            },
            //入住人信息
            passengerArr: [{
                iDCode: 1,
                iDType: '身份证',
                iDNum: ''
            }],
            guaranteeType: this.$route.query.guaranteeType, //担保类型   0不担保|其它为担保 (1 全部担保  2 超过*间房担保  3 *点至*点担保 4. 房量担保和到店时间担保)
            guaranteeRule: JSON.parse(this.$route.query.guaranteeRule), //担保详情
            isShowEndTime: !!this.guaranteeRule && (3 == this.guaranteeType || 4 == this.guaranteeType), //是否显示最晚到店时间 
            delayShow: 0, //等待键盘收起再弹出下拉框
            showLoading: false,
            tripNo: '',
            // showNoApply: false,
            roomNumWrapShow: false,
            noNeedGuaranteeHint: "无需担保，房间保留至18：00，超时订单可能被酒店取消",
            needGuaranteeHint: "需要信用卡担保",
            isOriginHei: true, //是否显示底部按钮栏
            screenHeight: document.documentElement.clientHeight, //屏幕初始高度
            originHeight: document.documentElement.clientHeight, //屏幕高度
            roomInfoShow: false,
            hotelRoomInfo: {},
            invoiceMode: this.$route.query.invoiceMode, //预付产品发票模式: Hotel -- 酒店开具 BusinessTrip -- 商旅通开具                
            showOrderProcess: false, //预订中界面是否显示
            processPrecent: 0, //预定中进度
            specialPermissionInfos:[],//免审批信息
            showNameRulePop:false,//姓名规则
            isPc:false,//是否是pc端
            showInvoiceComp:false, //是否显示invoice组件
            showPsgCom:false, //是否显示passenger组件js
            popLoading: false,
            useTypeConfig:{},//因公因私公共配置
            showPadding:false,//outWrapHotel是否存在paddingtop
            showImportInvoice:false,//是否显示导入企业发票抬头的按钮 变量 true=显示 false=不显示 默认是false
            inwxmini:hotelHandler.MINIPROGRAM_CONFIG.IN_MINIPROGRAM || false//微信小程序内嵌h5
        });
    },
    created() {
        sinosdk.sino.overwriteWindowopen(); //通知app允许在异步回调中打开一个新窗口
        var that = this;
        that.$emit('showOff', true);
        if (hotelHandler.isPC()){
            that.isPc = true;
        }
        that.initData();
    },
    computed:{
        /**
             * 是否需要用户身份证
             */ 
        needIdNo(){
            let result = false;
            try {
                if (this.hotelRoomInfo && this.hotelRoomInfo.roomInfo){
                    result = this.hotelRoomInfo.roomInfo.roomProducts[this.hotelRoomInfo.productIndex].needIdNo;
                }
            } catch (e){
                console.error(e);
            }
            return result;
        }
    },
    async mounted() {
        var that = this;
        await hotelHandler.authInterceptor();
        //动态加载js
        that.dynamicLoadingJs();

        that.autoCloseLoading();
        //检测键盘是否弹起并设置下拉框弹出延时
        // eslint-disable-next-line no-undef
        $(document).on("focus", "input,textarea", function () {
            that.delayShow = 450;
        })
        // eslint-disable-next-line no-undef
        $(document).on("blur", "input,textarea", function () {
            setTimeout(function () {
                that.delayShow = 0;
            }, 500)
        });
        window.onresize = function () {
            return (function () {
                that.screenHeight = document.documentElement.clientHeight;
            })()
        };
        //因公预定酒店，编辑订单页没有自动勾选报销凭证
        that.judgePblic();
    },
    watch: {
        orderInfo:{
            handler(newVal){
                this.flagNum = 0;
                if (SnTravel.functional.ISDECORATE && this.focusNum != 0){
                    let value = newVal.contactMobile.replace(/\D/g, '').substr(0, 11) // 不允许输入非数字字符，超过11位数字截取前11位
                    let len = value.length 
                    if (len > 3 && len < 8) {                  
                        value = value.replace(/^(\d{3})/g, '$1 ')               
                    } 
                    else if (len >= 8) {
                        value = value.replace(/^(\d{3})(\d{4})/g, '$1 $2 ')
                    }
                    this.orderInfo.contactMobile = value;
                }
            },
            deep:true
        },
        screenHeight: function (newValue) {
            let that = this;
            if (that.originHeight > newValue + 150) { //150是为了兼容虚拟返回栏
                that.isOriginHei = false;
            } else {
                that.isOriginHei = true;
            }
        },
        passengerArr:{
            handler(newVal){
                let that = this;
                newVal.forEach(function(item){
                    if (that.showSurname(item.idCode) && !!item.name){ //item.idCode == 1代表是护照
                        that.$set(item, 'name', item.name.trim()); 
                        that.$set(item, 'name', item.name.replace(/\s+/g, "/")); //此处去空格的原因是因为，服务端返回的name是用firstName和lastName拼接的，此时拼接的时候中间是有空格的（例如： 'li si'），但是酒店下单的接口要求name是不能有空格的，故此处需要去空格处理
                    }
                    //如果不是身份证，则不可带入
                    if (item.hotelIdCardNo==null || item.hotelIdCardNo==undefined){
                        that.$set(item, 'hotelIdCardNo', item.idCode==0?item.idNum:''); 
                    }
                })

                //todo判断如果房间数大于乘客数量因为乘客数量是双向绑定的所以需要更新乘客
                let flagNum = this.roomNum - newVal.length;
                if (flagNum > 0){ //说明房间数量大于乘客数量
                    for (let i=0 ;i < flagNum; i++){
                        that.passengerArr.push({name:''});
                    }
                }
            },
            immediate:true,
            deep:true
        }
    },
    beforeRouteLeave(to, from, next) {
        let that = this;
        hotelHandler.stateManager.closeTopPop(() => {
            if (that.showReceiptEdit) {
                if (that.$refs.invoiceCard.showReceiptEdit) { //二级处理
                    that.$refs.invoiceCard.showReceiptEdit = false;
                } else {
                    that.showReceiptEdit = false;
                }
            } else {
                next();
            }

        });
    },
    methods: {
        /**
             * 艺龙图片使用https
             */ 
        changUrlToHttps(url){
            return hotelHandler.changUrlToHttps(url);
        },
        /**
             * 页面数据初始化
             */
        async initData() {
            let that = this;
            that.hid = that.$route.query.hid;
            that.inDate = that.$route.query.inDate;
            that.outDate = that.$route.query.outDate;
            that.inDays = that.$route.query.inDays;
            that.roomName = that.$route.query.roomName; //房型名称
            that.hotelName = that.$route.query.hotelName; //酒店名称
            that.returnCash = that.$route.query.returnCash; //返现
            that.salePrice = that.$route.query.salePrice; //售价   
            if (!!that.$route.query.tripNo) {
                that.tripNo = that.$route.query.tripNo;
            }
            that.useTypeConfig = await hotelHandler.useTypeConfig();
            if (that.useTypeConfig.isPublic(that.$route.query.useType)){
                that.GetSpecial();
            }
            const timeStamp = new Date(new Date().format("yyyy/MM/dd")).getTime() / 1000 + 24 * 3600;
            setTimeout(() => {
                that.$refs.calendar.setDate(timeStamp);
            }, 100);

            that.setChangeGuarantee();
            //房间可预订数量处理
            if (!!that.$route.query.inventory) {
                if (10 > parseInt(that.$route.query.inventory)) {
                    that.roomNumList = that.roomNumList.slice(0, parseInt(that.$route.query.inventory));
                }
            }
            if (!!hotelHandler.getStorage('hotelRoomInfo')) {
                that.hotelRoomInfo = JSON.parse(hotelHandler.getStorage('hotelRoomInfo'));
            }
            if (this.hotelRoomInfo.hotelImg == null){
                that.showPadding=false
            } else if (this.hotelRoomInfo.hotelImg){
                that.showPadding=true
            }
            // //设置默认优惠券优惠券先行屏蔽不要删除2020-6-3
            // that.setCoupon(that.currCoupon || that.hotelRoomInfo.roomInfo.roomProducts[that.hotelRoomInfo.productIndex].bestCoupon)
        },
        dataDecorate(){
            if (this.focusNum==0 && extendUtils.ISDECORATE){
                this.orderInfo.contactMobile = SnUtils.DataMasking.maskingText(SnUtils.DataMasking.MASKING_TYPE.TEL,this.orderInfo.contactMobile);
            }
        },
        focusFun(){
            this.focusNum++;
            if (this.focusNum==1 && extendUtils.ISDECORATE){
                this.orderInfo.contactMobile = '';  
            }
                
        },
        autoCloseLoading(){
            setTimeout(()=>{
                this.userLoading = this.telLoading = false;
            },15000);
        },

        initAppBackFun(){
            const that = this;
            sinosdk.sino.onBack(function () { //点击app返回事件
                hotelHandler.throttle(function () {
                    hotelHandler.stateManager.closeTopPop(() => {
                        that.goBackFun();
                    });
                }, this);
            }.bind(this));
        },
        /**
            * T信回退事件的注册回调 必须是goBackFun
            */
        goBackFun(){
            const that = this;
            if (that.pDetailFlag){ //费用明细
                that.pDetailFlag = false;
            } else if (that.roomInfoShow){ //房间详情
                that.roomInfoShow = false;
            } else if (that.showReceiptEdit) {
                if (that.$refs.invoiceCard.showAddInvoice) { //二级处理
                    that.$refs.invoiceCard.showAddInvoice = false;
                } else {
                    that.showReceiptEdit = false;
                }
                document.title = '编辑订单'
            } else if (that.showSuccess){
                hotelHandler.back();
            } else {
                hotelHandler.showConfirm('订单还没有提交，确定要离开这个页面吗？', function () { that.$router.back(); }, 2, '继续预订', '离开', null, function () {}, true)
            }
        },            
        //获取商旅登录人的信息 酒店用来更新入住人第一个人的姓名
        SLloginUserInfoFun(data){
            let that = this;
            that.userLoading = that.telLoading = false;
            let newData = JSON.parse(JSON.stringify(data))
            if (that.showSurname(newData.idCode) && !!newData.firstName){ 
                newData.name = newData.firstName + '/' + newData.lastName;
            }
            that.$set(newData, 'hotelIdCardNo', newData.idCode==0?newData.idNum:null);
            that.passengerArr = [];
            that.passengerArr.push(newData);
        },

        showSurname(code){
            return hotelHandler.showSurname(code)
        },
        //获取T信登录人的信息 酒店用来更新联系电话
        TchatLoginUserInfoFun(data){
            let that = this;
            that.userLoading = that.telLoading = false;
            let newData = JSON.parse(JSON.stringify(data));
            that.orderInfo.contactMobile = newData.phone;
            this.contactMobileCopy = newData.phone;
            this.dataDecorate();
        },
        //关闭乘客列表的组件
        closePsgListFun(){
            this.showPsg = false;
            document.title = '编辑订单';
        },

        //判断是否是伴正事，是伴正事的才有导入发票的功能 
        isBizMate(){
            return !!(hotelHandler.getBizMateVersion())||!!hotelHandler.isPC() ;
        },
        /**
             * 根据当前条件重新获取优惠券优惠券先行屏蔽不要删除2020-6-3
             */ 
        //   getUserValidCoupon(){
        //     let that = this;
        //     let param = {
        //         UnitPrice: that.orderInfo.totalPrice/that.roomNum,
        //         PassengerCount: that.roomNum,
        //         ProductType: 2,
        //     }
        //     that.orderInfo.fareAmount='核算价格中...'
        //     hotelHandler.findPersonalCoupon(param).then((res) => {
        //         if (res.code == 0 && !!res.data && res.data.CanUseCoupon.length>0) {
        //             that.$set(that.hotelRoomInfo.roomInfo.roomProducts[that.hotelRoomInfo.productIndex], 'CanUseCoupon', res.data.CanUseCoupon);
        //             that.setCoupon(res.data.CanUseCoupon[0]);
        //         }else{
        //             that.$set(that.hotelRoomInfo.roomInfo.roomProducts[that.hotelRoomInfo.productIndex], 'CanUseCoupon', null);
        //             that.setCoupon(null);
        //         }
        //     }).catch((err) => {
        //         that.$set(that.hotelRoomInfo.roomInfo.roomProducts[that.hotelRoomInfo.productIndex], 'CanUseCoupon', null);
        //         that.setCoupon(null);
        //     });
        //   },
        /**
             * 添加入住人界面显示
             */
        addPsg() {
            let that = this;
            that.showPsg = true;
            document.title = '添加入住人';
        },
        /**
             * 设置当前的优惠券优惠券先行屏蔽不要删除2020-6-3
             */ 
        //   setCoupon(coupon){
        //     if(!coupon || Object.keys(coupon).length==0){
        //         this.currCoupon = null;
        //     }else{
        //         if(this.orderInfo.totalPrice >= coupon.couponValue){
        //             this.orderInfo.fareAmount = (this.orderInfo.totalPrice*100 - coupon.couponValue*100)/100;
        //         }
        //         this.currCoupon = coupon;//设置默认优惠券
        //     }
        //     this.handleTotalPrice();
        //   },

        /**
             * 房间数选择
             * @param {Object} e
             */
        onRoomNumChange: function (e) {
            var that = this;
            this.roomNum = e;
            this.roomNumArr = e;
            this.orderInfo.roomsCount = e;
            this.orderInfo.returnCash = this.$route.query.returnCash * e;
            this.orderInfo.orderAmount = parseInt(this.$route.query.settlePrice * 100) * e / 100;
            this.orderInfo.fareAmount = parseInt(this.$route.query.totalPrice * 100) * e / 100;
            this.orderInfo.totalPrice= parseInt(this.$route.query.totalPrice * 100) * e / 100;
            that.setChangeGuarantee();
            //处理房间数变小 选择人员时出现的
            let flagNum = that.passengerArr.length - e;
            let absFlag = Math.abs(flagNum);
            if (flagNum > 0){
                for (let i = 0; i < flagNum; i++){
                    that.passengerArr.pop()
                }
            } else { //房间数变大
                //该段逻辑用来处理当选在乘客列表选择的乘客小于roomNum时，给相差的乘客数组里面丢空Name对象item; 解决安卓输出无效的bug
                for (let i=0 ;i < absFlag; i++){
                    that.passengerArr.push({name:''});
                }
            }
            that.roomNumWrapShow = false;
            // that.getUserValidCoupon();优惠券先行屏蔽不要删除2020-6-3
        },
        /**
             * 实时计算总价格
             */
        handleTotalPrice() {
            // let that=this
            // if(!!this.currCoupon){
            //     if(this.orderInfo.totalPrice >= this.currCoupon.couponValue){
            //         this.orderInfo.fareAmount = (this.orderInfo.totalPrice*100 - this.currCoupon.couponValue*100)/100;
            //     }
            // }else{
            this.orderInfo.fareAmount = this.orderInfo.totalPrice
            // }
                
        },
        /**
             * 选择证件类型
             * @param {Object} e
             */
        onIdTypeChange: function (e) {
            this.creditCard.idType = e;
        },
        /**
             * 时间选择
             * @param {Object} e
             */
        choseDay: function (e) {
            let that = this;
            if (this.showCalendar) {
                e.length<10 && (e+='/01');//暂时解决ios兼容问题，后续需要修改
                var curMonth = new Date(new Date(parseInt(that.$route.query.outDate)).getFullYear(), new Date(parseInt(that.$route.query.outDate)).getMonth()+1, 1);
                if (curMonth.getTime() > new Date(e).getTime()) {
                    hotelHandler.showToast('只接受有效期为离店日期月份之后的信用卡');
                    return;
                }
                this.showCalendar = false;
                this.expiration = new Date(e).format('yyyy/MM');
            }
        },
        /**
             * 数据提交时的验证
             */
        validate: function () {
            if (!this.orderInfo.passengers) {
                hotelHandler.showToast('请填写入住人姓名');
                return false;
            }
            if (!!!(this.passengerArr[0] || {}).name) {
                hotelHandler.showToast('请填写入住人姓名');
                return false;
            }
            if (this.passengerArr.length>0){
                for (let i=0;i<this.passengerArr.length;i++){
                    if (!this.passengerArr[i].name){
                        hotelHandler.showToast('请填写入住人姓名');
                        return false;
                    } else if (!(this.checkHotelUserName(this.passengerArr[i].name).flag)){
                        hotelHandler.showToast(this.checkHotelUserName(this.passengerArr[i].name).msg);
                        return false;
                    } else if (this.needIdNo && !hotelHandler.isCardNo(this.passengerArr[i].hotelIdCardNo)){
                        hotelHandler.showToast('请填写正确证件号');
                        return false;
                    }
                }
            }
            if (!this.orderInfo.contactMobile) {
                hotelHandler.showToast('请填写联系人手机号');
                return false;
            }
            let tempNobile = this.orderInfo.contactMobile.replace(/\s*/g,"");
            if (SnTravel.functional.ISDECORATE && this.focusNum == 0){
                tempNobile = this.contactMobileCopy;
            }
            if (!hotelHandler.isMobile(tempNobile)) { //去除空格
                hotelHandler.showToast('请填写正确手机号码');
                return false;
            }
            //需要报销凭证时校验发票title
            if (this.showReim) {
                if (!!!this.reimDetail.titleId || this.reimDetail.titleId == ''){
                    hotelHandler.showToast('请选择发票抬头');
                    return false
                }
            }  
            return true;
        },
        /**
             * 校验酒店姓名 2-15个汉字
             */
        checkHotelUserName:function(name){
            let res = {flag:true,msg:''};
            //黑名单判断
            let blackNames = ["test", "miss.", "mr.", "mrs.", "ms.","miss", "mr", "mrs", "ms", "Miss","先生","小姐","女士","张三","李四","王五","测试"];
            let leng = blackNames.length;
            for (let i=0;i<leng;i++){
                if (blackNames[i] == name){
                    res.flag = false;
                    res.msg = '入住人姓名不能使用“'+blackNames[i]+'”';
                    return res;
                    // break;
                }
            }
            //判断是否包含空格
            if (0 <=name.indexOf(" ") && /.*[\u4e00-\u9fa5]+.*$/.test(name)){
                res.flag = false;
                res.msg = '入住人姓名不能包含空格';
                return res;
            }
            //判断是否包含空格
            if (0 <=name.indexOf(" ") && !(/.*[\u4e00-\u9fa5]+.*$/.test(name))){
                res.flag = false;
                res.msg = '入住人姓名不能包含空格，英文姓和名请用“/”隔开';
                return res;
            }            
            //含有中文并且不全是中文
            if (/.*[\u4e00-\u9fa5]+.*$/.test(name) && !(/^[\u4e00-\u9fa5]+$/.test(name))){
                res.flag = false;
                res.msg = '中文姓名“'+name+'”中不能包含非中文字符';
                return res;
            }
            //英文姓名中不能包含特殊字符但必须包含/，/不能为首尾且不能不能连续
            if (!(/.*[\u4e00-\u9fa5]+.*$/.test(name)) && (!(/^[a-zA-Z]+[a-zA-Z\/]+[a-zA-Z]+$/.test(name)) || name.indexOf('//') > -1 || name.indexOf('/') == -1) ){
                res.flag = false;
                res.msg = '姓名“'+name+'”中不能包含数字、特殊字符，英文姓和名请用“/”隔开';
                return res;
            }
            return res;
        },
        /**
             * 下单
             */
        async createOrder() {
            var that = this;
            that.GetSpecial();
            if (that.showLoading) {
                return;
            }
            this.orderInfo.companyName = hotelHandler.companyName;
            this.orderInfo.userName = hotelHandler.userName;
            this.orderInfo.channelName = hotelHandler.channelName;
            this.orderInfo.contactMobile = this.orderInfo.contactMobile.replace(/\s*/g,"");//去除电话中间的空格
            this.orderInfo.specialPermissionInfos = that.specialPermissionInfos;
            this.orderInfo.providerType = that.$route.query.providerType;
            this.orderInfo.channelId = hotelHandler.channelId;
            if ('' != this.tripNo && that.useTypeConfig.isPublic(that.$route.query.useType, 1)) {
                this.orderInfo.tripNo = this.tripNo;
            }
            this.orderInfo.useType = that.$route.query.useType || that.useTypeConfig.default();
            this.orderInfo.guarantee = this.guarantee;
            this.orderInfo.latestTime = (this.guarantee ? this.guaranteeRule.endTime : this.guaranteeRule.startTime) ||
                '06:00';
            //根据房间数确定入住人数量
            this.passengerArr = this.passengerArr.slice(0, that.roomNum);
            //入住人
            this.orderInfo.passengers = this.passengerArr.map(item => {
                let psg = {
                    passengerId: item.passengerId || '',
                    name: item.name,
                    idCardNo: item.hotelIdCardNo
                };
                if (!!item.passengerUserId){
                    psg['userId']=item.passengerUserId;
                } if (!!item.thirdUserId){
                    psg['thirdUserId']=item.thirdUserId;
                }
                return psg;
            });
            this.orderInfo.contactName = (this.passengerArr[0] || {}).name;
            //预订城市
            this.orderInfo.city = this.$route.query.cityName;
            this.orderInfo.founderInfo = {
                "founderUaId": hotelHandler.userId,
                "founderCpyId": hotelHandler.companyId
            };
                
            if (this.validate()) {
                that.showLoading = true;
                that.showOrderProcess = true;
                setTimeout(() => {
                    that.handleProcess();
                }, 500)
                var outTime = setTimeout(function () { //接口超时未60s，如未超时，则页面15s后可重新提交
                    that.showLoading = false;
                    that.closeProcess();
                    that.processPrecent = 0;
                    hotelHandler.showToast("请求超时，请重试")
                }, 15000)
                let sendOrderInfo=Object.assign({},this.orderInfo)
                if (extendUtils.ISDECORATE && this.focusNum == 0){
                    sendOrderInfo.contactMobile = this.contactMobileCopy;
                }
                //惠券先行屏蔽不要删除2020-6-3
                sendOrderInfo.fareAmount=this.orderInfo.totalPrice 
                // if(!!this.currCoupon&&this.currCoupon.CouponId){ // 设置待传输优惠券数据
                //     let couponArrtem=[]
                //     couponArrtem.push(this.currCoupon.CouponId)
                //     sendOrderInfo.Coupons=couponArrtem
                // }
                //开发票与下单合并为一个接口xiaowc2019年12月24日
                if (that.showReim) {
                    sendOrderInfo.invoiceFlag = "1";
                    sendOrderInfo.title = that.reimDetail;
                    sendOrderInfo.invoiceContent = that.reimDetailOther.content + "";
                    if (that.isCheck) {
                        sendOrderInfo.invoiceRemarks = "注明酒店名和入离时间";
                    } else {
                        sendOrderInfo.invoiceRemarks = "";
                    }
                } else {
                    sendOrderInfo.invoiceFlag = "0";
                }
                //记住此次是打开了报销凭证
                hotelHandler.setStorage(hotelHandler.primaryKey + 'hotelIsShowReim', that.showReim);
                hotelHandler.createOrder(sendOrderInfo).then(function (res) {
                    that.showLoading = false;
                    clearTimeout(outTime)
                    if (0 == res.resultCode) {
                        let hrefType = that.inwxmini?'href':null;
                        that.orderNo = res.result.orderNo;
                        //判断是现付还是预付，如果是现付则不需要走到支付确认页面
                        that.processPrecent = 100;
                        if (0 == that.$route.query.paymentType) {
                            if (that.guarantee) {
                                hotelHandler.hotelOpenPage('order/index.html#/detail/hotel?orderNo=' + that.orderNo + '&pageFrom=advance' + '&needguarantee=' +that.guarantee,hrefType);
                            } else {
                                that.showSuccess = true;
                            }
                        } else {
                            hotelHandler.hotelOpenPage('order/index.html#/detail/hotel?orderNo=' + that.orderNo + '&pageFrom=advance',hrefType);
                        }
                    } else if (46100001 == res.resultCode) { //没有审批单
                        that.showNoApply = true;
                        that.closeProcess();
                        document.title = '提示';
                    } else {
                        hotelHandler.showToast(res.resultMessage);
                        that.closeProcess();
                    }
                }).catch((err)=>{
                    console.error(err);
                    that.closeProcess();
                    that.showLoading = false;
                    clearTimeout(outTime);
                    if (err.errorBisType == BisType.REDO){
                        that.createOrder();
                        return
                    }
                    if (46010014 == err.resultCode) { //供应商提示错误，提示联系客服
                        hotelHandler.showConfirm('酒店预订失败，请联系客服', that.gotoCustomerService, 2, '取消' , '联系客服', null, function () {}, true)
                    } 
                });
            }
        },
        //跳转到客服系统
        async gotoCustomerService(){  
            let url = await customerService.run(1, this.zcConfig(), 'product').catch(e=>{
                console.log(e)
            });
            window.open(url)
        },
        /********
         * 整合在线客服需要拼接的参数（用的在线客服事智齿科技）
         */
        zcConfig(){
            if (!!extendUtils.isPC()){
                return {};
            }
            let query = this.$route.query;
            let callBackUrl = `${location.origin}${location.pathname}#/detail?
            hid=${query.hid}&
            inDate=${query.inDate}&
            outDate=${query.outDate}&
            inDays=${query.inDays}&
            providerType=${query.providerType}&
            cityName=${query.cityName}&
            useType=PRIVATE&
            pageFrom=customerService`;
            return {
                card_title: `${this.hotelName} ${this.roomName} ${this.inDate}-${this.outDate}`, //标题（必传）
                card_url: encodeURIComponent(callBackUrl), //酒店链接地址（必传）
                card_desc: encodeURIComponent(`酒店id: ${query.hid}`), //商品信息的简述内容（选传）
                card_note: `城市：${query.cityName}`, //订单状态
                card_picture: encodeURIComponent(require('../../../../assets/img/hotel/hotel@2x.png')) //商品的缩略图（选传）（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败） 此处选择用base64的方式
            }
        },
        /**
             * 担保信息显示 e为true则显示，否则不显示
             * @param {Object} e
             */
        changeGuarantee: function (flag) {
            let that = this;
            // var startTime, endTime;
            if (!!that.guaranteeRule.startDate) {
                // startTime = new Date(that.guaranteeRule.startDate).getTime();
            }
            if (!!that.guaranteeRule.endDate) {
                // endTime = new Date(that.guaranteeRule.endDate).getTime();
            }
            //担保规则的有效期，目前没有用，暂时保留。目前艺龙的担保规则默认永远有效。
            // var inValidDate = (!!startTime && startTime <= that.inDate) && (!!endTime && endTime >= that.inDate);
            that.isGuaranteeShow = flag;
            that.guarantee = flag;
        },
        /**
             * 确认是否担保
             */
        setChangeGuarantee: function () {
            let that = this;
            if (!!that.guaranteeRule) {

                // var startTime, endTime;
                if (!!that.guaranteeRule.startDate) {
                    // startTime = new Date(that.guaranteeRule.startDate).getTime();
                }
                if (!!that.guaranteeRule.endDate) {
                    // endTime = new Date(that.guaranteeRule.endDate).getTime();
                }
                //担保规则的有效期，目前没有用，暂时保留。目前艺龙的担保规则默认永远有效。
                // var inValidDate = (!!startTime && startTime <= that.inDate) && (!!endTime && endTime >= that.inDate);

                if (that.guaranteeType == 0) {
                    that.guarantee = false; //信用卡UI
                    that.isShowEndTime = false; //最晚到店时间UI
                } else if (that.guaranteeType == 1) {
                    //1 即必须担保，不需要判断其他条件
                    that.guarantee = true;
                    that.isShowEndTime = false;
                } else if (that.guaranteeType == 2) {
                    //房量担保
                    if (0 < that.guaranteeRule.roomCount && that.roomNum > that.guaranteeRule.roomCount) {
                        that.guarantee = true;
                    } else {
                        that.guarantee = false;
                    }
                    that.isShowEndTime = false;
                } else if (that.guaranteeType == 3) {
                    //到店时间担保
                    that.isShowEndTime = true;
                    that.guarantee = true;
                    that.isGuaranteeShow = true; //最晚到店时间UI 选择担保的选项  
                    that.noNeedGuaranteeHint = "无需担保，房间保留至" + ((!that.guaranteeRule.isTomorrow ? '次日' : '') +
                    that.guaranteeRule.startTime) + "，超时订单可能被酒店取消";
                    that.needGuaranteeHint = "需要信用卡担保" + ((that.guaranteeRule.guaranteeAmountType == "firstNightCost") ?
                        ("首晚房费￥" + that.salePrice)
                        : ("全额房费￥" + that.orderInfo.fareAmount));
                } else if (that.guaranteeType == 4) {
                    //房量担保或到店时间担保,满足一个条件就需要担保
                    if (0 < that.guaranteeRule.roomCount && that.roomNum > that.guaranteeRule
                        .roomCount) { //如果房间数量达标，必须担保，不能选择时间了。
                        that.guarantee = true;
                        that.isShowEndTime = false;
                    } else { //房间数量不达标，可以自由选择入住时间，是否担保。
                    //到店时间担保
                        that.isShowEndTime = true;
                        that.guarantee = true;
                        that.isGuaranteeShow = true; //最晚到店时间UI 选择担保的选项
                        that.noNeedGuaranteeHint = "无需担保，房间保留至" + ((!that.guaranteeRule.isTomorrow ? '次日' : '') +
                        that.guaranteeRule.startTime) + "，超时订单可能被酒店取消";
                        that.needGuaranteeHint = "需要信用卡担保" + ((that.guaranteeRule.guaranteeAmountType == "firstNightCost") ?
                            ("首晚房费￥" + that.salePrice)
                            : ("全额房费￥" + that.orderInfo.fareAmount));
                    }
                } else {
                    //默认不显示
                    that.guarantee = false;
                    that.isShowEndTime = false;
                }
            }
        },
        /**
             * 显示时间组选择件
             * 该方法以弃用，SelectTimeWidget 时间选择弹窗 已改为使用H5弹窗
             */
        showCalendarDo: function () {
            // let that = this;
            // if (hotelHandler.isPC()) {
            //     let startTime = Date.parse(that.expiration);
            //     hotelHandler.SelectTimeWidget({
            //         timeId: 1,
            //         showModel: 4,
            //         startTime: startTime
            //     }).then(function (result) {
            //         if(!!result && !!result.startTime){
            //             var curMonth = new Date(new Date(parseInt(that.$route.query.outDate)).getFullYear(), new Date(parseInt(that.$route.query.outDate)).getMonth()+1, 1);
            //             if (curMonth.getTime() > result.startTime) {
            //                 hotelHandler.showToast('只接受有效期为离店日期月份之后的信用卡');
            //                 return;
            //             }else {
            //                 that.expiration = new Date(result.startTime).format('yyyy/MM');
            //             }
            //         }
            //     });
            // } else {
            //     setTimeout(function () {
            //         that.showCalendar = true;
            //         that.delayShow = 0;
            //     }, that.delayShow);
            // }

        },
        /**
             * 选择联系人手机号
             */
        choosePhone: function () {
            let that = this;
            sinosdk.sino.contacts([], 0).then((data) => {
                if (0 < data.length) {
                    that.focusNum++;
                    that.orderInfo.contactMobile = data[0].uPhone;
                }
            });
        },
        /**
             * 显示房型产品信息
             */
        showHotelRoomInfo() {
            let that = this;
            that.roomInfoShow = true;

        },
        /**
             * 重置下单进度条
             */
        closeProcess() {
            const that = this;
            that.processPrecent = 0;
            that.showOrderProcess = false;
        },
        /**
             * 启动或停止下单进度条
             */
        handleProcess() {
            const that = this;
            let interval = setInterval(() => {
                if (that.processPrecent < 99) {
                    that.processPrecent++;
                } else {
                    clearInterval(interval);
                }
            }, 100)
        },
        /**
                 * 获取免审批信息
                 */ 
        GetSpecial(){
            // let _this = this;
            // hotelHandler.GetSpecialFunction({uaid:0,cpyId:0}).then(function (data) {    
            //     if(data.ret == 0){
            //         _this.specialPermissionInfos = data.responseData.specialPermissionInfos;
            //     }
            // }); 
        },
        //动态加载发票的js组件
        loadInvoiceComp(){
            let that = this;
            hotelHandler.loadJs('swpInvoice','invoice',()=>{
                that.showInvoiceComp = true;
            })
        },
        //动态加载发票的js组件
        loadPsgComp(){
            let that = this;
            hotelHandler.loadJs('swpPsg','passenger',()=>{
                that.showPsgCom = true;
            })
        },
        //动态加载js（包括发票/乘客）
        dynamicLoadingJs(){
            let that = this;
            //动态加载发票的js组件
            that.loadInvoiceComp();
            //动态记载乘客的js组件
            that.loadPsgComp();
        },
                
        /**
             * 打开发票
             */
        showInvoice() {
            const that = this;
            if (!that.showInvoiceComp){
                that.popLoading = true;
                setTimeout(()=>{
                    that.showInvoice();
                },100);
                return;
            }
            that.popLoading = false;
            that.showReceiptEdit = true;
            document.title = '发票抬头';
        },
            
        //因公预定酒店，编辑订单页没有自动勾选报销凭证
        judgePblic(){
            const that = this;
            if (!!hotelHandler.getStorage(hotelHandler.primaryKey + 'hotelIsShowReim')){
                that.showReim = hotelHandler.getStorage(hotelHandler.primaryKey + 'hotelIsShowReim') == 'true';
                return;
            }
            if (1 == that.orderInfo.paymentType && 'BusinessTrip' == that.invoiceMode && that.useTypeConfig.isPublic(that.$route.query.useType)){
                that.showReim = true;
            } else {
                that.showReim = false;
            }
        },
        //获取抹零优惠金额
        getDiscount(){
            let _this = this;
            return parseInt(parseInt(_this.orderInfo.settlePrice*100)*_this.orderInfo.roomsCount-_this.orderInfo.totalPrice*100)/100;
        },

        //导入企业发票抬头
        async importInvoiceFun(){
            await this.$refs.invoiceCard.gotoImportInvoice('single');
        }, 
        //根据运维后台是否配置了企业发票抬头的地址url来判断，导入企业发票抬头按钮是否显示 
        checkImportInvoiceBtn(flag){
            this.showImportInvoice = flag;
        }
    }
}
</script>
<style lang="less">
  @import './order.less';
  @font-color-blue: #478aee;
  @font-color-red: #FF0000;
  @font-color-orange: #FF6600;
  @font-color-success: #008000;
  @font-color-gray: #999999;

</style>
<style lang="less">
  .progressDia {
    .weui-dialog {
      width: 86%;
      max-width: 460px;
      border-radius: 16px; 
    }
  }
  .group {
    background: #999;

    .vux-x-switch {
      padding: 0
    }

    .weui-switch:checked {
      border-color: #478aee;
      background-color: #478aee;
    }
    .weui-switch:before{
        width: 40px;
        height: 20px;
    }
    .weui-switch {
      width: 42px;
      height: 22px;
    }

    .weui-switch::after {
      width: 19px;
      height: 19px;
    }

    .vux-no-group-title {
      padding: 0 !important;
    }

    .weui-cell {
      padding: 10px 0 !important;
      ;
    }

    .weui-cells {
      margin: 0;
      padding: 0;
    }

    .weui-cells:before {
      border: 0 !important;
    }

    .weui-cells:after {
      border: 0 !important;
    }
  }

  .v-transfer-dom .vux-popup-dialog {
    z-index: 503;
  }

  .reimDetail {
    .vux-no-group-title {
      padding: 0 !important;
    }

    .weui-cell {
      padding: 10px 0 !important;
      ;
    }
  }

</style>
