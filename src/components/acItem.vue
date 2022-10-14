<!-- 自定义item左右 title + value 展示组件 -->
<template>
  <div :style="customStyle" class="_item fs-28">
    <div class="_main flex-row justify-content-between">
      <div
        class="_left"
        :style="value == '' && imgList.length == 0 ? 'width: 100%' : ''"
      >
        {{ title }}
      </div>
      <div v-if="value" class="_right">{{ value }}</div>
      <div
        v-if="!value && imgList.length > 0"
        class="_img flex-row flex-wrap justify-content-end"
      >
        <ac-image
          v-for="(item, index) in imgList"
          :key="index"
          :src="item ? item : item.src"
          width="60px"
          height="60px"
          customStyle="margin-top: 5px;margin-left: 10px"
        ></ac-image>
      </div>
    </div>
    <div v-if="showLine" class="_line"></div>
  </div>
</template>

<script>
import { ref, defineComponent } from "vue";
import { onMounted } from "@vue/runtime-core";
import acImage from "./acImage.vue";

export default defineComponent({
  components: { acImage },
  props: {
    title: {
      type: String,
      default: "",
    }, // 左边title
    customStyle: {
      type: String,
      default: "",
    },

    value: {
      type: String,
      default: "",
    }, // 右边数值
    showLine: {
      type: Boolean,
      default: true,
    }, // 是否展示底部的线条，默认为true
    imgList: {
      type: Array,
      default: () => [],
    }, // 当前图片列表
  },
  setup() {
    onMounted(() => {});
    return {};
  },
});
</script>

<style lang="less" scoped>
@import "../assets/css/fit.less";
._item {
  padding: 0 30px;
  box-sizing: border-box;
  background-color: #fff;

  ._main {
    width: 100%;
    padding: 24px 0px;
    box-sizing: border-box;
    ._left {
      width: 180px;
      color: #666;
    }
    ._right {
      flex: 1;
      margin-left: 30px;
      text-align: right;
      color: #333;
    }
    ._img {
      width: 450px;
      margin-left: 30px;
    }
  }

  ._line {
    width: 100%;
    height: 1px;
    background-color: #ebebeb;
  }
}
</style>
