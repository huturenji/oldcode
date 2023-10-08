<script>
import { roleedit } from "opcl";

export default {
  extends: roleedit,
  data() {
    return {
      //复写如下的字段
      listPermissionurl: "/activitystudio/zsa-adapter/v1/listPermission",
      getRoleDetailurl: "/activitystudio/zsa-adapter/v1/getRoleDetail",
      updateRoleUrl: "/activitystudio/zsa-adapter/v1/updateRole",
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>