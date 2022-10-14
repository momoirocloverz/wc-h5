<template>
  <div class="work">
    <work-list ref="workRef"></work-list>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import WorkList from "./list.vue";
import { useRouter } from "vue-router";
export default {
  components: { WorkList },
  setup() {
    const workRef = ref(null); //
    onMounted(() => {
      setTimeout(() => {
        workRef.value.load();
      }, 150);
    });
    return {
      workRef,
    };
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../../assets/css/fit.less";
.work {
  width: 100%;
}
</style>
