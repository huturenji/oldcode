import { routerRedux } from 'dva/router';
import { getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery, failTip, sldCommonService,sldComLanguage,setStorage,getStorage,saveAuthBtnMap } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { apiUrl } from '@/utils/sldconfig';

export default {
    namespace: 'login',

    state: {
        status: undefined
    },

    effects: {
        * login({ payload, callback }, { call, put }) {
            //登录
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/oauth/token');
            // Login successfully
            if(response.state == 267){
                let cur_top_nav = ['apply'];//顶部菜单
                let cur_top_nav_info = [{
                    top_nav: 'apply',
                    name: `${sldComLanguage('商户入驻')}`,
                    left_icon: require('../assets/nav/store.png'),
                    path: '/apply/settled_protocol'
                }];//顶部菜单详细信息
                setStorage('cur_top_nav', JSON.stringify(cur_top_nav));
                setStorage('cur_top_nav_info', JSON.stringify(cur_top_nav_info));
                setStorage('menubtn_data', JSON.stringify(saveAuthBtnMap(response.data.resourceList)));
            }
            if (callback) {callback(response);}
            let cur_top_nav = [];//顶部菜单
            let cur_top_nav_info = [];//顶部菜单详细信息
            if (response.state === 200) {
      
                setStorage('storeId',response.data.storeId);
                setStorage('vendorId',response.data.vendorId);
                setStorage('isStoreAdmin',response.data.isStoreAdmin);
                setStorage('goodsSource',response.data.goodsSource); // 货品来源：1-接入；2-手工发布；3-接入&手工
                if (response.data.resourceList.length > 0) {
                    //清理不需要菜单
                    for(let i=0;i<response.data.resourceList.length;i++){
                        if(
                            response.data.resourceList[i].frontPath == '/point' 
                        ){
                            response.data.resourceList.splice(i,1)
                            i--
                        }else{
                            let reslist = response.data.resourceList[i].children
                            for(let j=0;j<reslist.length;j++){
                                let child = reslist[j]
                                if(
                                    child.frontPath == '/marketing/spell_group' 
                                || child.frontPath == '/marketing/ladder_group'
                                ){
                                    reslist.splice(j,1)
                                    j--
                                }
                            } 
                        }                        
                    }                     
                    setStorage('menu_data', JSON.stringify(response.data.resourceList));
                    setStorage('menubtn_data', JSON.stringify(saveAuthBtnMap(response.data.resourceList)));
                    let all_routes = [];//所有页面的路由
                    response.data.resourceList.forEach(item=>{
                        item.children.forEach(child=>{
                            all_routes.push(child.frontPath)
                        })
                    })
                    setStorage('all_routes', JSON.stringify(all_routes));
                    let tmp_data = response.data.resourceList;
                    for(let i = 0; i < tmp_data.length; i++) {
                        let split_first = tmp_data[i].frontPath.split('/');
                        let target = split_first[1];
                        if (cur_top_nav.indexOf(target) == -1) {
                            let target_data = {};
                            target_data.top_nav = target;
                            target_data.path = tmp_data[i].children[0].frontPath;
                            if (target == 'basic') {
                                target_data.name = '概况';
                                target_data.left_icon = require('../assets/nav/basic.png');
                            } else if (target == 'goods') {
                                target_data.name = '商品';
                                target_data.left_icon = require('../assets/nav/goods.png');
                            } else if (target == 'order') {
                                target_data.name = '订单';
                                target_data.left_icon = require('../assets/nav/order.png');
                            } else if (target == 'store') {
                                target_data.name = '店铺';
                                target_data.left_icon = require('../assets/nav/store.png');
                            } else if (target == 'bill') {
                                target_data.name = '结算';
                                target_data.left_icon = require('../assets/nav/bill.png');
                            } else if (target == 'point') {
                                target_data.name = '积分商城';
                                target_data.left_icon = require('../assets/nav/point.png');
                            } else if (target == 'im') {
                                target_data.name = '客服';
                                target_data.left_icon = require('../assets/nav/point.png');
                            } else if (target == 'spreader') {
                                target_data.name = '推手';
                                target_data.left_icon = require('../assets/nav/spreader.png');
                            } else if (target == 'statistics') {
                                target_data.name = '统计';
                                target_data.left_icon = require('../assets/nav/statistics.png');
                            } else if (target == 'marketing') {
                                target_data.name = '应用';
                                target_data.left_icon = require('../assets/nav/marketing.png');
                            }
                            cur_top_nav.push(target);
                            cur_top_nav_info.push(target_data);
                        }
                    }

                    setStorage('cur_top_nav', JSON.stringify(cur_top_nav));
                    setStorage('cur_top_nav_info', JSON.stringify(cur_top_nav_info));

                } else {
                    failTip(`${sldComLanguage('抱歉，该账号未授予权限，请先授予权限～')}`);
                    return false;
                }
                if (callback) {callback(response);}
                reloadAuthorized();
                const urlParams = new URL(window.location.href);
                const params = getPageQuery();
                let { redirect } = params;
                let all_routes = JSON.parse(getStorage('all_routes'));
                //如果只有客服得权限，则直接跳转到客服页面
                if(cur_top_nav_info.length == 1 && cur_top_nav_info[0].top_nav == 'im'){
                    window.location.href = `${apiUrl}im/`;
                    return false;
                }

                if (redirect) {
                    //如果上次路由是入驻的话，需要进入已有路由的第一个页面
                    if(redirect.indexOf('/apply')>-1){
                        window.location.href = JSON.parse(getStorage('all_routes'))[0];
                        return false;
                    }
                    const redirectUrlParams = new URL(redirect);
                    if (redirectUrlParams.origin === urlParams.origin) {
                        redirect = redirect.substr(urlParams.origin.length);
                        if (redirect.match(/^\/.*#/)) {
                            redirect = redirect.substr(redirect.indexOf('#') + 1);
                        }
                    } else {
                        window.location.href = redirect;
                        return;
                    }
                }else{
                    yield put(routerRedux.replace(all_routes[0]));
                    return;
                }
                //如果redirect在用户拥有的路由内，则跳转，否则跳转第一个页面
                let contain_redirect_flag = false;
                for(let i= 0;i<all_routes.length;i++){
                    if(redirect.indexOf(all_routes[i])>-1){
                        contain_redirect_flag = true;
                        break;
                    }
                }
                if(!contain_redirect_flag){
                    redirect = all_routes[0]
                }
                yield put(routerRedux.replace(redirect));
            }
        },
        * get_login_img({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/seller/setting/getStoreSetting');
            if (callback) {callback(response);}
        },
        * register({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/vendor/register');
            if(response.state == 267){
                let cur_top_nav = ['apply'];//顶部菜单
                let cur_top_nav_info = [{
                    top_nav: 'apply',
                    name: `${sldComLanguage('商户入驻')}`,
                    left_icon: require('../assets/nav/store.png'),
                    path: '/apply/settled_protocol'
                }];//顶部菜单详细信息
                setStorage('cur_top_nav', JSON.stringify(cur_top_nav));
                setStorage('cur_top_nav_info', JSON.stringify(cur_top_nav_info));
                setStorage('menubtn_data', JSON.stringify(saveAuthBtnMap(response.data.resourceList)));
            }
            if (callback) {callback(response);}
        },
        * lookForPwd({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'post', 'v3/seller/seller/vendor/retrievePwd');
            if (callback) {callback(response);}
        },
        * getCaptcha({ payload }, { call }) {
            yield call(getFakeCaptcha, payload);
        }
    },

    reducers: {
        changeLoginStatus(state, { payload }) {
            setAuthority(payload.currentAuthority);
            return {
                ...state,
                status: payload.status,
                type: payload.type
            };
        }
    }
};
