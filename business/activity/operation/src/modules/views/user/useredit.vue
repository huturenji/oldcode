<script>
import { useredit } from "opcl";

export default {
  extends: useredit,
  data() {
    return {
      //复写如下的字段
      getUserurl: "/activitystudio/zsa-adapter/v1/getUser",
      updateUserurl: "/activitystudio/zsa-adapter/v1/updateUser",
      listRoleurl: "/activitystudio/zsa-adapter/v1/listRole",
      path_userlist: "/sysmgr/user",
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>