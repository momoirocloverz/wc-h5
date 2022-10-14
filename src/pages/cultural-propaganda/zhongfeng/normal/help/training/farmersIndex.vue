<template>
  <div class="outer">
    <pull-refresh v-model="state.refreshing" @refresh="onRefresh">
      <list
        v-model:loading="state.loading"
        class="cusVanList"
        :immediate-check="false"
        :finished="state.finished"
        @load="onLoad"
      >
        <div
          class="itemCon"
          v-for="(item, index) in state.arrayList"
          :key="index"
          @click="toStandard(item)"
        >
          <div class="leftPart">
            <div class="leftTop">{{ item.title }}</div>
            <div class="leftBottom">
              发布人：
              <span>
                {{ item.type == 4 ? item.company_name : item.unit }}
              </span>
            </div>
          </div>
          <div class="rightPart">
            <div v-if="item.type == 4">
              <div v-if="item.timeout">
                <div class="timeoutText" @click.stop="toTask(item)">已结束</div>
              </div>
              <div v-else>
                <div
                  class="signUp"
                  v-if="item.is_apply == 0"
                  @click.stop="toTask(item)"
                >
                  报名
                </div>
                <div
                  v-if="item.is_apply == 1"
                  class="normalText"
                  @click.stop="toTask(item)"
                >
                  已报名
                </div>
              </div>
            </div>
            <div v-else class="checkHere">
              <van-icon class="arrow" name="arrow" />
            </div>
          </div>
        </div>
      </list>
      <IsEmpty class="emptyStyle" v-if="!state.arrayList.length"></IsEmpty>
      <IsEnd class="endStyle" v-if="state.arrayList.length"></IsEnd>
    </pull-refresh>
    <div class="whiteFixBack">
      <div class="button" @click="apply">培训申请</div>
    </div>
    <overlay :show="state.showFirst">
      <div class="wrapper1" @click.stop>
        <img
          src="https://img.hzanchu.com/acimg/0146a20702e27cd1276e01d6732ab9dc.png"
          @click="toNext"
        />
      </div>
    </overlay>
    <overlay :show="state.showSecond">
      <div class="wrapper2" @click.stop>
        <img
          src="https://img.hzanchu.com/acimg/8baa668cb4ade15881d94712b00564e4.png"
          @click="closeAll"
        />
      </div>
    </overlay>
  </div>
  <!-- <van-dialog v-model:show="show" show-cancel-button>
    <div class="content">
      <p>是否确定报名参加</p>
      <p>培训养蜂技能</p>
    </div>
    </van-dialog>-->
</template>

<script>
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import IsEnd from '@/components/isEnd.vue'
import IsEmpty from '@/components/isEmpty.vue'
import Request from '@/service/request'
import { Toast, Overlay, List, PullRefresh, Dialog } from 'vant'
import { isZLB } from '@/util/index'
export default {
  components: {
    // [Dialog.Component.name]: Dialog.Component,
    Overlay,
    List,
    PullRefresh,
    IsEnd,
    IsEmpty,
  },
  setup() {
    const Router = useRouter()
    const state = reactive({
      ZLBFLAG: isZLB(),
      arrayList: [],
      showFirst: false,
      showSecond: false,
      finished: false,
      loading: false,
      refreshing: false,
      page: 1,
    })
    const checkModal = () => {
      let modalInfo = localStorage.getItem('showFarmerIndexModal')
        ? JSON.parse(localStorage.getItem('showFarmerIndexModal'))
        : ''
      if (modalInfo) {
        if (modalInfo.phone == localStorage.getItem('phone')) {
          state.showFirst = false
        } else {
          state.showFirst = true
        }
      } else {
        state.showFirst = true
      }
    }
    const initAction = () => {
      state.loading = true
      let data = {
        page_size: 10,
        page: state.page,
      }
      Request.fetchFarmerTrainList(data)
        .then((res) => {
          if (res && res.code == 0) {
            let trans = res.data.data.map((ele) => {
              let now = Date.now()
              let timeFlag = false
              if (ele.type == 4) {
                let sourceTime = new Date(
                  ele.train_time.replace(/-/g, '/')
                ).getTime()
                if (now - sourceTime < 0) {
                  timeFlag = false
                } else {
                  timeFlag = true
                }
              }
              return {
                ...ele,
                timeout: ele.type == 4 ? timeFlag : false,
              }
            })
            // state.arrayList = trans
            const resData = trans
            let previous = state.arrayList
            if (resData.length == 0) {
              state.finished = true
              state.loading = false
              state.refreshing = false
              state.arrayList = previous.concat(resData)
            } else if (resData.length < 10) {
              state.finished = true
              state.loading = false
              state.refreshing = false
              state.arrayList = previous.concat(resData)
            } else if (resData.length >= 10) {
              state.finished = false
              state.refreshing = false
              state.loading = false
              state.page++
              state.arrayList = previous.concat(resData)
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
      checkModal()
      initAction()
    })
    const toStandard = (item) => {
      if (item.type != 4) {
        Router.push({
          name: 'normalTrainingStandard',
          query: {
            id: item.id,
            is_apply: item.is_apply,
          },
        })
      }
    }
    const toTask = (item) => {
      Router.push({
        name: 'normalTrainingSignUp',
        query: {
          id: item.id,
          is_apply: item.is_apply,
        },
      })
    }
    // const signUp = () => {
    //   show.value = true;
    // }
    const apply = () => {
      Router.push('/cultural-propaganda/zhongfeng/training/apply')
    }
    const toNext = () => {
      state.showFirst = false
      state.showSecond = true
    }
    const closeAll = () => {
      state.showFirst = false
      state.showSecond = false
      let obj = {
        phone: localStorage.getItem('phone'),
      }
      localStorage.setItem('showFarmerIndexModal', JSON.stringify(obj))
    }
    const onRefresh = () => {
      state.arrayList = []
      state.page = 1
      state.finished = false
      state.loading = false
      state.refreshing = true
      onLoad()
      setTimeout(() => {
        state.refreshing = false
      }, 500)
    }
    const onLoad = () => {
      initAction()
    }

    return {
      state,
      toStandard,
      toTask,
      // signUp,
      apply,
      toNext,
      closeAll,
      checkModal,
      onRefresh,
      onLoad,
    }
  },
}
</script>

<style lang="less" scoped>
.wrapper1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  img {
    width: 100vw;
  }
}
.wrapper2 {
  width: 100vw;
  display: flex;
  align-items: center;
  img {
    // width: 690px;
    width: 92%;
    margin: 0 auto;
    margin-top: 30px;
  }
}
.checkHere {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
}
.outer {
  position: relative;
  padding: 30px;
  padding-bottom: 120px;
  box-sizing: border-box;
}
.itemCon {
  border-radius: 10px;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  .leftPart {
    width: 480px;
    .leftTop {
      font-size: 32px;
      line-height: 32px;
      font-weight: bold;
      color: #333;
    }
    .leftBottom {
      font-size: 30px;
      color: #999;
      line-height: 30px;
      margin-top: 34px;
    }
  }
  .rightPart {
  }
  .timeoutText {
    width: 146px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 30px;
    font-weight: bold;
    margin-left: auto;
    color: #999;
  }
  .normalText {
    width: 146px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 30px;
    font-weight: bold;
    margin-left: auto;
    color: #16b482;
  }
  .signUp {
    width: 146px;
    height: 50px;
    border-radius: 25px;
    border: 2px solid #ff844e;
    text-align: center;
    line-height: 50px;
    font-size: 30px;
    font-weight: bold;
    margin-left: auto;
    color: #ff844e;
  }
  .arrow {
    font-size: 30px;
    color: #999;
    vertical-align: middle;
  }
}
.whiteFixBack {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 108px;
  background-color: #fff;
  box-sizing: border-box;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 20px;
}
.button {
  left: 50%;
  width: 100%;
  height: 70px;
  background: linear-gradient(#ff844e 0%, #fe6d56 100%);
  border-radius: 35px;
  font-size: 32px;
  color: #fff;
  text-align: center;
  line-height: 70px;
}
.content {
  text-align: center;
  p:nth-of-type(1) {
    font-size: 30px;
    color: #333;
    margin-top: 40px;
  }
  p:nth-of-type(2) {
    font-size: 34px;
    color: #ff844e;
    margin: 30px 0 40px;
  }
}
</style>
