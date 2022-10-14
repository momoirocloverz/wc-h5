<template>
  <div class="normalSignResultCon">
    <div class="successCon">
      <div class="imgCon">
        <img class="statusImg" :src="state.successSrc" />
      </div>
      <div class="centerCon">
        <div>
          <div class="shortRes">申报材料审核中，请耐心等待</div>
        </div>
      </div>
    </div>
    <div class="nextCon">
      <div class="button" @click="checkDetail">查看申报详情</div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  setup() {
    const Router = useRouter()
    const state = reactive({
      status: true,
      dynamic: '',
      successSrc:
        'https://img.hzanchu.com/acimg/3b9ee93a68a9e09265bf6a259a8ed68d.png',
      ZLBFLAG: isZLB(),
    })
    const initAction = () => {}
    onMounted(() => {
      initAction()
    })
    const toHome = () => {
      Router.push({
        name: 'home',
      })
    }
    const checkDetail = () => {
      Router.push({
        name: 'culturalProBigDeclaDetails',
      })
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
