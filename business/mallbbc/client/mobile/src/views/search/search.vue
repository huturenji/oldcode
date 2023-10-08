<template>
    <view class="container">
        <!-- #ifdef APP-PLUS -->
        <view class="status_bar">
            <!-- 这里是状态栏，除了h5不需要，其他端都需要 -->
        </view>
        <!-- #endif -->
        <!-- 搜索头部分 start -->
        <view class='sea_input_part'>
            <!-- #ifndef MP-WEIXIN -->
            <text v-if="false" class="back_icon iconfont icon_arrow_left" @click="navBack"></text>
            <text></text>
            <!-- #endif -->
            <view class="search_center">
                <text class="iconfont icon_search"></text>
                <input ref="searchComp" focus class='sea_input' type='text' :value="input_val" :placeholder="placeholder" @input="inputChange"
                    @confirm='search' maxlength="100"/>
                <image class='clear_content' v-show="input_val" @click="clearInputVal"
                    :src="imgUrl+'common/icon/icon_search_clean.svg'" />
            </view>
            <text class='sea_btn' @click="btnSearch()">{{$L('搜索')}}</text>
        </view>
        <!-- 搜索头部分 end -->

        <view class="contentBox">
        <!-- 搜索联想的列表 start-->
        <view v-show="searchList.length>0" class="searchList_wrap">
            <ul>
                <li @click="btnSearch(item.key)" v-for="(item, index) in searchList" :key="index">
                    <div class="left_key">{{item.key}}</div>
                </li>
            </ul>
        </view>
        <!-- 搜索联想的列表 end-->

        <!-- 搜索历史 start -->
        <view class="search-item" v-if="history_val && history_val.length" style="padding-bottom: 0;">
            <view class="search-title">
                <text>{{$L('最近搜索')}}</text>
                <!-- 非编辑状态模板 -->
                <template v-if="!hisEdit">
                    <view class="del" @click="hisEdit=true;searchDrewerOpen=true">
                        <image :src="imgUrl + 'common/icon/del_search.png'" />
                    </view>
                </template>   
                <!-- 编辑状态模板 -->
                <template v-else>
                    <view class="edit">
                        <view @click="clearHistoryFun" class="delete_all">全部删除</view>
                        <view class="clounm_line"></view>
                        <view @click="hisEdit=false;searchDrewerOpen=false" class="complete">完成</view>
                    </view>
                </template>   
            </view>

            <view class="search-con">
                <view class="item his_item" v-for="(item,index) in history_display_val" :key="index" @click="btnOperation(item)">
                    <text class="text_his">{{dealSearchStr(item)}}</text>
                    <text v-if="hisEdit" class="iconfont icon_close_fill"></text>
                </view>
                <view class="search_drawer" v-if="history_val && history_val.length > history_display_max && !hisEdit"
                @click="searchDrewerOpen=!searchDrewerOpen">
                <!-- <text>{{$L('更多历史搜索')}}</text> -->
                <view :class="{narrowUp:searchDrewerOpen}">
                    <text class="iconfont icon_arrow_down"></text>
                </view>
            </view>
            </view>
            
        </view>
        <!-- 搜索历史 end -->

        <!-- 热门搜索 start -->
        <view class="search-item" v-if="hotSearchData && hotSearchData.length && !ifFromOrderPage">
            <view class="search-title hotSearch">
                <text class="iconfont icon_hot">{{$L('热门搜索')}}</text>
            </view>

            <view class="search-con hotSearch-con">
                <block v-for="(item,index) in hotSearchData" :key="index" >
                    <view class="item" @click="btnSearch(item)" v-if="item">
                        <view class="quare num-font" :style="[dealStyle(index)]"></view>
                        <view class="content">{{item}}</view>
                    </view>
                </block>
            </view>
        </view>
        <!-- 热门搜索 end -->
        </view>

        <!-- 确认删除搜索历史的弹窗 -->
        <uni-popup ref="deletePopup" type="dialog">
            <uni-popup-dialog type="input" title ="提示" content="确认要清空搜索历史吗?" :duration="2000"  @confirm="confirmDelete()"></uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
import {isNotEmpty} from '@/utils/common.js'
import {
    mapMutations
} from 'vuex';
export default {
    components:{
        uniPopup,
        uniPopupDialog
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            input_val: '', //搜索内容
            history_val: [],
            history_display_val: [],
            hotSearchData: [],
            history_display_max: 9,//搜索历史默认显示数字
            searchDrewerOpen:false,//搜索历史更多开关
            searchList:[], //京东联想关键字 
            placeholder: '',
            defaultKeyWord: '',// 在什么都不输入时 默认的搜索关键字
            
            isCompare: false, // 是否从对比列表页面过来
            showStoreList: true, //是否显示店铺列表 用于跳转不同的商品列表页面
            ifFromOrderPage: false, // 是否来自订单页
            searchHistoryTypeList:[ // 搜索历史对应的页面来源
                {origin:'',keyName:'his_keyword'},
                {origin:'order',keyName:'order_his_keyword'}
            ],
            hisEdit: false, //搜索历史是否是编辑状态 默认是false
            currentHisKeyName:'his_keyword' // 当前搜索历史存储的keyName（默认为商品搜索历史的keyName）
        }
    },
    created() {
        if (isNotEmpty(this.$Route.query.keyword)){
            this.input_val = decodeURIComponent(this.$Route.query.keyword);
        }
    },
    mounted(){
        this.storeAndSupplierInfos = this.$Route.query.storeAndSupplierInfos || '';
        this.showStoreList = this.$Route.query.showStoreList;
        this.isCompare = this.$Route.query.compare;
        if (this.$Route.query.ifFromOrderPage){
            this.ifFromOrderPage = this.$Route.query.ifFromOrderPage;
            this.currentHisKeyName = 'order_his_keyword';
        }

        this.getHotSearchData();
        this.getHistoryList();
    },
    watch:{
        history_val: {
            handler: function() {                    
                if (this.history_val && this.history_val.length > this.history_display_max && !this.hisEdit){
                    this.history_display_val = this.history_val.slice(0, this.history_display_max)                    
                    this.searchDrewerOpen = false
                } else {
                    this.history_display_val = JSON.parse(JSON.stringify(this.history_val))
                }
            },
            deep: true
        },
        searchDrewerOpen: {
            handler: function() {
                if (this.searchDrewerOpen){
                    this.history_display_val = JSON.parse(JSON.stringify(this.history_val))
                } else {
                    this.history_display_val = this.history_val.slice(0, this.history_display_max)                    
                }
            }
        }
    },

    onShow() {
        this.searchList = []
    },
    methods: {
        ...mapMutations(['setOrderSearchKeyword']),
        dealStyle(index){
            return {backgroundImage: `url('${this.imgUrl}search/icon_common_paixu${index+1}.svg')`}
        },

        // 搜索历史按钮操作
        btnOperation(item){
            if (!this.hisEdit){ //非编辑状态，此时直接搜索商品
                this.btnSearch(item)
            } else { //编辑状态，此时需要删除该条搜索历史
                this.deletHisItem(item);
            }
        },
        //删除当前的搜索历史
        deletHisItem(item){
            let index = this.history_val.findIndex(temp => temp == item);
            this.history_val.splice(index, 1);
            //重新更新缓存
            this.updateHistoryData();
        },
        //获取热门搜索词
        getHotSearchData() {
            var param = {}
            param.url = 'v3/system/front/setting/getSettings'
            param.data = {}
            param.data.names = 'hot_search_words'
            this.$request(param).then(res => {
                if (res.state == 200) {
                    this.hotSearchData = res.data[0].split(',');
                    this.initPlaceHolder(this.hotSearchData[0]);
                    this.defaultKeyWord = this.hotSearchData[0] || '';
                }
            })
        },


        //搜索历史中间显示省略号处理
        dealSearchStr(str){
            if (typeof str == 'string'){
                if (str.length > 26){
                    return str.substring(0, 10) + '...' + str.substring((str.length-10), str.length)
                }
            }    
            return str;
        },

        // 初始化placeHolder
        initPlaceHolder(text = '请输入关键词'){
            this.placeholder = text;
        },

        //获取历史记录
        getHistoryList() {
            let history_data = this.$getStorageSync(this.currentHisKeyName);

            if (history_data) {
                //2022-6-10添加取前20条的最大数量限制
                let his_array = history_data.split("~").slice(0, 20);
                let last_arr = [];
                for (var i = 0; i < his_array.length; i++) {
                    !this.$checkSpace(his_array[i]) && last_arr.push(his_array[i]);
                }
                this.history_val = last_arr;
            }
        },
        // 现实清除的弹窗
        clearHistoryFun(){
            this.$refs.deletePopup.open();
        },
        //清除搜索历史
        confirmDelete() {
            this.$removeStorageSync(this.currentHisKeyName);
            this.history_val = [];
            this.$refs.deletePopup.close();
            
        },
        inputChange(e) {
            try {
                this.input_val = e.detail.value.replaceAll('￼','');
            } catch (error) {
                this.input_val = e.detail.value;
            }
            if (this.input_val != ''){
                this.searchDropdownListFun(this.input_val)
            } else {
                this.searchList = []
            }
            
        },
        //点击弹起的键盘按钮时触发
        search() {
            if (this.input_val != '') {
                this.btnSearch();
            }
        },
        //搜索事件
        btnSearch(val = '') {
            //解决部分输入法如手写需要二次确认导致最后一次输入取不到值的问题2023-3-7
            setTimeout(()=>{
                let {
                    input_val
                } = this;
            

                if (val) {
                    input_val = val;
                    this.input_val = val;
                }
                input_val = input_val.trim();
                if (!!!input_val){
                    input_val = this.defaultKeyWord;
                    this.input_val = input_val;
                }

                if (input_val.length > 0) {
                    this.setHistoryData();
                } else {
                    uni.showToast({
                        title: '请输入搜索关键词',
                        icon: 'none',
                        duration: 700
                    })
                    return
                }
                //跳转商品列表页
                let path = '/standard/product/list'
                let query = {
                    keyword: encodeURIComponent(input_val.replaceAll('￼','')),
                    source:'search',
                    storeAndSupplierInfos: this.storeAndSupplierInfos,
                    showStoreTabs: this.showStoreList
                }

                // 如果是从对比列表页面进入，则搜索进入 /product/listbak 页面
                // if (this.isCompare) {
                //     path = '/standard/product/compareSearchList';
                //     query = {keyword: encodeURIComponent(input_val)};
                // }

                // 如果是我的订单页跳转过来
                if (this.ifFromOrderPage) {
                    path = '/pages/order/list';
                    query.pageFrom = 'search'
                    this.setOrderSearchKeyword(input_val);
                }
                
                this.$Router.replace({path, query})
            },100)
        },

        //更新搜索历史缓存
        updateHistoryData(){
            let {
                history_val
            } = this;
            let history_val_str = history_val.join('~');
            this.$setStorageSync(this.currentHisKeyName, history_val_str)
        },

        //设置缓存
        setHistoryData() {
            let {
                history_val,
                input_val
            } = this;
            let tmp_data = [...history_val];
            tmp_data.unshift(input_val);
            // 最多取20条，不重复且不为空的数据2022-6-10，添加20条的最大数量限制
            tmp_data = tmp_data.reduce((a, b) => {
                /* eslint-disable */
                (b && a.indexOf(b) == -1) ? a.push(b): null;
                /* eslint-enable */
                return a;
            }, [])
            tmp_data = tmp_data.slice(0,20);
            let history_val_str = tmp_data.join('~');
            this.history_val = tmp_data;
            this.$setStorageSync(this.currentHisKeyName, history_val_str)
        },
        //清空输入内容
        clearInputVal() {
            this.input_val = '';
            this.searchList = []
        },
        navBack() {
            this.$Router.back(1)
        },
        // 搜索关键字补全
        searchDropdownListFun(keyword){
            const that = this;
            SnUtils.throttle(function() {
                that.searchDropdownListJd(keyword);   
            }, that, 300); 
        },
        /*****
         * 搜索关键字补全 京东
         */
        searchDropdownListJd(keyword){
            const that = this;
            let url = `https://wq.jd.com/bases/searchdropdown/getdropdown?terminal=m&zip=1&newjson=1&key=${keyword}&callback=jsonpCBKD`;
            that.jsonpAjax(url, function(res){
                try {
                    if (!!res){
                        try {
                            let list = res;
                            that.searchList = list.filter(item=>{ //过滤掉没有key字段的数据
                                return !!item.key;
                            })
                        } catch (error) {
                            that.searchList = [];
                            console.log('调用京东搜索数据解析报错', error);
                        }
                    }
                } catch (error) {
                    
                }
            })
        },
        /****
         * jsonp请求方式实现
         */
        jsonpAjax(url, jsonpCallback){
            let jsonpDom = document.getElementById('jsonpId');
            let head = document.getElementsByTagName('head')[0];
            if (!!jsonpDom){ head.removeChild(jsonpDom) }
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = 'jsonpId';
            script.src = `${url}`;
            head.appendChild(script);
            // 此处的jsonpCBKD关键字必须和url上面callback的参数保持一致
            window.jsonpCBKD = function(response){
                jsonpCallback(response);
            }
        }
    }
}
</script>

<style lang='scss'>
    .container{
        background-color: #fff; 
    }
    .status_bar {
        height: var(--status-bar-height);
        width: 100%;
    }
    .contentBox{
        overflow-y: auto;
        height: calc(100vh - 88rpx - var(--titleBarFillHeight));
    }
    page {
        background-color: #fff;
        width: 750rpx;
        margin: 0 auto;
        height: 100%;
    }

    .sea_input_part {
        position: relative;
        display: flex;
        align-items: center;
        height: 88rpx;

        .back_icon {
            padding-left: 20rpx;
        }

        .sea_input {
            flex: 1;
            height: 65rpx;
            font-size: 28rpx;
            color: #222222;
        }

        .search_center {
            display: flex;
            align-items: center;
            border: none;
            flex: 1;
            height: 68rpx;
            margin-left: 20rpx;
            padding-left: 20rpx;
            border-radius: 20rpx;
            background-color: #f2f5f8;
            .icon_search {
                font-size: 32rpx;
                margin-right: 8rpx;
                color: #999;
            }
        }

        .clear_content {
            width: 28rpx !important;
            height: 28rpx !important;
            margin-right: 20rpx !important;
        }

        .sea_btn {
            font-size: 28rpx;
            color: #2D2D2D;
            padding: 10rpx 32rpx 10rpx 16rpx;
            flex-shrink: 0;
        }

        &:after {
            position: absolute;
            content: '';
            left: 0;
            bottom: 0;
            width: 100%;
            height: 1rpx;
            background-color: #eee;
            transform: scaleY(0.5);
        }
    }

    .search-item {
        padding: 30rpx 30rpx;
        
        .search-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 48rpx;
            color: #2D2D2D;
            font-size: 28rpx;
            font-weight: bold;
            &.hotSearch{
                .iconfont{
                    font-size: 28rpx;
                }
                .iconfont::before{
                    color: #F30300;
                    font-size: 40rpx;
                    margin-right:8rpx;
                }
            }
            image {
                width: 48rpx;
                height: 48rpx;
            }
            .edit{
                display: flex;
                align-items: center;
                font-weight: normal;
                font-size: 24rpx;
                .delete_all{
                    cursor: pointer;
                }
                .clounm_line{
                    width: 1px;
                    height: 18rpx;
                    margin: 0 16rpx;
                    background: #c2c2c2;
                }
                .complete{
                    color: var(--tagColor);
                    cursor: pointer;
                }
            }
        }

        .search-con {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            .his_item{
                display: flex;
                align-items: center;
                position: relative;
                .text_his{
                    flex: 1;
                    max-width: 670rpx;
                    overflow: hidden;
                    word-break: break-all;
                    display: flex;
                    align-items: center;
                }
                .icon_close_fill{
                    position: absolute;
                    right: -8rpx;
                    top: -4rpx;
                    font-size: 22rpx;
                    color: #c2c2c2;
                    margin-left: 6rpx;
                    cursor: pointer;
                    width: 24rpx;
                }
            }
            .item {
                height: 56rpx;
                padding: 0 18rpx;
                color: #2D2D2D;
                font-size: 28rpx;
                background-color: #f2f5f8;
                border-radius: 25rpx;
                margin-right: 24rpx;
                margin-top: 24rpx;
                max-width: 688rpx;
                white-space: nowrap;
                word-break: break-all;
            }
            .search_drawer{
                width:56rpx;
                height: 56rpx;
                background-color: #f2f5f8;
                border-radius:50%;
                margin-top: 20rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                image {
                    width: 24rpx;
                    height: 24rpx;
                }
                .narrowUp{
                    transform: rotate(180deg);
                }
                .icon_arrow_down{
                    font-size: 24rpx;
                    color: #c2c2c2;
                }
        }
        }
        .search-con.hotSearch-con{
            display: block;
            margin-top: 20rpx;
            background:url('@/static/shared/search/bg_bnj_sousuo.png')  no-repeat;
            background-size:100% auto;
            border: 2rpx solid #ffdada;
            border-radius: 20rpx;
            overflow: hidden;
            .item{
                display: flex;
                align-items: center;
                font-size: 28rpx;
                background-color:transparent;
                margin-top: 0rpx;
                height:80rpx;
                padding: 0 40rpx;
                max-width: unset;
                .quare{
                    width:36rpx;
                    height: 36rpx;
                    background-size: 36rpx 36rpx;
                    border-radius: 4rpx;
                    margin-right: 8rpx;
                    font-size: 26rpx;
                    color: #ffffff;
                    text-align: center;
                    line-height: 32rpx;
                }
                .content{
                    flex: 1;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                    // padding-bottom: 2rpx;
                }
            }
        }
        .search-con.hotSearch-con>view:first-of-type{
            margin-top:16rpx;
        }
        .search-con.hotSearch-con>view:last-of-type{
            margin-bottom:16rpx;
        }
        // .search_drawer{
        //     display: flex;
        //     justify-content: center;
        //     font-size: 24rpx;
        //     color: #2D2D2D;
        //     margin-top: 20rpx;
        //     image {
        //         width: 27rpx;
        //         height: 15rpx;
        //         margin-left: 4rpx;
        //     }
        // }
    }

.searchList_wrap{
    position: absolute;
    top: 88rpx;
    bottom: 0;
    width: 750rpx;
    z-index: 10;
    padding-left:10rpx;
    // background: rgb(141, 114, 114);
    background-color: #fff;
    ul {
        max-height: 100%;
        padding-left: 20rpx;
        overflow-x: hidden;
        overflow-y: auto;
    }
    li {
        &:first-child{
            margin-top:20rpx;
        }
        font-size: 28rpx;
        margin-bottom:40rpx;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>
