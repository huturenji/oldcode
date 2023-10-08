npm install webpack-spritesmith
1. 用logo里面的图片生成雪碧图，配置参考如下：
const SpritesmithPlugin = require('webpack-spritesmith')
new SpritesmithPlugin({
    // 目标小图标，这里就是你要生成的图片的目录
    src: {
        cwd: path.resolve(__dirname, './airlogo'),//这里是所有小图标的文件夹路径，比如在flight应用中就是 '../src/modules/airlogo/logo'
        glob: '*.png'
    },
    // 输出雪碧图文件及样式文件，这个是打包后，自动生成的雪碧图和样式，自己配置想生成去哪里就去哪里
    target: {
        image: path.resolve(__dirname, '../dist/sprites/airlogo.png'),
        css: path.resolve(__dirname, '../dist/sprites/sprite_airlogo.css')
    },
    // 样式文件中调用雪碧图地址写法
    apiOptions: {
        cssImageRef: './airlogo.png'
    },
    spritesmithOptions: {
        algorithm: 'top-down',
        retina: 2
    }
}),

2. 将sprite_airlogo.css改成less文件，并修改其中的样式：
    a. 所有大小除以@retina: 2
    b. 添加白色背景background.png
    [样例]
    .icon-CX {
        background-image: url(./airlogo.png), url(./background.png);
        background-position: 0px/@retina -421px/@retina;
        width: 34px/@retina;
        height: 34px/@retina;
        background-size: 100% auto;
        display: inline-block;
    }
