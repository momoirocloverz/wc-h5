<template>
  <div class="normalSignResultCon">
    <div class="successCon">
      <div class="imgCon">
        <img class="statusImg" :src="state.successSrc" />
      </div>
      <div class="centerCon">
        <div v-if="state.status">
          <div class="shortRes">
            结对申请发送成功 <br />结果将以短信形式通知
          </div>
          <div class="detailRes">
            可在<span class="yellowText" @click="checkDetail">申报详情</span
            >中查看进度
          </div>
        </div>
        <div v-else>
          <div class="shortRes">结对申请发送失败</div>
          <div class="detailRes">可能是网络原因，请检查您的网络设置</div>
        </div>
      </div>
    </div>
    <div class="nextCon">
      <div class="button2" @click="toHome">返回首页</div>
      <div class="button" @click="checkDetail">
        {{ state.status ? '查看进度' : '重新提交' }}
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  components: {},
  setup() {
    const Router = useRouter()
    const state = reactive({
      status: true,
      dynamic: '',
      successSrc:
        'https://img.hzanchu.com/acimg/ae49b3bed26aa9da94f5f934b4b56323.png',
      ZLBFLAG: isZLB(),
    })
    const initAction = () => {
      state.successSrc =
        'https://img.hzanchu.com/acimg/ae49b3bed26aa9da94f5f934b4b56323.png'
      // state.successSrc =
      //   'https://img.hzanchu.com/acimg/5b71568f6f60f9baed9afb198d68b6ae.png'
    }
    onMounted(() => {
      initAction()
    })
    const toHome = () => {
      Router.push({
        name: 'home',
      })
    }
    const checkDetail = () => {
      if (state.status) {
        Router.push({
          name: 'declare',
        })
      } else {
        Router.push({
          name: 'culturalProNormalFarmerApply',
        })
      }
    }
    return {
      checkDetail,
      state,
      toHome,
    }
  },
}
</script>

<style lang="less" scoped>
.normalSignResultCon {
  padding-top: 30px;
  box-sizing: border-box;
}
.successCon {
  padding-top: 130px;
  box-sizing: border-box;
}
.centerCon {
  text-align: center;
}
.shortRes {
  font-size: 36px;
  color: #333;
  margin: 0 auto;
  margin-top: 50px;
  margin-bottom: 14px;
}
.detailRes {
  font-size: 28px;
  color: #666;
  line-height: 48px;
  margin: 0 auto;
  .yellowText {
    font-size: 28px;
    color: #fd844e;
  }
}
.imgCon {
  text-align: center;
}
.statusImg {
  width: 213px;
  height: 220px;
  text-align: center;
}
.nextCon {
  margin-top: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
  box-sizing: border-box;
  .button {
    width: 38%;
    height: 70px;
    background: linear-gradient(#ff844e 0%, #fe6d56 100%);
    border-radius: 35px;
    font-size: 32px;
    color: #fff;
    text-align: center;
    line-height: 70px;
  }
  .button2 {
    width: 38%;
    height: 66px;
    border: 2px solid #fe6d56;
    background: #fff;
    color: #fe6d56;
    border-radius: 33px;
    font-size: 32px;
    text-align: center;
    line-height: 68px;
    margin-right: 40px;
  }
}
</style>
