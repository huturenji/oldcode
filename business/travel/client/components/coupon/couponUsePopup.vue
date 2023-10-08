<template>
  <div class="couponUsePopup_container">
    <div class="cover animated zoomIn">
      <!--关闭图标-->
      <div class="closeBtn cursorp"  @click="closePopup">
      </div>
      <div class="top">
        <h3><span>￥</span><span>{{receiveDataList.CouponValue}}</span></h3>
        <p>{{getProductName(receiveDataList.ProductType)}}{{receiveDataList.CouponType=='1'?'满'+receiveDataList.FullValue+'减￥':'立减￥'}}{{receiveDataList.CouponValue}}</p>
      </div>
      <div class="textContain">
        <h4>有限期至：</h4>
        <div class="time">
          <span>{{receiveDataList.ValidPeriod.EndTime}}</span>
        </div>
        <h4>使用说明：</h4>
        <textarea name="introduce" id="introduce"  rows="6"
            placeholder="暂无说明"
            v-model="receiveDataList.Remark"
            disabled
        >
        </textarea>
        </div>
      <div class="useBtn cursorp" @click="gotoUse" :style="useBtnBG||''">
        立即使用
      </div>
    </div>
  </div>
</template>
<script>
import {getCouponProduct} from './js/judgePageType'
import {openPage} from './js/requestHandler.js'
export default {
    components: {
    },
    data () {
        return {
            useBtnBG:''
        }
    },
    props: ['CouponUsePopupToList', 'receiveDataList','isDisabled'],
    methods: {
        /**
         * 返回产品名字
         */ 
        getProductName(code){
            return getCouponProduct(code,"name2")
        },
        gotoUse(){
            if (!this.isDisabled){ // 在可用期内去使用
                let that=this
                let ProductType=this.receiveDataList.ProductType // 类型名
                openPage(getCouponProduct(ProductType,'type')+'.html#/?pageFrom=coupon&gotoUse=true')
                this.$parent.isShowUsePopup=false // 重开页面关闭详情弹窗
            }
        },
        closePopup () { // 关闭自己
            this.CouponUsePopupToList()
        }
    },
    mounted(){
        if (this.isDisabled){ // 每次生成自己判断 传不可用按钮颜色
            this.useBtnBG={backgroundColor: '#c2c2c2',color:'#fff'}
        }
    },
    watch:{
    }
}
</script>

<style scoped lang="less" type="text/less">
  @import '~styles/core/common.less';
  @import '~styles/mixins/mixinsStyle.less';
  .animated {
      -webkit-animation-duration: 1s;
      animation-duration: 1s;
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both
  }

  .animated.infinite {
      -webkit-animation-iteration-count: infinite;
      animation-iteration-count: infinite
  }

  .animated.hinge {
      -webkit-animation-duration: 2s;
      animation-duration: 2s
  }
  .animated.sdfgh {
      -webkit-animation-duration: 3s;
      animation-duration: 3s
  }
  @-webkit-keyframes zoomIn {
      0% {
          opacity: 0;
          -webkit-transform: scale3d(.3, .3, .3);
          transform: scale3d(.3, .3, .3)
      }
      50% {
          opacity: 1
      }
  }

  @keyframes zoomIn {
      0% {
          opacity: 0;
          -webkit-transform: scale3d(.3, .3, .3);
          -ms-transform: scale3d(.3, .3, .3);
          transform: scale3d(.3, .3, .3)
      }
      50% {
          opacity: 1
      }
  }

  .zoomIn {
      -webkit-animation-name: zoomIn;
      animation-name: zoomIn
  }
  /*body{*/
  /*tap-highlight-color:transparent;*/
  /*-webkit-tap-highlight-color: transparent;*/
  /*}*/
  .couponUsePopup_container {
    //   left: 0;
    //   right: 0;
    //   bottom: 0;
    //   top: 0;
    width: 100%;
    height:100%;
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
    .cover {
      width: 6.3rem;
      height: 6.88rem;
      position: fixed;
      z-index: 2000;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      margin: auto;
      .closeBtn {
        width: .60rem;
        height: .60rem;
        /*background-color: #555555;*/
        position: absolute;
        right: .2rem;
        top: .2rem;
        z-index: 999;

        background: url('./img/wallet_coupon_closeBtn.png') center no-repeat;
        background-size: .44rem .44rem;
         &:active{
            background: url('./img/wallet_coupon_closeBtnpre.png') center no-repeat;
            background-size: .44rem .44rem;
        }
      }

      .top {
        width: 6.3rem;
        height: 1.74rem;
        background: url("./img/wallet_popup_line.png") no-repeat;
        -webkit-background-size: 6.3rem 1.74rem;
        background-size: 6.3rem 1.74rem;
        h3 {
          padding-top: .4rem;
          text-align: center;
          height: .4rem;
          font-size: .4rem;
          color: #f83939;
          font-weight: 600;
          span {
            line-height: .4rem;
            &:last-child {
              font-size: .6rem;
            }
          }
        }
        p {
          text-align: center;
          font-size: .26rem;
          line-height: .26rem;
          padding-top: .17rem;
          color: @text-color;
        }
      }

      .textContain {
        box-sizing: border-box;
        overflow-y: scroll;
        width: 6.3rem;
        height: 4.22rem;
        padding: .12rem .4rem 0 .4rem;

        background-color: #fff;
        /*border-bottom-right-radius: 20px;*/
        /*border-bottom-left-radius: 20px;*/
        /*position: relative;*/
        color: @text-color;
        h4 {
          margin-top: .3rem;
          font-size: .28rem;
          line-height: .28rem;
          font-weight: bold;
          &:first-child {
            margin-top: 0;
          }
        }
        .time {
          font-size: .26rem;
          line-height: .26rem;
          margin-top: .2rem;
        }
        #introduce{
            margin-top: .1rem;
            font-size: .26rem;
            line-height: .42rem;
            background-color: #fff;
            color: @text-color;
        }
      }
      .useBtn {
        text-align: center;
        line-height: .92rem;
        color: #ff2651;
        font-size: .32rem;
        position: absolute;
        bottom: 0;
        width: 100%;
        height: .92rem;
        background-color: #ffb843;
        border-bottom-right-radius: 20px;
        border-bottom-left-radius: 20px;
        &:active {

          background-color: #fddba4;
          color:#f8a6a6;
        }
      }
    }

  }


</style>
