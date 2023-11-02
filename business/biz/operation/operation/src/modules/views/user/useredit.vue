<script>
import { useredit } from "opcl";
console.log(useredit);
export default {
  extends: useredit,
  data() {
    return {
      //复写如下的字段
      getUserurl: "/bizcloud/zsa-adapter/v1/getUser",
      updateUserurl: "/bizcloud/zsa-adapter/v1/updateUser",
      listRoleurl: "/bizcloud/zsa-adapter/v1/listRole",
      path_userlist: "/sysmgr/user",
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>