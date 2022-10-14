<template>
  <div class="farmerSubscribeCon">
    <landSubscribe />
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
    const state = reactive({})
    onMounted(() => {})
    return {
      state,
      Router
    }
  }
}
</script>

<style lang="less" scoped>
.farmerSubscribeCon {
  box-sizing: border-box;
}
</style>
