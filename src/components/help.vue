<template>
  <div class="publishComContainer">
    <div class="content" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
      <img :src="item.img">
      <p>{{item.title}}</p>
      <div>{{item.button}} ></div>
    </div>
  </div>
</template>
<script >
import { ref } from 'vue';
import { useRouter } from 'vue-router';
export default {
  setup () {
    const Router = useRouter();
    const list = ref([
      {
        title: '公益帮扶',
        button: '公益帮扶',
        img: 'https://img.hzanchu.com/acimg/2d0e4ff09537e30053de3c09ae23dce9.png',
        path: '/social-assistance?active=2'
      },
      // {
      //   title: '我要帮扶',
      //   button: '公益帮扶',
      //   img: 'https://img.hzanchu.com/acimg/06d355e49b47d0fd24a488e79b368b16.png?x-oss-process=image/resize,l_300',
      //   path: '/social-assistance?active=2'
      // }
    ])

    const toDetail = (item) => {
      if (localStorage.getItem("phone")) {
        Router.push(item.path);
      } else {
        Router.push({
          path: "/index",
          query: {
            url: encodeURIComponent('/social-assistance'),
          },
        });
      }
    }
    return {
      toDetail,
      list
    }
  }
}
</script>
<style lang="less" scoped>
.publishComContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .content {
    overflow: hidden;
    height: 166px;
    position: relative;
    border-radius: 16px;
    padding-left: 26px;
    flex: 1;
    img {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
    }
    p {
      font-size: 40px;
      font-weight: 500;
      position: absolute;
      top: 36px;
    }
    div {
      width: 141px;
      height: 36px;
      font-size: 24px;
      text-align: center;
      line-height: 36px;
      position: absolute;
      top: 94px;
    }
  }
  .content:nth-of-type(1) {
    background: linear-gradient(180deg,#faf6ec 0%, #faf5ee 100%);
    p {
      color: #A4865F;
    }
    div {
      background: url(https://img.hzanchu.com/acimg/1cabd4d1f72acc69df6e265a62f7bc0f.png) no-repeat;
      background-size: 100%;
      color: #A4865F;
    }
  } 
  .content:nth-of-type(2) {
    background: linear-gradient(180deg,#e7fbf9 0%, #eafaf7 100%);
    p {
      color: #539BA5;
    }
    div {
      background: url(https://img.hzanchu.com/acimg/b418a8e6eb39dc4cbad3efe30e40fad6.png) no-repeat;
      background-size: 100%;
      color: #539BA5;
    }
  }
}
</style>
