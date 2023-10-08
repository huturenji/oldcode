
tabBar组件
最后更新日期：2022-4-27
作者：xioawe

##组件使用说明
1.组件功能简介：提供全局tabbar、支持动态设置style、item、红点、红点数字、显隐等等；

2.options
    无，使用install()方法初始化，目前不开放外部传参

3.输出
    window.tabbar对象，可直接调用相关方法
    window.tabBarHeight，tabbar组件高度，number 单位px
    --tabBarHeight，css变量，tabbar组件高度

4.function
    install(),组件初始化，调用后组件从渠道获取对应设置的数据并进行初始化；
    updateTabbar(),更新组件状态，例如切换路由后更新active状态；
    visiable(Blooean),控制组件显隐，入参为Blooean  ;
    setTabBarStyle(obj)，设置tabbar的样式，入参为obj，支持以下参数，入参均为string
        color:'#222222',
        selectedColor:'#f30300',
        fontSize:'12px',
        backgroundColor:'#f7f7fa',
        spacing:'-3px',
        height:'54px'
    
    setTabBarItem(obj)，设置tabbar item的样式，入参为obj，支持以下参数，入参index为number必填，visible为Blooean，其他均为string
        index:0
        pagePath:'/pages/tabbar/tabbar-index-3',
        text:'资讯',
        iconPath:'./static/tab-bar/btn_tab_zixun_def.svg',
        selectedIconPath:'./static/tab-bar/btn_tab_zixun_sel.svg',
        visible:true,
        iconWidth:'30px',
        iconHeight:'30px'

    setTabBarBadge(obj),显示红点数字,入参index为number必填,如text未传则只显示红点效果
        index:0
        text:'5'

    removeTabBarBadge(obj)，移除红点数字，入参index为number必填
        index:0
    
    showTabBarRedDot(obj)，显示红点，入参index为number必填
        index:0

    hideTabBarRedDot(obj)，移除红点，入参index为number必填
        index:0
    
    getTabbarItem()，获取当前路由页面对应的tabbar item数据，提供给业务侧调用，返回值为
        {
            pagePath:'/pages/tabbar/tabbar-index-3',
            text:'资讯',
            iconPath:'./static/tab-bar/btn_tab_zixun_def.svg',
            selectedIconPath:'./static/tab-bar/btn_tab_zixun_sel.svg',
            visible:true,
            iconWidth:'30px',
            iconHeight:'30px'
        }
