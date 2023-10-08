<template>
    <div
        class="channelMgrContentBox"
        id="channelMgr"
    >
        <div 
            v-if="seeAuth" 
            class="channelMgrContent"
        >
            <div class="channelMgrSearch">
               
                <el-input 
                    style="width:280px"
                    v-model.trim="searchKeys" 
                    clearable
                    @keyup.enter.native="queryChenelList(searchKeys)"
                    placeholder="请输入渠道简称"
                >
                    <template slot="append">
                        <el-button 
                            :loading="loads"
                            icon="el-icon-search"
                            @click.native="queryChenelList(searchKeys)"
                        >
                        </el-button>
                    </template>
                </el-input>
            </div>
            <div class="addChannel">
                <el-button 
                    type="primary" 
                    @click="channelDetail('add',{},'parent')"
                >
                    +新建
                </el-button>
            </div>
            <div class="channelList">
                <el-table
                    
                    stripe
                    :data="listChannelInfos"
                    :highlight-current-row="true"
                    :header-cell-style="{background:'#f2f2f2',padding: '6px 0',color:'#666666'}"
                    style="width: 100%;border: 1px solid #EBEEF5;border-bottom:0;border-radius: 8px;color:#333333"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    :row-key="row => { return `${row.platformId}${row.channelId}` }"
                >
                    <el-table-column
                        prop="platformId"
                        label="平台ID"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="channelId"
                        label="渠道ID"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="identifier"
                        label="店铺标识"
                    >
                    </el-table-column>                    
                    <el-table-column
                        prop="shortName"
                        label="渠道简称"
                    >
                    </el-table-column>
                    <el-table-column
                        prop=""
                        label="操作"
                        width="160"
                    >
                        <template slot-scope="scope">
                            <el-button 
                                v-if="seeAuth&&scope.row.platformId"
                                @click="channelDetail('add',scope.row,'children')" 
                                type="text" 
                            >新增子渠道</el-button>
                            <el-button 
                                v-if="seeAuth"
                                @click="channelDetail('detail',scope.row,scope.row.platformId?'parent':'children')" 
                                type="text" 
                            >详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                
  
                <div 
                    class="pagingBox" 
                    v-show="totalNum>0"
                >
                    <el-pagination
                        background
                        @size-change="pSizeChange"
                        @current-change="changePage"
                        :current-page="currentPage"
                        :page-sizes="pageSizeOpts"
                        :page-size="pageSize"
                        layout="total, prev, pager, next, jumper,sizes"
                        :total="totalNum"
                    >
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog
            :visible.sync="hasAuth"
            :close-on-click-modal="false" 
            :show-close="false"
            customClass="noAuth"
            width="485px"
            center
        >
            <div 
                slot="title" 
                class="header-title"
            >
                <span class="confirmTitle">权限确认</span>
                <span
                    class="cancelBtn"
                    @click="hasAuth=false"
                >×</span>
            </div>
            <div class="inconContent">
                <p>暂无使用权限，如有需要请联系管理员开通</p>
            </div>
            <div 
                slot="footer" 
                class="dialog-footer"
            >
                <el-button 
                    type="primary" 
                    @click="hasAuth=false"
                >我知道了</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
import channelHandler from "bislibs/requestHandler/channelhandler";
import permissionManager from 'bislibs/permissionhandler/eventlistenerhandler';
import utils from "bislibs/utils";

export default {
    components: {},
    data() {
        return {
            loads: false,
            spStatus: "", //搜索状态条件
            switch1: false,
            pageSize: 20,
            currentPage: 1,
            totalNum: 0,
            hasAuth: false,
            seeAuth: false,

            pageSizeOpts: [5, 10, 20, 50, 100],
            listChannelInfos: [], //渠道信息列表
            searchKeys: '', //搜索关键字
            channelId: "",
            channelStatus: "",
            flag: false //避免created和activated都会触发请求
        };
    },
    beforeCreate() {},
    created() {
        this.seeAuth = permissionManager.hasAuth("channelmgr")
        if (this.seeAuth) {
            this.getListChannelInfos();
        } else {
            this.hasAuth = true;
        }
    },
    mounted() {
        let _this = this;
        this.flag = true;
        _this.calHeight(); //动态计算页面高度的方法
        window.onresize = function() {
            _this.calHeight();
        };
    },
    activated() {
        if (!this.flag) {
            this.getListChannelInfos();
        }
    },
    deactivated() {
        this.flag = false;
    },

    methods: {
        // 模糊检索查询列表
        queryChenelList() {
            this.currentPage = 1;
            this.loads = true;
            this.getListChannelInfos();
        },
        // 新建/查看详情  channelType 代表父还是子 parent  children
        channelDetail: function(val, res, channelType) {
            if (val !== "add") {
                utils.setSession("info", JSON.stringify(res));
                this.$router.push({
                    path: "/channeldetail",
                    query: { channelType }
                });
            } else {
                this.$router.push({
                    path: "/addChannel",
                    query: { channelType,platformId:res.platformId }
                });
            }
        },
        // 查询渠道接入信息列表
        getListChannelInfos: function() {
            var json = {
                shortName: this.searchKeys,
                pageNum: this.currentPage,
                pageSize: this.pageSize
            };
            channelHandler.listChannel(json).then(result => {
                this.loads = false;
                if (!!result && result.resultCode == 0) {
                    this.listChannelInfos = result.result.paltformVoList||[];
                    this.totalNum = result.result.total;
                }
            }).catch(error=>{
                this.loads = false;
                console.error(error)
            });
        },

        //页码变化
        changePage: function(page) {
            var _this = this;
            _this.currentPage = page;
            _this.getListChannelInfos();
        },
        //每页显示条数变化
        pSizeChange: function(pSize) {
            var _this = this;
            _this.pageSize = pSize;
            _this.currentPage = 1;
            _this.getListChannelInfos();
        },
        calHeight() {
            //获取当前页面可是区域  减掉头部 面包屑 底部margin
            var clientHeight = document.documentElement.clientHeight;
            var domHeight = clientHeight - 48 - 61 - 24;
            domHeight = domHeight > 500 ? domHeight : 500;
            // 白色卡片减去搜索   内外边距  表格头部   分页组件的高夫
            var tabelMaxHeight = domHeight - 56 - 36 - 64 - 36 - 56;
            $("#channelMgr .el-table__body-wrapper").css({
                "max-height": tabelMaxHeight + "px",
                "overflow-y": "auto"
            });
            $("#channelMgr").css("height", domHeight + "px");
        }
    },
    filters: {},
    watch: {}
};
</script>
<style lang="less" scoped>
.channelMgrContentBox {
    font-size: 14px;
    background-color: #fff;
    margin-bottom: 24px;
    border-radius: 8px;

    .channelMgrHeader {
        background-color: #fff;
        padding-left: 30px;
        height: 97px;
        .headerTop {
            line-height: 55px;
        }
        .headerName {
            font-size: 20px;
            font-weight: bold;
            color: #272727;
            display: flex;
            align-items: center;
        }
    }
    .channelMgrContent {
        padding: 24px;

        .addChannel {
            display: flex;
            justify-content: flex-end;
            padding: 16px 56px 16px 0;
            background-color: #fff;
        }
    }
    .channelList {
        display: flex;
        flex-direction: column;
        .channelListTbodyBox {
            margin-bottom: 100px;
        }
        .channelListTheader,
        .channelListTbody {
            display: flex;
            li {
                font-size: 14px;
                padding: 0 20px;
            }
            .channelName {
                width: 200px;
                span {
                    padding: 0 20px;
                }
            }
            .payment {
                width: 420px;
            }
            .channelStatus {
                width: 130px;
            }
            .channelHandle {
                flex: 1;
                text-align: center;
                justify-content: center;
                span {
                    cursor: pointer;
                    color: #1890ff;
                }
            }
        }
        .channelListTheader {
            height: 50px;
            line-height: 50px;
            background-color: #f8f8f9;
            border: 1px solid #dddeee;
            margin: 0 0 -1px 0;
            font-weight: bold;
        }
    }
    .pagingBox {
        padding-top: 24px;
        text-align: right;
    }
}
.showicon {
    overflow: hidden; /*超出不显示*/
    text-overflow: ellipsis; /* 超出内容显示为省略号*/
    white-space: nowrap;
}
</style>
<style lang="less">
.channelMgrContentBox {
    li span {
        margin-left: 0;
    }
    .el-table td {
        border-bottom: 0;
        padding: 4px 0;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #478aee;
    }
    .el-table {
        -ms-flex: none !important;
        flex: none !important;
        height: max-content;
        .el-button--text {
            color: #478aee;
        }
    }
    .el-pagination {
        padding: 2px 46px;
    }
}
.channelMgrSearch {
    padding-left: 32px;
    .el-input__inner {
        border-bottom-left-radius: 8px;
        border-top-left-radius: 8px;
    }
    .el-input-group__append {
        border-bottom-right-radius: 8px;
        border-top-right-radius: 8px;
        color: #fff;
        background-color: #478aee;
        border: 1px solid #478aee;
        &:hover {
            opacity: 0.8;
        }
    }
    .el-button {
        width: 41px;
        padding: 12px 10px;
    }
    .el-input__inner {
        height: 36px;
        line-height: 36px;
    }
}
.addChannel {
    .el-button {
        height: 32px;
        padding: 8px 24px;
        background-color: #478aee;
        border-color: #478aee;
        border-radius: 6px;
        font-size: 12px;

        &:hover {
            opacity: 0.8;
        }
    }
}
</style>