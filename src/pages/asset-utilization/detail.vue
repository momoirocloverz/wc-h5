<template>
  <div class="jobDetailCon">
    <div class="topCon">
      <div class="banner">
        <van-swipe class="my-swipe" indicator-color="white" :loop="false">
          <van-swipe-item v-for="(item, index) in state.image_path" :key="index">
            <div class="imgbox">
              <img :src="item" alt @click="previewImage(index)" />
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <!-- <div class="imgCon"
            :style="  state.info.image_path ? 'background-image: url(' + state.info.image_path[0] + ')'   : 'background-image: url(https://img.hzanchu.com/acimg/a00df9ebc4b71833879c97d9f898f306.png)'    "></div>-->
      <div class="topInfoCon">
        <div class="title" :class="[newState.ZLBFitForOld ? 'titleOld' : '']">
          {{ state.title }}
        </div>
        <div class="priceCon">
          <div class="priceRange" :class="[newState.ZLBFitForOld ? 'priceRangeOld' : '']">{{ state.price }}元/{{ state.unit }}</div>
          <div class="tagCon">
            <div class="priceTag" :class="[newState.ZLBFitForOld ? 'priceTagOld' : '']">
              {{ state.release_name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="middleCon">
      <div class="middleTimeCon">
        <div class="timeTitle" :class="[newState.ZLBFitForOld ? 'timeTitleOld' : '']">详细信息</div>
      </div>
      <!-- <div class="fakeBorder"></div> -->
      <div class="content" :class="[newState.ZLBFitForOld ? 'timeTitleOld' : '']">
        {{ state.content }}
      </div>
      <div class="timeTitle" :class="[newState.ZLBFitForOld ? 'timeTitleOld' : '']">公司地址</div>
      <!-- <div
                v-if="newState.ZLBFLAG"
                class="address"
                :class="[newState.ZLBFitForOld ? 'timeTitleOld' : '']"
            >{{ state.address.replace(state.address.substr(2, 4), "****") }}</div> -->

      <div v-if="newState.ZLBFLAG" class="address" :class="[newState.ZLBFitForOld ? 'timeTitleOld' : '']">
        {{ state.address }}
      </div>

      <div v-else class="address">{{ state.address }}</div>
      <div class="timeTitle" :class="[newState.ZLBFitForOld ? 'timeTitleOld' : '']">发布时间</div>
      <div class="moneyContent" :class="[newState.ZLBFitForOld ? 'timeTitleOld' : '']">
        {{ state.created_at }}
      </div>
    </div>
    <div class="hintBlock">该信息是公共平台发布，提前转账汇款不听、不信</div>
    <div class="bottomCon">
      <div class="fakeBtn ableBtn" v-if="newState.ZLBFLAG" @click="phoneCall" :class="[newState.ZLBFitForOld ? 'fakeBtnOld' : '']">电话联系</div>
      <a :href="'tel:' + state.mobile" v-else>
        <div class="fakeBtn ableBtn">电话联系</div>
      </a>
    </div>
  </div>
</template>
<script>
import Request from '@/service/request.js'
import { reactive, onMounted, ref } from 'vue'
import { Swipe, SwipeItem, Toast, ImagePreview } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { isZLB } from '@/util/index'
export default {
  components: { Swipe, SwipeItem, ImagePreview },
  setup() {
    const route = useRoute()
    const state = ref('')
    const newState = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
    })
    onMounted(() => {
      let id = route.query.id
      if (id) {
        Request.propertyInfo({
          property_id: id
        })
          .then((res) => {
            if (res.code === 0) {
              state.value = res.data
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    })
    const phoneCall = () => {
      ZWJSBridge.phoneCall({
        corpId: state.value.mobile
      })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    const previewImage = (index) => {
      ImagePreview({
        images: state.value.image_path,
        startPosition: index
      })
    }
    return {
      previewImage,
      state,
      newState,
      phoneCall
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
.jobDetailCon {
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
    .topInfoCon {
      padding-left: 20px;
      padding-right: 20px;
      box-sizing: border-box;
      padding-top: 30px;
      padding-bottom: 30px;
      height: 190px;
    }

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
    margin-right: 20px;
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
    font-size: 50px !important;
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
