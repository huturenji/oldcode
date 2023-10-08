
<script>
import cart from "./cart";
export default {
  extends: cart,
  methods: {
    /**
     * T信回退事件的注册回调 必须是goBackFun
     */
    goBackFun() {
      this.$router.push({
        path: "/index"
      });
    }
  }
};
</script>