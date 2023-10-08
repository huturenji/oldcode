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
                  'modules': resolve('src/modules'),		  
                  'vuexStore': resolve('src/vuex'),
                  'thirdparty': resolve('src/thirdparty'),
                  'components': resolve('src/common/components'),
                  'libs': resolve('src/common/libs'),
                  'biscomponents': resolve('src/modules/common/components'),
                  'bislibs': resolve('src/modules/common/libs'),
                  'assets': resolve('src/themes/default/img'),
				  'styles': resolve('src/themes/default/styles/common'),
                  'approuter': resolve('src/route'),

                }
            }
        });
        return webpackConfig;
    });

}

