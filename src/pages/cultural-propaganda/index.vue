<template>
  <div class="cultural_propaganda">
    <div
      class="item"
      v-for="(item, index) in state.list"
      :key="index"
      :class="[state.ZLBFLAG ? 'zlbItem' : '']"
      :style="{
        background: `url(${item.bg}) no-repeat`,
        backgroundSize: '100%'
      }"
      @click="toDetail(item)"
    >
      <span :class="[state.ZLBFitForOld ? 'spanPOld' : '']">{{ item.title }}</span>
      <div :style="{ color: item.color }" :class="[state.ZLBFitForOld ? 'divOld' : '']">了解详情</div>
    </div>
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
      list: [
        {
          bg: 'https://img.hzanchu.com/acimg/dfe22cb9d9cbe960ae83522b8e6c43cb.png',
          title: '保底增收',
          color: '#F87B53',
          name: 'zhongfengEntrance'
        },
        // {
        //   bg: 'https://img.hzanchu.com/acimg/310697fe590e174943a96abd6192b9c8.png',
        //   title: '二次分红',
        //   color: '#3295F1',
        //   name: ''
        // },
        {
          bg: 'https://img.hzanchu.com/acimg/f03032a9651d23833a3024094fbef0f1.png',
          title: '抱团增收',
          color: '#20B9C0',
          name: 'zhongfengGroupIncrease'
        },
        {
          bg: 'https://img.hzanchu.com/acimg/12f01c188c763550e328911b33c2bcdd.png',
          title: '产业联盟',
          color: '#29B5D7',
          name: 'IndustryAllianceIndex'
        }
      ],
      haveData: false,
      account_status: 0,
      ZLBFLAG: isZLB(),
      type: '',
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
    })
    const toDetail = (item) => {
      if (item.name) {
        if (item.name == 'zhongfengGroupIncrease') {
          if (state.haveData) {
            // if (state.account_status == 0 || state.account_status == 1) {
            Router.push({ name: 'zhongfengtoGroupSelect' })
            // } else {
            //   Router.push({ name: 'zhongfengtoGroupQuitRes' })
            // }
          } else {
            Router.push({ name: item.name })
          }
        } else {
          Router.push({ name: item.name })
        }
      } else {
        Toast('即将开放，敬请期待')
      }
    }
    const fetchUserInfo = () => {}
    onMounted(() => {
      fetchUserInfo()
      fetchGroupInfo()
    })
    const fetchGroupInfo = () => {
      Request.planIncomeInfo({})
        .then((res) => {
          if (res && res.code === 0) {
            if (!res.data.id) {
              state.haveData = false
            } else {
              state.haveData = true
              state.account_status = res.data.account_status
            }
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    return {
      state,
      toDetail
    }
  }
}
</script>

<style scoped lang="less">
.cultural_propaganda {
  background: #fff;
  overflow: hidden;
  padding: 0 30px;
  min-height: 100vh;
  .item {
    height: 150px;
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 30px;
    padding: 0 80px;
    box-sizing: border-box;
    justify-content: space-between;
    align-content: center;
    span {
      color: #fff;
      font-size: 38px;
      font-weight: bold;
    }
    div {
      width: 168px;
      height: 54px;
      border-radius: 27px;
      background: #fff;
      text-align: center;
      line-height: 54px;
      font-size: 28px;
      font-weight: bold;
    }
    .spanPOld {
      font-size: 45px;
    }
    .divOld {
      font-size: 35px;
    }
  }
  .zlbItem {
    height: 11vh;
  }
}
</style>
