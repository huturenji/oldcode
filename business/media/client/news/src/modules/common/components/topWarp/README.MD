
topWarp组件
本组件主要实现资讯置顶轮播功能 


本组件核心参数
swiperList：置顶资讯内容
isBorder：控制置顶资讯下面有行业信息时是否显示下边框
swiperNumber：置顶资讯显示的条数
swiperSpeed：置顶资讯轮播的速度
topNewsConfig：置顶资讯中置顶标签的显隐


事件
that.$emit('stopTopMescrollDown') 置顶轮播向下滑动阻止下拉刷新
that.$emit('startTopMescrollDown') 置顶轮播向下滑动结束开始触发下拉刷新