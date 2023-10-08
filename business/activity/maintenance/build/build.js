/*
 * @Descripttion: webpack build 命令入口，依赖webpack.prod.conf.js
 * @version: 
 * @Author: yg
 * @Date: 2020-05-29 18:11:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-10-30 10:52:05
 */

'use strict'
require('./check-versions')()//检查node与webpack版本

process.env.NODE_ENV = 'production'//环境为production

const config = require('./config')
const webpackConfig = require('./webpack.prod.conf')
const utils = require('./utils')

utils.buildWebpack(webpackConfig,config)