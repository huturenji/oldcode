<template>
    <div 
        class="nav-bar" 
        v-if="updata"
    >
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item 
                :to="path(index)" 
                v-for="(item, index) in $route.meta.name" 
                :key="index"
            >{{ item }} </el-breadcrumb-item> 
        </el-breadcrumb>
    </div>
</template>

<script>
import utils from "bislibs/utils";
export default {
    data() {
        return {
            updata: true
        };
    },
    computed: {
        path() {
            return function(index) {
                return this.$route.meta.path[index];
            };
        }
    },
    created() {
        utils.evenBus.$on("setMeta", target => {
            this.updata = target;
        });
    },
    mounted() {},
    methods: {
        back() {
            this.$router.goBack();
        }
    }
};
</script>

<style scoped lang="less">
.nav-bar {
    padding: 24px 24px 16px 24px;
}
.back {
    display: flex;
    max-width: 150px;
    font-size: 16px;
    align-items: center;
    margin-top: 10px;
    cursor: pointer;
}
</style>
<style lang="less">
.nav-bar {
    .el-breadcrumb {
        font-size: 16px;
        line-height: normal;
        .el-breadcrumb__item {
            .el-breadcrumb__inner {
                font-weight: normal;
                color: #999;
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
