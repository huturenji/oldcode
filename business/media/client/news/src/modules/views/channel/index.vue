/* eslint-disable no-unused-expressions */
<template>
    <div class='channel-page'>
        <section>
            <div class='btn icon-btn' @click='switchEdit'>{{!editing ? '编辑' : '完成'}}</div>
            <div class='title'>我的频道<span class='tips'>{{!editing ? '点击进入频道' : '拖动调整排序'}}</span></div>
            <div v-if='pickedData && pickedData.length==0' class='empty-text'>暂无已选频道</div>
            <draggable v-else tag="div" :list="pickedData" :options='dragOptions' :move='onDragMove' @end='updateChannel'>
                <transition-group type="transition" tag='ul' class="picked">
                    <li v-for='(data, index) in pickedData' class='pause' :class='{"disable": editing && isFixed(data),"editing":editing && !isFixed(data)}' 
                    :key='data.categoryId' ref='pickItem' @click='editing ? deleteData(data, index) : goToChannel(data)'>
                        <Icon v-if='editing && !isFixed(data)' class='del-btn' type='icon_common_delete2' size=".32"/>
                        <span class='no-wrap'>{{data.categoryName}}</span>
                    </li>
                </transition-group>
            </draggable>
        </section>
        <section>
            <div class='channel-tab-container'>
                <tab class='tab' :list='tabs' v-model='currTabIndex'/>
                <span class='tips'>点击添加频道</span>
            </div>
            <swiper v-model='currTabIndex' swiperId='channelSwiper' :options="swiperOptions">
                <swiper-item v-for="(item, index) in tabs" :key="item.categoryId">
                    <ul type="transition" class="unpick">
                        <!-- (unpickDataFilter[index] || []) -->
                        <li v-for='(data, index) in allUnpickData' :key='data.categoryId' 
                        @click.stop='addData(data, index, data.categoryId)'>
                            <span class='add'></span>
                            <span class='no-wrap'>{{data.categoryName}}</span>
                        </li>
                    </ul>
                    <div v-if='unpickData[index] && unpickData[index].length==0' class='empty-text'>已全部添加到我的频道</div>
                    <!-- v-if='currTabIndex==0' -->
                    <div class='more-btn normal-btn' v-if='false' @click='showAllIndustry=true'>
                        查看更多行业
                        <Icon type='icon_common_rightarrow' size=".24"/>
                    </div>
                </swiper-item>
            </swiper>
        </section>

        <div v-transfer-dom>
            <popup v-model="showAllIndustry" class='all-industry-container' position="right" width="100%" is-transparent>
                <div class='search-bar-content'>
                    <searchBar class='search-bar' ref='searchBar' v-model='searchKey' :async='true' @blur='cancelSearch' @cancel='cancelSearch'/>
                    <div class='mask' @click.prevent='goSearch' v-if='showSearchMask'>
                        <Icon type='icon_search_default' size='.32' />
                        搜索
                    </div>
                </div>
                <div class='all-industry'>
                    <tree :model='allIndustry' :keyword='searchKey' @click='addOrDelIndustry'/>
                    <div v-if='showEmpty' class='empty-page'>
                        抱歉，没有搜到相关内容
                    </div>
                </div>
            </popup>
        </div>    

    </div>
</template>
<script>
import extendUtils from 'common/lib/utils';
import newsHandler from 'common/lib/requestHandler/newsHandler';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import tab from 'commonComp/tab';
import Icon from 'commonComp/icon';
import draggable from 'vuedraggable'
import { Swiper, SwiperItem} from 'commonComp/swiper';
import { Popup , TransferDom } from 'vux';
import Flip from 'commonComp/flip';
const tree = ()=>import('commonComp/tree/index.vue');
const searchBar = ()=>import('commonComp/search/searchBar');

let title = document.title;

export default {
    directives: {TransferDom},
    mixins: [tChatEventMixin],
    components: {
        tab, Swiper, SwiperItem, Icon, draggable, Popup, tree, searchBar
    },
    data() {
        let that = this;
        return Object.assign(extendUtils.stateManager.setData([
            {
                name: 'showAllIndustry',
                show: {
                    title: '全部行业频道',
                    callback(){
                        that.searchKey = '';
                    }
                },
                hide: {
                    title: '自定义频道'
                }
            }
        ], this), {
            pickedDataStr: '',//已选择标签的json字符串
            pickedData: [],//已选择的标签
            unpickData: [],//未选择的标签
            tabs: [{categoryId:'NEWS', categoryName: '新闻频道'}], // {categoryId:'INDUSTRY', categoryName: '行业频道'},
            currTabIndex: 0,
            editing: false,
            allIndustry: null,//所有行业，树形结构数据
            showSearchMask: true,
            searchKey: null,//全部行业的搜索关键字
            swiperOptions:{ //swiper相关的配置              
                observer:true,
                observeParents:true,
                onSlideChangeStart: function(swiper){ //手指触碰Swiper并拖动slide时执行
                    that.currTabIndex = swiper.activeIndex;
                }
            },
            showEmpty: false,//所有行业搜索是否为空
            dragOptions: {
                disabled: true,
                filter: '.disable',
                scroll: false,
                ghostClass: "ghost",
                fallbackTolerance: 3
            },
            allUnpickData: [] // 处理后的所有未选择频道
        })
    },
    created() {
        this.useCacheData();//初次进页面时，如果有缓存数据，则先展示缓存数据，防止页面有闪动现象
        let pickedDataPromise = this.getPickedData();
        let unpickedDataPromise = this.getUnpickData();
        //用户选择的行业，和所有行业都查询完后，标识哪些是已经被添加过的
        Promise.all([pickedDataPromise, unpickedDataPromise]).then(res=>{
            this.filterUnpickData(res[1]);
            this.isIndustryAdded(this.allIndustry, this.pickedData, true);
        })
    },
    mounted() {
    },
    computed: {
        /**
             * 行业频道里的数据需要一直保持显示12个
             */ 
        unpickDataFilter(){
            const COUNT = 12;
            try{
                if(!this.unpickData || this.unpickData.lenght==0){
                    return this.unpickData;
                }
                let industry = this.unpickData[0] && this.unpickData[0].length>COUNT ? this.unpickData[0].slice(0, COUNT) : this.unpickData[0];
                return [
                    industry,
                    this.unpickData[1]
                ]
            }catch(e){
                console.error(e);
                return this.unpickData;
            }
        }
    },
    watch: {
        searchKey(_new){
            if(_new==null || _new==''){
                this.initIndustryList(this.allIndustry)
                return;
            }
            this.searchIndustry(this.searchKey, this.allIndustry)
        },
        allIndustry:{
            deep: true,
            handler(_new){
                if(!_new || !_new.children || _new.children.length==0 || _new.children.every(n=>{return n.hide === true;})){
                    this.showEmpty = true;
                }else{
                    this.showEmpty = false;
                }
            }
        },
        // 监听未选中数据的初始副职，扁平化处理该数据，方便后续增删操作
        unpickData(newVal){
            let channelList = [];
            newVal.forEach(item=>{
                channelList = channelList.concat(item)
            })
            this.allUnpickData = channelList
        }
    },
    methods: {
        /**
             * 获取缓存数据，并展示
             */ 
        useCacheData(){
            this.pickedData = this.getCacheData(newsHandler.primaryKey+'_myChannels') || [];
            let allChannels = this.getCacheData(newsHandler.primaryKey+'_allChannels');
            if(this.pickedData.length>0 && !!allChannels && allChannels.length>0){
                //处理全部行业频道数据结构，形成tree结构
                this.getAllIndustryTree(allChannels); 
                this.filterUnpickData(allChannels);
                this.isIndustryAdded(this.allIndustry, this.pickedData, true);
            }
        },
        getCacheData(key){
            let result = extendUtils.getStorage(key);
            return !!result ? JSON.parse(result) : null;
        },
        /**
             * 拖拽动画事件。不可拖拽到disable的元素上
             */ 
        onDragMove(evt, originalEvent){
            if(originalEvent.target && originalEvent.target.classList.contains('disable')){
                return false;
            }
            return true;
        },
        /**
             * 封装全部行业数据
             */ 
        getAllIndustryTree(data){
            return new Promise(resolve=>{
                let allIndustry = {
                    root: true,
                    children: data//现在只有一级，所以都在根节点下
                }
                resolve(allIndustry)
            })
        },
        getAllChannels(searchWord=''){
            return newsHandler.getAllChannels({state: "ENABLE",sortType: 'PRIORITY', pageSize: 999999, pageIndex: 1,categoryName: searchWord})
        },
        /**
             * 我的频道
             */ 
        async getPickedData(){
            //服务器数据
            let serverData = await newsHandler.getMyChannels({
                userId: newsHandler.userId,
                companyId: newsHandler.companyId,
                channelId: newsHandler.channelId
            });
            this.pickedData = serverData.result && serverData.result.categories || [];
            this.pickedDataStr = JSON.stringify(this.pickedData);
        },
        /**
             * 推荐频道
             */ 
        async getUnpickData(){
            //只查有效的。这里查询所有的，不分页，所以给一个很大的pageSize
            let allChannel = await this.getAllChannels()
            let channels = allChannel.result && allChannel.result.hitResult || [];
            //将返回的数据格式解析
            let industryChannels = [];//推荐的行业频道
            let newsChannels = [];//所有新闻频道
            let allIndustry = [];//所有行业频道
            channels.forEach(c=>{
                if(c.categoryType=='INDUSTRY'){
                    //行业频道数据
                    industryChannels.push(c);
                    //全部行业tree结构数据
                    allIndustry.push({
                        id: c.categoryId,
                        name: c.categoryName
                    });
                }else if(c.categoryType=='NEWS'){
                    newsChannels.push(c);
                }
            })
            let result = [industryChannels, newsChannels];
            //处理全部行业频道数据结构，形成tree结构
            this.allIndustry = await this.getAllIndustryTree(allIndustry); 
            //记住此次查询的数据  
            try{
                // eslint-disable-next-line no-unused-expressions
                !!allIndustry && allIndustry.length>0 && extendUtils.setStorage(newsHandler.primaryKey+'_allChannels', JSON.stringify(result));
            }catch(e){
                console.error(e)
            }
            return result;
        },
        /**
             * 过滤“未选择”列表中已被选择的频道
             */ 
        filterUnpickData(unpickData){
            let result = [];
            unpickData.forEach((channel)=>{
                let arr = []
                channel.forEach(c=>{
                    if(this.pickedData.findIndex(picked=>{return picked.categoryId==c.categoryId})==-1){
                        arr.push(c);
                    }
                })
                result.push(arr);
            })
            this.unpickData = result;
        },
        /**
         * 移除
         * @param index tab的索引
         */ 
        deleteData(data, index){
            if(!this.isFixed(data)){
                let aniDom = this.$refs.pickItem[index];
                let dataIndexOfTab = this.getIndexByCategory(data.categoryType);//当前标签所属的tab的索引

                this.setPickedData(data, false);
                this.setUnpickedData(data, true);
                this.setAllIndustryItemValue({id: data.categoryId}, false);

                let flip = new Flip();
                //如果标签所属的tab是active状态，才执行flip动画
                if(this.currTabIndex == dataIndexOfTab){
                    //执行Flip动画前，先读取当前元素的位置信息
                    flip.read(aniDom);
                    //执行动画
                    this.$nextTick(()=>{
                        let currDom = document.querySelectorAll('.unpick')[dataIndexOfTab].getElementsByTagName('li')[0];
                        flip.play(currDom)
                    })
                    return;
                }

                //执行动画：删除的标签移动到tab上
                this.$nextTick(()=>{
                    try{
                        //如果是在“我的频道”里面删除
                        if(aniDom){
                            let offset;//终点位置的偏移量
                            let pickedLi = document.querySelector('.picked').querySelectorAll('li');
                            let firstChild = pickedLi[0];
                            //计算列数
                            //计算思路：如果当前元素（非第一个）的offsetLeft和第一个元素的一样（或更小），说明当前元素是当前行的第一个元素；由此能得到第一行的元素个数，即列数
                            let col = 0;
                            Array.prototype.some.call(pickedLi, (li, i)=>{
                                if(i!=0 && li.offsetLeft <= firstChild.offsetLeft){
                                    col = i;
                                    return true;
                                }
                            })
                            let remainder = 0;
                            //如果不止一行
                            if(col>0){
                                remainder = pickedLi.length % col;//余数，即最后一排的元素个数
                            }else{
                                remainder = pickedLi.length;
                            }
                            //如果余数是1，说明此时任删一个元素后，页面高度都会变，此时计算终点时，高度需要有偏移，偏移量为li一行的高度
                            if(remainder==1){
                                let style = extendUtils.getStyle(aniDom);
                                offset = {
                                    x: 0,
                                    y: -1*(aniDom.offsetHeight + parseFloat(style['marginTop']) + parseFloat(style['marginBottom']))
                                }
                            }
                            let endPoint;
                            if(dataIndexOfTab==null || dataIndexOfTab==undefined){
                                endPoint = document.querySelector('.more-btn');
                            }else{
                                endPoint = document.querySelectorAll('.tab-item')[dataIndexOfTab];
                            }
                            this.ghostMove(aniDom, endPoint, offset)
                        }
                    }catch(e){
                        console.info(e);
                    }
                })
            }
        },
        /**
             * 拷贝一份dom做动画
             */
        createVirDom(dom){
            let virDom = document.createElement('div');//拷贝一份
            virDom.innerText = dom.innerText;
            let rect = dom.getBoundingClientRect();
            //拷贝所有计算后的样式
            let domStyle = extendUtils.getStyle(dom);
            let styleText = domStyle.cssText;
            if(!styleText){//IE上拿不到计算后的cssText，只能遍历获取
                for(let i=0; i< domStyle.length; i++){
                    let key = domStyle.item(i);
                    styleText += key + ':' + domStyle.getPropertyValue(key) + ';';
                }
            }
            virDom.setAttribute('style', styleText);
            //设置定位和起始dom重叠
            virDom.style.position = 'absolute';
            virDom.style.zIndex = '99';
            virDom.style.left = rect.left + 'px';
            virDom.style.top = rect.top + 'px';
            virDom.style.margin = 0;
            return virDom;
        },
        /**
             * 拷贝一个dom做动画效果
             */ 
        ghostMove(dom, endPoint, offset={x:0,y:0}){
            let domPosition = dom.getBoundingClientRect();
            let endPointPosition = endPoint.getBoundingClientRect();
            let ghost = this.createVirDom(dom);//拷贝dom
            let duringTime = 0.5;
            const scale = 0.2;//结束时的缩放比例
            ghost.style.transform = 'none';
            ghost.style.transition = `transform ${duringTime}s cubic-bezier(0,0,0.32,1)`;
            let invert = {
                left: endPointPosition.left + endPoint.offsetWidth/2 - domPosition.left - dom.offsetWidth/2 + offset.x,
                top: endPointPosition.top + endPoint.offsetHeight/2 - domPosition.top - dom.offsetHeight/2 + offset.y
            }
            document.body.appendChild(ghost);
            //添加偏移
            setTimeout(()=>{
                ghost.style.transform = `translate(${invert.left}px, ${invert.top}px) scale(${scale})`;
            }, 0)
            //动画执行完后删除dom
            setTimeout(()=>{
                ghost.remove();
            },duringTime*1000)
        },
        /**
             * 添加
             */ 
        async addData(data, index, categoryId){
            let flip = new Flip();
            // let dataIndexOfTab = this.getIndexByCategory(data.categoryType);
            this.setPickedData(data, true);
            // this.setUnpickedData(data, false);
            // this.setAllIndustryItemValue({
            //     id: data.categoryId
            // }, true);
                
            //index有值，说明不是“全部行业”里面添加的，此时需要有动画
            //if(index!=null && index!=undefined){
            let dom = document.querySelector('ul.unpick').querySelectorAll('li')[index];
            flip.read(dom);
            //}
            this.$nextTick(()=>{
                //if(index!=null && index!=undefined){
                let domArray = document.querySelector('ul.picked').getElementsByTagName('li')
                flip.play(domArray[domArray.length-1])
                //}
            })
            let deleteItemIndex;
            let result = this.allUnpickData.some((item,itemIndex)=>{
                if (item.categoryId == categoryId){
                    deleteItemIndex = itemIndex
                    return true
                }
            })
            if(result){
                this.$delete(this.allUnpickData,deleteItemIndex)
            }
        },
        /**
             * 根据标签所属分类获得其所在的tab索引
             */ 
        getIndexByCategory(categoryType){
            return this.tabs.findIndex(tabb =>{return tabb.categoryId == categoryType});
        },
        /**
             * 切换编辑状态
             */ 
        switchEdit(){
            this.editing=!this.editing
            this.dragOptions.disabled = !this.editing;
            //关闭编辑时保存数据
            if(!this.editing){
                this.updateChannel();
                document.title = title;
            }else{
                document.title = '编辑'
            }
        },

        /**
             * 处理全部行业的数据，标识“已添加”
             */ 
        isIndustryAdded(industryList, pickedData, value){
            if(!industryList){
                return;
            }
            for(let child in industryList.children){
                let industry = industryList.children[child];
                if(industry.children && industry.children.length>0){
                    this.isIndustryAdded(industry, pickedData, value);
                }else if(pickedData.findIndex(picked => industry.id == picked.categoryId)!=-1){
                    this.$set(industry, "added", !!value);
                }
            }
        },
        /**
             * 手动选择“所有行业”中的某一项
             */ 
        addOrDelIndustry(item){
            let value = this.setAllIndustryItemValue(item);
            //转换数据格式
            let obj = {
                categoryId: item.id,
                categoryName: item.name,
                categoryType: 'INDUSTRY'
            }
            this.setPickedData(obj, value);
            this.setUnpickedData(obj, !value);
        },

        /**
             * 改变全部行业中的项的添加/删除状态
             */ 
        setAllIndustryItemValue(data, value){
            let industry = this.chooseItem(data, this.allIndustry);
            if(!industry){
                return false;
            }
            this.$set(industry, "added", value!=null ? !!value : !!!industry.added);
            return industry.added;
        },

        /**
             * 设置我的频道数据
             */ 
        setPickedData(data, value){
            if(!!value){
                this.pickedData.push(data);
            }else{
                this.pickedData.splice(this.pickedData.findIndex(d=>d.categoryId==data.categoryId),1);
            }
        },


        /**
             * 设置未选择的频道
             */ 
        setUnpickedData(data, value){
            let dataIndexOfTab = this.getIndexByCategory(data.categoryType);//当前标签所属的tab的索引
            //刷新推荐频道的数据
            for(let i=0;i<this.unpickData.length;i++){
                let channel = this.unpickData[i];
                if(i==dataIndexOfTab){
                    // eslint-disable-next-line no-unused-expressions
                    !!value ? channel.unshift(data) : channel.splice(channel.findIndex(c=>c.categoryId==data.categoryId), 1);
                    break;
                }
            }
        },

        /**
             * 更新频道数据。如果出错，不回滚数据
             */ 
        updateChannel(){
            //如果我的频道数据未变化，则不用请求接口
            if(JSON.stringify(this.pickedData) == this.pickedDataStr){
                return Promise.resolve();
            }
            //只提交非固定的频道
            let param = {
                userId: newsHandler.userId,
                companyId: newsHandler.companyId,
                channelId: newsHandler.channelId,
                categories: this.pickedData.filter(data=>{return !this.isFixed(data)}).map(data=>{return data.categoryId})
            }
            return newsHandler.updateChannel(param);//请求接口
        },

        /**
             * 获取”所有行业“中的行业对象
             */ 
        chooseItem(item, list){
            for(let child in list.children){
                let industry = list.children[child];
                if(industry.children && industry.children.length>0){
                    let res = this.chooseItem(item, industry);
                    if(!!res){
                        return res;
                    }
                }else if(industry.id == item.id){
                    return industry;
                }
            }
        },

        /**
             * 进入频道
             */ 
        goToChannel(data){
            //如果保存成功，则返回成功数据给上一个页面；否则直接关闭
            this.updateChannel().then(()=>{
                let loadData = {
                    type: 'updateChannel',
                    data: this.pickedData,
                    target: data
                };
                loadData = JSON.stringify(loadData);
                extendUtils.closePage('', 1, loadData);          
            }).catch(e=>{
                console.error(e);
                extendUtils.showConfirm('保存频道失败', function(){
                }, 1, null, '确定', null, null, true);
            });
        },

        /**
             * 开始搜索
             */ 
        goSearch(){
            this.showSearchMask = false;
            this.$refs.searchBar.focus();
        },

        /**
             * 初始化“全部行业”列表的数据，包括：是否展开，是否隐藏
             */ 
        initIndustryList(list){
            for(let child in list.children){
                let industry = list.children[child];
                if(industry.children && industry.children.length>0){
                    this.initIndustryList(industry);
                }
                this.$delete(industry, 'uncollapsed');
                this.$delete(industry, 'hide');
            }
        },

        /**
             * 搜索全部行业
             */ 
        async searchIndustry(keyword){
            if(keyword==null || keyword==undefined || keyword==''){
                return;
            }
            let industryList = await this.getAllChannels(keyword);
            let channels = industryList.result && industryList.result.hitResult || [];
            this.updateIndustryList(this.allIndustry, channels);
        },

        updateIndustryList(list, resultData){
            let index = list.children.length;
            while(index--){
                let industry = list.children[index];
                if(industry.children && industry.children.length>0){
                    this.updateIndustryList(industry.children, industry);
                    let empty = industry.children.every(child=>{
                        return child.hide === true;
                    });
                    this.$set(industry, "hide", empty);
                    if(!empty){
                        this.$set(industry, 'uncollapsed', true);
                    }
                }else{
                    this.$set(industry, "hide", resultData.findIndex(data=>data.categoryId == industry.id)==-1)
                }
            }
        },

        /**
             * 取消搜索
             */ 
        cancelSearch(){
            if(this.searchKey==null || this.searchKey==''){
                this.showSearchMask=true;
            }
        },

        /**
             * 判断元素是否固定
             */ 
        isFixed(data){
            // return data && data.specialType && data.specialType.indexOf('FIXED')>-1
            return data && data.categoryId==1;
        },

        /**
             * 关闭窗口
             */ 
        goBackFun(){
            //如果保存成功，则返回成功数据给上一个页面；否则直接关闭
            this.updateChannel().then(()=>{
                let loadData = {
                    type: 'updateChannel',
                    data: this.pickedData
                };
                loadData = JSON.stringify(loadData);
                extendUtils.closePage('', 1, loadData); 
            }).catch(e=>{
                console.error(e);
                extendUtils.showConfirm('保存频道失败', function(){
                    extendUtils.closePage('');
                }, 1, null, '确定', null, null, true);
            });
        }

        // refresh(){
        //     extendUtils.reloadPage()
        // }
    }
}
</script>
<style lang="less" scoped>
@import "~themes/default/styles/channel/index.less";
</style>