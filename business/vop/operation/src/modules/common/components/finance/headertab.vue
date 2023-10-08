<template>
    <div
        class="header_tab"
        :class="tabLevelRoot == '0' ? 'topTabBg' : ''"
        v-if="tabList.length && isShowTab"
    >
        <li
            class="header_tab_item"
            v-for="(item, index) in tabList"
            :key="index"
        >
            <router-link
                :to="{ path: item.path }"
                :class="[item.tabIndex === tabIndex ? 'islink-active' : '']"
            >{{ item.name }}</router-link>
        </li>
    </div>
</template>

<script>
export default {
    props: {
    //同一层级所有的tab的父节点
        tabLevelRoot: {
            type: String,
            default: "0" //默认0是顶级目录跟节点
        },
        isShowTab: {
            type: Boolean,
            default: true
        },
        tabIndex: {
            type: String,
            default: '1'
        }
    },
    components: {},
    data() {
        return {
            tabList: []
        };
    },
    computed: {},
    created() {
    // console.log("tabLevelRoot="+this.tabLevelRoot)
        this.initTabs();
    },
    mounted() {},
    methods: {
        initTabs() {
            this.tabList = [
                {
                    path: '/finance/invoice/toinvoicedlist',
                    tabIndex: '1',
                    name: "开票申请"
                },
                {
                    path: '/finance/invoice/invoicelist',
                    tabIndex: '2',
                    name: "开票查询"
                }
            ]
        },
        //是否是同一个分支的节点，包括相等和属于父节点
        isOneBranchTab(itemFlag, activeFlag) {
            let result = false;
            let itemFlags = itemFlag.split("-");
            let activeFlags = activeFlag.split("-");
            if (
                activeFlag.indexOf(itemFlag) == 0 &&
        activeFlags.length >= itemFlags.length
            ) {
                result = true;
            }

            return result;
        },
        isOneTabLevel(activeFlag, tabLevel) {
            // 
            let result = false;
            let activeFlags = activeFlag.split("-");
            let tabLevels = tabLevel.split("-");
            //顶级目录，并且activeFlag只有一层
            if (activeFlags.length == 1 && tabLevel == "0") {
                result = true;
            } else if (
                tabLevel != "0" &&
        activeFlags.length > 1 &&
        activeFlag.indexOf(tabLevel + "-") == 0 &&
        tabLevels.length + 1 == activeFlags.length
            ) {
                result = true;
            }

            return result;
        }
    }
};
</script>

<style scoped lang="less">
.header_tab {
  list-style: none;
  display: flex;
  // min-width: 1280px;
  // max-width: 1280px;
  margin: 0 auto;
  background-color: #fff;
  padding-top: 12px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: 1px solid #eeeeee;

  &_item {
    list-style: none;
    padding: 0 12px 12px;
    margin-left: 32px;
    position: relative;

    .router-link-exact-active {
      &.router-link-active {
        color: #478aee;

        &::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 3px;
          background-color: #478aee;
        }
      }
    }

    .islink-active {
      color: #478aee;
      font-weight: bold;
      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 3px;
        background-color: #478aee;
      }
    }
  }
}
.topTabBg {
  background-color: #f4f4f4;
}
</style>

