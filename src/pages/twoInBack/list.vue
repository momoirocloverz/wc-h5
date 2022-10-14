<template>
  <div class="outer">
    <div v-for="item in list" :key="item.title" @click="toDetail">
      <img :src="item.image" alt="">
      <p>{{item.title}}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Toast } from 'vant'
export default {
  setup() {
    const list = ref([
      { image: 'https://img.hzanchu.com/acimg/37eb552d9b981fd304a5cdee0e89ec69.png', title: '科技进乡村' },
      { image: 'https://img.hzanchu.com/acimg/4ef87a92df3888b815aa9777d43a9e02.png', title: '资金进乡村' },
      { image: 'https://img.hzanchu.com/acimg/60c13a9768879d8b3740634f0c4289dc.png', title: '青年回农村' },
      { image: 'https://img.hzanchu.com/acimg/6004f3db8d6ba2d9cca7dd1808b2a252.png', title: '乡贤回农村' }
    ])

    const toDetail = () => {
      Toast('即将开放，敬请期待');
    }

    return {
      toDetail,
      list
    }
  }
}
</script>

<style lang="less" scoped>
  .outer {
    padding: 0 30px;
    div {
      height: 224px;
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      margin-top: 30px;
      img {
        width: 100%;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      p {
        font-size: 42px;
        color: #fff;
        font-weight: 700;
        line-height: 46px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 116px;
      }
    }
  }

</style>

