<template>
  <div class="outer">
    <div class="center">
      <div class="title">{{ state.globalData && state.globalData.title }}</div>
      <div class="item">
        <p>
          <van-icon name="clock-o" />
          <span>培训时间</span>
        </p>
        <p>{{ state.globalData && state.globalData.train_time }}</p>
      </div>
      <div class="item">
        <p>
          <van-icon name="location-o" />
          <span>培训地点</span>
        </p>
        <p>{{ state.globalData && state.globalData.address }}</p>
      </div>
      <div class="item">
        <p>
          <van-icon name="orders-o" />
          <span>培训内容</span>
        </p>
        <p>{{ state.globalData && state.globalData.content }}</p>
      </div>
      <div class="item">
        <p>
          <van-icon name="records" />
          <span>培训要求</span>
        </p>
        <p>{{ state.globalData && state.globalData.demand }}</p>
      </div>
    </div>
    <div
      class="submit"
      @click="submit"
      v-if="!state.timeOut && state.showSignAction"
    >
      报名
    </div>
    <div
      class="cancelButton"
      @click="popCancel"
      v-if="!state.timeOut && state.showCancelAction"
    >
      取消报名
    </div>
  </div>
  <van-dialog
    v-model:show="state.cancelShowDialog"
    show-cancel-button
    @confirm="confirmCancelAction"
  >
    <div class="content">
      <p>是否确定取消报名</p>
      <p>{{ state.globalData && state.globalData.title }}</p>
    </div>
  </van-dialog>
  <van-popup v-model:show="state.showCancelPopup" round>
    <div class="popup-content">
      <img
        src="https://img.hzanchu.com/acimg/16448b1899949cf76bf36fd16209ced3.png"
        alt
      />
      <p>取消报名成功</p>
      <div class="submit" @click="okCancelHandle">我知道了</div>
    </div>
  </van-popup>
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
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import { Dialog, Popup, Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import dayjs from 'dayjs'
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
      show: false,
      showPopup: false,
      globalData: {},
      showCancelAction: false,
      cancelShowDialog: false,
      showCancelPopup: false,
      showSignAction: false,
      timeOut: false,
      ZLBFLAG: isZLB(),
    })
    const forInitAction = (res) => {
      if (res.data) {
        state.globalData = res.data
        let sourceTime = new Date(
          state.globalData.train_time.replace(/-/g, '/')
        ).getTime()
        let now = Date.now()
        if (now - sourceTime < 0) {
          state.timeOut = false
        } else {
          state.timeOut = true
        }
        if (Route.query.is_apply == 0) {
          state.showSignAction = true
        } else {
          state.showCancelAction = true
        }
      }
    }
    const initAction = () => {
      let data = {
        id: Route.query.id,
      }
      Request.fetchFarmerTrainInfo(data)
        .then((res) => {
          if (res && res.code == 0) {
            forInitAction(res)
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    onMounted(() => {
      initAction()
    })
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
    const confirmCancelAction = () => {
      let data = {
        id: Route.query.id,
      }
      Request.beeFarmerTrainApplyCancel(data)
        .then((res) => {
          if (res && res.code == 0) {
            state.showCancelPopup = true
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const popCancel = () => {
      state.cancelShowDialog = true
    }
    const okCancelHandle = () => {
      state.showCancelPopup = false
      Router.go(-1)
    }
    const okHandle = () => {
      state.showPopup = false
      Router.go(-1)
    }
    return {
      state,
      submit,
      confirm,
      okHandle,
      popCancel,
      confirmCancelAction,
      okCancelHandle,
      Route,
    }
  },
}
</script>

<style lang="less" scoped>
.outer {
  overflow: hidden;
  min-height: 100vh;
  position: relative;
}
.center {
  // width: 630px;
  width: 84%;
  overflow: hidden;
  margin: 30px auto 100px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
  padding: 0 30px 40px;
  background: #fff;
  border-radius: 10px;
  .title {
    font-size: 36px;
    font-weight: bold;
    color: #333;
    line-height: 40px;
    margin-top: 40px;
  }
  .item {
    margin-top: 50px;
    p:nth-of-type(1) {
      display: flex;
      align-items: center;
      color: #999;
      .van-icon {
        font-size: 40px;
      }
      span {
        margin-left: 14px;
        font-size: 28px;
      }
    }
    p:nth-of-type(2) {
      font-size: 30px;
      color: #333;
      width: 538px;
      margin: 10px 0 0 50px;
      line-height: 50px;
    }
  }
}
.cancelButton {
  // width: 690px;
  width: 92%;
  height: 70px;
  position: fixed;
  text-align: center;
  line-height: 70px;
  border-radius: 35px;
  border: 1px solid #ff844e;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 32px;
  font-weight: bold;
  color: #ff844e;
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
</style>
