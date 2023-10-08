<template>
    <SnLoading
        :tip="tipsText"
    />
</template>

<script>
import SnLoading from './index.js'
export default {
    name: 'loadingX',
    components: {SnLoading},
    props: {
        tipsText: {
            type: String,
            default: '数据加载中...'
        }
    }
}

</script>
