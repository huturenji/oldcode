//slodon_配置服务器接口地址 http://seller.tixin4u.com:41080/ https://jbbcsellerdev.slodon.cn/ https://im.55sld.com http://seller.tixin4u.com:40080 
module.exports = {
    apiUrl: `${window.location.origin }/mallbbcg2/`, //接口请求, 
    // imUrl: window.location.origin + '/mallbbcg2/static/im/',//im访问地址
    imUrl: 'https://www.soboten.com/console/login',//im访问地址 todo 目前暂时跳转到智齿科技客服登录页
    uploadLimit: 20,//上传限制，单位M
    addGoodsSpecLimit: 3,//发布商品添加规格项限制的数量
    addGoodsSpecValLimit: 10,//发布商品添加规格值限制的数量
    specialFlag: window.location.host.indexOf('seller.tixin4u.com:40080') + window.location.host.indexOf('localhost') + window.location.host.indexOf('seller.tixin4u.com:40080')
};

/** copyright *** slodon *** version-v3.0 *** date-2021-07-28 ***主版本v3.0**/
