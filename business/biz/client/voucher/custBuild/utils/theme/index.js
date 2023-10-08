'use strict'
const fs = require('fs');
const path = require('path')
const themeConfig = require('./config');
var webpack = require('webpack');

const resolveToThemeStaticPath = fileName => path.resolve(themeConfig.THEME_DIR, fileName);
const themeFileNameSet = fs.readdirSync(path.resolve(themeConfig.THEME_DIR)).filter(filePath => filePath!='default' && fs.statSync(path.resolve(themeConfig.THEME_DIR, filePath)).isDirectory());

function recursiveIssuer(m) {
    if (m.issuer) {
      return recursiveIssuer(m.issuer);
    } else if (m.name) {
      return m.name;
    } else {
      return false;
    }
}

function themeHandler(config){
    if(!fs.existsSync(themeConfig.ENTRY)){
        return config;
    }   
    let themeEntry = {}//样式打包入口
    let themeSplit = {}//样式打包配置
    themeFileNameSet.forEach(item=>{
        let entryName = `${themeConfig.PRE_ENTRY}/${item}`;
        themeEntry[entryName] = path.resolve(resolveToThemeStaticPath(item),`${themeConfig.ENTRY_FIX}`)
        themeSplit[`${item}Styles`] = {
            name: `${entryName}`,
            test: (m,c,entry = `${entryName}`) => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
            chunks: 'all',
            enforce: true,
        }
    });
    Object.assign(config.entry,themeEntry); //合并打包入口
    Object.assign(config.optimization.splitChunks.cacheGroups,themeSplit);//合并split配置

    let plugins = config.plugins;
    config.plugins = plugins.concat([
        //定义业务变量
        new webpack.DefinePlugin({
            'themeConfig': JSON.stringify({
                path:themeConfig.THEME_PATH
            })
        }),
    ])
    return config;
}

module.exports = themeHandler;