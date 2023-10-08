
newsItem组件

##组件使用说明
1.组件功能：展示单条资讯在列表中的样式，并提供点击跳转资讯详情、触发屏蔽和举报操作、对于视频类资讯展示点赞、点踩、收藏、分享、更多操作等功能。

2.options
    newsItem：资讯item对象，必须传入posAndSize，否则位置和箭头样式不正确
    listItemConfig：资讯展示形态，listItemConfig.showIgoreBtn是否展示x按钮，默认不展示，listItemConfig.videoType，preview/detail，默认形态，视频频道详情形态
    showCheck：是否是编辑勾选状态，true/false，收藏等列表可进行勾选后批量删除操作
    keyword：title高亮关键字，只在listItemConfig.videoType为preview时生效

3.事件 
    globalBus.$emit('ignorePopupShow',this.newsInfo)，通知父组件打开屏蔽举报界面，需要传入posAndSize数据
    globalBus.$emit(type,this.newsInfo)，listItemConfig.videoType为detail时的触发的动作share 、more