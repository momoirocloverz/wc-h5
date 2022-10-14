<template>
  <div class="toJoinGroupIncreaseCon">
    <div v-if="state.account_status == 2 || state.account_status == 3">
      <div class="waitingCon" v-if="state.type == '1'">
        <div class="imgCon">
          <img class="statusImg" :src="state.waitingSrc" />
        </div>
        <div class="centerCon">
          <div class="shortRes">待审核</div>
          <div class="detailRes">审核通过后将退还您5000元本金</div>
        </div>
      </div>
      <div class="waitingCon" v-if="state.type == '2'">
        <div class="imgCon">
          <img class="statusImg" :src="state.waitingSrc" />
        </div>
        <div class="centerCon">
          <div class="shortRes">审核通过</div>
          <div class="detailRes">
            留意短信通知，将在 15个工作日内退还您本金和结算收益
          </div>
        </div>
      </div>
    </div>
    <div class="waitingCon" v-if="state.account_status == 4">
      <div class="imgCon">
        <img class="statusImg" :src="state.failedSrc" />
      </div>
      <div class="centerCon">
        <div class="shortRes"></div>
        <div class="detailRes">
          您已从低收入农户名单中移除 无参与抱团增收项目资格，已被迫退出
        </div>
      </div>
    </div>
    <div class="goBack" @click="goBack">返回</div>
  </div>
</template>
<script>
import { useRouter, useRoute } from 'vue-router'
import { reactive, onMounted } from 'vue'
import { Toast, Dialog } from 'vant'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      type: '1',
      account_status: 0,
      waitingSrc:
        'https://img.hzanchu.com/acimg/5c651f9cd1166d6be001ffbe03034a64.png',
      failedSrc:
        'https://img.hzanchu.com/acimg/8c8762386c8f55cf57ae71f279357453.png',
    })
    const goBack = () => {
      Router.go(-1)
    }
    onMounted(() => {
      fetchGroupInfo()
    })
    const fetchGroupInfo = () => {
      Request.planIncomeInfo({})
        .then((res) => {
          if (res && res.code === 0) {
            if (!res.data.id) {
            } else {
              state.type = res.data.drop_status
              state.account_status = res.data.account_status
            }
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    return {
      state,
      goBack,
    }
  },
}
</script>

<style scoped lang="less">
.toJoinGroupIncreaseCon {
  background-color: #fff;
  padding: 30px;
  padding-top: 40px;
  box-sizing: border-box;
  min-height: 100vh;
  .goBack {
    width: 550px;
    height: 70px;
    background: linear-gradient(#ff844e 0%, #fe6d56 100%);
    border-radius: 35px;
    font-size: 32px;
    color: #fff;
    margin: 0 auto;
    margin-top: 240px;
    text-align: center;
    line-height: 70px;
  }
  .centerCon {
    text-align: center;
  }
  .detailRes {
    width: 552px;
    font-size: 30px;
    font-weight: bold;
    color: #666;
    line-height: 48px;
    margin: 0 auto;
  }
  .shortRes {
    width: 182px;
    font-size: 36px;
    font-weight: bold;
    color: #333;
    margin: 0 auto;
    margin-top: 50px;
    margin-bottom: 30px;
  }
  .waitingCon {
    padding-top: 130px;
    box-sizing: border-box;
  }
  .imgCon {
    text-align: center;
  }
  .statusImg {
    width: 212px;
    height: 212px;
    text-align: center;
  }
}
</style>
