/*
 * @Author: your name
 * @Date: 2020-11-16 15:14:37
 * @LastEditTime: 2020-11-17 16:15:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bplus\mall\frontend-client\index\build\plugin\HtmlWebpackPluginExt.js
 */
/**
 * htmlplugin，作用为将splitChunks分包中cachegroup对应的chunk加入到html中，如果没有在入口文件中显示申明cachegroup对应的chunk，该chunk不会加入到html中
 * uni-app对入口文件做了限制，不允许修改入口文件，故使用该插件将对应的chunk文件添加到html中
 */
class HtmlWebpackPluginExt {
    constructor(options = {}){
        this.options = options;
    }

    apply(compiler){
        /**
         * ①class HtmlWebpackPluginExt的this只在这个地方有效，this放到其他函数下就指向了对应的函数；
         * ②获取chunks，该chunks值必须与cachegroup的name一致，否则加入到html中后无法加载资源
         * ③若果在打包的js文件中有相同的chunk名称，则值加载匹配到的第一个加入到html中
         */
        var chunks = this.options.chunks;
        compiler.plugin('compilation', function(compilation) {
            compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData) {
                var baseUrl = htmlPluginData.plugin.options.baseUrl;
                if (!Array.isArray(chunks)){
                    throw 'chunks must be array'
                } else if (chunks&&chunks.length>0){ //如果参数中传入了chunks，并且数组长度大于0 则将chunks对应的打包js添加到html中
                    chunks.forEach(chunk => {
                        var reg = new RegExp('/'+chunk+'(\\..*?)?\\.js');
                        var asset = baseUrl+Object.keys(compilation.assets).find(item=>reg.test(item));
                        htmlPluginData.assets.js.push(asset);//添加chunk到html中
                    });
                } else {
                    //todo someting
                }
            });
        });
    }
   
}
    
module.exports = HtmlWebpackPluginExt;