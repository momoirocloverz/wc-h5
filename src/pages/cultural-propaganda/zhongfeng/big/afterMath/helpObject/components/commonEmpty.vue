<template>
  <div class="bigHelpObjectEmptyCon">
    <div class="imgCon">
      <img
        src="https://img.hzanchu.com/acimg/db795aa4e6bd3bd1e1272e30c57e5b64.png"
      />
    </div>
    <div class="describe">暂无内容</div>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      markImg:
        'https://img.hzanchu.com/acimg/b33478a3358bc6b93405d4d5de43ecc6.png',
    })
    return {
      state,
    }
  },
}
</script>
<style lang="less" scoped>
.bigHelpObjectEmptyCon {
  .imgCon {
    width: 387px;
    height: 256px;
    margin: 0 auto;
  }
  img {
    height: 100%;
    width: 100%;
  }
  .describe {
    font-size: 36px;
    line-height: 46px;
    color: #333;
    margin-top: 40px;
    text-align: center;
  }
}
</style>
