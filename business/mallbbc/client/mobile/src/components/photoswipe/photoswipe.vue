<template>
    <view class="content">
        <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="pswp__bg"></div>
            <div class="pswp__scroll-wrap">
                <div class="pswp__container">
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                </div>
                <!-- 预览区域顶部的默认UI，可以修改 -->
                <div class="pswp__ui pswp__ui--hidden">

                    <div class="pswp__top-bar">
                        <!--  与图片相关的操作 -->
                        <div class="pswp__counter"></div>
                        <template v-if="imgs.length>0">
                            
                            <!-- <button class="pswp__button pswp__button--close" title="Close (Esc)"></button> -->
                            <div v-if="false">
                                <button class="btn_item" @click.native.prevent="viewPicture"
                                    v-if="!imgs[idx].picture">查看原图</button>
                            </div>

                        </template>


                        <div class="pswp__preloader">
                            <div class="pswp__preloader__icn">
                                <div class="pswp__preloader__cut">
                                    <div class="pswp__preloader__donut"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                        <div class="pswp__share-tooltip"></div>
                    </div>

                    <div class="pswp__caption">
                        <div class="pswp__caption__center"></div>
                    </div>
                </div>
            </div>
        </div>


    </view>
</template>

<script>
import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
var gallery = null
const promixify = (api) => {
    return (options, ...params) => {
        return new Promise((resolve) => {
            api(Object.assign({}, options, {
                success: resolve,
                fail: resolve
            }), ...params)
        })
    }
}
export default {
    name: "photoswipe",
    props: {
        imgs: {
            //图片列表
            type: Array,
            required: true,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
            idx:0
        };
    },
    methods: {
        resImg(){
            if (gallery){
                if (gallery.container.clientHeight>0){
                    gallery.updateSize( true );
                }
            }
        },
        initImage(e) {
            let that = this
            var pswpElement = document.querySelectorAll('.pswp')[0];
            var items = [];
            const getImageInfo = promixify(uni.getImageInfo)
            Promise.all(
                that.imgs.map(img => getImageInfo({
                    src: img
                }))
            ).then((imageInfos) => {

                imageInfos.forEach((i) => {
                    i.w = i.width;
                    i.h = i.height;
                    i.src = i.path; //大图
                    i.msrc = i.path; //小图
                })
                items = imageInfos
                var options = {
                    index: e, // start at first slide
                    history: false,
                    tapToClose: true
                };
                gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
                gallery.init();
                that.idx = gallery.getCurrentIndex()
                gallery.listen('beforeChange', function() {
                    that.idx = gallery.getCurrentIndex()
                });

            })
        },
            
        //查看原图
        viewPicture(){
            let that = this
            let idx = gallery.getCurrentIndex()
            that.imgs[idx].picture = true
            let itm = [that.imgs[idx]]
            const getImageInfo = promixify(uni.getImageInfo)
                
            Promise.all(
                itm.map(img => getImageInfo({ src:img.imgUrl }))
            ).then((imageInfos) => {
                    
                gallery.items[idx]={
                    src:imageInfos[0].path,
                    w:imageInfos[0].width,
                    h:imageInfos[0].height,
                    msrc :imageInfos[0].path
                };
                gallery.invalidateCurrItems();
                gallery.updateSize( true );
                    
            })
                
        }
    }
}
</script>

<style lang="scss">
// .pswp__bg{
//     top: calc(-1*var(--titleBarFillHeight)) !important;
// }
.pswp{
    height: 100%;
}
.pswp__top-bar{
    top: calc(50px + var(--titleBarFillHeight, 0px));
    background-color:transparent;
    .pswp__counter{
        opacity: 1;
    }
}
.btn_item{
        font-size: 24rpx;
        background: none;
        border: 2rpx solid #FFFFFF;
        color: #FFFFFF;
        position: absolute;
        bottom: 0;
        right: 100rpx;
        height: 60rpx;
        line-height: 60rpx;
        top: 10rpx;
        
    }
    .btn_item::after{
        display: none;
    }
</style>
