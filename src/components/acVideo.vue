<!-- 自定义安厨图片展示组件 -->
<template>
  <div
    class="_pre-video"
    :style="'--width: ' + width + ';--height:' + height + ';' + customStyle"
  >
    <video class="video" :style="';object-fit:' + mode" :src="src"></video>
    <div
      class="mask flex-row align-items-center justify-content-center"
      @click="_previewVideo(src)"
    >
      <img src="@/assets/images/video-pre.png" />
    </div>
  </div>

  <pre-video ref="preVideo" :src="src"></pre-video>
</template>

<script>
import { ref, defineComponent } from "vue";
import { onMounted } from "@vue/runtime-core";
import preVideo from "@/components/preview/video.vue";

export default defineComponent({
  components: { preVideo },
  props: {
    src: {
      type: String,
      default: "",
    }, // 视频地址
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
    // fill （默认，不保证保持原有的比例，内容拉伸填充整个内容容器）
    // contain （保持原有尺寸比例。内容被缩放）
    // cover （保持原有尺寸比例。但部分内容可能被剪切）
    // none （保留原有元素内容的长度和宽度，也就是说内容不会被重置）
    // scale-down （保持原有尺寸比例。内容的尺寸与 none 或 contain 中的一个相同，取决于它们两个之间谁得到的对象尺寸会更小一些）
    // -- initial （设置为默认值）--
    // -- inherit （从该元素的父元素继承属性）--
    mode: {
      type: String,
      default: "cover",
    },
  },
  setup(props) {
    const preVideo = ref(null);
    const _previewVideo = (src) => {
      // console.log(props.src);
      if (props.preview) {
        preVideo.value.show();
      }
    };

    onMounted(() => {});
    return {
      _previewVideo,
      preVideo,
    };
  },
});
</script>

<style lang="less" scoped>
@import "../assets/css/fit.less";
._pre-video {
  position: relative;
  width: var(--width);
  height: var(--height);
  .video {
    position: absolute;
    z-index: 1;
    width: var(--width);
    height: var(--height);
  }
  .mask {
    position: absolute;
    z-index: 2;
    width: var(--width);
    height: var(--height);
    background-color: rgba(0, 0, 0, 0.4);
    img {
      width: calc(var(--height) * 0.3);
      height: calc(var(--height) * 0.3);
    }
  }
}
</style>
