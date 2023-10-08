<template>
    <!--注意： 下方的swipe-handler这个class类代表该类下的dom才能够左右滑动操作swiper 在最外层判断添加该class是为了当没有数据的时候，只能滑动空dom部分不能滑动整个list页面 -->
    <div class="listTemplateWrap" :class="{'swipe-handler': listData.length <= 0 && !showSlotTop, showSlotTop}">
        <mescrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
            <!-- 行业列表的插槽 目前只有在首页专用设备tab页才显示 -->
            <slot name="top"></slot>
            
            <div ref='dataList' class='dataList swipe-handler' >
                <div class="newsItemListWrap" :class="{showWowinfo:showWowinfo}" v-for='(item, index) in listData' :key="index">
                    <multiDel @click.native="clickCheckItem(item, index)">
                        <multiDelItem :showCheck="showCheck">
                           
                            <!-- 列表的主体内容 -->
                             <template slot="content">
                                <newsItem 
                                    class='newsItem' 
                                    ref='newsItem'
                                    :key="item.articleId"
                                    :listItemConfig='listItemConfig'
                                    :newsInfo="item"
                                    :showCheck="showCheck"
                                    :keyword="keyword"
                                    :scrollTop="scrollTop"
                                    :showWowinfo="showWowinfo"
                                    @click.native='clickItem(item)'
                                ></newsItem>
                            </template>
       
                            <!-- 左侧的选择checkbox -->
                            <template slot="left-check">
                                 <checkButton :isChecked="item.isChecked"></checkButton>
                            </template>
                        </multiDelItem>
                    </multiDel>
                </div>
                <template v-if="showCustEmptyWrap">
                    <div class="empty-wrap" v-if="showEmpty">
                        <emptyPage :tips="mescrollUpConfig.empty.tip"></emptyPage>
                    </div>
                </template>
            </div>
        </mescrollVue>
    </div>
</template>
<script>
// import newsHandler from 'common/lib/requestHandler/newsHandler';
import mescrollMixin from './mixin/mescrollMixin';
import newsItem from 'commonComp/newsItem/index.vue';
import emptyPage from 'commonComp/emptyPage/index.vue';
import extendUtils from 'common/lib/utils';
import {multiDel, multiDelItem, checkButton } from 'commonComp/multiDel'; //批量选择的组件


export default {
    mixins: [mescrollMixin],
    components: {newsItem, multiDel, multiDelItem, checkButton, emptyPage},
    props: {
        listItemConfig: {
            type: Object,
            default(){
                return {}
            }
        },
        getDataFunc: {
            type: Function,
            default: async ()=>{
                return {
                    data: null,
                    pageIndex: 0,
                    pageCount: 0,
                    resultCount: 0
                }
            }
        },
        pageConfig: {
            type: Object,
            default: ()=>{
                return {
                    size: 10
                }
            }
        },
        ignoreId: {
            type: Array,
            default: null
        },
        mescrollUpConfig: {
            type: Object,
            default: ()=>{}
        },
        mescrollDownConfig: {
            type: Object,
            default: ()=>{}
        },  
        showCheck:{ //列表是否显示批量删除的按钮
            type: Boolean,
            default: false
        },
        value:{ //双向绑定的选中的列表的item，如果showCheck为true的话
            type:Array,
            default: ()=>[]
        },
        keyword:{//搜索关键字，用于高亮显示title
            type:String,
            default:''
        },
        showCustEmptyWrap:{//是否显示自定义的缺损页
            type:Boolean,
            default:false
        },
        showSlotTop:{//是否显示top插槽
            type:Boolean,
            default:false
        },
        showWowinfo:{//是否显示在阅信息
            type:Boolean,
            default:false
        }
    },
    data() {
        let mescrollDown = Object.assign({}, this.mescrollDownConfig);
        let mescrollUp = Object.assign({}, {
            page: this.pageConfig,
            empty: {
                warpId: null,
                tip: '暂无相关内容'
            }
        }, this.mescrollUpConfig);
        return {
            mescrollUp: mescrollUp,
            mescrollDown: mescrollDown,
            listData: [],
            loading: true,
            scrollTop: 0
        }
    },
    created() {

    },
    computed:{
        showEmpty(){
            return !this.loading && this.listData.length<=0
        }
    },
    mounted(){
        if(!this.showCustEmptyWrap){
            this.mescrollUp.empty.warpId = this.$refs.dataList;
        }
    },
    watch: {
        //删除新闻item
        ignoreId:{
            handler(_new){
                let that = this;
                if(_new != null){
                    let tempListData = JSON.parse(JSON.stringify(this.listData));//原数据的拷贝，现操作这个，最后再赋值给原数组
                    let domArr = []
                    //遍历需要删除的新闻id
                    _new.forEach(id=>{
                        //先在列表中找到这条新闻的索引，然后删除掉
                        let index = this.listData.findIndex((data, i)=>{
                            if(data.articleId == id){
                                let dom = this.$refs.newsItem[i].$el;
                                if(dom.offsetHeight>0){
                                    return true;
                                }
                            }
                            return false;
                        });
                        tempListData.splice(index, 1);
                        //拿到dom对象，并放入数组中，后面一起隐藏
                        let dom = this.$refs.newsItem[index].$el;
                        dom.style.height = extendUtils.getStyle(dom, 'height');
                        domArr.push(dom); 
                    })
                    setTimeout(() => {
                        //隐藏所有被删除的dom
                        domArr.forEach(dom=>{
                            dom.style.height='0px';
                        })
                        //等动画执行完再加载，否则高度计算不正确会导致无法判定当前状态可加载
                        setTimeout(()=>{
                            that.listData = tempListData;
                            that.mescroll.loadFull();
                        },250)
                    }, 100);
                }
            },
            deep:true
        },

        //监听新闻数据列表的变化，目前用途是为了将选中的商品emit出去
        listData:{
            handler(val){
                let that = this;
                if(!!this.showCheck && val.length > 0){ //如果是编辑状态的话此时需要将选择的数据emit出去
                    let list = val.filter(item=>{
                        return !!item.isChecked
                    })
                    that.$emit('input', list);
                }

            },
            deep:true
        }
    },
    methods: {

        /**
         * 初始化数据
         */ 
        init(clear,hideLoading=false){
            //初始化时是否清空原数据
            if(!!clear){
                this.listData = [];
            }else if(!hideLoading){
                //不清空数据时，显示上拉刷新布局
                this.mescroll.showDownScroll();
            }
            this.mescroll.resetUpScroll();
        },
      

        /** 
        * 数据根据特殊的key去重
        */
        uniqueArrByKey(arr, key){
            let objUniq = {};
            return arr.reduce((cur,next) => {
                // eslint-disable-next-line no-unused-expressions
                objUniq[next[key]] ? "" : objUniq[next[key]] = true && cur.push(next);
                return cur;                 
            }, [])
        },
    

        /**
         * 初始换相关数据
         */
        async getData(page, mescroll) {
            //全局广播暂停所有视频
            globalBus.$emit('videoPlayTypeUpdata','');
            let that = this;
            that.loading = true;
            let result = null;

            //请求业务侧数据
            try{
                result = await that.getDataFunc(page) || {};
                that.loading = false;
                //追加新数据
                let data = result && result.hitResult || [];
                let length = data.length;
                //如果是第一页，则重置数据
                if(page.num<=1){
                    that.listData = [];
                    
                }
                if(data && length>0){
                    that.listData.push(...data);
                }
                
                
                //兼容写法判断是否有下一页
                //systime：服务器时间(可空);用来解决这个小问题:当准备翻下一页时,数据库新增了几条记录,此时翻下一页,前面的几条数据会和上一页的重复;这里传入了systime,那么upCallback的page.time就会有值,把page.time传给服务器,让后台过滤新加入的那几条记录
                if(result.pageCount){//如果有总页数，则用总页数判断
                    mescroll.endByPage(length, result.pageCount, result.systime);
                }else if(result.resultCount){//如果有总条数，则按总条数判断
                    mescroll.endBySize(length, result.resultCount, result.systime);
                }else{//否则，用业务侧提供的flag来判断
                    mescroll.endSuccess(length, result.hasNext, result.systime);
                }
            }catch(e){
                that.loading = false;
                mescroll.endErr();
            }
            
        },
        

        clickItem(item){
            this.$emit('click', item)
        },
        /**
         * 列表mescroll滚动事件
         * @param y 轴滚动距离
         * @param isUp 向上滚动
         */
        onScroll(mescroll,y){
            this.scrollTop = y;
            this.$emit('scroll');
        },
        /**
         * 页面刷新入口函数 mescroll刷新回调
         * @param mescroll对象
         */
        refresh(){
            this.mescroll.resetUpScroll();
            this.$emit('afterRefresh')
        },

        /** 
        * 当为编辑状态的时候此时只操作选中与否
        * 编辑状态的判断条件为：showCheck = true
        */
        clickCheckItem(item){
            if(!!this.showCheck){ //如果是编辑状态的话，此时更新选中与否的状态
                this.$set(item, 'isChecked', !item.isChecked)
            }
        }
    }
};
</script>
<style lang="less" scoped>
    @import '~newsStyles/themes/default.less';
    @import '~newsStyles/mixins/mixinsStyle.less';
    .listTemplateWrap{
        height: 100%;
        /deep/ .newsItemListWrap{
            &:not(:last-of-type){
                .newItemWrap{
                    .newItemContentOutWrap{
                        .bbpx();
                    }
                }
            }
            background: #fff;
            &.showWowinfo{
                background: @background-color;
                .newItemWrap{
                    .newItemContentOutWrap:after{border: none;}
                }
            }
        }
        //当新闻列表为空，但是行业网站列表不为空的时候，缺损页的样式
        &.showSlotTop 
        /deep/ .mescroll{
            .empty-wrap{
                height: calc(~ '100vh - 4.6rem');
            }
        }
        &.swipe-handler{
            .empty-wrap{
                height: calc(~ '100vh - 2rem');
            }
        }
    }
    .newsItem{
        transition: height .25s ease-out;
    }
    /deep/ .mescroll{
        position: relative;
        .mescroll-empty{
            height: auto;
            position: absolute;
            left: 0;
            right: 0;
            top: 39%;
            transform: translateY(-50%);
            .empty-tip{
                color: @third-text-color;
                font-size: .3rem;
                margin-top: .08rem;
            }
        }
    }
    
  
</style>
<style lang="less" scoped>
    @import './style/mescroll.less';
</style>