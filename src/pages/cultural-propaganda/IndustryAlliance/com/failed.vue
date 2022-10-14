<template>
  <div class="industryAllFailed">
    <div class="centerCon">
      <img src="https://img.hzanchu.com/acimg/1ccfcdd31a9c4ed95ef48b25cd3da930.png" />
      <div class="resultText">提交失败</div>
      <div class="longerText">
        {{ Route.query.msg || '-' }}
      </div>
      <div class="bottom">
        <div class="cancelBtn" @click="cancelAction">返回首页</div>
        <van-button block class="fixButton" type="primary" @click="checkList">重新提交</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast, Dialog, Field, List, PullRefresh } from 'vant'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import IsEnd from '@/components/isEnd.vue'
import IsEmpty from '@/components/isEmpty.vue'
import { isZLB } from '@/util/index'
export default {
  components: {
    Field,
    [Dialog.Component.name]: Dialog.Component,
    List,
    PullRefresh,
    IsEnd,
    IsEmpty
  },
  props: {
    type: {
      default: 'farmer'
    }
  },
  setup(props) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      showPicker: false,
      active: 0,
      show: false
    })

    const initAction = () => {}
    onMounted(() => {
      initAction()
    })

    const cancelAction = () => {
      Router.replace({
        name: 'Home'
      })
    }
    const checkList = () => {
      Router.go(-1)
    }
    return {
      cancelAction,
      checkList,
      Route,
      state,
      props
    }
  }
}
</script>

<style lang="less" scoped>
.centerCon {
}
.resultText {
  font-size: 32px;
  color: #141414;
  margin-top: 48px;
  margin-bottom: 24px;
  text-align: center;
}
.longerText {
  font-size: 28px;
  color: #999999;
  margin-bottom: 48px;
  text-align: center;
  span {
    color: #ff844e;
  }
}
.industryAllFailed {
  padding-top: 240px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  height: 100vh;
  background-color: #fff;
  img {
    width: 144px;
    height: 144px;
    margin: 0 auto;
    display: block;
  }
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  .cancelBtn {
    width: 232px;
    height: 72px;
    border: 2px solid #ff844e;
    box-sizing: border-box;
    border-radius: 36px;
    font-size: 28px;
    color: #ff844e;
    text-align: center;
    line-height: 72px;
    margin-right: 30px;
  }
}
</style>
<style lang="less">
.industryAllFailed {
  .fixButton {
    width: 232px;
    height: 72px;
    background: linear-gradient(#ff844e 0%, #fe6d56 100%);
    border-radius: 36px;
    border: none;
    font-size: 28px;
    color: #fff;
    text-align: center;
    line-height: 72px;
  }
}
</style>
