<!-- 自定义安厨图片展示组件 -->
<template>
  <div :style="customStyle">
    <div class="_sub-title fs-28">{{ title }}</div>
    <div class="_value fs-28">{{ value }}</div>
  </div>
</template>

<script>
import { ref, defineComponent } from "vue";
import { onMounted } from "@vue/runtime-core";

export default defineComponent({
  props: {
    title: {
      type: String,
      default: "",
    }, //
    value: {
      type: String,
      default: "",
    }, //
    customStyle: {
      type: String,
      default: "",
    },
  },
  setup() {
    onMounted(() => {});
    return {};
  },
});
</script>

<style lang="less" scoped>
@import "../assets/css/fit.less";

._sub-title {
  margin-top: 30px;
  color: #999999;
}
._value {
  margin-top: 16px;
  color: #333333;
}
</style>
