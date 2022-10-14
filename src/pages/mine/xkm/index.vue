<template>
  <div class="outer">
    <img :src="info.basic && info.basic.xkm_image" alt="" @click="preview" />
    <p>点击预览小康码，预览中可长按保存</p>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ImagePreview } from 'vant'
export default {
  setup() {
    const info = ref('')
    let track = localStorage.getItem('currentUserInfo') ? JSON.parse(localStorage.getItem('currentUserInfo')) : ''
    if (track) {
      info.value = track.farmer_info
      console.log(info.value, 'info.value')
    }

    const preview = () => {
      ImagePreview([info.value.basic.xkm_image])
    }

    return {
      info,
      preview
    }
  }
}
</script>

<style lang="less" scoped>
.outer {
  overflow: hidden;
  min-height: 100vh;
  img {
    width: 100%;
    margin-top: 40%;
  }
  p {
    font-size: 26px;
    color: #666;
    margin-top: 30px;
    text-align: center;
  }
}
</style>
