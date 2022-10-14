<!-- 自定义安厨图片展示组件 -->
<template>
  <div class="_empty flex-column align-items-center" :style="customStyle">
    <img :src="src" class="_icon" />
    <div class="_describe fs-28">{{ title }}</div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'
import { onMounted } from '@vue/runtime-core'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '暂无内容'
    }, // 图片地址
    src: {
      type: String,
      default: 'https://img.hzanchu.com/acimg/db795aa4e6bd3bd1e1272e30c57e5b64.png'
    }, // 当前的图片地址
    customStyle: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    onMounted(() => {})
    return {}
  }
})
</script>

<style lang="less" scoped>
@import '@/assets/css/fit.less';
._empty {
  margin-top: 36px;
  padding-bottom: 36px;
  box-sizing: border-box;
  ._icon {
    width: 387px;
    height: 256px;
  }
  ._describe {
    margin-top: 40px;
    color: #666;
  }
}
</style>
