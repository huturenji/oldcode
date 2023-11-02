<script>
import { roleedit } from "opcl";
console.log(roleedit);
export default {
  extends: roleedit,
  data() {
    return {
      //复写如下的字段
      listPermissionurl: "/bizcloud/zsa-adapter/v1/listPermission",
      getRoleDetailurl: "/bizcloud/zsa-adapter/v1/getRoleDetail",
      updateRoleUrl: "/bizcloud/zsa-adapter/v1/updateRole",
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>