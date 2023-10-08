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

/**
 * ① 设置环境为开发production，供整个编译打包时使用该变量，该设置仅在项目运行命令直接运行webapack.dev.conf.js文件时生效；例如：cross-env BP_ENV=Dev BP_APPNAME=hotel BP_PREHTML=modules BP_VERSION=2.0.1 node build.js
 *  如果webapack.dev.conf.js文件外，则需要在对应的最外层运行文件中添加对应的变量声明，现有项目结构中，一般是在对应项目的webpack.dev.conf.js中声明，
 *  例如，运行的命令为：cross-env BP_ENV=Dev BP_APPNAME=hotel BP_PREHTML=modules BP_VERSION=2.0.1 node hotelBuild/build.js，则需要在hotelBuild下的webpack.dev.conf.js文件中声明
 *  或者直接在运行命令中新增 NODE_ENV=production
 *  ② process.env.NODE_ENV = 'production'设置方法与webpack.DefinePlugin不同，webpack.DefinePlugin插件是编译时定义了全局的变量，在运行业务代码时直接使用该变量；
 *  webpack4设置mode之后，process.env.NODE_ENV的值根据mode设置的值变化，例如设置了mode:production，则在运行的js中获取到的process.env.NODE_ENV 值为production
 */
process.env.NODE_ENV = 'production'

const config = require('./config')
const webpackConfig = require('./webpack.prod.conf')
const utils = require('./utils')

utils.buildWebpack(webpackConfig,config)