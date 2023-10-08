import React from 'react';
import Redirect from 'umi/redirect';
// import { apiUrl } from '@/utils/sldconfig';
import { getStorage } from '@/utils/utils';

export default ({ children }) => {
    // console.log(children)
    let cur_time = new Date().getTime();
    let start_time = getStorage('time');
    if (typeof start_time == 'undefined' || start_time == null) {
        return <Redirect to="/user/login" />;
    } 
    if (cur_time - start_time > ((24 * 60 * 15 - 2) * 60 * 1000)) {
        //用户登陆过期之后直接跳转登录页面(14天23小时58分钟，refresh_token的有效期是15天)
        return <Redirect to="/user/login" />;
    }
  
    if(children.props.location.pathname.indexOf('apply')==-1){
        if(getStorage('cur_top_nav')!=undefined&&JSON.parse(getStorage('cur_top_nav')).indexOf('apply')>-1){
            return <Redirect to="/apply/open_up" />;
        }
    }
    //如果redirect在用户拥有的路由内，则跳转，否则跳转第一个页面
    if(getStorage('all_routes')!=undefined){
        let all_routes = JSON.parse(getStorage('all_routes'));
        let contain_redirect_flag = false;
        for(let i= 0;i<all_routes.length;i++){
            //pathname.indexOf这个有个坑。这里路由权限有个约定规则：比如某个菜单路由是good_list,那么新增路由页面必须是good_list_add，必须包含good_list。
            if(children.props.location.pathname.indexOf(all_routes[i])>-1){
                contain_redirect_flag = true;
                break;
            }
        }
        if(children.props.location.pathname.indexOf('im')==-1){
            if(!contain_redirect_flag){
                return <Redirect to={all_routes[0]} />;
            }
        }
    }
    return children;
};
