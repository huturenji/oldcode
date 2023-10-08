/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
import moment from 'moment';
import React, { Fragment } from 'react';
import nzh from 'nzh/cn';
import router from 'umi/router';
import Link from 'umi/link';
import ALibbSvg from '@/components/ALibbSvg';
import { parse, stringify } from 'qs';
import { message, Popconfirm, Input, notification, Icon, Tooltip, Popover,Button } from 'antd';
import { formatMessage } from 'umi/locale';
import printJS from 'print-js';
import styles from '../global.less';
import { apiUrl, uploadLimit } from './sldconfig';
// eslint-disable-next-line import/no-cycle
import request from './request';

const Search = Input.Search;

export const menu_second_color = ['#69A2F2', '#f5ba43'];//一级菜单页面图标的颜色
export const menu_second_default_icon = 'tiaoboleixing';//一级菜单页面默认的图标
export const menu_second_icon_marginT = 12;//一级菜单页面图标距离左边的距离

//统一配置
export const commonSetting = {
    'operateTipSwitch': true,//页面操作提示开关
    'specLimit': 3,//发布商品——每个商品最多添加3个规格项
    'specValLimit': 10//发布商品——每个规格项最多添加10个规格值
};

export function sldSvgIcon(svgColor, svgW, svgH, svg) {
    return <ALibbSvg fill={svgColor} width={svgW} height={svgH} type={svg} />;
}


/*
判断是否是IE 11及以下或者其他(其他里包括IE edge)
 */
export function isIE() {
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        return true;
    } 
    return false;
    
}

// const cachePrex = 'bbc_seller_'; //缓存前端需要拼接的key 为了和别的平台区分
const cachePrex = window.location.pathname.split('/')[1] ? `${window.location.pathname.split('/')[1]}_seller_` : 'bbc_seller_';

/**
 * 设置storage
 * @param {Object} key
 * @param {Object} value
 */
export function setStorage(key, value) {
    key = `${cachePrex}${key}`;
    var storage = window.localStorage;
    storage.setItem(key, value)
}

/**
 * 获取storage
 * @param {Object} key
 */
export function getStorage(key) {
    if (window.localStorage) {
        key = `${cachePrex}${key}`;
        var storage = window.localStorage;
        return storage.getItem(key);
    } 
}

/**
 * 删除storage
 * @param {Object} key
 */
export function removeStorage(key) {
    try{
        if (window.localStorage) {
            key = `${cachePrex}${key}`;
            var storage = window.localStorage;
            return storage.removeItem(key);
        } 
    }catch(e){console.info(`removeLocalStorage error: ${ e}`)}
}


/**
 * 设置session
 * @param {Object} key
 * @param {Object} value
 */
export function setSession(key, value) {
    key = `${cachePrex}${key}`;
    var storage = window.sessionStorage;
    storage.setItem(key, value)
}


/**
 * 获取session
 * @param {Object} key
 */
export function getSession(key) {
    if (window.sessionStorage) {
        key = `${cachePrex}${key}`;
        var storage = window.sessionStorage;
        return storage.getItem(key);
    } 
}

/**
 * 删除session
 * @param {Object} key
 */
export function removeSession(key) {
    try{
        if (window.sessionStorage) {
            key = `${cachePrex}${key}`;
            var storage = window.sessionStorage;
            return storage.removeItem(key);
        }
    }catch(e){console.info(`removeSession error: ${ e}`)}
}

/*
* 商户入驻信息存缓存
* key String 缓存的键:
* agree_protocol:是否同意入驻协议，true 同意，false不同意
* cur_step:入驻操作到第几步了
* store_info:店铺信息
* run_info:经营信息
* val String或者Array 缓存的值
* */
export function saveSettleData(key, val) {
    if (Object.prototype.toString.call(val) === '[object Array]' || Object.prototype.toString.call(val) === '[object Object]') {
    //数组或对象
        setStorage(key, JSON.stringify(val));
    } else {
        setStorage(key, val);
    }
}

/*
* 商户入驻信息取缓存
* */
export function getSettleData(key) {
    let tmp_data = getStorage(key);
    if (tmp_data == undefined) {
        return '';
    }
    try {
        return JSON.parse(tmp_data);
    } catch (e) {
        return tmp_data;
    }
}

export function getValue(data) {
    return data && data.length>0 ? data[0] :data
}


/*
 * 表格分页数据统一
 * @param {object} pagination 分页数据对象
 * @param {object} filtersArg  表格列的过滤数据
 * @param {object} sorter 表格列的筛选数据
 * @param {object} formValues 搜索数据
 * @param {object} ifCompatibleNewSortParams 是否兼容新的排序传参
 * */
export function sldHandlePaginationData(pagination, filtersArg, sorter, formValues = {}, ifCompatibleNewSortParams=false) {
    console.log(`filtersArg=${JSON.stringify(filtersArg)}`)
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = { ...obj };
        filtersArg[key] && filtersArg[key].length>0 && (newObj[key] = getValue(filtersArg[key]));
        return newObj;
    }, {});

    const params = {
        current: pagination.current,
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
        sorts: [],
        ...formValues,
        ...filters
    };

    if (sorter.field) {
        params.sorter = `${sorter.field}_${sorter.order}`;
        if(ifCompatibleNewSortParams){    
            // 兼容写法：兼容接口新定义的排序取值
            let fieldIndex = null;
            let field = sorter.field; // 排序字段
            let sortDirection = sorter.order == 'descend' ? 'DESC' : 'ASC'; // 排序模式

            const result = params.sorts.some((item,index)=>{
                if(item.field === field){
                    fieldIndex = index;
                }
            })

            if(result){
                params.sorts[fieldIndex].direction = sortDirection
            } else {
                params.sorts.push({
                    field:field,
                    direction:sortDirection
                })
            }
        }
    }
    return params;
}


/*
* 表格拖动更新每列的宽度
* @param {int} index 第几列
* @param {int} size 宽度值
* @param {array} columns_data table的columns数据
* */
export function dragSldTableColumn(index, size, columns_data) {
    let nextColumns = [...columns_data];
    nextColumns[index] = {
        ...nextColumns[index],
        width: size.width
    };
    return nextColumns;
}

//判断数据是否是空对象
export function isEmptyObject(data) {
    if (Object.getOwnPropertyNames(data).length === 0) {
        return true;//空对象
    } 
    return false;//非空对象
  
}

export function fixedZero(val) {
    return val * 1 < 10 ? `0${val}` : val;
}

//将数字转为字符串
export function numExcString(text) {
    return text.toString();
}

//如果为null的话返回空字符串
export function isNullExcString(text) {
    return text == null ? '' : text;
}

//设置用户登录有效期缓存时间
export function setLocalStorageTime() {
    setStorage('time', new Date().getTime());
}


/*
* 获取缓存的值——String类型
* 返回值字符串  有值返回具体的值，否则返回空字符串
* @zjf-2020-11-26
* */
export function getLocalStorageStingVal(key) {
    let val = getStorage(key);
    return val != undefined && val != null && val ? val : '';
}


//高度填充
export function getSldEmptyH(sldHeight, bg = '#fff') {
    return <div style={{ width: '100%', height: sldHeight, background: bg }} />;
}

//宽度填充
export function getSldEmptyW(sldWidth) {
    return <div style={{ height: '100%', width: sldWidth }} />;
}


//退出登陆
export async function loginOut() {
    //跳转登录页
    let des_url = window.location.href;
    if (des_url.indexOf('redirect=') != -1) {
        des_url = des_url.substring(0, des_url.indexOf('redirect=') - 1);
    }
    // eslint-disable-next-line no-use-before-define
    await requestLogout();//调用退出登录的接口
    //清除全部缓存
    // eslint-disable-next-line no-use-before-define
    clearLocalStorageToken();
    sessionStorage.clear();
    router.replace(`/user/login`);
    // router.replace(`/user/login?redirect=${ encodeURIComponent(des_url)}`);
    window.location.reload();
}

// 清楚缓存的token refresh_token 和 time
export function clearLocalStorageToken(){
    removeStorage('token');
    removeStorage('refresh_token');
    removeStorage('time');
}

//调用退出登录的接口
async function requestLogout() {
    let refresh_token = getStorage('refresh_token');
    let param = new FormData();
    param.append('grant_type', 'refresh_token');
    param.append('refresh_token', refresh_token);
    await fetch(`${apiUrl }v3/seller/oauth/logout`, {
        credentials: 'include',
        headers: {
            Authorization: 'Basic c2VsbGVyOnNlbGxlcg=='
        },
        method: 'POST',
        body: param
    }).then(response => response.json());
}

//验证手机号
export function sldCheckMobile(s) {
    // eslint-disable-next-line no-use-before-define
    if (mobile_reg.test(s)) {
        return true;
    } 
    return false;
  
}

//验证邮箱
export function sldCheckEmail(s) {
    let regu = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    let re = new RegExp(regu);
    if (re.test(s)) {
        return true;
    } 
    return false;
  
}

//验证固定电话
export function sldCheckTel(s) {
    let regu = /^0\d{2,3}-\d{7,8}(-\d{1,6})?$/;
    let reg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
    let reg2 = /^\d{3}-\d{3}-\d{4,6}$/;
    let re = new RegExp(regu);
    if (re.test(s)||reg.test(s)||reg2.test(s)) {
        return true;
    } 
    return false;
  
}

/**
 * 验证输入的只能是数字
 */
export function validatorNumber(rule, value, callback) {
    let reg_num = new RegExp('^[0-9]*$');
    if (value && !reg_num.test(value)) {
        // eslint-disable-next-line no-use-before-define
        callback(`${sldComLanguage('只能是数字')}`);
    }
    callback();
}

/**
 检查输入的字符是否具有特殊字符
 输入:str  字符串
 返回:true 或 flase; true表示包含特殊字符
 主要用于注册信息的时候验证
 */
// export function sldCheckQuote(str) {
//     let items = new Array("~", "`", "!", "@", "#", "$", "%", "^", "&", "", "{", "}", "[", "]", "(", ")");
//     items.push(":", ";", "'", "|", "\", "<", ">", "?", "/", "<<", ">>", "||", "//");
//     items.push("admin", "administrators", "administrator", "管理员", "系统管理员");
//     items.push("select", "delete", "update", "insert", "create", "drop", "alter", "trancate");
//     str = str.toLowerCase();
//     for (var i = 0; i < items.length; i++) {
//         if (str.indexOf(items[i]) >= 0) {
//             return true;
//         }
//     }
//     return false;
// }


export const token = getStorage('token');
export const goods_spec_list_page_size = 2;//商品管理—规格管理
export const check_brand_list_page_size = 10;//待审核品牌
export const goods_list_del_page_size = 10;//已删除商品列表
export const list_com_page_size_10 = 10;
export const list_com_page_size_5 = 5;
export const list_com_page_size_7 = 7;
export const list_com_page_size_15 = 15;
export const list_com_page_size_16 = 16;
export const list_com_page_size_20 = 20;
export const list_com_page_more = 10000;
export const input_limit_length = 99999999;
export const mobile_reg = /(1[3-9]\d{9}$)/;//手机号的正则表达式


export const enumPickType = {
    pickUp:4, // 上门取件	
	  mail:40, // 自行邮寄
	  send:7 // 客户送货,这个不常用
}


export const formItemLayoutModal = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 14
    }
};

export const formItemLayoutModalTwo = {
    labelCol: {
        span: 3
    },
    wrapperCol: {
        span: 21
    }
};

export function getTimeDistance(type) {
    const now = new Date();
    const oneDay = 1000 * 60 * 60 * 24;

    if (type === 'today') {
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        return [moment(now), moment(now.getTime() + (oneDay - 1000))];
    }

    if (type === 'week') {
        let day = now.getDay();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);

        if (day === 0) {
            day = 6;
        } else {
            day -= 1;
        }

        const beginTime = now.getTime() - day * oneDay;

        return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
    }

    if (type === 'month') {
        const year = now.getFullYear();
        const month = now.getMonth();
        const nextDate = moment(now).add(1, 'months');
        const nextYear = nextDate.year();
        const nextMonth = nextDate.month();

        return [
            moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
            moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)
        ];
    }

    const year = now.getFullYear();
    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
    const arr = [];
    nodeList.forEach(node => {
        const item = node;
        item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
        item.exact = true;
        if (item.children && !item.component) {
            arr.push(...getPlainNode(item.children, item.path));
        } else {
            if (item.children && item.component) {
                item.exact = false;
            }
            arr.push(item);
        }
    });
    return arr;
}

export function digitUppercase(n) {
    return nzh.toMoney(n);
}

function getRelation(str1, str2) {
    if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
    }
    const arr1 = str1.split('/');
    const arr2 = str2.split('/');
    if (arr2.every((item, index) => item === arr1[index])) {
        return 1;
    }
    if (arr1.every((item, index) => item === arr2[index])) {
        return 2;
    }
    return 3;
}

function getRenderArr(routes) {
    let renderArr = [];
    renderArr.push(routes[0]);
    for (let i = 1; i < routes.length; i += 1) {
    // 去重
        renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
        // 是否包含
        const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
        if (isAdd) {
            renderArr.push(routes[i]);
        }
    }
    return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
    let routes = Object.keys(routerData).filter(
        routePath => routePath.indexOf(path) === 0 && routePath !== path,
    );
    // Replace path to '' eg. path='user' /user/name => name
    routes = routes.map(item => item.replace(path, ''));
    // Get the route to be rendered to remove the deep rendering
    const renderArr = getRenderArr(routes);
    // Conversion and stitching parameters
    const renderRoutes = renderArr.map(item => {
        const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
        return {
            exact,
            ...routerData[`${path}${item}`],
            key: `${path}${item}`,
            path: `${path}${item}`
        };
    });
    return renderRoutes;
}

export function getPageQuery() {
    return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
    const search = stringify(query);
    if (search.length) {
        return `${path}?${search}`;
    }
    return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
    return reg.test(path);
}

export function formatWan(val) {
    const v = val * 1;
    if (!v || Number.isNaN(v)) {return '';}

    let result = val;
    if (val > 10000) {
        result = Math.floor(val / 10000);
        result = (
            <span>
                {result}
                <span
                    styles={{
                        position: 'relative',
                        top: -2,
                        fontSize: 14,
                        fontStyle: 'normal',
                        lineHeight: 20,
                        marginLeft: 2
                    }}
                >
          万
                </span>
            </span>
        );
    }
    return result;
}

// 如果内容为空，返回-
export function sldEmptyHandle1(str) {
    return (str == '' || str == null) ? '-' : str;
}

// 如果内容为空或者undefined，返回''
export function sldEmptyHandle2(str) {
    return (str == undefined || str == null) ? '' : str;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
    return window.location.hostname === 'preview.pro.ant.design';
}

//返回左边一个竖线，右侧文字的结构
export function sldLlineRtext(leftColor, Rtext) {
    return <div className={styles.title}>
        <span style={{ backgroundColor: leftColor }} className={styles.left_border} />{Rtext}
    </div>;
}

//返回左边一个竖线，右侧文字的结构_添加商品(字体大小，颜色变化)
export function sldLlineRtextAddGoods(leftColor, Rtext) {
    return <div className={styles.title_add_goods}>
        {/*<span style={{ backgroundColor: leftColor }} className={styles.left_border}/>*/}
        <span>{Rtext}</span>
    </div>;
}

/**
 * 获取页面横线
 * @param {number} num  横线高度
 * @param {string} bgColor  横线的颜色
 */
export function getSldHorLineBgColor(num, bgColor) {
    return <div style={{ height: num, background: bgColor }} className={styles.com_line} />;
}

//返回左边一个竖线，右侧文字的结构_添加商品(字体大小，颜色变化) 增加上下左边的距离
export function sldLlineRtextAddMargin(leftColor, Rtext, ml = 0, mt = 0, mb = 0) {
    return <div className={styles.title_add_goods} style={{ marginLeft: ml, marginTop: mt, marginBottom: mb }}>
        <span style={{ backgroundColor: leftColor }} className={styles.left_border} />
        <span className={styles.title}>{Rtext}</span>
    </div>;
}

//返回通用的标题(可以设置字体大小、颜色) 增加上下左边的距离
export function sldLlineRtextAddGoodsAddMargin(leftColor, Rtext, ml = 0, mt = 0, mb = 0) {
    return <div className={styles.title_add_goods} style={{ marginLeft: ml, marginTop: mt, marginBottom: mb }}>
        <span className={styles.title}>{Rtext}</span>
    </div>;
}

//通用的标题，有背景色和标题名称
export function sldCommonTitleByBg(text,des='') {
    return <div className={styles.common_title_bg}>
        <span className={styles.title}>{text}</span>
        <span style={{marginLeft:'15px',color: '#FF7F40'}}>{des}</span>
    </div>;
}

//商户入驻的标题，有背景色和标题名称
export function sldApplyTitleByBg(text) {
    return <div className={styles.apply_title_bg}>
        <span className={styles.title}>{text}</span>
    </div>;
}

//通用的title（主要用于商品详情页）
export function sldCommonTitle(context, cont_color = '#333333', ml = 5, mt = 20, mb = 20) {
    return <div
        style={{ marginLeft: ml, marginTop: mt, marginBottom: mb, fontSize: 14, color: cont_color, fontWeight: 'bold' }}
    >
        {context}
    </div>;
}

/*
* 返回图标，下面文字
* @params svg svg图标名称
* @params text 底部文本
* @params marginT 底部文本距离svg图标的距离
* @params lindto 跳转连接
* */
export function sldTsvgBotText(svg, text, marginT, lindto = '', key, svgColor = '#5F96E3', width = 40, height = 40, font_color = '#555') {
    return <div key={key} className={styles.icon_text_width}>
        <Link to={lindto != '' ? lindto : '/'} className={styles.icon_text}>
            <ALibbSvg fill={svgColor} width={width} height={height} type={svg} />
            <span style={{ marginTop: marginT, color: font_color }}>{text}</span>
        </Link>
    </div>;
}

/*
* 返回图标
* @params svg svg图标名称
* @params color 图标颜色
* @params width 图标宽度
* @params height 图标高度
* */
export function sldTsvg(svg, color, width, height) {
    return <ALibbSvg fill={color} width={width} height={height} type={svg} />;
}

/*
 * 成功提示
 * @params con 提示内容
 * @params time 提示时间
 * */
export function sucTip(con, time = 2) {
    message.success(con, time);
}

/*
 * 失败提示
 * @params con 提示内容
 * @params time 提示时间
 * */
export function failTip(con, time = 3) {
    // message.error(con, time);
    message.warn(con, time);
}


//根据路由获取页面名称
function getPathName(pathname) {
    let path_array = pathname.split('/');
    let path_id = 'menu';
    for (let i = 0; i < path_array.length; i++) {
        if (path_array[i] != '') {
            path_id += `.${ path_array[i]}`;
        }
    }
    return formatMessage({ id: path_id });
}


/*
* @params props 为this.props
*
* */

// Get the currently selected menu
export function setTopRoute(props) {
    const {
        location: { pathname }
    } = props;
    if (pathname == '/dashboard/commonuse/desc' || pathname == '/' || pathname.split('/').length == 2) {
    //如果是常用功能页面，不需要存路由，并将activeKey置空
        setStorage('activePaneKey', '');
        return false;
    }
    //如果该路由在缓存里，重置activekey，否则存缓存并重置activekey
    let storagePane = getStorage('storagePane');
    let name = '默认页面'; //页面名称
    name = getPathName(pathname);
    let route_info = { title: name, key: pathname };
    if (pathname != '/' && pathname != '/dists/') {
        if (storagePane != undefined) {
            storagePane = JSON.parse(storagePane);
            //检测是否有一样的
            let flag = true;
            for (let i = 0; i < storagePane.length; i++) {
                if (storagePane[i].key == pathname) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                storagePane = storagePane.concat(route_info);
                setStorage('storagePane', JSON.stringify(storagePane));
            }
        } else {
            setStorage('storagePane', JSON.stringify([{ title: name, key: pathname }]));
        }
    }
    setStorage('activePaneKey', pathname);
}

/*
 * 删除单条数据确认提示框
 * @params position  展示位置
 * @params title 标题
 * @params callback 回调事件
 * @params okText 确认文本
 * @params cancleText 取消文本
 * @params showText 展示文本
 * */
export function sldPopConfirm(position, title, callback, okText, cancleText, showText, paddingL = 0, paddingR = 0, color = '#555') {
    return <Popconfirm
        placement={position}
        title={title}
        onConfirm={callback}
        okText={okText}
        cancelText={cancleText}
    >
        <a
            style={{ paddingLeft: paddingL, paddingRight: paddingR, color: color }}
            href="javascript:void(0)"
        >{showText}</a>
    </Popconfirm>;
}

/*
 * 删除单条数据确认提示框,主要用于Dropdown 下面的menuitem样式
 * @params position  展示位置
 * @params title 标题
 * @params callback 回调事件
 * @params okText 确认文本
 * @params cancleText 取消文本
 * @params showText 展示文本
 * */
// eslint-disable-next-line no-unused-vars
export function sldPopConfirmMenu(position, title, callback, okText, cancleText, showText, paddingL = 0, paddingR = 0, color = '#555') {
    return <Popconfirm
        placement={position}
        title={title}
        onConfirm={callback}
        okText={okText}
        cancelText={cancleText}
    >
        <a style={{ color: color, fontSize: 12 }} href="javascript:void(0)">{showText}</a>
    </Popconfirm>;
}

/*
 * 返回图标按钮——不带背景色
 * @params callback 按钮点击事件
 * @params svg svg图标
 * @params text 右侧文本
 * @params svgColor 图标颜色
 * @params wrapML 按钮左边距
 * @params wrapMR 按钮右边距
 * @params svgW 图标宽
 * @params svgH 图标高
 * @params textML 文字距离图标距离
 * */
export function sldIconBtn(callback, text, wrapML, wrapMR, svgW = 15, svgH = 15, textML = 4, svg = 'xinzeng', svgColor = '#ff5908') {
    return <div
        style={{ marginLeft: wrapML, marginRight: wrapMR }}
        className={styles.sld_common_btn}
        onClick={callback}
    >
        <ALibbSvg fill={svgColor} width={svgW} height={svgH} type={svg} />
        <span style={{ marginLeft: textML, fontSize: 13, color: '#333' }}>{text}</span>
    </div>;
}

/*
 * 返回图标按钮——不带背景色 和 sldIconBtn一样，但是不能点击，属于禁用按钮
 * @params callback 按钮点击事件
 * @params svg svg图标
 * @params text 右侧文本
 * @params svgColor 图标颜色
 * @params wrapML 按钮左边距
 * @params wrapMR 按钮右边距
 * @params svgW 图标宽
 * @params svgH 图标高
 * @params textML 文字距离图标距离
 * @params showTitle 禁止操作的提示
 * */
export function sldIconBtnNo(callback, text, wrapML, wrapMR, svgW = 15, svgH = 15, textML = 4, svg = 'xinzeng', svgColor = '#ff5908', showTitle = '禁止操作') {
    return <div
        style={{ marginLeft: wrapML, marginRight: wrapMR }}
        className={`${styles.sld_common_btn} ${styles.sld_common_btn_not_allowed}`}
        title={showTitle}
        onClick={callback}
    >
        <ALibbSvg fill={svgColor} width={svgW} height={svgH} type={svg} opacity={.3} />
        <span style={{ marginLeft: textML, fontSize: 13, color: '#cbcbcb' }}>{text}</span>
    </div>;
}

/*
 * 返回图标按钮——带背景色
 * @params callback 按钮点击事件
 * @params svg svg图标
 * @params text 右侧文本
 * @params svgColor 图标颜色
 * @params wrapML 按钮左边距
 * @params wrapMR 按钮右边距
 * @params svgW 图标宽
 * @params svgH 图标高
 * @params textML 文字距离图标距离
 * */
export function sldIconBtnBg(callback, svg, text, svgColor, wrapML, wrapMR, svgW = 15, svgH = 15, textML,isDisable=false) {
    return <Button
        style={{ marginLeft: wrapML, marginRight: wrapMR, backgroundColor: '#FF711E' }}
        className={styles.sld_common_btn}
        onClick={callback}
        disabled={isDisable}
    >
        <ALibbSvg fill={svgColor} width={svgW} height={svgH} type={svg} />
        <span style={{ marginLeft: textML, color: '#fff', fontSize: 13 }}>{text}</span>
    </Button>;
}

/*
 * 返回搜索框
 * @params placeholder 搜索框默认文本
 * @params width 搜索框宽度
 * @params callback 按钮点击事件
 * @params btnText 按钮文本
 * @params value 搜索框默认值
 * */
export function sldSearch(placeholder, width, callback, btnText, value = '') {
    return <Search
        placeholder={placeholder}
        enterButton={btnText}
        defaultValue={value}
        size="default"
        onSearch={value1 => callback(value1)}
        style={{ width: width }}
    />;
}

/*
 * 返回搜索框——受控组件（重置搜索的时候自动清空搜索内容）
 * @params placeholder 搜索框默认文本
 * @params width 搜索框宽度
 * @params callback 按钮点击事件
 * @params btnText 按钮文本
 * @params value 搜索框默认值
 * @params callbackCon 搜索框值变化事件
 * */
export function sldSearchVal(placeholder, width, callback, btnText, value, callbackCon) {
    return <Search
        placeholder={placeholder}
        enterButton={btnText}
        value={value}
        size="default"
        onSearch={value1 => callback(value1)}
        onChange={callbackCon}
        style={{ width: width }}
    />;
}

/*
 * 返回搜索框——受控组件（重置搜索的时候自动清空搜索内容）增加删除按钮
 * * @params placeholder 搜索框默认文本
 * @params btnText 按钮文本
 * @params callback 按钮点击事件
 * */
export function sldSearchValClear(placeholder, width, callback, btnText, value, callbackCon, clearcallback, rightV) {
    return <div style={{ position: 'relative' }}><Search
        placeholder={placeholder}
        enterButton={btnText}
        value={value}
        size="default"
        onSearch={value1 => callback(value1)}
        onChange={callbackCon}
        style={{ width: width }}
    />{value &&
  // eslint-disable-next-line react/jsx-curly-brace-presence
  <span onClick={clearcallback} style={{ position: 'absolute', top: 6, right: rightV, zIndex: 2, cursor: 'pointer' }}>{
      <ALibbSvg
          fill="#c8c8c8"
          width={14}
          height={14}
          type="qingchu" 
      />}</span>}</div>;
}

/*
 * 返回图标按钮_带背景色
 * @params callback 按钮点击事件
 * @params svg svg图标
 * @params text 右侧文本
 * @params svgColor 图标颜色
 * @params wrapML 按钮左边距
 * @params wrapMR 按钮右边距
 * @params svgW 图标宽
 * @params svgH 图标高
 * @params textML 文字距离图标距离
 * */
export function sldIconBtnBorder(callback, svg, text, svgColor, wrapML, wrapMR, svgW, svgH, textML) {
    return <div
        style={{
            marginLeft: wrapML,
            marginRight: wrapMR,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: '#E5E5E5'
        }}
        className={styles.sld_common_btn}
        onClick={callback}
    >
        <ALibbSvg fill={svgColor} width={svgW} height={svgH} type={svg} />
        <span style={{ marginLeft: textML }}>{text}</span>
    </div>;
}

/*
 * 右上角消息通知
 * @params message 消息标题
 * @params desc 消息描述
 * @params icon 图标
 * @params iconcolor 图标颜色
 * */
// eslint-disable-next-line no-shadow
export function sldNoticeRightTop(message, desc, icon, iconcolor) {
    return notification.open({
        message: message,
        description: desc,
        icon: <Icon type={icon} style={{ color: iconcolor }} />,
        duration: 2
    });
}

/*
 * 表格内文字过多的展示处理
 * @params message 消息标题
 * @params desc 消息描述
 * @params icon 图标
 * @params iconcolor 图标颜色
 * */
export function sldRowMoreShow(text, length) {
    let res = '';
    if (text.length == 0) {
        res = '';
    } else if (text.length <= length) {
        res = text;
    } else {
        res = <Tooltip placement="topLeft" title={text}>
            {`${text.substr(0, length) }...`}
        </Tooltip>;
    }
    return res;
}


/*
 * 文字左右两个部分展示
 * @params left_text 左部分文字
 * @params right_text 右部分文字
 * */
export function sldRowTextShow(left_text, right_text) {
    return <div className={styles.weight_r_span_wrap}><span
        className={styles.weight_w_left_span}
    >{left_text}</span><span
        className={styles.weight_w_right_span}
    >{right_text}</span></div>;
}

/*
 * 文字左右两个部分展示,居于两端
 * @params left_text 左部分文字
 * @params right_text 右部分文字
 * */
export function sldRowTextShowBetweent(left_text, right_text) {
    return <div className={styles.weight_r_span_wrap_betweent}><span
        style={{ justifyContent: 'flex-start', paddingLeft: 11 }}
        className={styles.weight_w_left_span}
    >{left_text}</span><span
        style={{ justifyContent: 'flex-end' }}
        className={styles.weight_w_right_span}
    >{right_text}</span>
    </div>;
}

/*
 * 删除某个tab的数据
 * @params del_tab  要删除的tab
 * */
export function sldDelTab(del_tab) {
    let pane = JSON.parse(getStorage('storagePane'));
    pane = pane.filter(pane1 => pane1.key !== del_tab);
    setStorage('storagePane', JSON.stringify(pane));
}


/**
 * 帮助提示_单条提示
 * @params  string con 展示的内容
 */
export function showHelpTip(con) {
    return <div className={styles.help_wrap}>
        {con}
    </div>;
}


/**
 * 帮助提示_多条提示
 * @params  string title 提示标题
 * @params  string tip_array 提示详情
 * @params number marginT 提示模块距离上方距离
 * @params boolean sld_show_tip 是否显示提示内容
 */
export function showMoreHelpTip(title, tip_array, marginT = 0, sld_show_tip = true) {
    if (!commonSetting.operateTipSwitch) {
        sld_show_tip = false;
    }
    return sld_show_tip
        ? <div className={styles.diy_tip_div} style={{ marginTop: marginT }}>
            <span>{title}</span>
            <ul>
                {tip_array.map((item, index) => <li key={index}>• {item}</li>)}
            </ul>
        </div>
        : null
    ;
}

/**
 * 帮助提示_多条提示_装修modal弹框处，没有背景
 * @params  string con 展示的内容
 */
export function showMoreModalHelpTip(tip_array) {
    return <div className={styles.diy_modal_tip_div}>
        <ul>
            {tip_array.map((item, index) => <li key={index}>• {item}</li>)}
        </ul>
    </div>;
}


//通用的年月日
export const dateFormat = 'YYYY-MM-DD';
export const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';


/*
 * 删除单条数据确认提示框_除了提示框 别的东西都是自定义
 * @params position  展示位置
 * @params title 标题
 * @params callback 回调事件
 * @params okText 确认文本
 * @params cancleText 取消文本
 * @params content 展示内容
 * */
export function sldPopConfirmDiy(position, title, callback, okText, cancleText, content) {
    return <Popconfirm
        placement={position}
        title={title}
        onConfirm={callback}
        okText={okText}
        cancelText={cancleText}
    >
        {content}
    </Popconfirm>;
}

/**
 * 验证输入的是否是英文字母
 */
export function validatorLetter(rule, value, callback) {
    // eslint-disable-next-line no-shadow
    let reg = /^[A-Za-z]+$/;
    if (!reg.test(value)) {
        callback('请输入正确的首字母');
    }
    callback();
}

/**
 * 验证大小在0～255范围内
 */
export function validatorNumbe(rule, value, callback) {
    if (!(value >= 0 && value <= 255)) {
        callback('请输入0~255的数字');
    }
    callback();
}


/**
 * 验证会员名，由中、英文、数字、"-"及"_"，且不能全为数字
 */
export function validatorMem(rule, value, callback) {
    // eslint-disable-next-line no-shadow
    let reg = new RegExp('^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){1,20}$');
    let reg_num = new RegExp('^[0-9]*$');
    if (value.length < 6 || value.length > 20) {
        callback('请输入6-20位的会员名');
    } else if (reg.test(value)) {
        if (reg_num.test(value)) {
            callback('会员名不能全为数字');
        } else {
            callback();
        }
    } else {
        callback('会员名须由中、英文、数字、"-"及"_"组成');
    }
}

/**
 * 验证会员的密码，6～20位，由字母、数字或符号组成的验证
 */
export function validatorMemPwd(rule, value, callback) {
    if (value.length < 6 || value.length > 20) {
        callback(`${sldComLanguage('请输入6～20位的密码')}`);
    } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback(`${sldComLanguage('密码不可以有中文')}`);
    } else if (!(/^\S*$/.test(value))) {
        callback(`${sldComLanguage('密码中不可以有空格')}`);
    } else {
        callback();
    }
}

/**
 * 验证数据都是正整数
 */
export function validatorIntegerPositive(rule, value) {
    let reg = /^[1-9]\d*$/;
    if (value && !reg.test(value)) {
        return false;
    }
    return true;
}

/**
 * 验证数据都是正整数，react from表单验证
 */
export function validatorIntegerPositiveForm(rule, value, callback) {
    let reg = /^[1-9]\d*$/;
    if (value && !reg.test(value)) {
        callback('请输入正整数');
    }
    callback();
}

/**
 * 验证数据都是2～999的整数
 */
export function validatorConversionRatio(rule, value, callback) {
    let reg = /^[1-9]\d*$/;
    value = value * 1;
    if (value) {
        if (!reg.test(value)) {
            callback('请输入2~999的整数');
        } else if (value < 2 || value > 999) {
            callback('请输入2~999的整数');
        }
    }
    callback();
}

/**
 * 验证数据都是1～99999的整数
 */
export function validatorGoodsValidity(rule, value, callback) {
    let reg = /^[1-9]\d*$/;
    value = value * 1;
    if (value) {
        if (!reg.test(value)) {
            callback('请输入1～99999的整数');
        } else if (value < 1 || value > 99999) {
            callback('请输入1～99999的整数');
        }
    } else {
        callback('请输入1～99999的整数');
    }
    callback();
}

/**
 * 验证银行卡号限制21位
 */
export function validatorBankCode(rule, value, callback) {
    let res = validatorIntegerPositive(rule, value, callback);
    if (value && (`${value }`).length > 22 || !res) {
        callback('请输入正确的数据');
    }
    callback();
}

/**
 * 获取表格序号
 */
export function getTableNum(params, pageSize, index) {
    let cur_page = params.current != undefined ? params.current : 1;
    return (cur_page - 1) * pageSize + index + 1;
}

/**
 * 返回上下拖动的拖动条
 */
export function getSldResizeBar() {
    return <div style={{ position: 'relative' }}>
        <div style={{ width: '100%', height: 4, backgroundColor: '#c5cfdc', position: 'absolute', zIndex: 1 }} />
    </div>;
}

/**
 * 获取商品列表商品图片的展示
 */
export function getSldListGoodsImg(img_url) {
    return img_url ? <div className={`${styles.flex_com_row_center}`}>
        <Popover
            placement="rightTop"
            content={<div className={`${styles.flex_com_row_center} ${styles.goods_img_wrap_160}`}>
                <img src={img_url} />
            </div>}
        >
            <div className={`${styles.flex_com_row_center} ${styles.goods_img_wrap_30}`}>
                <img src={img_url} />
            </div>
        </Popover>
    </div> : null;
}

/**
 * 获取商品列表商品图片的展示
 */
export function getSldListGoodsImg80(img_url) {
    return img_url ? <div className={`${styles.flex_com_row_center}`}>
        <Popover
            placement="rightTop"
            content={<div className={`${styles.flex_com_row_center} ${styles.goods_img_wrap_200}`}>
                <img src={img_url} />
            </div>}
        >
            <div className={`${styles.flex_com_row_center} ${styles.goods_img_wrap_80}`}>
                <img src={img_url} />
            </div>
        </Popover>
    </div> : null;
}

/**
 * 审核通过拒绝处理是否必填数据
 * @param array  data  要处理的数据
 * @param  e radio选择的结果
 * @param array  filed  字段名，要对哪个数据进行处理
 */
export function sldHandleCheckData(data, e, filed) {
    for(let i = 0; i < data.length; i++) {
        if (data[i].name == filed) {
            if (e.target.value) {
                //通过 审核意见非必填
                delete data[i].rules;
            } else {
                //拒绝 审核意见必填
                data[i].rules = [{
                    required: true,
                    whitespace: true,
                    message: '请输入审核意见'
                }];
            }
            break;
        }
    }
    return data;
}

/**
 * 验证输入的是否是特殊字符
 * @params  String str  验证的字符串
 */
export function validatorSpecialString(rule, value, callback) {
    const regs = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
    if (value && regs.test(value)) {
        callback('检测到有特殊字符，请重新输入');
    }
    callback();
}

/**
 * input_after 后缀样式
 */
export function sldInputAfterAddons() {
    return <span
        className={styles.input_after_wrap}
        style={{ marginLeft: 5, marginRight: 5 }}
    >{sldTsvg('sousuo1', '#666', 16, 16)}</span>;
}

/**
 * 多语言-统一获取语言
 */
export function sldComLanguage(name) {
    // return name != undefined && name ? formatMessage({ id: name }) : '';
    return name != undefined && name ? name : '';
}

/**
 * 上传图片限制，限制的大小是服务器的配置
 */
export function sldBeforeUpload(file, fileList, limit = uploadLimit) {
    if (file.size != undefined && file.size > 1024 * 1024 * limit) {
        failTip(`${sldComLanguage('上传文件过大，请上传小于')}${ limit }${sldComLanguage('M的图片')}`);
        return false;
    }
}

/**
 * 表格里的操作按钮,后续增加了判断，主要解决<a> cannot appear as a descendant of <a>这个警告
 */
export function sldtbaleOpeBtn(text, svg, callback, svgW = 14, svgH = 14) {
    return callback == null
        ? <span title={text} style={{ marginRight: 3 }}>
            <ALibbSvg fill="#08A9B7" width={svgW} height={svgH} type={svg} />
        </span>
        : <a href='javascript:void(0)' onClick={callback} title={text} style={{ marginRight: 3 }}>
            <ALibbSvg fill="#08A9B7" width={svgW} height={svgH} type={svg} />
        </a>;
}

/**
 * 表格里的操作按钮,Link跳转用
 */
export function sldtbaleOpeLink(text, svg, svgW = 14, svgH = 14) {
    return <span title={text} style={{ marginRight: 3 }}>
        <ALibbSvg fill="#08A9B7" width={svgW} height={svgH} type={svg} />
    </span>;
}


/**
 * 获取列表图片的展示+预览效果
 * @params  String img_url  图片地址
 * @params  String showW  图片预览的宽度
 * @params  String showH  图片预览的高度
 * @params  String viewW  图片展示的宽度
 * @params  String viewH  图片展示的高度
 */
export function getSldComImg(img_url, showW, showH, viewW, viewH) {
    return img_url ? <div className={`${styles.flex_com_row_center}`}>
        <Popover
            placement="rightTop"
            content={<div
                className={`${styles.flex_com_row_center} ${styles.com_img_wrap}`}
                style={{ width: showW, height: showH }}
            >
                <img src={img_url} />
            </div>}
        >
            <div
                className={`${styles.flex_com_row_center} ${styles.com_img_wrap}`}
                style={{ width: viewW, height: viewH, margin: '0 5px' }}
            >
                <img src={img_url} />
            </div>
        </Popover>
    </div> : null;
}

/*
 * 获取缓存中图片信息
 * @params name  缓存的键
 * */
export function getSldImgSet(name) {
    return getStorage(name) != undefined && getStorage(name) ? JSON.parse(getStorage(name)) : '';
}

/*
 * 圆形背景里面展示图标，用户装修模块的操作
 * @params callback 点击事件
 * @params svgW 图标宽度
 * @params svgH 图标高度
 * @params svg 图标
 * @params svgColor 图标颜色
 * */
export function getOSvgMDiy(callback, svg, svgColor, svgW = 15, svgH = 15) {
    return <div
        href="javascript:void(0)"
        onClick={callback}
        className={`${styles.mdiy_operate_a} ${styles.flex_row_center_center}`}
        style={{ height: 30 }}
    >
        <ALibbSvg fill={svgColor} width={svgW} height={svgH} type={svg} extra={{ marginLeft: 15 }} />
    </div>;
}

/*
 *返回统计图标Y轴的标题样式
 * */
export function getSldStatYTitle() {
    return {
        textStyle: {
            fontSize: '12',
            textAlign: 'center',
            fill: '#666',
            fontWeight: 'bold'
        } // 坐标轴文本属性配置
    };
}


/*
 *封装的请求
 * method:请求方式  get  post
 * url 访问地址
 * params 参数
 * data_type json json格式 默认是表单提交
 * */
export function sldComRequest(method, url, params, data_type = '') {
    if (method == 'get') {
        let tmp_url = `${apiUrl }${url}`;
        if (params != undefined) {
            tmp_url += `?${stringify(params)}`;
        }
        return request(tmp_url);
    } if (method == 'post') {
        if (data_type == 'json') {
            return request(`${apiUrl }${url}`, {
                method: 'POST',
                body: params
            }, 'json');
        } 
        return request(`${apiUrl }${url}`, {
            method: 'POST',
            body: `${stringify(params)}`
        });
    
    }
}

/**
 * 获取页面横线
 */
export function getSldHorLine(num) {
    return <div style={{ height: num }} className={styles.com_line} />;
}

export async function sldCommonService(params, method, url, data_type = '') {
    let cur_time = new Date().getTime();
    let start_time = getStorage('time');
    let refresh_token = getStorage('refresh_token');
    //不需要token的接口
    let speial_request = [
        '/v3/seller/oauth/token',//登录
        '/v3/seller/oauth/logout',//退出登录
        '/v3/system/common/getCaptcha',//获取验证码
        '/v3/system/seller/setting/getStoreSetting'//获取登录页图片
    ]
    let updateFlag = start_time && (cur_time - start_time > ( 58* 60 * 1000)) && speial_request.indexOf(url) == -1 && refresh_token!=undefined&&refresh_token!=null;
    if(updateFlag){
    // console.info('通过refresh_token刷新token');
    //用户token过期之后重新根据refresh_token获取token(58分钟，token的有效期是60分钟)
        let res = await refreshToken();
        if (res.state == 200) {
            setStorage('token', res.data.access_token);
            setStorage('refresh_token', res.data.refresh_token);
            //更新sld_token的时间
            setLocalStorageTime();
            return sldComRequest(method, url, params, data_type);
        } 
        loginOut();
    
    }else{
        return sldComRequest(method, url, params, data_type);
    }
}

async function refreshToken() {
    let param = new FormData();
    param.append('grant_type', 'refresh_token');
    param.append('refresh_token', getStorage('refresh_token'));
    param.append('client', 'pc');
    let result = await fetch(`${apiUrl }v3/seller/oauth/token`, {
        credentials: 'include',
        headers: {
            Authorization: 'Basic c2VsbGVyOnNlbGxlcg=='
        },
        method: 'POST',
        body: param
    }).then(response => response.json());
    return result;
}

/**
 * 文字过多 表个列只展示一部分，鼠标悬浮展示全部
 * @param {string} str  展示的数据
 * @param {number} strDefaultLength  默认展示的字数
 * @param {string} popWidth  弹窗的宽度
 * @param {string} popHeight  弹窗的高度
 */
export function getSldComShowMoreTtex(str, strDefaultLength, popWidth, popHeight = '') {
    return str && str.length > strDefaultLength ? <Popover
        placement="rightTop"
        content={<div style={{
            width: popWidth,
            height: popHeight ? popHeight : 'auto',
            wordBreak: 'break-all'
        }}
        >
            {str}
        </div>}
    >
        <div>
            {str.length > strDefaultLength ? `${str.substr(0, strDefaultLength - 1) }...` : str}
        </div>
    </Popover> : str;
}

/**
 * 对象数组实现深拷贝
 * @param {array} origion_data  源对象数组
 */
export function getSldCopyData(origion_data) {
    let new_data = [];
    if (origion_data.length > 0) {
        for(let i = 0; i < origion_data.length; i++) {
            if (typeof origion_data[i] == 'object') {
                new_data.push({ ...origion_data[i] });
            } else {
                new_data.push(origion_data[i]);
            }
        }
    }
    return new_data;
}

/**
 * 页面要适应高度，不同屏幕获取相应的高度，高度以1080为准，传入的值直接是1080设计图的尺寸就可以
 */
export function sldFullHeight(height) {
    return Math.round(document.body.clientHeight * height / 1920);
}

/*
* 笛卡尔积返回商品的SKU
* 参数的格式：二维数组，eg:[[1, 2, 3], ['a', 'b', 'c']]
* */
export function calcDescartes(array) {
    if (array.length < 2) {return array[0] || [];}
    return [].reduce.call(array, (col, set) => {
        var res = [];
        col.forEach((c) => {
            set.forEach((s) => {
                var t = [].concat(Array.isArray(c) ? c : [c]);
                t.push(s);
                res.push(t);
            });
        });
        return res;
    });
}

/**
 * 表格里的操作按钮,后续增加了判断，主要解决<a> cannot appear as a descendant of <a>这个警告
 * 按钮用文字表示
 */
export function sldtbaleOpeBtnText(text, callback) {
    return callback == null
        ? <span className={styles.tableOperateText}>
            {text}
        </span>
        : <span className={styles.tableOperateText} onClick={callback}>
            {text}
        </span>;
}


/*
 * 返回一个数字的整数和小数
 * number 需要处理的数据
 * type: 要获取的数据 int 整数  decimal 小数
 */
export function getPartNumber(number, type) {
    let target = '';
    if (number == undefined) {
        return false;
    }
    number = number.toString();
    if (type == 'int') {
        target = number.split('.')[0];
    } else if (type == 'decimal') {
        target = number.split('.')[1] != undefined ? (`.${ number.split('.')[1]}`) : '.00';
        if (target.length < 3) {
            target += '0';
        }
    }
    return target;
}

/**
 * 验证邮箱
 */
export function validatorVendorEmail(rule, value, callback) {
    if (sldCheckEmail(value)) {
        callback();
    } else {
        callback('请输入正确的邮箱');
    }
}


/**
 * 比较2个纯数字数组是否相等
 * a,b 为要比较的数字数组
 * 相等返回true，否则返回false
 */
export function isEqualArray(a, b) {
    if (a.length > 0 && b.length > 0) {
        return a.sort().toString() == b.sort().toString();
    }
    if (a.length == 0 && b.length == 0) {
        return true;
    }
    return false;
}

/**
 * 验证店铺电话(可以是手机号也可以是固话)
 */
export function validatorVendorPhone(rule, value, callback) {
    if (value) {
        if (sldCheckTel(value) || sldCheckMobile(value)) {
            callback();
        } else {
            callback('请输入正确的电话号');
        }
    } else {
        callback();
    }
}


/*
 * 表格分页数据统一（只用于统计的报表模块）
 * @param {object} pagination 分页数据对象
 * @param {object} filtersArg  表格列的过滤数据
 * @param {object} sorter 表格列的筛选数据
 * @param {object} formValues 搜索数据
 * @param {number} type 1为sort字段为驼峰形式，2为sort字段为下划线连接
 * */
export function sldHandlePaginationDataStat(pagination, filtersArg, sorter, formValues = {}, type = 1, pageSize) {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
        newObj[key] = getValue(filtersArg[key]);
        return newObj;
    }, {});

    const params = {
        current: pagination.current || 1,
        pageSize: pagination.pageSize || pageSize,
        ...formValues,
        ...filters
    };
    //升序、降序的处理
    if (sorter.order) {
        if (sorter.order == 'ascend') {
            params.type = 'asc';
        } else if (sorter.order == 'descend') {
            params.type = 'desc';
        }
    }
    if (sorter.field) {
        if (type == 1) {
            //sort字段为驼峰形式
            params.sort = sorter.field;
        } else if (type == 2) {
            //sort字段为下划线连接
            params.sort = sldConvert(sorter.field);
        }
    }
    return params;
}

/*
* 驼峰形式的字符串转为下划线连接
* @param {int} index 第几列
* @param {int} size 宽度值
* @param {array} columns_data table的columns数据
* */
export function sldConvert(str) {
    let target = '';
    let strArray = str.split('');
    strArray.forEach(item => {
        if (item === item.toUpperCase()) {
            target += `_${item.toLowerCase()}`;
        } else {
            target += item;
        }
    });
    return target;
}

/*
格式化月或者日，小于10的时候前面用0补齐
 */
export function formatMonthOrDay(val) {
    let resutl = val * 1;
    if (resutl < 10) {
        resutl = `0${ val}`;
    }
    return resutl;
}

export function noDataPlaceholder(width = '120px', tips = '暂无数据') {
    return <div className={`${styles.flex_column_center_center}`} style={{ width: '100%', height: '100%' }}>
        <img style={{ width }} src={require('../assets/table_nodata_icon.png')} alt='' />
        <span style={{ fontSize: '12px', color: '#C3C3C3', marginTop: '10px' }}>{tips}</span>
    </div>;
}

/*
 * 获取昨天的日期  返回的结果如：2021-07-01
 * */
export function sldGetYesterdayDate() {
    let today = new Date();
    today.setTime(today.getTime() - 24 * 60 * 60 * 1000);
    let target = `${today.getFullYear() }-${ today.getMonth() + 1 }-${ today.getDate()}`;
    return target;
}

/*
 * 数字格式化，增加单位万，减少数据长度，返回数据如：1.5万或者8,999
 * @param {Number} num 要格式化的数据
 * */
export function formatNum(num,toFixedNum=0,color='#333') {
    let target = num*1;
    let unit = '';
    if(target){
        if(target<10000){
            target = target.toFixed(toFixedNum);
        }else{
            target = (target/10000).toFixed(toFixedNum)*1;
            unit = '万';
        }
        let regExpInfo = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
        target = target.toString().replace(regExpInfo, "$1,");
    }else{
        target = num;
    }
    return <Fragment><span className={styles.statNumVal}>{target}</span><span className={styles.statNumUnit} style={{color:color}}>{unit}</span></Fragment>;
}

/*
 * 数字格式化，增加单位万，减少数据长度，返回数据如：1.5万或者8,999
 * @param {Number} num 要格式化的数据
 * */
export function formatNumPieCircle(num, toFixedNum = 0) {
    let target = num * 1;
    let unit = '';
    if (target) {
        if (target < 10000) {
            target = target.toFixed(toFixedNum);
        } else {
            target = (target / 10000).toFixed(1) * 1;
            unit = '万';
        }
        let regExpInfo = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
        target = target.toString().replace(regExpInfo, '$1,');
        target = target + unit;
    } else {
        target = num;
    }
    return target;
}

/*
* 打印base64的pdf文件
* source：打印的内容
* type：打印类型
* */
export function sldPrint(source, type = 'base64_pdf') {
    if (type == 'base64_pdf') {
    //去掉base64里面的data:application/pdf;base64,
        let tmp = source.replace('data:application/pdf;base64,', '');
        printJS({ documentTitle:'发货明细单',printable: tmp, type: 'pdf', base64: true });
    } else if (type == 'html') {
        printJS({
            documentTitle:'发货明细单',
            printable: source,
            type: 'html',
            targetStyles: ['*']// 继承原来的所有样式，不加这句的话打印出来的没有样式
        });
    }
}

/*
 * 去除字符串左右两端的空格
 * @param {String} str 去除空格的字符串
 * */
export function trimString(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "")
}


export const getTimestamp = () => Date.parse(new Date())

export function withKey(datas){
    return datas.map((d, i) => {
        d.key = `${getTimestamp()}${Math.round(Math.random() * 123456)}${i}`;
        return d;
    });
}


export const downLoad_front = (fileType) => {
    var a = document.createElement('a');
    if (fileType == '1') {
        a.href = './template.xlsx';
        a.download = 'template.xlsx';
    }else if(fileType == '2'){
        a.href = './templateskill.xlsx';
        a.download = 'templateskill.xlsx';
    }else if(fileType == 'member'){
        a.href = './template_member.xlsx';
        a.download = 'template_member.xlsx';
    }else if(fileType == 'rule'){
        a.href = './template_rule.xlsx';
        a.download = 'template_rule.xlsx';
    }else if(fileType == 'together_buy'){
        a.href = './together_buy.xlsx';
        a.download = 'together_buy.xlsx';
    }else if(fileType == 'buy_everyday'){
        a.href = './buy_everyday.xlsx';
        a.download = 'buy_everyday.xlsx';
    } 
    a.click();

}

export const isRepeat=(arr)=>{
    var hash = {};
    for (var i in arr) {
        if (hash[arr[i]]){
            return true; 
        }
        hash[arr[i]] = true;
    }
    return false;
}

export const withIndex = (datas, page) => datas.map((d, i) => {
    d.key = `${getTimestamp()}${Math.round(Math.random() * 123456)}${i}`;
    // 增加序号（需要分页参数）
    if (page) {
        const {current, pageSize} = page;
        d.index = (current - 1) * pageSize + (i + 1);
    }
    return d;
})

export const companyConfig = {
    Dev:{
        companyId: '69f725e9-d2ae-41fa-bd56-61557e43e34b',
        companyName: '西安商旅通'
    },
    BlackBox:{
        companyId: 'd27c3129-a754-4278-90a6-92021a535b63',
        companyName: '梦工厂'
    },
    Sandbox:{
        companyId: 'd73db335-d80d-4244-9aa8-969a63c4120e',
        companyName: '伴正事UAT测试'
    },
    Production:{
        companyId: '1337ae12-e325-41e6-b6b6-cbbed59a13f2',
        companyName: '深圳兆日科技股份有限公司'
    }
}

/**
 * @param {Number}  len uuid的长度
 * @param {Boolean} firstU 将返回的首字母置为"u"
 * @param {Nubmer} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
 */
export const guid = (len = 10, firstU = true, radix = null)=> {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const uuid = []
    let rax = radix || chars.length

    if (len) {
        // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
        for (let i = 0; i < len; i++) { uuid[i] = chars[0 | Math.random() * rax] }
    } else {
        let r
        // rfc4122标准要求返回的uuid中,某些位为固定的字符
        // eslint-disable-next-line no-multi-assign
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
            }
        }
    }
    // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
    if (firstU) {
        uuid.shift()
        return `u${uuid.join('')}`
    }
    return uuid.join('')
}


export const isString = obj =>Object.prototype.toString.call(obj) == '[object String]'

export const isArray = obj => Object.prototype.toString.call(obj) == '[object Array]'

export const isObject = obj => Object.prototype.toString.call(obj) == '[object Object]'

export const isNumber = obj => Object.prototype.toString.call(obj) == '[object Number]'

/**
 * @param obj 判断是否为空
 */
export const isEmpty = obj => {
    if (obj==null || obj==undefined){
        return true;
    }
    if (isString(obj)){
        return obj.replace(/\s/g, '') == '';
    }
    if (isArray(obj)){
        return obj.length == 0;
    }
    if (isObject(obj)){
        return Object.keys(obj).length == 0;        
    }
    return false;
}

/**
 * @param obj 判断是否不为空
 */
export const isNotEmpty = obj => !isEmpty(obj)


/**
 * @param arg 乘法函数，用来得到精确的乘法结果 js计算浮点数是有问题的
 */
export function accMul(arg1, arg2){
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try { m+=s1.split(".")[1].length } catch (e){}
    try { m+=s2.split(".")[1].length } catch (e){}
    // eslint-disable-next-line no-restricted-properties
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
}

/**
 * @param arg 除法函数
 */
export function accDiv(arg1,arg2){
    var t1=0,t2=0,r1,r2;
    try{t1=arg1.toString().split(".")[1].length}catch(e){}
    try{t2=arg2.toString().split(".")[1].length}catch(e){}
    r1=Number(arg1.toString().replace(".",""));
    r2=Number(arg2.toString().replace(".",""));
    // eslint-disable-next-line no-restricted-properties
    return (r1/r2)*Math.pow(10,t2-t1);
}

/**
 * 深度copy
 * @param obj
 */
export const deepCopy = (obj) => {
    const _obj = Array.isArray(obj) ? obj : {};

    // eslint-disable-next-line array-callback-return
    typeof obj === 'object' && Object.keys(obj).map(k => {
        let v = obj[k];

        if (v && typeof v === 'object') {
            _obj[k] = deepCopy(v);
        } else {
            _obj[k] = v;
        }
    });

    return _obj;
}
/**
 * @param arg 判断对象数组是否重复
 */
export const isObjArrRepeat=(arr,attr)=>{
    var hash = {};
    for (var i in arr) {
        if (hash[ arr[i][attr] ]){
            return true; 
        }
        hash[ arr[i][attr] ] = true;
    }
    return false;
}

/**
 * @param url  通过url下载文件
 */
export const downByUrl=(url,name)=>{
    let link = document.createElement('a')
    link.href = url
    link.download = name //加上下载的文件名
    link.click()
    link.remove()
}

/**
 * @param menu  按钮权限 {'/marketing/buy_everyday':['view','edit','del','add','audit']}
 */
export const saveAuthBtnMap=(menu)=>{
    let btnMap = {}
    let execBtn = (menu,parent={})=>{
        menu.forEach((item)=>{
            if(item.children && item.children.length){
                execBtn(item.children,item)
            }else if(item.grade == 4){
                const { frontPath } = item
                if(!btnMap[parent.frontPath]){
                    btnMap[parent.frontPath] = []
                }
                btnMap[parent.frontPath].push(frontPath)  
            }
        })
    }
    execBtn(menu)
    return btnMap
}

/**
 * @param   提取当前路由权限
 */
export const getAuthBtn=()=>{
    let btnMap = JSON.parse(getStorage('menubtn_data'));
    let hashUrl = window.location.hash
    let authBtn = []
    btnMap && Object.keys(btnMap).forEach((url)=>{
        if(hashUrl.indexOf(url)>-1){
            authBtn = btnMap[url]
            // console.log(url,authBtn)
        }
    })
    return authBtn
}

/**
 * @param   判断当前路由权限是否含有某个权限
 */
export const hasAuth=(auth)=>{
    let routerAuths = getAuthBtn()
    return !!auth && Array.isArray(routerAuths) && routerAuths.includes(auth)
}