<template>
  <div class="outer">
    <div v-html="policy" class="policy fs-28"></div>
    <div class="placeholer"></div>
    <div class="bottomCon" v-if="state.showBottom">
      <div class="tip fs-26 flex-row align-items-center">
        <img
          :src="select ? 'https://img.hzanchu.com/acimg/1f2ffb694c19b2242a59ae03bdccafac.png' : 'https://img.hzanchu.com/acimg/f8378a945d212bc8d5696c408d619683.png'"
          :class="select ? 'select' : 'unselect'"
          @click="confrim"
        />
        <div>
          本人已阅读并同意
          <span @click.stop="showAgreement">《2022年文成县中蜂养殖折股量化项目蜂箱托管协议》</span>
        </div>
      </div>
      <div class="bottom">
        <div class="common-btn-plain fs-24" @click="cancelAction">取消</div>
        <div :class="select ? 'common-btn fs-24' : 'common-btn-disable fs-24'" @click="joinIn">立即申请</div>
      </div>
    </div>
  </div>

  <agreement ref="agreementRef" :showTime="true" title="2022年文成县中蜂养殖折股量化项目蜂箱托管协议" :content="protocol" @confirm="confrim"></agreement>
</template>

<script>
import { onMounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ImagePreview, Toast } from 'vant'
import Agreement from '@/components/agreement'
import Request from '@/service/request'
export default {
  components: {
    [ImagePreview.name]: ImagePreview,
    Agreement
  },
  setup() {
    const Router = useRouter()
    const select = ref(false) // 当前是否选中协议书
    const agreementRef = ref(null) // 当前同意协议弹窗ref
    const protocol = ref('') // 政策
    const policy = ref('') // 协议
    // 点击选择框
    const confrim = () => {
      // 判断当前是否已经阅读过
      if (agreementRef.value.isTimed) {
        select.value = !select.value
      } else {
        showAgreement()
      }
    }
    // 当前页面展示 协议书页面
    const showAgreement = () => {
      agreementRef.value.show()
    }

    const state = reactive({
      showBottom: false,
      type: ''
    })
    // 获取用户info
    const getInfo = () => {
      let track = localStorage.getItem('currentUserInfo') ? JSON.parse(localStorage.getItem('currentUserInfo')) : ''
      if (track) {
        state.type = track.type
        if (track.type == 1 || track.type == 4) {
          state.showBottom = true
        } else {
          state.showBottom = false
        }
      } else {
        state.showBottom = false
      }
      sessionStorage.removeItem('bigFarmerApplyFormData')
      sessionStorage.removeItem('bigFarmerApplyMap')
    }
    // 获取用户协议、政策
    const getProtocol = () => {
      Request.planBeeProtocol({})
        .then((res) => {
          if (res && res.code == 0) {
            console.log(res)
            protocol.value = res.data.protocol
            policy.value = res.data.policy
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
        .finally(() => {
          state.showMask = false
        })
    }
    const joinIn = () => {
      console.log(agreementRef.value.isTimed, select.value)
      if (!agreementRef.value.isTimed) {
        // 判断当前是否阅读过
        Toast('请先阅读协议！')
        return
      }
      if (!select.value) {
        // 判断当前是否选中过
        Toast('请先勾选协议！')
        return
      }
      if (state.type == 1) {
        // 如果是普通农户
        Router.push({
          name: 'culturalProNormalFarmerApply'
        })
      } else {
        // 如果是大户
        Router.push({
          // name: "culturalProBigCommitment",
          name: 'culturalProBigFarmerApply'
        })
      }
    }
    const cancelAction = () => {
      Router.go(-1)
    }
    const preview = () => {
      ImagePreview(['https://img.hzanchu.com/acimg/2cd506a0d7169258cc96a8e0632c3d9a.png'])
    }
    const toDetail = () => {
      Router.push('/cultural-propaganda/zhongfeng/auditStatus')
    }

    onMounted(() => {
      getInfo()
      getProtocol()
    })
    return {
      cancelAction,
      joinIn,
      preview,
      toDetail,
      state,

      select,
      confrim,
      showAgreement,
      agreementRef,
      protocol,
      policy
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/css/fit.less';
.outer {
  padding: 0 30px 180px;
  position: relative;
  background: #fff;
}
.policy {
  width: 100%;
  overflow: hidden;
  ::v-deep img {
    width: 100%;
    display: flex;
    justify-content: center;
    // width: 300px !important;
    // height: 300px !important;
  }
}
.commonImg {
  width: 100%;
  height: 375px;
  margin-top: 30px;
}
.tableImg {
  width: 100%;
  height: auto;
}
.header {
  font-size: 32px;
  color: #333;
  font-weight: 700;
  line-height: 42px;
  margin: 22px 30px 38px;
}
.topNumber {
  margin-top: 42px;
  text-align: center;
}
p {
  font-size: 28px;
  line-height: 48px;
  color: #333;
}

.placeholer {
  width: 100%;
  height: 100px;
}
.bottomCon {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 30px 60px;
  padding-bottom: calc(30px + constant(safe-area-inset-bottom));
  padding-bottom: calc(30px + env(safe-area-inset-bottom));
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0px -3px 15px rgba(0, 0, 0, 0.08);
}
.tip {
  margin-bottom: 30px;
  font-family: PingFang SC Regular, PingFang SC Regular-Regular;
  color: #333333;
  .unselect {
    width: 30px;
    height: 30px;
    margin-right: 30px;
  }
  .select {
    width: 30px;
    height: 30px;
    margin-right: 30px;
  }
}

.tip span {
  margin-left: 8px;
  color: var(--custom_color);
}
.bottom {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  div:nth-of-type(1) {
    width: 290px;
  }
  div:nth-of-type(2) {
    width: 290px;
    margin-left: 70px;
  }
}
</style>
