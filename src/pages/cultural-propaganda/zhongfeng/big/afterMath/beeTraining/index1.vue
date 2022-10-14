<template>
  <div class="training">
    <van-tabs v-model:active="current" class="fs-28">
      <van-tab title="发布培训"></van-tab>
      <van-tab title="培训通知"></van-tab>
    </van-tabs>
    <div v-if="current == 0" class="publish fs-28" @click="gotoPublish">
      发布培训
    </div>
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
    const Router = useRouter();
    const current = ref(0); // 当前 current step选项
    const trainingRef = ref(null); //

    // 去发布培训操作
    const gotoPublish = () => {
      Router.push({
        name: "culturalProBigBeeTrainingPublish",
      });
    };
    onMounted(() => {
      setTimeout(() => {
        trainingRef.value.load();
      }, 150);
    });
    return {
      trainingRef,
      current,
      gotoPublish,
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
