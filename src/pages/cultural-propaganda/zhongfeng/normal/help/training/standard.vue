<template>
  <div class="outer">
    <div class="inner">
      <div class="title">{{ state.globalData.title }}</div>
      <p class="content">{{ state.globalData.content }}</p>
    </div>
    <div class="submit" @click="submit" v-if="Route.query.is_apply == 0">
      报名
    </div>
    <van-dialog v-model:show="state.show" show-cancel-button @confirm="confirm">
      <div class="content">
        <p>是否确定报名参加</p>
        <p>{{ state.globalData && state.globalData.title }}</p>
      </div>
    </van-dialog>
    <van-popup v-model:show="state.showPopup" round>
      <div class="popup-content">
        <img
          src="https://img.hzanchu.com/acimg/16448b1899949cf76bf36fd16209ced3.png"
          alt
        />
        <p>报名成功</p>
        <p>请按规定时间参加培训！</p>
        <div class="submit" @click="okHandle">我知道了</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import { Dialog, Popup, Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  components: {
    [Dialog.Component.name]: Dialog.Component,
    [Popup.name]: Popup,
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      globalData: {},
      show: false,
      showPopup: false,
      ZLBFLAG: isZLB(),
    })
    const initAction = () => {
      let data = {
        id: Route.query.id,
      }
      Request.fetchFarmerTrainInfo(data)
        .then((res) => {
          if (res && res.code == 0) {
            if (res.data) {
              state.globalData = res.data
            }
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const submit = () => {
      state.show = true
    }
    const confirm = () => {
      let data = {
        id: Route.query.id,
      }
      Request.farmerTrainEnter(data)
        .then((res) => {
          if (res && res.code == 0) {
            state.showPopup = true
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const okHandle = () => {
      state.showPopup = false
      Router.go(-1)
    }

    onMounted(() => {
      initAction()
    })
    return {
      state,
      Route,
      submit,
      confirm,
      okHandle,
    }
  },
}
</script>

<style lang="less" scoped>
.outer {
  padding-bottom: 110px;
  box-sizing: border-box;
}
.inner {
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
}
.submit {
  // width: 690px;
  width: 92%;
  height: 70px;
  position: fixed;
  text-align: center;
  line-height: 70px;
  border-radius: 35px;
  background: #ff844e;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 32px;
  font-weight: bold;
  color: #fff;
}
.title {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  line-height: 34px;
  margin: 50px auto;
}
p {
  font-size: 28px;
  line-height: 46px;
  color: #333;
}
.popup-content {
  text-align: center;
  width: 550px;
  img {
    width: 213px;
    margin-top: 80px;
  }
  p:nth-of-type(1) {
    font-size: 36px;
    margin-top: 40px;
    color: #333;
  }
  p:nth-of-type(2) {
    font-size: 32px;
    color: #666;
    margin-top: 28px;
  }
  div {
    width: 180px;
    position: unset;
    transform: none;
    margin: 60px auto 20px;
  }
}
.content {
  text-align: center;
  p:nth-of-type(1) {
    font-size: 30px;
    color: #333;
    margin-top: 40px;
  }
  p:nth-of-type(2) {
    font-size: 34px;
    color: #ff844e;
    margin: 30px 0 40px;
  }
}
</style>
