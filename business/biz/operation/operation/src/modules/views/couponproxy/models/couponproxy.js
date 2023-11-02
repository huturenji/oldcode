import { sldCommonService } from '@/utils/utils';

let pathMapping = {
    // 'https://bplussit.sinosun.com:18380': 'https://bplussit.sinosun.com:18380',
    // 'https://bplusdev.sinosun.com:18180': 'https://bplussit.sinosun.com:18380',
    // 'https://bplus-uat.sinosun.com': 'https://bplus-uat.sinosun.com',
    // 'https://cloud.sinosun.com': 'https://cloud.sinosun.com',
    'https://cloud.sinosun.com:9443': 'https://cloud.sinosun.com'
}
export default {
    namespace: 'couponproxy',
    state: {
        loading: false,//加载状态
        data: {
            list: [],
            pagination: {}
        }
    },

    effects: {
        //获取卡密列表接口
        * getPwdList({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `${pathMapping[window.location.origin] || ''}/bizcloud/couponproxy/v1/getPwdList`, 'json', true, true);
            callback && callback(response);
        },
        //卡密导入
        *importpass({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', `${pathMapping[window.location.origin] || ''}/bizcloud/couponproxy/v1/importPwdFile`, 'json', true, true);
            callback && callback(response);
        }
    }
};
