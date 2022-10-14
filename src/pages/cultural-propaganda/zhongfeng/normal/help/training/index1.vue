<template>
  <div class="training">
    <van-tabs v-model:active="current" class="fs-28">
      <van-tab title="最新培训"></van-tab>
      <van-tab title="申请培训"></van-tab>
    </van-tabs>
    <training-list :type="current" ref="trainingRef"></training-list>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import TrainingList from "./list.vue";
import { useRouter } from "vue-router";
export default {
  components: { TrainingList },
  setup() {
    const current = ref(0); // 当前 current step选项
    const trainingRef = ref(null); //

    onMounted(() => {
      setTimeout(() => {
        trainingRef.value.load();
      }, 150);
    });
    return {
      trainingRef,
      current,
    };
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../../assets/css/fit.less";
.training {
  width: 100%;
  .publish {
    width: 100%;
    padding: 24px 30px;
    box-sizing: border-box;
    text-align: right;
    color: var(--custom_color);
  }
}
</style>
