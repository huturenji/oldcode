Component({
  data: {
    isIOS: false,
    selected: 0,
    list: [{
      text: "首页",
      pagePath: "/pages/index/index",
      iconPath: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/tabbar/btn_emq_tab_home_nor.svg",
      selectedIconPath: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/tabbar/btn_emq_tab_home_sel.svg",
    },
    {
      text: "分类",
      pagePath: "/pages/category/index",
      iconPath: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/tabbar/btn_tab_fuwuhui_nor1.svg",
      selectedIconPath: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/tabbar/btn_tab_fuwuhui_sel2.svg",
    },
    {
      text: "购物车",
      num: 0,
      pagePath: "/pages/cart/index",
      iconPath: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/tabbar/btn_tab_gouwuche_nor1.svg",
      selectedIconPath: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/tabbar/btn_tab_gouwuche_sel2.svg",
    },
    {
      text: "我的",
      pagePath: '/pages/mine/index',
      iconPath: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/tabbar/btn_emq_tab_wode_nor.svg',
      selectedIconPath: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/tabbar/btn_emq_tab_wode_sel.svg',
    }]
  },
  attached() {
    this.checkPlatForm();
  },
  methods: {
    checkPlatForm() {
      let systemInfo = wx.getSystemInfoSync();
      if (systemInfo.platform == 'ios') {
        this.setData({
          isIOS: true
        })
      } else {
        this.setData({
          isIOS: false
        })
      }
    },
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path;
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})