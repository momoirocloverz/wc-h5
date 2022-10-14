<template>
  <div class="choose">
    <choose-list ref="chooseRef"></choose-list>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import ChooseList from "./list.vue";
export default {
  components: { ChooseList },
  setup() {
    const chooseRef = ref(null); //
    onMounted(() => {
      setTimeout(() => {
        chooseRef.value.load();
      }, 150);
    });
    return {
      chooseRef,
    };
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../../assets/css/fit.less";
.choose {
  width: 100%;
}
</style>
