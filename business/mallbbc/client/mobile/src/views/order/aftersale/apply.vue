<!-- 申请退款页面 -->
<template>
    <view class="content">
        <view class="order_tips" v-if='serviceType==1'>如该商品含有赠品，请将赠品一并退回。</view>
        <view class="apply_refund_content">
            <!-- 有批量选择商品返回的  批量商品 start -->
            <view class="batch_apply_list" v-if="batchSelList.length > 1">
                <scroll-view scroll-x class="batch_apply_pre" v-for="(item,index) in batchSelList" :key="index"
                    @click="goProductDetail(item.sku)">
                    <view class="batch_apply_pre_image">
                        <view class="image" :style="'background-image:url('+item.mainImage+')'"></view>
                    </view>
                    <view class="batch_apply_pre_num">*{{item.currNum}}</view>
                </scroll-view>
            </view>
            <!-- 有批量选择商品返回的  批量商品 end -->

            <!-- 单个商品 start -->
            <view class="refund_goods" v-else @click="goProductDetail(orderProduct.sku)">
                <view class="refund_goods_image">
                    <view class="image" :style="'background-image:url('+orderProduct.mainImage+')'"></view>
                </view>
                <view class="refund_goods_des">
                    <text class="refund_goods_name">{{orderProduct.skuName}}</text>
                    <text class="refund_goods_spec" v-if="orderProduct.specValues">{{orderProduct.specValues}}</text>
                </view>
            </view>
            <!-- 单个商品 end -->

            <view class="refund_reason_des">
                <!-- 由待发货详情页面进入 start-->
                <block v-if="sourceType == 'orderDetail'">
                    <view class="refund_reason">
                        <view class="refund_reason_left">
                            <text>*</text>
                            <text>{{$L('退款原因')}}</text>
                        </view>
                        <view class="refund_reason_right" @click="reasonModel">
                            <text>{{reasonContent ? reasonContent : '请选择'}}</text>
                            <image :src="imgUrl+'common/icon/icon_common_rightarrow.svg'" mode=""></image>
                        </view>
                    </view>
                </block>
                <!-- 由待发货详情页面进入 end-->

                <!-- 由选择服务页面进入 start-->
                <block v-if="sourceType == 'selecTService'">
                    <!-- 仅退款 start -->
                    <block v-if="serviceType == '0'">
                        <view class="refund_reason">
                            <view class="refund_reason_left">
                                <text>*</text>
                                <text>{{$L('货物状态')}}</text>
                            </view>
                            <view class="refund_reason_right" @click="cargoStatusModel">
                                <text>{{cargoStatusContent ? cargoStatusContent : '请选择'}}</text>
                                <image :src="imgUrl+'common/icon/icon_common_rightarrow.svg'" mode=""></image>
                            </view>
                        </view>
                        <view class="refund_reason">
                            <view class="refund_reason_left">
                                <text>*</text>
                                <text>{{$L('退款原因')}}</text>
                            </view>
                            <view class="refund_reason_right" @click="reasonModel">
                                <text>{{reasonContent ? reasonContent : '请选择'}}</text>
                                <image :src="imgUrl+'common/icon/icon_common_rightarrow.svg'" mode=""></image>
                            </view>
                        </view>
                    </block>
                    <!-- 仅退款 end -->

                    <!-- 退货退款 start -->
                    <block v-if="serviceType == '1'">
                        <view class="refund_reason">
                            <view class="refund_reason_left">
                                <text>*</text>
                                <text>{{$L('退货原因')}}</text>
                            </view>
                            <view class="refund_reason_right" @click="reasonModel">
                                <text>{{reasonContent ? reasonContent : '请选择'}}</text>
                                <image :src="imgUrl+'common/icon/icon_common_rightarrow.svg'" mode=""></image>
                            </view>
                        </view>
                    </block>
                    <!-- 退货退款 end -->

                    <!-- 换货 start -->
                    <block v-if="serviceType == '2'">
                        <view class="refund_reason">
                            <view class="refund_reason_left">
                                <text>*</text>
                                <text>{{$L('换货原因')}}</text>
                            </view>
                            <view class="refund_reason_right" @click="reasonModel">
                                <text>{{reasonContent ? reasonContent : '请选择'}}</text>
                                <image :src="imgUrl+'common/icon/icon_common_rightarrow.svg'" mode=""></image>
                            </view>
                        </view>
                    </block>
                    <!-- 换货 end -->

                    <!-- 维修 start -->
                    <block v-if="serviceType == '4'">
                        <view class="refund_reason">
                            <view class="refund_reason_left">
                                <text>*</text>
                                <text>{{$L('维修原因')}}</text>
                            </view>
                            <view class="refund_reason_right" @click="reasonModel">
                                <text>{{reasonContent ? reasonContent : '请选择'}}</text>
                                <image :src="imgUrl+'common/icon/icon_common_rightarrow.svg'" mode=""></image>
                            </view>
                        </view>
                    </block>
                    <!-- 维修 end -->

                </block>
                <!-- 由选择服务页面进入 end-->
            </view>
            <view class="refund_info">
                <!-- 仅退款可以修改退款金额，申请仅退款时，若选择未收货则不可修改退款金额，若选择已收货，则可以修改退款金额，为选择货物状态时，页面展示按照未收货进行展示； -->
                <block v-if="serviceType == '0' && cargoStatusCurrent == 1">
                    <view class="refund_amount refund_amount_edit">
                        <text class="refund_amout_title">{{$L('退款金额')}}:￥</text>
                        <view class="refund_amount_price">
                            <input type="digit" v-model="returnAmount"
                                :placeholder="returnAmount ? returnAmount : '请输入退款金额'" @blur="getReturnAmount" />
                        </view>
                    </view>
                </block>
                <block v-if="serviceType == '1'">
                    <view class="refund_amount">
                        <text class="refund_amout_title">{{$L('退款金额')}}:</text>
                        <view class="refund_amount_price">
                            <!-- 批量选择之后 -->
                            <text v-if="tosource == 1">￥{{refundInfos.maxReturnMoney}}</text>
                            <!-- 单个商品 -->
                            <text v-else>￥{{refundDetail.maxReturnMoney}}</text>
                        </view>
                    </view>
                    <view class="refund_amount_limit">
                        {{$L('退款金额不可修改，最多')}}￥{{tosource == 1 ? refundInfos.maxReturnMoney :
                        refundDetail.maxReturnMoney}}
                        <text v-if="refundInfos.containsFee && tosource == 1">{{$L('(含运费')}}{{refundInfos.returnExpressFee}}{{$L('元)')}}</text>
                        <text v-if="refundDetail.containsFee && tosource == 0">{{$L('(含运费')}}{{refundDetail.returnExpressFee}}{{$L('元)')}}</text>
                        <text v-if="!refundDetail.containsFee">{{$L('(不包含运费)')}}</text>
                    </view>
                </block>
                <!-- 仅退款可以修改退款金额，退货和换货可以修改申请件数； -->
                <block v-if="(batchSelList.length == 1 && tosource == 1) || tosource == 0">
                    <view class="refund_number1" v-if="serviceType == '1' || serviceType == '2'|| serviceType == '4'">
                        <text class="refund_number1_title">{{$L('申请件数')}}：</text>
                        <view class="refund_number_edit">
                            <text @click="editNum('reduce')">-</text>
                            <input type="number" v-model="applyNum" @blur="editNum('edit',$event)" />
                            <text @click="editNum('add')">+</text>
                        </view>
                    </view>
                    <view class="refund_number" v-else>
                        <text>{{$L('申请件数')}}：</text>
                        <text>{{tosource == 1 ? refundInfos.number : refundDetail.number}}</text>
                    </view>
                </block>
                <view class="refund_instructions">
                    <text>{{serviceType == '1' ? '退款说明:':serviceType == '2'? '换货说明':serviceType == '4'? '维修说明':''}}</text>
                    <input type="text" :value="refundInstructions" :placeholder="$L(`请输入${serviceType == '1' ? '退款说明:':serviceType == '2'? '换货说明':serviceType == '4'? '维修说明':''}(选填)`)" @input="refundDes"
                        maxlength="200" />
                </view>
            </view>
            <view class="upload_voucher">
                <view class="upload_voucher_title">{{$L('上传凭证')}}</view>
                <view class="upload_voucher_con1">
                    <template  v-if="uploadFiles.length > 0">
                        <view class="upload_img" v-for="(item,index) in uploadFiles"
                            :key="index">
                            <view class="image" :style="'background-image:url('+item+');background-size: contain'"></view>
                            <image :src="imgUrl + 'common/icon/icon_search_clean.svg'" mode="" @click="delImg(item,index)"></image>
                        </view>
                    </template>
                    <view class="upload_voucher_con" @click="uploadVoucher" v-if="uploadFiles.length < 5">
                        <view class="upload_image">
                            <image :src="imgUrl+'order/xiangji.png'" mode=""></image>
                            <text>{{$L('添加图片')}}</text>
                            <text class="upload_limit">{{uploadFiles.length}}/5</text>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 返回方式 -->
            <view class="refund_reason_des" v-if='orderProduct.showAddressEle'>
                <view class="refund_reason">
                    <view class="refund_reason_left">
                        <text>*</text>
                        <text>{{$L('返回方式')}}</text>
                    </view>
                    <view class="refund_reason_right" @click="openReturnMode">
                        <text>{{returnModeText ? returnModeText : '请选择'}}</text>
                        <image :src="imgUrl+'common/icon/icon_common_rightarrow.svg'" mode=""></image>
                    </view>
                </view>
                <view class="address" v-if="pickWareType==enumType.pickUp">
                    <view class="address-left">
                        <view class="address-left-top">
                            <text class="name">{{pickWareAddress?pickWareAddress.memberName:''}}</text>
                            <text class="mobile">{{pickWareAddress?pickWareAddress.telMobile:''}}</text>
                        </view>
                        <view class="address-left-bottom">
                            <text>{{pickWareAddress?pickWareAddress.addressAll:''}}{{pickWareAddress?pickWareAddress.detailAddress:''}}</text>
                        </view>
                    </view>
                    <view class="address-right" @click="operateAddress('take',pickWareAddress)">
                        <image :src="imgUrl+'common/icon/icon_common_rightarrow.svg'" mode=""></image>
                    </view>
                </view>
            </view>

            <!-- 收货地址 -->
            <view class="refund_reason_des" v-if='orderProduct.showAddressEle&&(serviceType=="2"||serviceType=="4")'>
                <view class="refund_reason">
                    <view class="refund_reason_left">
                        <text>*</text>
                        <text>{{$L('收货地址')}}</text>
                    </view>
                    <!-- 只有上门取件 才会与取件地址保持一致 -->
                    <view class="refund_reason_right" v-if='pickWareType==enumType.pickUp'>
                        <text class="relative-left">与取件地址保持一致</text>
                        <switch  :checked="isDefaultAddress" style="transform:scale(0.7)" class="relative-left" @change="switchChange"/>
                    </view>
                </view>
                <!-- 如果是上门取件,用开关控制 如果是自行邮寄直接显示 -->
                <view class="address" v-if="isDefaultAddress==false||pickWareType==enumType.mail">
                    <view class="address-left">
                        <view class="address-left-top">
                            <text class="name">{{receiveWareAddress?receiveWareAddress.memberName:''}}</text>
                            <text class="mobile">{{receiveWareAddress?receiveWareAddress.telMobile:''}}</text>
                        </view>
                        <view class="address-left-bottom">
                            <text>{{receiveWareAddress?receiveWareAddress.addressAll:''}}{{receiveWareAddress?receiveWareAddress.detailAddress:''}}</text>
                        </view>
                    </view>
                    <view class="address-right" @click="operateAddress('recept',receiveWareAddress)">
                        <image :src="imgUrl+'common/icon/icon_common_rightarrow.svg'" mode=""></image>
                    </view>
                </view>
            </view>
        </view>
        <view class="submit" @click="submit">
            <view class="text">
                {{$L('提交')}}
            </view>
        </view>
        <!-- 退款原因弹框 -->
        <bottomPopup ref="cancelPopup" type="bottom" height="700rpx" :text="serviceType == '1' ? '退货原因' : serviceType == '2' ? '换货原因' : serviceType == '4'? '维修原因':''">
            <view class="cancel_popup">
                <scroll-view class="uni-list cancel_list" scroll-y="true">
                    <radio-group @change="radioChange">
                        <label class="cancle_pre" v-for="(item,index) in cancelList" :key="index">
                            <text>{{item.content}}</text>
                            <radio :value="item.value" :checked="item.value == current"
                                style="transform:scale(0.8);margin-right:0;" />
                        </label>
                    </radio-group>
                </scroll-view>
                <view class="cancel_popup_btn">
                    <text class="confrim_btn" @click="confirmRefund()">{{$L('确定')}}</text>
                </view>
            </view>
        </bottomPopup>
        <!-- 货物状态弹框 -->
        <bottomPopup ref="cargoStatusPopup" type="bottom" height="700rpx" text="货物状态">
            <view class="cancel_popup">
                <view class="uni-list cancel_list">
                    <radio-group @change="radioChangeStatus">
                        <label class="cancle_pre" v-for="(item,index) in cargoStatuslList" :key="index">
                            <text>{{item.content}}</text>
                            <radio :value="item.value" :checked="item.value == cargoStatusCurrent" color="#fc1c1c"
                                style="transform:scale(0.8);margin-right:0;" />
                        </label>
                    </radio-group>
                </view>
                <view class="cancel_popup_btn">
                    <text class="confrim_btn" @click="confirmCargoStatus()">{{$L('确定')}}</text>
                </view>
            </view>
        </bottomPopup>
        <!-- 返回方式弹框 -->
        <bottomPopup ref="returnModePopup" type="bottom" height="700rpx" text="返回方式">
            <view class="cancel_popup">
                <view class="uni-list cancel_list">
                    <radio-group @change="changeReturnMode">
                        <label class="cancle_pre" v-for="(item,index) in returnMode" :key="index">
                            <text>{{item.content}}</text>
                            <radio :value="`${item.value}`" :checked="item.value == pickWareType" color="#fc1c1c"
                                style="transform:scale(0.8);margin-right:0;" />
                        </label>
                    </radio-group>
                </view>
                <view class="cancel_popup_btn">
                    <text class="confrim_btn" @click="closeReturnMode()">{{$L('确定')}}</text>
                </view>
            </view>
        </bottomPopup>

        <uni-popup ref="popup" type="dialog">
            <uni-popup-dialog type="input" title="提示" :content="`确定${serviceType==1?'退货':serviceType==2?'换货':'维修'}?`" :duration="2000" @confirm="goSubmit('confirm')">
            </uni-popup-dialog>
        </uni-popup>
        <uni-popup ref="afterTips" :mask-click="false">
            <view class="afterTips_box flex_column_center_center">
                 <view class="afterTips_title">
                    提示
                </view>
                <view class="afterTips_content">
                    为保障您的合法权益，我们将在2个工作日内与您取得联系，请留意接听来电
                </view>
                <view class="close"><view @click="closeAfterTips" class="flex_row_center_center">{{$L('我知道了')}}</view></view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
import {
    mapState
} from 'vuex';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
import bottomPopup from '@/components/bottom-popup/index.vue'
import { multifileUpload } from '@/utils/common.js'
let startY = 0,
    moveY = 0,
    pageAtTop = true;
export default {
    components: {
        uniPopup,
        uniPopupDialog,
        bottomPopup
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            coverTransform: 'translateY(0px)',
            coverTransition: '0s',
            moving: false,
            orderProductId: '', //订单明细id
            orderRefundDet: {}, //拒绝的订单
            orderProduct: {}, //拒绝订单的商品
            orderRefundOrder: {}, //拒绝订单的详情信息
            cancelList: [], //退款原因列表
            current: '0', //退款原因当前点击的是第0项
            uploadFiles: [], //上传凭证，凭证数组
            upLoadFile: [], //给后台传的上传凭证
            refundInstructions: '', //退款说明
            reasonContent: '', //退款原因的内容
            reasonId: -1, //退款原因当前点击的原因id
            cargoStatusCurrent: '0', //收货状态当前点击的是第0项
            cargoStatusCurId: -1, //货物状态id
            cargoStatusContent: '', //货物状态内容
            cargoStatuslList: [ //货物状态
                {
                    content: '未收到货',
                    value: '0',
                    cargoStatusCurId: 0
                },
                {
                    content: '已收到货',
                    value: '1',
                    cargoStatusCurId: 1
                }
            ],
            serviceType: '', //服务类型   0： 仅退款（无需退货） 1 退货  2 换货  4 维修
            sourceType: '', //页面的来源，上一页为   selecTService由选择服务页面进入   由待发货详情页面进入
            applyNum: 1, //申请件数
            batchSelList: [], //选中的商品列表
            returnAmount: '', //输入的退款金额
            refundDetail: {}, //计算后的退货订单信息
            refundInfos: {}, //从售后商品选择返回的同一个订单的批量选择计算后的退款金额信息
            tosource: '0',
            windowHeight: '', //窗口高度
            orderListLen: 1, //同订单的订单长度
            batchGoods: [], //售后商品选择页面传递的值，默认为空

            serviceNum:1, //支持的最大售后数量.来自afsServiceCheck接口的num
            enumType:{
                pickUp:4, // 上门取件    
                mail:40, // 自行邮寄
                send:7 // 客户送货,这个不常用
            },
            returnMode:[], // 配送返回方式
            pickWareType:'', // 返回方式code 4 上门取件  40 自行邮寄
            backSource:'',
            oldAfsOrderSn:'', // 重新申请带过来的售后单号
            currentService:null, // 当前可售后性
            isDefaultAddress:true, // 收货地址是否与取件地址一致
            pickWareAddress:null, // 取件地址
            receiveWareAddress:null, // 收货地址
            subLock:false, //设置提交锁 
            isMpaasFileUpload:false //判断是不是mpass用来上传 mpass只用来拍照 不能选择相册
        }
    },
    async mounted(){
        this.orderProductId = this.$Route.query.orderProductId;
        this.serviceType = this.$Route.query.serviceType; //服务类型  1 退货  2 换货  4 维修
        this.sourceType = this.$Route.query.sourceType; //页面来源
        this.backSource = this.$Route.query.backSource; //页面回退
        this.oldAfsOrderSn = this.$Route.query.oldAfsOrderSn?this.$Route.query.oldAfsOrderSn:''; //从重新申请过来  要把原来的售后单号带过来, 退款页提交时传过去
        this.initData();
        this.getOrderDetail();
        this.getCancelList();
        this.getAfsServiceReverseExpress();
        this.checkMpass();
        uni.getSystemInfo({
            success: (res) => {
                this.windowHeight = res.windowHeight;
            }
        });
      
        this.orderListLen = this.$Route.query.orderListLen;
    },
    async onLoad() {
        // this.orderProductId = this.$Route.query.orderProductId;
        // this.serviceType = this.$Route.query.serviceType; //服务类型
        // this.sourceType = this.$Route.query.sourceType; //页面来源
        // this.initData();
        // this.getOrderDetail();
        // this.getCancelList();
        // uni.getSystemInfo({
        //     success: (res) => {
        //         this.windowHeight = res.windowHeight;
        //     }
        // });
        // this.orderListLen = this.$Route.query.orderListLen;
    },
    onShow() {
        let that = this;
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1]; //当前页面
        let refundInfos = currPage.refundInfos; //下一个页面传过来的值   批量选择后的退款金额信息
        let tosource = currPage.tosource || '0';
        that.tosource = tosource;
        if (refundInfos) {
            this.refundInfos = JSON.parse(JSON.stringify(refundInfos))
        } else {
            this.refundInfos = {};
        }
        let batchSelList = currPage.batchSelList; //下一个页面传过来的 选中的商品列表
        this.batchSelList = batchSelList || [];
        this.batchGoods = currPage.batchGoods; //下一个页面穿过来的，商品列表信息

        this.serviceType = this.$Route.query.serviceType; //服务类型  1 退货  2 换货  4 维修
        setTimeout(()=>{
            uni.setNavigationBarTitle({
                title:(this.serviceType==1? '申请退货': this.serviceType==2? '申请换货' : this.serviceType==4? '申请维修' :'申请退款')
            });
        }, 0)
    },
    // #ifndef MP
    onNavigationBarButtonTap(e) {
        const index = e.index;
        if (index === 0) {
            this.navTo('/pages/set/set');
        } else if (index === 1) {
            // #ifdef APP-PLUS
            const pages = getCurrentPages();
            const page = pages[pages.length - 1];
            const currentWebview = page.$getAppWebview();
            currentWebview.hideTitleNViewButtonRedDot({
                index
            });
            // #endif
            this.$Router.push('/pages/notice/notice')
        }
    },
    // #endif
    computed: {
        ...mapState(['hasLogin', 'userInfo', 'userCenterData']),
        returnModeText() {
            let text = ''
            if (this.pickWareType){
                const item = this.returnMode.find((items)=>{ return items.value == this.pickWareType })
                text = item?item.content:''
            }
            return text
        }
    },
    methods: {
        initData() {
        },

        /**
             * 统一跳转接口,拦截未登录路由
             * navigator标签现在默认没有转场动画，所以用view
             */
        navTo(url) {
            let copyUrl = url
            if (!this.hasLogin) {
                
                copyUrl = '/pages/public/login';
            }
            this.$Router.push(copyUrl)
        },

        /**
             *  会员卡下拉和回弹
             *  1.关闭bounce避免ios端下拉冲突
             *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
             *    transition设置0.1秒延迟，让css来过渡这段空窗期
             *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
             */
        coverTouchstart(e) {
            if (pageAtTop === false) {
                return;
            }
            this.coverTransition = 'transform .1s linear';
            startY = e.touches[0].clientY;
        },
        coverTouchmove(e) {
            moveY = e.touches[0].clientY;
            let moveDistance = moveY - startY;
            if (moveDistance < 0) {
                this.moving = false;
                return;
            }
            this.moving = true;
            if (moveDistance >= 80 && moveDistance < 100) {
                moveDistance = 80;
            }

            if (moveDistance > 0 && moveDistance <= 80) {
                this.coverTransform = `translateY(${moveDistance}px)`;
            }
        },
        coverTouchend() {
            if (this.moving === false) {
                return;
            }
            this.moving = false;
            this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
            this.coverTransform = 'translateY(0px)';
        },
        //获取售后订单货品详情
        getOrderDetail() {
            let param = {};
            param.url = 'v3/postsale/front/after/sale/apply/getOrderProductDetail';
            param.method = 'GET';
            param.data = {};
            param.data.orderProductId = this.orderProductId; //订单货品id
            this.$request(param).then(async res => {
                if (res.state == 200) {
                    let result = res.data;
                    // 获取可售后性
                    let serviceCheckList = await this.getAfsServiceCheck(result.orderSn);
                    let currentService = serviceCheckList.find(e=>e.orderProductId == this.orderProductId);
                    this.currentService = currentService;
                    if (currentService){
                        this.serviceNum = currentService.num
                    }
                    this.orderProduct = result;
                    this.pickWareAddress = JSON.parse(JSON.stringify(result.orderAddress));
                    this.receiveWareAddress = JSON.parse(JSON.stringify(result.orderAddress));
                    // 退货需要调用金额和数量
                    if (this.orderProduct && this.serviceType == '1') {
                        this.getRefundDetail();
                    } else {
                        // 换货和维修不调用此接口, 数量从afsServiceCheck接口取
                        this.applyNum = this.serviceNum;
                        this.refundDetail.number = this.serviceNum;
                    }
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
            })
        },
        // 可售后性列表
        getAfsServiceCheck(orderSn){
            return new Promise((resolve) => {
                let param = {};
                param.url = 'v3/postsale/front/after/sale/apply/afsServiceCheck';
                param.data = {};
                param.data.orderSn = orderSn;
                this.$request(param).then(res=>{
                    if (res.state==200){
                        resolve(res.data)
                    } else {
                        this.$api.msg(res.msg)
                        resolve([])
                    }
                }).catch(() => {
                    resolve([])
                })
            })
        },
        //获取计算售后退款信息 计算结果为此次最多可退金额
        getRefundDetail() {
            let param = {};
            param.url = 'v3/postsale/front/after/sale/apply/countReturnMoney';
            param.method = 'GET';
            param.data = {};
            param.data.orderSn = this.orderProduct.orderSn;
            //单个商品
            let orderProductInfos = '';
            orderProductInfos = this.orderProduct.orderProductId + '-' + this.serviceNum;
            param.data.orderProductInfos = orderProductInfos; //退换的订单货品列表，格式为：id1-num1,id2-num2...num为空时表示此订单货品全部退换
            this.$request(param).then(res => {
                if (res.state == 200) {
                    let result = res.data;
                    this.refundDetail = result;
                    this.returnAmount = '' + result.maxReturnMoney;
                    this.applyNum = this.refundDetail.number;
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
            })
        },
        //打开退款原因弹框
        reasonModel() {
            if (this.sourceType == 'selecTService' && this.serviceType == '0' && !this.cargoStatusContent) {
                uni.showToast({
                    title: '请选择货物状态',
                    icon: 'none',
                    duration: 700
                })
            } else {
                this.$refs.cancelPopup.open();
                this.getCancelList();
            }
        },
        //货物状态弹框
        cargoStatusModel() {
            this.$refs.cargoStatusPopup.open();
        },
        //获取订单退款原因列表
        getCancelList() {
            let param = {};
            param.url = 'v3/system/front/reason/list';
            param.method = 'GET';
            param.data = {};
            param.data.key = this.userInfo.access_token;
            //原因类型：101-违规下架；102-商品审核拒绝；103-入驻审核拒绝；104-会员取消订单；105-仅退款-未收货；106-仅退款-已收货；107-退款退货原因；108-商户取消订单
            if (this.sourceType == 'orderDetail') { //待发货
                param.data.type = 105;
            } else if (this.sourceType == 'selecTService') { //选择服务进入
                if (this.serviceType == '0') { //仅退款无需退货
                    if (this.cargoStatusCurrent == '0') { //未收到货
                        param.data.type = 105
                    } else if (this.cargoStatusCurrent == '1') {
                        param.data.type = 106
                    } else {
                        param.data.type = 106
                    }
                } else if (this.serviceType == '1') { //退货退款
                    param.data.type = 107
                } else if (this.serviceType == '2') { //换货
                    param.data.type = 109
                } else if (this.serviceType == '4') { //维修
                    param.data.type = 110
                } 
            }
            this.$request(param).then(res => {
                if (res.state == 200) {
                    this.cancelList = res.data || [];
                    this.cancelList && this.cancelList.map((item, index) => item.value = '' + index);
                    this.reasonId = this.reasonId ? this.reasonId : this.cancelList[0].reasonId;
                    this.cancelList.forEach((item, index) => {
                        if (item.reasonId == this.reasonId) {
                            this.current = item.value = '' + index;
                        } else {
                            // if(this.current == '0'){

                            // }else{}
                            // this.current = '0';
                        }
                    })
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
            })
        },
        //取消原因单选框切换
        radioChange(e) {
            for (let i = 0; i < this.cancelList.length; i++) {
                if (this.cancelList[i].value === e.target.value) {
                    this.reasonId = this.cancelList[i].reasonId;
                    this.reasonContent = this.cancelList[i].content;
                    this.current = this.reasonId != -1 ? i : 0;
                    break;
                }
            }
        },
        //确定退款原因的选择
        confirmRefund() {
            this.cancelList.forEach(() => {
                if (this.reasonId == -1) {
                    this.reasonId = this.cancelList[0].reasonId;
                    this.reasonContent = this.cancelList[0].content;
                    this.current = '0';
                }
            })
            this.$refs.cancelPopup.close();
        },
        //货物状态的单选按钮的切换
        radioChangeStatus(e) {
            for (let i = 0; i < this.cargoStatuslList.length; i++) {
                if (this.cargoStatuslList[i].value === e.target.value) {
                    this.cargoStatusCurId = this.cargoStatuslList[i].cargoStatusCurId;
                    this.cargoStatusContent = this.cargoStatuslList[i].content;
                    this.cargoStatusCurrent = this.cargoStatusCurId != -1 ? i : '0';
                    break;
                }
            }
        },
        //确定货物状态的选择
        confirmCargoStatus() {
            this.cargoStatuslList.forEach(() => {
                if (this.cargoStatusCurId == -1) {
                    this.cargoStatusCurId = this.cargoStatuslList[0].cargoStatusCurId;
                    this.cargoStatusContent = this.cargoStatuslList[0].content;
                    this.cargoStatusCurrent = '0';
                }
            })
            this.$refs.cargoStatusPopup.close();
        },
        //关闭退款弹框.货物状态的弹框
        notCancel() {
            this.$refs.cancelPopup.close();
            this.$refs.cargoStatusPopup.close();
        },
        //上传凭证
        uploadVoucher() {
            let that = this;
            let type = ['album']
            if (that.isMpaasFileUpload){
                type = ['camera']
            }
            // 从相册选择5张图
            uni.chooseImage({
                count: 5 - that.uploadFiles.length,
                sourceType: type,
                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                success: function (res) {
                    // 只上传图片类型文件
                    if (res.tempFiles.some(item => item.type.indexOf('image') === -1)) {
                        uni.showToast({
                            title: '只支持上传图片类型文件！',
                            icon: 'none',
                            duration: 1000
                        })
                        return
                    }
                    setTimeout(() => {
                        uni.showLoading()
                    })
                    if (res.tempFiles.some(item => item.size > 20971520)) {
                        uni.showToast({
                            title: '超出了文件限制20M',
                            icon: 'none',
                            duration: 700
                        })
                        uni.hideLoading()
                    } else {
                        let params = {
                            url: getApp().globalData.apiUrl + 'v3/oss/common/upload',
                            name: 'file',
                            formData: {
                                'source': 'afterSale'
                            }
                        }
                        let tmp = res.tempFilePaths

                        multifileUpload({
                            fileArray: tmp,
                            params,
                            success: function (result) {
                                that.uploadFiles = that.uploadFiles.concat(result.map((
                                    item) => {
                                    return item.data.url
                                })); //绝对路径用于前端显示
                                that.upLoadFile = that.upLoadFile.concat(result.map((item) => {
                                    return item.data.path
                                })); //相对路径用于给后台传值
                                uni.hideLoading()
                            },
                            fail: function (error) {
                                uni.hideLoading()
                                if (error.status === 200) {
                                    return;
                                }
                                uni.showToast({
                                    title: error.msg,
                                    icon: 'none',
                                    duration: 700
                                })
                            }
                        })
                        that.$forceUpdate()
                    }
                }
            });
        },
        //金额的校验
        isNumber(value) {
            var regPos = /^\d+(\.\d+)?$/; //非负浮点数
            var regPos1 = / ^\d+$/; //正整数
            if (regPos.test(value) || regPos1.test(value)) {
                return true;
            } 
            return false;
                
        },
        //退款输入的退款金额
        getReturnAmount(e) {
            let that = this;
            let value = Number(e.detail.value);
            let maxReturnMoney = Number(that.refundDetail.maxReturnMoney);
            let isVal = that.isNumber(value);
            if (!isVal) {
                uni.showToast({
                    title: '请输入正确的数字',
                    icon: 'none',
                    duration: 700
                })
                that.returnAmount = ''
            } else if (value >= maxReturnMoney) {
                that.returnAmount = '' + maxReturnMoney.toFixed(2);
            } else if (value < 0.01) {
                that.returnAmount = '' + 0.01
            } else {
                that.returnAmount = '' + value.toFixed(2);
            }
        },
        //退款说明
        refundDes(e) {
            let that = this;
            that.refundInstructions = e.detail.value;
        },
        //申请件数的修改
        editNum(type, e) {
            let that = this;
            if (that.serviceType == '1' || that.serviceType == '2'|| that.serviceType == '4') {
                if (!e && type == 'add') {
                    that.applyNum++;
                } else if (!e && type == 'reduce') {
                    if (that.applyNum < 1) {
                        that.applyNum = 1;
                        uni.showToast({
                            title: '不能低于最低申请件数',
                            icon: 'none',
                            duration: 700
                        })
                    } else {
                        that.applyNum--;
                    }
                } else if (e && type == 'edit') {
                    that.applyNum = e.detail.value;
                }
                if ((that.applyNum > that.refundDetail.number)) {
                    uni.showToast({
                        title: '超过了已购买的最大申请件数',
                        icon: 'none',
                        duration: 500
                    })
                    that.applyNum = that.refundDetail.number;
                }
                if (that.applyNum < 1){
                    uni.showToast({
                        title: '不能低于最低申请件数',
                        icon: 'none',
                        duration: 700
                    })
                    that.applyNum = 1;
                }
                if (that.serviceType == '1'){
                    this.getRefundMoney();
                }
            }
        },
        //根据申请件数获取退款金额
        getRefundMoney() {
            let param = {};
            param.url = 'v3/postsale/front/after/sale/apply/getReturnMoney';
            param.method = 'GET';
            param.data = {};
            param.data.orderProductId = this.orderProduct.orderProductId;
            param.data.applyNum = this.applyNum;
            this.$request(param).then(res => {
                if (res.state == 200) {
                    let result = res.data;
                    this.refundDetail.maxReturnMoney = result;
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
            })
        },
        
        //提交
        submit() {
            let that = this;
            if (that.sourceType == 'orderDetail' && that.reasonContent == '') {
                uni.showToast({
                    title: '请选择退款原因',
                    duration: 500,
                    icon: 'none'
                })
            } else if (that.sourceType == 'selecTService') {
                if ((that.serviceType == 0 || that.serviceType == 1) && that.reasonContent == '') {
                    uni.showToast({
                        title: '请选择退款原因',
                        duration: 500,
                        icon: 'none'
                    })
                } else if (that.serviceType == '2' && that.reasonContent == '') {
                    uni.showToast({
                        title: '请选择换货原因',
                        duration: 500,
                        icon: 'none'
                    })
                } else if (that.serviceType == '4' && that.reasonContent == '') {
                    uni.showToast({
                        title: '请选择维修原因',
                        duration: 500,
                        icon: 'none'
                    })
                } else if (that.cargoStatusContent == '' && that.serviceType == '0') {
                    uni.showToast({
                        title: '请选择货物状态',
                        duration: 500,
                        icon: 'none'
                    })
                } else {
                    that.goSubmit('open');
                }
            } else {
                that.goSubmit('open');
            }
        },
        // 去提交
        goSubmit(type) {
            switch (type) {
            case 'open': {
                this.$refs.popup.open()
                break;
            }
            case 'confirm': {
                this.$refs.popup.close()
                let productList = [];
                this.$refs.popup.close()
                let that = this;
                if (that.tosource != 1) { //单个商品 由待发货详情页面进入
                    let orderProduct = {};
                    orderProduct.orderProductId = that.orderProduct.orderProductId;
                    orderProduct.afsNum = (that.serviceType == '1' || that.serviceType == '2' || that.serviceType == '4')
                        ? that.applyNum 
                        : 1;
                    productList.push(orderProduct);
                } else { //批量申请 由批量选择商品页面进入
                    productList = that.batchSelList && that.batchSelList.map(function (item) {
                        return {
                            'orderProductId': item.orderProductId,
                            'afsNum': item.currNum
                        }
                    })
                }
                let param = {};
                param.url = 'v3/postsale/front/after/sale/apply/submit';
                param.method = 'POST';
                param.header = {
                    'content-type': 'application/json'
                };
                param.data = {};
                param.data.orderSn = that.orderProduct.orderSn;
                // serviceType:'',  //服务类型   0： 仅退款（无需退货） 1 ： 退货退款  2：换货
                param.data.afsType = that.sourceType == 'selecTService' && that.serviceType == '0'
                    ? 3
                    : 
                    that.sourceType =='selecTService' && that.serviceType == '1'
                        ? 1
                        : 
                        that.sourceType == 'selecTService' && that.serviceType =='2'
                            ? 2
                            : 
                            that.sourceType == 'selecTService' && that.serviceType =='4'
                                ? 4
                                :
                                that.sourceType == 'orderDetail'
                                    ? 3
                                    :
                                    ''; //申请类型（售后服务单类型，1-退货退款单（需关联处理退款金额），2-换货单，3-仅退款单）
                param.data.applyReasonContent = that.reasonContent; //申请售后服务原因，售后服务原因列表选择的内容
                param.data.afsDescription = that.refundInstructions; //详细问题描述
                param.data.applyImage = that.upLoadFile.join(','); //申请提交图片,多个图片用英文逗号隔开
                param.data.productList = productList; //订单货品列表
                // 货物状态目前不传了
                // if (that.sourceType == 'orderDetail') {
                //     param.data.goodsState = 0; //货物状态
                // } else if (that.sourceType == 'selecTService') {
                //     if (that.serviceType == '0') {
                //         param.data.goodsState = that.cargoStatusCurrent;
                //     } else if (that.serviceType == '1' || that.serviceType == '2') {
                //         param.data.goodsState = 1
                //     }
                // }
                if (that.serviceType == '0'||that.serviceType == '1'){
                    //退款金额 , 仅退款0和1退货退款
                    param.data.finalReturnAmount = that.tosource == 1
                        ? that.refundInfos.maxReturnMoney 
                        : 
                        that.serviceType == '0'
                            ? that.returnAmount 
                            : 
                            that.refundDetail.maxReturnMoney; 
                }
                // 如果原始订单存在 需要带过去
                param.data.oldAfsOrderSn = this.oldAfsOrderSn?this.oldAfsOrderSn:''
                // 返回方式
                param.data.pickWareType = this.pickWareType?this.pickWareType:''
                // 如果是上门取件 必须要传取件地址
                if (this.pickWareType==this.enumType.pickUp){
                    param.data.pickWareAddress = this.pickWareAddress
                } else {
                    param.data.pickWareAddress = {}
                }
                //  收件地址  退货退款不传收件地址(传了服务端会校验，地址过期了没地方改导致无法售后)    换货2和维修4 传收件地址
                // 如果是上门取件
                if ( this.pickWareType==this.enumType.pickUp && ['2','4'].includes(String(that.serviceType)) ){
                    //与取件地址一致 直接用取件地址, 如果不是则用收货地址
                    param.data.receiveWareAddress = this.isDefaultAddress?this.pickWareAddress:this.receiveWareAddress
                } else if ( this.pickWareType==this.enumType.mail && ['2','4'].includes(String(that.serviceType)) ){
                    //自行邮寄 
                    param.data.receiveWareAddress = this.receiveWareAddress
                } else {
                    // 
                    param.data.receiveWareAddress = {}
                }
                param.data = JSON.stringify(param.data);
                if (this.currentService&&Number(this.currentService.num)<=0){
                    uni.showToast({
                        title: '暂无可售后的商品',
                        duration: 500,
                        icon: 'none'
                    })
                    return false
                }
                if (this.subLock){
                    uni.showToast({
                        title: '请勿重复提交',
                        duration: 500,
                        icon: 'none'
                    })
                    return false
                }
                // 加锁
                this.subLock = true;
                uni.showLoading();
                that.$request(param).then(res => {
                    uni.hideLoading();
                    if (res.state == 200) {
                        // that.$api.msg(res.msg);
                        that.subLock = false;
                        this.showAfterTips();
                    } else {
                        that.subLock = false;
                        that.$api.msg(res.msg);
                    }
                })
                break;
            }
            default:
            }
        },
        // 回退失败的处理,要更新可售性
        async onfiled(orderSn,orderProductId){
            // 获取可售后性
            let serviceCheckList = await this.getAfsServiceCheck(orderSn);
            let currentService = serviceCheckList.find(e=>e.orderProductId == orderProductId);
            this.currentService = currentService;
        },
        // 获取返回方式
        getAfsServiceReverseExpress(){
            return new Promise((resolve) => {
                let param = {};
                param.url = 'v3/postsale/front/after/sale/apply/afsServiceReverseExpress';
                param.data = {};
                param.data.orderProductId = this.orderProductId;
                this.$request(param).then(res=>{
                    if (res.state==200){
                        resolve(res.data)
                        const { data } = res
                        if (data.length>0){
                            this.returnMode = data;
                            this.pickWareType = data[0].value
                        } else {
                            this.returnMode = []
                            this.pickWareType = ''
                        }
                            
                    }
                }).catch(() => {
                    resolve([])
                })
            })
        },
        //去商品详情页
        goProductDetail(sku) {
            this.$Router.push({
                path: '/standard/product/detail',
                query: { sku }
            })
        },
        //删除图片
        delImg(curItem, curIndex) {
            this.uploadFiles.splice(curIndex, 1);
            this.upLoadFile.splice(curIndex, 1);
        },

        // 返回方式弹窗
        openReturnMode(){
            this.$refs.returnModePopup.open();
        },
        // 关闭返回方式弹窗
        closeReturnMode(){
            this.$refs.returnModePopup.close();
        },
        // 切换返回方式
        changeReturnMode(e){
            this.pickWareType = e.target.value
        },
        // 编辑地址 data可能为空
        operateAddress(type,data) {
            const query = {type}
            if (data){
                query.data = JSON.stringify(data)
            } else {
                query.data = ''
            }
            this.$Router.push({path:'/views/order/detail/address',query})
        },
        switchChange(e) {
            this.isDefaultAddress = e.detail.value;
        },
        // 编辑地址的回调
        editAddress(type,data){
            if (type=='take'){
                this.pickWareAddress = data
            } else if (type=='recept'){
                this.receiveWareAddress = data
            }
        },
        checkMpass(){
            let that = this;
            sinosdk.sino.getBridgeType().then(res=>{
                if (res==="mpaas"){ // 判断是不是mpass 用来判断上传
                    that.isMpaasFileUpload = true;
                } else {
                    that.isMpaasFileUpload = false;
                }
            }).catch(err=>{
                console.log(err)
            })
        },
        // 显示售后提示
        showAfterTips(){
            this.$refs.afterTips.open();
        },
        // 关闭售后提示
        closeAfterTips(){
            this.$refs.afterTips.close();
            this.readedTips()
        },
        // 看了提示后操作 即以前的跳转逻辑复制过来的
        readedTips(){
            let that = this
            let pages = getCurrentPages();
            // 订单列表页->订单详情页->选择服务页->申请退款页(本页)
            // 售后列表页->售后详情页->选择服务页->申请退款页(本页)
            if (that.backSource == 'orderDetail'){
                try {
                    let beforePage = pages[pages.length - 3]; //上两页
                    beforePage.$vm.getOrderDetail(); //更新上两页数据 订单详情页面
                    setTimeout(()=>{ this.$Router.back(2) },500);
                } catch (error) {
                    this.onfiled(that.orderProduct.orderSn,that.orderProduct.orderProductId)
                    // 如果回退失败,直接上回一页
                    this.$Router.back(1)
                }
            }
            // 从礼物详情页来 
            else if (that.backSource == 'giftDetail'){
                uni.$emit('afsCheck');
                // 等待getAfsServiceCheck接口加载的差不多的再跳转
                setTimeout(() => { this.$Router.back(2) }, 500);
            } 
            else if (that.backSource == 'refundDetail'){
                uni.$emit('afsCheck');
                // 先更新售后列表页,可能更新失败 ,因为从消息推送过来没有进售后列表页 ,还有pc刷新history加1的bug
                try {
                    let beforePage = pages[pages.length - 4]; //上三页 售后列表页
                    beforePage.$vm.updataList(); //售后列表数据
                } catch (error) {
                    console.log('售后列表更新失败')
                }
                // 跳转到售后详情页
                try {
                    let beforePage = pages[pages.length - 3]; //上两页
                    beforePage.$vm.getOrderDetail(); // 售后详情页
                    setTimeout(()=>{ this.$Router.back(2) },500);
                } catch (error) {
                    this.onfiled(that.orderProduct.orderSn,that.orderProduct.orderProductId)
                    // 如果回退失败,直接上回一页
                    this.$Router.back(1);
                }
            } else {
                // 如果绕过直接返回上一页
                this.$Router.back(1)
            }
        }
            
    }
}
</script>

<style lang='scss'>
    page {
        background: $bg-color-split;
        width: 750rpx;
        margin: 0 auto;
    }

    uni-page-body {
        display: flex;
        height: 100%;
    }

    .content {
        position: relative;
        background: #fff;
        margin-top: 20rpx;
        width: 100%;
        height: 100%;
        overflow: auto;
        &:after{
            content: '';
            display: block;
            height: calc(150rpx + var(--safe-area-inset-bottom));
        }
        .order_tips {
            line-height: 36rpx;
            font-size: 28rpx;
            background-color: var(--orderTipsBg);
            color: var(--tagColor);
            padding: 14rpx 30rpx;
            word-wrap: break-word;
        }
        .apply_refund_content {
            box-sizing: border-box;
            background: #FFFFFF;

            /* height: 100%; */
            .refund_goods {
                display: flex;
                margin-left: 20rpx;
                padding: 20rpx 20rpx 20rpx 0;
                border-bottom: 1rpx solid #F0F0F0;

                .refund_goods_image {
                    width: 140rpx;
                    height: 140rpx;
                    margin-right: 20rpx;
                    background: #F3F3F3;
                    border-radius: 14rpx;

                    .image {
                        background-position: center center;
                        background-repeat: no-repeat;
                        background-size: cover;
                        width: 140rpx;
                        height: 140rpx;
                        border-radius: 14rpx;
                    }
                }

                .refund_goods_des {
                    display: flex;
                    flex-direction: column;
                    padding-top: 19rpx;

                    .refund_goods_name {
                        width: 530rpx;
                        font-size: 28rpx;
                        
                        font-weight: 500;
                        color: #333333;
                        line-height: 39rpx;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        word-break: break-all;
                        margin-bottom: 17rpx;
                    }

                    .refund_goods_spec {
                        font-size: 26rpx;
                        
                        font-weight: 400;
                        color: #949494;
                        line-height: 30rpx;
                    }
                }
            }

            .batch_apply_list {
                display: flex;
                align-items: center;
                border-bottom: 1rpx solid #F5F5F5;

                .batch_apply_pre {
                    display: flex;
                    flex-direction: column;
                    padding: 0 20rpx;
                    box-sizing: border-box;
                    margin-bottom: 30rpx;
                    margin-top: 20rpx;
                    width: 180rpx;
                    border-right: 1rpx solid #F5F5F5;

                    .batch_apply_pre_image {
                        width: 140rpx;
                        height: 140rpx;
                        background: #F3F3F3;
                        border-radius: 14rpx;

                        .image {
                            background-position: center center;
                            background-repeat: no-repeat;
                            background-size: cover;
                            width: 140rpx;
                            height: 140rpx;
                            border-radius: 14rpx;
                        }
                    }

                    .batch_apply_pre_num {
                        font-size: 26rpx;
                        
                        font-weight: 400;
                        color: #343434;
                        line-height: 39rpx;
                        margin-top: 20rpx;
                        text-align: center;
                    }
                }
            }

            .batch_refund {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 20rpx;
                box-sizing: border-box;
                height: 100rpx;

                .batch_refund_title {
                    font-size: 28rpx;
                    
                    font-weight: 500;
                    color: #333333;
                    line-height: 39rpx;
                }

                .batch_refund_opt {
                    display: flex;
                    align-items: center;

                    text {
                        font-size: 26rpx;
                        
                        font-weight: 400;
                        color: #999999;
                        line-height: 39rpx;
                    }

                    image {
                        width: 14rpx;
                        height: 24rpx;
                        margin-left: 19rpx;
                    }
                }
            }

            .refund_reason_des {
                border-top: 20rpx solid #F5F5F5;

                .refund_reason {
                    display: flex;
                    height: 100rpx;
                    margin-left: 20rpx;
                    padding-right: 20rpx;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1rpx solid #ECECEC;

                    .refund_reason_left {
                        display: flex;
                        align-items: center;
                        font-size: 28rpx;
                        
                        font-weight: 500;
                        line-height: 39rpx;
                        color: #333333;

                        text:nth-child(1) {
                            color: var(--tagColor);
                            margin-right: 5rpx;
                        }
                    }

                    .refund_reason_right {
                        display: flex;
                        align-items: center;
                        ::v-deep .uni-switch-input{
                            background-color: var(--tagColor) !important;
                            border-color: var(--tagColor) !important;
                        }
                        text {
                            font-size: 26rpx;
                            
                            font-weight: 400;
                            color: #949494;
                            line-height: 39rpx;
                        }

                        image {
                            width: 14rpx;
                            height: 24rpx;
                            margin-left: 19rpx;
                        }

                        .relative-left{
                            position: relative;
                            left: 20rpx;
                        }
                    }
                }

                .refund_reason:nth-last-of-type(1) {
                    border-bottom: none;
                }

                .address {
                    display: flex;
                    margin-left: 20rpx;
                    padding-right: 20rpx;
                    min-height: 100rpx;
                    align-items: center;
                    font-size: 28rpx;
                    .address-left {
                        flex: 1;
                        .mobile{
                            margin-left: 8rpx;
                        }
                    }
                    .address-right {
                        width: 14rpx;
                        height: 24rpx;
                        image {
                            width: 14rpx;
                            height: 24rpx;
                        }
                    }
                }
            }

            .refund_info {
                border-top: 20rpx solid #F5F5F5;
                padding: 30rpx 20rpx 0rpx 20rpx;
                box-sizing: border-box;

                .refund_amount {
                    display: flex;
                    align-items: center;

                    .refund_amout_title {
                        font-size: 26rpx;
                        
                        font-weight: 500;
                        color: #333333;
                        line-height: 24rpx;
                    }

                    .refund_amount_price {
                        font-size: 24rpx;
                        
                        font-weight: 500;
                        color: #333333;
                        line-height: 24rpx;
                        display: inline-block;

                        text:nth-child(2) {
                            font-size: 26rpx;
                        }

                        input {
                            font-size: 26rpx;
                        }
                    }
                }

                .refund_amount_edit {
                    margin-bottom: 20rpx;
                }

                .refund_amount_limit {
                    font-size: 24rpx;
                    
                    font-weight: 500;
                    color: #BBBBBB;
                    line-height: 24rpx;
                    margin: 30rpx 0;
                }

                .refund_number {
                    display: inline-block;
                    font-size: 26rpx;
                    
                    font-weight: 500;
                    color: #333333;
                    line-height: 24rpx;

                    text:nth-child(1) {
                        margin-right: 10rpx;
                    }
                }

                .refund_number1 {
                    display: flex;
                    align-items: center;

                    .refund_number1_title {
                        font-size: 26rpx;
                        
                        font-weight: 500;
                        color: #333333;
                        line-height: 24rpx;
                    }

                    .refund_number_edit {
                        margin-right: 10rpx;
                        display: flex;
                        align-items: center;

                        text {
                            width: 51rpx;
                            height: 50rpx;
                            font-size: 24rpx;
                            
                            font-weight: 400;
                            color: #949494;
                            line-height: 50rpx;
                            border: 1rpx solid #E7E7E7;
                            text-align: center;
                        }

                        input {
                            height: 50rpx;
                            width: 78rpx;
                            font-size: 24rpx;
                            
                            font-weight: 500;
                            color: #2D2D2D;
                            line-height: 50rpx;
                            text-align: center;
                            border-top: 1rpx solid #E7E7E7;
                            border-bottom: 1rpx solid #E7E7E7;
                        }
                    }
                }

                .refund_instructions {
                    display: flex;
                    align-items: center;
                    margin: 30rpx 0;
                    .uni-input-wrapper .uni-input-placeholder{
                        overflow:visible;
                    }
                    text {
                        font-size: 26rpx;
                        
                        font-weight: 500;
                        color: #333333;
                        line-height: 24rpx;
                        white-space: nowrap;
                    }

                    input {
                        font-size: 26rpx;
                        
                        font-weight: 500;
                        color: #949494;
                        line-height: 24rpx;
                        margin-left: 10rpx;
                        width: 580rpx;
                    }
                }
            }
        }

        .upload_voucher {
            border-top: 20rpx solid #F5F5F5;
            padding: 30rpx 20rpx;

            .upload_voucher_title {
                font-size: 26rpx;
                
                font-weight: 500;
                color: #333333;
                margin-bottom: 30rpx;
            }

            .upload_voucher_con1 {
                display: flex;
                flex-wrap: wrap;
                overflow-x: auto;
                overflow-y: hidden;
                white-space: nowrap;
                /* 解决ios手机页面滑动卡顿问题 */
                -webkit-overflow-scrolling: touch;

                .upload_img {
                    width: 160rpx;
                    height: 170rpx;
                    margin: 0 20rpx 20rpx 0;
                    position: relative;
                    padding-top: 10rpx;

                    &:nth-child(4n) {
                        margin-right: 0;
                    }

                    .image:nth-child(1) {
                        background-position: center center;
                        background-repeat: no-repeat;
                        background-size: cover;
                        width: 152rpx;
                        height: 152rpx;
                    }

                    image:nth-child(2) {
                        width: 30rpx;
                        height: 30rpx;
                        position: absolute;
                        top: 0rpx;
                        right: -10rpx;
                    }
                }

                .upload_voucher_con {
                    padding-top: 10rpx;

                    .upload_image {
                        width: 156rpx;
                        height: 156rpx;
                        border: 2rpx solid #eeeeee;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;

                        image {
                            width: 50rpx;
                            height: 40rpx;
                        }

                        text {
                            font-size: 26rpx;
                            
                            font-weight: 400;
                            color: #949494;
                            margin-top: 17rpx;
                        }

                        .upload_limit {
                            font-size: 20rpx;
                            
                            font-weight: 400;
                            color: #949494;
                            margin-top: 9rpx;
                        }
                    }
                }
            }
        }

        .upload_voucher::-webkit-scrollbar {
            display: none
        }

        .return_mode {
            border-top: 20rpx solid #F5F5F5;
            padding: 30rpx 20rpx;
        }

        .submit {
            width: 750rpx;
            position: fixed;
            margin: 0 auto;
            z-index: 10;
            background:#fff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: calc(120rpx + var(--safe-area-inset-bottom));
            padding-bottom: calc(var(--safe-area-inset-bottom));
            bottom: 0rpx;
            right: 0;
            left: 0;

            .text {
                width: 668rpx;
                height: 88rpx;
                background: var(--seckillBtnBg);
                border-radius: 44rpx;
                font-size: 36rpx;
                
                font-weight: 500;
                color: var(--confirmBtnTextColor);
                line-height: 88rpx;
                text-align: center;
            }
        }

        .cancel_popup {
            width: 100%;
            height: 100%;
            background: #FFFFFF;
            width: 100% !important;

            .popup_top {
                height: 100rpx;
                width: 100%;
                display: flex;
                padding: 0 30rpx 0 30rpx;
                align-items: center;
                border-bottom: 1rpx solid #F8F8F8;
                justify-content: space-between;

                text {
                    font-size: 32rpx;
                    
                    font-weight: 500;
                    color: #343434;
                    line-height: 32rpx;
                }

                image {
                    width: 30rpx;
                    height: 30rpx;
                }
            }

            .cancel_list {
                height: 100%;
                background: #FFFFFF;
                padding-bottom: calc(120rpx + var(--safe-area-inset-bottom));

                .cancle_pre {
                    width: 100%;
                    padding: 29rpx 40rpx;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-between;
                    ::v-deep .uni-radio-input-checked{
                        border-color: var(--radioCheckedColor) !important;
                        background-color: var(--radioCheckedColor) !important;
                    }
                    text {
                        font-size: 28rpx;
                        
                        font-weight: 500;
                        color: #666666;
                        line-height: 32rpx;
                    }
                }
            }

            .cancel_popup_btn {
                position: fixed;
                bottom: 0rpx;
                z-index: 30;
                display: flex;
                width: 100%;
                height: calc(120rpx + var(--safe-area-inset-bottom));
                padding-bottom: calc(var(--safe-area-inset-bottom));
                justify-content: center;
                align-items: center;
                background: #ffffff;

                .confrim_btn {
                    width: 668rpx;
                    height: 80rpx;
                    background: var(--seckillBtnBg);
                    border-radius: 44rpx;
                    font-size: 30rpx;
                    
                    font-weight: 600;
                    color: var(--confirmBtnTextColor);
                    line-height: 80rpx;
                    text-align: center;
                }
            }
        }

        .afterTips_box{
            width: 524rpx;
            position: relative;
            border-radius: 14rpx;
            background: #ffffff;
            .afterTips_title{
                padding-top: 34rpx;
                padding-bottom: 34rpx;
                font-size: 0.3rem;
                font-weight: 500;
                color: #333;
            }
            .afterTips_content{
                padding: 0 40rpx 40rpx 40rpx;
                font-size: 0.28rem;
                color: #666;
            }
            .close{
                width: 100%;
                height: 80rpx;
                border-top: 2rpx solid rgba(0, 0, 0, 0.05);
                view{
                    width: 100%;
                    height: 100%;
                    font-size: 0.3rem;
                    text-align: center;
                    color: var(--tagColor);
                }
            }
        }
    }
</style>