<script>
import { authedit } from "opcl";
console.log(authedit);
export default {
  extends: authedit,
  data() {
    return {};
  },
  created() {
    this.updatePermissionurl = "/activitystudio" + "/zsa-adapter/v1/initPermission";
  },
  mounted() {},
  methods: {},
};
</script>