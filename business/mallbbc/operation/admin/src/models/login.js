import { routerRedux } from 'dva/router';
import { setAuthority } from '@/utils/authority';
import { getPageQuery, failTip, sucTip, sldCommonService ,sldComLanguage,setStorage,getStorage,saveAuthBtnMap} from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
    namespace: 'login',

    state: {
        status: undefined
    },

    effects: {
        //登录
        * login({ payload, callback }, { call, put }) {
            //登录
            const response = yield call(sldCommonService, payload, 'post', 'v3/system/oauth/token');
            // Login successfully
            if (response.state === 200) {
                //获取系统配置的菜单
                if (response.data.resourceList.length > 0) {
                    let index = response.data.resourceList.findIndex(item => item.frontPath === '/decorate_pc')
                    if(index !== -1) {
                        let pc_data = response.data.resourceList.splice(index, 1)
                        response.data.resourceList.push(...pc_data)
                    }
                    //清理不需要菜单
                    for(let i=0;i<response.data.resourceList.length;i++){
                        if(
                            response.data.resourceList[i].frontPath == '/marketing_point' 
                        ){
                            response.data.resourceList.splice(i,1)
                            i--
                        }else{
                            let reslist = response.data.resourceList[i].children
                            for(let j=0;j<reslist.length;j++){
                                let child = reslist[j]
                                if(
                                    child.frontPath == '/marketing_promotion/spell_group' 
                                    || child.frontPath == '/marketing_promotion/ladder_group'
                                    || child.frontPath == '/marketing_promotion/presale'
                                ){
                                    reslist.splice(j,1)
                                    j--
                                }
                            } 
                        }                       
                    } 

                    setStorage('sld_menu_data', JSON.stringify(response.data.resourceList));
                    setStorage('menubtn_data', JSON.stringify(saveAuthBtnMap(response.data.resourceList)));
                    let sld_all_routes = [];//所有页面的路由
                    response.data.resourceList.forEach(item=>{
                        item.children.forEach(child=>{
                            sld_all_routes.push(child.frontPath)
                        })
                    })
                    if(sld_all_routes.includes('/sysset_home/basic')){
                        //如果有首页概况，将这个路由放到第一个排序，这样登录进来会优先进入这个页面
                        let basic = sld_all_routes.splice(sld_all_routes.indexOf('/sysset_home/basic'),1)
                        sld_all_routes.splice(0, 0, ...basic)
                    }
                    setStorage('sld_all_routes', JSON.stringify(sld_all_routes));
                    let tmp_data = response.data.resourceList;
                    let cur_top_nav = [];//顶部菜单
                    let cur_top_nav_info = [];//顶部菜单详细信息
                    for (let i = 0; i < tmp_data.length; i++) {
                        let split_first = tmp_data[i].frontPath.split('/');
                        let target = split_first[1].split('_')[0];
                        if (cur_top_nav.indexOf(target) == -1) {
                            let target_data = {};
                            target_data.top_nav = target;
                            target_data.path = tmp_data[i].children[0].frontPath;
                            if (target == 'sysset') {
                                target_data.name = '系统配置';
                                target_data.icon = 'xitong1';
                                //因为系统配置的权限管理 第1个菜单 固定是 权限配置，需要特殊处理下，指向 首页概况或者其他路由children[1]
                                if(sld_all_routes.includes('/sysset_home/basic')){
                                    target_data.path = '/sysset_home/basic'
                                }else if(target_data.path == '/sysset_authority/import_authority' && tmp_data[i].children.length > 1){
                                    target_data.path = tmp_data[i].children[1].frontPath;
                                }
                            } else if (target == 'manage') {
                                target_data.name = '商城管理';
                                target_data.icon = 'shangchengguanli2';
                            }else if (target == 'decorate') {
                                target_data.name = '装修';
                                target_data.icon = 'ziyuan114';
                            } else if (target == 'marketing') {
                                target_data.name = '应用中心';
                                target_data.icon = 'yunying';
                            } else if (target == 'member') {
                                target_data.name = '会员中心';
                                target_data.icon = 'huiyuanzhongxin';
                            } else if (target == 'statistics') {
                                target_data.name = '统计中心';
                                target_data.icon = 'tongjizhongxin';
                            } else if (target == 'mtc') {
                                target_data.name = '运维配置';
                                target_data.icon = 'xitongpeizhi';
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
                let all_routes = JSON.parse(getStorage('sld_all_routes'));
                if (redirect) {
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
            } else {
                if (callback) {callback(response);}
            }
        },
        //slodon_获取图形验证码
        * get_captcha({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/common/getCaptcha');
            if (callback) {callback(response);}
        },
        //slodon_获取admin登录图片
        * get_login_img({ payload, callback }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/getPcMainImage');
            if (callback) {callback(response);}
        },
        //更新配置
        * update_setting({ payload }, { call }) {
            const response = yield call(sldCommonService, payload, 'get', 'v3/system/admin/setting/settingInit');
            if (response.state == 200) {
                sucTip(response.msg);
            } else {
                failTip(response.msg);
            }
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
