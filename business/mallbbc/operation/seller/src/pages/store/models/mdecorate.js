import { sldCommonService, failTip } from '@/utils/utils';

export default {
    namespace: 'mdecorate',
    state: {
        loading: false,// 加载状态
        data: {
            list: [],
            pagination: {}
        },
        records:null, //编辑带过去的内容
        modalType:1, //1 新增 2编辑
        addItemModalVisible:false,
        compChangeDataFlag:false//保存装修时父组件通知子组件更新数据的开关
    },

    effects: {
        //slodon_手机装修_获取装修页列表
        * get_diy_page_lists({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/seller/mobileDeco/list');
            if (callback) {callback(response);}
        },
        //slodon_手机装修_添加移动端装修页面
        * add_m_diy_page({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/system/seller/mobileDeco/add');
            if (callback) {callback(response);}
        },
        //slodon_手机装修_编辑移动端装修页面
        * edit_m_diy_page({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/system/seller/mobileDeco/update');
            if (callback) {callback(response);}
        },
        //slodon_手机装修_删除移动端装修页面
        * del_m_diy_page({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/system/seller/mobileDeco/del');
            if (callback) {callback(response);}
        },
        //slodon_手机装修_启用/停用移动端装修页面
        * set_m_diy_page({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/system/seller/mobileDeco/isUse');
            if (callback) {callback(response);}
        },
        //slodon_手机装修_复制移动端装修页面
        * copy_m_diy_page({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/system/seller/mobileDeco/copy');
            if (callback) {callback(response);}
        },
        //slodon_手机装修_获取移动端装修页面详情
        * get_diy_page_detail({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/seller/mobileDeco/detail');
            if (callback) {callback(response);}
        },
        //slodon_手机装修_获取移动端装修页面菜单数据
        * get_m_diy_menu({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/seller/tplMobile/menu');
            if (callback) {callback(response);}
        },
        //slodon_编辑分类图片
        * edit_cate_img({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `v3/goods/admin/goodsCategory/edit`);
            if (callback) {callback(response);}
        },
        // 新增装修左侧item项
        * addTplMobile({ payload }, { call }) {
            const {callBack} = payload
            delete payload.callBack
            const response = yield call(sldCommonService, payload, 'post', `v3/system/admin/tplMobile/addTplMobile`,'json');
            if (response.state == 200) {
                callBack && callBack()
            } else {
                failTip(response.msg);
            }
        },
        // 编辑装修左侧item项
        * updateTplMobile({ payload }, { call }) {
            const {callBack} = payload
            delete payload.callBack
            const response = yield call(sldCommonService, payload, 'post', `v3/system/admin/tplMobile/updateTplMobile`,'json');
            if (response.state == 200) {
                callBack && callBack()
            } else {
                failTip(response.msg);
            }
        },
        
        // 删除装修左侧item项
        * deleteTplMobile({ payload }, { call }) {
            const {callBack} = payload
            delete payload.callBack
            const response = yield call(sldCommonService, {}, 'post', `v3/system/admin/tplMobile/deleteTplMobile?tplId=${payload.tplId}`);
            if (response.state == 200) {
                callBack && callBack()
            } else {
                failTip(response.msg);
            }
        }


    },
    reducers: {
        setParams(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        }
    }
};
