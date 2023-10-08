<template>
    <div class="preview">
        <template v-if="data">
            <img 
                :key="index"
                v-for="(item,index) in images"
                v-lazy="item"
                id="contract_url"
                @click="enlargePic(index)"
            />
            <el-dialog
                :visible.sync="centerDialogVisible"
                modal
                close-on-click-modal
                :modal-append-to-body="false"
                custom-class="preview-dialog"
            >
                <el-carousel
                    ref="carousel"
                    :initial-index="activeIndex"
                    :loop="false"
                    :autoplay="false"
                    arrow="always"
                >
                    <el-carousel-item
                        v-for="(item,index) in data"
                        :key="index"
                    >
                        <img :src="item">
                    </el-carousel-item>
                </el-carousel>
            </el-dialog>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            centerDialogVisible: false,
            activeIndex: 0
        };
    },
    computed: {
        images() {
            return this.data;
        }
    },
    methods: {
        // 放大图片
        enlargePic(index) {
            this.activeIndex = index;
            this.$refs.carousel && this.$refs.carousel.setActiveItem(index);
            this.centerDialogVisible = true;
        }
    }
};
</script>

<style lang="less">
.preview {
    height: auto;
    display: flex;
    flex-wrap: wrap;
    img {
        width: 72px;
        height: 72px;
        cursor: pointer;
        margin: 8px 16px 0 0;
    }
    .preview-dialog {
        display: block;
        img {
            width: auto;
            height: 100%;
            margin: 0;
        }
    }
    .el-carousel__item h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        line-height: 300px;
        margin: 0;
        height: 100%;
        width: 100%;
    }
    .el-dialog__header {
        display: none;
    }
    .el-dialog__body {
        padding: 0 !important;
        margin: 0 !important;
        height: 600px;
    }
    .el-carousel {
        height: 100%;
    }
    .el-carousel__container {
        height: 100%;
    }
}
</style>