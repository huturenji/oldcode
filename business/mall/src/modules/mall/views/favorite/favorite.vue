<template>
    <div class="favorite">
        
        <!-- 顶部的编辑部份 -->
        <topTitle :show="favoritesList.length > 0" @changeEdit="changeEdit"></topTitle>
        
        <!-- 商品的列表渲染 -->
        <div class="favorite-box">
            <mescrollVue :class="{mescrolltop: favoritesList.length > 0, mescrollbottom: editFlag}" ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
                <div class="list-box" id='favoriteList'>
                    <div @click="gotoDetail(item)" class="good-item" v-for="(item, index) in favoritesList" :key="index">
                        <swipeout>
                            <swipeout-item>
                                <div class="favorite-item" slot="content">
                                    <div class="item-box">
                                        <div @click.stop="item.checked = !item.checked" v-if="editFlag" class="choose-item">
                                            <Icon :type="item.checked?'icon_mall_checkbox_sel':'icon_mall_checkbox_nor'" size=".4"/>
                                        </div>
                                        <div class="list-one">
                                            <!-- state=0 代表已下架 state=1 代表已上架 -->
                                            <thumb06  
                                                :img='item.picture' 
                                                :title='item.name'
                                                :price='item.price'
                                                :status='{noSale:(item.state == 0 || !!item.notInPool)}'
                                            >
                                                <button v-if="item.state == 1" slot='action' class="addCart-icon-section" @click.stop='addCart($event, item, index)'>
                                                    <span class="cart-icon"></span>
                                                </button>
                                            </thumb06>
                                        </div>
                                    </div>
                                </div>
                                <div slot="right-menu">
                                    <swipeout-button @click.native.stop="removeCollection(item, index)" class="removeFavorite">
                                        <p><Icon type='icon_mall_collect3' size=".44"/></p>
                                        <span>取消收藏</span>
                                    </swipeout-button>
                                </div>
                            </swipeout-item>
                        </swipeout>
                    </div>
                </div>
            </mescrollVue>
        </div>
        <!-- 定位底部的购物车按钮 -->
        <div v-transfer-dom class="cartThumb_box">
            <cartThumb ref='cartThumb' @clickCartThumb="clickCartThumb"></cartThumb>
        </div>

        <!-- 定位底部的全选批量取消收藏的部分 -->
        <div v-transfer-dom>
            <div v-if="showCancleCollection" class="choose-all-deleteCollection fixed-dom-part">
                <div @click="chooseAllFun" class="choose-all">
                    <Icon :type="chooseAll?'icon_mall_checkbox_sel':'icon_mall_checkbox_nor'" size=".44"/>
                    <span class="text">全选</span>
                </div>
                <div @click="deleteCollectionFun" class="cancle-btn linear-gra-mall-addFavorite normal-btn">
                   取消收藏
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Swipeout, SwipeoutItem, SwipeoutButton, Popup} from 'vux';
import { SnModal } from 'sinosun-ui';
const Icon = ()=>import('commonComp/base/Icon.vue');
const cartThumb = ()=>import('commonComp/cartThumb/cartThumb.vue');
const thumb06 = ()=>import('commonComp/goodsThumb/thumb06.vue');
const topTitle = ()=>import('./components/topTitleComp.vue');
import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
import extendUtils from 'common/lib/utils';
import mescrollMixin from 'common/lib/mixin/mescrollMixin';
import AddCartAnimation from 'common/lib/animation/addCart.js';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
export default {
    mixins: [mescrollMixin, tChatEventMixin],
    components:{
        thumb06,
        topTitle,
        cartThumb,
        Swipeout,
        SwipeoutItem,
        SwipeoutButton,
        Icon,
        Popup
    },
    data(){
         return Object.assign(extendUtils.stateManager.setData([
        ], this), {
            favoritesList: [], //我的收藏商品列表
            editFlag: false, //是否显示批量取消收藏 默认为false 
            chooseAll: false, //全选默认为false
            mescrollUp: {
              htmlNodata:'', //暂时不显示没有更多了的提示
              empty: {
                warpId: 'favoriteList'
              }
            }
        })
    },
    computed: {
        showCancleCollection(){
            return this.favoritesList.length > 0 && !!this.editFlag;
        }
    },
    created(){
       
    },
    mounted(){
        
    },
    watch:{
        /**
         * 监听收藏商品列表变化，监听全选的功能
         */
        favoritesList: {
            handler(val){
                if(val && val.length > 0){
                    let num = 0;
                    val.forEach( item=> {
                        !!item.checked && num++
                    });
                    this.chooseAll = num == val.length;
                }
            },
            deep: true
        }
    },
    methods: {
        
        /**
         * 初始化分页数据
         */
        initList(){
            this.favoritesList = [];
            //重置列表为第一页 (常用于列表筛选条件变化或切换菜单时重新刷新列表数据)
            //内部实现: 把page.num=1,再主动触发up.callback
            this.mescroll.resetUpScroll();
        },

        /**
         * 加入购物车，同时添加加入购物车的动画效果
         */
        addCart($event, item, index){        
            let goods = [{
            	"sku":item.sku,
            	"supplierId": item.supplierId,
            	"quantity":1,
            	"name": item.name,
            	"specification": JSON.stringify(item.specification) || '',
            	"imageUrl": item.picture,
            	"jdCardCategoryId3": item.categoryId3,
            }]
            //加入购物车的方法在全局混入里面globalMixin.js
            this.setIntoShopCar(goods).then(flag => {
                if(!!flag){ //加入购物车接口返回成功后，再执行动画
                     setTimeout(async ()=>{
                        let cartDom = this.$refs.cartThumb.$el;
                        let animation = new AddCartAnimation(cartDom)
                        //抛物线动画效果
                        await animation.start($event, {offset: {x: 'left',y:'top'}});
                        //+1动画
                        await animation.addNumShow(cartDom);
                    }, 0)
                }
            }).catch(e => {
                console.error('加入购物车失败====',e);
            });
        },

        /**
         * 页面刷新入口函数 mescroll刷新回调
         * @param mescroll对象
         */
        re_fresh(mescroll){
            this.initList();
        },

        /***
         * 获取收藏商品列表
         * @param page 分页对象，由mescroll提供
         * @param mescroll mescroll对象
         */
        async getListData(page, mescroll) {
            const that = this;
            try{
                let data = await this.getFavoriteList(page);
             
                if(!!data && data.content.length > 0){
                    let list = await this.getProductSpec(data.content); //再次等待查询商品相关的属性
                    let listAll = that.addCheckedKey(list);
                    this.favoritesList.push(...listAll);
                }
                mescroll.endByPage(data.content.length, data.totalPages);
            }catch(e){
                console.error(e);
                mescroll.endErr();
            }
        },

        /**
         * 获取收藏的商品列表 
         */
        getFavoriteList(page){
            let that = this;
            let param = {
                userId: goodsHandler.userId,
                companyId: goodsHandler.companyId,
                channelId: goodsHandler.channelId,
                supplierId: goodsHandler.supplierId,
                pageIndex: page.num,
                pageSize: page.size
            };
            return new Promise((resolve, reject) => {
                goodsHandler.getFavoriteList(param).then(res=>{
                    if(res.resultCode == 0){
                        resolve(res.result);
                    }else{
                        resolve();
                    }
                }).catch(e=>{ 
                    console.log(e);
                    resolve();
                })
            })
        },

        /**
         * 根据商品编号去查询商品的销售属性
         */
        getProductSpec(list){
            const that = this;
            return new Promise((resolve, reject) => {
                if(!list || 0 == list.length){
                    resolve([]);
                }   
                
                let ids = list.map(function(value){
                　　return value.sku
                })
                let param = {
                    sku: ids,
                    supplierId:goodsHandler.supplierId
                }
                goodsHandler.getProductSpec(param).then(res=>{
                    if(res.resultCode == 0 && res.result){
                        let tempList = res.result.spec;
                        let newList = list.map(value => {
                            let index = tempList.findIndex(temp => {
                                return temp.sku == value.sku;
                            })
                            if(index > -1){
                                value = Object.assign({}, value, {specification:tempList[index]});
                            }     
                            return value;             　　
                        })
                        resolve(newList);
                    }else{
                        resolve([]);
                    }
                }).catch(e=>{
                    console.log(e);
                    resolve([]);
                })
            })
        },

        /**
         * 整合数据新增checked字段，为了批量选择的交互实现,默认都为false
         */
        addCheckedKey(list){
            list.forEach(item=>{
                item.checked = false;
            })
            return list;
        },

        /**
         * 移除收藏的商品确认框
         * @param item 要移除的单个商品详情item
         */
        removeCollection(item){
            let that = this;
            SnModal({
                message: '确定要取消收藏吗？',
                showCancelButton: true,
            }).then(res => {
                let skus = [{
                    sku: item.sku,
                    supplierId: item.supplierId,
                }];
                that.removeGoodsFromCollections(skus);
            }).catch(rej => {
                console.log('rej === ', rej);
            });
        },

        /**
         * 移除收藏的商品方法
         * @param skus 要移除的商品集合 Array
         */
        removeGoodsFromCollections(skus){
            this.$loading.show();
            let param = {
                "userId":goodsHandler.userId, 
                "companyId":goodsHandler.companyId, 
                "channelId":goodsHandler.channelId, 
                skus: skus
            }
            goodsHandler.deleteFavorites(param).then(res=>{
                this.$loading.hide();
                if(res.resultCode == 0){
                    this.initList(); //移除成功后重新拉取数据
                }
            }).catch(e=>{
                console.log(e);
                this.$loading.hide();
            })
        },

         /**
         * 跳转到购物车页面
         */
        clickCartThumb(){
            this.$router.push({
                path: "/cart"
            })
        },

        /**
         * 点击编辑和完成的回调
         */
        changeEdit(flag){
            this.editFlag = flag;
        },

        /**
         * 全选功能
         */
        chooseAllFun(){
            this.chooseAll = !this.chooseAll;
            if(this.favoritesList.length > 0){
                this.favoritesList.forEach( item => {
                    this.$set(item, 'checked', this.chooseAll);
                })
            }
        },

         /**
         * 批量取消商品收藏
         */
        deleteCollectionFun(){
            let that = this;
            let selectedGoods = this.getSelectedGoods();
            if(selectedGoods.length <= 0){
                extendUtils.showToast('请选择要取消收藏的商品');
            }else{
                SnModal({
                    message: '确定要取消收藏吗？',
                    showCancelButton: true,
                }).then(res => {
                    let skus = [];
                    //整合需要移除收藏的ids
                    selectedGoods.forEach(item => {
                        skus.push({
                            sku: item.sku,
                            supplierId: item.supplierId,
                        })
                    })
                    that.removeGoodsFromCollections(skus);
                }).catch(rej => {
                    console.log('rej === ', rej);
                });
            }
        },

        /**
         * 获取选中的需要取消收藏的产品
         */
        getSelectedGoods(){
            return this.favoritesList.filter(item => {
                return !!item.checked; 
            })
        },
        
        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            this.$router.back();
        },

        /**
         * 跳转订单详情页面
         */
        gotoDetail(item){
            console.log('item', item)
            this.$router.push({
                path:'/product/detail',
                query:{
                    sku: item.sku,
                    supplierId: item.supplierId
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~themes/default/styles/favorite/favorite.less';
</style>
<style lang='less'>
    @import '~themes/default/styles/components/mescroll.less';
</style>