<!-- 我的红包 -->
<template>
    <view class="redpacket_rules">
        <view class="content">
            {{helpTipsCon}}
        </view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                helpTipsCon:'', //红包规则内容
            };
        },
        mounted(){
            this.getHelpTips();
        },
        methods: {
            // 获取红包规则内容
            getHelpTips(){
                let param={};
                param.data = {};
                param.data.names = 'redpacket_user_help';
                param.url = 'v3/system/front/setting/getSettings';
                param.method = 'GET';
                this.$request(param).then(res => {
                    if (res.state == 200) {
                        this.helpTipsCon = res.data[0] || '';
                        this.helpTipsCon = this.helpTipsCon.replace(/\n/g,'\n\n').trim()
                    }
                })
            }
        },

    }
</script>

<style lang="scss">
.redpacket_rules {
    min-height: 100%;
    background: #fff;
    .content {
        padding: 28rpx 56rpx;
        line-height: 40rpx;
        font-size: 28rpx;
        color: #666666;
        white-space: pre-wrap;
    }
}
    
</style>