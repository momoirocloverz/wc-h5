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
          <div class="flexBetween">
            <div class="middleFirTLeft">{{ state.info && state.info.name }}</div>
            <div :class="['statusMap', 'status' + state.info.is_open]">{{ state.showOperate == '1' ? '开放预约' : '结束预约' }}</div>
          </div>
        </div>
        <div class="middleFirMiddlOuter">
          <div class="middleFirMiddle borderBottom">
            <van-icon name="clock-o" />
            <span>截止日期：{{ state.info.start_date }}至{{ state.info.end_date }}</span>
          </div>
        </div>
        <div class="middleFirMiddlOuter">
          <div class="middleFirMiddle">
            <van-icon name="location-o" />
            <span>车间地址：{{ state.info.address }}</span>
          </div>
        </div>
      </div>
      <div class="middleSecond"></div>
      <div class="middleThird">
        <div class="middleThirdTitle">车间介绍</div>
        <div class="middleThirContent">{{ state.info.introduce }}</div>
      </div>
    </div>
    <div class="bottomCon fixBottom" v-if="state.showOperate == 1">
      <div class="fakeBtn ableBtn" @click="toAction" :class="[state.ZLBFitForOld ? 'fakeBtnOld' : '']">我要预约</div>
    </div>
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
      crop_categoryMap: {
        1: '农产品',
        2: '农用物资',
        3: '其他'
      },
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      showOperate: '0',
      statusMap: {
        0: '结束预约',
        1: '开放预约'
      }
    })
    onBeforeMount(() => {
      let plant_id = Route.query.plant_id
      let showOperate = Route.query.showOperate
      if (showOperate && showOperate == 1) {
        state.showOperate = '1'
      }
      if (plant_id) {
        Request.IndustryPlantInfo({
          id: plant_id
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
      let trans = dayjs(state.info.end_date).format('YYYY/MM/DD')
      if (new Date(trans).getTime() > Date.now()) {
        Router.push({
          name: 'IndustryAllianceFarmerWorkCraftapply',
          query: {
            plant_id: Route.query.plant_id
          }
        })
      } else {
        Toast('超出截止时间，不可预约')
      }
    }
    return {
      state,
      toAction
    }
  }
}
</script>
<style lang="less" scoped>
.fixBottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.status1 {
  color: #1bb578;
  background-color: rgba(27, 181, 120, 0.3);
}
.status0 {
  color: #999;
  background-color: rgba(153, 153, 153, 0.3);
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
  padding-bottom: 30px;
  box-sizing: border-box;
  position: relative;
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
      //   border-bottom: 1px solid #e8e9ec;
      .middleFirTLeft {
        font-size: 32px;
        font-weight: 500;
        color: #2b333f;
      }
    }
    .middleFirMiddle {
      padding-top: 26px;
      padding-bottom: 26px;
      font-size: 28px;
      color: #333333;
      span {
        margin-left: 20px;
      }
      //   margin-bottom: 32px;
    }
    .borderBottom {
      border-bottom: 1px solid #e8e9ec;
      border-top: 1px solid #e8e9ec;
    }
    .middleFirMiddlOuter {
      padding-left: 32px;
      padding-right: 32px;
      box-sizing: border-box;
    }
    .middleFirThirdLeft {
      font-size: 32px;
      color: #e63633;
    }
    .middleFirThirdRight {
      font-size: 24px;
      color: #4d4d4d;
    }
    .middleFirBottom {
    }
    .middleSecond {
      height: 20px;
      background-color: #f3f6f9;
    }
    .middleThird {
      background-color: #fff;
      padding-top: 32px;
      padding-left: 36px;
      padding-right: 36px;
      padding-bottom: 32px;
      box-sizing: border-box;
      .middleThirdTitle {
        font-size: 28px;
        font-weight: 500;
        color: #2b333f;
        margin-bottom: 10px;
      }
      .middleThirContent {
        font-size: 28px;
        color: #737373;
      }
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
