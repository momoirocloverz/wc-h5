<template>
  <div class="groupMyEarnCon">
    <div class="top">
      <div class="title">收益人</div>
      <div class="itemCon">
        <div class="itemCommon">
          <div class="itemLeft" v-if="state.ZLBFLAG">
            {{ state.name.replace(state.name.substr(0, 1), '*') }}
          </div>
          <div class="itemLeft" v-else>{{ state.name }}</div>
        </div>
      </div>
    </div>
    <div class="middle">
      <div class="title">收益详情</div>
      <div>
        <template v-for="(item, index) in state.array" :key="index">
          <div class="itemContainer">
            <div class="topLine">
              <div class="flexStep">
                <div
                  class="stepTitle"
                  :class="[item.active ? 'activeTitle' : '']"
                >
                  {{ item.title }}
                </div>
                <div class="money" v-if="item.active">{{ item.money }}</div>
              </div>
            </div>
            <div class="describe" v-if="item.active">{{ item.describe }}</div>
          </div>
        </template>
      </div>
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
      name: '暂无',
      activeIcon:
        'https://img.hzanchu.com/acimg/3ce852b3c1d17e5c8275a4222ece8c60.png',
      notActiveIcon:
        'https://img.hzanchu.com/acimg/d1d8d6aec1b87d9b51a2d7d369c8095c.png',
      array: [],
    })
    const initAction = () => {
      let track = localStorage.getItem('currentUserInfo')
        ? JSON.parse(localStorage.getItem('currentUserInfo'))
        : ''
      if (track) {
        if (track.type == 1) {
          if (track.farmer_info && track.farmer_info.basic) {
            state.name = track.farmer_info.basic.TName
          }
        }
      }

      Request.planIncomeProfit({})
        .then((res) => {
          if (res && res.code == 0) {
            if (res.data.is_drop == 1) {
              state.array = [
                {
                  title: '退出自筹金额',
                  describe: `5000已退回`,
                  money: '+5000',
                  active: true,
                },
                {
                  title: '本次分红',
                  describe: `${res.data.settle_amount}已到账`,
                  money: `+${res.data.settle_amount}`,
                  active: +res.data.settle_amount > 0 ? true : false,
                },
                {
                  title: '累计分红',
                  describe: `${res.data.sum_profit}已全部到账`,
                  money: `${res.data.sum_profit}`,
                  active: +res.data.sum_profit > 0 ? true : false,
                },
              ]
            } else {
              state.array = [
                {
                  title: '自筹金额',
                  describe: `${res.data.self_fund}已缴纳`,
                  money: `+${res.data.self_fund}`,
                  active: +res.data.self_fund > 0 ? true : false,
                },
                {
                  title: '银行贷款',
                  describe: `${res.data.bank_loan}已到账`,
                  money: `+${res.data.bank_loan}`,
                  active: +res.data.bank_loan > 0 ? true : false,
                },
                {
                  title: '政府补贴',
                  describe: `${res.data.gov_subsidy}已到账`,
                  money: `+${res.data.gov_subsidy}`,
                  active: +res.data.gov_subsidy > 0 ? true : false,
                },
                {
                  title: '投资总额',
                  describe: `${res.data.total_inv}已扣除`,
                  money: `-${res.data.total_inv}`,
                  active: +res.data.total_inv > 0 ? true : false,
                },
                {
                  title: '分红资金',
                  describe: `${res.data.share_amount}已到账`,
                  money: `+${res.data.share_amount}`,
                  active: +res.data.share_amount > 0 ? true : false,
                },
                {
                  title: '贷款利息',
                  describe: `${res.data.loan_interest}已扣除`,
                  money: `-${res.data.loan_interest}`,
                  active: +res.data.loan_interest > 0 ? true : false,
                },
                {
                  title: '贷款贴息',
                  describe: `${res.data.loan_save}已到账`,
                  money: `+${res.data.loan_save}`,
                  active: +res.data.loan_save > 0 ? true : false,
                },
                {
                  title: '结算分红',
                  describe: `${res.data.after_tax_amount}已到账`,
                  money: `+${res.data.after_tax_amount}`,
                  active: +res.data.after_tax_amount > 0 ? true : false,
                },
              ]
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
    return {
      state,
    }
  },
}
</script>

<style scoped lang="less">
.groupMyEarnCon {
  background-color: #fff;
  padding: 50px;
  padding-top: 22px;
  box-sizing: border-box;
  min-height: 100vh;
  .itemContainer {
    position: relative;
    padding-bottom: 54px;
    box-sizing: border-box;
    img {
      width: 26px;
    }
  }
  .flexStep {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
  }
  .topLine {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
  }
  .describe {
    font-size: 24px;
    color: #999;
    margin-top: 12px;
  }
  .stepTitle {
    font-size: 28px;
    color: #999;
    width: 200px;
  }

  .money {
    font-size: 28px;
    font-weight: 700;
    color: #ff844e;
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
  }
  .middle {
    margin-bottom: 30px;
  }
  .activeTitle {
    color: #ff844e;
  }
}
</style>
