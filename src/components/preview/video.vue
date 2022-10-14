<template>
  <van-popup
    :show="showVideo"
    position="center"
    @click-overlay="hide"
    zIndex="9001"
    :overlay-style="{ background: 'rgba(0, 0, 0, 0.9)' }"
  >
    <div
      v-if="showVideo"
      class="preview-video flex-row align-items-center justify-content-center"
    >
      <video :src="src" autoplay controls></video>
    </div>
  </van-popup>
</template>

<script>
import { ref } from "vue";
import { Toast } from "vant";

export default {
  props: {
    zIndex: {
      type: Number,
    },
    src: {
      type: String,
    },
  },
  setup(props) {
    const showVideo = ref(false);

    const show = () => {
      if (!props.src || props.src == "") {
        Toast("无法播放当前视频！");
        return;
      }
      console.log("show");
      showVideo.value = true;
    };
    const hide = () => {
      showVideo.value = false;
    };

    return {
      show,
      hide,
      showVideo,
    };
  },
};
</script>

<style scoped lang="less">
@import "../../assets/css/fit.less";
.preview-video {
  width: 100vw;
  height: 75vh;
  background-color: #000;
  video {
    width: 100%;
    height: 100%;
    background-color: #000;
  }
}
</style>
