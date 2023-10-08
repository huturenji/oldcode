/*
 * @Descripttion: 雪碧图打包命令
 * @version: 
 * @Author: yg
 * @Date: 2020-10-13 09:16:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-10-27 16:23:09
 */
'use strict'
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const getDirName = require('path').dirname
const SpritesmithPlugin = require('webpack-spritesmith')
const config = require('./config')

var spriteArr = [];//接受所有图片的名称数组
var jsonFilePath = path.join(config.build.assetsRoot,'sprites/airLogoSprite.json');//文件名的集合文件
var cwdPath = path.resolve(__dirname, '../src/components/airlogo/logo');//打包sprite图的源图片地址，打包命令根据实际情况修改该路径
var globFormat = '*.png';//打包sprite图的源文件格式
var targetImg = path.join(config.build.assetsRoot,'sprites/airlogo.png');//生成的sprite图片，打包命令根据实际情况修改该路径
var targetCssPath = path.join(config.build.assetsRoot,'sprites/sprite_airlogo.less');//生成的sprite对应的样式文件，打包命令根据实际情况修改该路径
var cssImageRef = './airlogo.png';// 样式文件中调用雪碧图地址写法
/**
 * 打包sprite图片的模板函数，需要根据实际打包情况进行修改
 * @param {*} data 图片数据
 */
var templateFunction = function (data) {
    var shared = 
    `@retina: 2;
    .icon { 
        background-image: url(I), url(./background.png) ;
        background-size: 100% auto;
        display: inline-block;
    }`.replace('I', data.sprites[0].image)
  
    var perSprite = data.sprites.map(function (sprite) {
        spriteArr.push(sprite.name);
      return `.icon-NAME { 
            .icon();
            width: W-Hpx/@retina; 
            height: H-Tpx/@retina; 
            background-position: X-POSpx/@retina Y-POSpx/@retina; 
        }`
        .replace('NAME', sprite.name)
        .replace('W-H', sprite.width)
        .replace('H-T', sprite.height)
        .replace('X-POS', sprite.offset_x)
        .replace('Y-POS', sprite.offset_y);
    }).join('\n');

    //写入所有logo的文件名，生成json文件
    writeFile(jsonFilePath,JSON.stringify(spriteArr),(err)=>{
        console.log(err)
    });
    return shared + '\n' + perSprite;
};

/**
 * 写入文件，如果路径不存在则创建对应的路径
 * @param {string} path   路径
 * @param {string} contents 内容
 * @param {function} cb 回调函数
 */
function writeFile (path, contents, cb) {
    mkdirp(getDirName(path), function (err) {
      if (err) return cb(err)
      fs.writeFile(path, contents, cb)
    }) 
}

//打包配置
module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: 'index.js',
    output: {
        filename: '[name].js'
    },
    resolve: {
        extensions: ['*', '.js', '.vue', '.css', '.scss', '.less', '.json'],
    },
    module: {
    },
    plugins: [
        new SpritesmithPlugin({
            // 目标小图标，这里就是你要生成的图片的目录
            src: {
                cwd: cwdPath,//这里是所有小图标的文件夹路径，比如在flight应用中就是 '../src/modules/airlogo/logo'
                glob: globFormat
            },
            // 输出雪碧图文件及样式文件，这个是打包后，自动生成的雪碧图和样式，自己配置想生成去哪里就去哪里
            target: {
                image: targetImg,
                css: [
                    [targetCssPath,{
                        // 引用自己的模板
                        format: 'function_based_template'
                    }]
                ]
            },
            // 样式文件中调用雪碧图地址写法
            apiOptions: {
                cssImageRef: cssImageRef
            },
            // 自定义模板入口，我们需要基本的修改webapck生成的样式，上面的大函数就是我们修改的模板
            customTemplates: {
                'function_based_template': templateFunction,
            },
            spritesmithOptions: {
                algorithm: 'top-down',
                retina: 2
            }
        })
    ]
}