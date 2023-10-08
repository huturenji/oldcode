const path = require('path')
module.exports = {
  parser: require('postcss-comment'),
  plugins: [
    require('postcss-import')({
      resolve (id, basedir, importOptions) {
        if (id.startsWith('~@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(3))
        } else if (id.startsWith('@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(2))
        } else if (id.startsWith('/') && !id.startsWith('//')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(1))
        }
        return id
      }
    }),
    require('autoprefixer')({
      remove: process.env.UNI_PLATFORM !== 'h5'
    }),
    require('postcss-px-to-viewport')({
      unitToConvert: 'rpx', // 需要转换的单位,默认是'px'
      viewportWidth: 750,// 视窗的宽度，对应的是我们设计稿的宽度，转换比例为10000/viewportWidth
      unitPrecision: 5,// 指定`px`转换为视窗单位值的小数位数
      propList: ['font-size'],//指定可以转换的css属性，默认是['*']，代表全部属性进行转换精确匹配* 代表全部属性,在字符串前面或者后面用*，如 ['*position*'] 会匹配background-position-y用！则该属性排除. 如: ['*', '!letter-spacing']
      viewportUnit: 'vw', // 需要转成的单位，针对所有属性，默认vw
      fontViewportUnit: 'vw', // 字体需要转成的单位，只针对 font-size 属性
      selectorBlackList: ['fontScaleIgnore'],// 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: false,// 允许在媒体查询中转换`px`
      replace: true,//替换包含vw的规则，而不是添加回退
      exclude: undefined,//(Array or Regexp) 设置忽略文件，如node_modules如果是regexp, 忽略全部匹配文件.如果是数组array, 忽略指定文件.  在非H5平台上忽略src下面的该功能
      include: undefined,
      landscape: false
    }),
    require('@dcloudio/vue-cli-plugin-uni/packages/postcss'),
  ]
}
