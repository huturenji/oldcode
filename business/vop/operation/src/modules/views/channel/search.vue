<template>
    <div 
        class="channelMgrContentBox" 
        id="channelBox"
    >
        <div 
            v-if="seeAuth" 
            class="channelMgrContent"
        >
            <div class="channelMgrSearch">
               
                <el-input 
                    style="width:280px;margin-bottom:15px"
                    v-model.trim="searchKeys" 
                    clearable
                    @keyup.enter.native="queryChenelList(searchKeys)"
                    placeholder="渠道简称"
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
                        prop="shortName"
                        label="渠道"
                        width="300"
                    >
                        <template slot-scope="scope">
                            <img 
                                v-if="scope.row.logo && scope.row.imgtype "
                                style="vertical-align: middle;width:48px;height:48px;border-radius: 4px;"
                                :src="scope.row.logo" 
                                alt=""
                            >
                            <img 
                                v-if="scope.row.logo && !scope.row.imgtype"
                                style="vertical-align: middle;width:48px;height:48px;border-radius: 4px;"
                                :src="urls+'/mallvop/file/v1/content'+scope.row.logo" 
                                alt=""
                            >
                            <span style="padding-left:5px;">{{ scope.row.shortName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="channelPaymentType"
                        label="结算方式"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.paymentType | paymentFormat }}</span>
                            <!-- <div class="showicon">
                                <div 
                                  
                                    v-for="(intem,num) in scope.row.paymentType" 
                                    :key="num">
                                    <el-tooltip 
                                        class="item" 
                                        effect="dark" 
                                        :content="intem.payTypeName" 
                                        placement="top">
                                        <img 
                                            v-show="intem.icon"
                                            style="vertical-align: middle;width:48px;height:48px;margin-right:10px;border-radius: 4px;"
                                            :src="intem.icon" 
                                            alt="">
                                    </el-tooltip>
                                </div>
                            </div> -->
                           
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="channelStatus"
                        label="状态"
                        width="120"
                        sortable
                    >
                        <template slot-scope="scope">
                            <span 
                                style="color:#23B45D" 
                                v-show="scope.row.state==true"
                            >已启用</span>
                            <span 
                                style="color:#EE6747" 
                                v-show="scope.row.state==false"
                            >已停用</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="activationTime"
                        label="启用/停用时间"
                        width="200"
                    >
                        <template slot-scope="scope">
                            <span v-show="scope.row.updateTime">{{ scope.row.updateTime | msgFormat }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop=""
                        label="操作"
                        width="75"
                    >
                        <template slot-scope="scope">
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
            :modal-append-to-body="false"
            width="485px"
            center
        >
            <div 
                slot="title" 
                class="header-title"
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
import channelhandler from 'bislibs/requestHandler/channelhandler';
import utils from 'bislibs/utils';
export default {
    components: {},
    data() {
        return {
            loads: false,

            pageSize: 10,
            currentPage: 1,
            totalNum: 0,
            hasAuth: false,
            seeAuth: utils.hasAuth('seeChannel'),
            // seeAuth: true,
            pageSizeOpts: [5, 10, 20, 50, 100],
            listChannelInfos: [], //渠道信息列表
            searchKeys: '', //搜索关键字
            channelId: "",
            channelStatus: "",
            flag: false, //避免created和activated都会触发请求,
            urls: ""
        };
    },
    beforeCreate() {},
    created() {
        if (this.seeAuth) {
            //判断权限 true  正常显示 false提示弹框
            this.urls = location.origin //兼容ie10 没有origin属性
                ? location.origin
                : location.protocol + "//" + location.host;
            // this.urls = 'https://bplusdev.sinosun.com:18180/'
            this.getListChannelInfos();
        } else {
            this.hasAuth = true;
        }
    },
    mounted() {
        let _this = this;
        this.flag = true;
        this.calHeight();
        window.onresize = function() {
            //计算页面高度
            _this.calHeight();
        };
    },
    activated() {
        if (!this.flag) {
            //避免第一次进来  created和activated都会触发请求
            this.getListChannelInfos();
        }
    },
    deactivated() {
        // keepalive标记
        this.flag = false;
    },

    methods: {
        calHeight() {
            var clientHeight = document.documentElement.clientHeight;
            var domHeight = clientHeight - 48 - 61 - 24;
            domHeight = domHeight > 500 ? domHeight : 500;
            var tabelMaxHeight = domHeight - 56 - 36 - 64 - 36 - 56;
            $("#channelBox .el-table__body-wrapper").css({
                "max-height": tabelMaxHeight + "px",
                "overflow-y": "auto"
            });
            $("#channelBox").css("height", domHeight + "px");
        },
        // 查询列表
        queryChenelList() {
            this.currentPage = 1;
            this.loads = true;
            this.getListChannelInfos();
        },
        // 新建/查看详情  对应参数跳转到对应的页面  channelType 代表父还是子 parent  children
        channelDetail: function(val, res,channelType) {
            if (val !== "add") {
                // 父渠道的channelId 字段为 platformId, 这里转换一下
                if (!res.channelId){
                    res.channelId = res.platformId
                }
                sessionStorage.setItem("channelId", res.channelId);
                this.$router.push({
                    path: "/channel/detail",
                    query: {
                        crumbs: val,
                        channel: res,
                        channelType
                    }
                });
            } else {
                this.$router.push({
                    path: "/channel/add",
                    query: {
                        crumbs: val,
                        channel: res
                    }
                });
            }
        },
        // 查询渠道接入信息列表
        getListChannelInfos: function() {
            var _this = this;
            var json = {
                shortName: this.searchKeys,
                pageNum: this.currentPage,
                pageSize: this.pageSize
            };
            this.$iLoading.show();
            channelhandler.listChannel(json).then(result => {
                this.loads = false;
                this.$iLoading.hide();
                if (!!result && result.resultCode == 0) {
                    this.listChannelInfos = result.result.paltformVoList || [];
                    this.totalNum = result.result.total; //总条数
                }
                this.$iLoading.hide();
            })
                .catch(function() {
                    _this.loads = false;
                    _this.$iLoading.hide();
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
        }
    },
    filters: {
        msgFormat(val) {
            var dates = new Date(val).toJSON();
            return new Date(+new Date(dates) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/,'')
        },
        paymentFormat(val) {
            if (val=="1"){ return "账期" }
            else if (val=="2"){ return "月结" }
            return "-"
        }
    },
    watch: {}
};
</script>
<style lang="less" scoped>
.channelMgrContentBox {
    font-size: 14px;

    border-radius: 8px;
    background-color: #fff;
    margin-bottom: 24px;

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
        flex: 1;
        padding: 32px 24px 24px 24px;

        .addChannel {
            display: flex;
            justify-content: flex-end;
            padding: 16px 56px 16px 0;
            background-color: #fff;
        }
    }
    .channelList {
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
    display: flex;
    overflow: hidden; /*超出不显示*/
    text-overflow: ellipsis; /* 超出内容显示为省略号*/
    white-space: nowrap;
}
 /deep/ .el-table__expand-icon{
    display: inline-block !important;
}
/deep/ .el-table__indent{
    display: inline-block !important;
}
</style>
<style lang="less">
.channelMgrContentBox {
    .el-table--striped .el-table__body tr.el-table__row--striped td {
        background-color: #f8f8f8;
    }
    .el-table {
        color: #333;
    }
    .el-button--text {
        color: #478aee;
        &:hover {
            text-decoration: underline;
            opacity: 0.8;
        }
    }

    .el-table td {
        border-bottom: 0;
    }
    li span {
        margin-left: 0;
    }
    .el-table td {
        padding: 16px 0;
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