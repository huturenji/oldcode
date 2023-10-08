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
        let webpackConfig = merge(custUtils.themeHandler(conf),{
            resolve:{
                alias:{
                    'componentx':resolve('src/components/SWP-Components/'),
                    'components': resolve('src/components/BIS-Components'),
                    'biscomponents': resolve('src/components/SWP-Components/bisComponents'),
                    'mallStyles': resolve('src/mallStyles'),
                    'commonComp': resolve('src/modules/mall/common/components'),
                    'common': resolve('src/modules/mall/common'),
                    'view': resolve('src/modules/mall/views/'),
                    'skeleton': resolve('src/modules/mall/skeleton'),
                }
            }
        });
        return webpackConfig;
    });

}

