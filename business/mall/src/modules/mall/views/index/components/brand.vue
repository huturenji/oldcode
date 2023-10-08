<template>
    <div class="brand" :class="{suning: !!use, half: !isPC&&halfNum<=4}">  
        <div v-if="!!recommendBrandList && recommendBrandList.length>0" :class="{suning: !!use}" class="title">
            品牌精选
            <Icon type='icon_suning' v-if="use=='SN'" size=".32" />
        </div>

       <!-- 苏宁首页展示的品牌列表dom结构 -->
        <template v-if="use=='SN'">
            <!-- 苏宁PC端dom -->
            <template v-if='isPC'>
                <div class="container" :class="{sn_pc_suning: !!use}">
                    <div 
                        v-for="(item, index) in recommendBrandList"
                        :key="index"
                        class="container_item"
                    >  
                        <div class="brand_box" @click="gotoList(item)">
                            <img class="sn_pc_img" :src="brandImgList[item.brandNameEn]">
                            <p class="sn_pc_name">{{item.brandName}}</p>
                        </div>
                    </div>
                </div>
            </template>

            <!-- 苏宁移动端dom -->
            <template v-else>
                <div class="container" :class="{suning: !!use}">
                    <div>
                        <div 
                            v-for="(item, index) in recommendBrandList"
                            v-if="(index+1) <= halfNum" 
                            :key="index"
                            class="container_item"
                        >  
                            <div class="brand_box" @click="gotoList(item)">
                                <img :src="brandImgList[item.brandNameEn]">
                                <p>{{item.brandName}}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div 
                            v-for="(item, index) in recommendBrandList"
                            v-if="(index+1) > halfNum" 
                            :key="index"
                            class="container_item"
                        >  
                            <div class="brand_box" @click="gotoList(item)">
                                <img :src="brandImgList[item.brandNameEn]">
                                <p>{{item.brandName}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </template>


        <!-- 京东首页展示的品牌列表dom结构 -->
        <template v-else>
            <div class="container" :class="{suning: !!use}">
                <div 
                    v-for="(item, index) in recommendBrandList"
                    :key="index"
                    class="container_item"
                >  
                    <div class="brand_box" @click="gotoList(item)">
                        <img :src="brandImgList[item.brandNameEn]">
                        <p>{{item.brandName}}</p>
                    </div>
                </div>
            </div>
        </template>
        
    </div>
</template>
<script>
import Icon from 'commonComp/base/Icon';
import {brandImgList} from 'common/lib/enum/indexImgEnum';
import extendUtils from 'common/lib/utils';
export default {
    props:{
        recommendBrandList:{
            type: Array,
            default: ()=>[]
        },
        use: {
            type: String,
        }
    },
    components:{Icon},
    data(){
        return {
            brandImgList: brandImgList,
            isPC: extendUtils.isPC(),//区分移动端和PC端
        }
    },
    computed:{
        halfNum(){
            let length = this.recommendBrandList.length;
            let num = Math.ceil(length/2)
            if( num > 4){
                return num;
            }else{
                return 4;
            }
        },
    },
    methods: {
        gotoList(item){
            this.$router.push({
                path: '/product/list',
                query:{
                    keyWords:item.brandName == '苹果'? 'apple':item.brandName, //todo 此处针对苹果特殊处理
                    t: new Date().getTime()//增加时间戳，保证session中的判断都是forward
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.brand{
    &.suning{
        background: url(~themes/default/img/index/bg_suning_home.png) left center no-repeat, linear-gradient(149deg,#fef7db 1%, #fff9ee 83%);    
        background-size: auto 100%;
        overflow: hidden;
    }
    background: #fff;
    border-radius: 0.16rem;
    box-shadow:0px 4px 16px -4px rgba(125,155,250,0.1);
    .title{
        font-weight: bold;
        font-size: .34rem;
        padding: 0.3rem 0.32rem;
        line-height: .48rem;
        &.suning{
            color: #6D441C;
        }
        
    }
    .container{
        display: flex;
        flex-wrap: wrap;
        padding: 0 .2rem;
        // 苏宁的app端样式
        &.suning{
            display: block;
            overflow-x: auto;
            max-width: 100%;
            white-space: nowrap;
            padding-bottom: .3rem;
            .container_item{
                display: inline-block;
                background: #fff;
                padding: .1rem .3rem .1rem;
                width: 1.52rem;
                height: 1.52rem;
                box-shadow: -.02rem 0px .24rem -.14rem rgba(156,159,169,0.1);
                border-radius: .16rem;
                border: .02rem solid #FDF5BC;
                margin-bottom: .1rem;
                margin-right: .1rem;
                .brand_box{
                    width: .88rem;
                    height: .88rem;
                    p{
                        font-size: .24rem;
                        line-height: .34rem;
                        margin-top: -0.05rem;
                    }
                }
            }
        }
        // 苏宁的pc端样式
        &.sn_pc_suning{
            .container_item{
                width: 25%;
                text-align: center;
                margin-bottom: .5rem;
                padding:  0 .3rem;
                display: flex;
                justify-content: center;
                align-items: center;
                div.brand_box{
                    cursor: pointer;
                    width: 1.52rem;
                    height: 1.52rem;
                    box-shadow: -.02rem 0px .24rem -.14rem rgba(156,159,169,0.1);
                    border-radius: .16rem;
                    border: .02rem solid #FDF5BC;
                    background-color: #fff;
                    .sn_pc_img{
                        margin-top: .05rem;
                    }
                    .sn_pc_name{
                        margin-top: 0;
                    }
                    
                }
                p{
                    font-size: .28rem;
                    margin-top: .16rem;
                }
                img{
                    width: .88rem;
                    height: .88rem;
                }
            }

        }


        // 京东的pc端和app端样式
        .container_item{
            width: 25%;
            text-align: center;
            margin-bottom: .32rem;
            padding:  0 .3rem;
            div{
                cursor: pointer;
            }
            p{
                font-size: .28rem;
                margin-top: .16rem;
            }
            img{
                width: .88rem;
                height: .88rem;
            }
        }
    }
}
</style>
