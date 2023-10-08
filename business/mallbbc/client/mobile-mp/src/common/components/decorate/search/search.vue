<template>
    <view
        ref='container'
        class="mp-search-box"
        :style="[styles, otherStyles,{background:bgColor}]"
    >
        <!--左边-->
        <template v-if="decoInfo.showLeftText && decoInfo.leftData" v-for="(leftData, index) in decoInfo.leftData">
            <view
                :key='index'
                class="left-img"
                :style="[{background: 'url('+leftData.img+') no-repeat center/contain'}]" 
                @click="skipTo(leftData)"
            ></view>
        </template>

        <!--中间-->
        <view class='input-container'>
            <view
                :style="{background: 'url('+decoInfo.searchImg+') no-repeat center/contain'}"
                class="search_img"
            ></view>
            <div
                type="text"
                class="input"
                :style="[{
                    color: decoInfo.color,
                    backgroundColor: decoInfo.searchBackground,
                    height: decoInfo.showUnion ? '68rpx' : '100%',
                    borderRadius:setSearchBorderRadiu(decoInfo),
                    paddingLeft:!!decoInfo.searchImg?'66rpx':'20rpx',
                    position:'absolute',
                    right:decoItem.props.show_style=='section'?'-14rpx':'0',
                    width:decoItem.props.show_style=='section'?'calc(100% + 14rpx)':'100%'
                }]"
                @click="goSearch(decoItem)"
                placeholder-class="search_input"
            >
                {{decoItem.props.inputVal}}
            </div>
            <div class="searchBtn" 
                :style="[{
                    backgroundColor:decoInfo.btnBackground,
                    borderRadius:setSearchBtnBorderRadiu(decoInfo)
                }]"
                v-if="decoInfo.showBtn"
                @click="goSearch(decoItem,decoInfo)"
            >
                搜索
            </div>
        </view>

        <!--右边-->
        <template v-if="decoInfo.showRightText&&!decoInfo.img">
            <view v-for="(item1, index) in (decoInfo.rightData)"
                :key='index'
                class="right-img"
                @click="skipTo(item1)"
            >
                <image
                    v-if='item1.img'
                    :src="item1.img"
                    mode="heightFix"
                ></image>
            </view>
        </template>
        <!--右边-->
        <view
        v-if="decoInfo.showRightText&&!!decoInfo.img"
        class="msg_img"
        :style="[{background: 'url('+decoInfo.img+') no-repeat center/contain'}]" 
        @click="skipTo(decoInfo)"
        >
        </view>
  </view>  
</template>

<script>
import { skipTo, isNotEmpty, colorToRgba } from "@/utils/common.js";
import mixin from "@/common/components/decorate/common/mixin/index";

export default {
    name: "deco-search",
    mixins: [mixin],
    components: {},
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        },
        parentScrollTop: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            decoInfo: this.decoItem.data[0] || {},
            bgColor: this.decoItem.data[0].background || 'rgba(255, 255, 255, 1)'
        };
    },
    computed: {
        setSearchBorderRadiu(){
            return item =>{
                let borderRadius
                if(!item.searchBorderRadiu&&item.searchBorderRadiu!=0){
                    borderRadius = '16rpx'
                }else{
                    borderRadius = item.searchBorderRadiu*2 +'rpx'
                }
                return borderRadius
            }
        },
        setSearchBtnBorderRadiu(){
            return item =>{
                let borderRadius
                if(!item.btnBorderRadiu&&item.btnBorderRadiu!=0){
                    borderRadius = '16rpx'
                }else{
                    borderRadius = item.btnBorderRadiu*2 +'rpx'
                }
                return borderRadius
            }
        },
        otherStyles() {
            const [ , marginRight, , marginLeft ] = this.decoItem.styles[0]?.margin || [];
            const margin = Number(marginRight || 0) + Number(marginLeft || 0);
            const { props: { fixed, suspend }} = this.decoItem;
            // 小程序没有addFixed 吸顶和悬浮暂时按相同处理
            if (fixed || suspend) {
                return {
                    position: "fixed",
                    top: getApp().globalData.navHeight + "px",
                    left: 0,
                    zIndex: 99,
                    width: "calc(100% - " + margin + "px)",
                }
            }
            return {
                width: "calc(100% - " + margin + "px)",
            };
        }
    },
    watch: {
        decoItem: {
            handler(val, oldVal){
                if(isNotEmpty(val) && JSON.stringify(val) != JSON.stringify(oldVal)){
                    this.initBackgroud(val);
                    this.initSpace(val);
                }    
            },
            deep: true,
            immediate: true
        },
        parentScrollTop: {
            handler(val, oldVal){
                if(val > 3){
                    let opacity = val / 100;
                    opacity = opacity > 1 ? 1 : opacity;
                    this.decoInfo = !!this.decoItem.data[1]?this.decoItem.data[1]:this.decoItem.data[0];
                    this.bgColor = colorToRgba(JSON.parse(JSON.stringify(this.decoInfo.background)), opacity);
                }else{
                    this.decoInfo = this.decoItem.data[0];
                    this.bgColor = this.decoInfo.background;
                }

                // if(val > 3){
                //     let opacity = val / 200;
                //     opacity = opacity > 1 ? 1 : opacity;
                //     this.setStatusbar1();
                //     this.setTitlebar1(opacity);
                // } else {
                //     this.setStatusbar0();
                //     this.setTitlebar0();
                // }
            },
            deep: true,
            immediate: true
        },
    },
    created(){
        
    },

    methods: {
        //搜索跳转
        goSearch({ props },item) {
            if (!!!props.linkVal) {
                return;
            }
            if(!!item?.showBtnSearch){
                let path = '/views/goods/list/index'
                this.$Router.push({
                    path,
                    query:{
                        keyword:item.btnSearchText,
                        storeAndSupplierInfos:JSON.stringify(props.storeAndSupplierInfos)
                    }
                })
            }else{
                skipTo({url_type: 'url', url:props.linkVal, storeAndSupplierInfos: props.storeAndSupplierInfos }, this);
            }
        },
        // 相关跳转
        skipTo(item) {
            skipTo(item, this);
        }
    }
};
</script>

<style lang="scss" scoped>
.mp-search-box {
  position: relative;
  height: auto;
  width: 100%;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  .input-container {
    position: relative;
    flex: 1;
    height: 68rpx;
    line-height: 68rpx;
    text-align: left;
    font-size: 28rpx;
    box-sizing: border-box;
    border-radius: 20rpx;
    .input{
        border-radius: 16rpx;
        height: 100%;
        font-size: 28rpx;
    }
    .searchBtn{
        width: 120rpx;
        height: 56rpx;
        position: absolute;
        right: 6rpx;
        top: 6rpx;
        text-align: center;
        line-height: 56rpx;
        font-size: 28rpx;
        color: #fff;
    }
  }
  .search_img {
    position: absolute;
    width: 30rpx;
    height: 30rpx;
    left: 30rpx;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
  }
  .search_input{
      text-align: left;
  }

  .msg_img {
    margin-left: 10rpx;
    width: 48rpx;
    height: 62rpx;
  }

  .left-img{
    margin-right: 16rpx;
    width: 44rpx;
    height: 44rpx;
  }
  .right-img{
      height: 68rpx;
      image{
        height: 100%;
      }
  }
}
.mp-search-box ::v-deep .input-container ::v-deep .uni-input-wrapper ::v-deep .uni-input-input {
  background-color: #f6f9fd;
}
</style>