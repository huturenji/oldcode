<template>
    <div :data-uaid="key" :style="style"></div>
</template>

<script>
// import extendUtils from 'common/lib/utils';
export default {
    name:'avatar',
    components: {},
    data() {
        return {
            style: {
                backgroundImage: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAALVBMVEXl5eXAwMDHx8fFxcXDw8PU1NTd3d3Ozs7i4uLY2NjR0dHMzMzJycnf39/a2toZXU15AAAA6UlEQVRIx2MYBYMV8EWtbMAnz+ooKCiORwWHoiAQuOFWwCQIBgk4FSyEKDDAJc8rCAGiOJ0IVSCESwGPIBTg8gcLTEECuQqYYQou4FDADpUXweVITqgCcZwBZQhRIIZTQSJEwQIG/HZI44nuFJCCAHwJIsZRaAUDTUFfVPWuyAu4U1wQJCDrcMkXwuLCEruCEEE4UMMmzw2TxRUWB5EVSGE1AL8RE2FSuGLUEVWBEGZEooEHGMkNDRRgZEs0oICRotGAAUaeQAMOGNkODWxAU8CG5k0RjEjvrFE2NjZSAgIQfXwCwygYiQAAUhEuEBQQ9qYAAAAASUVORK5CYII=)",
                backgroundSize: 'contain',
                width: '100%',
                height: '100%'
            },
            key: ""
        };
    },
    props: {
        uaid: {
            type: Number,
            default: 0
        }
    },
    watch: {
        uaid: {
            immediate: true,
            handler: function (val) {
                let that = this;
                if (!that.uaid) {return;}
                setTimeout(function () {
                    sinosdk.sino.userProfile({ uaid: val }).then((data) => {
                        if (data && data.iconData) {
                            let base64 = data.iconData.replaceAll("\n", "");
                            base64 = base64.replaceAll("\r", "");
                            that.style.backgroundImage = `url(data:image/jpg;base64,${base64})`
                            that.key = val
                        } else {
                            that.style.backgroundImage = `url(../communication_icon/${val})`;
                        }
                    })
                }, 50)
            }
        }
    }
}

</script>
<style scoped lang='less'>
@import '~newsStyles/themes/default.less';
@import '~newsStyles/mixins/mixinsStyle.less';

</style>