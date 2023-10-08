<template>
    <div class="mainane">
        <div class="home-content">
            <div
                class="menu-item"
                :class="item.type"
                v-for="(item,ins) in dataList"
                :key="ins"
                @click="goSubsystem(item)"
            >
                <span class="showtxt">
                    {{ item.name }}
                </span>
            </div>
        </div>
        <el-dialog
            :visible.sync="noAuth"
            :close-on-click-modal="false" 
            :show-close="false"
            customClass="noAuth"
            width="560px"
            center
        >
            <div
                slot="title"
                class="header-title"
            >
                <span class="confirmTitle">权限确认</span>
                <span
                    class="cancelBtn"
                    @click="clickBtn"
                >×</span>
            </div>
            <div class="inconContent">
                <p>{{ "暂无使用权限，如有需要请联系管理员开通" }}</p>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    type="primary"
                    @click="clickBtn"
                >我知道了</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import permissionManager from 'bislibs/permissionhandler'
import apiHandler from 'bislibs/requestHandler/channelhandler'

export default {
    data() {
        return {
            noAuth: false,       
            dataList: []
        };
    },
    created() {
        // !this.auth ? (this.modal1 = true) : null;
        this.initDatas()
    },
    methods: {
        async initDatas(){
            //根据权限获取菜单
            this.dataList = await permissionManager.getAuthedMenus({userId: apiHandler.userInfo.userId})
            //菜单有数据
            if (!!this.dataList && this.dataList.length > 0){
                this.noAuth = false
            } else {
                //菜单无数据
                this.noAuth = true        
            }
        },
        /**
         * 进入子系统
         */
        goSubsystem(item) {
            this.$router.push(item.path);
        },
        /**
         * 没有权限
         */
        clickBtn(){
            this.noAuth = false
        }
    }
};
</script>

<style scoped lang="less">
.mainane {
    .home-content {
        display: flex;
        align-items: flex-start;
        padding: 40px 40px;
        border-radius: 8px;
        background: #fff;
        margin-top: 30px;
        min-height: 60vh;
        .menu-item {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 200px;
            height: 120px;
            border-radius: 10px;
            transition: all 0.4s;
            margin-right: 40px;
            cursor: pointer;
            &:last-child {
                margin-right: 0;
            }
            .showtxt {
                font-size: 18px;
                color: #fff;
            }
            &:hover {
                zoom: 1;
                transform: scale(1.1);
            }
        }
        .service_mgr {
            background: linear-gradient(
                135deg,
                rgba(150, 182, 251, 1) 0%,
                rgba(91, 140, 242, 1) 100%
            );
        }
    }
}
</style>
<style lang="less">
@import "~styles/common.less";
</style>
