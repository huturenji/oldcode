<template>
    <div class="bootomSheetWrap">
        <div class="btnWrap">
            <template v-for="(option,index) in options">    
                <div v-if="!!option.show" class="btn normal-btn" @click="$emit('action',option)" :key="index" :style="{backgroundImage: 'url(' + option.imgUrl||'' + ')'}">{{option.name}}</div>
            </template>
        </div>
        <div class="cancelBtn normal-btn" @click="$emit('close','')">取消</div>
    </div>
</template>
<script>
export default {
    components: {
    },
    props: {
        options: {//options
            type: Array,
            default() {
                return []
            }
        } 
    },
    data() {
        return {
        };
    },
    computed:{
    },
    created(){
    },
    mounted(){
    },
    methods: {
    }
};
</script>
<style lang="scss">

    .bootomSheetWrap{
        background: #ffffff;
        border-radius: 20rpx 20rpx 0 0;
        padding-bottom: var(--safe-area-inset-bottom);
        .btnWrap{
            padding: 20rpx;
            display: flex;
            .bbpx{
                position: relative;
                &::before {
                    content: "";
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    height: 1px;
                    border-top: 1px solid $border-color-split;
                    -webkit-transform-origin: 0 50%;
                    transform-origin: 0 50%;

                    @media screen and (-webkit-device-pixel-ratio: 1.5),
                    (-webkit-min-device-pixel-ratio: 1.5) {
                        -webkit-transform: scaleY(0.7);
                        transform: scaleY(0.7);
                    }

                    @media screen and (-webkit-device-pixel-ratio: 2),
                    (-webkit-min-device-pixel-ratio: 2) {
                        -webkit-transform: scaleY(0.5);
                        transform: scaleY(0.5);
                    }

                    @media screen and (-webkit-device-pixel-ratio: 2.5),
                    (-webkit-min-device-pixel-ratio: 2.5) {
                        -webkit-transform: scaleY(0.4);
                        transform: scaleY(0.4);
                    }

                    @media screen and (-webkit-device-pixel-ratio: 3),
                    (-webkit-min-device-pixel-ratio: 3) {
                        -webkit-transform: scaleY(0.33);
                        transform: scaleY(0.33);
                    }
                }
            }
            .btn{
                overflow : hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-all; /* 追加这一行代码 */
                flex:0 0 20%;
                padding-top: 134rpx;
                padding-bottom: 20rpx;
                background-repeat: no-repeat;
                background-position: top 20rpx center;
                background-size: 100rpx;
                font-size: 24rpx;
                color: $main-font-color;
                line-height:120%;
                text-align: center;
            }
        }
        .cancelBtn{
            font-size: 32rpx;
            color: $main-third-color;
            line-height:108rpx;
            text-align: center;
        }
    }
</style>