import Vue from 'vue'
import Vuex from 'vuex'
import { isArray, getStorageSync, isEmpty, setStorageSync, isChinaMainlandPhoneNumber } from '@/utils/common'
import cartHandler from '@/views/components/cart/handler';
import addressHandler from '@/views/components/address/handler';
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        hasLogin: false, // 是否登录
        memberInfo: {}, // 会员信息
        cartData: {}, // 购物车数据
        cartNum: 0, // 购物车商品总数(非件数)
        addressList: [], // 收货地址列表
        defaultAddress: {}, // 默认收货地址
        currentUserPosition: {}, // 当前定位地址
        selectAddress: {}, // 购物车选择的地址
        localTimestamp: 0, // 本地时间戳
    },
    mutations: {
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
        },
        // 更新购物车
        updateCartData(state, payload) {
            state.cartData = payload;
            // 购物车数量为可用数+不可用总数
            let availableCartNum = payload.availableCartNum || 0;
            let invalidLen = payload.invalidList?.length || 0;
            const num = availableCartNum + invalidLen;
            this.commit('updateCartNum', num);
        },

        // 更新购物车商品总数
        updateCartNum(state, payload) {
            state.cartNum = payload || 0;
        },

        // 更新购物车商品总数
        updateCartNumById(state, payload) {
            if (payload) {
                let goodsList = state.cartData.storeCartGroupList?.map(element => element.promotionCartGroupList?.map(item => item.cartList?.map(e => e.sku) || []) || []) || [];
                if (!goodsList.flat(Infinity).includes(payload)) {
                    state.cartNum += 1
                }
            }
        },

        // 更新收货地址
        updateAddressList(state, payload) {
            state.addressList = payload
            // 收获地址被清空时, 用户选择的地址也需要被清空
            if (!payload.length) {
                this.commit('updateSelectedAddress', {});
            } else if (!isEmpty(this.getters.getSelectedAddress)) {
                // 获取最新的选择地址信息
                const selectedAddress = payload.find(e => e.addressId == this.getters.getSelectedAddress.addressId) || {};
                this.commit('updateSelectedAddress', selectedAddress)
            }
        },
        // 更新默认地址
        updateDefaultAddress(state, payload) {
            if (!isArray(payload)) {
                return;
            }
            // storage里优先级最高 后面依次为: 有默认取默认 否则取列表第一个
            let addressID = getStorageSync('addressId') || '';
            state.defaultAddress = payload.filter(i => i.addressId == addressID)[0] || payload.filter((item) => item.isDefault == 1)[0] || payload[0] || {}
            // 如果默认地址为空, 且定位地址不为空, 取定位地址
            if (isEmpty(state.defaultAddress) && !isEmpty(state.currentUserPosition)) {
                state.defaultAddress = state.currentUserPosition;
            }
        },
        // 更新定位信息
        updatePositionInfo(state, payload) {
            state.currentUserPosition = payload
            // updateDefaultAddress 接收参数为数组
            this.commit('updateDefaultAddress', [payload])
        },
        // 更新选择的地址
        updateSelectedAddress(state, payload) {
            setStorageSync('selectedAddress', payload)
            state.selectAddress = payload;
        },
        // 更新登录状态
        updateLoginState(state, payload) {
            state.hasLogin = payload;
        },
        // 更新会员信息
        updateMemberInfo(state, payload) {
            if (payload) {
                state.memberInfo = payload;
                this.dispatch('getCartList');
                this.dispatch('getCartNum');    
            }
        }
    },
    getters: {
        getDefaultAddressId(state) {
            return state.defaultAddress.addressId || '';
        },
        getValidAddressList(state) {
            return state.addressList.filter(e => e.valid)
        },
        getSelectedAddress(state) {
            return isEmpty(state.selectAddress) ? getStorageSync('selectedAddress') : state.selectAddress;
        }
    },
    actions: {
        // 获取购物车总数量
        getCartNum(context) {
            try {
                // 判断是否登录
                const { hasLogin } = context.state;
                // 未登录暂时返回0 后续考虑是否增加未登录状态下的storage
                if (!hasLogin) {
                    return 0;
                }
                cartHandler.getCartNum().then(res => {
                    if (res.state == 200) {
                        let cartNum = res.data.totalCartNum || 0;
                        context.commit('updateCartNum', cartNum);
                    }
                })
            } catch (error) {
                console.log(error)
                context.commit('updateCartNum', 0);
            }
        },
        // 获取购物车列表
        getCartList({ state, commit }, params = {}) {
            try {
                const { defaultAddress: { addressId = '' } } = state;
                // 后续考虑是否增加未登录状态下的storage
                let data = {}
                if (!params.addressId) {
                    params.addressId = addressId;
                }
                const now = Date.now();
                state.localTimestamp = now;
                params.localTimestamp = now;
                return new Promise((resolve, reject) => {
                    cartHandler.getCartList(params).then(res => {
                        if (res.state === 200) {
                            data = res.data || {}
                            if (res.localTimestamp === state.localTimestamp) {
                                commit('updateCartData', data);
                                resolve(data)
                            }
                        } else {
                            reject(res.msg)
                        }
                    })
                })
            } catch (error) {
                commit('updateCartData', {});
            }
        },
        // 获取地址列表
        getAddressList(context) {
            return new Promise((resolve) => {
                try {
                    let list = []
                    addressHandler.getAddressList().then(res => {
                        if (res.state === 200) {
                            list = res.data?.list || []
                        }
                        context.commit('updateDefaultAddress', list);
                        context.commit('updateAddressList', list);
                        resolve(list)
                    })
                    
                } catch (error) {
                    context.commit('updateDefaultAddress', []);
                    context.commit('updateAddressList', []);
                    resolve([])
                }
            })
        }
    }
})

export default store
