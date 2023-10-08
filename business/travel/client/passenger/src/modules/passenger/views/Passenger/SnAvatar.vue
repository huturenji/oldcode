<template>
    <div :data-uaid="key" :style="style"></div>
</template>

<script>
import passengerHandler from './passengerHandler.js';
export default {
    components: {},

    data() {
        return {
            style: {
                backgroundImage: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAALVBMVEXl5eXAwMDHx8fFxcXDw8PU1NTd3d3Ozs7i4uLY2NjR0dHMzMzJycnf39/a2toZXU15AAAA6UlEQVRIx2MYBYMV8EWtbMAnz+ooKCiORwWHoiAQuOFWwCQIBgk4FSyEKDDAJc8rCAGiOJ0IVSCESwGPIBTg8gcLTEECuQqYYQou4FDADpUXweVITqgCcZwBZQhRIIZTQSJEwQIG/HZI44nuFJCCAHwJIsZRaAUDTUFfVPWuyAu4U1wQJCDrcMkXwuLCEruCEEE4UMMmzw2TxRUWB5EVSGE1AL8RE2FSuGLUEVWBEGZEooEHGMkNDRRgZEs0oICRotGAAUaeQAMOGNkODWxAU8CG5k0RjEjvrFE2NjZSAgIQfXwCwygYiQAAUhEuEBQQ9qYAAAAASUVORK5CYII=)",
                backgroundSize: 'contain'
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
            handler: function () {
                let _this = this;
                if (!_this.uaid) { return; }
                if (passengerHandler.isPC()) {
                    _this.style.backgroundImage = `url(../communication_icon/${_this.uaid})`;
                    return _this.key = _this.uaid;
                }
                setTimeout(function () {
                    sinosdk.sino.userProfile({ uaid: _this.uaid }).then((data) => {
                        if (data && data.iconData) {
                            let base64 = data.iconData.replaceAll("\n", "");
                            base64 = base64.replaceAll("\r", "");
                            _this.style.backgroundImage = `url(data:image/jpg;base64,${base64})`
                            _this.key = _this.uaid;
                        } else {
                            _this.style.backgroundImage = `url(../communication_icon/${_this.uaid})`;
                        }
                    })
                }, 50)
            }
        }
    }
}

</script>
<style lang='less'>
</style>