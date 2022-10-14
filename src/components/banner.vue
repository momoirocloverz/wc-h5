<template>
  <van-swipe
    class="my-swipe"
    :autoplay="5000"
    indicator-color="white"
    lazy-render
  >
    <van-swipe-item
      v-for="(item, i) in state.list"
      :key="i"
      @click="toDetail(item)"
    >
      <img :src="item.image" alt />
    </van-swipe-item>
  </van-swipe>
</template>

<script>
import { reactive, onBeforeMount } from 'vue'
import { Toast } from 'vant'
import { isZLB } from '@/util/index'
import Request from '@/service/request.js'
export default {
  setup() {
    const state = reactive({
      ZLBFLAG: isZLB(),
      list: [],
    })
    const initRequest = () => {
      Request.getBanner().then((res) => {
        if (res.code === 0) {
          state.list = res.data
        }
      })
    }

    onBeforeMount(() => {
      initRequest()
    })

    const toDetail = (item) => {
      if (item.redirect_url.indexOf('http') != -1) {
        if (state.ZLBFLAG) {
          ZWJSBridge.openLink({
            url: item.redirect_url,
          })
        } else {
          window.location.href = item.redirect_url
        }
      } else {
        return
      }
    }

    return {
      toDetail,
      state,
      initRequest,
    }
  },
}
</script>

<style lang="less" scoped>
.my-swipe {
  height: 320px;
  img {
    position: absolute;
    left: 0;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
