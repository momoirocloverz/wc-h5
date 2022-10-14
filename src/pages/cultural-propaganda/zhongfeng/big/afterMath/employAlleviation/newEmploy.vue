<template>
  <div class="bigNewTrainingCon">
    <div class="formCon">
      <div class="item" @click="popPicker">
        <span>工作内容</span>
        <div class="itemContent">{{ state.form.typeText }}</div>
        <van-icon name="arrow" />
      </div>
      <div class="item">
        <span>工作要求</span>
        <input
          type="text"
          maxlength="30"
          v-model.trim="state.form.demand"
          placeholder="请输入"
        />
      </div>
      <div class="item">
        <span>工作日期</span>
        <div class="timerText" @click="popCalendar">
          {{ state.form.calendarText }}
        </div>
        <img
          class="calendarImg"
          src="https://img.hzanchu.com/acimg/df2e857712c9a6f7321cb9aa7252588a.png"
        />
      </div>
      <div class="item">
        <span>工作时间</span>
        <input
          type="text"
          maxlength="30"
          v-model.trim="state.form.work_time"
          placeholder="请输入"
        />
      </div>
      <div class="item">
        <span>工作地址</span>
        <input
          type="text"
          maxlength="30"
          v-model.trim="state.form.address"
          placeholder="请输入"
        />
      </div>
    </div>
    <div class="operateCon">
      <div class="button1" @click="newAction(item)">
        {{ Route.query && Route.query.id ? '修改' : '新建' }}
      </div>
      <div class="button2" @click="cancelAction(item)">取消</div>
    </div>
    <calendar
      v-model:show="state.show"
      color="#FF844E"
      type="range"
      @confirm="confirmCalendar"
    />
    <popup position="bottom" v-model:show="state.showPicker">
      <picker
        title="单位"
        @confirm="onConfirm"
        @cancel="onCancel"
        @change="onChange"
        :columns="columns"
        :default-index="state.pickerDefault"
      />
    </popup>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { Toast, Calendar, Picker, Popup } from 'vant'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  components: {
    Calendar,
    Picker,
    Popup,
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const columns = ['割蜜', '蜂场转场', '整理蜂场']
    const state = reactive({
      ZLBFLAG: isZLB(),
      showPicker: false,
      pickerDefault: 0,
      active: 0,
      show: false,
      id: '',
      form: {
        calendarText: '请选择工作时间',
        typeText: '割蜜',
        type: '1',
        content: '',
        demand: '',
        work_date: '',
        work_time: '',
        address: '',
      },
    })
    const initAction = () => {
      if (Route.query && Route.query.id) {
        Request.fetchFarmerWorkinfo({
          id: Route.query.id,
        })
          .then((res) => {
            if (res && res.code == 0) {
              console.log(res.data)
              state.form = {
                content: res.data.content,
                demand: res.data.demand,
                work_date: res.data.work_date,
                work_time: res.data.work_time,
                address: res.data.address,
                typeText: res.data.content,
                type: res.data.type,
                calendarText: res.data.work_date,
              }
              state.id = res.data.id
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    }
    onMounted(() => {
      initAction()
    })
    const popCalendar = () => {
      state.show = true
    }
    const confirmCalendar = (value) => {
      state.form.work_date =
        dayjs(value[0]).format('YYYY-MM-DD') +
        '到' +
        dayjs(value[1]).format('YYYY-MM-DD')
      state.show = false
      state.form.calendarText =
        dayjs(value[0]).format('YYYY-MM-DD') +
        '到' +
        dayjs(value[1]).format('YYYY-MM-DD')
    }
    const newAction = () => {
      let data = {
        type: state.form.type,
        content: state.form.typeText,
        demand: state.form.demand,
        work_date: state.form.work_date,
        work_time: state.form.work_time,
        address: state.form.address,
      }
      if (Route.query && Route.query.id) {
        data.id = state.id
        Request.majorWorkEdit(data)
          .then((res) => {
            if (res && res.code == 0) {
              Toast('修改成功')
              Router.go(-1)
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        Request.majorWorkAdd(data)
          .then((res) => {
            if (res && res.code == 0) {
              Toast('添加成功')
              Router.go(-1)
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    }
    const cancelAction = () => {
      Router.go(-1)
    }
    const onChange = (value, index) => {
      state.pickerDefault = index
      console.log(value, index)
      state.form.type = index + 1
      state.form.typeText = value
    }
    const onCancel = () => {
      state.showPicker = false
    }
    const onConfirm = () => {
      state.showPicker = false
    }
    const popPicker = () => {
      state.showPicker = true
    }
    return {
      Route,
      onChange,
      onCancel,
      onConfirm,
      popPicker,
      columns,
      state,
      popCalendar,
      confirmCalendar,
      newAction,
      cancelAction,
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
  .itemContent {
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
