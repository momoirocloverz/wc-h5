<template>
  <div class="outer">
    <div class="time" @click="show = true">
      <div class="info">您可以到养殖厂进行现场培训，请选择预约时间：</div>
      <div class="realTime">
        <span>预约时间</span>
        <span :style="{ color: selectDate ? '#333' : '#ccc' }">
          {{ selectDate || '请选择预约时间' }}
        </span>
        <van-icon name="notes-o" />
      </div>
    </div>
    <div class="btn">
      <div class="apply" @click="apply">申请</div>
      <div class="cancel" @click="checkRecord">申请记录</div>
    </div>
  </div>
  <!-- 日期选择 -->
  <van-popup v-model:show="show" round position="bottom">
    <van-datetime-picker
      v-model="currentDate"
      type="datetime"
      title="选择年月日"
      :min-date="state.minDate"
      :max-date="state.maxDate"
      @confirm="confirmDate"
      @cancel="cancelAction"
    />
  </van-popup>
  <van-popup v-model:show="showPopup" round>
    <div class="popup-content">
      <img
        src="https://img.hzanchu.com/acimg/5c651f9cd1166d6be001ffbe03034a64.png"
        alt
      />
      <p>申请中</p>
      <p>养殖大户将在三小时内确定， 请耐心等待。</p>
      <div class="submit" @click="okHandle">我知道了</div>
    </div>
  </van-popup>
</template>

<script>
import { reactive, ref } from 'vue'
import { Popup, DatetimePicker, Toast } from 'vant'
import { useRouter } from 'vue-router'
import Request from '@/service/request'
import dayjs from 'dayjs'
import { isZLB } from '@/util/index'
export default {
  components: {
    [Popup.name]: Popup,
    [DatetimePicker.name]: DatetimePicker,
  },
  setup() {
    const Router = useRouter()
    const show = ref(false)
    const showPopup = ref(false)
    const selectDate = ref('')
    const state = reactive({
      minDate: new Date(),
      maxDate: new Date(2027, 10, 1),
      ZLBFLAG: isZLB(),
    })
    const currentDate = ref(new Date())

    const apply = () => {
      if (selectDate.value) {
        Request.farmerTrainApply({
          apply_at: selectDate.value,
        })
          .then((res) => {
            if (res && res.code == 0) {
              showPopup.value = true
              selectDate.value = ''
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        Toast('请选择时间')
      }
    }

    const okHandle = () => {
      showPopup.value = false
      Router.go(-1)
    }

    const confirmDate = (val) => {
      let after = dayjs(val).format('YYYY-MM-DD HH:mm:ss')
      console.log(after)
      selectDate.value = after
      show.value = false
    }
    const cancelAction = () => {
      show.value = false
    }

    const checkRecord = () => {
      Router.push({
        name: 'farmerTrainRecord',
      })
    }

    return {
      state,
      show,
      currentDate,
      showPopup,
      okHandle,
      apply,
      cancelAction,
      confirmDate,
      selectDate,
      checkRecord,
    }
  },
}
</script>

<style lang="less" scoped>
.outer {
  min-height: 100vh;
  overflow: hidden;
}
.time {
  background: #fff;
  .realTime {
    display: flex;
    align-items: center;
  }
  .info {
    font-size: 30px;
    text-align: left;
    color: #333;
    margin-bottom: 45px;
  }
  padding: 40px 30px;
  margin-top: 16px;
  span:nth-of-type(1) {
    font-size: 28px;
    color: #333;
  }
  span:nth-of-type(2) {
    font-size: 28px;
    margin-left: auto;
  }
  .van-icon {
    font-size: 40px;
    color: #ccc;
    margin-left: 10px;
  }
}
.btn {
  display: flex;
  align-items: center;
  margin-top: 80px;
  padding: 0 50px;
  justify-content: space-between;
  div {
    width: 300px;
    height: 70px;
    text-align: center;
    line-height: 70px;
    font-size: 32px;
    font-weight: bold;
    color: #fff;
    border-radius: 70px;
  }
  .apply {
    background: #ff844e;
    border: 1px solid #ff844e;
  }
  .cancel {
    color: #ff844e;
    background-color: #fff;
    border: 1px solid #ff844e;
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
    height: 70px;
    text-align: center;
    line-height: 70px;
    border-radius: 35px;
    background: #ff844e;
    font-size: 32px;
    font-weight: bold;
    color: #fff;
    margin: 60px auto 20px;
  }
}
</style>
