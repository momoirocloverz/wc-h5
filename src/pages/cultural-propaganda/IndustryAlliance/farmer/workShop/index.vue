<template>
  <div class="industryAllianceWorkshopCon">
    <div class="itemCon">
      <div
        class="item"
        v-for="(item, index) in state.list"
        :key="index"
        @click="toDetail(item)"
        :style="{
          backgroundImage: 'url(' + item.bg + ')'
        }"
      >
        <span :style="{ color: item.color }">{{ item.title }}</span>
        <div :style="{ color: item.color }">{{ item.sub }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { useRouter } from 'vue-router'
import { onMounted, reactive } from 'vue'
import Request from '@/service/request'
import { Toast } from 'vant'
import { isZLB } from '@/util/index'
export default {
  setup() {
    const Router = useRouter()
    const state = reactive({
      show: false,
      list: [
        {
          bg: 'https://img.hzanchu.com/acimg/c7bbc5a7b750a21d703e81015c606ba2.png',
          title: '工艺学习',
          sub: '黄年糕制作工艺培训',
          color: '#FF7234',
          name: 'IndustryAllianceFarmerWorkCraft'
        },
        {
          bg: 'https://img.hzanchu.com/acimg/bb37ab213e8dece401f9c9ef0315ac3f.png',
          title: '委托加工',
          sub: '不提供原材料',
          color: '#EA8D0F',
          name: 'IndustryAllianceFarmerWorkEntrust'
        },
        {
          bg: 'https://img.hzanchu.com/acimg/3b600ab3c9f5833e8b383341790cfe29.png',
          title: '定制加工',
          sub: '提供原材料',
          color: '#1C96FF',
          name: 'IndustryAllianceFarmerWorkCustomize'
        }
      ],
      ZLBFLAG: isZLB()
    })
    const toDetail = (item) => {
      Router.push({ name: item.name })
    }
    const fetchUserInfo = () => {
      //   let track = localStorage.getItem('currentUserInfo') ? JSON.parse(localStorage.getItem('currentUserInfo')) : ''
    }
    onMounted(() => {
      fetchUserInfo()
    })
    return {
      state,
      toDetail
    }
  }
}
</script>

<style scoped lang="less">
.industryAllianceWorkshopCon {
  background: #fff;
  overflow: hidden;
  min-height: 100vh;
  .item {
    height: 208px;
    width: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    margin-bottom: 32px;
    // padding: 72px 48px;
    box-sizing: border-box;
    padding-top: 52px;
    padding-left: 72px;
    span {
      display: inline-block;
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    div {
      height: 64px;
      font-size: 28px;
    }
  }
}
.itemCon {
  padding-top: 48px;
  padding-left: 32px;
  padding-right: 32px;
  box-sizing: border-box;
}
</style>
