'use strict'
const fs = require('fs');
const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackHandleCssInjectPlugin = require('./HtmlWebpackHandleCssInjectPlugin');
const themeConfig = require('./config');
var webpack = require('webpack');

const resolveToThemeStaticPath = fileName => path.resolve(themeConfig.THEME_DIR, fileName);
const themeFileNameSet = fs.readdirSync(path.resolve(themeConfig.THEME_DIR)).filter(filePath => filePath!='default' && fs.statSync(path.resolve(themeConfig.THEME_DIR, filePath)).isDirectory());
const themePaths = themeFileNameSet.map(resolveToThemeStaticPath);
const getThemeName = fileName => `${themeConfig.THEME_PATH}/${path.basename(fileName, path.extname(fileName))}`;
// 全部 ExtractLessS 的集合                                                                                                              
const themesExtractLessSet = themeFileNameSet.map(fileName => new MiniCssExtractPlugin({filename: `${getThemeName(fileName)}.css`}))
// 主题 Loader 的集合
const themeLoaderSet = themeFileNameSet.map((fileName, index) => {
  return {
    test: /\.(less|css)$/,
    include: resolveToThemeStaticPath(fileName),
    loader: themesExtractLessSet[index].loader,
  }
});

function themeHandler(config){
    if(!fs.existsSync(themeConfig.ENTRY)){
        return config;
    }   
    //处理loader，将主题源码排除在外
    let rules = config.module.rules;
    rules = !!rules ? rules.map(rule=>{
        let ruleStr = rule.test.toString();
        if(/\Wcss\W*/.test(ruleStr) || /\Wless\W*/.test(ruleStr)){
            rule.exclude = themePaths;
        }
        return rule;
    }) : rules;
    //追加专门处理主题样式的loader
    config.module.rules = rules.concat(themeLoaderSet);
    config.entry.themes = themeConfig.ENTRY

    let plugins = config.plugins;
    config.plugins = plugins.concat([
        //将主题样式单独打包
        ...themesExtractLessSet,
        //将主题的css文件从html中删除
        new HtmlWebpackHandleCssInjectPlugin({
            filter: (filePath) => {
                //过滤theme的样式
                return !filePath.includes(themeConfig.THEME_PATH);
            }
        }),
        //定义业务变量
        new webpack.DefinePlugin({
            'themePath': `'${themeConfig.PATH}'`
        }),
    ])
    return config;
}

module.exports = themeHandler;