<template>
    <div class="service-header">
        <div
            class="service-num"
            :class="{'service-num-small': type=='small'}"
            v-for="(header,index) in headerList"
            :key="index"
        >
            <div class="menu-title">
                {{ header.title }}
            </div>
            <span
                class="menu-num"
                :class="`service${index}`"
            >{{ header.value }}</span>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        headerList: {
            type: Array,
            default: () => []
        },
        type: {
            type: String,
            default: "normal"
        }
    }
};
</script>
<style lang="less" scoped>
 
.service-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .service-num {
        display: flex;
        align-items: center;
        flex-direction: column;
        border-radius: 12px;
        width: 410px;
        height: 160px;
        background: #fff;
        margin-right: 24px;
        &:last-child {
            margin-right: 0;
        }
        .menu-title {
            width: 100%;
            color:  #999;
            padding: 8px 0 16px 0;
            text-align: center;
            border-bottom: 1px solid #ebeef5;
        }
        .menu-num {
            padding-top: 30px;
            font-size: 40px;
            font-weight: bold;
        }
        .service0 {
            color: #f8a339;
        }
        .service1,
        .service2 {
            color: #478aee;
        }
    }
    .service-num-small {
        height: 120px;
        .menu-num {
            padding-top: 18px;
            font-size: 32px;
        }
    }
}
</style>