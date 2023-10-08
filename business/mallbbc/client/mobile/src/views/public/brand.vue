<!-- 品牌列表 -->
<template>
    <view class="container">
        <uni-indexed-list :options="brandList" :showSelect="false" v-on:getData="getData" :hasMore="hasMore"></uni-indexed-list>
        <!-- <loadingState v-if="loadingState == 'first_loading'||brandList.length > 0" :state='loadingState'/> -->
    </view>
</template>

<script>
// import {
//     mapMutations
// } from 'vuex';
import uniIndexedList from "@/components/uni-indexed-list/uni-indexed-list.vue";
import goodsHandler from '@/components/goods/handler';
// import loadingState from "@/components/loading/loading.vue";
    
export default {
    components: {
        uniIndexedList
    },
    data() {
        return {
            brandList: [],
            current:1,
            pageSize:10,
            hasMore:false, //是否有更多
            loadingState: 'first_loading'
        }
    },
    mounted(){
        this.getData();
    },
    onLoad() {
        // this.getData();
    },
    methods: {
        //获取品牌列表
        getData() {
            goodsHandler.getBrandList({
                current:this.current,
                pageSize:this.pageSize
            }).then(res => {
                if (res.state == 200) {
                    let result = res.data;
                    if (this.current == 1){
                        this.brandList = result.list;    
                    } else {
                        this.brandList = this.brandList.concat(result.list)
                    }
                    this.hasMore = this.$checkPaginationHasMore(result.pagination); //是否还有数据
                    if (this.hasMore) {
                        this.current++;
                        this.loadingState = 'allow_loading_more';
                    } else {
                        this.loadingState = 'no_more_data';
                    }
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
            })
        }

    }
}
</script>

<style lang='scss'>
    page {
        background: $bg-color-split;
    }
    .container{
        width: 750rpx;
        margin: 0 auto;
    }
</style>
