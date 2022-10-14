<template>
  <div class="normalSignResultCon">
    <div class="waitingCon" v-if="state.type == '0'">
      <div class="imgCon">
        <img class="statusImg" :src="state.waitingSrc" />
      </div>
      <div class="centerCon">
        <div class="shortRes">待匹配</div>
        <div class="detailRes">
          您的申请已提交，待养殖大户确定 后即可签约，请留意短信通知
        </div>
        <div class="countDownCon">
          <div class="checkProgress" @click="checkProgress">查看匹配进度</div>
          <!-- <div class="toEditContent" @click="toEditContent">修改申请内容</div> -->
        </div>
      </div>
    </div>
    <div class="successCon" v-if="state.type == '2'">
      <div class="imgCon">
        <img class="statusImg" :src="state.successSrc" />
      </div>
      <div class="centerCon">
        <div class="shortRes">匹配成功</div>
        <div class="detailRes">（{{ state.count }}s）后自动返回</div>
      </div>
    </div>
    <div class="failedCon" v-if="state.type == '3'">
      <div class="imgCon">
        <img class="statusImg" :src="state.failedSrc" />
      </div>
      <div class="centerCon">
        <div class="shortRes">匹配失败</div>
        <div class="detailRes">养殖大户拒绝了您的申请 请重新选择结对对象</div>
        <div class="restart" @click="restart">重新选择</div>
      </div>
    </div>
    <div class="failedCon" v-if="state.type == '4'">
      <div class="imgCon">
        <img class="statusImg" :src="state.failedSrc" />
      </div>
      <div class="centerCon">
        <div class="shortRes">已终止</div>
        <div class="restart" @click="restart">重新选择</div>
        <!-- <div class="detailRes">
          养殖大户拒绝了您的申请 请重新选择结对对象
                </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import Request from '@/service/request'
import { useRouter, useRoute } from 'vue-router'
import { isZLB } from '@/util/index'
export default {
  components: {},
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      type: '0',
      count: 5,
      waitingSrc:
        'https://img.hzanchu.com/acimg/5c651f9cd1166d6be001ffbe03034a64.png',
      successSrc:
        'https://img.hzanchu.com/acimg/16448b1899949cf76bf36fd16209ced3.png',
      failedSrc:
        'https://img.hzanchu.com/acimg/585e5ad33aca50434e0cc1080141f3ed.png',
    })
    const agreeAction = () => {
      // Router.push({
      //     name:''
      // })
    }
    const forInitAction = (res) => {
      state.type = res.data.status
      if (state.type == '2') {
        window.time14 = setInterval(() => {
          if (state.count > 0) {
            state.count--
          } else {
            clearInterval(window.time14)
            Router.replace({
              name: 'culturalProNormalSign',
            })
          }
        }, 1000)
      }
    }
    const initAction = () => {
      Request.fetchFarmerMatchInfo({})
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
    const clearTime = () => {
      clearInterval(window.time14)
    }
    const restart = () => {
      Router.push({
        name: 'culturalProNormalPair',
      })
    }
    const checkProgress = () => {
      initAction()
    }
    const toEditContent = () => {
      Router.replace({
        name: 'culturalProNormalPair',
      })
    }
    onMounted(() => {
      initAction()
    })
    onBeforeUnmount(() => {
      clearTime()
    })
    return {
      state,
      agreeAction,
      restart,
      checkProgress,
      toEditContent,
    }
  },
}
</script>

<style lang="less" scoped>
.checkProgress {
  width: 300px;
  height: 70px;
  background-color: #ff844e;
  border-radius: 35px;
  font-size: 32px;
  line-height: 72px;
  font-weight: bold;
  color: #fff;
  box-sizing: border-box;
  margin: 0 auto;
}
.toEditContent {
  width: 300px;
  height: 70px;
  background-color: #d1d1d1;
  border-radius: 35px;
  line-height: 72px;
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  box-sizing: border-box;
}
.countDownCon {
  margin-top: 300px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  padding-left: 40px;
  padding-right: 40px;
  box-sizing: border-box;
}
.restart {
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
.normalSignResultCon {
  padding-top: 30px;
  box-sizing: border-box;
}
.successCon {
  padding-top: 130px;
  box-sizing: border-box;
}
.waitingCon {
  padding-top: 130px;
  box-sizing: border-box;
}
.failedCon {
  padding-top: 130px;
  box-sizing: border-box;
}
.centerCon {
  text-align: center;
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
.detailRes {
  width: 552px;
  font-size: 30px;
  font-weight: bold;
  color: #666;
  line-height: 48px;
  margin: 0 auto;
}
.imgCon {
  text-align: center;
}
.statusImg {
  width: 212px;
  height: 212px;
  text-align: center;
}
</style>
