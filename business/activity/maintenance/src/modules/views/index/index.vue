<script>
import { gridhome } from "opcl";
import iconsitelogo from "assets/img_nav_cjhdptd_logo.png";
// console.log(gridhome);
export default {
  extends: gridhome,
  data() {
    return {
      //组件的主题，有2种  dark （黑）、primary（蓝），默认 primary
      theme: "primary",
      websitelogo: iconsitelogo,
    };
  },
  created() {
    this.sitename = "抽奖工具运维平台";
    console.log("sitename=" + this.sitename);
  },
  mounted() {
    //默认显示 menu页面
    this.$router.push("/menu");
  },
  methods: {},
};
</script>