<template>
    <view class="content">
        <view class="row b-b">
            <text class="tit hasStar">联系人</text>
            <input class="input" maxlength='10' type="text" v-model="addressData.memberName" placeholder="请输入收货人姓名"
                placeholder-class="placeholder" />
        </view>
        <view class="row b-b">
            <text class="tit hasStar">联系电话</text>
            <input class="input" maxlength='11' type="text" v-model="addressData.telMobile" placeholder="请输入手机号"
                placeholder-class="placeholder" />
        </view>

        <view class="row b-b">
            <text class="tit hasStar">所在地区</text>
            <text @click="chooseArea" :class="addressData.addressAll=='请选择所在地区'? 'input placeholder1':'input'">
                {{addressData.addressAll}}
            </text>
        </view>
        <view class="row b-b">
            <text class="tit hasStar">详细地址</text>
            <input class="input" type="text" v-model="addressData.detailAddress" placeholder="请输入详细地址,建议5～60字"
                maxlength='60' placeholder-class="placeholder" />
        </view>

        <button class="add_btn flex_row_center_center" @click="confirm"
            :style="{top:windowHeight - 80 + 'px'}">提交</button>
        <selectAddress ref='selectAddress' :sel_data='selAddressData' @selectAddress="successSelectAddress">
        </selectAddress>
    </view>
</template>

<script>
import selectAddress from '@/views/components/address/linkselect';
import { checkTel } from '@/utils/common.js'


export default {
    components: {
        selectAddress
    },
    data() {
        return {
             
            addressData: {
                memberName: '',
                telMobile: '',
                addressAll: '请选择所在地区',
                detailAddress: ''
            },
            selAddressData: [],
            windowHeight: ''

        }
    },
    onLoad() {
        let title = '编辑取件地址';
        this.type = this.$Route.query.type;
        if (this.type === 'recept') {
            title = '编辑收货地址'
        }
        uni.setNavigationBarTitle({
            title
        });
        uni.getSystemInfo({
            success: (res) => {
                this.windowHeight = res.windowHeight;
            }
        });
        if (this.$Route.query.data) {
            try {
                let params = this.$Route.query.data;
                this.addressData = params
            } catch (error) {
                //
            }
        }
    },

    methods: {
        chooseArea() {
            this.$refs.selectAddress.show()
        },
        successSelectAddress(address) { //选择成功回调
            this.selAddressData = address;
            this.addressData.addressAll = ''
            address.forEach((item) => {
                this.addressData.addressAll += item.name;
            })
            this.addressData.provinceCode = this.selAddressData[0].code; //省份编码
            this.addressData.cityCode = this.selAddressData[1].code; //城市编码
            this.addressData.districtCode = this.selAddressData[2] ? this.selAddressData[2].code : ''; //区县编码
            this.addressData.townCode = this.selAddressData[3] ? this.selAddressData[3].code : ''; //区县编码
        },


        //提交
        confirm() {
            let data = this.addressData;
            if (!data.memberName.trim()) {
                uni.showToast({
                    title: '请填写收货人姓名',
                    icon: 'none'
                })
                return;
            }
            if (!checkTel(data.telMobile)) {
                uni.showToast({
                    title: '请填写联系电话',
                    icon: 'none'
                })
                return;
            }
            if (data.addressAll == '请选择所在地区') {
                uni.showToast({
                    title: '请选择所在地区',
                    icon: 'none'
                })
                return;
            }
            if (!data.detailAddress.trim()) {
                uni.showToast({
                    title: '请填写详细地址',
                    icon: 'none'
                })

                return;
            } else if (data.detailAddress.length < 5) {
                uni.showToast({
                    title: '详细地址至少填写5个字',
                    icon: 'none'
                })

                return;
            }
            if (data.provinceCode == null || data.provinceCode == undefined || data.provinceCode == '') {
                uni.showToast({
                    title: res.msg,
                    icon: 'none'
                })
                return;
            }
            if (data.cityCode == null || data.cityCode == undefined || data.cityCode == '') {
                uni.showToast({
                    title: res.msg,
                    icon: 'none'
                })
   
                return;
            }
            if (data.districtCode == null || data.districtCode == undefined || data.districtCode == '') {
                uni.showToast({
                    title: res.msg,
                    icon: 'none'
                })
                return;
            }
            const pages = getCurrentPages(); //当前页面栈  
            if (pages.length > 1) {  
                try {
                    const beforePage = pages[pages.length - 2]; //获取上一个页面实例对象  
                    beforePage.$vm.editAddress(this.type,this.addressData); //触发上个页面中的方法
                } catch (error) {
                    //
                    console.log(error)
                }
            } 
            
            setTimeout(() => {
                this.$Router.back(1)
            }, 500)

        }

    }
}
</script>

<style lang="scss">
page {
    padding-top: 20rpx;
    width: 750rpx;
    margin: 0 auto;
}

.content {
    position: relative;
    overflow: auto;
    padding-bottom: 158rpx;
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
    height: 100rpx;
    background: #fff;

    &.b-b {
        &:after {
            position: absolute;
            z-index: 3;
            left: 20rpx;
            bottom: 0;
            right: 0;
            height: 0;
            content: '';
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
            border-bottom: 1px solid rgba(0, 0, 0, .1);
        }
    }

    .hasStar::after {
        content: "*";
        color: #e82b29;
        font-size: 28rpx;
    }

    .tit {
        flex-shrink: 0;
        width: 150rpx;
        font-size: 28rpx;
        color: #333;
    }

    .input {
        flex: 1;
        font-size: 30rpx;
        color: #333;
        font-weight: 600;
    }
}


.add_btn {
    position: fixed;
    font-size: 34rpx;
    color: #fff;
    width: 668rpx;
    height: 88rpx;
    background: #F30300;
    border-radius: 44rpx;
    right: 0;
    left: 0;
    margin: 0 auto;
}

.placeholder1 {
    color: #949494 !important;
    font-size: 26rpx !important;
}

.btn {
    display: inline-block;
    padding: 4rpx 18rpx;
    border: 1px solid #F30300;
    border-radius: 24rpx;
    cursor: pointer;
    color: #F30300;
    margin-left: 12rpx;
    font-size: 28rpx;

    &:active {
        opacity: .8;
    }
}
</style>
