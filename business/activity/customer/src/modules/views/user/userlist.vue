<script>
import { userlist } from "opcl";
// console.log(userlist);
export default {
  extends: userlist,
  data() {
    return {
      //复写如下的字段
      listRoleurl: "/activitystudio/zsa-adapter/v1/listRole",
      searchUserurl: "/activitystudio/zsa-adapter/v1/searchUser",
      name_userdetails:"userdetail",
      path_adduser:"/sysmgr/useradd",
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>