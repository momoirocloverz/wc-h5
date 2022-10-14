<template>
  <div class="outer">
    <div class="box" :class="[state.ZLBFLAG ? 'fixBox' : '']" @click="toDetail1">
      <!-- <p>中蜂养殖折股量化</p> -->
      <p>中蜂产业帮扶</p>

      <!-- <van-icon name="arrow" /> -->
      <div>
        <span>了解详情</span>
        <img src="https://img.hzanchu.com/acimg/d82e06fb1928072b98b050c729aafb94.png" alt />
      </div>
    </div>
    <!-- <div
      class="box"
      :class="[state.ZLBFLAG ? 'fixBox' : '']"
      @click="toDetail('')"
    >
      <p>中蜂养殖产业联合体</p>
      <div>
        <span>了解详情</span>
        <img
          src="https://img.hzanchu.com/acimg/a858f91d62b1cfa53c036e6110488cf4.png"
          alt
        />
      </div>
    </div> -->
    <overlay :show="state.showMask">
      <loading class="loadingMargin" type="spinner" color="#fff" vertical>加载中...</loading>
    </overlay>
  </div>
</template>

<script>
import { Toast, Loading, Overlay } from 'vant'
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  components: {
    Loading,
    Overlay
  },
  setup() {
    const Router = useRouter()
    const state = reactive({
      firstLinkName: 'zhegulianghua',
      showMask: false,
      ZLBFLAG: isZLB()
    })
    onMounted(() => {
      fetchCurrent()
    })
    const toDetail = (url) => {
      if (url) {
        Router.push(url)
      } else {
        Toast('即将开放，敬请期待')
      }
    }
    const toDetail1 = () => {
      Router.push({
        name: state.firstLinkName
      })
    }
    const fetchCurrent = () => {
      state.showMask = true
      Request.fetchBeeInfo({})
        .then((res) => {
          if (res && res.code == 0) {
            // type 1表示中蜂，
            // sub_type 1表示的是低收入农户、2表示养殖大户
            if (Array.isArray(res.data)) {
              state.firstLinkName = 'zhegulianghua'
              state.showMask = false
              // state.firstLinkName = "culturalProNormalPair";
            } else {
              if (res.data.type == 1 && res.data.sub_type == 1) {
                state.showMask = false
                state.firstLinkName = 'beekeepingSupport'
              } else if (res.data.type == 1 && res.data.sub_type == 2) {
                state.showMask = true
                Request.majorInfo({})
                  .then((res) => {
                    if (res && res.code == 0) {
                      if (res.data.status == 2) {
                        state.firstLinkName = 'culturalProBigEntrance'
                      } else {
                        state.firstLinkName = 'culturalProBigSignWaiting'
                      }
                    } else {
                      Toast(res.msg)
                    }
                  })
                  .catch((err) => {
                    console.log('err', err)
                  })
                  .finally(() => {
                    state.showMask = false
                  })
              }
            }
          } else {
            Toast(res.msg)
            state.showMask = false
          }
        })
        .catch((err) => {
          state.showMask = false
          console.log('err', err)
        })
      // .finally(() => {
      //   state.showMask = false
      // })
    }

    return {
      state,
      toDetail1,
      toDetail,
      fetchCurrent
    }
  }
}
</script>

<style lang="less" scoped>
.outer {
  .loadingMargin {
    margin-top: 50%;
  }
  overflow: hidden;
  min-height: 100vh;
  padding: 0 30px;
  background: #f5f7fa;
  .box {
    height: 155px;
    margin-top: 40px;
    padding: 0 50px;
    overflow: hidden;
    p {
      font-size: 36px;
      color: #fff;
      font-weight: 600;
      margin-top: 34px;
      overflow: hidden;
    }
    div {
      width: 158px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 18px;
      background: #fff;
      font-size: 26px;
      margin-top: 26px;
      img {
        width: 12px;
        margin-left: 16px;
      }
    }
  }
  .fixBox {
    height: 12vh;
  }
  .box:nth-of-type(1) {
    background: url(https://img.hzanchu.com/acimg/83dcb91a7826effc995c2c19cd878c17.png) no-repeat;
    background-size: 100%;
    div {
      span {
        color: #e87d4d;
      }
    }
  }
  .box:nth-of-type(2) {
    background: url(https://img.hzanchu.com/acimg/181ba536996361b4706786482004b576.png) no-repeat;
    background-size: 100%;
    div {
      span {
        color: #e3ab3d;
      }
    }
  }
}
</style>
