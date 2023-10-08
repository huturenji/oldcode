/*
 * @Descripttion: 获取所有html文件，如果html下有同名的js入口文件，则输出，否则不输出该html
 * @version: 
 * @Author: yg
 * @Date: 2020-05-29 18:11:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-11-17 16:35:08
 */

/**
 * 获取所有html文件
 */
const glob = require('glob')
const path = require('path')
const entry = require('./multi-entry')
const config = require('./config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPluginExt = require('./plugin/HtmlWebpackPluginExt')

//环境变量
var arguments = process.env.BP_ENV || 'Dev'
const envConfig = require('./config/sets.env');
let basePath = 'development'===process.env.NODE_ENV ? envConfig.envMap[arguments].host+'travel/static/' : '../';//供html文件中表达式使用
let preHtml = process.env.BP_PREHTML ?`${process.env.BP_PREHTML}/` : '';

let entrys = entry();
let createHTMLPlugin = () => {
  let htmls = [];
  htmls.push(new HtmlWebpackPluginExt({
	scriptAttr:{onerror:'error()'}
  }));

  // get all templates
  let files = glob.sync(config.src + '/**/*.' + config.ext);
	
  files.forEach(function (_file) {
    let file = path.parse(_file);
    let chunks = [];
    let chunkName = file.name;
    config.build.mergeCss?chunks.push('styles'):'';//自动加载cacheGroups/styles
    // if has same name entry, create a html plugin
    let c = entrys[chunkName];
	if(c){
		chunks.push(chunkName);
		let plugin = new HtmlWebpackPlugin({
			filename: preHtml + file.base,
			template: path.resolve(file.dir, file.base),
			data:new Date().getTime(),
			path: basePath,
			chunks: chunks,
			inject: true,/*,
			inlineSource: '.(js|css)$',
			minify:{
				removeComments: true,//删除注释
				collapseWhitespace:true//删除空格
			}*/
			multihtmlCache: true // 解决多页打包的关键！
		});
		htmls.push(plugin);
	}
  });

  return htmls;
}

module.exports = createHTMLPlugin;
