<!-- 提交订单页面的选择发票信息弹窗页-->
<template>
    <div class="edit-container">
        <section class="main-box">
            <div class="tips-box" v-show="showTips">
                <p>订单只能原价且仅支持修改一次，敬请谅解！</p>
                <span @click="showTips=false">
                    <Icon type='btn_common_close_red' size='0.24rem' ></Icon>
                </span>
            </div>
            <div class="sub-part">
                <div class="box-title">
                    <span class="title-text">修改收货人信息</span>
                    <p class="address-text-box" @click="showAddressChooseModel = true">
                        <Icon type='icon_clockin_locatoion' size='0.32rem' ></Icon>
                        <span class="address-text">切换地址</span>
                    </p>
                </div>
                <div class="form-item">
                    <span class="form-label">收货人：</span>
                    <input class="form-input" v-model="orderInfo.username"/>
                </div>
                 <div class="form-item">
                    <span class="form-label">联系方式：</span>
                    <input class="form-input" v-model="orderInfo.tel"/>
                </div>
                 <div class="form-item">
                    <span class="form-label">所在地：</span>
                    <div class="form-address-item">
                        <p>
                            <span class="province">{{orderInfo.addressInfo.province}}</span>
                            <span class="city">{{orderInfo.addressInfo.city}}</span>
                            <span class="distict">{{orderInfo.addressInfo.distict}}</span>
                        </p>
                        <Icon type='icon_common_rightarrow' size='0.28rem' ></Icon>
                    </div>
                </div>
                 <div class="form-item">
                    <span class="form-label">详细地址：</span>
                    <input class="form-input" v-model="orderInfo.address"/>
                </div>
            </div>
        </section>
        <div class="bot-tips-box">
            <Icon type='icon_common_prompt' size='0.24rem' ></Icon>
            <p>修改地址可能会影响物流时效，请以时间配送为准</p>
        </div>
        <div class="btn-box">
            <div class="btn-handler cursor-btn" @click="confirm">
                <span class="btn-text">提交</span>
            </div>
        </div>


        <div v-transfer-dom>
            <popup v-model="showAddressChooseModel" height='65%'>
                <AddressChooseComp 
                    v-if='showAddressChooseModel' 
                    @closePopup = 'closeAddressChooseModel'
                    @chooseAddressFromList='selectAddressFromList'
                    :selectID = 'selectedAddressID'
                    :showOtherBtn='showOtherBtn'
                ></AddressChooseComp>
            </popup>
        </div>
    </div>
</template>

<script>
const Icon = ()=>import('commonComp/base/Icon.vue');
const AddressChooseComp = ()=>import('common/components/base/AddressChooseComp.vue');
import orderHandler from 'common/lib/requestHandler/orderHandler.js';
import { Popup, TransferDom  } from 'vux';
export default {
    name:'orderEdit',
    components: {
        Icon,
        Popup,
        AddressChooseComp
    },
    directives: {
        TransferDom
    },
    props: {
    
    },
    data(){
        return {
            orderNo: this.$route.query.orderNo || '',//参数传递的orderNo
            showOtherBtn:false,
            showAddressChooseModel:false,
            showTips:true,
            orderInfo:{
                username:'刘德华',
                tel:'18912345678',
                address:'深业泰然大厦C座890室',
                addressInfo:{
                    province:'广东',
                    city:'深圳市',
                    distict:'福田区'
                }
            },


        }
    },
    created(){
        this.initData();
    },
    methods: {
        initData(){
            let that = this;
            if(!!that.orderNo){
                that.$loading.show();
                orderHandler.getReceiverInfo({orderNo: that.orderNo}).then(res=>{
                    that.$loading.hide();
                    if(res.resultCode == 0){
                       console.log('res', res);
                    }
                }).catch(e=>{
                    that.$loading.hide();
                    console.log(e);
                }) 
            }
        },
        
        /**
         * 关闭地址选择的弹窗
         */
        closeAddressChooseModel(){
            this.showAddressChooseModel = false;
        },
        /**
         * 地址列表选择地址后处理
         */
        selectAddressFromList(id,address){
            this.selectedAddressID = id;
            this.showAddressChooseModel = false;
        },
        /**
         * 提交操作处理
         */
        confirm(){
            
        },
        //判断一个字符串是否为空
        isEmpty(param){
            if(typeof param == "undefined" || param == null || param == ""){
                return true;
            }else{
                return false;
            }
        },
        //检查必填项是否都填了  且格式是否正确
        checkEmpty(){
            return true;
        },

        //判断手机号格式正确性
        isTel(TEL) {
            var strTemp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
            if (strTemp.test(TEL)) {
                return true;
            }
            return false;
        },
    }
};
</script>

<style scoped lang="less">
@import '~themes/default/styles/order/orderList/orderEdit.less';
</style>