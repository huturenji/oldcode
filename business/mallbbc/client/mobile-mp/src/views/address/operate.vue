<template>
    <view class="content">
        <w-loading ref="loading"></w-loading>
        <view class="row b-b">
            <text class="tit">联系人<text class="hasStar">*</text></text>
            <input class="input" type="text" v-model="addressData.memberName" placeholder="请输入联系人姓名"
             placeholder-class="placeholder" />
        </view>
        <view class="row b-b">
            <text class="tit">联系电话<text class="hasStar">*</text></text>
            <input class="input" type="text" @input="trimFun(addressData.telMobile, 'telMobile')" v-model="addressData.telMobile" placeholder="请输入手机号"
             placeholder-class="placeholder"/>
        </view>

        <view class="row b-b">
            <text class="tit">所在地址<text class="hasStar">*</text></text>
            <text @click="chooseArea" :class="addressData.addressAll==`请选择所在地区`? 'input placeholder1':'input'">
                {{addressData.addressAll}}
            </text>
            <view class='location' @click="getLocationAddress">
                <image
                    :src="weizhi"
                    mode="scaleToFill"
                />
            </view>
        </view>
        <view class="row b-b">
            <text class="tit">详细地址<text class="hasStar">*</text></text>
            <input class="input" type="text" v-model="addressData.detailAddress" placeholder="请输入详细地址,建议5～60字" maxlength='60'
             placeholder-class="placeholder" />
        </view>

        <view class="row b-b icon_wrapper">
            <tagsCom ref="tagsComp" :tagObj="tagObj" @tagTransfer="tagTransfer" />
        </view>

        <view class="row default_row">
            <text class="tit">设为默认地址</text>
            <switch style="transform: scale(0.8,0.8)" :checked="addressData.isDefault" color="#f30300" @change="switchChange" />
        </view>

        <view class="addressAnalyse">
            <view class="addressTitle">智能填写</view>
            <addressAnalyse ref='addressAnalyse' @analyse='onAddressAnalyse'></addressAnalyse>
        </view>

        <view :class="['btn_wrapper',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
            <button class="add_btn flex_row_center_center" @click="confirm">确定</button>
        </view>
        <selectAddress ref='selectAddress' :sel_data='selAddressData' @changeValid="addressData.valid = true" @selectAddress="successSelectAddress"></selectAddress>
    </view>
</template>

<script>
import selectAddress from '@/views/components/address/linkselect';
import addressAnalyse from '@/views/components/address/analysis';
import tagsCom from './tags.vue'; //地址标签组件
import addressHandler from '@/views/components/address/handler';
import {checkTel} from '@/utils/common';
import wxAuth from '@/utils/auth/weixin.js'; //微信小程序相关的授权方法

export default {
    components: {
        selectAddress,
        addressAnalyse,
        tagsCom
    },
    data() {
        return {
            weizhi: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_weizhi.svg',
            addressData: {
                memberName: '',
                telMobile: '',
                addressAll: '请选择所在地区',
                detailAddress: '',
                isDefault: false,
                addressId: '', //编辑收货地址时的id
                tags:'', //标签
                valid: true, // 地址是否失效 false = 失效
                splitTimeout:1000
            },
            selAddressData: [],
            tagObj: {name:''}, //标签的对象
            saveTagObj:{name:''}, //保存标签的对象
            showShareAddressTips:false, //是否显示共享地址勾选框
            isCheckShare:false, //共享地址勾选状态
            isAddFlag:true//默认可以添加地址
        }
    },

    mounted(){
        let title = '';
        const { type, addressId } = this.$Route.query;
        if (type === 'edit') {
            title = '编辑收货地址'
            this.addressData.addressId = addressId;
            this.getAddressDetail();
        } else if (type === 'checkEdit') {
            title = '编辑地址'
            this.addressData.addressId = addressId;
            this.getAddressDetail();
        } else {
            title = "新增收货地址";
            if (type === 'chooseAddress') {
                const { userName, telNumber, provinceName, cityName, countyName, detailInfo, streetName , detailInfoNew } = this.$Route.query;
                this.addressData.memberName = userName;
                this.addressData.telMobile = telNumber;
                let address = provinceName + cityName + countyName;
                // detailInfo为老字段, 包含了街道和详细地址 后面微信把它区分开来, 成了两个参数streetName 和 detailInfoNew
                if (streetName && detailInfoNew) {
                    address = address + streetName + detailInfoNew;
                } else {
                    address += detailInfo;
                }
                this.analyse(address).then(data => {
                    if(!!data) {
                        this.onAddressAnalyse(data); //填写相关地址
                    }
                })
            } 
        }
        this.manageType = type;
        uni.setNavigationBarTitle({
            title
        });
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
        //输入校验
        trimFun(newVal, type){
            setTimeout(()=>{
                this.$set(this.addressData, type, this.strTrim(newVal));
            },0)
        },
        //去除字符串内所有的空格,非数字字符，并截取前11位
        strTrim(str){
            if (!str){ return str }
            return str.replace(/[^0-9]/g, '').substring(0,11);
        },
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
                // 此处新增延时器的原因是 在部分安卓机型上 地址三级选择器的动画 有抖动的问题
                setTimeout(()=>{
                    this.$refs.selectAddress.open()
                }, 500)
            }
        },
        successSelectAddress(address) { //选择成功回调
            // 地址有效才去赋值, 为了更清晰的提示用户具体是哪个地方失效了
            if (this.addressData.valid == true) {
                this.selAddressData = address;
                this.addressData.addressAll = ''
                address.forEach((item) => {
                    this.addressData.addressAll += item.name;
                })
            }
            this.addressData.valid = true;
        },
        //获取收货地址详情
        getAddressDetail() {
            addressHandler.getAddressDetail({
                addressId: this.addressData.addressId
            }).then(res => {
                if (res.state == 200) {
                    let result = res.data;
                    this.addressData.memberName = result.memberName;
                    this.addressData.telMobile = result.telMobile;
                    if (this.$Route.query.type === 'checkEdit') {
                        this.addressData.addressAll = '请选择所在地区';
                        this.addressData.detailAddress = '';
                    } else {
                        this.addressData.addressAll = result.addressAll;
                        this.addressData.detailAddress = result.detailAddress;
                    }
                    this.addressData.isDefault = result.isDefault ? true : false;

                    if (result.valid === false) {
                        this.addressData.addressAll = '请选择所在地区';
                        this.addressData.valid = false;
                    }

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
                    uni.showToast({
                        title:res.msg,
                        icon:'none'
                    })
                }
            }).catch(() => {
                //异常处理
            })
        },

        //提交
        async confirm() {
            let data = JSON.parse(JSON.stringify(this.addressData));
            if (!data.memberName.trim()) {
                uni.showToast({
                    title:'请填写联系人姓名',
                    icon:'none'
                })
                return;
            }
            if (data.memberName.length > 10) {
                uni.showToast({
                    title:'联系人姓名不符合规范',
                    icon:'none'
                })
                return;
            }
            if (!checkTel(data.telMobile)) {
                return;
            }
            if (data.addressAll=='请选择所在地区') {
                uni.showToast({
                    title:'请选择所在地区',
                    icon:'none'
                })
                return;
            }
            if (!data.detailAddress.trim()) {
                uni.showToast({
                    title:'请填写详细地址',
                    icon:'none'
                })
                return;
            } else if (data.detailAddress.length < 5) {
                uni.showToast({
                    title:'详细地址至少填写5个字',
                    icon:'none'
                })
                return;
            }
            let apiType = data.addressId ? 'editAddress' : 'addAddress';
            let param = {};
            param.memberName = data.memberName; //联系人
            param.provinceCode = this.selAddressData[0].code; //省份编码
            param.cityCode = this.selAddressData[1].code; //城市编码
            param.districtCode = this.selAddressData[2] ? (isNaN(parseInt(this.selAddressData[2].code))? '': this.selAddressData[2].code) : ''; // 区域编码
            param.townCode = this.selAddressData[3] ? (isNaN(parseInt(this.selAddressData[3].code))? '': this.selAddressData[3].code) : ''; //镇街道编码
            param.addressAll = data.addressAll; //所在地区
            param.detailAddress = data.detailAddress; //详细地址
            param.telMobile = data.telMobile; //联系电话
            param.isDefault = data.isDefault ? 1 : 0; //是否设为默认地址（0非默认地址 1默认地址）
            param.tags = this.saveTagObj.code ? this.saveTagObj.name || '' : ''; //设置标签 取消选择的时候只清除了code 没有清除name 先判断code是否存在
            param.share = (this.showShareAddressTips && this.isCheckShare) ? true : false; //设置是否共享地址
            if (data.addressId) {
                param.addressId = data.addressId;
            }
            param.unitKey = apiType;
            param.requestFun = addressHandler[apiType];
            let result = {
                provinceCode: this.selAddressData[0]?.code,
                cityCode: this.selAddressData[1]?.code,
                districtCode: this.selAddressData[2]?.code,
                townCode: this.selAddressData[3]?.code
            };
            this.isAddFlag = await this.addressFlag(result,"JD")
            if (!this.isAddFlag){
                this.$nextTick(() => {
                    uni.showToast({
                        title: '所选地区已失效，请重新选择',
                        icon:'none'
                    })
                    this.$refs.selectAddress.show()
                })
                return
            }
            this.$refs?.loading?.open();
            // 全局混入的 requestMixin.js
            this.requestOnce(param).then(res => {
                if (res.state == 200) {
                    //在购物车页面新增成功之后，更新地址列表
                    this.$store.dispatch('getAddressList');
                    setTimeout(() => {
                        this.$Router.back(1)
                    }, 500)
                } else {
                    //错误提示
                    uni.showToast({
                        title:res.msg,
                        icon:'none'
                    })
                    
                    this.onceLock?.release(param.unitKey)
                }
            }).catch(()=>{
                this.onceLock?.release(param.unitKey)
            }).finally(e=>{
                this.$refs?.loading?.close();
            })

        },
        //地址校验接口
        addressFlag(adressCode,Type){
            return new Promise(async (resolve) => {
                let param = {}
                param = {
                    provinceCode: adressCode.provinceCode,
                    cityCode:  adressCode.cityCode,
                    districtCode:  adressCode.districtCode,
                    townCode:  adressCode.townCode,
                    supplierType:  Type
                }
                addressHandler.checkAddress(param).then(res => {
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

        // 获取定位的地址
        async getLocationAddress(){
            let addressObj = await wxAuth.getLocation();
            if(addressObj && addressObj.address){
                let data = await this.analyse(addressObj.address);
                if(!!data){
                    this.onAddressAnalyse(data); //填写相关地址
                }
            }
        },

        // 解析定位的地址
        analyse(address){
            return new Promise(resolve => {
                addressHandler.addressParsing({
                    supplierId: "1",
                    addressInfo: address
                }).then(res=>{
                    if (res.state == 200 && res.data){
                        res.data.districtCode = res.data.countyCode
                        resolve(res.data)
                    } else {
                        uni.showToast({
                            title:'智能识别失败',
                            icon:'none'
                        });
                        resolve(null)
                    }
                }).catch(e => {
                    resolve(null)
                })
            })
        },


        /**
         * 选择tag后更新tags对象
         */
        tagTransfer(value){
            this.saveTagObj =JSON.parse(JSON.stringify(value));
        },

    }
}
</script>

<style lang="scss">
    page {
        background: #eff2f5;
        width: 750rpx;
        margin: 0 auto;
        -webkit-touch-callout: none;
        /*系统默认菜单被禁用*/
        -webkit-user-select: none;
        /*webkit浏览器*/
        -khtml-user-select: none;
        /*早期浏览器*/
        -moz-user-select: none;
        /*火狐*/
        -ms-user-select: none;
        /*IE10*/
        user-select: none;
        -webkit-touch-callout: none;
        -moz-touch-callout: none;
        -ms-touch-callout: none;
        touch-callout: none;
    }
    .content{
        position: relative;
        overflow: auto;
        padding-bottom: 168rpx;

        .address-title {
            height: 100rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 30rpx;
            .title-text {
                font-size: 28rpx;
                color: #222222;
                font-weight: bold;
            }
            .wx-import {
                width: 184rpx;
                height: 64rpx;
                line-height: 64rpx;
                text-align: center;
                background: #ffffff;
                border-radius: 34rpx;
                color: #f30300;
            }
        }
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
    .row {
        display: flex;
        align-items: center;
        position: relative;
        padding: 0 30rpx;
        height: 110rpx;
        background: #fff;

        &.b-b {
            &:after {
                position: absolute;
                z-index: 3;
                left: 20rpx;
                right: 0;
                bottom: 0;
                height: 0;
                content: '';
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
                border-bottom: 1px solid rgba(0, 0, 0, .1);
            }
        }
        
        .hasStar{
            color: #e82b29;
        }

        .tit {
            flex-shrink: 0;
            min-width: 150rpx;
            font-size: 30rpx;
            color: #333;
        }

        .input {
            flex: 1;
            font-size: 30rpx;
            color: #333;
        }

        .location{
            image {
                width: 40rpx;
                height: 40rpx;
            }
        }

        .person-icon{
            background-size: contain;
            width: 40rpx;
            height:40rpx;
        }
    }

    .icon_wrapper {
        height: auto !important;

        .tags-title {
            font-size: 30rpx !important;
        }
    }

    .default_row {
        .tit {
            flex: 1;
        }

        switch {
            transform: translateX(16rpx) scale(.9);
        }
    }
    .btn_wrapper {
        width: 100%;
        position: fixed;
        bottom: 0;
        // padding-bottom: env(safe-area-inset-bottom);
        // padding-bottom: constant(safe-area-inset-bottom);
        // display: flex;
        // justify-content: center;
        // align-items: center;
        padding: 20rpx 30rpx;

        .add_btn {
            font-size: 34rpx;
            color: #fff;
            width: 100%;
            height: 88rpx;
            background: #F30300;
            border-radius: 44rpx;
            font-weight: 600;
        }
    }


    .placeholder {
        color: #949494;
        font-size: 30rpx;
    }
    .placeholder1{
        color: #949494!important;
        font-size: 30rpx!important;
    }
    .addressAnalyse{
      .addressTitle{
          height: 64rpx;
          line-height: 64rpx;
          padding-left: 30rpx;
          color: #222222;
          font-weight: 600;
          font-size: 30rpx;
      }
      .address-parse-area {
          padding: 6rpx 12rpx;
          background-color: #fff;
      }
    }
    .btn{
        display: inline-block;
        padding: 4rpx 18rpx;
        border: 1px solid #F30300;
        border-radius: 24rpx;
        color: #F30300;
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
            .check-icon{
                font-size: 40rpx;
                &.checked{
                    color: #e82b29;
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
