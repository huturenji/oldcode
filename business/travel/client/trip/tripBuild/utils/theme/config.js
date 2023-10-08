module.exports = {
    ENTRY: './src/themes/index.js', //主题打包入口
    PRE_ENTRY:'theme',//打包入口前缀，用来生成带有theme文件夹
    ENTRY_FIX:'./styles/index.less',
    THEME_DIR: './src/themes',//源码路径
    THEME_PATH: './static/css/theme',//编译后路径
    PATH: `../static/css/theme`//访问路径
}