<template>
  <div class="employ">
    <div class="publish fs-28" @click="gotoPublish">发布工作</div>
    <employ-list ref="employRef"></employ-list>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import EmployList from "./list.vue";
import { useRouter } from "vue-router";
export default {
  components: { EmployList },
  setup() {
    const Router = useRouter();
    const employRef = ref(null); //
    // 去发布工作
    const gotoPublish = () => {
      Router.push({
        name: "culturalProBigEmployAlleviationPublish",
      });
    };
    onMounted(() => {
      setTimeout(() => {
        employRef.value.load();
      }, 150);
    });
    return {
      employRef,
      gotoPublish,
    };
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../../assets/css/fit.less";
.employ {
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
