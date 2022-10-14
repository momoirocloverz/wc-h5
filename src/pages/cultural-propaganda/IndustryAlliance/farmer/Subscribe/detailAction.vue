<template>
  <div class="farmerSubscribeActionCon">
    <div class="topCon">
      <div class="gradientBg"></div>
      <div class="dashBouter">
        <div class="dashBoard">
          <div class="topFirst">
            <div>基本信息</div>
          </div>
          <div class="topSecond">
            <div class="setTextWidth">我的土地经营面积：</div>
            <span>{{ state.currentStatusData && state.currentStatusData.area }}亩</span>
          </div>
          <div class="topThird">
            <div class="setTextWidth">认种总面积：</div>
            <span>{{ state.info.area }}亩</span>
          </div>
          <div class="topFourth">
            <div  class="setTextWidth">剩余面积：</div>
            <span>{{ state.info.surplus_area }}亩</span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="specialText">预估收益</div>
      <div class="formCon">
        <van-form @failed="onFailed" @submit="onSubmit">
          <div class="flexCon whiteBg">
            <van-field
              required
              class="resetWidth"
              input-align="left"
              v-model="form2.area"
              name="area"
              label="认种面积"
              maxlength="20"
              :rules="state.validator.area"
              placeholder="请输入认种面积"
              @change="fileChange"
              type="number"
            />
            <span class="addonText">亩</span>
          </div>
          <div class="flexCon whiteBg">
            <van-field input-align="left" class="resetWidth" v-model="form2.pre1" name="card" label="预估收益" maxlength="20" readonly placeholder="根据认种面积自动计算" />
            <span class="addonText">元</span>
          </div>

          <div class="flexCon whiteBg">
            <van-field input-align="left" class="resetWidth" readonly v-model="form2.pre2" name="mobile" label="预付款" placeholder="默认为预估收益的10%" />
            <span class="addonText">元</span>
          </div>

          <div class="bottomCon fixBottom">
            <van-button block class="fakeBtn ableBtn" type="primary" native-type="submit">提交</van-button>
          </div>
        </van-form>
      </div>
    </div>
    <div>
      <div class="specialText">电子协议</div>
      <div class="flexBetween whiteBg withPadding32 withBottomBorder">
        <div class="agreementText">《产业联盟土地认种协议》</div>
        <div class="flexArrow" @click="toAgreement">
          <div>去签署</div>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
    <!-- :style="{
        backgroundImage: 'url(' + state.signsInfo.url + ')'
      }" -->
    <div class="signPicArea" v-if="state.signsInfo">
      <img :src="state.signsInfo.url" />
    </div>
  </div>
</template>
<script>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request.js'
import { Toast } from 'vant'
export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      info: {},
      validator: {
        area: [{ trigger: 'onBlur', message: '请输入', required: true }]
      },
      signsInfo: null,
      currentStatusData: null
    })
    const form2 = reactive({
      pic: [],
      name: '',
      area: '',
      pre1: '',
      pre2: ''
    })
    const init = () => {
      let sign = sessionStorage.getItem('signName1')
      if (sign) {
        let content = JSON.parse(sessionStorage.getItem('signName1'))
        state.signsInfo = content
      }
      let area = sessionStorage.getItem('signAreaValue1')
      if (area) {
        form2.area = +area
        form2.pre1 = moneyFormat(form2.area * 800 * 6)
        form2.pre2 = moneyFormat(form2.area * 800 * 6 * 0.1)
      }

      Request.IndustryIndex({})
        .then((res) => {
          if (res && res.code === 0) {
            state.currentStatusData = res.data.farmer
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
      if (Route.query && Route.query.id) {
        Request.IndustrySeedInfo({
          id: Route.query.id
        })
          .then((res) => {
            if (res && res.code == 0) {
              state.info = res.data
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
    onMounted(() => {
      init()
    })
    const onFailed = (err) => {
      console.log(err)
    }
    const onSubmit = (params) => {
      if (state.signsInfo) {
        let data = {
          area: form2.area,
          seed_id: Route.query.id
        }
        data.sign_img_id = state.signsInfo.id
        Request.IndustrySeedSubmit(data).then((res) => {
          if (res.code === 0) {
            console.log(res.data)
            Toast('提交成功')
            Router.go(-1)
          } else {
            Toast(res.msg)
          }
        })
      } else {
        Toast('请填写签名')
      }
    }
    const toAgreement = () => {
      Router.push({
        name: 'IndustryAllianceFarmerAgreement',
        query: {
          id: Route.query.id
        }
      })
    }
    const moneyFormat = (value) => {
      if (value || value == 0) {
        let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2)
        return fix
      }
    }
    const fileChange = (e) => {
      let bridge = e.target.value
      let high = +state.info.high_area
      let low = +state.info.low_area
      let able = +state.currentStatusData.area
      console.log(high, low, able)
      if (isNaN(+bridge)) {
        form2.area = ''
        form2.pre1 = ''
        form2.pre2 = ''
      } else {
        if (+bridge > high || +bridge < low) {
          Toast('认种面积需大于等于' + low + '小于等于' + high)
          form2.area = ''
          form2.pre1 = ''
          form2.pre2 = ''
        } else if (+bridge > able) {
          Toast('认种面积需小于等于土地经营面积')
          form2.area = ''
          form2.pre1 = ''
          form2.pre2 = ''
        } else {
          let after = (+bridge).toFixed(2)
          form2.area = +after
          sessionStorage.setItem('signAreaValue1', form2.area)
          form2.pre1 = moneyFormat(form2.area * 800 * 6)
          form2.pre2 = moneyFormat(form2.area * 800 * 6 * 0.1)
        }
      }
    }
    return {
      fileChange,
      toAgreement,
      onFailed,
      onSubmit,
      state,
      Router,
      form2
    }
  }
}
</script>

<style lang="less" scoped>
.topFirst {
  font-size: 30px;
  height: 30px;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
}
.topSecond {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  margin-bottom: 22px;
  div {
    font-size: 28px;
    color: #999;
  }
  span {
    font-size: 28px;
    color: #333;
  }
}
.topThird {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  margin-bottom: 22px;
  div {
    font-size: 28px;
    color: #999;
  }
  span {
    font-size: 28px;
    color: #333;
  }
}
.topFourth {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  div {
    font-size: 28px;
    color: #999;
  }
  span {
    font-size: 28px;
    color: #333;
  }
}
.withBottomBorder {
  border-bottom: 1px solid #e8e9ec;
}
.setTextWidth {
    width: 290px;
}
.signPicArea {
  width: 100%;
  box-sizing: border-box;
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: 50px;
  padding-right: 50px;
  //   height: 500px;
  //   background-repeat: no-repeat;
  //   background-position: center;
  //   background-size: cover;
  display: flex;
  justify-content: center;
  background-color: #fff;
  img {
    width: 300px;
  }
}
.bottomCon {
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  padding-left: 90px;
  padding-right: 90px;
  padding-top: 14px;
  box-sizing: border-box;
  width: 100%;
  height: 100px;
  box-shadow: 1px 5px 46px 5px rgba(7, 8, 7, 0.1);
}
.fakeBtn {
  font-size: 32px;
  height: 70px;
  border-radius: 35px;
  background-color: #d1d1d1;
  text-align: center;
  line-height: 70px;
  color: #fff;
}
.fixBottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.ableBtn {
  background: linear-gradient(to right, #ff844e 0%, #fe6d56 100%);
  border: none;
}
.withPadding32 {
  box-sizing: border-box;
  padding: 32px;
  padding-left: 20px;
}
.agreementText {
  font-size: 32px;
  color: #333;
}
.flexArrow {
  display: flex;
  justify-content: flex-end;
  font-size: 32px;
  color: #b3b3b3;
}
.formCon {
}
.flexCon {
  display: flex;
  justify-content: space-between;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  padding-right: 30px;
  box-sizing: border-box;
}
.whiteBg {
  background-color: #fff;
}
.addonText {
  //   font-size: 18px;
  font-size: var(--van-cell-font-size);
}
.specialText {
  font-size: 28px;
  font-weight: 500;
  color: #666;
  padding-left: 32px;
  box-sizing: border-box;
  margin-top: 30px;
  margin-bottom: 20px;
}
.flexBetween {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.farmerSubscribeActionCon {
  box-sizing: border-box;
  padding-bottom: 100px;
}
.gradientBg {
  width: 100%;
  height: 228px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url(https://img.hzanchu.com/acimg/c8f69c4c8068ed113968fa56b30a7970.png);
}
.topCon {
  width: 100%;
  height: 320px;
  position: relative;
}
.dashBouter {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 256px;
}
.dashBoard {
  width: 91%;
  background-color: #fff;
  border-radius: 12px;
  height: 256px;
  margin: 0 auto;
  padding: 32px;
  padding-top: 40px;
  box-sizing: border-box;
  box-shadow: 0px 6px 20px 2px rgba(0, 0, 0, 0.1);
}
.resetWidth {
  width: 590px;
}
</style>
