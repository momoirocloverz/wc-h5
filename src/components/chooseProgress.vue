<!-- 自定义按钮式进度条展示组件 -->
<template>
  <div
    class="_choose-progress flex-row align-items-center justify-content-between"
    :style="customStyle"
  >
    <div
      v-for="(item, index) in list"
      :key="index"
      class="_item fs-28 flex-column align-items-center"
      @click="changeNum(item.num)"
    >
      <div
        :class="
          current == item.num || item.finish ? '_num-select' : '_num-unselect'
        "
      >
        {{ item.num }}
      </div>
      <div
        :class="current == item.num ? '_triangle-select' : '_triangle-unselect'"
      ></div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from "vue";
import { onMounted } from "@vue/runtime-core";

export default defineComponent({
  props: {
    current: {
      type: Number,
      default: 1,
    }, // 当前进度数
    customStyle: {
      type: String,
      default: "",
    },
    list: {
      type: Array,
    }, // 当前展示的 选择列表
    // 上面list传入的格式为：
    // [
    //   {num: 1, finish: false},
    //   {num: 2, finish: true},
    //   {num: 3, finish: false},
    // ]
    // 其中 num表示当前的数字，finish表示当前是否已经完毕
  },
  setup(props, { emit }) {
    const changeNum = (num) => {
      emit("changeNum", num);
    };
    onMounted(() => {});
    return { changeNum };
  },
});
</script>

<style lang="less" scoped>
@import "../assets/css/fit.less";
._choose-progress {
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  margin-top: 15px;
  background-color: #fff;
  ._item {
    width: 48px;
    ._num-select {
      width: 48px;
      height: 48px;
      box-sizing: border-box;
      line-height: 46px !important;
      background-color: var(--custom_color);
      text-align: center;
      border-radius: 50%;
      border: 2px solid var(--custom_color);
      color: #fff;
    }
    ._num-unselect {
      width: 48px;
      height: 48px;
      box-sizing: border-box;
      line-height: 46px !important;
      background-color: #fff;
      text-align: center;
      border-radius: 50%;
      border: 2px solid var(--custom_color);
      color: var(--custom_color);
    }
    ._triangle-select {
      width: 0px;
      height: 0px;
      margin-top: 10px;
      border: 10px solid rgba(255, 255, 255, 0);
      border-bottom-color: var(--custom_color);
      border-top: 0;
    }
    ._triangle-unselect {
      width: 0px;
      height: 0px;
      margin-top: 10px;
      border: 10px solid rgba(255, 255, 255, 0);
      border-bottom-color: rgba(255, 255, 255, 0);
      border-top: 0;
    }
  }
}
</style>
