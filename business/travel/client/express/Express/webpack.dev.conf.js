'use strict'
const path = require('path')
const merge = require('webpack-merge')
const devWebpackConfig = require('../build/webpack.dev.conf')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
  }


module.exports = ()=>{
    return devWebpackConfig().then((conf)=>{
        return merge(conf,{
            resolve:{
                alias:{
                    'components': resolve('src/components/BIS-Components'),
                }
            }
        });
    });

}

