<script>
import { roleadd } from "opcl";
// console.log(roleadd);
export default {
  extends: roleadd,
  data() {
    return {
      //复写如下的字段
      listPermissionlurl: "/activitystudio/zsa-adapter/v1/listPermission",
      addRolelurl: "/activitystudio/zsa-adapter/v1/addRole",
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>