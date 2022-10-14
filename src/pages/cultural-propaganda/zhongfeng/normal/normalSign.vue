<template>
  <div class="normalSignCon">
    <div class="articleCon">
      <div class="title">
        2020-2023年文成县中蜂养殖折股量化 扶贫项目代养协议
      </div>
      <div class="content" v-html="state.content"></div>
    </div>
    <div class="bottomCon">
      <div class="bottom">
        <div class="button" @click="agreeAction">同意，立即签署</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  setup() {
    const Router = useRouter()
    const state = reactive({
      ZLBFLAG: isZLB(),
      content: '',
    })
    const initAction = () => {
      Request.fetchFarmerProtocol({})
        .then((res) => {
          if (res && res.code == 0) {
            state.content = res.data
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    onMounted(() => {
      initAction()
    })
    const agreeAction = () => {
      Request.farmerSign({})
        .then((res) => {
          if (res && res.code == 0) {
            Toast('签约成功')
            Router.replace({
              name: 'declare',
            })
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    return {
      state,
      agreeAction,
      initAction,
    }
  },
}
</script>

<style lang="less" scoped>
.normalSignCon {
  box-sizing: border-box;
  padding-bottom: 60px;
}
.articleCon {
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
  padding-bottom: 140px;
}
.title {
  margin: 0 auto;
  margin-bottom: 50px;
  width: 572px;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  color: #333;
  line-height: 48px;
}
.content {
  font-size: 28px;
  font-weight: bold;
  text-align: left;
  color: #333;
  line-height: 48px;
}
.bottomCon {
  width: 100%;
  height: 150px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0px -3px 15px rgba(0, 0, 0, 0.08);
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
  box-sizing: border-box;
  .button {
    width: 73.33%;
    height: 70px;
    background: linear-gradient(#ff844e 0%, #fe6d56 100%);
    border-radius: 35px;
    font-size: 32px;
    color: #fff;
    text-align: center;
    line-height: 70px;
  }
}
</style>
