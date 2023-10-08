<script>
import { authlist } from "opcl";
console.log(authlist);
export default {
  extends: authlist,
  data() {
    return {
      listPermissionurl: "/activitystudio/zsa-adapter/v1/listPermission",
      path_import: "/authImport",
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>