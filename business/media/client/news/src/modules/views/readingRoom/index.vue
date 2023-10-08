<template>
    <!-- 我的收藏页面 -->
    <div class="favorite-wrap">   
        <!-- <div @click="operationFun" class="operation" v-if="!noInfo">
            <span>{{this.showCheck ? '取消' : '编辑'}}</span>
        </div> -->
        <!-- 下部的列表和批量删除相关的功能 -->
        <div class="list-wrap">
            <div class="news-list" :class="{showCheck:showCheck}">
                <listTemplate 
                    ref='listTemplate' 
                    class="contentWrap" 
                    :listItemConfig="listItemConfig" 
                    :mescrollUpConfig="mescrollUpConfig"
                    :pageConfig='{size: GlobalConfig.PAGE_SIZE.DEFAULT}' 
                    :getDataFunc='getRecord'
                    :showCheck="showCheck"
                    v-model="choosedNewsList"
                    @onEmpty='empty=true'
                    @onLoadData='empty=false'
                    @scroll='listScroll()'
                    :showWowinfo="true"
                ></listTemplate>
            </div>
            <!-- 底部的删除和清空按钮 -->
            <template v-if="showCheck">
                <bottomBtn 
                    @clearAll="clearAll"
                    @deleteItem="deleteItem"
                />
            </template>
            
            <div class="emptyButWrap" v-if="empty">
                <div class="emptyBut icon-btn" @click="gotoIndex">更多资讯</div>
            </div>
            <div class="floatBut icon-btn" :class="{hide:floatButHide}" @click="gotoIndex">
                <!-- <div class="imgWrap">
                    <span>更多资讯</span>
                </div> -->
            </div>
        </div>
    </div>
</template>
<script>
import extendUtils from 'common/lib/utils';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import personalMixin from 'common/lib/mixin/personalMixin.js';
// import titleBarMixin from 'common/lib/mixin/titleBarMixin';
import newsHandler from 'common/lib/requestHandler/newsHandler';
// import Icon from 'commonComp/icon';
import listTemplate from 'commonComp/listTemplate';
import { TransferDom } from 'vux';
import { bottomBtn } from 'commonComp/multiDel'; //批量选择的组件底部的清空和删除按钮
export default {
    name:'readingRoom',
    mixins: [tChatEventMixin,personalMixin],
    directives: {
        TransferDom
    },
    components: {
        // Icon,
        listTemplate,
        bottomBtn
    },
    data(){
        let that = this;
        return Object.assign(extendUtils.stateManager.setData([
               
        ], that), {
            listType: 'readingRoom',//阅览室
            clearAllText: '确定删除所有阅读记录吗？',//确认删除提示语
            mescrollUpConfig:{ //列表的相关配置
                empty: {
                    warpId: null,
                    tip: '您的同事还没有看过的资讯去看看其他资讯吧'
                }
            },
            empty:false,//
            floatButHide:false,//更多资讯按钮是否隐藏
            time:null,//定时器
            cursor:null // // 资讯列表接口返回的页面索引ID
        })
    },
    created(){
    },
    mounted(){
        let that = this;
        sinosdk.sino.onChildWindowClose(function(res){//注册推送
            //刷新数据不清空数据不显示laoding
            res = extendUtils.analyzeWinCloseData(res);
            if(that.empty){
                that.$refs.listTemplate.init(false,true);
            }else if(res.type=='updateArticle'){
                globalBus.$emit('updateArticle',res.data);
            }
        }.bind(this));
    },
    watch:{
    },
    methods:{
        /**
         * 跳转首页
         */
        gotoIndex(){
            extendUtils.openPage('')
        },
        /**
         * 列表滚动
         */
        listScroll(){
            // eslint-disable-next-line no-unused-expressions
            !!this.time?clearTimeout(this.time):'';
            this.floatButHide = true;
            this.time = setTimeout(() => {
                this.floatButHide = false;
            }, 300);
        },
        /**
         * 初始化我的收藏列表
         */
        getRecord(page){
            let that = this;
            return new Promise((resolve)=>{
                //判断当前页  若 num == 1 两种情况 分别是 首页刷新 下拉刷新 这时要求cursor为null 从第二页开始要求根据cursor查询资讯列表
                if(page.num == 1){
                    this.cursor = null;
                }
                let param = {
                    companyId: newsHandler.companyId,
                    channelId: newsHandler.channelId,
                    userId: newsHandler.userId,
                    readingRoom: true,
                    pageSize: page.size,
                    pageIndex: page.num,
                    //查询时 若num == 1 cursor = null  若num !=1 cursor == this.cursor 
                    cursor:this.cursor
                }
                newsHandler.getNewsList(param).then(async res => {
                    if(res.resultCode == 0 && !!res.result){
                        let tempResult = res.result;
                        //获取接口返回的cursor
                        this.cursor = tempResult.cursor;
                        try {
                            tempResult.hitResult = await that.getWowList(tempResult.hitResult);
                            resolve(tempResult);
                        } catch (error) {
                            resolve({});
                        }
                        resolve(tempResult);
                    }else{
                        resolve({});
                    }
                }).catch(e => {
                    console.log(e);
                    resolve({});
                })
            })
        },
        /** 
        * 通过articleIds查询在阅名单
        */
        getWowList(tempResult){
            // let that = this;
            return new Promise((resolve) => {
                if(!tempResult || 0 == tempResult.length){
                    resolve([])
                }
                let resList = tempResult;
                let ids = tempResult.map(function(value){
                    return value.articleId;
                })
                let param = {
                    companyId: newsHandler.companyId,
                    channelId: newsHandler.channelId,
                    userId: newsHandler.userId,
                    articlesId: ids
                }
                newsHandler.getWowList(param).then(async res => {
                    if(res.resultCode == 0 && !!res.result){
                        let tempUsers = res.result.articleUsers;
                        resList = tempUsers ? tempResult.map(value => {
                            let index = tempUsers.findIndex(temp => {
                                return temp.articleId == value.articleId;
                            })
                            if(index > -1){
                                value = Object.assign({}, value, {thirdUserIds:tempUsers[index].thirdUserIds,readNumber:tempUsers[index].readNumber || 0});
                            }     
                            return value; 
                        }) : []
                        resolve(resList);
                    }else{
                        resolve([]);
                    }
                }).catch(e => {
                    console.log(e);
                    resolve([]);
                })
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import "~themes/default/styles/favorite/index.less";
</style>