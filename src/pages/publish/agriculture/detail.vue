<template>
  <div class="argicultureDetailCon">
    <div class="topCon">
      <div class="banner">
        <van-swipe class="my-swipe" indicator-color="white" :loop="false">
          <van-swipe-item v-for="item in state.info.image_path" :key="item">
            <div class="imgbox">
              <img :src="item" alt />
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="topInfoCon">
        <div class="title" :class="[state.ZLBFitForOld ? 'titleOld' : '']">
          {{ state.info.issue_title }}
        </div>
        <div class="priceCon">
          <div class="priceRange" :class="[state.ZLBFitForOld ? 'priceRangeOld' : '']">{{ state.info.price }}元/{{ state.info.unit }}</div>
          <div class="tagCon">
            <div class="priceTag" :class="[state.ZLBFitForOld ? 'priceTagOld' : '']">
              {{ state.info.category_data }}
            </div>
            <div class="priceTag leftTag" :class="[state.ZLBFitForOld ? 'priceTagOld' : '']" v-if="state.info.crop_category_name">
              {{ state.info.crop_category_name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="middleCon">
      <div class="middleTimeCon">
        <div class="timeTitle" :class="[state.ZLBFitForOld ? 'timeTitleOld' : '']">商品详情</div>
      </div>
      <!-- <div class="fakeBorder"></div> -->
      <div class="content" :class="[state.ZLBFitForOld ? 'timeTitleOld' : '']">
        {{ state.info.issue_content }}
      </div>
      <div class="timeTitle" :class="[state.ZLBFitForOld ? 'timeTitleOld' : '']">联系地址</div>
      <!-- <div
                v-if="state.ZLBFLAG"
                class="address"
                :class="[state.ZLBFitForOld ? 'timeTitleOld' : '']"
            >{{ state.info.address.replace(state.info.address.substr(2, 4), "****") }}</div> -->

      <div v-if="state.ZLBFLAG" class="address" :class="[state.ZLBFitForOld ? 'timeTitleOld' : '']">
        {{ state.info.address }}
      </div>
      <div class="address" v-else>{{ state.info.address }}</div>
      <div class="timeTitle" :class="[state.ZLBFitForOld ? 'timeTitleOld' : '']">发布时间</div>
      <div class="moneyContent" :class="[state.ZLBFitForOld ? 'timeTitleOld' : '']">
        {{ state.info.created_at }}
      </div>
    </div>
    <div class="hintBlock">该信息是公共平台发布，提前转账汇款不听、不信</div>
    <div class="bottomCon">
      <div class="fakeBtn ableBtn" v-if="state.ZLBFLAG" @click="callPhone" :class="[state.ZLBFitForOld ? 'fakeBtnOld' : '']">电话联系</div>
      <a :href="'tel:' + state.info.mobile" v-else>
        <div class="fakeBtn ableBtn">电话联系</div>
      </a>
    </div>
  </div>
</template>
<script>
import Request from '@/service/request.js'
import { reactive, onBeforeMount } from 'vue'
import { Field, List, PullRefresh, Swipe, SwipeItem, Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { isZLB } from '@/util/index'
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
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
    })
    onBeforeMount(() => {
      let id = Route.query.id
      if (id) {
        Request.issueInfo({
          id,
          issue_type: '2'
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
    const callPhone = () => {
      ZWJSBridge.phoneCall({
        corpId: state.info.mobile
      })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    return {
      state,
      callPhone
    }
  }
}
</script>
<style lang="less" scoped>
.hintBlock {
  background-color: rgba(253, 132, 78, 0.06);
  color: #fd844e;
  font-size: 30px;
  line-height: 40px;
  padding: 10px 32px;
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
  //   margin-bottom: 20px;
}
.argicultureDetailCon {
  padding-top: 12px;
  padding-bottom: 30px;
  box-sizing: border-box;
  position: relative;
  min-height: 100vh;
  .topCon {
    background-color: #fff;
    box-sizing: border-box;
    // .imgCon {
    //   width: 100%;
    //   height: 500px;
    //   background-repeat: no-repeat;
    //   background-position: center;
    //   background-size: cover;
    // }
    .my-swipe {
      width: 100%;
      height: 500px;
      .imgbox {
        width: 100%;
        height: 500px;
        position: relative;
        overflow: hidden;
        img {
          position: absolute;
          width: 100%;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
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
  .middleCon {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 40px;
    padding-bottom: 20px;
    box-sizing: border-box;
    margin-top: 20px;
    background-color: #fff;
    .middleTimeCon {
      display: flex;
      justify-content: space-between;
      align-content: center;
      align-items: center;
      margin-bottom: 25px;
    }
    .timeTitle {
      font-size: 30px;
      font-weight: 500;
      color: #666;
    }
    .timeTitleOld {
      font-size: 50px;
      font-weight: 800;
    }
    .timer {
      font-size: 28px;
      font-weight: 500;
      color: #666;
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
