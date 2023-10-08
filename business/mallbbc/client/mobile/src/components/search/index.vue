<template>
  <view class="search_panel_wrapper">
      <!-- 搜索框和筛选按钮 -->
      <view class="top_search">
          <view class="search_frame">
              <text class="iconfont icon_search"></text>
              <input type="text" class="searchInput" :placeholder="placeholder" v-model="keyword" @click="skipToSearch" >
          </view>
          <view v-if="!keyword" class="filter_btn" @click="open">
              <!-- <text class="iconfont icon_shaixuan shaixuan_icon"></text>
              <text class="shaixuan_font">筛选</text> -->
          </view>
          <view v-else class="cancel_btn" @click="cancelKeywordSearch">
              取 消
          </view>        
      </view>

      <!-- 下单时间筛选面板 -->
      <bottomPopup ref="time_panel_popup" type="bottom" text="订单筛选" height="832rpx" conBackground="#fff">
          <view class="time_panel">

              <!-- 筛选内容组件 封装成组件是防止日后增加筛选分类或者其他页面用到这种分类组件时可以直接复用和扩展 -->
              <sortItem
                :data="filterSortData"
                @select="selectChange"
              >
              </sortItem>

              <view class="btn_wrapper">
                  <view class="content_wrapper">
                      <button :class="['reset_btn',seletedItems.length === 0 ?'btn_opacity':'']"  @click="resetSelected" >重置</button>
                      <button :class="['confirm_btn',seletedItems.length === 0?'btn_opacity':'']"  @click="searchOrder" >确定</button>
                  </view>
    
              </view>
          </view>   
      </bottomPopup>
  </view>
</template>

<script>
import { getDateRange } from '@/utils/common.js';
import sortItem from './sortItem'
import bottomPopup from '@/components/bottom-popup/index.vue'
export default {
    name: "searchPanel",
    components: {
        sortItem,
        bottomPopup
    },
    props: {
        keyword:{ // 搜索关键字
            type:[String],
            default:() => ''
        },
        placeholder:{ // 搜索默认提示
            type:[String],
            default:() => '请输入搜索关键字'
        },
        panelTitleName:{ // 筛选面板标题
            type:[String],
            default:() => '筛选'
        }
    },
    data(){
        return {
            filterSortData:[{
                title:'下单时间',
                sortType:'dateRange',
                list:[
                    {label:'一个月内',value:'month',ifSelected:false},
                    {label:'三个月内',value:'threeMonths',ifSelected:false},
                    {label:'六个月内',value:'sixMonths',ifSelected:false},
                    {label:'今年',value:'currentYear',ifSelected:false},
                    {label:`${new Date().getFullYear() - 1}`,value:'lastYear',ifSelected:false},
                    {label:`${new Date().getFullYear() - 2}`,value:'previousYear',ifSelected:false}
                ]
            }], // 筛选分类数组
            filterParam:{
                keyword: '', // 查询关键字
                createTimeAfter:'', // 起始时间
                createTimeBefore:'' // 结束时间
            },// 选中时间范围的value值
            seletedItems :[] // 选中的时间项
        }
    },
    methods:{
        // 筛选面板开启
        open() {
            this.$refs.time_panel_popup.open();
        },
        // 筛选面板关闭
        close(){
            this.$refs.time_panel_popup.close();
        },
        /*
         * 筛选项选中事件
         */
        selectChange(newFilterSortData,seletedItems){
            this.filterSortData = newFilterSortData;
            this.seletedItems = seletedItems;

            if (seletedItems.length > 0){
                seletedItems.forEach(item =>{
                    if (item.sortType === 'dateRange'){
                        // 获取格式化后的日期范围值
                        let dateRangeObj = getDateRange(item.value);
                        this.$set(this.filterParam,'createTimeAfter',dateRangeObj.startDate);
                        this.$set(this.filterParam,'createTimeBefore',dateRangeObj.endDate);                        
                    }
                });
                const { createTimeAfter, createTimeBefore } = this.filterParam;
    
                let paramData;
    
                if (this.filterParam.createTimeAfter && this.filterParam.createTimeBefore){
                    paramData = { createTimeAfter ,createTimeBefore };
                }
                this.$emit('setSearchCondition',paramData);          
    
            }
        },
        /*
         * 查询订单
         */
        searchOrder(){

            // 查询
            this.$emit('filterSearchOrder');  
            // 关闭弹出面板
            this.close();
            
        },

        /*
         * 获取订单数据
         * paramObj：传递的参数
         */ 
        skipToSearch(){
            this.$emit('skipToSearch');
        },

        /*
         * 取消关键字查询
         */ 
        cancelKeywordSearch(){
            this.$emit('resetKeyword');
        },
        /*
         * 重置筛选分类
         */ 
        resetSelected(){
            this.filterSortData.forEach(sort=>{
                sort.list.forEach(item=>{
                    item.ifSelected = false;
                })
            });

            this.filterParam.createTimeAfter = '';
            this.filterParam.createTimeBefore = '';
            this.seletedItems = [];

            this.$emit('setSearchCondition',{});

            this.$emit('filterSearchOrder')
        }
        
    }
};
</script>

<style lang="scss" scoped>
.search_panel_wrapper{
    width: 750rpx;
    height: 88rpx;
    background-color: #fff;

    .top_search{
        width: 100%;
        height: 88rpx;
        padding: 0rpx 40rpx 0rpx 30rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .search_frame{
            width: 556rpx;
            height: 68rpx;
            border-radius: 16rpx;
            background: #eff2f5;
            display: flex;
            align-items: center;
            flex: auto;

            text{
                width: 30rpx;
                height: 30rpx;
                margin: 0 10rpx 0 20rpx;
                color: #999;
            }
            .searchInput{
                flex: 1;
                font-size: 28rpx;
            }
        }

        .filter_btn{
            flex: none;
            width: 100rpx;
            height: 40rpx;
            margin-left: 28rpx;
            cursor: pointer;
            background-image: url('@/static/shared/order/btn_hx_sc_wode.svg');
            background-repeat: no-repeat;
            // .shaixuan_icon{
            //     font-size: 28rpx;
            // }

            // .shaixuan_font{
            //     font-size: 28rpx;
            //     color: #222222;
            // }
        }

        .cancel_btn{
            flex: none;
            cursor: pointer;
            margin-left: 28rpx;
            font-size: 28rpx;
            color: #222222;

        }
    }

    .time_panel{
        width: 100%;
        height: 100%;
        background-color: #fff;
        position: relative;

        .btn_wrapper{
            width: 100%;
            height: calc(120rpx + var(--safe-area-inset-bottom));
            padding-bottom: var(--safe-area-inset-bottom);
            position: absolute;
            bottom: 0rpx;
            display: flex;
            justify-content: center;
            align-items: center;

            .content_wrapper{
                width:668rpx;
                display: flex;
                justify-content: center;

                button{
                    width: 334rpx;
                    height: 80rpx;
                    font-size: 30rpx;
                    font-weight: 600;
                }

                uni-button{
                    border: 1px solid var(--confirmBtnBgColor2);
                }
                uni-button::after{
                    border-radius: 0;
                    border: none;
                }                             
    
                .reset_btn{
                    color: var(--confirmBtnBgColor2);
                    border-radius: 20px 0px 0px 20px;
                }
    
                .confirm_btn{
                    background-color: var(--confirmBtnBgColor2);
                    color: var(--confirmBtnTextColor);
                    border-radius: 0px 20px 20px 0px;
                }

                .btn_opacity{
                    opacity: 0.4;
                }
            }
            
        }

    }

}
::v-deep .fade-out{
    top: calc(var(--titleBarFillHeight, 0px) + 88rpx) !important;
}
</style>>
