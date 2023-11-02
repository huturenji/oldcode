<script>
import { useradd } from "opcl";
console.log(useradd);
export default {
  extends: useradd,
  data() {
    return {
      //复写如下的字段
      listRoleurl: "/bizcloud/zsa-adapter/v1/listRole",
      searchCompanyUserurl: "/bizcloud/zsa-adapter/v1/searchCompanyUser",
      addUserurl: "/bizcloud/zsa-adapter/v1/addUser",
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>