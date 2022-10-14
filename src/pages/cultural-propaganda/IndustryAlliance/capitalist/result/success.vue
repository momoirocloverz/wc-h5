<template>
  <div class="industry2sucess">    
    <success :type="'crop'" />
  </div>
</template>
<script>
import { Toast } from 'vant'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import success from '../../com/success.vue'
import { isZLB } from '@/util/index'
export default {
  components: {
    success
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
