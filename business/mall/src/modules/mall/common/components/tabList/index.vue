<template>
    <div v-if="show" class="tabs_goods_wrap">
        <!-- 商品列表tab部分 -->
        <div class="tabs_wrap" ref="tabWrap">
            <div class="tabs_container">
                <tab 
                    ref='tabBox'
                    :line-width=3
                    active-color='#FF8730'
                    default-color="#333333"
                    custom-bar-width='.4rem'
                    bar-active-color="#FF8730"
                    :scroll-threshold="4"
                >
                    <tab-item  
                        v-for="(item, index) in data"
                        :key="index"
                        :selected="index == activeIndex" 
                        @on-item-click="clickTabs(item, index)"
                    >{{item.name}}</tab-item>
                </tab>
            </div>
        </div>

        <!-- 商品列表 -->
        <div class="goodsList">
            <ul>
                <li 
                    v-for="(item, index) in goodsList"
                    :key="index"
                >   
                    <thumb01 
                        v-bind="$attrs"
                        :img="item.imgUrl"
                        :title="item.name"
                        :price="item.salePrice"
                        :limitNum="item.limitNum"
                        :supplierPrice="item.supplierPrice"
                        @addCart="addCart($event, item, index)"
                        @clickGoodsThumb="clickGoodsThumb(item, index)"
                    />  
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { Tab, TabItem } from 'vux'
import thumb01 from 'common/components/activity/goodsThumb/thumb01';
export default {
    components:{thumb01, Tab, TabItem},
    props: {
        data: {
            type: Array,
            required: true,
            default: ()=>[]
        }
    },
    data(){
        return {
            activeIndex: 0,
        }
    },
    computed:{


        show(){
            return this.data.length > 0;
        },

        goodsList(){
            return this.data[this.activeIndex].goodsList;
        }
     
    },
    watch:{
        // 第一次进来的时候 获取tab距离顶部的高度即可
        data(val, oldVal){ 
            if(!!oldVal && oldVal.length <= 0 && val && val.length > 0){
                this.initOffsetTop();
            }
        }
    },
    mounted(){
        
    },
    activated(){
       
    },
    methods:{
        clickTabs(item, index){
            this.activeIndex = index;
            this.$emit('tabChange');
        },

        initOffsetTop(){
            setTimeout(() => {
                this.$nextTick(()=>{
                    let tabOffsetTop = this.$refs.tabWrap && this.$refs.tabWrap.offsetTop > 0 && this.$refs.tabWrap.offsetTop;
                    this.$emit('getTabOffsetTop', tabOffsetTop);
                })
            }, 300);
        },
        /**
         * 加入购物车
         */
        addCart($event, item, index){
            this.$emit('addCart', $event, item, index)
        },

        /**
         * 点击商品块 跳转到商品详情
         */
        clickGoodsThumb(item, index){
            this.$emit('clickGoodsThumb', item, index)
        }
    }
}
</script>


<style lang="less" scoped>
// 屏幕尺寸
@screen-sm: 550px;
@screen-md: 768px;
@screen-lg: 1080px;
@tabBg: #ffeef0;
//------------ 移动端通用样式 -------------
@media screen and (max-width: @screen-sm) {
    .tabs_goods_wrap{
        width: 100%;
        .tabs_wrap{
            width: 100%;
            height: 1rem;
            padding: 0 .2rem;
            .tabs_container{
                padding: 0 .2rem;
                background: @tabBg;
                border-radius: .1rem;
                overflow: hidden;
                padding: 0 .2rem;
                /deep/ .vux-tab-wrap{
                    padding-top: 1rem;
                }
                /deep/ .vux-tab-container{
                    .vux-tab .vux-tab-item{
                        background: @tabBg;
                        font-weight: 500;
                        font-size: .28rem;
                        cursor: pointer;
                    }
                }
                /deep/ .scrollable{
                    background: @tabBg;
                }
                /deep/ .scrollable .vux-tab-item{
                    flex: 0 0 22%;
                }
                /deep/.scrollable .vux-tab-ink-bar{
                    bottom: 23px;
                }
                /deep/ .vux-tab-bar-inner{
                    border-radius: .02rem;
                }
            }
           
        }

        .goodsList{
            padding: .28rem .2rem;
            ul{
                width: 100%;
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                li{
                    background: #fff;
                    width: calc(~'50% - .1rem');
                    border-radius: .08rem;
                    box-shadow: -.02rem 0px .2rem -.04rem rgba(156,159,169,0.66); 
                    margin-bottom: .2rem;
                    overflow: hidden;
                }
            }
        }

       
    }
}


//------------ pc端通用样式 包括pc客户端 浏览器端 -------------
@media screen and (min-width: @screen-sm) {
    .tabs_goods_wrap{
        width: 100%;
        .tabs_wrap{
            width: 100%;
            height: 50px;
            padding: 0 10px;
            
            
            .tabs_container{
                background: #ffeef0;
                border-radius: 4px;
                overflow: hidden;
                padding: 0 10px;
                /deep/ .vux-tab-wrap{
                    padding-top: 50px;
                }
                /deep/ .vux-tab-container{
                    
                    .vux-tab .vux-tab-item{
                        background: #ffeef0;
                        font-weight: 500;
                        font-size: 14px;
                        cursor: pointer;
                    }
                }
                /deep/ .scrollable{
                    background: @tabBg;
                }
                /deep/ .scrollable .vux-tab-item{
                    flex: 0 0 22%;
                }
                /deep/.scrollable .vux-tab-ink-bar{
                    bottom: 23px;
                }
                /deep/ .vux-tab-bar-inner{
                    width: 20px !important;
                    border-radius: 2px;
                }
            }
           
        }

        .goodsList{
            padding: 15px 10px;
            ul{
                width: 100%;
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                li{
                    background: #fff;
                    width: calc(~'50% - 5px');
                    border-radius: 4px;
                    box-shadow: -1px 0px 10px -2px rgba(156,159,169,0.66); 
                    margin-bottom: 10px;
                    overflow: hidden;
                }
            }
        }

       
    }
}

</style>