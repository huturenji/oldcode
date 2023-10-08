<template>
    <div class="nav-bar">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item @click.native="home">
                首页
            </el-breadcrumb-item>
            <el-breadcrumb-item
                :to="path(index)"
                v-for="(item, index) in $route.meta.name"
                :key="index"
            >
                {{ item }}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: ""
        }
    },
    computed: {
        path() {
            return function(index) {
                return this.$route.meta.path[index];
            };
        }
    },
    methods: {
        home() {
            location.href = location.origin + "/mallvop/static/operation/index.html";
        }
    }
};
</script>
<style lang="less">
 
.nav-bar {
    padding: 24px 0 16px 24px;
    .el-breadcrumb {
        font-size: 16px;
        .el-breadcrumb__item {
            .el-breadcrumb__inner {
                font-weight: normal;
                color:  #999;
                cursor: pointer;
                &:hover {
                    color: #478aee;
                }
            }
            &:last-child {
                .el-breadcrumb__inner {
                    font-weight: bold;
                    color: #333;
                    &:hover {
                        color: #333;
                    }
                }
            }
        }
    }
}
</style>