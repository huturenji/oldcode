<template>
    <view class="content">
        <view class="row b-b">
            <text class="tit hasStar">{{$L('联系人')}}</text>
            <input class="input" maxlength='10' type="text" v-model="addressData.memberName" :placeholder="$L('请输入收货人姓名')"
             placeholder-class="placeholder" />
            <view class='person-icon' @click="addTchatUser"></view>
        </view>
        <view class="row b-b">
            <text class="tit hasStar">{{$L('联系电话')}}</text>
            <input class="input" maxlength='13' type="text" @input="trimFun(addressData.telMobile, 'telMobile')" v-model="addressData.telMobile" :placeholder="$L('请输入手机号')"
             placeholder-class="placeholder" @focus='onfocus'/>
        </view>
        <view class="row b-b">
            <text class="addressTitle">{{$L('您可以一键导入公司共享地址')}}</text>
            <text @click="openshareAddress" class="btn">导入地址</text>
        </view>
        <view class="row b-b">
            <text class="tit hasStar">{{$L('所在地区')}}</text>
            <text @click="chooseArea" :class="addressData.addressAll==$L(`请选择所在地区`)? 'input placeholder1':'input'">
                {{addressData.addressAll}}
            </text>
            <view class='location' @click="openAddressMap">
                <text class="iconfont icon_position"></text>
                定位
            </view>
        </view>
        <view class="row b-b">
            <text class="tit hasStar">{{$L('详细地址')}}</text>
            <input class="input" type="text" v-model="addressData.detailAddress" :placeholder="$L('请输入详细地址,建议5～60字')" maxlength='60'
             placeholder-class="placeholder" />
        </view>

        <view>
            <tagsCom ref="tagsComp" :tagObj="tagObj" @tagTransfer="tagTransfer" />
        </view>

        <view v-if="showShareAddressTips" class="share-address-tips">
            <view @click="isCheckShare=!isCheckShare" class="icon">
                <text class="iconfont check-icon" :class="[dealClass()]"></text>
            </view>
            <view class="share-content">
                <p class="title">共享到公司共享地址</p>
                <p class="tips">公司所有同事都可使用该地址</p>
            </view>
        </view>

        <view class="row default_row">
            <text class="tit">{{$L('设为默认地址')}}</text>
            <switch style="transform: scale(0.8,0.8)" :checked="addressData.isDefault" @change="switchChange" />
        </view>

        <view class="addressAnalyse">
            <view class="addressTitle">{{$L('智能填写')}}</view>
            <addressAnalyse ref='addressAnalyse' @analyse='onAddressAnalyse'></addressAnalyse>
        </view>

        <button class="add_btn flex_row_center_center" @click="confirm" :style="{top:windowHeight - 80 + 'px'}">{{$L('提交')}}</button>
        <selectAddress ref='selectAddress' :sel_data='selAddressData' @selectAddress="successSelectAddress" @changeValid="addressData.valid = true"></selectAddress>
    </view>
</template>

<script>
import selectAddress from '@/components/address/linkselect';
import addressAnalyse from '@/components/address/analysis';
import tagsCom from './tags.vue'; //地址标签组件
import {
    mapState
} from 'vuex';
import config from '@/common/lib/config'
import addressHandler from '@/components/address/handler';
import { throttle } from '@/utils/common';
// #ifdef H5
const MASKING_TYPE = SnUtils.DataMasking.MASKING_TYPE;
const maskingText = SnUtils.DataMasking.maskingText;
// #endif
const ISDECORATE = config.ISDECORATE;
let flagNum = {
    telMobile:1
}; //用来判断脱敏的状态，第一次会显示脱敏,只要动了input框就不显示脱敏了

export default {
    components: {
        selectAddress,
        addressAnalyse,
        tagsCom
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            addressData: {
                memberName: '',
                telMobile: '',
                addressAll: '请选择所在地区',
                detailAddress: '',
                isDefault: false,
                addressId: '', //编辑收货地址时的id
                tags:'', //标签
                valid: true, // 地址是否失效标识 false = 失效
                splitTimeout:1000
            },
            selAddressData: [],
            windowHeight:'',
            tagObj: {name:''}, //标签的对象
            saveTagObj:{name:''}, //保存标签的对象
            showShareAddressTips:false, //是否显示共享地址勾选框
            isCheckShare:false, //共享地址勾选状态
            copyAddressData:{}, // 对addressData中的telMobile的第一次接口返回的备份
            isAddFlag:true//默认可以添加地址
        }
    },

    mounted(){
        let title = '';
        flagNum.telMobile = 1;
        if (this.$Route.query.type === 'edit') {
            title = '编辑收货地址'
            this.addressData.addressId = this.$Route.query.addressId;
            this.getAddressDetail();
        } else if (this.$Route.query.type === 'checkEdit') {
            title = '编辑地址'
            this.addressData.addressId = this.$Route.query.addressId;
            this.getAddressDetail();
        } else {
            title = "新增收货地址";
        }
        this.manageType = this.$Route.query.type;
        this.$forceUpdate()
        setTimeout(()=> {
            uni.setNavigationBarTitle({
                title
            }); 
        },100)
        
        uni.getSystemInfo({
            success:(res)=>{
                this.windowHeight = res.windowHeight;
            }
        });
    },
    computed: {
        ...mapState(['userInfo','addressList'])
    },
    watch: {
        saveTagObj: {
            handler(val){
                this.isCheckShare = false;
                if (val && Object.keys(val).length > 0 && val.code && val.code == 'company'){
                    this.showShareAddressTips = true;
                } else {
                    this.showShareAddressTips = false;
                }
            },
            deep: true
        }
    },
    methods: {
        switchChange(e) {
            this.addressData.isDefault = e.detail.value;
        },
        dealClass(){
            return `${this.isCheckShare?'icon_checked checked':'icon_check'}`
        },
        chooseArea() {
            if (this.addressData.addressAll == "请选择所在地区"){
                this.$refs.selectAddress.show()
            } else {
                this.$refs.selectAddress.open()
            }
        },
        successSelectAddress(address) { //选择成功回调
            this.selAddressData = address;
            // 修复 当初始化地址四级联动的时候，如果地址是失效的，此时第一次是不回显省市区选择联动的，为了告知用户是该处四级联动的地址失效了，叫用户重新选择四级联动地址，否则用户不知道哪里失效了
            if(this.addressData.valid == true){
                this.addressData.addressAll = ''
                address.forEach((item) => {
                    this.addressData.addressAll += item.name;
                })
            }
            this.addressData.valid = true;
        },
        //输入校验
        trimFun(newVal, type){
            setTimeout(()=>{
                this.$set(this.addressData, type, this.strTrim(newVal));
            },0)
        },
        onfocus(){
            if (flagNum.telMobile==1&&(this.$Route.query.type === 'edit'||this.$Route.query.type === 'checkEdit')&&ISDECORATE){
                this.addressData.telMobile = '';
                flagNum.telMobile++
            }
        },
        //去除字符串内所有的空格,非数字字符
        strTrim(str){
            if (!str){ return str }
            return str.replace(/[^0-9]/g, '');
        },
        //获取收货地址详情
        getAddressDetail() {
            addressHandler.getAddressDetail({
                addressId: this.addressData.addressId
            }).then(res => {
                if (res.state == 200) {
                    let result = res.data;
                    this.addressData.memberName = result.memberName;
                    this.addressData.telMobile = ISDECORATE?maskingText(MASKING_TYPE.TEL,result.telMobile):result.telMobile;
                    if (this.$Route.query.type === 'checkEdit') {
                        this.addressData.addressAll = '请选择所在地区';
                        this.addressData.detailAddress = '';
                    } else {
                        this.addressData.addressAll = result.addressAll;
                        this.addressData.detailAddress = result.detailAddress;
                    }
                    
                    if(result.valid === false){ // 失效地址
                        this.addressData.addressAll = '请选择所在地区';
                        this.addressData.valid = false;
                    }
                    this.addressData.isDefault = result.isDefault ? true : false;
                    this.copyAddressData.telMobile = result.telMobile;
                    this.selAddressData = [{
                        code: result.provinceCode,
                        name: ''
                    }, {
                        code: result.cityCode,
                        name: ''
                    }, {
                        code: result.districtCode,
                        name: ''
                    },{
                        code: result.townCode,
                        name: ''
                    } ];
                    this.tagObj = this.saveTagObj = {
                        name: result.tags || ''
                    }
                    this.$refs.selectAddress.autoAddressSel()
                    //初始化地址选择组件
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
            })
        },

        //提交
        async confirm() {
            let data = JSON.parse(JSON.stringify(this.addressData));
            if (flagNum.telMobile==1&&(this.$Route.query.type === 'edit'||this.$Route.query.type === 'checkEdit')&&ISDECORATE){
                data.telMobile = this.copyAddressData.telMobile
            }
            if (!data.memberName.trim()) {
                this.$api.msg('请填写收货人姓名');
                return;
            }
            if (!this.$checkMobile(data.telMobile)) {
                return;
            }
            if (data.addressAll=='请选择所在地区') {
                this.$api.msg('请选择所在地区');
                return;
            }
            if (!data.detailAddress.trim()) {
                this.$api.msg('请填写详细地址');
                return;
            } else if (data.detailAddress.length < 5) {
                this.$api.msg('详细地址至少填写5个字');
                return;
            }
                
            let apiType = data.addressId ? 'editAddress' : 'addAddress';
            let param = {};
            let configRequest = {};
            param.key = this.userInfo.access_token;
            param.memberName = data.memberName; //收货人
            param.provinceCode = this.selAddressData[0].code; //省份编码
            param.cityCode = this.selAddressData[1].code; //城市编码
            param.districtCode = this.selAddressData[2] ? (isNaN(parseInt(this.selAddressData[2].code))? '': this.selAddressData[2].code) : ''; // 区域编码
            param.townCode = this.selAddressData[3] ? (isNaN(parseInt(this.selAddressData[3].code))? '': this.selAddressData[3].code) : ''; //镇街道编码
            param.addressAll = data.addressAll; //所在地区
            param.detailAddress = data.detailAddress; //详细地址
            param.telMobile = data.telMobile; //联系电话
            param.isDefault = data.isDefault ? 1 : 0; //是否设为默认地址（0非默认地址 1默认地址）
            param.tags = this.saveTagObj.name || ''; //设置标签
            param.share = (this.showShareAddressTips && this.isCheckShare) ? true : false; //设置是否共享地址
            if (data.addressId) {
                param.addressId = data.addressId;
            }
            configRequest.unitKey = apiType;
            configRequest.requestFun = addressHandler[apiType];
            let result = {
                provinceCode: this.selAddressData[0]?.code,
                cityCode: this.selAddressData[1]?.code,
                districtCode: this.selAddressData[2]?.code,
                townCode: this.selAddressData[3]?.code
            };
            this.isAddFlag = await this.addressFlag(result,"JD")
            if (!this.isAddFlag){
                this.$nextTick(() =>{
                    uni.showToast({
                        title: '所选地区已失效，请重新选择',
                        icon:'none'
                    })
                    this.$refs.selectAddress.show()
                })
                return
            }
            uni.showLoading();
            // 全局混入的 requestMixin.js
            this.requestOnce(param, configRequest).then(res => {
                uni.hideLoading();
                this.$api.msg(res.msg);
                if (res.state == 200) {
                    // 更新地址
                    this.$store.dispatch('getAddressList').then(() => {
                        if (this.$Route.query.type === 'checkEdit'){
                            uni.$emit('checkEdit')
                        }
                        setTimeout(() => {
                            this.$Router.back(1)
                        }, 800)
                    })
                } else {
                    //错误提示
                    uni.hideLoading();
                    this.$api.msg(res.msg);
                    this.onceLock?.release(configRequest.unitKey)
                }
            }).catch(()=>{
                this.onceLock?.release(configRequest.unitKey)
            })

        },
        //地址校验接口
        addressFlag(adressCode,Type){
            return new Promise((resolve) => {
                let param = {}
                param.data = {
                    provinceCode: adressCode.provinceCode,
                    cityCode:  adressCode.cityCode,
                    districtCode:  adressCode.districtCode,
                    townCode:  adressCode.townCode,
                    supplierType:  Type
                }
                param.header = {
                    "Content-Type": "application/json"
                };
                param.url = 'v3/member/front/memberAddress/addressCheck'
                param.method = 'POST'
                this.$request(param).then(res => {
                    if (res.state == 200) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
            })
        },
        async onAddressAnalyse(result){
            this.selAddressData = [
                {
                    code: result.provinceCode,
                    name: result.province
                },
                {
                    code: result.cityCode,
                    name: result.city
                },
                {
                    code: result.districtCode?result.districtCode:'',
                    name: result.county
                },
                {
                    code: result.townCode?result.townCode:'',
                    name: result.town
                }

            ];
            //拼接地区、地址
            this.addressData.addressAll = ''
            if (result.province){
                this.addressData.addressAll += result.province
            }
            if (result.city){
                this.addressData.addressAll += result.city
            }
            if (result.county){
                this.addressData.addressAll += result.county
            }
            if (result.town){
                this.addressData.addressAll += result.town    
            }
            if (result.phone){
                this.addressData.telMobile = result.phone
            }
            if (result.name){
                this.addressData.memberName = result.name
            }
            this.addressData.detailAddress = result.exactAddress;
            //拿到地址就开始反选，无论反选是否成功
            this.$refs.selectAddress.autoAddressSel()


        },

        openAddressMap(){
            this.$Router.push({path:'/pages/address/addresslocation'})
        },
        openshareAddress(){
            this.$Router.push({path:'/pages/address/shareaddress'})
        },

        /**
             * 添加T信用户
             * @param {Object} sIdArr  已经选择用户Id集合
             * @param {Object} sModel  选择模式 0-单选 1-多选
             * @param {Object} sKey    from_key  默认为9
             */
        addTchatUser() {
            let that = this;
            let Ids = [];
            setTimeout(() => {
                throttle(() => {
                    sinosdk.sino.contacts(Ids, 0).then((data) => {
                        if (0 < data.length) {
                            try {
                                let selectUser = data[0];
                                that.addressData.memberName = selectUser.uName;
                                that.addressData.telMobile = selectUser.uPhone;
                            } catch (e) {
                                console.log('从通讯录中获取人员信息失败')
                            }
                        }
                    });
                }, this.splitTimeout)
            }, this.splitTimeout)
        },

        /**
              * 选择tag后更新tags对象
              */
        tagTransfer(value){
            this.saveTagObj =JSON.parse(JSON.stringify(value));
        }

    }
}
</script>

<style lang="scss">
    page {
        background: $bg-color-split;
        padding-top: 20rpx;
        width: 750rpx;
        margin: 0 auto;
    }
    .content{
        position: relative;
        overflow: auto;
    }

    .b_b {
        &:after {
            position: absolute;
            z-index: 3;
            left: 20rpx;
            right: 0;
            height: 0;
            content: '';
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
            border-bottom: 1px solid rgba(0, 0, 0, .1);
        }
    }

    .addressTitle{
        font-size: 28rpx;
    }

    .row {
        display: flex;
        align-items: center;
        position: relative;
        padding: 0 30rpx;
        height: 100rpx;
        background: #fff;

        &.b-b {
            &:after {
                position: absolute;
                z-index: 3;
                left: 20rpx;
                right: 0;
                height: 0;
                content: '';
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
                border-bottom: 1px solid rgba(0, 0, 0, .1);
            }
        }
        
        .hasStar :after {
            content: "*";
            color: var(--tagColor) !important;
            font-size: .32rem;
        }

        .tit {
            flex-shrink: 0;
            min-width: 150rpx;
            font-size: 28rpx;
            color: #333;
        }

        .input {
            flex: 1;
            font-size: 30rpx;
            color: #333;
            font-weight: 600;
        }

        .location{
            text-align: center;
            font-size: 22rpx;
            color: #999;
            .icon_position{
                font-size: 40rpx;
                display: flex;
            }
        }

        .person-icon{
            background: url("@/static/shared/common/icon/btn_conmmon_phone.svg") center no-repeat;
            background-size: contain;
            width: 40rpx;
            height:40rpx;
        }
    }

    .default_row {
        margin-top: 20rpx;
        ::v-deep .uni-switch-input-checked{
            background-color: var(--tagColor) !important;
            border-color: var(--tagColor) !important;
        }

        .tit {
            flex: 1;
        }

        switch {
            transform: translateX(16rpx) scale(.9);
        }
    }

    .add_btn {
        position: fixed;
        font-size: 34rpx;
        color: var(--confirmBtnTextColor);
        width: 668rpx;
        height: 88rpx;
        background: var(--confirmBtnBgColor2);
        border-radius: 44rpx;
        right: 0;
        left: 0;
        margin: 0 auto;
    }
    .placeholder1{
        color: #949494!important;
        font-size: 26rpx!important;
    }
    .addressAnalyse{
      margin-top: 20rpx;
      padding: 20rpx 30rpx 150rpx;
      background: #fff;
    }
    .btn{
        display: inline-block;
        padding: 4rpx 18rpx;
        border: 1px solid var(--tagColor);
        border-radius: 24rpx;
        cursor: pointer;
        color: var(--tagColor);
        margin-left: 12rpx;
        font-size: 28rpx;
        white-space: nowrap;
        &:active{
            opacity: .8;
        }
      }
    .share-address-tips{
        padding: 16rpx 30rpx;
        display: flex;
        align-items: center;
        background: #f5f5f5;
        .icon{
            cursor: pointer;
            .check-icon{
                font-size: 40rpx;
                &.checked{
                    color: var(--tagColor);
                }
            }
        }
        .share-content{
            margin-left: 16rpx;
            .title{
            font-size: 28rpx;
            color:#333;
            line-height: 40rpx;
            }
            .tips{
            font-size: 24rpx;
            color:#999;
            line-height:34rpx;
            }
        }
    }
</style>
