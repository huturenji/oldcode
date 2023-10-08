'use strict'

const path = require('path')
const config = require('./config')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')//webpack4被mini-css-extract-plugin替代
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const pkg = require('../package.json')
const ora = require('ora')
const chalk = require('chalk')
const webpack = require('webpack')
const rm = require('rimraf')


//提取所有的样式到一个文件中
exports.splitCssConfig = {
    name: 'style',
    test: /\.(s?css|less|vue)$/,
    // test:'/\.(s?css|vue)$/',
    // chunks: 'all',
    // test: m => m.constructor.name === 'CssModule',//判断所有的css
    // minChunks: 1,
    // priority: 30,
    enforce: true
}

/**
 * 拼接路径
 */
exports.assetsPath = function (_path) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory
    var prefStatic = process.env.BP_PREFSTATIC ? process.env.BP_PREFSTATIC+'/' : '';
    return path.posix.join(prefStatic+assetsSubDirectory, _path)
}

/**
 * cssloader 返回css文件相关loader
 */
exports.cssLoaders = function (options) {

    options = options || {}

    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    var postcssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    // 根据配置项生成loader generate loader string to be used with extract text plugin 
    function generateLoaders (loader, loaderOptions) {
        const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
        if (loader) {
            loaders.push({
            loader: loader + '-loader',
            options: Object.assign({}, loaderOptions, {
                sourceMap: options.sourceMap
            })
            })
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return [
                {
                    loader:miniCssExtractPlugin.loader,
                    options:{ // 默认使用 webpackOptions.output中的publicPath
                        publicPath: '../../'   //处理background路径不正确
                    }
                }
            ].concat(loaders);
        } else {
            return ['vue-style-loader'].concat(loaders)
        }
    }

    // 返回各种样式文件对应的loader
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less',Object.assign({javascriptEnabled: true},options.themeOptions.less)),
        sass: generateLoaders('sass', Object.assign({ indentedSyntax: true },options.themeOptions.sass)),
        scss: generateLoaders('sass',Object.assign({},options.themeOptions.scss)),
        stylus: generateLoaders('stylus',Object.assign({},options.themeOptions.stylus)),
        styl: generateLoaders('stylus',Object.assign({},options.themeOptions.styl))
    }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
    const output = []
    const loaders = exports.cssLoaders(options)
    for (const extension in loaders) {
        const loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }
    return output
}

/**
 * 调用原生的操作系统上发送通知的nodeJS模块，返回错误的函数
 */
exports.createNotifierCallback = function () {
  const notifier = require('node-notifier')
  return (severity, errors) => {
    console.log(`severity is ${severity}`)
    if (severity !== 'error') {
      return
    }
    const error = errors[0]

    const filename = error.file && error.file.split('!').pop()
    notifier.notify({
      title: pkg.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

/**
 * 根据文件路径生成md5值
 * @param {string} path 
 */
let readFileMd5 = (path)=>{
    let crypto = require('crypto')
    let fs = require('fs')
    return new Promise((res)=>{
        let crypto_md5 = crypto.createHash('md5')
        let stream = fs.createReadStream(path);
        stream.on('data',function(chunk){
            crypto_md5.update(chunk);
        });
        stream.on('end',function(){
            let fileMd5 = crypto_md5.digest('hex');
            res(fileMd5);
        });
    });
}
/**
 * 打包命令
 */
exports.buildWebpack = function(webpackConfig,config){
    const spinner = ora('building for production...')
    spinner.start()
    rm(config.build.assetsRoot, err => {
        if (err) throw err
        webpack(webpackConfig, function (err, stats) {
          spinner.stop()
          if (err) throw err
          process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
          }) + '\n\n')
      
          if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
            process.exit(1)
          }
      
          console.log(chalk.cyan('  Build complete.\n'))
          console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
          ))
          //生成md5值
          if(config.build.md5){
            console.log('md5 the tar ...')
              setTimeout(function(){
                var fs = require('fs')
                const glob = require('glob');
                console.log('tar path is '+ path.resolve(__dirname,'../'+config.build.tarDirectory, '*.tar'))
                let files = glob.sync(path.resolve(__dirname,'../'+config.build.tarDirectory, '*.tar'));
                files.forEach((file)=>{
                    console.log('file is '+file)
                    readFileMd5(file).then((md5Info)=>{
                        console.log('md5Info is ' + md5Info)
                        fs.writeFile(file+'.md5',md5Info,(error)=>{
                            if(error){
                                console.log('error is ' + error)
                            }
                            console.log('md5 the tar end')
                        });
                    });
                });
              },1000);
          }
        })
      })
}
