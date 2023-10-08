<!--兑换中心-->
<template>
  <view class="exchange-wrapper">
      <view class="input_wrapper">
        <textarea class="password-input" v-model="exchangePassword" placeholder="请输入兑换码（可批量输入兑换，请卡密与卡密之间“,”区分，最多可批量兑换50个）" maxlength="-1" />
        <view class="password_number_wrapper"><text class="password_number">{{passwordNumber}}</text>/50</view>
      </view>
      <view class="btn-wrapper">
        <button class="exchange-btn" :style="{opacity:! exchangePassword ? '0.4' : '1'}" type="primary" @click="exchange">立即兑换</button>
      </view>
      <view class="description-title">
        兑换说明：
      </view>
      <view class="introduction">
        1、输入正确有效的卡密并确认后即可兑换相应的券包/红包<br>
        2、单次兑换可输入1个或多个（最多不超过50个）卡密，输入多个卡密时，相邻的卡密中间须以英文逗号（“,”）进行分隔<br>
        3、每个卡密仅限兑换一次，成功兑换后即失效，不可重复兑换<br>
        4、卡密兑换成功后，可在“我的-券包/红包”中查看相应的券包/红包<br>
        5、兑换的券包/红包存在有效期，请在有效期内尽快使用，逾期自动失效，不予补发不可延期
      </view>

      <bottomPopup ref="receive_result_popup" type="bottom" :showTitle="false" :showCloseBtn="false" height="auto">
        <view class="result-wrapper">
          <view class="popup-title">兑换结果</view>
          <view class="success" v-if="successCount>0">
            <img class="success_icon" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_setp_sel2.svg" />
            <text>成功  [{{successCount}}/{{passwordNumber}}]</text>
          </view>
          
          <scroll-view class="success-content" v-if="successList.length>0" :scroll-top="scrollTop" scroll-y="true">
            <view class="coupon" v-for="(item,index) in successList.filter(i=>i.promotionType!=404)" :key="index">
              <view class="left">
                <view class="coupon-type" :style="{color:setTypeTextColor(item.promotionType)}">
                  {{ showCouponType(item.promotionType) }}
                </view>
                <view class="coupon-cash">
                  <text class="cash-unit">¥ </text>
                  <text class="cash-number">{{item.publishValue}}</text>
                </view>
                <view class="condition">{{item.couponContent}}</view>
              </view>
              <view class="right">
                <view class="cash-name">{{item.couponName}}</view>
                <view class="cash-time" v-if="item.effectiveStart && item.effectiveEnd">{{`${item.effectiveStart.substring(0,10)}～${item.effectiveEnd.substring(0,10)}`}}</view>
                <view class="use-rule" v-if="item.description" @click="switchRuleStatus(index)">
                  <view class="rule-title">
                    <text>使用规则</text>
                    <view class="downtriangle" :style="{transform:item.showStatus ? 'rotate(0deg)' : 'rotate(180deg)' }"></view>
                  </view>
                  <view class="coupon-content" :style="{display:item.showStatus ? 'block' : 'none'}">
                    {{item.description}}
                  </view>
                </view>
                
                <view class="exist-number">x<text class="number">{{item.num}}</text></view>
              </view>
            </view>

            <view class="redpacket" v-for="(item,index) in successList.filter(i=>i.promotionType==404)" :key="index">
              <view class="left">
                <view class="redpacket-cash">
                  <text>¥</text>
                  <text class="cash-int">{{getPartNumber(item.publishValue,'int')}}</text>
                  <text>{{getPartNumber(item.publishValue,'decimal')}}</text>
                </view>
              </view>
              <view class="right">
                <view class="redpacket-name">{{item.couponName}}</view>
                <view class="redpacket-date">{{`${item.effectiveStart.substring(0,10)}～${item.effectiveEnd.substring(0,10)}`}}</view>
                <view class="exist-number">x<text class="number">{{item.num}}</text></view>
              </view>
            </view>
          </scroll-view>
          
          <view class="fail" v-if="failCount>0">
            <img class="fail_icon" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_close%20_red.svg" />
            <text>失败  [{{failCount}}/{{passwordNumber}}]</text>
            <text class="tips">长按可复制兑换失败卡密</text>
          </view>
          <view class="showMaskBox" v-if="is_show_mask"><view class="showMask" @click="copyStr(errorPasswordList.join(','))" @blur="is_show_mask=false">复制<view class="sanjiao"></view></view></view>
          <view class="fail-content" v-if="failCount>0" :style="{userSelect:useSelectType}" @longpress.stop="showOperate()">
            <view class="fail_title" v-if="failPasswords">卡密错误</view>
            <view class="password_list" v-if="failPasswords">
              {{failPasswords}}
            </view>
            <view class="fail_title" v-if="gotPasswords">卡密已被兑换</view>
            <view class="password_list" v-if="gotPasswords">
              {{gotPasswords}}
            </view>
            <view class="fail_title" v-if="invalidPasswords">卡密已失效</view>
            <view class="password_list" v-if="invalidPasswords">
              {{invalidPasswords}}
            </view>
            <view class="fail_title" v-if="gotFailedPasswords">领取失败</view>
            <view class="password_list" v-if="gotFailedPasswords">
              {{gotFailedPasswords}}
            </view>
          </view>

        </view>
        <view class="bottom-btn-wrapper" >
          <button class="ok-btn" @click="closePoup">好的</button>
        </view>
      </bottomPopup>
  </view>
</template>

<script>
import { copyText, getPartNumber } from '@/utils/common.js' 
import couponHandler from '@/views/components/coupon/handler.js'
import bottomPopup from '@/common/components/uni-popup/uni-popup-bottom.vue'; // 底部弹出层

export default {
    name:'exchange-center',
    components:{
      bottomPopup
    },
    data(){
        return {
            exchangePassword:'', // 领取卡密
            successCount:0, // 成功领取数量
            failCount:0, // 失败数量
            failPasswords:'', // 失败卡密信息
            gotPasswords:'', // 已领卡密信息
            invalidPasswords:'', // 失效卡密信息
            gotFailedPasswords: '', // 领取失败卡密信息
            errorList:[], // 卡密错误集合
            receivedList:[], // 卡密已被兑换集合
            loseEfficacyList:[], // 失效卡密集合
            getFailedList:[], // 获得失败卡密集合
            successList: [], // 成功卡密对象集合
            errorPasswordList: [], // 失败卡密集合
            is_show_mask: false, // 复制弹窗显隐
            useSelectType: '' //据此判断PC端可选中复制，手机端不能选中

        }
    },
    mounted(){
        // #ifdef H5
        if(SnUtils.isPC()){
            this.useSelectType="text";
                
        }
        // #endif
    },
    computed: {
        // 兑换卡密的数量
        passwordNumber(){
            return this.exchangePassword?this.exchangePassword.split(',').length:0
        }
    },
    methods:{
        /**
         * 立即兑换
         */
        exchange(){
            if(!this.exchangePassword){
                this.$api.msg("请输入要兑换的卡密");
                return
            }
            if(this.passwordNumber>50){
                this.$api.msg("单次只能兑换五十个卡密");
                return
            }
            if(this.failPasswords || this.gotPasswords || this.invalidPasswords || this.gotFailedPasswords) {
                this.failPasswords = ''
                this.gotPasswords = ''
                this.invalidPasswords = ''
                this.gotFailedPasswords = ''
                this.successCount = 0
                this.failCount = 0
                this.errorList = []
                this.receivedList = []
                this.loseEfficacyList = []
                this.getFailedList = []
                this.is_show_mask = false
            }
            uni.showLoading()
            const promotionCouponVOList = this.exchangePassword.split(',').map(item=>{
                return { password: item }
            })
            
            
            couponHandler.getListReceiveByPwd({promotionCouponVOList}).then(res => {
                if (res.state == 200){
                    this.successCount = res.data.successCount
                    this.failCount = res.data.failCount
                    
                    let successStrItemList = [] // 成功的字符串类型券数组
                    let successList = [] // 成功的券数组
                    let uniqueArray = [] // 去重后的券数组
                    res.data.promotionCouponResponseVOList.forEach(item=>{
                        if (item.receiveResult == 1) {
                            const {promotionType,couponName,publishValue,effectiveStart,effectiveEnd,description,couponContent} = item;
                            const newItem = JSON.stringify({
                                promotionType,
                                couponName,
                                publishValue,
                                effectiveStart,
                                effectiveEnd,
                                description,
                                couponContent
                            })

                            successList.push(item)
                            successStrItemList.push(newItem)
                            
                        } else if(item.receiveResult == 2){
                            this.errorList.push(item.password)
                        } else if (item.receiveResult == 3){
                            this.receivedList.push(item.password)
                        } else if(item.receiveResult == 4) {
                            this.loseEfficacyList.push(item.password)
                        } else if(item.receiveResult == 5) {
                            this.getFailedList.push(item.password)
                        }
                    })
                    this.errorPasswordList = [...this.errorList,...this.receivedList,...this.loseEfficacyList,...this.getFailedList] // 收集错误的卡密数组
                    const uniqueSet = new Set(successStrItemList) // 数组去重
                    
                    uniqueArray = [...uniqueSet].map(item=>{
                        const i = JSON.parse(item)
                        return {...i, num:0, showStatus:false}
                    });
                    
                    uniqueArray.forEach((item,index)=>{
                        successList.forEach(successItem=>{
                            if(item.promotionType == successItem.promotionType &&
                            item.couponName == successItem.couponName &&
                            item.publishValue == successItem.publishValue &&
                            item.effectiveStart == successItem.effectiveStart &&
                            item.effectiveEnd == successItem.effectiveEnd &&
                            item.description == successItem.description
                            ){
                                uniqueArray[index].num++
                            }
                        })
                    })

                    this.successList = uniqueArray
                    
                    if(this.errorList.length>0){
                        this.failPasswords = this.errorList.join(',')
                    }
                    if(this.receivedList.length>0){
                        this.gotPasswords = this.receivedList.join(',')
                    }
                    if(this.loseEfficacyList.length>0){
                        this.invalidPasswords = this.loseEfficacyList.join(',')
                    }
                    if(this.getFailedList.length>0){
                        this.gotFailedPasswords = this.getFailedList.join(',')
                    }
                    
                    
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch((e) => {
                console.log(e)
                //异常处理
            }).finally(()=>{
                uni.hideLoading()
                this.$refs.receive_result_popup.open()
            })
            
        },
        /**
         * 关闭查看弹框
         */
        closePoup(){
            this.$refs.receive_result_popup.close()
        },
        /**
         * 查看券详情
         * @type 券类型
         */
        toCheck(type){
            let path = ''
            switch (type) {
            case 'coupon':
                path = '/pages/coupon/myCoupon';
                break;
            case 'freightCoupon':
                path = '/pages/coupon/myCoupon';
                break;
            case 'redpacket':
                path = '/views/coupon/myRedPacket';
                break;
            case 'consumerCoupon':
                path = '/pages/coupon/myCoupon';
                break;
            default:
                break;
            }
            this.$Router.push({
                path
            })
        },
        /**
         * 展示优惠券类型
         */
        showCouponType(type){
            return type == 402 ? '优惠券' :type == 405 ? '运费券' : '消费券'
        },
        /**
         * 设置券类型文本颜色
         * @type 券类型
         */
        setTypeTextColor(type){
            return type == 402 ? '#F30300' :type == 405 ? '#222222' : '#EB5700'
        },
        /**
         * 切换规则显示状态
         * @index 索引
         */
        switchRuleStatus(index){
            const updateItem = this.successList[index]
            updateItem.showStatus = !updateItem.showStatus
            this.$set(this.successList,index,updateItem)
        },
        /**
         * 控制复制弹框显隐
         */
        showOperate() {
            if(this.is_show_mask){
                this.is_show_mask = false;
                setTimeout(function(){
                    this.is_show_mask = true;
                }.bind(this),1000)
            }else{
                this.is_show_mask = true;
            }
        },
        /**
         * 复制字符串
         */
        copyStr (str) {
            copyText(str);
            this.is_show_mask=false;
        },
        /**
         * 获取价格
         * @param number 价格数字
         */
        getPriceNumber(number,type){
          return getPartNumber(number,type);
        }

    },
    watch:{
        passwordNumber:{
            handler(val){
                if(val>50){
                    this.$api.msg('单次只能兑换五十个卡密')
                }
            }
        },
        ifLongClick:{
            handler(val){
                if(val){
                    this.copyToClipboard()
                }
            }
        }

    }
}
</script>

<style lang="scss" scoped>
    .exchange-wrapper{
      height: 100%;
      padding: 40rpx 40rpx 0 40rpx;
      background: #fff;
      overflow-y: scroll;

      .input_wrapper {
        width: 100%;
        position: relative;
        .password-input {
          width: 100%;
          height: 480rpx;
          background: #F5F6F8;
          border-radius: 8rpx;
          padding: 20rpx 28rpx 60rpx;
          box-sizing: border-box;
        }
        .password_number_wrapper {
          position: absolute;
          bottom: 20rpx;
          right: 28rpx;
          color: #999;
          font-size: 28rpx;
          .password_number {
            color: #666;
          }
        }
      }


      .btn-wrapper {
        margin-top: 60rpx;
        margin-bottom: 44rpx;

        .exchange-btn {
          border-radius: 44rpx;
          background-color: #F30300;
        }

      }

      .description-title{
        margin-bottom: 16rpx;
        font-size: 28rpx;
        font-weight: bold;
        color: #222222;
      }

      .introduction {
        color: #666;
      }

    }

    .result-wrapper {
      background: #ffffff;
      border-top-left-radius: 10rpx;
      border-top-right-radius: 10rpx;
      padding: 20rpx;
      max-height: 1248rpx;

      .popup-title {
        font-size: 32rpx;
        color: #222222;
        text-align: center;
        font-weight: bold;
        margin-bottom: 52rpx;
      }
      .success {
        margin-bottom: 10rpx;
        display: flex;
        align-items: center;
        font-size: 30rpx;
        .success_icon {
          display: block;
          margin-right: 12rpx;
          width: 44rpx;
          height: 44rpx;
        }
      }

      .success-content {
        height: 488rpx;
        background: #f5f6f8;
        border-radius: 20rpx;
        padding: 20rpx 0;

        .coupon {
          width: 650rpx;
          height: 190rpx;
          background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/bg_exchange_youhuiquan.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          display: flex;
          margin: 0 auto 16rpx;

          .left {
            width: 188rpx;

            .coupon-type {
              font-size: 20rpx;
              font-weight: 500;
              padding-left: 20rpx;
              margin-top: 4rpx;
            }

            .coupon-cash {
              margin-top: 20rpx;
              text-align: center;
              font-size: 28rpx;
              color: #fff;
              .cash-unit {

              }
              .cash-number {
                font-size: 56rpx;
              }
            }
            .condition {
              margin-top: 10rpx;
              font-size: 24rpx;
              color: #fff;
              text-align: center;
              font-weight: 500;
            }
          }

          .right{
            width: 462rpx;
            padding: 22rpx 36rpx 0 28rpx;
            color: #222;
            position: relative;

            .cash-name {
              font-size: 28rpx;
              font-weight: bold;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              word-break: break-all;
              -webkit-box-orient: vertical;
            }

            .cash-time {
              font-size: 22rpx;
              margin-top: 16rpx;
            }

            .use-rule {
              margin-top: 6rpx;

              .rule-title {
                display: flex;
                align-items: center;
                font-size: 24rpx;
                
                .downtriangle {
                  width: 24rpx;
                  height: 24rpx;
                  background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_downtriangle2@2x.png');
                  background-repeat: no-repeat;
                  background-size: contain;
                  margin-left: 6rpx;
                }
              }
              .coupon-content {
                word-break: break-all;
              }


            }

            .exist-number {
              position: absolute;
              color: #F30300;
              font-size: 24rpx;
              bottom: 20rpx;
              right: 36rpx;

              .number {
                font-size: 36rpx;
              }
            }

          }

        }

        .redpacket {
          width: 650rpx;
          height: 190rpx;
          background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/decorate/redpacket/bg_wode_hongbao.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          display: flex;
          margin: 0 auto 16rpx;
          .left {
            width: 210rpx;
            display: flex;
            align-items: center;
            justify-content: center;

            .redpacket-cash {
              font-size: 28rpx;
              font-weight: bold;
              color: #F30300;
              text-align: center;

              .cash-int {
                font-size: 56rpx;
              }
            }

          }

          .right {
            width: 440rpx;
            color: #fff;
            padding: 46rpx 50rpx 50rpx 40rpx;
            position: relative;
            .redpacket-name {
              font-size: 32rpx;
              font-weight: bold;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              line-clamp: 1;
              word-break: break-all;
              -webkit-box-orient: vertical;
            }
            .redpacket-date {
              font-size: 24rpx;
              margin-top: 24rpx;
            }
            .exist-number {
              position: absolute;
              color: #fff;
              font-size: 24rpx;
              bottom: 20rpx;
              right: 36rpx;

              .number {
                font-size: 36rpx;
              }
            }            
          }
        }
      }

      .fail {
        margin-top: 10rpx;
        display: flex;
        align-items: center;
        font-size: 30rpx;
        .fail_icon {
          display: block;
          width: 44rpx;
          height: 44rpx;
          margin-right: 12rpx;
        }
        .tips {
          color: 28rpx;
          color: #666;
          font-weight: 400;
          padding-left: 10rpx;
        }
      }


      .fail-content{
        width: 690rpx;
        padding: 20rpx 28rpx 18rpx 28rpx;
        color: #999999;
        background-color: #EFF2F5;
        margin-top: 24rpx;
        border-radius: 10rpx;

        .fail_title {
          font-size: 26rpx;
          color: #222;
          font-weight: bold;
          margin-bottom: 12rpx;
        }
        .password_list {
          font-size: 26rpx;
          color: #999;
          word-break: break-all;
        }

      }
      .showMaskBox{
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          height: 0;
          top:-42rpx;
          z-index: 100;
          &.showMaskSkuBox{
              top:-100rpx;
          }
          .showMask{
              width:190rpx;
              height:80rpx;
              background-color:rgba(0,0,0,1);
              color:#fff;
              display:flex;
              align-items: center;
              justify-content: center;
              border-radius: 20rpx;
              position: relative;
              .sanjiao{
              width: 0;
              height: 0;
              border: 23rpx solid;
              border-top-color: rgba(0,0,0,1);
              border-bottom-color: transparent;
              border-left-color: transparent;
              border-right-color: transparent;
              position: absolute;
              bottom:-44rpx;
              }
          }
      }

    }
    .bottom-btn-wrapper {
      width: 100%;
      height: 120rpx;
      line-height: 120rpx;
      text-align: center;
      position: relative;
      bottom: 0;
      background: #fff;
      padding: 0 30rpx;

      .ok-btn {
        border-radius: 44rpx;
        background-color: #F30300;
        color: #fff;
        transform: rotate(180);
      }

    }
</style>