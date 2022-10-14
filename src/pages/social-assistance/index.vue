<template>
  <div class="social_assistance">
    <!-- <div class="box_wrap" v-for="item in navList" :key="item.name" @click="toDetail(item)">
      <div class="box" :style="{ background: item.bgColor }"></div>
      <p>{{ item.name }}</p>
      <p>{{ item.desc }}</p>
      <p class="borerItem" :style="{ color: item.color }">点击进入</p>
      <img :src="item.icon" alt="" />
    </div> -->
    <isEmpty></isEmpty>
  </div>
</template>

<script>
import { ref } from 'vue'; 
import { Toast } from 'vant';
import { useRouter, useRoute } from 'vue-router';
import isEmpty from '@/components/isEmpty';
export default {
  components: {
    isEmpty
  },
  setup () {
    const route = useRoute();
    const list1 = [
      {
        name: '低保救助',
        desc: '低保救助',
        icon: 'https://img.hzanchu.com/acimg/7b7b75c177f3cb593351c5bd58d35909.png',
        bgColor: 'conic-gradient(#33e695 0%, #1cd883 100%)',
        color: '#1DD883',
        route: 'socialAssistanceBasicLiving',
      },
      {
        name: '紧急救助',
        desc: '紧急救助',
        icon: 'https://img.hzanchu.com/acimg/3bdb0afdd053b87f0bc1cee7bd075e88.png',
        bgColor: 'conic-gradient(#f68c5e 0%, #f6804b 100%)',
        color: '#F6804C',
        route: 'socialAssistanceEmergency'
      },
      {
        name: '临时救助',
        desc: '临时救助',
        icon: 'https://img.hzanchu.com/acimg/4796041bf45ae6c74c52d5df3b4c36d4.png',
        bgColor: 'conic-gradient(#9ee46a 0%, #80d044 100%)',
        color: '#81D145',
        route: 'socialAssistanceTemporary'
      },
      {
        name: '社会救助活动',
        desc: '社会救助活动',
        icon: 'https://img.hzanchu.com/acimg/f740f2314afe917c3e7571d89926120d.png',
        bgColor: 'conic-gradient(#59b8ff 0%, #44acfc 100%)',
        color: '#45ADFC',
        route: 'socialAssistanceActivity',
      }
    ]
    const list2 = [
      {
        name: '社会组织',
        desc: '社会组织',
        icon: 'https://img.hzanchu.com/acimg/ef4c57255a2468380e96ffb7c3c49401.png',
        bgColor: 'conic-gradient(#33e695 0%, #1cd883 100%)',
        color: '#1DD883',
        route: '',
      },
      {
        name: '公益组织',
        desc: '公益组织',
        icon: 'https://img.hzanchu.com/acimg/40b31a509158024aa0d5d76499f55910.png',
        bgColor: 'conic-gradient(#f68c5e 0%, #f6804b 100%)',
        color: '#F6804C',
        route: ''
      },
      {
        name: '慈善机构',
        desc: '慈善机构',
        icon: 'https://img.hzanchu.com/acimg/087e0a1e83037f79973a8f1757924ae3.png',
        bgColor: 'conic-gradient(#9ee46a 0%, #80d044 100%)',
        color: '#81D145',
        route: ''
      },
      {
        name: '志愿者',
        desc: '志愿者',
        icon: 'https://img.hzanchu.com/acimg/472ae7836cfd6e64f20841cdf131b5fe.png',
        bgColor: 'conic-gradient(#59b8ff 0%, #44acfc 100%)',
        color: '#45ADFC',
        route: '',
      }
    ]
    const navList = ref([]);
    console.log(route.query.active, 'route.query.active')
    if(route.query.active === '1') {
      navList.value = list1;
    } else {
      navList.value = list2;
    }
    const Router = useRouter()
    const toDetail = (item) => {
      if (item.route) {
        Router.push({
          name: item.route
        })
      } else {
        Toast('即将开放，敬请期待')
      }
    }


    return {
      navList,
      toDetail
    }
  }
}
</script>

<style scoped lang="less">
.social_assistance {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 34px 20px 0;
}
.box_wrap {
  position: relative;
  margin-bottom: 34px;
  border-radius: 20px;
  width: 332px;
  height: 230px;
  overflow: hidden;
  p {
    position: relative;
    color: #fff;
    font-size: 34px;
    font-weight: 500;
    margin-left: 30px;
    &:nth-of-type(1) {
      padding-top: 45px;
    }
    &:nth-of-type(2) {
      font-size: 30px;
      padding-top: 20px;
    }
    &:nth-of-type(3) {
      text-align: center;
      height: 34px;
      width: 126px;
      line-height: 34px;
      margin-top: 30px;
      background: #fff;
      font-size: 22px;
      border-radius: 6px;
    }
  }
  img {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 116px;
  }
  .box {
    position: absolute;
    z-index: 0;
    top: -100px;
    left: -100px;
    width: 532px;
    height: 430px;
    opacity: 0.9;
    border-radius: 15px;
    transform: rotate(30deg);
    background: conic-gradient(#9ee46a 0%, #80d044 100%);
  }
}
.box_wrap:nth-of-type(1) {
  img {
    width: 100px;
  }
}
.is-empty {
  margin-top: 30%;
}
</style>
