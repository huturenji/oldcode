<template>
    <!-- 商品介绍部分组件 -->
    <view class="introduction">

        <!---------------- 规格参数 start --------------------->
        <template v-if="specsList && specsList.length > 0">
            <view class="spec_param" :class="{marginBot:specsList && specsList.length<=6}">
                <view class="spec_param_title">
                    <view class="redLine"></view>
                    <text>{{$L('规格参数')}}</text>
                </view>
                <view class="spec_param_list">
                    <view class="spec_param_pre" v-for="(item, index) in showSpecList" :key="index">
                        <view>{{item.parameterName}}</view>
                        <view>{{item.parameterValue}}</view>
                    </view>
                </view>
            </view>
            <view class="show_more_switch" @click="traggleSpecs" v-if="specsList && specsList.length>6">
                <view :class="{switch_up:showMoreSpecFlag}">{{showMoreSpecFlag?'收起':'展开'}}</view>
            </view>
        </template>
        <!---------------- 规格参数 end --------------------->


        <!---------------- 商品参数 start --------------------->
        <template v-if="(params && params.length > 0)">
            <view class="detail-desc_title params_html_title">
                <view class="redLine"></view>
                <text>{{$L('商品参数')}}</text>
            </view>
            <view class="params_html" :class="{marginBot:paramsLen<=6}">
                <table cellpadding="0" cellspacing="1" width="100%" border="0" class="Ptable">
                    <tbody v-for="(item, _index) in showParamsList" :key="_index">
                        <tr>
                            <th colspan="2">{{item.groupName}}</th>
                        </tr>
                        <tr class="wxflex" v-for="(attr, _key) in item.attrs" :key="_key">
                            <td>{{attr.name}}</td>
                            <td>{{attr.values.join('')}}</td>
                        </tr>
                    </tbody>
                </table>
            </view>
            <view class="show_more_switch" @click="traggleParams" v-if="paramsLen>6">
                <view :class="{switch_up:showMoreParamsFlag}">{{showMoreParamsFlag?'收起':'展开'}}</view>
            </view>
        </template>
        <!---------------- 商品参数 end --------------------->


        <!---------------- 商品详情 start --------------------->
        <view class="detail-desc_title">
            <view class="redLine"></view>
            <text>{{$L('商品详情')}}</text>
        </view>
        <view v-if="!!detailStr" class="detailContent" ref="contentBox">
            <div v-html="detailStr" class="goodsDetailDom"></div>
            <!-- 商品详情顶部商品图 swiper 图片点击的时候，图片方法手势缩放的功能 -->
            <photoswipe ref="prImgs1" :imgs.sync="detailImgList"></photoswipe>                    
        </view>
        <!---------------- 商品详情 end --------------------->

        <!---------------- 商品包装 start --------------------->
        <template v-if="wareQD">
            <view class="detail-desc_title">
                <view class="redLine"></view>
                <text>{{$L('商品包装')}}</text>
                <view class="detail-line"></view>
            </view>
            <view class="wareQD_html">
                <rich-text :nodes="getNodes(wareQD)" class="bz_html"></rich-text>
            </view>
        </template>
        <!---------------- 商品包装 end --------------------->


        <!---------------- 价格说明 start --------------------->
        <template v-if="judgeShowPriceRule()">
            <view class="detail-desc_title">
                <view class="redLine"></view>
                <text>{{$L('价格说明')}}</text>
                <view class="detail-line"></view>
            </view>
            <view class="priceRuleWrap">
                <rich-text :nodes="getNodes(priceRule)"></rich-text>
            </view>
        </template>
        <!---------------- 价格说明 end --------------------->

        <!---------------- 温馨提示 start --------------------->
        <template>
            <view class="detail-desc_title">
                <view class="redLine"></view>
                <text>{{$L('温馨提示')}}</text>
                <view class="detail-line"></view>
            </view>
            <view class="priceRuleWrap">
                <rich-text :nodes="getNodes(tips)"></rich-text>
            </view>
        </template>
        <!---------------- 温馨提示 end --------------------->
    </view>
</template>
<script>
import {isNotEmpty} from '@/utils/common.js';
import {supplierTypeEnum, priceRule, tips} from '@/common/lib/enum/product'
import photoswipe from '@/components/photoswipe/photoswipe.vue';
var weRich = require('we-rich');
export default {
    components:{
        photoswipe
    },
    props:{  
        // 商品详情
        goodsDetail:{
            type: Object,
            default: () => {}
        },
        // 规格参数列表
        specsList:{
            type: Array,
            default: () => []
        },
        // 商品参数列表
        params:{
            type: Array,
            default: () => []
        },
        // 商品参数列表
        introduction:{
            type: String,
            default: ''
        },
        // 商品包装
        wareQD:{
            type: String,
            default: ''
        },
        goodsParamsTop:{
            type: [Number,String],
            default:0
        },
        specsParamsTop:{
            type: [Number,String],
            default:0
        }
    },
    watch:{
        introduction:{
            async handler(val){
                if (isNotEmpty(val)){
                    this.detailStr = this.formatedomStrImg(val)
                    await this.$nextTick()
                    this.setDetailDomscale();
                }
            },
            deep: true,
            immediate: true
        },
        params:{
            handler(val) {
                if (val && val.length>0) {
                    let len = 0
                    this.paramsNew = val.reduce((sumArr,currentValue,index) => {
                        if (len < 6) {
                            sumArr.push({
                                groupName:currentValue.groupName,
                                attrs:[]
                            })
                        }

                        len = len + 1;
                        currentValue.attrs.forEach(item => {
                            if (len < 6) {
                                sumArr[index].attrs.push(item)
                            }
                            len = len + 1;
                        })
                        return sumArr
                    },[])
                    this.paramsLen = val.reduce((sum,current) => {
                        sum+=1+current.attrs.length;
                        return sum
                    },0)
                }
            },
            deep: true,
            immediate: true
        },
        showMoreParamsFlag: {
            handler(val) {
                if (!val) {
                    this.showParamsList = this.paramsNew
                } else {
                    this.showParamsList = this.params
                }
            },
            immediate: true
        },
        showMoreSpecFlag: {
            handler(val) {
                if (!val) {
                    this.showSpecList = this.specsList.slice(0,6)
                } else {
                    this.showSpecList = this.specsList
                }
            },
            immediate: true
        }
    },
    data(){
        return {
            detailStr: '', //商品详情富文本字符串
            setDetailDomZoomSum:0,//设置商品详情缩放次数
            setDetailDomZoomMaxSum:5,//设置商品详情最大缩放次数
            detailImgList:[], //商品详情详情页背景图片地址数组形式
            supplierTypeEnum: supplierTypeEnum,//显示价格说明的供应商枚举
            priceRule: priceRule,//价格说明的内容
            tips:tips,//温馨提示
            paramsNew:[], //商品参数行数超过6行时生成的新数组
            showParamsList:[], //页面渲染用的商品参数列表
            showMoreParamsFlag:false, //是否展开所有商品参数 true：已展开
            paramsLen:0, //商品参数总行数
            showMoreSpecFlag:false, ////是否展开所有规格参数 true：已展开
            showSpecList:[] //页面渲染用的规格参数列表
        }
    },
    methods: {
        traggleParams(){
            this.showMoreParamsFlag = !this.showMoreParamsFlag
            if (!this.showMoreParamsFlag) {
                uni.pageScrollTo({
                    scrollTop: this.goodsParamsTop
                });
            }
        },
        traggleSpecs() {
            this.showMoreSpecFlag = !this.showMoreSpecFlag
            if (!this.showMoreSpecFlag) {
                uni.pageScrollTo({
                    scrollTop: this.specsParamsTop
                });
            }
        },
        /**
         * 详情图片预览显示
         * @param str domstr
         */
        formatedomStrImg(domStr){
            let that = this;
            if (''==domStr || !!!domStr){
                return '';
            }

            try {
                window.prviewImageDetail = function(e){
                    if (!!e.src){
                        that.detailImgList = [e.src];
                        that.imgheight = e.height + 'rpx';
                    } else {
                        let img=document.defaultView.getComputedStyle(e, null)['background-image'];
                        let h=document.defaultView.getComputedStyle(e, null)['height'];
                        that.detailImgList=[img.substring(img.indexOf('url("')+5,img.indexOf('")'))];
                        that.imgheight=parseFloat(h)+'rpx';
                    }
                    
                    that.$nextTick(()=>{
                        that.$refs.prImgs1.initImage();
                    })
                }
            } catch (error) {
                
            }
            let tempStr = this.escape2Html(domStr);
            let dealStr;
            if (tempStr.indexOf("<img")>=0){
                dealStr = tempStr.replace(/<img /g,'<img onclick="prviewImageDetail(this)"');
            } else {
                dealStr = tempStr.replace(/class="ssd-module /g,'onclick="prviewImageDetail(this)" class="ssd-module ');
            }
            return dealStr;
        },

        //设置商品详情dom缩放
        setDetailDomscale(){
            setTimeout(() => {
                this.$nextTick(()=>{
                    try {
                        this.setDetailDomZoomSum++;
                        //对于商品详情图片缩放进行优化，带图片渲染完成后取图片宽度，在根据容器宽度进行缩放
                        let contentBox = this.$refs.contentBox.$el;
                        let dom = document.getElementsByClassName('goodsDetailDom')[0];
                        let oWidth = parseInt(this.getStyle(contentBox, 'width'))
                        let maxwidth = this.$config.GOODS.DETAIL.DESCRIPTION.MAX_WIDTH;
                        let clientWidth = dom.clientWidth || maxwidth;
                        if (this.setDetailDomZoomSum < this.setDetailDomZoomMaxSum && (clientWidth < ( maxwidth/5))){
                            this.setDetailDomscale();
                            return;
                        }
                        let scale = oWidth / clientWidth;
                        dom.style.zoom = scale;
                        dom.style.fontSize = parseInt(16 / scale) + 'px' ; //此处针对字体做特殊处理
                    } catch (error) {
                        console.log(error)
                    }
                })
            }, 200);
        }, 

        /**
         * dom字符转反转义
         * @param str domstr
         */
        escape2Html(str) {
            var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
            return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){ return arrEntities[t]; });
        },

        // 获取渲染的dom样式
        getStyle (obj, attr) {
            if (obj.currentStyle) { // 兼容IE
                return obj.currentStyle[attr]
            } 
            return window.getComputedStyle(obj, null)[attr]
            ;
        },

        //将html标签转成rich-text支持nodes格式
        getNodes(nodes){
            try {
                return weRich.parse(nodes);
            } catch (error) {
                return ''
            }
        },

        // 判断价格规则展示
        judgeShowPriceRule(){
            return this.goodsDetail && ((this.supplierTypeEnum[this.goodsDetail.supplierType]||{}).showPriceRule)
        }
    }
}
</script>
<style scoped lang='scss'>
.redLine{
    width:6rpx;
    height:24rpx;
    background: var(--tagColor);
    margin-right:12rpx;
}
/***********************************  规格参数 start ******************************/
.spec_param {
    background: #FFFFFF;
    &.marginBot {
        margin-bottom: 56rpx;
    }
    .spec_param_title {
        display: flex;
        align-items: center;
        text {
            font-size: 30rpx;
            
            font-weight: bold;
            color: #222222;
            line-height: 42rpx;
        }
    }

    .spec_param_list {
        margin-top: 24rpx;
        box-sizing: border-box;
        overflow: hidden;
        border-radius: 6rpx;

        .spec_param_pre {
            width: 690rpx;
            display: flex;
            align-items: center;
            font-size: 28rpx;
            font-weight: 400;
            color: #222222;
            line-height: 36rpx;
            border: 1px solid #dfdfdf;
            border-bottom: 0;
            view:nth-child(1) {
                display: flex;
                align-items: center;
                width: 212rpx;
                display: inline-block;
                justify-content: flex-end;
                /* line-height: 70rpx; */
                // text-align: right;
                padding-left: 24rpx;
                height: 100%;
            }

            view:nth-child(2) {
                flex:1;
                /* height: 70rpx; */
                line-height: 72rpx;
                padding-left: 24rpx;
                box-sizing: border-box;
                border-left: 1px solid #dfdfdf;
            }
        }

        .spec_param_pre:nth-last-child(1) {
            border-bottom: 1px solid #dfdfdf;
        }
    }
}
/***********************************  规格参数 end ******************************/


/***********************************  商品参数 start ******************************/
.detail-desc_title {
    margin-bottom: 24rpx;
    display: flex;
    align-items: center;

    text {
        font-size: 30rpx;
        
        font-weight: bold;
        color: #222222;
        line-height: 42rpx;
    }

    .image {
        width: 660rpx;
        height: 22rpx;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
    }

    .detail-line{
        font-size: 24rpx;
        padding-top: 10px;
        border-bottom: 1px solid #ddd;
    }

}

/***********************************  规格参数 end ******************************/
.detailContent{ 
    margin-bottom: 56rpx;           
    ::v-deep img{
        max-width: initial;
        vertical-align: top !important;
    }
    .goodsDetailDom{
        display: inline-block;
    }
}

.wareQD_html{
    margin-bottom: 56rpx;
    ::v-deep .bz_html{
            font-size: 24rpx;;
            div{
                max-width: 710rpx !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
                padding-top: 0 !important;
            }
            table{
                max-width: 710rpx !important;
            }
        }
}
.priceRuleWrap{
    color: #666;
    font-size: 26rpx;
    line-height: 40rpx;
    word-break: break-all;
    text-align: justify;
    ::v-deep p{
        margin-bottom:18rpx;
    }
    ::v-deep span{
        color:#222;
        font-weight: bold;
    }
}
.params_html{
    border-radius: 6rpx;
    overflow: hidden;
    &.marginBot {
        margin-bottom: 56rpx;
    }
    ::v-deep .Ptable {
        width: 100%;
        border-collapse: collapse;
        font-size: 28rpx;
        border-spacing: 0;
        line-height: 36rpx;
        color: #222222;
        th,td{
            padding: 16rpx 0 16rpx 24rpx;
            border: 1px solid #dfdfdf;
            text-align: left;
        };
        td:first-child{
            width: 212rpx;
        };
        td:last-child {
            word-break: break-all;
            flex: 1;
        };
    };

    ::v-deep .item-detail{
        padding: 16rpx;
        color: #666;
        font-size: 26rpx;
        border: 1px solid #dfdfdf;
    }
}
.show_more_switch {
    padding: 24rpx 0 36rpx;
    font-size: 24rpx;
    font-weight: bold;
    color: #222222;
    display: flex;
    justify-content: center;
    >view {
        width: fit-content;
        padding-right: 28rpx;
        background: url('@/static/shared/common/icon/btn_common_downarrow1.svg') right/20rpx 20rpx no-repeat;
        &.switch_up {
            background: url('@/static/shared/common/icon/btn_common_uparrow1.svg') right/20rpx 20rpx no-repeat;
        }
    }
}
</style>