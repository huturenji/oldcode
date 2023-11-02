<script>
import { menuhome, eventlistenerhandler } from "opcl";
import menuList from "bislibs/menu/menu";
//用户自己把本地图片import进来，赋值到需要使用的变量里面。
import icondel from "assets/del.png";
console.log(menuhome);
export default {
  extends: menuhome,
  data() {
    return {
      userDropDownList: ["用户信息"],
      breadcrumbFirst: [],
      iconhttp:
        "https://img11.360buyimg.com/n5/jfs/t1/25653/16/16255/100946/62749046E33a7ddbc/0ba094922202d5c2.jpg.avif",
      //组件的主题，有2种  dark （黑）、primary（蓝），默认 primary
      // theme: "dark",
      // websitelogo: icondel,
      // sitename: iconnav,
      nomenutop: true,
    };
  },
  created() {
    this.sitename = "B+商云运营平台";
    this.menuTitle = "商云管理";
    this.pageRootPath = "/";

    // console.log("sitename=" + this.sitename);
  },
  mounted() {
    //全局监听事件
    eventlistenerhandler.addEventListenerGlobal(this);
  },
  methods: {
    //获取我的所有的菜单项，子类继承自己实现。全量的菜单，数据来源于项目的配置文件menu.json
    getMyAllMenus() {
      console.log("getMyAllMenus");
      let allmenu = Object.create(menuList).menu;
      //图标的icon的设置方式分为2类。一类是本地图片，使用方法参考icondel。一类是 在线图片，使用方法参考 iconhttp
      // allmenu.forEach((element) => {
      //   if (element.name == "渠道管理") {
      //     element.icon = this.iconhttp;
      //   } else {
      //     element.icon = icondel;
      //   }
      // });
      return allmenu;
    },
    /**
     * 复写 initMenuList 方法，可以绕过 权限码检验。默认的 菜单是需要 校验码 过滤的。
     */
    // initMenuList() {
      //获取本地配置的所有的菜单组件
      // this.homeMenuList = this.getMyAllMenus();
    // },    
    /**
     * 右上角的菜单下拉被点击的事件
     */
    onDropMenuClick(name) {
      //修改密码的事件
      if (name == this.userDropDownList[0]) {
        // this.$router.push({ path: this.path_modifypwd });
        // } else if (name == this.userDropDownList[1]) {
        //   //服务协议的事件
        //   this.$router.push({ path: this.path_serviceAgreement });
      }
    },       
  },
};
</script>
<style lang="less">
//二次确认公共样式
.el-dialog__wrapper {
  .noAuth {
    border-radius: 8px;
    .el-dialog__header {
      overflow: hidden;
      padding: 0;
      border-bottom: 1px solid #efefef;
      .header-title {
        position: relative;
        .confirmTitle {
          font-size: 16px;
          color: #333;
          font-weight: bold;
          line-height: 56px;
        }
        .cancelBtn {
          position: absolute;
          right: 15px;
          top: 6px;
          font-size: 24px;
          color: #999;
          cursor: pointer;
        }
        .cancelBtn:hover {
          color: #409eff;
        }
      }
    }
    .el-dialog__body {
      padding: 32px 25px;
      color: #333;
      .inconContent {
        p {
          font-size: 16px;
          text-align: center;
        }
      }
    }
    .el-dialog__footer {
      padding: 0 20px 48px;
      .el-button {
        width: 144px;
        height: 48px;
        border-radius: 8px;
        &:hover {
          background-color: #478aee;
          border: 1px solid #478aee;
          opacity: 0.8;
        }
      }
      .el-button--primary {
        background-color: #478aee;
        border: 1px solid #478aee;
      }
      .el-button--default {
        color: #fff;
        background-color: #c2c2c2;
        border: 1px solid #c2c2c2;
      }
    }
  }
}
</style>