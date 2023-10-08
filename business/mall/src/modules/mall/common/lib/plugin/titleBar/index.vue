<template>
    <div class='title-bar-container' ref='titleBarContainer' v-if='enable'>
        <div class='statu-bar' :style='statuBarStyle'></div>
        <div class='title-bar' :style='titleBarStyle'>
            <div class='center'>
                <div class='no-wrap'>{{titleText}}</div>
                <div ref='slot'></div>
            </div>
        </div>
    </div>
</template>
<script>
    import extendUtils from 'common/lib/utils';

    extendUtils.SetTitleBarThemeFunction({showTitle:false,suspend:true,showBack:false,opacity:0})

    //默认标题栏样式
    const barStyle = {
        "background": '#fff',
        "font-size": '.34rem',
        "color": '#222'
    }

    //默认状态栏样式
    const statuStyle = {
        "background": '#fff',
    }

    let navigatorData = extendUtils.getAppVersion();
    if(navigatorData){
        var titleHeight = (navigatorData.titleBarHeight / window.devicePixelRatio) || 0;
        var statusBarHeight = (navigatorData.statusBarHeight / window.devicePixelRatio) || 0;
        !!titleHeight || !statusBarHeight && document.body.style.setProperty('--titleBarHeight', titleHeight + statusBarHeight + 'px');
        !!titleHeight && document.body.style.setProperty('--titleHeight', titleHeight + 'px');
        !!statusBarHeight && document.body.style.setProperty('--statusHeight', statusBarHeight + 'px');
    }

    export default {
        name: 'title-bar',
        props: {
            titleStyle: {
                type: Object,
            },
            statuStyle: {
                type: Object,
            },
            title: {
                type: String,
                default: ''
            }
        },
        data(){
            return {
                enable: false,
                titleText: this.title,
                observer: null,
                titleBarStyle: Object.assign(barStyle, this.titleStyle),
                statuBarStyle: Object.assign(statuStyle, this.statuStyle),
                dbclick: false,
                appTitleConfig: {
                    showTitle:false,
                    suspend:true,
                    opacity:0
                }
            }
        },
        watch:{
            titleText(_new){
                if(typeof(_new) == 'string'){
                    Array.prototype.forEach.call(this.$refs.slot.childNodes, node=>{
                        node.remove();
                    })
                }
            },
        },
        created() {
            extendUtils.SetTitleBarThemeFunction(this.appTitleConfig)
            if(!titleHeight && !statusBarHeight){
                return;
            }
            let that = this;
            this.enable = true;
            this.observerTitle();//监听title变化
            if(!this.titleBarStyle.height){
                this.titleBarStyle.height = titleHeight + 'px'
            }
            this.statuBarStyle.height = statusBarHeight + 'px'
            this.callHook('created');
        },
        mounted() {
            this.callHook('mounted')
        },
        methods: {
            /**
             * 监听title变化并同步显示
             */ 
            observerTitle(){
                let that = this;
                // 选择需要观察变动的节点
                const targetNode = document.querySelector('title');
                // 观察器的配置（需要观察什么变动）
                const config = { childList: true, subtree: true };
                // 当观察到变动时执行的回调函数
                const callback = function(mutationsList, _observer) {
                    that.titleText = mutationsList[0].addedNodes[0].textContent
                };
                // 创建一个观察器实例并传入回调函数
                this.observer = new MutationObserver(callback);
                // 以上述配置开始观察目标节点
                this.observer.observe(targetNode, config);
            },
            setTitle(title){
                if(typeof(title) == 'string'){
                    this.titleText = title;
                    this.$refs.slot.innerHtml = ''
                }else{
                    this.titleText=null;
                    this.$refs.slot.appendChild(title)
                }
            },
            /**
             * 触发事件
             */ 
             callHook(event, data){
                this.$emit(event, data);
                this[event] && typeof this[event]=='function' && this[event](data);
            },
        },
        beforeDestroy(){
            this.observer && this.observer.disconnect();
        }
    };
</script>
<style lang='less' scoped>
    .title-bar-container {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        background: transparent;
        width: 100%;
        height: auto;
        text-align: center;
        z-index: 9999;

        .repixe() {
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            @media screen and (-webkit-device-pixel-ratio: 1.5),
            (-webkit-min-device-pixel-ratio: 1.5) {
                width: 150%;
                height: 150%;
                -webkit-transform: scale(0.7);
                transform: scale(0.7);
            }

            @media screen and (-webkit-device-pixel-ratio: 2),
            (-webkit-min-device-pixel-ratio: 2) {
                width: 200%;
                height: 200%;
                -webkit-transform: scale(0.5);
                transform: scale(0.5);
            }

            @media screen and (-webkit-device-pixel-ratio: 3),
            (-webkit-min-device-pixel-ratio: 3) {
                width: 300%;
                height: 300%;
                -webkit-transform: scale(0.33);
                transform: scale(0.33);
            }
        }

        .repixeX(@origin: 50% 50%) {
            -webkit-transform-origin: @origin;
            transform-origin: @origin;

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

        .title-bar{
            position: relative;
            .center{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: .36rem;
                width: calc(~'100% - 3.76rem');
                text-align: center;
            }
        }
    }
    .no-wrap{
        display: block;
        overflow : hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-break: break-all; 
    }
</style>