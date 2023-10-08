<script>
import { userdetail } from "opcl";
// console.log(userdetail);
export default {
  extends: userdetail,
  data() {
    return {
      //复写如下的字段
      getUserurl: "/activitystudio/zsa-adapter/v1/getUser",
      delUserurl: "/activitystudio/zsa-adapter/v1/delUser",
      name_edituser:"useredit"
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>