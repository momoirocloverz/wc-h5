<template>
  <div class="outer">
    <img src="https://img.hzanchu.com/acimg/d370d2ccc9b5e7c55528caa655b48779.png" alt="" @click="toDetail">
    <img src="https://img.hzanchu.com/acimg/be474c0ec490d5c21c5de87fe7b91030.png" alt="" @click="toDetail">
  </div>
</template>

<script>
import { Toast } from 'vant';
export default {
  setup() {
    const toDetail = () => {
      Toast('暂未开放，敬请期待');
    }

    return {
      toDetail
    }
  }
}
</script>

<style lang="less" scoped>
  .outer {
    padding: 0 30px;
    overflow: hidden;
    img {
      width: 100%;
      margin-top: 40px;
    }
  }
</style>