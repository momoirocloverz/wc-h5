<template>
  <div class="industryAllianceCon">
    <div class="enterTrigger" v-if="!state.currentStatusData || state.currentStatusData.status == 4">
      <div>加入黄年糕产业联盟共享产业收益</div>
      <div @click="popDialog">申请加入</div>
    </div>
    <div v-else class="headInfoCon">
      <div class="cardCon">
        <img :src="state.type == 1 ? 'https://img.hzanchu.com/acimg/a872f33dbd5fb54ecd52f28f6f04f508.png' : 'https://img.hzanchu.com/acimg/dbd4748cd49b3f894e12e5a43edfda3f.png'" />
        <div class="rightNextImg">
          <div class="itemStart">
            <div class="name" :class="[state.ZLBFitForOld ? 'nameOld' : '']">{{ state.currentStatusData.name }}</div>
            <div class="typeMark" :class="[state.ZLBFitForOld ? 'typeMarkOld' : '']">{{ state.type == 1 ? '农户' : '企业' }}</div>
          </div>
          <div class="describe" :class="[state.ZLBFitForOld ? 'describeOld' : '']">{{ state.type == 1 ? '身份证号:' : '统一社会信用代码:' }}</div>
          <div class="itemBetween">
            <div class="number" :class="[state.ZLBFitForOld ? 'numberOld' : '']">
              {{ state.type == 1 ? state.currentStatusData.card.slice(0, 8) + '****' + state.currentStatusData.card.slice(15) : state.currentStatusData.social_code }}
            </div>
            <div class="checkRecord" @click="checkRecord">
              <div :class="[state.ZLBFitForOld ? 'checkRecordOld' : '']">申请记录</div>
              <van-icon name="arrow" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="itemCon">
      <div
        class="item"
        v-for="(item, index) in state.list"
        :key="index"
        :class="[state.ZLBFLAG ? 'zlbItem' : '']"
        @click="toDetail(item)"
        :style="{
          background: `url(${item.bg}) no-repeat`,
          backgroundSize: '100%'
        }"
      >
        <span :class="[state.ZLBFLAG ? 'spanOld' : '']">{{ item.title }}</span>
        <div :style="{ color: item.color }" :class="[state.ZLBFLAG ? 'divOld' : '']">点击进入</div>
      </div>
    </div>
    <van-dialog v-model:show="state.show" title="" show-cancel-button confirmButtonColor="#FD844E" @confirm="dialogConfirm" confirm-button-text="去认证">
      <div class="dialogContent">当前功能受限，需申请<br />认证，通过后方可进入</div>
    </van-dialog>
  </div>
</template>
<script>
import { useRouter } from 'vue-router'
import { onMounted, reactive } from 'vue'
import Request from '@/service/request'
import { Toast } from 'vant'
import { isZLB } from '@/util/index'
export default {
  setup() {
    const Router = useRouter()
    const state = reactive({
      show: false,
      list: [
        {
          bg: 'https://img.hzanchu.com/acimg/f3538059936ba550627f7b09810dddda.png',
          title: '土地认种',
          color: '#F87B53',
          name: 'IndustryAllianceFarmerSubscribe'
        },
        {
          bg: 'https://img.hzanchu.com/acimg/0aef531df6f51b2fd53e72e84575585b.png',
          title: '共富车间',
          color: '#3295F1',
          name: 'IndustryAllianceFarmerWorkShop'
        },
        {
          bg: 'https://img.hzanchu.com/acimg/ad160974bf00094dad0d107fd24dacc5.png',
          title: '原料市场',
          color: '#20B9C0',
          name: 'agricultureList'
        },
        {
          bg: 'https://img.hzanchu.com/acimg/ae73177ff1b3ef0fd6c9c32dc5732cf0.png',
          title: '用工信息',
          color: '#29B5D7',
          name: 'jobList'
        }
      ],
      haveData: false,
      account_status: 0,
      ZLBFLAG: isZLB(),
      type: '',
      currentStatusData: null,
      globalFarmer: true,
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
    })
    const toDetail = (item) => {
      if (item.name) {
        if (item.name == 'IndustryAllianceFarmerSubscribe') {
          if (!state.currentStatusData || state.currentStatusData.status == 4) {
            state.show = true
          } else if (state.currentStatusData.status != 2) {
            Toast('当前功能受限，需申请认证，通过后可使用')
          } else {
            if (state.type == 1) {
              Router.push({ name: 'IndustryAllianceFarmerSubscribe' })
            } else {
              Router.push({ name: 'IndustryAllianceCapSubscribe' })
            }
          }
        } else {
          Router.push({ name: item.name })
        }
      } else {
        Toast('即将开放，敬请期待')
      }
    }
    const fetchUserInfo = () => {
      //   let track = localStorage.getItem('currentUserInfo') ? JSON.parse(localStorage.getItem('currentUserInfo')) : ''
      let track = localStorage.getItem('globalLegalPerson') ? JSON.parse(localStorage.getItem('globalLegalPerson')) : ''
      if (track) {
        state.type = 4
        state.list = [
          {
            bg: 'https://img.hzanchu.com/acimg/f3538059936ba550627f7b09810dddda.png',
            title: '土地认种',
            color: '#F87B53',
            name: 'IndustryAllianceFarmerSubscribe'
          },
          {
            bg: 'https://img.hzanchu.com/acimg/ad160974bf00094dad0d107fd24dacc5.png',
            title: '原料市场',
            color: '#20B9C0',
            name: 'agricultureList'
          },
          {
            bg: 'https://img.hzanchu.com/acimg/ae73177ff1b3ef0fd6c9c32dc5732cf0.png',
            title: '用工信息',
            color: '#29B5D7',
            name: 'jobList'
          }
        ]
        Request.IndustryIndex({})
          .then((res) => {
            if (res && res.code === 0) {
              state.currentStatusData = res.data.erp
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        state.type = 1
        //农户
        Request.IndustryIndex({})
          .then((res) => {
            if (res && res.code === 0) {
              state.currentStatusData = res.data.farmer
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    }
    onMounted(() => {
      fetchUserInfo()
    })
    const popDialog = () => {
      if (state.type == 1) {
        //农户
        Router.push({
          name: 'IndustryAllianceFarmerApply'
        })
      } else {
        //大户
        Router.push({
          name: 'IndustryAllianceCapitalistApply'
        })
      }
    }
    const dialogConfirm = () => {
      state.show = false
      if (state.type == 1) {
        //农户
        Router.push({
          name: 'IndustryAllianceFarmerApply'
        })
      } else {
        //大户
        Router.push({
          name: 'IndustryAllianceCapitalistApply'
        })
      }
    }
    const checkRecord = () => {
      if (state.type == 1) {
        Router.push({
          name: 'IndustryAllianceFarmerApplyRecord'
        })
      } else {
        Router.push({
          name: 'IndustryAllianceCapApplyRecord'
        })
      }
    }
    return {
      checkRecord,
      state,
      toDetail,
      popDialog,
      dialogConfirm
    }
  }
}
</script>

<style scoped lang="less">
.industryAllianceCon {
  background: #fff;
  overflow: hidden;
  min-height: 100vh;
  .item {
    height: 208px;
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 32px;
    padding: 72px 48px;
    box-sizing: border-box;
    justify-content: space-between;
    align-content: center;
    span {
      color: #fff;
      font-size: 36px;
      font-weight: bold;
    }
    div {
      width: 176px;
      height: 64px;
      border-radius: 36px;
      background: #fff;
      text-align: center;
      line-height: 64px;
      font-size: 28px;
    }
    .spanOld {
      font-size: 40px;
    }
    .divOld {
      font-size: 35px;
    }
  }
  .zlbItem {
    height: 15vh;
  }
}
.itemStart {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-content: center;
  margin-top: 14px;
  margin-bottom: 24px;
  .name {
    width: 450px;
    font-size: 32px;
    color: #333;
    font-weight: 500;
    margin-right: 24px;
  }
  .typeMark {
    height: 34px;
    text-align: center;
    width: 80px;
    background-color: rgba(253, 132, 78, 0.0588);
    border-radius: 4px 4px 4px 4px;
    padding: 4px 12px;
    box-sizing: border-box;
    border: 1px solid #fd844e;
    font-size: 24px;
    color: #fd844e;
  }
  .nameOld {
    font-size: 37px;
  }
  .typeMarkOld {
    width: 90px;
    font-size: 26px;
    height: 47px;
  }
}
.describe {
  font-size: 28px;
  color: #666;
  margin-bottom: 20px;
}
.describeOld {
  font-size: 35px;
}
.itemBetween {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  .number {
    font-size: 28px;
    color: #333;
  }
  .checkRecord {
    font-size: 28px;
    color: #ff844e;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    align-content: center;
  }
  .checkRecordOld {
    font-size: 33px;
  }
}
.headInfoCon {
  padding-top: 30px;
  padding-left: 32px;
  padding-right: 32px;
  box-sizing: border-box;
}
.cardCon {
  width: 100%;
  height: 210px;
  background-color: #fff;
  box-shadow: 0px 6px 20px 2px rgba(0, 0, 0, 0.102);
  border-radius: 12px 12px 12px 12px;
  box-sizing: border-box;
  padding: 24px 32px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: center;
  img {
    width: 64px;
    height: 64px;
    margin-right: 24px;
  }
  .rightNextImg {
    width: 100%;
  }
}
.enterTrigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  padding: 20px 32px;
  box-sizing: border-box;
  font-size: 28px;
  background-color: rgba(253, 132, 78, 0.09);
  color: #fd844e;
  div {
    &:nth-child(1) {
    }
    &:nth-child(2) {
      width: 144px;
      height: 48px;
      text-align: center;
      line-height: 48px;
      border: 1px solid #fd844e;
      border-radius: 24px;
    }
  }
}
.itemCon {
  padding-top: 48px;
  padding-left: 32px;
  padding-right: 32px;
  box-sizing: border-box;
}
.dialogContent {
  padding: 32px 48px;
  box-sizing: border-box;
  text-align: center;
  line-height: 52px;
}
</style>
