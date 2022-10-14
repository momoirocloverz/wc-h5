<template>
  <div class="bigEntranceCon">
    <!-- <img
      class="topBack"
      src="https://img.hzanchu.com/acimg/1e6f62dbf3c48090a2ba169f22055519.png"
    /> -->
    <title-bar title="结对概括" customStyle="margin-top: 0px" @click="gotoHome"></title-bar>
    <div class="main fs-32 flex-row flex-wrap">
      <div>
        结对的人数：<span>{{ state.matchNum }}人</span>
      </div>
      <div></div>
      <div>
        培训次数：<span>{{ state.trainNum }}次</span>
      </div>
      <div>
        培训人数：<span>{{ state.trainApplyNum }}人</span>
      </div>
      <div>
        招聘次数：<span>{{ state.workNum }}次</span>
      </div>
      <div>
        招聘人数：<span>{{ state.workApplyNum }}人</span>
      </div>
      <div>
        养殖信息更新次数：<span>{{ state.report1 }}</span
        ><span>/{{ state.report2 }}</span
        >（需：结对户数*3）
      </div>
    </div>
    <div class="itemMaster">
      <template v-for="(item, index) in state.list" :key="index">
        <img class="itemImg" :src="item.img" alt="" @click="toDetail(item)" />
      </template>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TitleBar from '@/components/titleBar.vue'
import Request from '@/service/request'
export default {
  components: { TitleBar },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      list: [
        {
          img: 'https://img.hzanchu.com/acimg/6ec606bff3e9d60ce9e7bc245ac54c45.png',
          name: 'culturalProBigHelpObject'
        },
        {
          img: 'https://img.hzanchu.com/acimg/4337a2d52c25dee38e2b2dd86e37bbfd.png',
          name: 'culturalProBigCapitalGains'
        },
        {
          img: 'https://img.hzanchu.com/acimg/2f143ef2b920e304ecaf38f17ea144ac.png',
          // name: "culturalProBigBeeTraining",
          name: 'culturalProBigBeeTraining1'
        },
        {
          img: 'https://img.hzanchu.com/acimg/f03dcf70776c08c4dcdff06aced37bea.png',
          name: 'culturalProBigEmployAlleviation1'
        },
        {
          img: 'https://img.hzanchu.com/acimg/3b560ad7de9d1648ad37dfbd4a7db0c9.png',
          name: 'culturalProBigBeeReport1'
        },
        {
          img: 'https://img.hzanchu.com/acimg/0f5e11797ff68c8d619e3c612103b401.png',
          name: 'culturalProBigDeclaDetails'
        }
      ],
      matchNum: 0,
      report: '',
      report1: '',
      report2: '',
      trainApplyNum: 0,
      trainNum: 0,
      workApplyNum: 0,
      workNum: 0
    })
    const initAction = () => {
      sessionStorage.removeItem('bigAgreementList')
      //   console.log('Route', Route.query)
    }

    //
    const gotoHome = () => {
      console.log(window.history.back)
      // Router.push("/");
    }

    // 初始化数据
    const init = () => {
      Request.planBeeMajorMajorIndex({}).then((e) => {
        if (e.code == 0) {
          console.log(e)
          let data = e.data
          state.matchNum = data.matchNum
          state.report = data.report
          state.report1 = data.report.split('/')[0]
          state.report2 = data.report.split('/')[1]
          state.trainApplyNum = data.trainApplyNum
          state.trainNum = data.trainNum
          state.workApplyNum = data.workApplyNum
          state.workNum = data.workNum
        }
      })
    }

    onMounted(() => {
      initAction()
      init()
    })
    const toDetail = (item) => {
      sessionStorage.removeItem('bigHelpObjectWithSelectInfo')
      if (item.name) {
        Router.push({ name: item.name })
      }
    }
    return {
      state,
      toDetail,
      gotoHome
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../../../assets/css/fit.less';
.bigEntranceCon {
  overflow: hidden;
  .topBack {
    width: 100%;
  }
  .itemMaster {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .itemImg {
    width: 330px;
    margin-left: 30px;
    margin-top: 30px;
  }

  .main {
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
    background-color: #fff;
    font-family: PingFang SC-Regular, PingFang SC;

    div {
      margin-bottom: 20px;
      span {
        font-weight: bold;
      }
    }

    div:nth-of-type(1) {
      width: 45%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    div:nth-of-type(2) {
      width: 45%;
      margin-left: 10%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    div:nth-of-type(3) {
      width: 45%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    div:nth-of-type(4) {
      width: 45%;
      margin-left: 10%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    div:nth-of-type(5) {
      width: 45%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    div:nth-of-type(6) {
      width: 45%;
      margin-left: 10%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    div:nth-of-type(7) {
      width: 100%;
      span:nth-of-type(1) {
        color: #ff844e;
      }
    }
  }
}
</style>
