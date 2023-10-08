<script>
import { rolelist } from "opcl";
// console.log(rolelist);
export default {
  extends: rolelist,
  data() {
    return {
      //复写如下的字段
      listRoleurl: "/activitystudio/zsa-adapter/v1/listRole",
      path_roleDetail: "/sysmgr/roledetail",
      path_rolelAdd: "/sysmgr/roleadd",
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>