<script>
import extendUtils from 'common/lib/utils';
export default {
    beforeCreate(){
        let platform = 'mallbbcg2bank'
        if(location.origin == 'https://bplussit.sinosun.com:18380'){
            platform = 'mallbbcg2'
        }
        let target = `${location.origin}/${platform}/static/mobile/index.html#/pages/coupon/receive?closeTo=1`
        const queryParams = location.hash?.substring(location.hash.indexOf('?') + 1) || location.search
        if(extendUtils.isNotEmpty(queryParams)){
            target += '&' + queryParams.replace('ids', 'password')
        }
        location.href = target;
    }
}
</script>