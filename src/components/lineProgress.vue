<!-- 自定义线性进度条展示组件 -->
<template>
  <div class="_line-progress" :style="customStyle">
    <div class="_line">
      <div
        class="_current"
        :style="'--total: ' + total + ';--current: ' + current"
      ></div>
    </div>
    <div class="_show fs-28">{{ current }} / {{ total }}</div>
  </div>
</template>

<script>
import { ref, defineComponent } from "vue";
import { onMounted } from "@vue/runtime-core";

export default defineComponent({
  props: {
    total: {
      type: Number,
      default: 1,
    }, // 当前进度总数
    current: {
      type: Number,
      default: 1,
    }, // 当前进度数
    customStyle: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    onMounted(() => {});
    return {};
  },
});
</script>

<style lang="less" scoped>
@import "../assets/css/fit.less";
._line-progress {
  width: 100%;
  margin-top: 40px;
  ._line {
    position: relative;
    width: 100%;
    height: 16px;
    border-radius: 16px;
    background-color: #cccccc;
    overflow: hidden;
    ._current {
      position: absolute;
      left: 0;
      top: 0;
      width: calc(var(--current) / var(--total) * 100%);
      height: 16px;
      border-radius: 16px;
      background: linear-gradient(90deg, #ef7c25, #e3320f);
    }
  }

  ._show {
    width: 100%;
    margin-top: 15px;
    text-align: center;
    color: #333;
  }
}
</style>
