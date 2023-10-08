<template>
    <div class="page-orderConfirm">
        <div class="order-form">
            <div class="top">
                <div class="content">
                    <div class="flight-info cursorp" @click='showFlightDetail=true'>
                        <div class='left-content'>
                            <div class="time">
                                <airlogo class="logo" :airCode="flightDetail.airCompanyCode" />
                                <span>{{startDate}}</span>
                                <span>{{flightDetail.departTime}}</span>
                            </div>
                            <div class="no-wrap airport">
                                {{flightDetail.departAirportName}}{{flightDetail.departAirportTerminal}}-{{flightDetail.arriveAirportName}}{{flightDetail.arriveAirportTerminal}}
                            </div>
                        </div>
                        <Icon type="icon_common_rightarrow" class="icon icon-btn" size='.24' />
                    </div>
                    <div class="cabin-info">
                        <div class="cabin">
                            <span class="label">{{cabins.cabinName}}</span>
                            <span class="amount num-font"><span class='rmb'>&yen;</span>{{cabins.fare}}</span>
                            <span v-if="priceKind" class="price_kind">实惠</span>
                        </div>
                        <div class="detail">
                            <span class="label">机建+燃油</span>
                            <span class='rmb'>&yen;</span>{{flightDetail.tax+flightDetail.oil}}
                        </div>
                        <!--<div class="explanation cursorp" @click="showDescription=true">-->
                        <!--退改签 行李额-->
                        <!--</div>-->
                    </div>
                    <div class="notice-info" v-if="approachDepartTime">
                        此航班临近起飞，请确保您有足够时间完成值机托运、安检及登机后再预订
                    </div>
                </div>
            </div>
            <section class="customer-list">
                <div class="inline-loading" v-if='userLoading'>
                    <SnLoading :spinning="userLoading" :turn="true" tip="正在获取用户数据" />
                </div>
                <template v-else>
                    <!-- 选择乘客box组件开始 -->
                    <swp-psg-choose class="psg-choose" v-if="showPsgCom" title="请选择乘机人" :psgList="psgList"
                        :customerList="customerList" @addCustomer='addCustomer' @cliPsgItem='cliPsgItem'>
                    </swp-psg-choose>
                    <div size='base'>
                        <div class="customer-item" v-for="(customer,index) in customerList" :key="index">
                            <Icon type="icon_common_delete" class="icon-delete icon-btn cursorp" size='.34'
                                @click.native="deleteCustomer(index)" />
                            <div class="customer-info cursorp" @click="editCustomer(customer)">
                                <!--判断第一个证件类型需要显示的名称，现阶段只有护照需要显示FirstName与LastName，其他均为Name-->
                                <div class="name">
                                    <template v-if='showSurname(customer.idCode)'>
                                        <span>{{customer.firstName}}</span>/<span>{{customer.lastName}}</span>
                                    </template>
                                    <template v-else>
                                        <span>{{customer.name}}</span>
                                    </template>
                                </div>
                                <div v-if="judgeEmpty(customer)" class="textTips">用户信息不完善，请补充</div>
                                <div v-else class="detail">
                                    {{customer.idType}}：{{desensitization(customer.idNum)}}
                                </div>
                                <Icon type="icon_common_rightarrow" size='.24' class="icon-right icon-btn" />
                            </div>
                        </div>
                        <div class="line" v-if="customerList && customerList.length>0"></div>
                    </div>
                </template>
                <div class="connector">
                    <div class="content">
                        <div class="title">联系电话</div>
                        <div class="content">
                            +86
                            <input class="contactNum" type="text" maxlength="13" :placeholder="contactNumPlaceHolder"
                                v-model="contactNum" onclick="return false" @focus="focusFun"/>
                        </div>
                        <Icon v-if="!inwxmini" type="btn_conmmon_phone" class="icon icon-btn cursorp" size='.4'
                            @click="changeConnector" />
                    </div>
                </div>
            </section>
            <section v-if="priceKind" class="price_kind_tips_section">
                <div class="price_kind_tips">"实惠"价格仅适用于年龄18岁（不含）至65岁（含）乘机人</div>
            </section>
            <section>
                <SnLoading class="inline-loading" v-if="insuranceLoading" :spinning="insuranceLoading" :turn="true"
                    tip="保险数据加载中" />
                <div v-else>
                    <flightInsurances v-model="choosedInsurance" :insuranceList="insuranceList"
                        :customerList="customerList" @showInsuranceDo="showInsurance"
                        @chooseInsuranceUser="chooseInsuranceUser"></flightInsurances>
                </div>
            </section>
            <section>
                <div class="reimburse">
                    <div class="switch">
                        <div class="label">
                            <span>报销凭证</span>
                            <div class="tip">起飞后30天内可补开报销凭证</div>
                        </div>
                        <SnSwitch class='cursorp' slot="right-icon" v-model="showReim" />
                    </div>
                    <template v-if='showReim'>
                        <ul>
                            <li>
                                <div class="title">
                                    凭证类型
                                    <Icon type="icon_common_prompt" size='.32' class="icon icon-btn"
                                        @click.native="openReimburseType" />
                                </div>
                                <div class="content">
                                    行程单、保险发票、退票手续费收据将一并快递邮寄；快递费用将开具电子发票，请在订单详情中查看
                                </div>
                            </li>
                            <li>
                                <div class="title">配送方式</div>
                                <div class="content">
                                    快递<span class="amount"> <span class='rmb'>&yen;</span>{{expressFee}}</span>
                                </div>
                            </li>
                            <li class="arrow-right">
                                <div class="title">发票抬头</div>
                                <div class="content cursorp" @click='showInvoice()'>
                                    <div class="invoice_content">
                                        <div class="text" v-if='!!reimDetail.name'>
                                            <div> {{reimDetail.name}}</div>
                                            <div> {{reimDetail.tax}}</div>
                                        </div>
                                        <div class='textTips' v-else>
                                            添加或选择发票抬头
                                        </div>
                                        <Icon type="icon_common_rightarrow" size='.24' class="icon-right icon-btn" />

                                        <!-- 定位的导入企业发票抬头的icon图标 -->
                                        <div v-if="isBizMate() && showImportInvoice" @click.stop="importInvoiceFun" class="importInvoice"><icon type="svg_icon_invoice_import" size='.4' /></div>
                                    </div>
                                </div>
                            </li>
                            <li class="arrow-right">
                                <div class="title">
                                    配送地址
                                </div>
                                <div class="content cursorp" @click='showAddress()'>
                                    <div class="text" v-if='!!addressDetail.name'>
                                        <div> {{addressDetail.name}} &nbsp;{{maskAddressPhone(addressDetail.phone)}}</div>
                                        <div><span class="text">{{addressDetail.area}}{{addressDetail.address}}</span>
                                        </div>
                                    </div>
                                    <div class='textTips' v-else>
                                        添加或选择配送地址
                                    </div>
                                    <Icon type="icon_common_rightarrow" size='.24' class="icon-right icon-btn" />
                                </div>
                            </li>
                        </ul>
                    </template>
                </div>
            </section>
            <div class="reimbursementTips" v-if="publicTiantian">*{{caution}}</div>
            
            <!-- <section> -->
                <!--优惠券停用-->
                <!-- <CouponItem v-if="customerList.length>0" ref='couponItem' :productType='1' :couponList='cabins.canUseCoupon'
                        @setCoupon='setCoupon'/> -->
            <!-- </section> -->

            <!-- 用户下单协议的dom部分 -->
            <div class="protocols_part">
                <protocols ref="protocolComp" @initAppBackFun="initAppBackFun"/>
            </div>
        </div>

        <!-- 价格明细 -->
        <div v-transfer-dom>
            <popup v-model="showDetailDom" class='show-detail-dom' position="bottom" is-transparent>
                <div class="priceDetail" v-if="showDetailDom">
                    <!-- <div class="subtitle">{{flightDetail.airCompanyName}}{{flightDetail.flightNo}}</div> -->
                    <div class="detailList">
                        <span class="name">机票价</span>
                        <span class="price">
                            <span><span class='rmb'>&yen;</span>{{cabins.fare}}</span>
                            <span>
                                x {{customerList.length}}
                            </span>
                        </span>
                    </div>
                    <div class="detailList">
                        <span class="name">燃油费</span>
                        <span class="price">
                            <span><span class='rmb'>&yen;</span>{{flightDetail.oil}}</span>
                            x{{customerList.length}}
                        </span>
                    </div>
                    <div class="detailList">
                        <span class="name">机建费</span>
                        <span class="price">
                            <span><span class='rmb'>&yen;</span>{{flightDetail.tax}}</span>
                            x{{customerList.length}}
                        </span>
                    </div>
                    <div class="detailList" v-if='showReim'>
                        <span class="name">凭证运费</span>
                        <span class="price">
                            <span><span class='rmb'>&yen;</span>{{expressFee}}</span>
                        </span>
                    </div>
                    <div class="detailList" v-for="(item,index) in choosedInsurance" :key="index">
                        <span
                            class="name">{{insuranceList[indexOfArr(item.productNo, insuranceList,'productNo')].productShortName}}</span>
                        <span class="price">
                            <span><span class='rmb'>&yen;</span>
                                {{insuranceList[indexOfArr(item.productNo, insuranceList,'productNo')].farePrice}}</span>
                            x{{item.insuredInfos.length}}
                        </span>
                    </div>
                    <!--优惠券停用-->
                    <!-- <div class="detailList" v-if="!!currCoupon && customerList.length>0">
                        <span class="name">优惠券</span>
                        <span class="price">
                            <span class='coupon-price'>-<span class='rmb'>&yen;</span>{{currCoupon.CouponValue}}</span>
                        </span>
                    </div> -->
                </div>
            </popup>
        </div>
        <!-- 底部信息 -->
        <div v-transfer-dom>
            <div class="bottomBar" v-if="isOriginHei || isPC">
                <div class="price-info">
                    <div>
                        总额：
                        <div class="price num-font"><span class='rmb'>&yen;</span>{{totalPrice}}</div>
                        <span class="split"></span>
                        共{{customerList.length}}人
                    </div>
                    <div class="showDetail cursorp" :class="{'arrow-close': showDetailDom}"
                        @click="showDetailDom=!showDetailDom">
                        明细

                        <div :rotate="{'test': showDetailDom}">
                            <Icon type="icon_common_uparrow" size='.2' class="icon icon-btn" />
                        </div>
                    </div>
                </div>
                <div class="submit linear-gra-waring normal-btn cursorp" @click="confirmOrder">
                    <span>提交订单</span>
                </div>
            </div>
        </div>
        <!--编辑发票抬头-->
        <div v-transfer-dom>
            <popup v-model="showReceiptEdit" height="100%" width="100%" class="editDetailPop">
                <swp-invoice-card 
                    v-if="showInvoiceComp"  
                    v-model="reimDetail" 
                    @closeInvoiceList="showReceiptEdit=false"
                    @showImportInvoiceFun="checkImportInvoiceBtn"
                    ref='invoiceCard'>
                </swp-invoice-card>
            </popup>
        </div>
        <!-- loading -->
        <div v-transfer-dom>
            <loading :show="popLoading" text="加载中"></loading>
        </div>
        <!--编辑配送地址-->
        <div v-transfer-dom>
            <popup v-model="showAddressEdit" class="editDetailPop" height="100%" width="100%">
                <swp-address v-if="showAddressComp" @update="updateAddress" v-model="addressDetail"
                    @closeAddressList="closeAddressList" ref='addressCard'></swp-address>
            </popup>
        </div>
        <!--添加旅客信息-->
        <div v-transfer-dom>
            <popup v-model="showPsg" height="100%" width="100%" position="right" :show-mask="true" hide-on-blur
                class="psgPanel">
                <div>
                    <swp-psg-list v-if="showPsgCom" :maxLength='9' :showPsgFlag="showPsg" v-model='customerList'
                        :errorIDCodeList="errorIDCodeList" :addPsgFlag='true' ref='psg' :errorMsg="errorMsg"
                        psgType="flight" @TchatLoginUserInfo="TchatLoginUserInfoFun" @SLloginUserInfo="SLloginUserInfoFun" @closePsgList="closePsgListFun"
                        @psgFunc='psgFunc'>
                    </swp-psg-list>
                </div>
            </popup>
        </div>
        <!-- 航班详情 -->
        <div v-transfer-dom class="show-flight-detail" v-show="showFlightDetail">
            <div class="flightDetailMask" @click="showFlightDetail=!showFlightDetail"></div>
            <div class="flightDetailDialog">
                <div class="flightDetail">
                    <div class="header">
                        <div class="date"><span>{{startDate}}</span></div>
                    </div>
                    <div class="main">
                        <div class="plane">
                            <airlogo class='logo' :airCode="flightDetail.airCompanyCode" />
                            {{flightDetail.airCompanyName}}{{flightDetail.flightNo}}
                            |
                            {{flightDetail.planeType}}
                            &nbsp;{{flightDetail.hasMeal ? '有餐饮' : '无餐饮'}}
                        </div>
                        <div v-if='flightDetail.share' class="share">
                            <img src="~assets/img/flightList/travelBy-gray.png" style='width: .2rem;height: .2rem;'>
                            <span>实际承运&nbsp;{{flightDetail.shareAirlineName}}{{flightDetail.shareFlightNo}}</span>
                        </div>
                        <div class="trip">
                            <div class="station">
                                <span class="time">{{flightDetail.departTime}}</span>
                                <span
                                    class="airport">{{flightDetail.departAirportName}}{{flightDetail.departAirportTerminal}}</span>
                            </div>
                            <div class="arrow">
                                <span class="goDate">约{{flightDetail.duration}}</span>
                                <span class="icon"></span>
                                <div class="through" v-if='flightDetail.stopNum>0'>
                                    <div class="detail">经停
                                        {{flightDetail.stopItems[0].stopCityName}}{{flightDetail.stopItems.length>1?(','+flightDetail.stopItems[1].stopCityName):''}}
                                    </div>
                                </div>
                            </div>
                            <div class="station">
                                <span class="time">{{flightDetail.arriveTime}}</span>
                                <span
                                    class="airport">{{flightDetail.arriveAirportName}}{{flightDetail.arriveAirportTerminal}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="footer">

                    </div>
                </div>
            </div>
        </div>
        <!-- 下单状态进度 -->
        <div v-transfer-dom class="progressDia">
            <orderProcess v-model="showOrderProcess" :flightDetail="flightDetail" :processPrecent="processPrecent"
                :psgList="psgNameArr" @closeProcess="closeProcess" />
        </div>
        <!--编辑旅客信息-->
        <div v-transfer-dom>
            <popup v-model="showEditPsg" class="psgPanel" height="100%" width="100%" position="right" :show-mask="true"
                hide-on-blur>
                <div v-if="showEditPsg">
                    <swp-psg-edit v-if="showPsgCom" ref="EditPsgItem" psgType="flight" :Passenger='psgInfo'
                        @deledPsg="deledPsgFun" @editedPsg="editedPsgFun">
                    </swp-psg-edit>
                </div>
            </popup>
        </div>
        <!-- 保险说明 -->
        <div v-transfer-dom>
            <popup v-model="showInsurancePop" height="100%" width="100%" position="right" class=insurancePopWrap>
                <flightInsuranceDetail v-model="showInsurancePop" :insuranceDetail="insuranceDetail">
                </flightInsuranceDetail>
            </popup>
        </div>
        <!--无审批单-->
        <div v-transfer-dom>
            <popup v-model="showNoApply" @on-cancel="showNoApply=false" height="100%" width="100%" position="right"
                class="confirmPay">
                <apply></apply>
            </popup>
        </div>
        <div v-transferDom>
            <Popup v-model="showDescription" position="right" height="100%" width="100%">
                <description v-if="showDescription" @closeDesc="showDescription=false" :cabinRules="cabinRules"
                    :cabin="cabins" :providerName="cabins.providerShortName" :bodyLock="showDescription"></description>
            </Popup>
        </div>
        <!--选择保险购买人员-->
        <div v-transfer-dom>
            <popup v-model="showInsurancesUser" is-transparent>
                <flightInsurancesUser v-model="insurancesUser" @input="setInsuranceUser"
                    @cloose="showInsurancesUser=false" :customerList="customerList"
                    :showInsurancesUser="showInsurancesUser"
                    :insurance="insuranceList[indexOfArr(editInsurancesUseProductNo, insuranceList,'productNo')]">
                </flightInsurancesUser>
            </popup>
        </div>
    </div>
</template>

<script>
import extendUtils from 'flightCommon/extend.js';
import protocols from 'components/protocols/comp/protocols.vue'
import requestHandler from 'flightCommon/requestHandler.js';
import { TransferDom, Popup, Loading } from 'vux';
import description from 'components/flightticketrule/description';
import orderProcess from 'flightComp/orderProcess/orderProcess.vue';
import flightInsuranceDetail from 'flightComp/flightInsuranceDetail.vue';
import flightInsurances from 'flightComp/flightInsurances.vue';
import flightInsurancesUser from 'flightComp/flightInsurancesUser.vue';
import apply from 'components/apply/gotoApplyTravel.vue';
// import CouponItem from 'components/coupon/couponItem';//停用
import SnLoading from "components/loading";
import SnSwitch from "components/switch";
import Icon from 'components/icon';
import airlogo from 'components/airlogo/airlogo.vue'
let MASKING = SnUtils.DataMasking
export default {
    mixins: [extendUtils.mixin.tChatEventMixin],
    directives: {
        TransferDom
    },
    components: {
        SnSwitch,
        orderProcess,
        // CouponItem,
        Popup,
        Loading,
        Icon,
        SnLoading,
        flightInsuranceDetail,
        flightInsurances,
        airlogo,
        apply,
        description,
        flightInsurancesUser,
        protocols
    },
    data: function () {
        let that = this;
        let title = this.$route.query.title || '编辑订单';
        let managerData = extendUtils.stateManager.setData([
            {
                name: 'showDescription'
            },
            //人员编辑界面
            {
                name: 'showEditPsg',
                show: {
                    callback: () => {
                        document.getElementsByTagName('html')[0].classList.add('body-noscroll')
                    }
                },
                hide: {
                    title: title,
                    callback() {
                        that.$refs.EditPsgItem.idCode = 0;
                        document.getElementsByTagName('html')[0].classList.remove('body-noscroll')
                    }
                }
            },
            //人员添加界面
            //以下两个callback 解决机票编辑订单页面,新增多个乘客时选择乘客后不确认再直接返回,选择的人员不变
            {
                name: 'showPsg',
                show: {
                    callback: () => {
                        document.getElementsByTagName('html')[0].classList.add('body-noscroll')
                    }
                },
                hide: {
                    title: title,
                    callback: () => {
                        document.getElementsByTagName('html')[0].classList.remove('body-noscroll')
                    }
                }
            },
            //没有审批单
            {
                name: 'showNoApply',
                show: {
                    callback: () => {
                        document.getElementsByTagName('html')[0].classList.add('body-noscroll')
                    }
                },
                hide: {
                    title: title,
                    callback: () => {
                        document.getElementsByTagName('html')[0].classList.remove('body-noscroll')
                    }
                }
            },
            //发票抬头
            {
                name: 'showReceiptEdit',
                show: {
                    callback: () => {
                        document.getElementsByTagName('html')[0].classList.add('body-noscroll')
                    }
                },
                hide: {
                    title: title,
                    callback: () => {
                        document.getElementsByTagName('html')[0].classList.remove('body-noscroll')
                    }
                }
            },
            {
                name: 'showAddressEdit',
                show: {
                    callback: () => {
                        document.getElementsByTagName('html')[0].classList.add('body-noscroll')
                    }
                },
                hide: {
                    title: title,
                    callback: () => {
                        document.getElementsByTagName('html')[0].classList.remove('body-noscroll')
                    }
                }
            },
            {
                name: 'showInsurancePop',
                show: {
                    title: '保险详情',
                    callback: () => {
                        document.getElementsByTagName('html')[0].classList.add('body-noscroll')
                    }
                },
                hide: {
                    title: title,
                    callback: () => {
                        document.getElementsByTagName('html')[0].classList.remove('body-noscroll')
                    }
                }
            },
            {
                name: 'showInsurancesUser'
            }
        ], this);
        return Object.assign(managerData, {
            userLoading: true,
            // currCoupon: null,//当前选择的优惠券
            psgInfo: {},
            showFlightDetail: false, //航班详情
            processPrecent: 0,
            expressFee: 15,
            addressDetail: {},
            reimDetail: {},
            showReim: false, //报销凭证
            showOrderProcess: false, //下单进度
            showDetailDom: false, //价格明细
            isSubmiting: false,
            cabins: '',
            flightDetail: '',
            contactNum: '',
            contactNumCopy: '',
            contactNumPlaceHolder: '请填写联系人手机',//input的placeholder必须用变量传，否则在ios上可能出现placeholder和value样式重叠的情况
            contactName: '',
            customerList: [],
            startDate: '',
            endDate: '',
            farePrice: 0,
            orderNo: 0, //订单num
            firstName: '',
            lastName: '',
            isOriginHei: true,
            screenHeight: document.documentElement.clientHeight,
            originHeight: document.documentElement.clientHeight,
            insurancePrice: 0,
            insuranceDetail: {},//保险详情字段
            insuranceList: [],//保险列表
            choosedInsurance: [],//所选保险的列表
            insuranceLoading: false,//保险数据加载中
            specialPermissionInfos: null,//免审批信息
            errorMsg: '当前行程不支持使用该证件，请更换证件',
            invoiceContent: '*现代服务*服务费',
            telValidated: false,//用来是否过过滤掉showTelTips弹窗的
            psgList: [],//请选择乘机人的乘客列表，最多显示7个
            cabinRules: this.$route.query.cabinGuestRules && JSON.parse(this.$route.query.cabinGuestRules),
            isPC: extendUtils.isPC(),//是否是pc端
            showInvoiceComp: false, //是否显示invoice组件
            showPsgCom: false, //是否显示passenger组件
            showAddressComp: false, //是否显示address组件
            popLoading: false,
            editInsurancesUseProductNo: '',//编辑保险乘客的保险产品id
            insurancesUser: [],//选择的保险乘客数据
            publicTiantian: false,//因公购买天天游
            caution: '',//提示内容
            errorIDCodeList: [], //不允许购买机票的证件类型
            showImportInvoice: false,//是否显示导入企业发票抬头的按钮 false = 不显示 
            focusNum:0,
            inwxmini:extendUtils.MINIPROGRAM_CONFIG.IN_MINIPROGRAM || false,//在微信小程序内
            priceKind: false //是否显示实惠标签
        });
    },
    created: async function () {
        const that = this;
            
        await extendUtils.authInterceptor();
        that.showReim = extendUtils.getStorage(requestHandler.primaryKey + 'flightIsShowReim') == 'true';
           
        that.$emit('showOff', true);
        //注册并监听t信返回和刷新事件
        // that.initAppBackFun();
        if ((await extendUtils.useTypeConfig()).isPublic(that.$route.query.useType)) {
            that.showReim = true;
        }
        //是否提示如需报销，请务必在机场自行打印行程单
        if (!!JSON.parse(extendUtils.getStorage('cabins')).caution) {
            that.publicTiantian = true;
            that.caution = JSON.parse(extendUtils.getStorage('cabins')).caution
        }
        that.getPageInitData();
        this.initPriceKind();
    },
    computed: {
        
        psgNameArr() {
            let result = []
            this.customerList.forEach(psg => {
                result.push(this.showSurname(psg.idCode) ? (psg.firstName + ' ' + psg.lastName) : (psg.name || ''));
            })
            return result
        },
        /**
             * 是否临近起飞
             */
        approachDepartTime() {
            if (!this.flightDetail) {
                return false;
            }
            try {
                let today = new Date().getTime();
                let flightTime = new Date(this.flightDetail.departDate + ' ' + this.flightDetail.departTime).getTime();
                let diff = flightTime - today;
                if (diff > 0 && diff < 60 * 60 * 1000) {
                    return true;
                }
            } catch (e) {
                console.error(e)
            }
            return false;
        },

        /**
             * 订单总价
             */
        totalPrice() {
            let totalPrice = 0;
            const length = this.customerList.length;
            //乘客没加载出来的时候，不计算
            if (length > 0) {
                const flightDetail = this.flightDetail;
                //票价、基建、燃油
                totalPrice = (Number(this.farePrice) + Number(flightDetail.tax) + Number(flightDetail.oil)) * length;
                //保险总价
                if (this.choosedInsurance.length > 0) {
                    totalPrice += Number(this.getInsurancePrice);
                }
                // //优惠券减免
                // if (!!this.currCoupon && totalPrice > this.currCoupon.CouponValue) {
                //     totalPrice -= this.currCoupon.CouponValue;
                // }
            }
            //加上快递费
            !!this.showReim && (totalPrice += parseFloat(this.expressFee));
            return totalPrice;
        },
        /**
             * 获取保险总价
             */
        getInsurancePrice() {
            const _this = this;
            let totalPrice = 0;
            _this.choosedInsurance.forEach((value) => {
                let index = _this.indexOfArr(value.productNo, _this.insuranceList, 'productNo');
                totalPrice += _this.insuranceList[index].farePrice * value.insuredInfos.length;
            });
            return totalPrice;
        }
    },
    mounted: function () {
        const that = this;
        //动态加载js
        that.dynamicLoadingJs();
        that.autoCloseLoading();
        that.getFlightBookPara();
        that.resetTitle();
        sinosdk.sino.overwriteWindowopen();//通知app允许在异步回调中打开一个新窗口
        window.onresize = function () {
            return (function () {
                that.screenHeight = document.documentElement.clientHeight;
            })()
        }
    },
    watch: {
        contactNum: {
            handler(newVal) {
                if (SnTravel.functional.ISDECORATE && this.focusNum != 0){
                    this.telValidated = false;
                    let value = newVal.replace(/\D/g, '').substr(0, 11) // 不允许输入非数字字符，超过11位数字截取前11位
                    let len = value.length
                    if (len > 3 && len < 8) {
                        value = value.replace(/^(\d{3})/g, '$1 ')
                    }
                    else if (len >= 8) {
                        value = value.replace(/^(\d{3})(\d{4})/g, '$1 $2 ')
                    }
                    this.contactNum = value
                }
            },
            deep: true
        },
        // customerList: {
        //     handler(val) {
        //         //更新优惠券
        //         this.getUserValidCoupon();
        //     },
        //     deep: true
        // },
        screenHeight: function (newValue) {
            let _this = this;
            if (_this.originHeight > newValue + 150) { //150是为了兼容虚拟返回栏
                _this.isOriginHei = false;
            } else {
                _this.isOriginHei = true;
            }
        }
    },
    methods: {
        /**
         * 发票收件人手机号脱敏显示
        */
        maskAddressPhone(phone){
            let res = phone;
            try {
                if (SnTravel.functional.ISDECORATE){
                    res = MASKING.maskingText(MASKING.MASKING_TYPE.TEL,phone);
                }
            } catch (error) {
                console.log(error)
            }
            return res
        },
        // initAppBackFun(){
        //     const that = this;
        //     //注册并监听t信返回事件
        //     extendUtils.appBack(function (data) { //点击app返回事件
        //         extendUtils.stateManager.closeTopPop(() => {
        //             extendUtils.showConfirm('订单还没有提交，确定要离开这个页面吗？', function () { that.$router.back(); }, 2, '继续预订', '离开', null, function () { }, true)
        //         });
        //     }.bind(this));
        //     extendUtils.reFreshPage(() => {
        //         requestHandler.reloadWithNoCache()
        //         const that = this;
        //         that.$emit('showOff', true);
        //     });
        // },

        // 是否显示实惠标签
        initPriceKind() {
            try {
                this.priceKind = !!JSON.parse(extendUtils.getStorage('cabins')) && JSON.parse(extendUtils.getStorage('cabins')).priceKind == 1;
            } catch (error) {
            }
        },
        focusFun(){
                
            if (SnTravel.functional.ISDECORATE && this.focusNum == 0){
                this.contactNum = '';  
            }
            this.focusNum++;
        },

        //注册并监听t信返回事件
        goBackFun(){
            const that = this;
            extendUtils.showConfirm('订单还没有提交，确定要离开这个页面吗？', function () { that.$router.back(); }, 2, '继续预订', '离开', null, function () { }, true)
        },


        //获取T信登录信息的回调
        TchatLoginUserInfoFun(data) {
            this.userLoading = false;
            this.setContactInfo(data);
        },

        //获取商旅登录人的信息 用来选中自己
        SLloginUserInfoFun(data){
            let that = this;
            that.userLoading = false;          
            that.customerList.push(data);
        },

        //关闭乘客列表的组件
        closePsgListFun() {
            this.showPsg = false;
        },
        //编辑乘客组件点击删除按钮
        deledPsgFun(data) {
            let that = this;
            that.showEditPsg = false;
            //重新拉取乘客数据列表
            that.$refs.psg.initData(true);
            //处理编辑选中人员信息，将选中人员信息更新到最新
            that.customerList = that.customerList.filter((item) => {
                return item.passengerId != data.passengerId
            });
        },
        //编辑乘客组件点击编辑保存按钮
        editedPsgFun(data, wrongIdTypeFlag) {
            let that = this;
            that.showEditPsg = false;
            //重新拉取乘客数据列表
            that.$refs.psg.initData(true);
            if (!!wrongIdTypeFlag) { //说明此时编辑后的已选中的证件信息是不支持购买机票的，此时需要移除选中
                that.customerList = that.customerList.filter((item) => {
                    return item.passengerId != data.passengerId;
                });
            } else { //处理编辑选中人员信息，将选中人员信息更新到最新
                that.customerList = that.customerList.map((item) => {
                    if (item.passengerId == data.passengerId) {
                        item = data;
                    }
                    return item;
                });
            }
        },
        resetTitle() {
            document.title = this.$route.query.title || '编辑订单';
        },
        //数据脱敏的方法
        desensitization(num) {
            if (extendUtils.ISDECORATE) {
                return MASKING.maskingText(MASKING.MASKING_TYPE.IDCARD,num);
            } 
            return num;
                

        },
        //点击乘客方块
        cliPsgItem(psgItem) {
            let that = this;
            if (that.handlePsg(psgItem, that.customerList)) { //说明已经选中了
                for (let i = 0; i < that.customerList.length; i++) {
                    if (that.customerList[i].passengerId == psgItem.passengerId) {
                        that.customerList.splice(i, 1);
                        break;
                    }
                }
            } else if (that.customerList.length > 8) {
                extendUtils.showToast('您最多只能给9名乘客订票！')
            } else if (!that.handlePsg(psgItem, that.customerList)){
                //往乘客列表推送乘客的时候，首先判断是否存在，解决连续点击乘客item框，下面出现多个乘客的问题
                that.customerList.push(psgItem);
            }

        },
        // pagItem是否在customerList存在  返回true or false
        handlePsg(pagItem, customerList) {
            return customerList.some(item => item.passengerId == pagItem.passengerId);
        },
        // 处理乘客list
        psgFunc(val) {
            this.psgList = val;
        },
        getPageInitData() {
            const that = this;
            that.getFilghtDetail();
            //设置默认优惠券
            // that.setCoupon(that.currCoupon || that.cabins.bestCoupon);
            const endDate = new Date(extendUtils.getStorage('startDate')).getTime() + that.flightDetail.runDays * 24 * 3600000;
            that.endDate = new Date(endDate).format('MM月dd日') + "  " + extendUtils.indexToWeek(new Date(endDate).getDay());
            that.getExpressFee();
        },
        /**
             * loading超时自动关闭
             */
        autoCloseLoading() {
            setTimeout(() => {
                this.userLoading = false;
            }, 2000);
        },
        /**
             * 设置下单联系人信
             */
        setContactInfo(data) {
            let that = this;
            if (!that.contactNum) {
                that.contactNum = data.phone;
            }
            if (!that.contactName) {
                that.contactName = data.name;
            }
            if (SnTravel.functional.ISDECORATE){
                that.contactNumCopy = that.contactNum
                that.contactNum = MASKING.maskingText(MASKING.MASKING_TYPE.TEL,that.contactNum);
            }
        },
        /**
             * 根据当前条件重新获取优惠券
             */
        // getUserValidCoupon() {
        //     let that = this;
        //     let param = {
        //         UnitPrice: Number(that.farePrice),
        //         PassengerCount: that.customerList.length,
        //         ProductType: 1,
        //     }
        //     requestHandler.findPersonalCoupon(param).then((res) => {
        //         if (!!res.result && res.result.canUseCoupon.length > 0) {
        //             that.$set(that.cabins, 'canUseCoupon', res.result.canUseCoupon);
        //             that.setCoupon(res.result.canUseCoupon[0]);
        //         } else {
        //             that.$set(that.cabins, 'canUseCoupon', null);
        //             that.setCoupon(null);
        //         }
        //     }).catch((err) => {
        //         that.$set(that.cabins, 'canUseCoupon', null);
        //         that.setCoupon(null);
        //     });
        // },
        // /**
        //  * 设置当前的优惠券
        //  */
        // setCoupon(coupon) {
        //     this.currCoupon = !coupon || Object.keys(coupon).length == 0 ? null :coupon;//设置默认优惠券
        // },
        /**
             * 获取机票详情数据并计算总价
             */
        getFilghtDetail() {
            const that = this;
            that.flightDetail = !!extendUtils.getStorage('flightDetail') ? JSON.parse(extendUtils.getStorage('flightDetail')) : '';
            that.cabins = !!extendUtils.getStorage('cabins') ? JSON.parse(extendUtils.getStorage('cabins')) : '';
            that.startDate = new Date(that.flightDetail.departDate).format('MM月dd日') + "  " + extendUtils.indexToWeek(new Date(
                that.flightDetail.departDate).getDay());
            that.farePrice = that.cabins.fare;
        },


        /**
             * 获取邮递费
             */
        getExpressFee() {
            const that = this;
            requestHandler.getExpressFee().then((res) => {
                if (!!res.result) {
                    that.expressFee = res.result.expressFee;
                }
            }).catch((err) => {
                console.log(err)
            });
        },
        /**
             * 重置支付进度条
             */
        closeProcess() {
            const that = this;
            that.processPrecent = 0;
            that.showOrderProcess = false;
        },
        showSurname(code){
            return extendUtils.showSurname(code)
        },
     
        /**
             * 选择地址
             * @选择的数据
             * index 地址对象
             */
        closeAddressList() {
            this.showAddressEdit = false;
            this.resetTitle();
        },
        //处理用户信息不完善的情况
        judgeEmpty(val) {
            let res = true;
            if (!!val && !!val.idNum && val.idNum.length > 0 && ((!!val.gender && val.gender != 0 && val.gender != '') || (val.idCode == 0 && val.idNum != 0 && val.idNum != ''))) {
                res = false;
            }
            return res;
        },
        /**
             * 编辑旅客信息
             */
        editCustomer(val) {
            const that = this;
            that.psgInfo = val;
            that.showEditPsg = true;
            document.title = '编辑常用乘客';
            that.$forceUpdate()
        },
        //判断是否是伴正事，是伴正事的才有导入发票的功能 
        isBizMate(){
            return !!(extendUtils.getBizMateVersion()) || !!extendUtils.isPC();
        },
        /**
         * 前往订单详情
         */
        toDetailPage() {
            const that = this;
            requestHandler.openPage('order/index.html#/detail/flight?orderNo=' + that.orderNo + '&pageFrom=pay',this.inwxmini);
        },
        /**
             * 获取保险需传递的参数json
             */
        getInsurances() {
            const _this = this;
            let insurances = [];
            _this.choosedInsurance.forEach(function (value) {
                let tempJson = { productNo: value.productNo, providerType: _this.insuranceList[_this.indexOfArr(value.productNo, _this.insuranceList, 'productNo')].providerType, insuredInfos: [] }
                value.insuredInfos.forEach(function (item) {
                    tempJson.insuredInfos.push(_this.getInsurancesUser(item))
                })
                insurances.push(tempJson);
            });
            return insurances;
        },
        /**
             * 获取保险乘客证件信息
             */
        getInsurancesUser(item) {
            let gender = null;
            if (!!item.gender && item.gender != 0 && item.gender != '') {
                gender = item.gender
            } else if (item.idCode == 0 && item.idNum != 0 && item.idNum != '') {
                gender = extendUtils.getSexForCard(parseInt(item.idCode));
            }
            return {
                "cardType": parseInt((item || {}).idCode || 0),
                "cardNo": (item || {}).idNum,
                "name": this.showSurname((item || {}).idCode) ? (item.firstName + "/" + item.lastName) : item.name,
                "gender": gender,
                "phone": item.phone,
                "birthday": item.birthday
                // "psgType": 1,
                // 'userId': item.passengerId,
            }
        },
        /**
             * 获取保险费
             */
        getFlightBookPara() {
            const that = this;
            that.insuranceLoading = true;
            requestHandler.getFlightInsProducts().then((res) => {
                that.insuranceLoading = false;
                if (!!res.result) {
                    that.insuranceList = res.result;
                }
            }).catch((err) => {
                that.insuranceLoading = false;
                console.error(err);
            });
        },
        /**
             * 显示保险详情
             */
        showInsurance(item) {
            const that = this;
            that.insuranceDetail = item;
            that.showInsurancePop = true;
        },
        changeConnector() {
            let that = this;
            sinosdk.sino.contacts([], 0).then((data) => {
                if (0 < data.length) {
                    that.contactNum = data[0].uPhone;
                    that.contactName = data[0].uName;
                }
            });
        },
        /**
             * 添加旅客
             */
        addCustomer() {
            const that = this;
            document.title = '添加乘客';
            //跳转到人员添加页面
            that.showPsg = true;
        },
        /**
             * 删除旅客
             */
        deleteCustomer(index) {
            const that = this;
            if (index != -1) {
                that.customerList.splice(index, 1);
            }
        },
        /**
             * 验价
             * @航班类型
             * */
        checkPrice() {
            const that = this;
            let detail = '';
            let cabins = '';
            detail = that.flightDetail;
            cabins = that.cabins;
            const obj = {
                "sCode": detail.departAirportCode,
                "goDate": detail.departDate,
                "cabin": cabins.cabinCode,
                "currFare": cabins.fare,
                "sTime": detail.departTime,
                "chd": false,
                "flightNo": detail.flightNo,
                "eCode": detail.arriveAirportCode,
                "providerType": cabins.providerType,
                "cabId": cabins.cabId,
                "serialNumber": cabins.serialNumber
            };
            requestHandler.verifyCabin(obj).then((res) => {
                if (!!res.result) {
                    that.cabins.fare = res.result.newFare;
                } else {
                }
            }).catch((err) => {
                console.error(err);
            });
        },
        id2Birty(id) {
            return id.slice(6, 10) + '/' + id.slice(10, 12) + '/' + id.slice(12, 14)
        },
        /*
        * 判断平年闰年
        * y:年份数字，四位
        * */
        isOrdinaryYear(y){
            if ((y%4===0 && y % 100 !== 0)|| y % 400 === 0 ){
                return false
            }
            return true;
        },
        getLimitTimestamp(age){
            var nowDate = new Date(); // 当前时间
            var mouth = nowDate.getMonth() + 1;
            var day = nowDate.getDate();
            var year = nowDate.getFullYear() - age;
            if (mouth === 2 && day >= 28){
                day = this.isOrdinaryYear(year) ? 28 : 29;
            }
            return new Date(year + '/' + mouth + '/' + day).getTime();
        },
        // 校验乘客信息
        validate() {
            const that = this;
            let res = true;
            if (that.customerList.length == 0) {
                extendUtils.showToast('请先填写乘客信息');
                res = false;
                return;
            } 
            for (let i = 0; i < that.customerList.length; i++) {
                let item = that.customerList[i];
                if (!item.idNum || !((!!item.gender && item.gender != 0 && item.gender != '') || (item.idCode == 0 && item.idNum != 0 && item.idNum != ''))) {
                    extendUtils.showToast('请先完善乘客信息');
                    res = false;
                    return;
                }
            }
            for (let i = 0; i < that.customerList.length; i++) {
                let item = that.customerList[i];
                let eighteenTimestamp = that.getLimitTimestamp(18); 
                let sixtyfiveTimestamp = that.getLimitTimestamp(65);
                let birthdayTimestamp = new Date(item.birthday).getTime();
                if (that.priceKind && (birthdayTimestamp >= eighteenTimestamp || birthdayTimestamp < sixtyfiveTimestamp)) {
                    extendUtils.showToast('"实惠"价格仅适用于年龄18岁（不含）至65岁（含）乘机人，请重新选择乘机人！');
                    res = false;
                    return;
                }
            }
                
            if (that.customerList.length > that.cabins.ticketCount) {
                extendUtils.showToast('下单人数超出余票量，请修改');
                res = false;
                return;
            }
            if (that.showReim) {
                if (!(!!that.addressDetail.id && !!that.reimDetail.titleId)) {
                    extendUtils.showToast('当前报销凭证信息不完整，请修改');
                    res = false;
                    return;
                }
            }
            return res;
        },
        /**
             * 提交订单
             * @航班数据
             * */
        async confirmOrder() {
            const that = this;
            await extendUtils.authInterceptor();

            // 校验输入的联系电话的格式校验
            //先去除空格

            let newContactNum = that.contactNum.replace(/\s*/g, "");
            if (SnTravel.functional.ISDECORATE && this.focusNum == 0){
                newContactNum = that.contactNumCopy
            }

            if (newContactNum=='') {
                extendUtils.showToast('请先填写联系电话')
                return
            }
            
            if (!extendUtils.isMobile(newContactNum)) {
                extendUtils.showToast('联系电话格式错误')
                return
            }

            //联系电话（159 1234 5678）非当前乘客电话号码，确认继续下单？
            if (that.customerList.length <= 0) {
                extendUtils.showToast('请先填写乘客信息');
                return
            }

                
            //创建订单之前先判断是否是首次使用机票（用前端缓存localStorage里面的isShowReim记录）
            let flightIsShowReim = extendUtils.getStorage(requestHandler.primaryKey + 'flightIsShowReim');
            if (!!!flightIsShowReim){ //说明初次使用，此时弹窗显示
                extendUtils.showConfirm('您是否需要报销凭证，以便后续报销使用，报销凭证需另支付15元邮寄费用', function () {
                    extendUtils.setStorage(requestHandler.primaryKey + 'flightIsShowReim', true);
                    that.showReim = true;
                }, 2, '取消', '确定', null, function () {
                    extendUtils.setStorage(requestHandler.primaryKey + 'flightIsShowReim', false);
                }, true);
                return
            }


            if (that.customerList.length > 0 && that.telValidated == false) {
                let findIndex = that.customerList.findIndex(function (o) {
                    return o.phone == newContactNum;
                });
                if (findIndex == -1) { //说明不存在,显示弹窗
                    that.telValidated = true;
                    extendUtils.showConfirm('联系电话（' + that.contactNum + '）非当前乘客电话号码，确认继续下单？', function () {
                        that.confirmOrder();
                    }, 2, '取消', '确定', null, function () {
                        that.telValidated = false;
                    }, true);
                    return
                }
            }
            let detail = that.flightDetail;
            let cabins = that.cabins;
            let passengers = [];
            let insurances = [];
            if (that.validate()) {
                if (!that.isSubmiting) {
                    that.isSubmiting = true;
                    if (that.choosedInsurance.length > 0) {
                        insurances = that.getInsurances();
                    }
                    console.log('that.customerList', that.customerList);
                    that.customerList.forEach((item) => {
                        let gender = 1;
                        if (!!item.gender && item.gender != 0 && item.gender != '') {
                            gender = item.gender
                        } else if (item.idCode == 0 && item.idNum != 0 && item.idNum != '') {
                            gender = extendUtils.getSexForCard(parseInt(item.idCode));
                        }
                        let param = {
                            "cardNo": (item || {}).idNum,
                            // "InsProductCodes": insurence,
                            "cardType": parseInt((item || {}).idCode || 0),
                            "birthday": item.birthday,
                            "psgType": 1,
                            "mobile": item.phone,
                            'psgId': item.passengerId,
                            "psgName": that.showSurname((item || {}).idCode) ? (item.firstName + "/" + item.lastName) : item.name,
                            "gender": gender,
                            "nationality": item.abbreviation || '', //国籍二字代码
                            "cardNoValidDate": item.term || '', // 证件有效期截止日期
                            "issueCountry": item.issueCountry || '' // 发证国家二字代码
                        }
                        item.passengerUserId && (param.userId = item.passengerUserId);
                        item.thirdUserId && (param.thirdUserId = item.thirdUserId);
                        passengers.push(param)
                    });
                    await extendUtils.authInterceptor();
                    const obj = {
                        "passengers": passengers,
                        "insurances": insurances,
                        "airLines": [{
                            "productId": cabins.productId,
                            "sAirportCode": detail.departAirportCode,
                            "sTerminal": detail.departAirportTerminal,
                            "discount": cabins.discount,
                            "cabinName": cabins.cabinName,
                            "cabinRank": cabins.cabinRank,
                            "tax": detail.tax,
                            "flightNo": detail.flightNo,
                            "eTerminal": detail.arriveAirportTerminal,
                            "fare": cabins.fare,
                            "arriveDateTime": detail.arriveDate + ' ' + detail.arriveTime,
                            "oil": detail.oil,
                            "cabin": cabins.cabinCode,
                            "planeType": detail.planeType,
                            "eAirportCode": detail.arriveAirportCode,
                            "airLineCode": detail.airCompanyCode,
                            "fromDateTime": detail.departDate + ' ' + detail.departTime,
                            "specificVoyage": 0,
                            "isDirectSale": cabins.isDirectSale,
                            "share": detail.share,
                            "serviceFee": cabins.serviceFee,
                            "cabId": cabins.cabId,
                            "serialNumber": cabins.serialNumber
                        }],
                        "orderBase": {
                            "contactMobile": newContactNum,
                            "orderRemark": "机票订单",
                            'fareAmount': that.totalPrice,
                            "flightType": 0,
                            "contactName": that.contactName || newContactNum,
                            "prodId": requestHandler.productId
                        },
                        "providerType": cabins.providerType,
                        "founderInfo": {
                            "userId": requestHandler.userId,
                            "companyId": requestHandler.companyId,
                            "channelId": requestHandler.channelId,
                            "companyName": requestHandler.companyName,
                            "userName": requestHandler.userName,
                            "channelName": requestHandler.channelName
                            //   "FounderName": that.userInfo.UserName,
                        },
                        "specialPermissionInfos": that.specialPermissionInfos || []
                    };
                        //快递费
                    if (that.showReim) {
                        obj.invoiceFlag = '1';
                        obj.address = that.addressDetail;
                        obj.expressFee = that.expressFee;
                        obj.title = that.reimDetail;
                    } else {
                        obj.invoiceFlag = '0';
                    }
                      
                    //下单拼接因公因私的参数
                    obj.useType = that.$route.query.useType || (await extendUtils.useTypeConfig()).default();

                    //行程数据
                    if (!!that.$route.query.tripNo && (await extendUtils.useTypeConfig()).isPublic(that.$route.query.useType, 1)) {
                        obj.tripNo = that.$route.query.tripNo
                    }
                    //优惠券
                    // if (!!that.currCoupon) {
                    //     obj.Coupons = [that.currCoupon.CouponId]//使用集合，为以后可能选多个做铺垫
                    // }
                    extendUtils.setStorage('customerList', JSON.stringify(passengers));
                    that.showOrderProcess = true;

                    //记住此次是打开了报销凭证
                    extendUtils.setStorage(requestHandler.primaryKey + 'flightIsShowReim', that.showReim);

                    requestHandler.createOrder(obj).then((res) => {
                        that.isSubmiting = false;
                        that.closeProcess();
                        that.orderNo = res.result.orderNo;
                        that.toDetailPage();
                        extendUtils.setStorage('totalPrice', that.totalPrice);
                    }).catch((err) => {
                        that.isSubmiting = false;
                        that.showOrderProcess = false;
                        that.closeProcess();
                        if (!err) {
                            return;
                        }
                        if (requestHandler.ERROR_CODE.NO_APPLY == err.resultCode) { //没有审批单
                            that.showNoApply = true;
                            document.title = '提示';
                        } else if (requestHandler.ERROR_CODE.PRICE_CHANGE == err.resultCode) {
                            if (!!err.resultMessage){
                                var newFareList = JSON.parse(err.resultMessage);
                                let isCanBooking = true;
                                let filghtSingle = JSON.parse(extendUtils.getStorage("flightDetail"));
                                let cabinSingle = JSON.parse(extendUtils.getStorage("cabins"));
                                let oldFare = that.cabins.fare;
                                for (let i = 0; i < newFareList.length; i++) {
                                    if (!newFareList[i].canBook) {
                                        isCanBooking = false;
                                        break;
                                    }
                                    if (!!filghtSingle && (filghtSingle.flightNo == newFareList[i].flightNo)) {
                                        cabinSingle.fare = newFareList[i].newFare;
                                        extendUtils.setStorage('cabins', JSON.stringify(cabinSingle));
                                        that.getFilghtDetail();
                                    }
                                }
                                if (isCanBooking) {
                                    extendUtils.showConfirm('航班实时价格已更新（' + that.cabins.cabinName + '原价<span class="rmb">' + oldFare + '</span>，现价<span class="rmb">' + cabinSingle.fare + '</span>）, 是否继续提交订单', function () {
                                        that.confirmOrder();
                                    }, 2, '取消', '继续提交', null, null, true);
                                } else {
                                    that.cabinNoEnough(newFareList, filghtSingle.flightNo);
                                }
                            } else {
                                extendUtils.showToast(extendUtils.ErrorCodeMap[err.resultCode].text);
                            }
                                
                        } else if (requestHandler.ERROR_CODE.NO_CABIN == err.resultCode) {
                            if (!!err.resultMessage) {
                                let filghtSingle = JSON.parse(extendUtils.getStorage("flightDetail"));
                                this.cabinNoEnough(JSON.parse(err.resultMessage), filghtSingle.flightNo);
                            } else {
                                extendUtils.showToast(extendUtils.ErrorCodeMap[err.resultCode].text);
                            }
                        } else if (err.errorBisType == extendUtils.BisType.REDO) {
                            that.confirmOrder();
                        }
                        console.error(err);
                    });
                } else {
                    extendUtils.showToast('订单正在生成中，请勿重复提交')
                }
            }
        },

        /**
             * 舱位不足提示
             */
        cabinNoEnough(flightList, flightNo) {
            let that = this;
            let list = flightList.filter(flight => {
                return flight.flightNo = flightNo;
            });
            let flight = list[0];
            if (!flight.canBook) {
                let cabinNum = flight.cabinNum;
                let cabinNumStr = !!cabinNum ? `该航班舱位不足(剩余${cabinNum}个)，请调整出行乘客。` : `您预订的舱位已经售罄，请重新选择其他舱位或航班。`;
                extendUtils.showConfirm(cabinNumStr, function () {
                    !cabinNum && that.$router.back();//剩余舱位为0时，回到舱位列表页
                }, 1, null, null, null, function () {
                }, true);
            }
        },
        /**
             * 打开凭证类型样例页面
             */
        openReimburseType() {
            let url = 'express/index.html#/sample'
            requestHandler.openPage(url);
        },

        //动态加载js（包括发票/乘客）
        dynamicLoadingJs() {
            let that = this;
            //动态加载发票的js组件
            that.loadInvoiceComp();
            //动态加载乘客的js组件
            that.loadPsgComp();
            //动态加载地址的js组件
            that.loadAddressComp();
        },


        //动态加载发票的js组件
        loadInvoiceComp() {
            let that = this;
            requestHandler.loadJs('swpInvoice', 'invoice', () => {
                that.showInvoiceComp = true;
            })
        },
        //动态加载发票的js组件
        loadPsgComp() {
            let that = this;
            requestHandler.loadJs('swpPsg', 'passenger', () => {
                that.showPsgCom = true;
            })
        },
        //动态加载地址的js组件
        loadAddressComp() {
            let that = this;
            requestHandler.loadJs('swpAddress', 'address', () => {
                that.showAddressComp = true;
            })
        },
        /**
             * 打开发票
             */
        showInvoice() {
            const that = this;
            if (!that.showInvoiceComp) {
                that.popLoading = true;
                setTimeout(() => {
                    that.showInvoice();
                }, 100);
                return;
            }
            that.popLoading = false;
            that.showReceiptEdit = true;
            document.title = '发票抬头';
        },
        /**
             * 打开地址
             */
        showAddress() {
            const that = this;
            if (!that.showAddressComp) {
                that.popLoading = true;
                setTimeout(() => {
                    that.showAddress();
                }, 100);
                return;
            }
            that.popLoading = false;
            that.showAddressEdit = true;
            document.title = '配送地址';
        },
        /**
            * 维数组是否包含元素
            */
        arrhaveitem(item, arr, key) {
            var isInArr = false;
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (!!key ? arr[i][key] == item : arr[i] == item) {
                    isInArr = true;
                    break;
                }
            }
            return isInArr;
        },
        /**
            * 元素在数组中的索引
            */
        indexOfArr(val, arr, key) {
            for (var i = 0; i < arr.length; i++) {
                if (!!key ? arr[i][key] == val : arr[i] == val) {
                    return i;
                }
            }
            return -1;
        },
        /**
             * 打开编辑保险乘客组件
             */
        chooseInsuranceUser(item) {
            let _this = this;
            _this.editInsurancesUseProductNo = item.productNo;
            _this.insurancesUser = item.insuredInfos;
            _this.showInsurancesUser = true;
        },
        /**
             * 编辑保险乘客组件
             */
        setInsuranceUser(value) {
            let _this = this;
            let index = _this.indexOfArr(_this.editInsurancesUseProductNo, _this.choosedInsurance, 'productNo');
            let len = value.length;
            if (-1 == index) {
                if (0 != len) {
                    _this.choosedInsurance.push({ productNo: _this.editInsurancesUseProductNo, insuredInfos: value })
                }
            } else if (0 != len) {
                _this.choosedInsurance[index].insuredInfos = value;
            } else {
                _this.choosedInsurance.splice(index, 1);
            }
        },

        updateAddress(item) {
            if (!item) {
                return;
            }
            if (item.type == 'delete' && this.addressDetail.id == item.value.id) {
                this.addressDetail = {}
            }
        },

        //导入企业发票抬头
        async importInvoiceFun(){
            await this.$refs.invoiceCard.gotoImportInvoice('single');
        },
        //根据运维后台是否配置了企业发票抬头的地址Url来判断导入企业发票抬头按钮是否显示
        checkImportInvoiceBtn(flag){
            this.showImportInvoice = flag;
        } 
    }
}

</script>
<style scoped lang="less">
    @import '~themes/default/styles/orderConfirm/orderConfirm.less';
</style>
<style lang="less">
    @import '~themes/default/styles/common/index.less';
    .v-transfer-dom .vux-popup-dialog {
        z-index: 502;
    }
    .editDetailPop.vux-popup-dialog{
        background-color: @background-color;
    }
</style>