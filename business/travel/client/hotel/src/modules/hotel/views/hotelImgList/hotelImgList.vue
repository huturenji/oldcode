<template>
<div class="hotelImgList">
    <LoadingX v-show="isLoading" />
    <div class="noInfo" v-if="!isLoading&&imgList.length==0">暂无图片</div>
    <block v-for="(imgData,ind) in imgList" :key="ind">
    <div class="imgWrap" v-if="ind==imgListIndex">
        <div class="imginfoWrap">
            <div class="imgOut">
                <img class="previewer-demo-img cursorp" v-for="(item,index) in imgData.pictureInfo" :key="index" :src="item.src" @click="show(index,ind)">
            </div>
        </div>
    </div>
    </block>
    <div v-transfer-dom>
        <previewer v-for="(item, index) in imgList" :key="index" :list="item.pictureInfo" ref="previewer" :options="options"></previewer>
    </div>
    <div v-transfer-dom>
        <div class="tabWrap hotelImg">
            <div class="tabOut">
                <div class="tab" v-for="(imgData,ind) in imgList" :key="ind">
                    <div class="textWrap cursorp" :class="{active:ind==imgListIndex}" @click="imgListIndex=ind">
                        <span class="text">{{imgTypeMap[imgData.type]}}</span>
                        <br>
                        <span class="num">{{imgData.imgsLeng}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import hotelHandler from 'hotelHandler/hotelHandler.js'
import LoadingX from "components/loading/LoadingX.vue";
import {Previewer,TransferDom} from 'vux';  
export default {
    mixins: [hotelHandler.mixin.tChatEventMixin],
    directives: {
        TransferDom
    },
    components: {
        Previewer,
        LoadingX
    },
    data: function () {
        return {
            imgList:[],//图片list
            options: {//图片展示插件
                getThumbBoundsFn (index) {
                    let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
                    let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                    let rect = thumbnail.getBoundingClientRect()
                    return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
                }
            },
            isLoading:true,//数据加载中
            imgTypeMap:{ //图片类型map 
                0:'全部',
                1:'餐厅 ', 
                2:'休闲 ',
                3:'会议室',
                5:'外观 ',
                6:'大堂/接待台',
                8:'客房',
                10:'其他',
                11:'公共区域',
                12:'周边景点'
            },
            imgListIndex:0
        }
    },
    created: function () {
        let _this = this;
        _this.$emit('showOff', true);
        _this.getHotelDetail();           
    },
    mounted: function () {
    },
    watch: {},
    methods: {
        /**
         * 展示大图
         * @index 索引
         */
        show (index,ind) {
            this.$refs.previewer[ind].show(index)
        },
        /**
         * 获取图片数据（取缓存）
         */
        getHotelDetail:function(){
            var _this = this;
            _this.isLoading = false;
            if (!!hotelHandler.getStorage('hotelImgList')){
                _this.imgList = JSON.parse(hotelHandler.getStorage('hotelImgList'));
            }
        },
        /**
            * T信回退事件的注册回调 必须是goBackFun
            */
        goBackFun(){
            let _this = this;
            _this.$router.back();             
        }            
    }
}
</script>
<style lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.hotelImgList{
    padding-top: 1.1rem;
    font-size: 0;
    .previewer-demo-img{
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        width: 25%;
        padding: 0.02rem;
    }
    .noInfo{
        margin-top: 1.5rem;
        height: 0.5rem;
        padding-top: 3rem;
        text-align: center;
        font-size: 0.32rem;
        line-height: 0.42rem;
        color: @placeholder-color;
        background: url(~assets/img/hotel/empty.png) no-repeat center;
        background-size: 1.62rem 1.83rem;
    }

}
.pswp--supports-fs .pswp__button--fs{
    display: none !important;
}
.pswp__button.pswp__button--zoom{
    display: none !important;
}
    
.tabWrap.hotelImg{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: @sub-background-color;
    height: 1.1rem;
    .tabOut{
        display: -ms-flexbox;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        overflow-x: auto;
        padding: 0.15rem 0 0;
        .tab{
            -webkit-box-flex: 0 0 28%;      
            -moz-box-flex: 0 0 28%;        
            -webkit-flex:  0 0 28%;          
            -ms-flex:  0 0 28%;              
            flex:  0 0 28%;
            text-align: center;
            .textWrap{
                color: @third-text-color;
                display:inline-block;
                border-bottom: 0.04rem solid @sub-background-color;
                transition: all .3s;
                -moz-transition: all .3s;
                -webkit-transition: all .3s;
                -o-transition: all .3s;
                .text{
                    font-size: 0.3rem;
                    line-height: 0.45rem;
                }
                .num{
                    font-size: 0.28rem;
                    line-height: 0.35rem;
                }
            }
            .textWrap.active{
                color: @theme-color;
                border-bottom: 0.04rem solid @theme-color;
            }
        }
    }
}

</style>

