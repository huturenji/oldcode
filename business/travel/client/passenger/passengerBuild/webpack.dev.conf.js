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
                    'components': resolve('src/components'),
                    'themes': resolve('src/themes'),
                    'styles': resolve('src/platform/styles'),
                    'platform': resolve('src/platform'),

                }
            }
        });
        return webpackConfig;
    });

}

