/*
 * @Author: your name
 * @Date: 2020-11-16 15:14:37
 * @LastEditTime: 2020-11-17 16:15:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bplus\mall\frontend-client\index\build\plugin\HtmlWebpackPluginExt.js
 */
const HtmlWebpackPlugin = require("html-webpack-plugin");
 class HtmlWebpackPluginExt{
    constructor(option={}){
        this.option = option;
    }
    apply(compiler){
        var scriptAttr = this.option.scriptAttr;
        var styleAttr = this.option.styleAttr;
        const handlerHtmlWebpackPluginExt = (htmlPluginData,cb)=>{
            // //css直接拼接在head中；js根据options.inject属性拼接，如果为true则拼接在body中，否则为head
            //后续可以根据不同的入口chunks新增不同的属性
            (htmlPluginData.head || htmlPluginData.headTags ).map(item=>{
                item.tagName==="script"?Object.assign(item.attributes,scriptAttr,{}):Object.assign(item.attributes,styleAttr,{});
            });
           scriptAttr&&(htmlPluginData.body || htmlPluginData.bodyTags).map(item=>{
                Object.assign(item.attributes,scriptAttr,{});
            });
            cb(null,htmlPluginData);
        }
        if(compiler.hooks){
            // webpack 4 support
            compiler.hooks.compilation.tap('alterAssetTags',(compilation,option)=>{
                //webpack4+返回的数据只有headTags、bodyTags属性
                HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('alterAssetTags',handlerHtmlWebpackPluginExt);
            });
        }else{
            compiler.plugin('compilation',(compilation,option)=>{     
                 //webpack4以下版本，返回的数据只有head、body属性      
                compilation.plugin('html-webpack-plugin-alter-asset-tags',handlerHtmlWebpackPluginExt);               
            });
        }
    }
}
module.exports = HtmlWebpackPluginExt;