<template>
    <div class="wrap" :style="bgStyle">
        <div v-if="showTitle" class="title">{{documentTitle}}</div>
        <!-- banner部分 -->
        <div class="banner_wrap">
            <banner :data="bannerData">
                <cutDown v-if="showCutDown" slot="cutDown" :data="cutDownData" v-bind="$attrs"/>
            </banner>
        </div>

        <!-- 商品列表tab部分 -->
        <template>
            <tabList 
                :data="tabList"  
                :salesPriceText='salesPriceText' 
                v-on='$listeners' 
                v-bind="$attrs"
            />
        </template>

        <!-- 查看更多商品 -->
        <div class="view_more"><span @click="$emit('viewMore')">查看更多商品</span></div>
    </div>
</template>

<script>

import banner from 'common/components/banner/index';
import cutDown from 'common/components/cutDown/index';
import tabList from 'common/components/tabList/index';
export default {
    components:{banner, cutDown, tabList},
    props: {
        data: {
            type: Object,
            required: true,
            default: ()=>{}
        },
        showTitle:{
            type: Object,
            default: false
        }
    },
    data(){
        return {
            dataJson: {},
            activeIndex: 0,
         
        }
    },
    computed:{

       
        tabList(){
            try {
                return this.dataJson.tabList.data;
            } catch (error) {
                return []
            }
        },
        salesPriceText(){
            try {
                return this.dataJson.salesPriceText;
            } catch (error) {
                return '优惠价'
            }
        },
        cutDownData(){
            try {
                return this.dataJson.cutDown.data;
            } catch (error) {
                return {};
            } 
        },
        bannerData(){
            try {
                return this.dataJson.banner.data;
            } catch (error) {
                return [];
            } 
        },

        documentTitle(){
            try {
                return this.dataJson.title;
            } catch (error) {
                return '';
            } 
        },

        showCutDown(){
            try {
                return this.dataJson.showCutDown;
            } catch (error) {
                return true;
            } 
        },

        bgStyle(){
           try {
               if(this.dataJson.bgConfig.use == 'color'){
                   return {
                       background: this.dataJson.bgConfig.color
                   }
               }else if(this.dataJson.bgConfig.use == 'url'){
                   return {
                       backgroundImage: `url(${this.dataJson.bgConfig.url})`,
                       backgroundPosition: 'top center',
                       backgroundRepeat: 'repeat-y',
                       backgroundSize: '100% auto',
                   }
               }else{
                    return {
                        background: '#fff'
                    }
               }
           } catch (error) {
                return {
                    background: '#fff'
                }
           }
       }
        
     
    },
    watch:{
        data: {
            handler(val){
                this.initData();
            },
            deep: true
        },



        documentTitle(val){
            if(!!val){
                document.title = val;
            }
        }
    },
    mounted(){
        this.initData()
    },
    activated(){
        
    },
    methods:{
        initData(){
            this.dataJson = this.data;            
        },

        clickTabs(item, index){
            this.activeIndex = index;
        },

       

    }
}
</script>


<style lang="less" scoped>
// 屏幕尺寸
@screen-sm: 550px;
@screen-md: 768px;
@screen-lg: 1080px;
//------------ 移动端通用样式 -------------
@media screen and (max-width: @screen-sm) {
    
}
.view_more{
    text-align: center;
    color: #fff;
    font-size: .26rem;
    cursor: pointer;
    margin-bottom: .5rem;
    span{
        &:active{
            opacity: .8;
        }
    }
    width: 100%;
    
}

//------------ pc端通用样式 包括pc客户端 浏览器端 -------------
@media screen and (min-width: @screen-sm) {
    .wrap{
        width: 100%;
        .title{
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 1px solid #f5f5f5;
            background: #fff;
        }

       
    }
}

</style>