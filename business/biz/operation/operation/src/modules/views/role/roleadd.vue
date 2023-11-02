<script>
import { roleadd } from "opcl";
console.log(roleadd);
export default {
  extends: roleadd,
  data() {
    return {
      //复写如下的字段
      listPermissionlurl: "/bizcloud/zsa-adapter/v1/listPermission",
      addRolelurl: "/bizcloud/zsa-adapter/v1/addRole",
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>