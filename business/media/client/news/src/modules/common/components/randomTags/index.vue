<template>
    <div class="randomTagsWrap">
        <div class="randomTagsOut">
            <!-- width100%的元素 -->
            <div class="randomTagsShow">
                <!-- width200%的元素用于动画交互 -->
                <div class="randomTagsContent" :style="leftStyle">
                    <div class="listWrap">
                        <div class="stepWrap">
                            <div class="titleStep"><span>1</span>/2</div>
                            <div class="topBut normal-btn" @click="$emit('setUserchannelDone','')">跳过</div>
                        </div>
                        <div class="titleTop">
                            <div class="title">选择您关注的行业<span class='count'>{{choosedIndustry.length}}</span></div>
                        </div>
                        <div class="tips">定制您关心的行业资讯</div>
                        <div class="leftTagList">
                            <loading position="absolute" v-if="recommendData.industry.loading"></loading>
                            <emptyPage v-else-if="0==recommendData.industry.channelData"></emptyPage>
                            <div v-else class="tagItemWrap" v-for="(item, index) in recommendData.industry.channelData" :key="index">
                                <div class="tagItem" :class="{active:arrhaveitem(item.categoryId,choosedIndustry)}" @click="choosed(item.categoryId)">
                                    <div class="text">{{item.categoryName}}</div>
                                    <Icon class="checkBox" :type="arrhaveitem(item.categoryId,choosedIndustry) ? 'btn_common_checkbox_sel' : 'btn_common_checkbox_nor'" size=".24" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="listWrap">
                        <div class="stepWrap">
                            <div class="titleStep"><span>2</span>/2</div>
                            <div class="topBut normal-btn" @click="$emit('setUserchannelDone','')">跳过</div>
                        </div>
                        <div class="titleTop">
                            <div class="title">选择您感兴趣的内容<span class='count'>{{choosedNews.length}}</span></div>
                        </div>
                        <div class="tips">不一样的大世界，正在开启</div>
                        <div class="rightTagList">
                            <loading position="absolute" v-if="recommendData.news.loading"></loading>
                            <emptyPage v-if="0==recommendData.news.channelData"></emptyPage>
                            <div v-else class="tagItemWrap" v-for="(item, index) in recommendData.news.channelData" :key="index">
                                <div class="tagItem" :class="{active:arrhaveitem(item.categoryId,choosedNews)}" @click="choosed(item.categoryId)">
                                    <div class="text">{{item.categoryName}}</div>
                                    <Icon class="checkBox" :type="arrhaveitem(item.categoryId,choosedNews) ? 'btn_common_checkbox_sel' : 'btn_common_checkbox_nor'" size=".24" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
            <div class="pointWrap" v-if="false">
                <span class="point" v-for="(item,index) in [0,1]" :class="{active:index==showItemIndex}" :key="index"></span>
            </div>
            <div class="actionWrap">
                <div class="activeBut icon-btn" :class="{disable:false && (showItemIndex=='industry'&&choosedIndustry.length==0)||(showItemIndex=='news'&&choosedNews.length==0)}" @click="butAction()">{{showItemIndex=='industry'?'下一步':'开始吧'}}</div>
            </div> 
            <div class="changeWrap" v-show="0 < recommendData[showItemIndex].allChannelData.length">
                <span @click="changelist()" class="normal-btn" :class="{disable:!getCanDoChangeList()}"><Icon class="refresh" :type="'btn_nav_refresh_nor'" size=".36" />换一批</span>
            </div>
        </div>       
    </div>
</template>
<script>
// import extendUtils from 'common/lib/utils';
import newsHandler from 'common/lib/requestHandler/newsHandler';
import scrollLockMixin from 'common/lib/mixin/scrollLockMixin.js';
import Icon from 'commonComp/icon';
import emptyPage from 'commonComp/emptyPage';
import loading from 'commonComp/loading/loading.vue';
export default {
    mixins:[scrollLockMixin],
    components: {
        Icon,
        emptyPage,
        loading
    },
    props: {
    },
    data() {
        return {
            choosedIndustry:[],//选中的行业
            choosedNews:['1'],//选中的频道
            showItemIndex : 'industry',//展示列表索引
            recommendData:{
                "industry":{
                    getDataFunType:"INDUSTRY",//获取数据方法名
                    pageSize:15,//每页的条数
                    pageIndex:1,//页数
                    channelData:[],//数据
                    allChannelData:[],//所有数据
                    nochange:false,//没有换一批了
                    nomore:false,//没有更多了
                    loading:true//数据加载中
                },
                "news":{
                    getDataFunType:"NEWS",//获取数据方法名
                    pageSize:15,//每页的条数
                    pageIndex:1,//页数
                    channelData:[],//数据
                    allChannelData:[],//所有数据
                    nochange:false,//没有换一批了
                    nomore:false,//没有更多了
                    loading:true//数据加载中
                }
            },
            disableList:['1'],//要闻等频道默认勾选并且不可取消
            actioning:false//提交中
        };
    },
    computed:{
        leftStyle(){
            let index = 'industry' == this.showItemIndex ?0:1;
            return {
                left: '-' + index*100 + '%'
            }
        }
    },
    created() {
        this.initData();
    },
    mounted(){

    },
    watch: {

    },
    methods: {
        /**
         * 初始化相关数据
         */
        initData() {
            this.getRecommendDAta('industry');
            this.getRecommendDAta('news');
        },
        /**
         * 主按钮事件
         */        
        butAction () {
            let that = this;
            if('industry' == that.showItemIndex){
                // if(that.choosedIndustry.length==0){
                //     return
                // }
                that.showItemIndex = 'news';
            }else{
                // if(that.choosedNews.length==0){
                //     return
                // }
                that.setUserchannelDone();
            }
        },
        /**
         * 存储用户设置的频道和行业
         */ 
        setUserchannelDone(){
            let that = this;
            if(that.actioning){
                return;
            }
            let tempList = that.choosedIndustry.concat(that.choosedNews);
            let categoriesList = tempList.filter((item)=>{
                return '1'!=item;
            })
            if(0 == categoriesList.length){
                this.$emit('setUserchannelDone','');
                return;
            }
            let param = {
                categories:categoriesList
            }
            that.actioning = true;
            newsHandler.updateChannel(param).then(() => {
                that.actioning = false;
                this.$emit('setUserchannelDone','');
            }).catch(() => {
                that.actioning = false;
                this.$emit('setUserchannelDone','');
            });
            
        },
        /**
        * 数组是否包含元素
        */
        arrhaveitem(item, arr, key) {
            var isInArr = false;
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (!!key ? arr[i][key] == item : arr[i] == item) {
                    isInArr = true;
                    break;
                }
            }
            return isInArr;
        },
        /**
        * 元素在数组中的索引
        */
        indexOfArr(val, arr, key) {
            for (var i = 0; i < arr.length; i++) {
                if (!!key ? arr[i][key] == val : arr[i] == val) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * 换一批
         */	
        changelist(){
            let that = this;
            if(that.getCanDoChangeList()){
                that.getRecommendDAta(that.showItemIndex)
            }
        },
        /**
         * 判断能否执行换一批
         */	
        getCanDoChangeList(){
            let that = this;
            if('industry' == that.showItemIndex){
                return !that.recommendData['industry'].nochange
            }
            return !that.recommendData['news'].nochange
            
        },
        /**
         * 选择选项
         */	
        choosed(value){
            let that = this;
            let choosedArr = 'industry' == that.showItemIndex?'choosedIndustry':'choosedNews';
            if(that.arrhaveitem(value,that[choosedArr])){//取消选择
                if(that.arrhaveitem(value,that.disableList)){//要闻不可取消
                    return;
                }
                that[choosedArr].splice(that.indexOfArr(value, that[choosedArr]), 1);
            }else{//选择
                that[choosedArr].push(value);
            }
        },
        /**
         * 获取推荐频道数据
         * @param type 行业或新闻,industry、news
         */	
        getRecommendDAta(type){
            let that = this;
            //没有更多了
            if(that.recommendData[type].nomore){
                //循环展示数据 
                that.loopChangeList(type,that.recommendData[type].pageSize); 
                that.recommendData[type].channelData = that.recommendData[type].allChannelData.slice(-1*that.recommendData[type].pageSize);             
                return;
            }
            let actionNameType = that.recommendData[type].getDataFunType;
            let param ={
                pageSize:that.recommendData[type].pageSize,
                pageIndex:that.recommendData[type].pageIndex,
                categoryType:actionNameType,
                state:"ENABLE",//生效
                sortType: 'PRIORITY'
            }
            newsHandler.getAllChannels(param).then((res) => {
                that.recommendData[type].loading = false;
                that.recommendData[type].allChannelData = that.recommendData[type].allChannelData.concat(res.result.hitResult);
                //第一页不足，判断为没有更多了，"换一批"按钮置灰
                if(1==that.recommendData[type].pageIndex && res.result.resultCount <= that.recommendData[type].pageSize){
                    that.recommendData[type].nochange = true;
                //第二页为0，判断为没有更多了，"换一批"按钮置灰
                }else if(2==that.recommendData[type].pageIndex && res.result.hitResult.length ==0){
                    that.recommendData[type].nochange = true;
                //没有更多数据了，第二页开始
                }else if(res.result.hitResult.length < that.recommendData[type].pageSize){
                    that.recommendData[type].nomore = true;
                    //获取最后一页所缺的数据长度
                    that.loopChangeList(type,that.recommendData[type].pageSize-res.result.hitResult.length);
                //还有数据
                }else{
                    that.recommendData[type].pageIndex++;
                }
                that.recommendData[type].channelData = that.recommendData[type].allChannelData.slice(-1*that.recommendData[type].pageSize);
            }).catch((err) => {
                console.log(err);
                that.recommendData[type].loading = false;
            });
        },
        /**
         * 处理数据循环展示
         * @param type 行业或新闻,industry、news
         * @param length 循环处理数据的长度
         */	
        loopChangeList(type,length){
            let that = this;
            //获取最后一页所缺的数据长度
            let moveLeng = length;
            //获取数组前moveLeng条数据
            let moveArr = that.recommendData[type].allChannelData.slice(0,moveLeng);
            //前moveLeng条数据移动到末尾
            that.recommendData[type].allChannelData.splice(0,moveLeng);
            that.recommendData[type].allChannelData = that.recommendData[type].allChannelData.concat(moveArr);
        },
        /**
         * 获取数据是否没有更多了
         * @param type 行业或新闻,industry、news
         * @param channels 请求返回的数据
         */	
        setNomoreData(type,pageChannels){
            let that = this;
            //第一页不足，判断为没有更多了，"换一批"按钮置灰
            if(0==that.recommendData[type].pageIndex && pageChannels.length < that.recommendData[type].pageSize){
                that.recommendData[type].nochange = true;
                //第二页为0，判断为没有更多了，"换一批"按钮置灰
            }else if(1==that.recommendData[type].pageIndex && pageChannels.length ==0){
                that.recommendData[type].nochange = true;
            }
        }

    }
};
</script>
<style lang="less">
    @import "index.less";
</style>