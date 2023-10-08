'use strict'
const path = require('path')
const {merge} = require('webpack-merge')
const devWebpackConfig = require('../build/webpack.dev.conf')
const custUtils = require('./utils');
const config = require('../build/config')
const CopyWebpackPlugin = require('copy-webpack-plugin')
function resolve(dir) {
    return path.join(__dirname, '..', dir)
  }


module.exports = ()=>{
    return devWebpackConfig().then((conf)=>{
        //copy 代码 中转页拷贝到指定目录
        conf.plugins.push(new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../src/modules/pages'),
            to: path.join(config.build.assetsRoot,'pages'),
        }]));      

        let webpackConfig =  merge(custUtils.themeHandler(conf),{
            resolve:{
                alias:{
                  'modules': resolve('src/modules'),		  
                  'vuexStore': resolve('src/vuex'),
				  'thirdparty': resolve('src/thirdparty'),
                  'libs': resolve('src/common/libs'),
                  'components': resolve('src/common/components'),
                  'assets': resolve('src/themes/default/img'),
				  'styles': resolve('src/themes/default/styles/base'),
                  'bislibs': resolve('src/modules/common/libs'),
                  'biscomponents': resolve('src/modules/common/components'),
                  'route': resolve('src/route'),
                }
            }
        });
        return webpackConfig;
    });

}

