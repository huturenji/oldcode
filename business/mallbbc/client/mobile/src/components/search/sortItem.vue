<template>
  <view class="sortWrapper" v-if="data">

      <view v-for="(sort,sortIndex) in data" :key="sort.sortType">
          <p>{{sort.title}}</p>
          <view class="item_wrapper">
              <view :class="['item',item.ifSelected?'item_active':'']" v-for="(item,index) in sort.list" :key="item.value" @click="chooseItem(sortIndex,index)">{{item.label}}</view>
          </view>  
      </view>
   
  </view>
</template>

<script>

export default {
    name: "sortItem",
    components: {},
    props: {
        data:{ // 分类数据
            type:Array,
            default:() => []
        }
    },
    data(){
        return {
            sortData: [], // 分类数组
            selectedItems:[]// 选中项数组
        }
    },
    methods:{
        /*
         * 选中事件
         * sortIndex：分类在数组中的索引
         * index: 选中的索引
         */
        chooseItem(sortIndex,index){
            let sortObj = {...this.data[sortIndex]};
            sortObj.list.forEach((item,itemIndex)=>{
                item.ifSelected = itemIndex === index;
            });
            
            // 更新分类数组中的状态
            this.$set(this.sortData,sortIndex,sortObj);


            // 拿到选中的筛选项目
            const selectedList = [];
            this.sortData.forEach((sort,parentId)=>{
                sort.list.forEach(item=>{
                    if (item.ifSelected){
                        let newItem = {...item};
                        newItem.sortType = this.sortData[parentId].sortType;
                        selectedList.push(newItem);
                    }
                })
            })
            
            this.$emit('select',this.sortData,selectedList);
        }
        
    },
    watch:{
        data:{
            handler:function(){
                this.sortData = this.data;
            }
        }
    }
}
</script>

<style lang="scss">
.sortWrapper{

    p{
        font-size: 28rpx;
        font-weight: bold;
        color: #333333;
        padding-left: 38rpx;
    }
    .item_wrapper{
        margin-top: 22rpx;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        .item{
            width: 192rpx;
            height: 68rpx;
            line-height: 68rpx;
            background: #eff2f5;
            font-size: 28rpx;
            font-weight: 400;
            text-align: center;
            border-radius: 34rpx;
            margin-bottom: 32rpx;
            cursor: pointer;
        }
        .item_active{
            font-weight: 600;
            color: var(--confirmBtnBgColor2);
            background-color: var(--buyNowColor);
        }
    }
}
</style>