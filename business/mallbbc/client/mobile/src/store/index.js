import Vue from 'vue'
import Vuex from 'vuex'
import {updateStatCommonProperty} from '../utils/stat.js'
import {setStorageSync, getStorageSync,getCartNumFun} from '@/utils/common'
import config from '@/common/lib/config';
import cartHandler from '@/components/cart/handler';
import addressHandler from '@/components/address/handler';

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        hasLogin: false,
        userInfo: {
            access_token:'',
            refresh_token:''
        },
        userCenterData:{},//个人中心页面数据
        cartData:{},//购物车数据
        cartNum: 0, //购物车数量
        addressList:[],//收货地址列表
        defaultAddress: '', // 默认收货地址
        addressDone: false, // 地址接口是否完成
        chatBaseInfo:getStorageSync('chatBaseInfo')?getStorageSync('chatBaseInfo'):{},//聊天的基本信息，包含会员id、头像、店铺id、头像
        mobileTabBarConfig:{},//渠道tabbar配置
        role: config.ROLE.GUEST,//用户角色角色，guest或user
        orderSearchKeyword:'', // 我的订单页搜索关键字
        orderTabIndex:0, // 我的订单页tab索引
        addressPromise: null
    },
    mutations: {
        login(state, provider) {
            if (state.role == config.ROLE.USER){
                state.hasLogin = true;
            }
            this.dispatch('getCartList');
            state.userInfo = provider;
            state.userInfo.role = state.role;
            updateStatCommonProperty({memberId:provider.memberId});//登录成功需要更新统计里面的会员id
            //缓存用户登陆状态
            provider.primaryKey && uni.setStorageSync(provider.primaryKey + '_userInfo',provider);
        },
        logout(state, role) {
            state.hasLogin = false;
            state.userInfo = {};
            state.userCenterData = {};
            state.cartData = {};
            state.addressList = [];
            state.chatBaseInfo = {};
            //清空所有用户缓存
            let keys = uni.getStorageInfoSync()?.keys;
            keys.forEach(key=>{
                if (['bbc_login_time', 'addressId', config.CLIENT_NAME + '_' + role+'_userInfo', 'userCenterData'].some(target=>key.endsWith(target))){
                    uni.removeStorageSync(key);
                }
            })
            updateStatCommonProperty({memberId:0});//退出登录需要将会员id置为0
        },

        //设置个人中心的数据
        setUserCenterData(state, provider){
            state.userCenterData = provider
            //缓存用户个人信息
            setStorageSync('userCenterData',provider)
        },

        //操作购物车的数据
        operateCartData(state, provider){
            state.cartData = provider
        },

        //操作购物车的数量
        operateCartNum(state, provider){
            state.cartNum = provider
        },

        // 操作收货地址
        operateAddressData(state, provider){
            state.addressList = provider

            if (state.addressDone === false) {
                state.addressDone = true
                // 触发地址初始化完成事件，页面刷新需要拿到地址信息时用到
                uni.$emit('addressRequestDone')
            }
        },
        setDefaultAddress(state, provider) {
            let list = provider || state.addressList;
            list = list.filter(item => item.valid); // 过滤掉失效的地址列表选项
            if (list.length > 0) {
                let index = list.findIndex(i => i.isDefault == 1);
                state.defaultAddress = index > -1 ? list[index] : list[0]; // 先取默认的地址 再取第一个
                if (getStorageSync('addressId')) {
                    let addressID = getStorageSync('addressId')
                    if (list.filter(i => i.addressId == addressID)[0]) {
                        let tmp = list.filter(i => i.addressId == addressID)[0]
                        state.defaultAddress = tmp
                    }
                }
            } else {
                state.defaultAddress = {}
            }
        },
        //保存聊天的会员id、会员头像，店铺id、店铺头像
        saveChatBaseInfo(state, provider){
            state.chatBaseInfo = provider
            //缓存聊天的基本信息
            setStorageSync('chatBaseInfo',provider)
        },
        //渠道tabbar配置
        operateMobileTabBarConfig(state, provider){
            state.mobileTabBarConfig = provider
        },
        //设置是否是访客
        setRole(state, provider){
            state.role = provider
        },
        // 设置订单页tab索引
        setOrderSearchKeyword(state,provider){
            state.orderSearchKeyword = provider
        },        
        // 设置订单页tab索引
        setOrderTabIndex(state,provider){
            state.orderTabIndex = provider
        },
       
        setAddressPromise(state,provider){
            state.addressPromise = provider
        },

        // 往购物车里添加商品
        addGoods(state, payload) {
            if (!state.cartData.storeCartGroupList) {
                state.cartData.storeCartGroupList = []
            }
            const { sku, storeId, storeName, num } = payload;
            // 是否是新店铺
            const isNewStore = !state.cartData.storeCartGroupList.map(e => e.storeId).includes(storeId);
            if (isNewStore) {
                state.cartData.storeCartGroupList.unshift({
                    promotionCartGroupList: [{cartList: [{...payload}]}],
                    storeId,
                    storeName
                })
            } else {
                state.cartData.storeCartGroupList.forEach(e => {
                    if (e.storeId == payload.storeId) {
                        let groupList = e.promotionCartGroupList || [];
                        let isAdded = false;
                        groupList.forEach(group => {
                            // 该商品是否已经在购物车里
                            const index = group.cartList.findIndex(goods => goods.sku == sku)
                            if (index > -1) {
                                isAdded = true;
                                group.cartList[index].buyNum += num;
                            }
                        })
                        // 不在购物车内, 则添加到该店铺下最后一个活动里
                        if (!isAdded) {
                            let groupListLen = groupList.length;
                            if (!groupListLen) {
                                groupList.push({ cartList: [] })
                                groupListLen = 1;
                            } 
                            if (!e.promotionCartGroupList[groupListLen - 1].cartList) {
                                e.promotionCartGroupList[groupListLen - 1].cartList = []
                            }
                            e.promotionCartGroupList[groupListLen - 1].cartList.unshift(payload);
                        }                    
                    }
                })
            }
        }
    },
    getters: {
        //guest角色不可用某些功能模块
        disabledModule(state, getters){
            let flag;
            // #ifdef H5
            flag = getters.isGuest;
            // #endif
            //#ifdef MP-WEIXIN
            flag = false;
            //#endif
            return flag
          
        },
        isGuest(state){
            return state.role != config.ROLE.USER;
        }
    },
    actions: {
        //获取购物车总数量的方法
        getCartNum(context){
            try {
                let isLogin = context.state.hasLogin; //判断是否登录
                if (isLogin) { //登陆的话 从接口拿数据
                    cartHandler.getCartNum().then(res => {
                        if (res.state == 200) {
                            let totleCartNum = res.data.totalCartNum || 0;
                            context.commit('operateCartNum', totleCartNum);
                        }
                    })
                } else { //没有登陆的话 从缓存拿数据
                    //从缓存获取购物车信息
                    let cartObj = uni.getStorageSync('cart_list') || {};
                    let totleCartNum = !!cartObj && getCartNumFun(cartObj)
                    context.commit('operateCartNum', totleCartNum);
                }
            } catch (error) {
                console.log(error)
                context.commit('operateCartNum', 0);
            }
        },
        // 获取地址列表的方法
        getAddressList(context) {
            let promise = new Promise((resolve, reject) => {
                try {
                    let isLogin = context.state.hasLogin; //判断是否登录
                    let list = []
                    if (isLogin) { //登陆的话 从接口拿数据
                        addressHandler.getAddressList().then(res => {
                            if (res.state === 200){
                                list = res.data.list
                            } 
                            context.commit('setDefaultAddress', list);
                            context.commit('operateAddressData', list);
                            resolve(list);
                        })
                    } else { //没有登陆的话 地址为空
                        context.commit('setDefaultAddress', []);
                        context.commit('operateAddressData', []);
                        resolve([])
                    }
                } catch (error) {
                    context.commit('setDefaultAddress', []);
                    context.commit('operateAddressData', []);
                    reject(error)
                }
            })
            context.commit('setAddressPromise', promise);
            return promise
        },
        // 获取购物车列表
        getCartList(context, params = {}) {
            try {
                // 判断是否登录
                const { hasLogin, defaultAddress: { addressId = '' } } = context.state;
                if (!hasLogin) {
                    return uni.getStorageSync('cart_list') || {};
                }
                let data = {}
                if (!params.addressId) {
                    params.addressId = addressId;
                }
                return new Promise((resolve, reject) => {
                    cartHandler.getCartList(params).then(res => {
                        if (res.state === 200) {
                            data = res.data || {}
                            context.commit('operateCartData', data);
                            resolve(data)
                        } else {
                            reject(res.msg)
                        }
                    })
                })
            } catch (error) {
                context.commit('operateCartData', {});
                return {}
            }
        }
    }
})

export default store
