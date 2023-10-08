/**
 * 环境变量获取url
 */
 export const envReqUrl = '../thirdparty/urlConfigTM.json';
 export const BIS_CUSTOMER_SERVICE_PHONE = '400-855-6588';//商旅联系电话
 //上传组件的默认地址，项目的全局配置
 // export const uploadUrl = "//jsonplaceholder.typicode.com/posts/"
 export const uploadUrl = window.origin + "/media" + "/file/v1/upload?c=static&p=/media/file&n="
//  export const uploadUrl = "https://bplusdev.sinosun.com:18180/" + "/media" + "/file/v1/upload?c=static&p=/media/file&n="
 //因公因私的配置开关，统一打开或关闭 页面上的因公因私功能
 export const userTypeSwitch = false;