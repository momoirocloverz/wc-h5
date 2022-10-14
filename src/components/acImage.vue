<!-- 自定义安厨图片展示组件 -->
<template>
  <div
    :style="
      'width: ' +
      width +
      ';height:' +
      height +
      ';background-image: url(' +
      src +
      ');background-repeat: no-repeat;background-position: 50% 50%;background-size: ' +
      mode +
      ';' +
      customStyle
    "
    @click="_previewImg(src)"
  ></div>
</template>

<script>
import { ref, defineComponent } from "vue";
import { onMounted } from "@vue/runtime-core";
import { ImagePreview } from "vant";

export default defineComponent({
  props: {
    src: {
      type: String,
      default: "",
    }, // 图片地址
    customStyle: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
    preview: {
      type: Boolean,
      default: true,
    },
    mode: {
      type: String,
      default: "cover",
    },
  },
  setup(props) {
    const _previewImg = (src) => {
      console.log(props.src);
      if (props.preview) {
        ImagePreview({ images: [src] });
      }
    };

    onMounted(() => {});
    return {
      _previewImg,
    };
  },
});
</script>

<style lang="less" scoped>
@import "../assets/css/fit.less";
</style>
