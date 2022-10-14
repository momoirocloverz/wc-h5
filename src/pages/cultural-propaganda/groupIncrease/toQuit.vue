<template>
  <div class="toJoinGroupIncreaseCon">
    <div class="middle">
      <div class="title">请选择退出类型</div>
      <radio-group v-model="state.checked">
        <radio class="customRadio" checked-color="#FF844E" name="2"
          >自愿退出</radio
        >
        <radio class="customRadio" checked-color="#FF844E" name="3"
          >死亡退出</radio
        >
      </radio-group>
    </div>
    <div class="btnsCon">
      <div class="button2" @click="refuseAction">取消</div>
      <div class="button" @click="agreeAction">确定</div>
    </div>
  </div>
</template>
<script>
import { useRouter, useRoute } from 'vue-router'
import { reactive } from 'vue'
import { Toast, RadioGroup, Radio, Dialog } from 'vant'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  components: {
    RadioGroup,
    Radio,
    [Dialog.Component.name]: Dialog.Component,
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      checked: '2',
      ZLBFLAG: isZLB(),
    })
    const refuseAction = () => {
      Router.go(-1)
    }
    const agreeAction = () => {
      Dialog.confirm({
        message: '退出后将不能参加年底收益是否确定退出',
      })
        .then(() => {
          Request.planIncomeDrop({ status: state.checked })
            .then((res) => {
              if (res && res.code == 0) {
                Toast('申请成功')
                Router.replace({
                  name: 'zhongfengtoGroupAuditRes',
                })
              } else {
                Toast(res.msg)
              }
            })
            .catch((err) => {
              console.log('err', err)
            })
        })
        .catch(() => {})
    }
    return {
      state,
      refuseAction,
      agreeAction,
    }
  },
}
</script>

<style scoped lang="less">
.toJoinGroupIncreaseCon {
  background: #fff;
  padding: 30px;
  padding-top: 40px;
  box-sizing: border-box;
  min-height: 100vh;
  .btnsCon {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    margin-top: 350px;
  }
  .button {
    width: 310px;
    height: 70px;
    background: linear-gradient(#ff844e 0%, #fe6d56 100%);
    border-radius: 35px;
    font-size: 32px;
    color: #fff;
    text-align: center;
    line-height: 70px;
  }
  .button2 {
    width: 310px;
    height: 66px;
    border: 2px solid #fe6d56;
    background: #fff;
    color: #fe6d56;
    border-radius: 33px;
    font-size: 32px;
    text-align: center;
    line-height: 70px;
  }
  .customRadio {
    font-size: 28px;
    justify-content: center;
    margin-bottom: 40px;
  }
  .title {
    font-size: 32px;
    font-weight: 700;
    color: #333;
    margin-bottom: 74px;
    text-align: center;
  }
  .middle {
    margin-bottom: 30px;
  }
}
</style>
