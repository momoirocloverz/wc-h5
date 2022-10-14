<template>
  <div class="agricultureListCon">
    <tabs
      @click="onClick"
      sticky
      key="1"
      class="firstTab"
      :class="[state.ZLBFitForOld ? 'tabOld' : '']"
    >
      <tab title="供应">
        <div class="paddingTop">
          <div class="horizontal-container">
            <div class="scroll-wrapper" ref="scrollCon">
              <div class="scroll-content">
                <div class="flexCon" id="flexCon">
                  <div
                    class="scroll-item"
                    v-for="(item, index) in state.tabArr"
                    :class="[state.leftActive == item.id ? 'scrollActive' : '']"
                    :key="index"
                    @click="onSecondClick(item)"
                  >
                    <img
                      v-show="item.icon"
                      class="itemImg"
                      :src="
                        state.leftActive == index
                          ? item.negativeIcon
                          : item.icon
                      "
                    />
                    <span
                      class="itemName"
                      :class="[state.ZLBFitForOld ? 'itemNameOld' : '']"
                      >{{ item.name }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <pull-refresh
            key="12"
            v-model="state.refreshing"
            @refresh="onRefresh"
          >
            <list
              v-model:loading="state.loading"
              class="cusVanList"
              :immediate-check="false"
              :finished="state.finished"
              @load="onLoad"
            >
              <div
                class="cusCellItem"
                @click="checkDetail(item)"
                v-for="(item, index) in state.listData"
                :key="index"
              >
                <div class="itemCon">
                  <!-- <div class="listImgOuter"> -->
                  <div
                    class="imgCon"
                    :style="
                      item.image_path && item.image_path.length
                        ? 'background-image: url(' + item.image_path[0] + ')'
                        : 'background-image: url(https://img.hzanchu.com/acimg/a00df9ebc4b71833879c97d9f898f306.png)'
                    "
                  >
                    <img v-if="item.image_path" :src="item.image_path[0]" alt />
                  </div>
                  <!-- </div> -->
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
                        {{ item.crop_category_name }}
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
      <tab title="求购">
        <div class="paddingTop">
          <div class="horizontal-container">
            <div class="scroll-wrapper" ref="scroll2Con">
              <div class="scroll-content">
                <div class="flexCon" id="flexConTwo">
                  <div
                    class="scroll-item"
                    v-for="(item, index) in state.tabArr"
                    :class="[
                      state.rightActive == item.id ? 'scrollActive' : '',
                    ]"
                    :key="index"
                    @click="onThirdClick(item)"
                  >
                    <img
                      class="itemImg"
                      v-show="item.icon"
                      :src="
                        state.rightActive == index
                          ? item.negativeIcon
                          : item.icon
                      "
                    />
                    <span
                      class="itemName"
                      :class="[state.ZLBFitForOld ? 'itemNameOld' : '']"
                      >{{ item.name }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <pull-refresh key="3" v-model="state.refreshing" @refresh="onRefresh">
            <list
              v-model:loading="state.loading"
              class="cusVanList"
              :immediate-check="false"
              :finished="state.finished"
              @load="onLoad"
            >
              <div
                class="cusCellItem"
                @click="checkDetail(item)"
                v-for="(item, index) in state.listData"
                :key="index"
              >
                <div class="itemCon">
                  <div class="listImgOuter">
                    <div
                      class="imgCon"
                      :style="
                        item.image_path && item.image_path.length
                          ? 'background-image: url(' + item.image_path[0] + ')'
                          : 'background-image: url(https://img.hzanchu.com/acimg/a00df9ebc4b71833879c97d9f898f306.png)'
                      "
                    ></div>
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
                        {{ item.crop_category_name }}
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
    </tabs>
    <div class="publishCircle" @click="goToPublish">
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
import BScroll from 'better-scroll'
import Request from '@/service/request.js'
import IsEmpty from '@/components/isEmpty.vue'
import IsEnd from '@/components/isEnd.vue'
import { reactive, onBeforeMount, ref, onMounted, nextTick } from 'vue'
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
import { useRouter } from 'vue-router'
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
      leftActive: 0,
      id: '',
      listData: [],
      finished: false,
      loading: false,
      refreshing: false,
      firstTab: '1',
      crop_category: '',
      issue_category: 1,
      tabArr: [
        {
          name: '全部',
          id: '',
          icon: 'https://img.hzanchu.com/acimg/d3725df78e5cead7cc025d507fa16752.png',
          negativeIcon:
            'https://img.hzanchu.com/acimg/4427952e14580712b3d38d659e50b85c.png',
        },
      ],
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
    })
    const Router = useRouter()
    const scrollCon = ref(null)
    const scroll2Con = ref(null)
    const onRefresh = () => {
      state.listData = []
      state.page = 1
      state.finished = false
      state.loading = false
      //   state.refreshing = true
      onLoad()
      setTimeout(() => {
        state.refreshing = false
      }, 500)
    }
    onBeforeMount(() => {
      onLoad()
    })
    onMounted(() => {
      getTypeList()
    })
    const getTypeList = () => {
      Request.issueType({}).then((res) => {
        if (res.code === 0) {
          if (res.data.data.length) {
            state.tabArr.push(...res.data.data)
            nextTick(() => {
              document.getElementById('flexCon').style.width =
                ((state.tabArr.length * 215) / 76).toFixed(5) + 'rem'
              let scroll = new BScroll(scrollCon.value, {
                scrollX: true,
                probeType: 3,
                click: true,
                eventPassthrough: 'vertical',
              })
            })
          }
        }
      })
    }
    const inside = () => {
      state.showLoading = true
      state.loading = true

      Request.issueList({
        page_size: 10,
        page: state.page,
        issue_type: 1,
        issue_category: state.issue_category,
        crop_category: state.crop_category,
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
            } else if (resData.length < 10) {
              state.finished = true
              state.loading = false
              state.refreshing = false
              state.listData = previous.concat(resData)
            } else if (resData.length >= 10) {
              state.finished = false
              state.refreshing = false
              state.loading = false
              state.page++
              state.listData = previous.concat(resData)
            }
          } else {
            state.finished = true
          }
        })
        .catch((err) => {
          state.finished = true
        })
        .finally(() => {
          state.showLoading = false
        })
    }
    const onLoad = () => {
      //   state.finished = true;
      //   state.loading = false
      //   state.refreshing = false
      inside()
    }
    const onClick = (name, title) => {
      state.firstTab = title
      state.page = 1
      if (name) {
        nextTick(() => {
          document.getElementById('flexConTwo').style.width =
            ((state.tabArr.length * 215) / 76).toFixed(5) + 'rem'
          console.log(document.getElementById('flexConTwo'), 'flexConTwo')
          let scroll2 = new BScroll(scroll2Con.value, {
            scrollX: true,
            probeType: 3,
            click: true,
            eventPassthrough: 'vertical',
          })
        })
        if (state.rightActive) {
          state.crop_category = state.rightActive
        } else {
          state.crop_category = ''
        }
      } else {
        if (state.leftActive) {
          state.crop_category = state.leftActive
        } else {
          state.crop_category = ''
        }
      }
      state.issue_category = name + 1
      onRefresh()
    }
    const onSecondClick = (item) => {
      state.leftActive = item.id
      state.crop_category = item.id
      state.page = 1
      onRefresh()
    }
    const onThirdClick = (item) => {
      state.rightActive = item.id
      state.crop_category = item.id
      state.page = 1
      onRefresh()
    }
    const goToPublish = () => {
      Router.push({
        name: 'agriculturePublish',
      })
    }
    const checkDetail = (item) => {
      Router.push({
        name: 'agricultureDetail',
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
      onSecondClick,
      onThirdClick,
      goToPublish,
      checkDetail,
      scrollCon,
      scroll2Con,
    }
  },
}
</script>
<style lang="less" scoped>
.iconSet {
  // vertical-align: -4px;
}
.horizontal-container {
  width: 100%;
  box-sizing: border-box;
  padding-left: 10px;
  padding-right: 10px;
  .scroll-item {
    width: 200px;
    height: 68px;
    font-size: 24px;
    margin-bottom: 10px;
    margin-top: 10px;
    margin-left: 5px;
    margin-right: 10px;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0px 0px 11px 1px rgba(7, 8, 7, 0.08);
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    .itemName {
      margin-left: 15px;
      line-height: 30px;
      font-size: 30px;
      text-align: center;
      color: #666;
    }
    .itemNameOld {
      font-size: 50px !important;
    }
    .itemImg {
      width: 33px;
    }
  }
}
.scroll-wrapper {
  position: relative;
  width: 720px;
  background-color: #fff;
  margin: 0 auto;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  .scroll-content {
    display: inline-block;
  }
  .flexCon {
    flex-wrap: wrap;
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
  }
}
.scrollActive {
  background-color: #ff844e;
  .itemName {
    color: #fff !important;
  }
}
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
.agricultureListCon {
  position: relative;
  .emptyStyle {
    margin-top: 100px;
    margin-bottom: 140px;
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
    padding-top: 30px;
    background-color: #fff;
  }
  .itemCon {
    padding: 38px 30px;
    box-sizing: border-box;
    height: 260px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
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
        width: 100%;
        transform: translateY(-50%);
        position: absolute;
        left: 0;
        top: 50%;
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
      color: #333333;
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
      font-size: 32px;
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
      font-size: 32px;
      font-weight: 800;
    }
  }
}
</style>
<style lang="less">
.agricultureListCon {
  .firstTab {
    .van-tabs__wrap {
      height: 85px;
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
    .van-tabs__line {
      background-color: #ff844e;
    }
    .secondTab {
      .van-tab__text {
        width: 100%;
        text-align: center;
        border-radius: 8px;
        box-shadow: 0px 0px 11px 1px rgba(7, 8, 7, 0.08);
        box-sizing: border-box;
        padding: 10px;
        font-weight: 600;
      }
      .van-tabs__line {
        // background-color: #ff844e;
        background-color: rgba(0, 0, 0, 0);
      }
      .van-tab--active {
        .van-tab__text {
          background-color: #ff844e;
          color: #fff;
        }
      }
    }
  }
  .tabOld {
    .van-tab__text {
      font-size: 45px;
      font-weight: 700;
    }
  }
}
</style>
