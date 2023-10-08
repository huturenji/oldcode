'use strict'
const path = require('path')
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
                    'newsStyles': resolve('src/newsStyles'),
                    'commonComp': resolve('src/modules/common/components'),
                    'common': resolve('src/modules/common'),
                    'views': resolve('src/modules/views/'),
                    'skeleton': resolve('src/modules/skeleton'),
                    'thirdparty': resolve('src/thirdparty'),
                    'store': resolve('src/modules/common/states/store')
                }
            }
        });
        return webpackConfig;
    });

}

