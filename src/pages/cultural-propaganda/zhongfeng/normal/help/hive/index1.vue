<template>
  <div class="hive">
    <hive-list ref="hiveRef"></hive-list>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import HiveList from "./list.vue";
import { useRouter } from "vue-router";
export default {
  components: { HiveList },
  setup() {
    const hiveRef = ref(null); //
    onMounted(() => {
      setTimeout(() => {
        hiveRef.value.load();
      }, 150);
    });
    return {
      hiveRef,
    };
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../../assets/css/fit.less";
.hive {
  width: 100%;
}
</style>
