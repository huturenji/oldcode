<script>
import { useradd } from "opcl";
// console.log(useradd);
export default {
  extends: useradd,
  data() {
    return {
      //复写如下的字段
      listRoleurl: "/activitystudio/zsa-adapter/v1/listRole",
      searchCompanyUserurl: "/activitystudio/zsa-adapter/v1/searchCompanyUser",
      addUserurl: "/activitystudio/zsa-adapter/v1/addUser",
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>