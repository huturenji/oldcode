'use strict'
const path = require('path')
process.env.NODE_ENV = 'development'
const {merge} = require('webpack-merge')
const devWebpackConfig = require('../build/webpack.dev.conf')
const custUtils = require('./utils');
function resolve(dir) {
    return path.join(__dirname, '..', dir)
  }


module.exports = ()=>{
    return devWebpackConfig().then((conf)=>{
        let webpackConfig =  merge(custUtils.themeHandler(conf),{
            resolve:{
                alias:{
                    'platform': resolve('src/platform'),
                    'styles': resolve('src/platform/styles'),
                    'components': resolve('src/components'),
                    'custCommon': resolve('src/modules/common'),
                    'custComp': resolve('src/modules/common/components'),
                }
            }
        });
        return webpackConfig;
    });

}

