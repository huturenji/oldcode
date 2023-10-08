<template>
    <div class="personal-wrap">
        <!-- 顶部的头像部分 -->
        <div class="top-bg">
            <div class="mine">
                <div class="user-head">
                    <!-- 头像组件 -->
                    <avatar :uaid="uaId"/>
                </div>
                <p class="name">{{userName}}</p>
            </div>
        </div>

        <!-- 下侧的列表部分 -->
        <div class="list-item">
            <!-- 悦览室 -->
            <div @click="$moduleGate(()=>gotoPage('/readingRoom'))" class="item">
                <div class="left">
                    <Icon type='icon_zixun_zaiyue_sel' size=".4" />
                    <span>悦览室</span>
                </div>
                <div class="right">
                    <Icon type='icon_common_rightarrow' size=".25" />
                </div>
            </div>
            <!-- 我的收藏 -->
            <div @click="gotoPage('/favorite')" class="item">
                <div class="left">
                    <Icon type='icon_zixun_shoucang_sel' size=".4" />
                    <span>我的收藏</span>
                </div>
                <div class="right">
                    <Icon type='icon_common_rightarrow' size=".25" />
                </div>
            </div>

            <!-- 我的点赞 -->
            <div  @click="gotoPage('/like')" class="item">
                <div class="left">
                    <Icon type='icon_zixun_dianzan_sel' size=".4" />
                    <span>我的点赞</span>
                </div>
                <div class="right">
                    <Icon type='icon_common_rightarrow' size=".25" />
                </div>
            </div>

            <!-- 阅读历史 -->
            <div @click="gotoPage('/readHistory')" class="item">
                <div class="left">
                    <Icon type='icon_zixun_yuedulishi' size=".4" />
                    <span>阅读历史</span>
                </div>
                <div class="right">
                    <Icon type='icon_common_rightarrow' size=".25" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Icon from 'commonComp/icon';
import { avatar } from 'commonComp/avatar';
import extendUtils from 'common/lib/utils';
import newsHandler from 'common/lib/requestHandler/newsHandler';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
export default {
    name:'personal',
    mixins: [tChatEventMixin],
    components: {
        Icon,
        avatar
    },
    data(){
        let that = this;
        return Object.assign(extendUtils.stateManager.setData([
               
        ], that), {
            userName:'尊敬的用户',
            uaId: newsHandler.uaId
        })
    },
    created(){
        this.userName = newsHandler.userName || '尊敬的用户';
    },
    methods:{
        /**
        *  跳转相关的页面
        */
        gotoPage(path){
            this.$router.push({
                path:path,
                query:{
                    pageFrom:'personal'
                }
            })
        },

        /**
         * T信回退事件的注册回调 必须是goBackFun
         * 此时回退一步
         */
        goBackFun(){
            extendUtils.closePage(null, 1);                       
        },

        /** 
        * 右上角的app的刷新回调
        */
        // refresh(){
        //     this.clearWebViewCache();
        // },

        /**
         * 首页点击右上角的刷新，调取jsbridge清空webview缓存的方法(目前只有安卓T信适用，mpaas版本和ios都没有)
         */
        clearWebViewCache(){
            try {
                sinosdk.sino.clearWebViewCache();
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>
<style lang="less" scoped>
@import "~themes/default/styles/personal/index.less";
</style>
