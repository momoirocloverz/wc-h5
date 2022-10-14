<template>
  <div class="capSubscribeCon">
    <landSubscribe type="crop" />
  </div>
</template>
<script>
import landSubscribe from '../../com/landSubscribe.vue'
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
export default {
  components: {
    landSubscribe
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    // 初始化
    const init = () => {}
    onMounted(() => {
      init()
    })
    return {
      Router
    }
  }
}
</script>

<style lang="less" scoped>
.capSubscribeCon {
  box-sizing: border-box;
}
</style>
