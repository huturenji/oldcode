<script>
import { roledetail } from "opcl";
// console.log(roledetail);
export default {
  extends: roledetail,
  data() {
    return {
      //复写如下的字段
      getRoleDetailurl: "/activitystudio/zsa-adapter/v1/getRoleDetail",
      deleteRoleurl: "/activitystudio/zsa-adapter/v1/deleteRole",
      path_roleEdit: "/sysmgr/roleedit",
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>