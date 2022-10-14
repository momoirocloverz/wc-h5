<template>
  <div class="group-main">
    <!-- 头部内容 -->
    <div class="group-header">
      <div class="group-li">
        <span class="group-title">姓名</span>
        <span class="group-title" v-if="state.ZLBFLAG">
          {{ info.basic ? info.basic.TName.replace(info.basic.TName.substr(0, 1), '*') : '暂无' }}
        </span>
        <span v-else class="group-title">
          {{ info.basic ? info.basic.TName : '暂无' }}
        </span>
      </div>
      <div class="group-li">
        <span class="group-title">性别</span>
        <span class="group-title">{{ info.basic ? info.basic.SEX : '暂无' }}</span>
      </div>
      <div class="group-li">
        <span class="group-title">身份证号</span>
        <span class="group-title">
          {{ info.basic && info.basic.Card ? info.basic.Card.slice(0, 8) + '****' + info.basic.Card.slice(15) : '暂无' }}
        </span>
      </div>
      <div class="group-li" @click="toXKM">
        <span>我的小康码</span>
        <van-icon name="qr" />
        <van-icon name="arrow" />
      </div>
    </div>
    <!-- tab内容 -->
    <div class="group-tab">
      <li
        v-for="(item, index) in tabList"
        :key="index"
        v-show="item.show === '1'"
        :class="[index == chooseActive ? 'group-active' : '', state.ZLBFLAG ? 'resetWidth' : '']"
        @click="handleClickActive(item, index)"
      >
        {{ item.title }}
      </li>
    </div>
    <basic-info :data="info.basic" v-if="chooseActive == 0" />
    <subsidy-payment :list="info.btk_list" v-if="chooseActive == 3" />
    <!-- 就医详情 -->
    <medical-treatment :list="info.jyqk_list" v-if="chooseActive == 1" />
    <!-- <contract-doctor :data="info.doctor" v-if="chooseActive == 3" /> -->
    <!-- <paired-cadres :data="info.cadre" v-if="chooseActive == 4" /> -->
    <!-- 工作端入口 -->
    <!-- 签约医生 -->
    <contract-doctor-work :data="info.doctor" :family="info.visit_family" v-if="chooseActive == 2" />
    <!-- -->
    <!-- 干部结对 -->
    <paired-cadres-work :data="info.cadre" :family="info.visit_family" v-if="chooseActive == 4" />
  </div>
</template>

<script>
import { ref, onUnmounted, onBeforeMount, reactive } from 'vue'
import { getCurrentInstance } from 'vue'
import Request from '@/service/request.js'
import BasicInfo from '../../components/tabList/basicInfo'
import SubsidyPayment from '../../components/tabList/subsidyPayment'
import MedicalTreatment from '../../components/tabList/medicalTreatment'
// import ContractDoctor from "../../components/tabList/contractDoctor";
// import PairedCadres from '../../components/tabList/pairedCadres';
// 工作端签约医生
import ContractDoctorWork from '../../components/tabList/contractDoctorWork'
// 工作端结对干部
import PairedCadresWork from '../../components/tabList/pairedCadresWork'
import { useRouter, useRoute } from 'vue-router'
import { isZLB } from '@/util/index'
import { Toast } from 'vant'
export default {
  name: 'departgroup',
  components: {
    BasicInfo,
    SubsidyPayment,
    MedicalTreatment,
    // ContractDoctor,
    // PairedCadres,
    PairedCadresWork,
    ContractDoctorWork
  },
  setup() {
    const chooseActive = ref(0)
    const Router = useRouter()
    const Route = useRoute()
    // const type = sessionStorage.getItem('type')
    const type = localStorage.getItem('type')
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBLOGINSTATUS: false
    })
    const baseInfo = [
      {
        title: '基本信息',
        verify: 0,
        show: '1'
      },
      {
        title: '就医详情',
        verify: 1,
        show: '1'
      },
      {
        title: '签约医生',
        verify: 1,
        show: '1'
      },
      {
        title: '补贴款项发放',
        verify: 1,
        show: '1'
      },
      {
        title: '结对干部',
        verify: 1,
        show: '1'
      }
    ]
    if (type == 2) {
      //   baseInfo[1].show = '0';
      //   baseInfo[2].show = '0';
      //   baseInfo[3].show = '0';
    } else if (type == 3) {
      baseInfo[3].show = '0'
      baseInfo[4].show = '0'
    }

    const tabList = ref(baseInfo)
    const { proxy } = getCurrentInstance()
    const info = ref({})

    chooseActive.value = proxy.$root.$route.query.i
    /**
     * id: 45972
     * contact: 13706619478
     */
    const zlbCheckLogin = () => {
      if (state.ZLBFLAG) {
        let bridge = Boolean(localStorage.getItem('token'))
        state.ZLBLOGINSTATUS = bridge
      }
    }
    const getInfo = () => {
      let track = localStorage.getItem('currentUserInfo') ? JSON.parse(localStorage.getItem('currentUserInfo')) : ''
      let chossenGuy = localStorage.getItem('chossenGuy') ? localStorage.getItem('chossenGuy') : ''
      if (track) {
        if (chossenGuy) {
          let typeInner = localStorage.getItem('type')
          if (typeInner == 1) {
            Request.getUserInfo()
              .then((res) => {
                if (res && res.code === 0) {
                  track.farmer_info = res.data.farmer_info
                  localStorage.setItem('currentUserInfo', JSON.stringify(track))
                  info.value = track.farmer_info
                } else {
                  Toast(res.msg)
                }
              })
              .catch((err) => {
                console.log('err', err)
              })
          } else {
            Request.userFarmerInfo({
              mobile: localStorage.getItem('phone'),
              id: chossenGuy,
              type: localStorage.getItem('type')
            })
              .then((res) => {
                let currentInfo = localStorage.getItem('currentUserInfo') ? JSON.parse(localStorage.getItem('currentUserInfo')) : ''
                if (currentInfo) {
                  currentInfo.farmer_info.basic = res.data.basic
                  currentInfo.farmer_info.btk_list = res.data.btk_list
                  currentInfo.farmer_info.visit_family = res.data.visit_family
                  info.value = currentInfo.farmer_info
                  localStorage.setItem('currentUserInfo', JSON.stringify(currentInfo))
                }
              })
              .catch((err) => {
                console.log('err', err)
              })
          }
        } else {
          let typeInner = localStorage.getItem('type')
          if (typeInner == 1) {
            Request.getUserInfo()
              .then((res) => {
                if (res && res.code === 0) {
                  track.farmer_info = res.data.farmer_info
                  localStorage.setItem('currentUserInfo', JSON.stringify(track))
                  info.value = track.farmer_info
                  console.log(info.value, 'info.value')
                } else {
                  if (res && res.msg) {
                    Toast(res.msg)
                  }
                }
              })
              .catch((err) => {
                console.log('err', err)
              })
          } else {
            Request.userFarmerInfo({
              mobile: localStorage.getItem('phone'),
              id: sessionStorage.getItem('uid'),
              type: localStorage.getItem('type')
            })
              .then((res) => {
                let currentInfo = localStorage.getItem('currentUserInfo') ? JSON.parse(localStorage.getItem('currentUserInfo')) : ''
                if (currentInfo) {
                  currentInfo.farmer_info.basic = res.data.basic
                  currentInfo.farmer_info.btk_list = res.data.btk_list
                  currentInfo.farmer_info.visit_family = res.data.visit_family
                  info.value = currentInfo.farmer_info
                  localStorage.setItem('currentUserInfo', JSON.stringify(currentInfo))
                }
              })
              .catch((err) => {
                console.log('err', err)
              })
          }
        }
      }
    }
    onBeforeMount(() => {
      zlbCheckLogin()
      getInfo()
    })
    onUnmounted(() => {
      getInfo()
    })
    const handleClickActive = (item, index) => {
      chooseActive.value = index
      if (item.verify == 1) {
        if (state.ZLBFLAG) {
          if (!state.ZLBLOGINSTATUS) {
            Router.push({
              path: '/home',
              query: {
                url: encodeURIComponent('/tabList?i=' + index)
              }
            })
          } else {
            getInfo()
          }
        } else {
          if (!localStorage.getItem('phone')) {
            Router.push({
              path: '/home',
              query: {
                url: encodeURIComponent('/tabList?i=' + index)
              }
            })
          } else {
            getInfo()
          }
        }
      } else {
        getInfo()
      }
    }

    const toXKM = () => {
      if (info.value.basic) {
        Router.push('/xkm')
      }
    }

    return {
      chooseActive,
      tabList,
      handleClickActive,
      info,
      getInfo,
      toXKM,
      state
    }
  }
}
</script>

<style lang="less" scoped>
.group-main {
  width: 100%;
  display: flex;
  flex-direction: column;
  color: #333333;
  padding-bottom: 100px;
  box-sizing: border-box;
  .group-tab {
    width: 100%;
    margin-top: 15px;
    padding-bottom: 20px;
    background: #fff;
    // overflow: hidden;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: space-between;
    align-content: space-between;
    li {
      // float: left;
      width: 208px;
      // width: 30%;
      height: 66px;
      border: #dcdcdc solid 2px;
      border-radius: 33px;
      text-align: center;
      line-height: 66px;
      margin: 20px 0 0 30px;
      color: #999999;
      font-size: 28px;
    }
    .resetWidth {
      width: 28%;
    }
    .group-active {
      background: #ff9a16;
      border: #ff9a16 solid 2px;
      color: #fff;
    }
  }
}
</style>
<style lang="less">
@thirty: 30px;
.group-header {
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  .group-li {
    width: 690px;
    height: 95px;
    margin: 0px auto;
    display: flex;
    align-items: center;
    border-bottom: #f5f7fa solid 2px;
  }
  .group-li:last-child {
    border: none;
  }
  span {
    font-size: @thirty;
    font-weight: 400;
  }
  .groupTitleReset {
    font-size: calc(@thirty* @newRatio);
  }
  span:nth-of-type(2) {
    margin-left: auto;
  }
  .van-icon {
    font-size: 36px;
  }
  .van-icon:nth-of-type(1) {
    margin-left: auto;
  }
  .van-icon:nth-of-type(2) {
    margin-left: 16px;
  }
}
</style>
