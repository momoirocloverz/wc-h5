<template>
  <div class="outer">
    <div class="center">
      <div class="title">{{ state.global.content }}</div>
      <div class="date">工作日期：{{ state.global.work_date }}</div>
      <div class="item">
        <p>
          <van-icon name="clock-o" />
          <span>工作时间</span>
        </p>
        <p>{{ state.global.work_time }}</p>
      </div>
      <div class="item">
        <p>
          <van-icon name="location-o" />
          <span>工作地址</span>
        </p>
        <p>{{ state.global.address }}</p>
      </div>
      <div class="item">
        <p>
          <van-icon name="records" />
          <span>工作要求</span>
        </p>
        <p>{{ state.global.demand }}</p>
      </div>
    </div>
    <div class="submit" @click="submit" v-if="Route.query.is_apply == 0">
      报名
    </div>
  </div>

  <van-dialog v-model:show="state.show" show-cancel-button @confirm="confirm">
    <div class="content">
      <p>是否确定报名参加</p>
      <p>{{ state.global.content }}</p>
    </div>
  </van-dialog>
  <van-popup v-model:show="state.showPopup" round>
    <div class="popup-content">
      <img
        src="https://img.hzanchu.com/acimg/16448b1899949cf76bf36fd16209ced3.png"
        alt
      />
      <p>报名成功</p>
      <p>请按规定时间前往工作！</p>
      <div class="submit" @click="okHandle">我知道了</div>
    </div>
  </van-popup>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
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
    const state = reactive({
      ZLBFLAG: isZLB(),
      show: false,
      showPopup: false,
      global: {},
    })
    const Router = useRouter()
    const Route = useRoute()
    const initAction = () => {
      let data = {
        id: Route.query.id,
      }
      Request.fetchFarmerWorkinfo(data)
        .then((res) => {
          if (res && res.code == 0) {
            console.log(res.data)
            state.global = res.data
          } else {
            Toast({
              message: res.msg,
              position: 'center',
            })
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
        id: state.global.id,
      }
      Request.farmerWorkenter(data)
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
    }
    return {
      state,
      submit,
      Route,
      confirm,
      okHandle,
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
  .date {
    font-size: 28px;
    color: #666;
    line-height: 28px;
    margin-top: 24px;
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
