<template>
  <div class="farmerSubscribeCon">
    <van-tabs v-model:active="state.current" @click-tab="onClickTab" class="fixedTab" :class="[state.ZLBFitForOld ? 'tabsOld' : '']">
      <van-tab title="工艺学习"></van-tab>
      <van-tab title="委托加工"></van-tab>
      <van-tab title="定制加工"></van-tab>
    </van-tabs>
    <First v-if="state.current == 0" />
    <Second v-if="state.current == 1" />
    <Third v-if="state.current == 2" />
  </div>
</template>
<script>
import First from './first.vue'
import Second from './second.vue'
import Third from './third.vue'
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
export default {
  components: {
    First,
    Second,
    Third
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      current: 0,
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
    })
    const onClickTab = (val) => {
      Router.replace({
        name: 'minePre',
        query: {
          tab: val.name
        }
      })
    }
    const init = () => {
      if (Route.query && Route.query.tab) {
        state.current = +Route.query.tab
      }
    }
    onMounted(() => {
      init()
    })
    return {
      state,
      onClickTab,
      Router
    }
  }
}
</script>

<style lang="less" scoped>
.farmerSubscribeCon {
  box-sizing: border-box;
  padding-top: 80px;
}
.fixedTab {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 5;
}
</style>
<style lang="less">
.farmerSubscribeCon {
  .tabsOld {
    .van-tab__text {
      font-size: 40px !important;
      font-weight: 800;
    }
  }
}
</style>
