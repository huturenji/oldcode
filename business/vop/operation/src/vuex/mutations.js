import * as types from './mutation-types'
const mutations = {
    [types.SET_ORDERNO](state, orderNo) {
        state.orderNo = orderNo
    },
    [types.SET_SUBORDERNO](state, subOrderNo) {
        state.subOrderNo = subOrderNo
    },
    [types.SET_ORDERHOMEREFRESH](state, orderHomeRefresh) {
        state.orderHomeRefresh = orderHomeRefresh
    },
    [types.SET_ORDERTYPE](state, orderType) {
        state.orderType = orderType
    },
    [types.SET_SERVICEID](state, serviceId) {
        state.serviceId = serviceId
    },
    [types.SET_HOMEREFRESH](state, homeRefresh) {
        state.homeRefresh = homeRefresh
    },
    [types.SET_LOADING](state, loading) {
        state.loading = loading
    },
    [types.SET_SERVICESTATUS](state, serviceStatus) {
        state.serviceStatus = serviceStatus
    }
}
export default mutations