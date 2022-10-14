<template>
  <div class="industryFailed2">
    <failed :type="'crop'" />
  </div>
</template>
<script>
import { Toast } from 'vant'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import failed from '../../com/failed.vue'
import { isZLB } from '@/util/index'
export default {
  components: {
    failed
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB()
    })
    const initAction = () => {}
    onMounted(() => {
      initAction()
    })
    return {
      state
    }
  }
}
</script>

<style lang="less" scoped></style>
