<template>
    <view class="waterfall_container">
        <waterfall ref="waterfall" :add-time="addTime" v-model="list" :mode="mode">
            <template v-slot:left="{leftList}">
                <!-- 这里编写您的内容，item为您传递给v-model的数组元素 -->
                <thumbWaterfallV
                    v-for="(item, index) in leftList"
                    :key="index"
                    :isInOffcanvas="isInOffcanvas"
                    :goodsItem="item"
                    :showThumbTips="showThumbTips"
                />
            </template>
            <template v-slot:right="{rightList}">
                <thumbWaterfallV
                    v-for="(item, index) in rightList"
                    :key="index"
                    :isInOffcanvas="isInOffcanvas"
                    :goodsItem="item"
                    :showThumbTips="showThumbTips"
                />
            </template>
        </waterfall>
        <template v-if="showMoreComp">
            <noMoreDataDivider />
        </template>
    </view>
</template>

<script>
import thumbWaterfallV from "@/components/goods/thumb/thumb-decore-waterfall.vue";
import waterfall from "@/components/waterfall/index";
import noMoreDataDivider from "@/components/division/index.vue";
export default {
    name:'goodsList-waterfall',
    data(){
        return {
            loading: false
        }
    },
    props: {
        // 商品列表
        list: {
            type: [Array],
            default() {
                return []
            }
        },

        // 加入购物车的icon的图片样式展示
        icon_type: {
            type: Number
        },
      
        addTime:{
            type: [Number, String],
            default: 200
        },

        // 是否显示店铺信息
        showStoreInfo:{
            type: Boolean,
            default: true
        },

        // 瀑布流应用模式
        mode:{
            type: String
        },

        // 底部是否显示没有更多的按钮了
        showMore: {
            type: Boolean,
            default: false
        },

        // 是否显示imgThumb的tips遮罩
        showThumbTips: {
            type: Boolean,
            default: false
        },
        // 是否在侧边导航栏内
        isInOffcanvas: {
            type: Boolean,
            default: true
        }
    },
    components: {
        thumbWaterfallV,
        waterfall,
        noMoreDataDivider
    },
    watch:{
        list:{
            handler(){
                    
            },
            deep: true
        }
    },
    mounted(){
        // todo 此处加该变量的原因是，为了解决刷新页面的时候，先显示没有更多了的提示，再显示商品列表，给人感觉不太好， 因为此处 有一个更新装修的商品价格 名称 店铺logo的功能
        setTimeout(()=>{
            this.loading = true;
        }, 1500)
    },
    computed:{
        // 是否显示底部的没有更多了的提示
        showMoreComp(){
            return this.list.length > 0 && this.showMore && this.loading;
        }
    },
    methods: {
            
    }
        
}
</script>

<style lang='scss' scoped>
    .waterfall_container{
        width: 100%;
    }
</style>
