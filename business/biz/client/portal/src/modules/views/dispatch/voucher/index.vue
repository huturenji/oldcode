<script>
import extendUtils from 'common/lib/utils';
export default {
    beforeCreate(){
        let target = `${location.origin}/bizcloud/static/voucher/index.html#/signedGift/receive`
        const queryParams = location.hash?.substring(location.hash.indexOf('?') + 1) || location.search
        if(extendUtils.isNotEmpty(queryParams)){
            target += '?' + queryParams
        }
        location.href = target;
    }
}
</script>