<template>
  <div class="jobListCon">
    <tabs
      v-model:active="state.topActive"
      @click="onClick"
      sticky
      swipeable
      key="3"
      class="firstTab"
      :class="[state.ZLBFitForOld ? 'tabOld' : '']"
    >
      <tab title="招聘">
        <div class="paddingTop spPadding">
          <tabs
            key="4"
            v-model:active="state.rightActive"
            @click="onThirdClick"
            class="secondTab"
          >
            <tab v-for="(item, index) in state.tabArr" :key="index">
              <template #title>{{ item.name }}</template>
            </tab>
          </tabs>
          <pull-refresh
            v-if="state.topActive == 0"
            key="22"
            v-model="state.refreshing"
            @refresh="onRefresh"
          >
            <list
              v-model:loading="state.loading"
              class="cusVanList"
              :immediate-check="false"
              :finished="state.finished"
              @load="typeList"
            >
              <div
                class="cusCellItem"
                @click="checkDetail(item)"
                v-for="(item, index) in state.listData"
                :key="index + 10"
              >
                <div class="itemCon">
                  <div class="imgCon">
                    <img v-if="item.image_path" :src="item.image_path[0]" alt />
                  </div>
                  <div class="rightSide">
                    <div
                      class="title"
                      :class="[state.ZLBFitForOld ? 'titleOld' : '']"
                    >
                      {{ item.issue_title }}
                    </div>
                    <div
                      class="price"
                      :class="[state.ZLBFitForOld ? 'priceOld' : '']"
                    >
                      {{ item.price }}元/{{ item.unit }}
                    </div>
                    <div class="lastLine">
                      <div
                        class="itemType"
                        :class="[state.ZLBFitForOld ? 'itemTypeOld' : '']"
                      >
                        {{ item.category_data }}
                      </div>
                      <div
                        class="time"
                        :class="[state.ZLBFitForOld ? 'timeOld' : '']"
                      >
                        {{ item.created_at }}
                      </div>
                    </div>
                  </div>
                </div>
                <divider :style="{ margin: '0', padding: '0 18px' }" />
              </div>
            </list>
            <IsEmpty class="emptyStyle" v-if="!state.listData.length"></IsEmpty>
            <IsEnd class="endStyle" v-if="state.listData.length"></IsEnd>
          </pull-refresh>
        </div>
      </tab>
      <tab title="求职">
        <div class="paddingTop">
          <tabs
            key="4"
            v-model:active="state.rightActive"
            @click="onThirdClick"
            class="secondTab"
          >
            <tab v-for="(item, index) in state.tabArr" :key="index">
              <template #title>{{ item.name }}</template>
            </tab>
          </tabs>
          <pull-refresh
            key="2"
            v-model="state.refreshing"
            @refresh="onRefresh"
            v-if="state.topActive"
          >
            <list
              v-model:loading="state.loading"
              class="cusVanList"
              :immediate-check="false"
              :finished="state.finished"
              @load="typeList"
            >
              <div
                class="cusCellItem"
                @click="checkDetail(item)"
                v-for="(item, index) in state.listData"
                :key="index"
              >
                <div class="itemCon">
                  <div class="listImgOuter">
                    <div class="imgCon">
                      <img
                        v-if="item.image_path"
                        :src="item.image_path[0]"
                        alt
                      />
                    </div>
                  </div>
                  <div class="rightSide">
                    <div class="title">{{ item.issue_title }}</div>
                    <div class="price">{{ item.price }}元/{{ item.unit }}</div>
                    <div class="lastLine">
                      <div class="itemType">{{ item.category_data }}</div>
                      <div class="time">{{ item.created_at }}</div>
                    </div>
                  </div>
                </div>
                <divider :style="{ margin: '0', padding: '0 18px' }" />
              </div>
            </list>
            <IsEmpty class="emptyStyle" v-if="!state.listData.length"></IsEmpty>
            <IsEnd class="endStyle" v-if="state.listData.length"></IsEnd>
          </pull-refresh>
        </div>
      </tab>
    </tabs>
    <div class="publishCircle" @click="goToPublish" v-if="!route.query.active">
      <icon
        class="iconCircle"
        name="https://img.hzanchu.com/acimg/7f17ae6b5ce3b2822348154822303308.png"
      ></icon>
      <div
        class="publishText"
        :class="[state.ZLBFitForOld ? 'publishTextOld' : '']"
      >
        发布
      </div>
    </div>
    <div class="mask" v-show="state.showLoading">
      <loading color="#ff844e" class="setLoading" size="50px" vertical
        >加载中...</loading
      >
    </div>
  </div>
</template>
<script>
import Request from '@/service/request.js'
import IsEmpty from '@/components/isEmpty.vue'
import IsEnd from '@/components/isEnd.vue'
import { reactive, onMounted } from 'vue'
import _ from 'lodash'
import {
  List,
  PullRefresh,
  Tab,
  Tabs,
  Icon,
  Divider,
  Loading,
  Toast,
} from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { isZLB } from '@/util/index'
export default {
  components: {
    List,
    PullRefresh,
    Tab,
    Tabs,
    Icon,
    Divider,
    Loading,
    IsEmpty,
    IsEnd,
  },
  setup() {
    const state = reactive({
      name: '',
      page: 1,
      total: 0,
      showLoading: false,
      rightActive: 0,
      id: '',
      listData: [],
      finished: false,
      loading: false,
      refreshing: false,
      firstTab: '1',
      issue_category: 0,
      tabArr: [],
      topActive: 0,
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
    })
    const Router = useRouter()
    const route = useRoute()
    const onRefresh = () => {
      state.listData = []
      state.page = 1
      state.finished = false
      state.loading = false
      if (state.tabArr.length && state.issue_category) {
        inside()
      } else {
        typeList()
      }
      setTimeout(() => {
        state.refreshing = false
      }, 1000)
    }
    onMounted(() => {
      let flag = sessionStorage.getItem('jobListReload')
        ? sessionStorage.getItem('jobListReload')
        : ''
      if (flag) {
        setTimeout(() => {
          state.listData = []
          state.page = 1
          sessionStorage.removeItem('jobListReload')
          typeList()
        }, 2000)
      } else {
        typeList()
      }
    })
    const typeList = () => {
      sessionStorage.setItem('jobListReload', '1')
      Request.issueType({
        type: '4',
      }).then((res) => {
        if (res.code === 0) {
          if (!state.tabArr.length && !state.issue_category) {
            state.tabArr = res.data.data
            state.issue_category = res.data.data[0].id
          }
          onLoad()
        }
      })
    }
    const inside = () => {
      state.showLoading = true
      state.loading = true
      Request.issueList({
        page_size: 10,
        page: state.page,
        issue_type: 2,
        issue_category: state.topActive ? 1 : 2,
        crop_category: state.issue_category,
      })
        .then((res) => {
          if (res && res.code == 0) {
            const resData = res.data.data
            let previous = state.listData
            state.total = res.data.total
            if (resData.length == 0) {
              state.finished = true
              state.loading = false
              state.refreshing = false
              state.listData = previous.concat(resData)
              state.listData = _.uniqBy(state.listData, 'id')
            } else if (resData.length < 10) {
              state.finished = true
              state.loading = false
              state.refreshing = false
              state.listData = previous.concat(resData)
              state.listData = _.uniqBy(state.listData, 'id')
            } else if (resData.length >= 10) {
              state.finished = false
              state.refreshing = false
              state.loading = false
              state.page++
              state.listData = previous.concat(resData)
              state.listData = _.uniqBy(state.listData, 'id')
            }
          } else {
            Toast(res.msg)
            state.finished = true
          }
        })
        .catch((err) => {
          state.finished = true
        })
        .finally(() => {
          state.showLoading = false
          sessionStorage.removeItem('jobListReload')
        })
    }
    const onLoad = () => {
      //   state.finished = true;
      //   state.loading = false
      //   state.refreshing = false
      sessionStorage.setItem('jobListReload', '1')
      inside()
    }
    const onClick = (name, title) => {
      state.firstTab = name
      sessionStorage.removeItem('jobListReload')
      state.issue_category = state.issue_category
      state.listData = []
      state.page = 1
      state.finished = false
      state.loading = false
      if (state.tabArr.length && state.issue_category) {
        inside()
      } else {
        typeList()
      }
      state.refreshing = false
    }
    const onThirdClick = (name) => {
      state.page = 1
      state.issue_category = state.tabArr[name].id
      onRefresh()
    }
    const goToPublish = () => {
      Router.push({
        name: 'jobPublish',
      })
    }
    const checkDetail = (item) => {
      Router.push({
        name: 'jobDetail',
        query: {
          id: item.id,
        },
      })
    }
    return {
      state,
      onRefresh,
      onLoad,
      inside,
      onClick,
      onThirdClick,
      goToPublish,
      checkDetail,
      typeList,
      route,
    }
  },
}
</script>
<style lang="less" scoped>
.mask {
  z-index: 3;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.2);
  .setLoading {
    margin-top: 5rem;
  }
}
.jobListCon {
  position: relative;
  .emptyStyle {
    margin-top: 100px;
    margin-bottom: 140px;
  }
  .fakeBorder {
    // width: 690px;
    width: 92%;
    margin: 0 auto;
    height: 2px;
    background-color: #e6e6e6;
  }
  .endStyle {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .publishCircle {
    position: fixed;
    right: 20px;
    bottom: 210px;
    width: 120px;
    height: 120px;
    background-color: #fff;
    border: 2px solid #ff844e;
    border-radius: 70px;
    box-shadow: 0px 0px 11px 0px rgba(7, 8, 7, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
    .publishText {
      height: 27px;
      font-size: 28px;
      font-weight: 500;
      text-align: center;
      color: #ff844e;
      line-height: 42px;
    }
    .publishTextOld {
      font-size: 40px;
    }
    .iconCircle {
      font-size: 40px;
    }
  }
  .cusVanList {
  }
  .cusCellItem {
  }
  .paddingTop {
    margin-top: 20px;
    background-color: #fff;
  }
  // .spPadding {
  //   padding-top: 20px;
  // }
  .itemCon {
    padding: 38px 30px;
    box-sizing: border-box;
    height: 260px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    // .listImgOuter {
    //   width: 270px;
    //   height: 188px;
    //   margin-right: 30px;
    // }
    .imgCon {
      width: 270px;
      height: 188px;
      border-radius: 10px;
      position: relative;
      overflow: hidden;
      background: url(https://img.hzanchu.com/acimg/a00df9ebc4b71833879c97d9f898f306.png)
        no-repeat;
      background-size: 100%;
      margin-right: 30px;
      img {
        position: absolute;
        width: 100%;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .rightSide {
      width: 480px;
    }
    .title {
      height: 90px;
      font-size: 32px;
      font-weight: 600;
      text-align: left;
      color: #333;
      line-height: 42px;
    }
    .titleOld {
      font-size: 50px;
      line-height: 52px;
      font-weight: 800;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      overflow: hidden;
    }
    .price {
      font-size: 28px;
      text-align: left;
      color: #f51818;
      line-height: 42px;
      margin-bottom: 10px;
    }
    .priceOld {
      font-size: 45px;
      font-weight: 800;
    }
    .lastLine {
      display: flex;
      justify-content: space-between;
      align-content: center;
      align-items: center;
    }
    .itemType {
      font-size: 26px;
      text-align: left;
      color: #999;
      line-height: 42px;
    }
    .itemTypeOld {
      font-size: 35px;
      font-weight: 800;
      line-height: 40px;
    }
    .time {
      font-size: 26px;
      font-weight: 500;
      text-align: left;
      color: #999;
    }
    .timeOld {
      font-size: 35px;
      font-weight: 800;
    }
  }
}
</style>
<style lang="less">
.jobListCon {
  .tabOld {
    .van-tab__text {
      font-size: 42px !important;
      line-height: 45px;
      font-weight: 800 !important;
    }
  }
  .firstTab {
    .van-tabs__wrap {
      height: 85px;
    }
    .van-tabs__line {
      background-color: #ff844e;
    }
    .van-tab__text {
      font-size: 32px;
      font-weight: 500;
    }
    .van-tab--active {
      color: #ff844e;
      .van-tab__text {
        font-weight: 700;
      }
    }
    .secondTab {
      .tabItemOuter {
      }
      .van-tab {
        // margin-right: 20px;
      }
      .van-tabs__line {
        background-color: rgba(0, 0, 0, 0);
      }
      .van-tab__text {
        font-size: 30px;
        color: #999;
      }
      .van-tab--active {
        .van-tab__text {
          color: #333;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
