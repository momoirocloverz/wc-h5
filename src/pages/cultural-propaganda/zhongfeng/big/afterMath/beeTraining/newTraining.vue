<template>
  <div class="bigNewTrainingCon">
    <div class="formCon">
      <div class="item">
        <span>培训主题</span>
        <input
          type="text"
          maxlength="40"
          v-model.trim="state.form.title"
          placeholder="请输入"
        />
      </div>
      <div class="item">
        <span>培训内容</span>
        <input
          type="text"
          maxlength="50"
          v-model.trim="state.form.content"
          placeholder="请输入"
        />
      </div>
      <div class="item">
        <span>培训时间</span>
        <div class="timerText" @click="popCalendar">
          {{ state.form.calendarText }}
        </div>
        <img
          class="calendarImg"
          src="https://img.hzanchu.com/acimg/df2e857712c9a6f7321cb9aa7252588a.png"
        />
      </div>
      <div class="item">
        <span>培训地点</span>
        <input
          type="text"
          maxlength="50"
          v-model.trim="state.form.address"
          placeholder="请输入"
        />
      </div>
      <div class="item">
        <span>培训要求</span>
        <input
          type="text"
          maxlength="50"
          v-model.trim="state.form.demand"
          placeholder="请输入"
        />
      </div>
    </div>
    <div class="operateCon">
      <div class="button1" @click="newAction(item)">新建</div>
      <div class="button2" @click="cancelAction(item)">取消</div>
    </div>
    <van-popup v-model:show="state.show" round position="bottom">
      <van-datetime-picker
        v-model="state.form.date"
        type="datetime"
        title="选择年月日"
        :min-date="state.minDate"
        :max-date="state.maxDate"
        @confirm="confirmDate"
        @cancel="cancelDate"
      />
    </van-popup>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { Toast, Popup, DatetimePicker } from 'vant'
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { isZLB } from '@/util/index'
import Request from '@/service/request'
export default {
  components: {
    [Popup.name]: Popup,
    [DatetimePicker.name]: DatetimePicker,
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      active: 0,
      show: false,
      minDate: new Date(),
      maxDate: new Date(2027, 10, 1),
      form: {
        calendarText: '请选择培训时间',
        date: '',
        title: '',
        content: '',
        address: '',
        demand: '',
      },
    })
    const initAction = () => {
      //   console.log('Route', Route.query)
    }
    onMounted(() => {
      initAction()
    })
    const popCalendar = () => {
      state.show = true
    }
    const confirmDate = (val) => {
      state.form.date = dayjs(val).format('YYYY-MM-DD HH:mm:ss')
      state.show = false
      state.form.calendarText = state.form.date
    }
    const cancelDate = () => {
      state.show = false
    }
    const newAction = () => {
      if (!state.form.title) {
        return Toast.fail('请填写培训主题')
      }
      if (!state.form.content) {
        return Toast.fail('请填写培训内容')
      }
      if (!state.form.date) {
        return Toast.fail('请填写培训时间')
      }
      if (!state.form.address) {
        return Toast.fail('请填写培训地点')
      }
      if (!state.form.demand) {
        return Toast.fail('请填写培训要求')
      }
      let data = {
        type: 4,
        title: state.form.title,
        content: state.form.content,
        train_time: state.form.date,
        address: state.form.address,
        demand: state.form.demand,
      }
      Request.majorWorkTrainAdd(data)
        .then((res) => {
          if (res && res.code == 0) {
            console.log(res.data)
            Router.go(-1)
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const cancelAction = () => {
      Router.go(-1)
    }
    return {
      state,
      popCalendar,
      newAction,
      cancelAction,
      confirmDate,
      cancelDate,
    }
  },
}
</script>

<style lang="less" scoped>
.bigNewTrainingCon {
  box-sizing: border-box;
}
.operateCon {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  margin-top: 80px;
  padding-left: 40px;
  padding-right: 40px;
  box-sizing: border-box;
}
.button1 {
  width: 300px;
  height: 70px;
  background: linear-gradient(#ff844e 0%, #fe6d56 100%);
  border-radius: 35px;
  font-size: 32px;
  color: #fff;
  text-align: center;
  line-height: 70px;
  box-sizing: border-box;
}
.button2 {
  width: 300px;
  height: 70px;
  background: #d1d1d1;
  color: #fff;
  border-radius: 33px;
  font-size: 32px;
  text-align: center;
  line-height: 70px;
}
.formCon {
  background-color: #fff;
  box-sizing: border-box;
  margin-bottom: 15px;
  padding-left: 30px;
  padding-right: 30px;
}
.item {
  height: 86px;
  display: flex;
  align-items: center;
  align-content: center;
  border-bottom: 2px solid #ebebeb;
  &:last-child {
    border: none;
  }
  span {
    font-size: 28px;
    color: #333;
    width: 246px;
  }
  span:nth-of-type(2) {
    width: auto;
    margin-left: auto;
  }
  input {
    width: 410px;
    height: 100%;
    text-align: right;
    font-size: 28px;
    color: #333;
    margin-left: auto;
  }
  .timerText {
    width: 410px;
    height: 100%;
    text-align: right;
    font-size: 28px;
    color: #333;
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
    align-content: center;
    align-items: center;
  }
  .calendarImg {
    width: 34px;
    height: 34px;
    margin-left: 20px;
    vertical-align: middle;
  }
  .van-icon {
    font-size: 30px;
    margin-left: 16px;
    color: #666;
  }
}
</style>
