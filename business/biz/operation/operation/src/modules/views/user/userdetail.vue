<script>
import { userdetail } from "opcl";
console.log(userdetail);
export default {
  extends: userdetail,
  data() {
    return {
      //复写如下的字段
      getUserurl: "/bizcloud/zsa-adapter/v1/getUser",
      delUserurl: "/bizcloud/zsa-adapter/v1/delteUser",
      name_edituser:"useredit"
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>