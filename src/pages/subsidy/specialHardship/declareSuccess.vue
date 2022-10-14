<template>
  <div class="outer">
    <img src="https://img.hzanchu.com/acimg/911b7b1bc83e1e550d2f61ff2da5b52e.png" alt="">
    <p>提交成功</p>
    <p>请等待审核，<span>{{time}}秒</span>后自动返回</p>
    <div class="btn" @click="toBack">返回</div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router';
export default {
  setup() {
    const Router = useRouter();
    const time = ref(5);
    const setInter = ref('');

    setInter.value = setInterval(() => {
      time.value--;
      if(time.value === 0) {
        clearInterval(setInter.value);
        Router.replace('/subsidy/list');
      }
    }, 1000);

    const toBack = () => {
      Router.replace('/subsidy/list');
    }

    onUnmounted(() => {
      clearInterval(setInter.value);
    })

    return {
      time,
      toBack
    }
  }
}
</script>

<style lang="less" scoped>
  .outer {
    overflow: hidden;
    text-align: center;
    min-height: 100vh;
    background: #fff;
    img {
      width: 279px;
      margin-top: 60px;
    }
    p:nth-of-type(1) {
      font-size: 40px;
      color: #FF834E;
      font-weight: 600;
      margin-top: 49px;
    }
    p:nth-of-type(2) {
      font-size: 30px;
      color: #666;
      margin-top: 19px;
      span {
        color: #FF834E;
      }
    }
    .btn {
    //   width: 688px;
      width:92%;
      height: 78px;
      border: 2px solid #FF834E;
      border-radius: 39px;
      font-size: 30px;
      color: #FF834E;
      text-align: center;
      line-height: 78px;
      margin: 40px auto 0;
    }
  }
</style>