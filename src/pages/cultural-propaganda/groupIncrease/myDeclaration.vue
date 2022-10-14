<template>
  <div class="toJoinGroupIncreaseCon">
    <div class="waitingCon" v-if="state.type == '1'">
      <div class="imgCon">
        <img class="statusImg" :src="state.waitingSrc" />
      </div>
      <div class="centerCon">
        <div class="shortRes">审批中</div>
        <div class="detailRes">审批中，请耐心等待</div>
      </div>
    </div>
    <div class="waitingCon" v-if="state.type == '2'">
      <div class="imgCon">
        <img class="statusImg" :src="state.successSrc" />
      </div>
      <div class="centerCon">
        <div class="shortRes">审批通过</div>
        <div class="detailRes">可在我的收益中查看收益详情</div>
      </div>
    </div>
    <div class="waitingCon" v-if="state.type == '3'">
      <div class="imgCon">
        <img class="statusImg" :src="state.failedSrc" />
      </div>
      <div class="centerCon">
        <div class="shortRes">审批失败</div>
        <div class="detailRes">失败原因：上传的照片不清晰，无法辨认</div>
      </div>
    </div>
    <div class="top" v-if="state.type == '1' || state.type == '2'">
      <div class="title">申报信息</div>
      <div class="itemCon">
        <div class="itemCommon">
          <div class="itemLeft">姓名</div>
          <div v-if="state.ZLBFLAG">
            {{ state.form.name.replace(state.form.name.substr(0, 1), '*') }}
          </div>
          <div v-else>{{ state.form.name }}</div>
        </div>
        <div class="itemCommon">
          <div class="itemLeft">身份证号</div>
          <div v-if="state.ZLBFLAG">
            {{
              state.form.identity.replace(
                state.form.identity.substr(3, 12),
                '************'
              )
            }}
          </div>
          <div v-else>{{ state.form.identity }}</div>
        </div>
        <div class="itemCommon">
          <div class="itemLeft">电话</div>
          <div v-if="state.ZLBFLAG">
            {{
              state.form.mobile.replace(state.form.mobile.substr(3, 4), '****')
            }}
          </div>
          <div v-else>{{ state.form.mobile }}</div>
        </div>
        <div class="itemCommon">
          <div class="itemLeft">所属镇</div>
          <div v-if="state.ZLBFLAG">
            {{ state.form.town.replace(state.form.town.substr(0, 1), '*') }}
          </div>
          <div v-else>{{ state.form.town }}</div>
        </div>
        <div class="itemCommon">
          <div class="itemLeft">所属村</div>
          <div v-if="state.ZLBFLAG">
            {{
              state.form.village.replace(state.form.village.substr(0, 1), '*')
            }}
          </div>
          <div v-else>{{ state.form.village }}</div>
        </div>
        <div class="itemCommon">
          <div class="itemLeft">详细地址</div>
          <div v-if="state.ZLBFLAG">
            {{
              state.form.address.replace(
                state.form.address.substr(2, 4),
                '****'
              )
            }}
          </div>
          <div v-else>{{ state.form.address }}</div>
        </div>
      </div>
    </div>
    <div
      v-if="state.type == '1' || state.type == '2'"
      class="goBack"
      @click="goBack"
    >
      返回
    </div>
    <div class="btnsCon" v-if="state.type == '3'">
      <div class="button2" @click="refuseAction">取消</div>
      <div class="button" @click="agreeAction">重新申报</div>
    </div>
  </div>
</template>
<script>
import { useRouter, useRoute } from 'vue-router'
import { reactive, onMounted } from 'vue'
import { Toast } from 'vant'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      waitingSrc:
        'https://img.hzanchu.com/acimg/5c651f9cd1166d6be001ffbe03034a64.png',
      successSrc:
        'https://img.hzanchu.com/acimg/16448b1899949cf76bf36fd16209ced3.png',
      failedSrc:
        'https://img.hzanchu.com/acimg/585e5ad33aca50434e0cc1080141f3ed.png',
      type: '1',
      form: {
        name: '',
        identity: '',
        mobile: '',
        village: '',
        town: '',
        address: '',
      },
    })
    const initAction = () => {
      Request.planIncomeInfo({})
        .then((res) => {
          if (res && res.code == 0) {
            state.type = res.data.status
            state.form = {
              name: res.data.name,
              identity: res.data.identity,
              mobile: res.data.mobile,
              village: res.data.village_name,
              town: res.data.town_name,
              address: res.data.address,
            }
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
    const refuseAction = () => {
      Router.go(-1)
    }
    const agreeAction = () => {
      Router.replace({
        name: 'zhongfengtoJoinGroup',
      })
    }
    const goBack = () => {
      Router.go(-1)
    }
    return {
      state,
      refuseAction,
      agreeAction,
      goBack,
    }
  },
}
</script>

<style scoped lang="less">
.toJoinGroupIncreaseCon {
  background-color: #fff;
  padding: 30px;
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
    margin-top: 120px;
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
  .btnsCon {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    margin-top: 54px;
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
  .itemCon {
    font-size: 28px;
    color: #666;
  }
  .itemCommon {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    margin-bottom: 24px;
  }
  .itemLeft {
    width: 190px;
    padding-left: 10px;
    box-sizing: border-box;
  }
  .title {
    font-size: 32px;
    font-weight: 700;
    color: #333;
    margin-bottom: 24px;
  }
  .top {
    margin-bottom: 30px;
    margin-top: 100px;
  }
}
</style>
