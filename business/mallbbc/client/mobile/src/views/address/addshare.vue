<template>
    <view class="content">
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

        <button class="add_btn flex_row_center_center" @click="confirm" >{{$L('提交')}}</button>
        <selectAddress ref='selectAddress' :sel_data='selAddressData' @selectAddress="successSelectAddress"></selectAddress>
    </view>
</template>

<script>
import selectAddress from '@/components/address/linkselect';
import addressHandler from '@/components/address/handler';
export default {
    components: {
        selectAddress
    },
    data() {
        return {
            addressData: {
                addressAll: '请选择所在地区',
                detailAddress: '',
                commonAddressId: '' //编辑收货地址时的id
            },
            selAddressData: [], // 联级地址数据 name code
            windowHeight:''
        }
    },
    mounted(){
        let title = '新增公司共享地址';
        if (this.$Route.query.type === 'edit') {
            title = '编辑公司共享地址'
            let params = JSON.parse(this.$Route.query.data)
            this.addressData.addressAll = params.area
            this.addressData.detailAddress = params.address
            this.addressData.commonAddressId = params.commonAddressId
            let areaArr = params.area.split('/')
            let areaCodeArr = params.areaCode.split('/')
            this.selAddressData = [
                {
                    code: areaCodeArr[0],
                    name: areaArr[0]
                },
                {
                    code: areaCodeArr[1],
                    name: areaArr[1]
                }, 
                {
                    code: areaCodeArr[2]?areaCodeArr[2]:'',
                    name: areaArr[2]?areaArr[2]:''
                },
                {
                    code: areaCodeArr[3]?areaCodeArr[3]:'',
                    name: areaArr[3]?areaArr[3]:''
                }
                            
            ];

        }
        this.manageType = this.$Route.query.type;
        uni.setNavigationBarTitle({
            title
        });
        uni.getSystemInfo({
            success:(res)=>{
                this.windowHeight = res.windowHeight;
            }
        });
    },
    computed: {
            
    },
    methods: {
        // 打开联级选择弹窗
        chooseArea() {
            this.$refs.selectAddress.show()
        },
        // 联级选择的回调
        successSelectAddress(address) { 
            this.selAddressData = address;
            this.addressData.addressAll = ''
            address.forEach((item) => {
                this.addressData.addressAll += item.name;
            })
        },
        // 跳转定位页面
        openAddressMap(){
            this.$Router.push({path:'/pages/address/addresslocation'})
        },
        // 定位地址选择后的回调
        onAddressAnalyse(result){
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
            this.addressData.detailAddress = result.exactAddress;
                
        },


        //提交
        confirm() {
            let data = this.addressData;
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
            let area = ''
            let areaCode = ''
            this.selAddressData.forEach((item,index)=>{
                if (item.code){
                    if (index!=this.selAddressData.length-1){
                        area+=item.name + '/'
                        areaCode+=item.code + '/'  
                    } else {
                        area+=item.name
                        areaCode+=item.code
                    }
                }
            })
            const paramsData = {
                supplierId: "1",
                area: area,
                areaCode:areaCode,
                address: data.detailAddress,                  
                project: 'MALL'
            }
            if (data.commonAddressId) {
                paramsData.commonAddressId = data.commonAddressId;
            }
            let apiType = data.commonAddressId ? 'updateCommonAddress' : 'addCommonAddress';
            addressHandler[apiType](paramsData).then(res => {
                if (res.state == 200) {
                    //更新上一页的数据
                    const pages = getCurrentPages(); //当前页面栈  
                    if (pages.length > 1) {  
                        const beforePage = pages[pages.length - 2]; //获取上一个页面实例对象  
                        beforePage.$vm.getAddressList(); //触发上个面中的方法获取地址列表的方法 
                    }  
                    setTimeout(() => {
                        this.$Router.back(1)
                    },200)
                } else {
                    //错误提示
                    this.$api.msg(res.msg);
                }
            })

        }

    }
}
</script>

<style lang="scss">
    page {
        background: $bg-color-split;
        padding-top: 20rpx;
        width: 750rpx;
        height: 100%;
        margin: 0 auto;
    }
    .content{
        position: relative;
        height: 100%;
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
        min-height: 100rpx;
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

        .tit {
            flex: 1;
        }

        switch {
            transform: translateX(16rpx) scale(.9);
        }
    }

    .add_btn {
        position: absolute;
        font-size: 34rpx;
        color: var(--confirmBtnTextColor);
        width: 668rpx;
        height: 88rpx;
        background: var(--confirmBtnBgColor2);
        border-radius: 44rpx;
        right: 0;
        left: 0;
        bottom: 40rpx;
        margin: 0 auto;
    }
    .placeholder1{
        color: #949494!important;
        font-size: 26rpx!important;
    }
    .addressAnalyse{
      margin-top: 20rpx;
      padding: 20rpx 30rpx;
      background: #fff;
    }
    .btn{
        display: inline-block;
        padding: 4rpx 18rpx;
        border: 1px solid #F30300;
        border-radius: 24rpx;
        cursor: pointer;
        color: #F30300;
        margin-left: 12rpx;
        font-size: 28rpx;
        &:active{
            opacity: .8;
        }
      }
</style>
