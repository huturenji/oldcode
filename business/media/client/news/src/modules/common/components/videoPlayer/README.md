
videoPlay视频组件

##组件使用说明
1.组件功能：播放视频，并且提供播放、暂停、静音、修改播放进度、重播、全屏等功能；

2.options
    videoSrc：视频地址，推荐mp4
    videoDefaultImg：视频未开始播放时显示的图片，宽高比例需要和视频一致
    title：在视频内顶部显示title，不传则不显示
    volume：音量
    autoplay：是否自动播放true/false 默认false
    loop：是否循环播放true/false 默认false
    muted：是否静音true/false 默认false
    preload：是否预加载，如启用autoplay则此项设置无效true/false 默认false
    width：视频宽度，默认100%
    height：视频高度，默认auto

3.function
    globalBus.$emit('videoPlayTypeUpdata','')，全局视频关闭，第二个参数为需要继续播放的视频videoSrc，例如跳转、切换tab时关闭正在播放的视频
    that.$emit('play','')，播放事件
    that.$emit('pause','')，暂停事件