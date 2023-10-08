<template>
  <view
    ref='container'
    class="mp-search-box"
    :style="{
      background: background,
      position:position,
      top:top,
      zIndex:zIndex
    }"
    v-margin="decoItem"
  >
    <!--左边-->
    <template v-if="decoInfo.showLeftText">
        <view
            v-for="(leftData, index) in decoInfo.leftData"
            :key='index'
            class="left-img"
            :style="{background: 'url('+leftData.img+') no-repeat center/contain'}" 
            @click="skipTo(leftData)"
        ></view>
    </template>

    <!--中间-->
    <view class='input-container'>
        <view
            :style="{background: 'url('+decoInfo.searchImg+') no-repeat center/contain'}"
            mode="aspectFit"
            class="search_img"
        ></view>
        <div
            type="text"
            class="input"
            :style="{
                color: decoInfo.color,
                backgroundColor: decoInfo.searchBackground,
                height: decoInfo.showUnion ? '68rpx' : '100%',
                position:'absolute',
                right:decoItem.props.show_style=='section'?'-14rpx':'0',
                width:decoItem.props.show_style=='section'?'calc(100% + 14rpx)':'100%',
                paddingLeft:!!decoInfo.searchImg?'66rpx':'20rpx',
                borderRadius:setSearchBorderRadiu(decoInfo)
            }"
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
    <view
      v-if="!decoInfo.showUnion && decoInfo.showRightText&&!!decoInfo.img"
      class="msg_img"
      :style="{background: 'url('+decoInfo.img+') no-repeat center/contain'}" 
      @click="skipTo(decoInfo)"
    >
    </view>
    <!--右边-->
        <template v-if="decoInfo.showRightText&&!decoInfo.img">
            <view v-for="(item1, index) in decoInfo.rightData"
                :key='index'
                class="right-img">
                <image
                    v-if='item1.img'
                    :src="item1.img"
                    mode="heightFix"
                    @click="skipTo(item1)"
                ></image>
            </view>
        </template>
  </view>
</template>

<script>
import { mapState } from "vuex";
import { skipTo, isEmpty,colorToRgba } from "@/utils/common.js";
import eventsMixin from '../common/mixin/eventsMixin'
export default {
    name: "deco-search",
    mixins: [eventsMixin],
    components: {},
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        },
        isChildren: {
            type: Boolean,
            default: false
        },
        parentScrollTop: {
            type: Number,
            default: 0
        },
        showTransition:{
            ype: Boolean,
            default: false
        }
    },
    data() {
        return {
            decoInfo: {},
            position:'',
            top:0,
            zIndex:0,
            background:''
        };
    },
    computed: {
        ...mapState(["userCenterData"]),
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
        }
    },
    watch: {
        decoItem: {
            handler(val, oldVal){
                if (isEmpty(val) || JSON.stringify(val) == JSON.stringify(oldVal)){
                    return;
                }
                if (this.decoItem.props.fixed){
                    this.$nextTick(()=>{
                        if (!this.isChildren){
                            this.$emit('addFixed', this.$refs.container?.$el, true)
                            this.custEvents.dispatch('addFixed', this.$refs.container?.$el, true)
                        }
                    })
                }
                this.setSearchStyle()
            },
            immediate: true
        },  
        parentScrollTop:{
            handler(val){
                let opacity
                if (val > 0) {
                    if(window.titleHeight + window.statusHeight!=0&&!!this.showTransition){
                        opacity = val / (window.titleHeight + window.statusHeight - 1);
                    }else{
                        opacity = 1
                    }
                    opacity = opacity > 1 ? 1 : opacity;
                    this.setDecoInfo(true,opacity);
                } else {
                    opacity = 1
                    this.setDecoInfo(false,opacity);
                }
                
            },
            immediate: true
        }             
    },
    created(){
        
    },
    mounted(){
        this.setSearchStyle()
    },
    beforeDestroy(){
        
    },
    methods: {
        setSearchStyle(){
            //适配银行新的ui（搜索在轮播图上方）新设置样式
            if (!this.decoItem.props.fixed&&this.decoItem.props.suspend){
                this.$nextTick(()=>{
                    if (!this.isChildren){
                        this.position = 'fixed'
                        this.top = window.titleHeight + window.statusHeight + 'px'
                        this.zIndex = 10
                    }
                })
            }else{
                this.$nextTick(()=>{
                    if (!this.isChildren){
                        this.position = ''
                        this.top = 0
                        this.zIndex = 10
                    }
                })
            }   
        },
        changeUnion(item){
            this.$emit('changeUnion', item)
            this.custEvents.dispatch('changeUnion', item)
        },
        setDecoInfo(reverse,opacity){
            if (isEmpty(this.decoItem?.data)){
                return;
            }
            let index = reverse ? (this.decoItem?.data.length > 1 ? 1 : 0) : 0;
            this.decoInfo = this.decoItem.data[index];
            this.background = colorToRgba(JSON.parse(JSON.stringify(this.decoInfo.background)),opacity);
        },
        //搜索跳转
        goSearch(item,info) {
            if (!!!item.props.linkVal) {
                return;
            }
            let index = item.props.linkVal.lastIndexOf("#");
            let path = item.props.linkVal.substring(index + 1, item.props.linkVal.length);
            let query = {};
            if(info&&!!info.showBtnSearch){
                query.keyword = info.btnSearchText
                path = '/standard/product/list'
            }
            try {
                query = {
                    ...query,
                    showStoreList: item.showStoreList // 当搜索商品列表时，是否显示店铺列表
                };

                if (
                    !!item.props.storeAndSupplierInfos && !!item.props.storeAndSupplierInfos.length
                ) {
                    //店铺和店铺下关联供应商的信息
                    query = {
                        ...query,
                        storeAndSupplierInfos: JSON.stringify(item.props.storeAndSupplierInfos) || "" //当搜索商品列表时，需要的店铺id参数
                    };
                }
            } catch (error) {
                query = {
                    showStoreList: true
                };
            }

            this.$Router.push({
                path,
                query
            });
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
//   position: relative;
  width: 750rpx;
  height: 88rpx;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  .input-container {
    position: relative;
    flex: 1;
    height: 68rpx;
    line-height: 56rpx;
    text-align: left;
    font-size: 28rpx;
    box-sizing: border-box;
    border-radius: 20rpx;
    // opacity: 0.8;
    line-height: 68rpx;
    padding-left: 66rpx;
    .input{
        border-radius: 16rpx;
        height: 100%;
        // width: calc(100% + 14rpx);
        padding-left: 66rpx;
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
    z-index: 99;
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
        height:100%
      }
  }
}
.mp-search-box ::v-deep .input-container ::v-deep .uni-input-wrapper ::v-deep .uni-input-input {
  background-color: #f6f9fd;
}
</style>