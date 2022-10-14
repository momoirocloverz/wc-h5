<template>
  <div class="industryFarmerDetailCon">
    <div class="topCon">
      <div class="banner">
        <van-swipe class="my-swipe" indicator-color="white" :loop="false">
          <van-swipe-item v-for="item in state.info.img_list" :key="item">
            <div
              class="imgbox"
              :style="{
                backgroundImage: 'url(' + item + ')'
              }"
            ></div>
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
    <div class="middleCon">
      <div class="middleFirst">
        <div class="middleFirTop">
          <div class="flexBetween mb10">
            <div class="middleFirTLeft">{{ state.info && state.info.title }}</div>
            <div :class="['statusMap', 'status' + state.info.status]">{{ state.statusMap[state.info.status] }}</div>
          </div>
          <div class="middleFirMiddle">截止日期：{{ state.info.limit_date }}</div>
          <div class="flexBetween">
            <div class="middleFirThirdLeft">{{ state.info.price }}元/斤</div>
            <div class="middleFirThirdRight">目前完成率{{ rateFormat(state.info.finish_rate * 100) }}%</div>
          </div>
        </div>
        <div class="middleFirBottom">
          <div class="middleFirBotItem">
            <div>认种农作物：</div>
            <div>{{ state.info.type }}</div>
          </div>
          <div class="middleFirBotItem">
            <div>认种总面积：</div>
            <div>{{ state.info.area }}亩</div>
          </div>
          <div class="middleFirBotItem">
            <div>最低认种面积：</div>
            <div>{{ state.info.low_area }}亩</div>
          </div>
          <div class="middleFirBotItem">
            <div>最高认种面积：</div>
            <div>{{ state.info.high_area }}亩</div>
          </div>
        </div>
      </div>
      <div class="greyArea"></div>
      <div class="middleSecond">
        <div class="progressCon">
          <div class="subTitle">认种流程</div>
          <div class="sameOuter">
            <div class="sameMix">
              <img src="https://img.hzanchu.com/acimg/ab1207c680cbdc8c6cbf870dec63287e.png" />
              <div>认种订单</div>
            </div>
            <div class="sameSize">签署协议，录入相关信息，并提交订单</div>
          </div>
          <div class="sameOuter">
            <div class="sameMix">
              <img src="https://img.hzanchu.com/acimg/6499211aaee6cda0569ac1b76a07cf7f.png" />
              <div>检测土地，支付预付款</div>
            </div>
            <div class="sameSize">线下技术人员检测土地农残等，发放种子，指导种植</div>
          </div>
          <div>
            <div class="sameMix">
              <img src="https://img.hzanchu.com/acimg/357bada9cba34e5ba07e4f8be19f65c4.png" />
              <div>上门收购，支付尾款</div>
            </div>
            <div class="sameSize">农作为成熟后，按照约定价格收购，并支付尾款</div>
          </div>
        </div>
      </div>
      <div class="greyArea"></div>
      <div class="middleThird">
        <div class="progressCon">
          <div class="subTitle">认种要求</div>
          <div class="sameSize">{{ state.info.demand }}</div>
        </div>
      </div>
    </div>
    <div class="bottomCon fixBottom">
      <div class="fakeBtn ableBtn" @click="toAction" :class="[state.ZLBFitForOld ? 'fakeBtnOld' : '']">我要认种</div>
    </div>
    <!-- <div class="fakeBorder"></div> -->
  </div>
</template>
<script>
import Request from '@/service/request.js'
import { reactive, onBeforeMount } from 'vue'
import { Field, List, PullRefresh, Swipe, SwipeItem, Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { isZLB } from '@/util/index'
import dayjs from 'dayjs'
export default {
  components: {
    Field,
    List,
    PullRefresh,
    Swipe,
    SwipeItem
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      info: {},
      statusMap: {
        0: '进行中',
        1: '已下架',
        2: '已结束'
      },
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
    })
    onBeforeMount(() => {
      let id = Route.query.id
      if (id) {
        Request.IndustrySeedInfo({
          id
        })
          .then((res) => {
            if (res && res.code == 0) {
              state.info = res.data
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    })
    const toAction = () => {
      sessionStorage.removeItem('signName1')
          sessionStorage.removeItem('signAreaValue1')
      let trans = dayjs(state.info.limit_date).format('YYYY/MM/DD HH:mm:ss')
      if (new Date(trans).getTime() > Date.now()) {
        Router.push({
          name: 'IndustryAllianceFarmerSubDetAction',
          query: {
            id: Route.query.id
          }
        })
      } else {
        Toast('超出截止时间，不可预约')
      }
    }
    const rateFormat = (value) => {
      if (value || value == 0) {
        let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(0)
        return fix
      }
    }
    return {
      state,
      rateFormat,
      toAction
    }
  }
}
</script>
<style lang="less" scoped>
.sameSize {
  font-size: 28px;
  color: #666666;
}
.sameOuter {
  margin-bottom: 16px;
}
.sameMix {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  div {
    font-size: 28px;
    color: #333333;
    margin-top: 13px;
    margin-left: 20px;
  }
}
.greyArea {
  height: 20px;
  background-color: #f3f6f9;
}
.subTitle {
  font-size: 28px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16px;
}
.fixBottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.fakeBorder {
  width: 710px;
  margin: 0 auto;
  height: 2px;
  background-color: #e6e6e6;
}
.content {
  font-size: 28px;
  font-weight: 500;
  text-align: left;
  color: #333;
  line-height: 50px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.address {
  font-size: 28px;
  font-weight: 500;
  text-align: left;
  color: #333;
  line-height: 50px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.moneyContent {
  font-size: 28px;
  font-weight: 500;
  text-align: left;
  color: #333;
  line-height: 50px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.industryFarmerDetailCon {
  padding-bottom: 100px;
  box-sizing: border-box;
  position: relative;
  overflow-y: scroll;
  min-height: 100vh;
  .topCon {
    background-color: #fff;
    box-sizing: border-box;
    .my-swipe {
      width: 100%;
      height: 566px;
      .imgbox {
        width: 100%;
        height: 566px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        min-height: 566px;
      }
    }
    .topInfoCon {
      padding-left: 20px;
      padding-right: 20px;
      box-sizing: border-box;
      padding-top: 30px;
      padding-bottom: 30px;
      height: 190px;
    }
  }
  .priceCon {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
  }
  .tagCon {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
  }
  .priceRange {
    font-size: 36px;
    font-weight: 500;
    color: #f51818;
  }

  .priceRangeOld {
    font-size: 50px;
    font-weight: 800;
  }

  .leftTag {
    margin-left: 20px;
  }
  .priceTag {
    padding-left: 30px;
    padding-right: 30px;
    height: 50px;
    background-color: #fff;
    border: 1px solid #999999;
    border-radius: 11px;
    text-align: center;
    font-size: 28px;
    font-weight: 500;
    color: #999;
    line-height: 50px;
  }
  .priceTagOld {
    font-size: 34px;
    font-weight: 800;
  }
  .title {
    font-size: 36px;
    font-weight: 700;
    color: #333;
  }
  .titleOld {
    font-size: 50px;
    font-weight: 800;
  }
  .flexBetween {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
  }
  .mb10 {
    margin-bottom: 10px;
  }
  .middleCon {
    padding-bottom: 130px;
    box-sizing: border-box;
    position: absolute;
    top: 530px;
    width: 100%;
    background-color: #fff;
    border-radius: 16px 16px 0 0;
    left: 0;
    .middleFirst {
    }
    .middleFirTop {
      padding: 32px;
      box-sizing: border-box;
      border-bottom: 1px solid #e8e9ec;
      .middleFirTLeft {
        font-size: 32px;
        color: #2b333f;
      }
      .middleFirTRight {
        font-size: 24px;
        color: #1bb578;
      }
    }
    .statusMap {
      height: 38px;
      font-size: 24px;
      line-height: 38px;
      border-radius: 4px 4px 4px 4px;
      opacity: 0.9;
      padding-left: 10px;
      padding-right: 10px;
    }
    .status0 {
      color: #1bb578;
      background-color: rgba(27, 181, 120, 0.3);
    }
    .status1 {
      color: #e63633;
      background-color: rgba(230, 54, 51, 0.3);
    }
    .status2 {
      color: #999;
      background-color: rgba(153, 153, 153, 0.3);
    }
    .middleFirMiddle {
      font-size: 24px;
      font-weight: 500;
      color: #999;
      margin-bottom: 32px;
    }
    .middleFirThirdLeft {
      font-size: 32px;
      color: #e63633;
    }
    .middleFirThirdRight {
      font-size: 24px;
      color: #4d4d4d;
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 6px;
      padding-bottom: 6px;
      box-sizing: border-box;
      border: 1px solid #e0e0e0;
    }
    .middleFirBottom {
      padding: 24px 32px;
    }
    .middleFirBotItem {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      align-content: center;
      margin-bottom: 26px;
      &:last-child {
        margin-bottom: 0;
      }
      div {
        &:nth-child(1) {
          font-size: 28px;
          color: #666666;
          width: 270px;
        }
        &:nth-child(2) {
          font-size: 28px;
          color: #333333;
        }
      }
    }
    .middleSecond {
      padding: 24px 32px;
      box-sizing: border-box;
      img {
        width: 46px;
        height: 72px;
      }
    }
    .middleThird {
      padding: 24px 32px;
      box-sizing: border-box;
    }
  }
  .bottomCon {
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    padding-left: 90px;
    padding-right: 90px;
    padding-top: 14px;
    box-sizing: border-box;
    width: 100%;
    height: 100px;
    box-shadow: 1px 5px 46px 5px rgba(7, 8, 7, 0.1);
  }
  .fakeBtn {
    font-size: 32px;
    height: 70px;
    border-radius: 35px;
    background-color: #d1d1d1;
    text-align: center;
    line-height: 70px;
    color: #fff;
  }
  .fakeBtnOld {
    font-size: 45px;
  }
  .ableBtn {
    background: linear-gradient(to right, #ff844e 0%, #fe6d56 100%);
  }
}
</style>
