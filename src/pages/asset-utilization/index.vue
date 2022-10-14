<template>
  <div class="asset_utilization">
    <!-- 搜索 -->
    <div class="search">
      <input
        type="text"
        v-model="inputVal"
        :class="[state.ZLBFitForOld ? 'searchInputOld' : '']"
      />
      <van-icon name="search" />
      <span
        @click="onSearch"
        :class="[state.ZLBFitForOld ? 'searchBtntOld' : '']"
        >搜索</span
      >
    </div>
    <!-- 列表切换 -->
    <van-tabs
      v-model="activeId"
      sticky
      animated
      @click="onClick"
      :class="[state.ZLBFitForOld ? 'tabsOld' : '']"
    >
      <van-tab v-for="(item, index) in navList" :key="index" :title="item.name">
        <div class="list">
          <div
            class="item"
            v-for="item in renderList"
            :key="item.name"
            @click="toDetail(item)"
          >
            <img
              :src="
                item.image_path[0] ||
                'https://img.hzanchu.com/acimg/a00df9ebc4b71833879c97d9f898f306.png'
              "
              alt
            />
            <div class="content">
              <p :class="[state.ZLBFitForOld ? 'titleOld' : '']">
                {{ item.title }}
              </p>
              <p
                v-if="state.ZLBFLAG"
                :class="[state.ZLBFitForOld ? 'itemTypeOld' : '']"
              >
                {{ item.address.replace(item.address.substr(2, 4), '****') }}
              </p>
              <p v-else>{{ item.address }}</p>
              <!-- <p :class="[state.ZLBFitForOld ? 'itemTypeOld' : '']">{{ item.address }}</p> -->
              <p>
                <span :class="[state.ZLBFitForOld ? 'priceOld' : '']"
                  >{{ item.price }}元/{{ item.unit }}</span
                >
                <span :class="[state.ZLBFitForOld ? 'priceOld' : '']"
                  >{{ item.area }}{{ item.unit }}</span
                >
              </p>
            </div>
          </div>
        </div>
        <is-end v-if="isLoad && renderList.length" />
        <is-empty class="emptyMargin" v-if="isLoad && !renderList.length" />
      </van-tab>
    </van-tabs>
    <div class="publishCircle" @click="addAsset">
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
    <!-- <ReleaseBtn v-if="!state.ZLBFLAG"></ReleaseBtn> -->
  </div>
</template>

<script>
import isEmpty from '@/components/isEmpty'
import isEnd from '@/components/isEnd'
import { Toast, Icon } from 'vant'
import { onMounted, ref, reactive } from 'vue'
import ReleaseBtn from '@/components/releaseBtn'
import Request from '@/service/request.js'
import { useRouter } from 'vue-router'
import { isZLB } from '@/util/index'
export default {
  components: {
    isEmpty,
    isEnd,
    Icon,
    ReleaseBtn,
  },
  setup() {
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
    })

    const Router = useRouter()
    const navList = ref([])
    const isLoad = ref(false)
    const renderList = ref([])

    // renderList.value = list
    const activeId = ref('')
    const inputVal = ref('')

    onMounted(() => {
      getType()
    })

    const getType = () => {
      Request.propertyType().then((res) => {
        if (res.code === 0) {
          navList.value = res.data
          activeId.value = res.data[0].id
          getList()
        }
      })
    }

    const getList = () => {
      Request.propertyList({
        type: activeId.value,
      }).then((res) => {
        if (res.code === 0) {
          isLoad.value = true
          renderList.value = res.data.data
        }
      })
    }
    const onClick = (index) => {
      activeId.value = navList.value[index].id
      renderList.value = []
      isLoad.value = false
      getList()
    }

    const onSearch = () => {
      let keyWards = inputVal.value
      renderList.value = renderList.value.filter((item) =>
        item.title.includes(keyWards)
      )
    }
    const addAsset = () => {
      Router.push({
        name: 'asset-utilizationPublish',
      })
    }

    const toDetail = (item) => {
      Router.push({ path: '/asset-utilization/detail', query: { id: item.id } })
    }

    return {
      navList,
      activeId,
      inputVal,
      renderList,
      onClick,
      onSearch,
      addAsset,
      isLoad,
      toDetail,
      state,
    }
  },
}
</script>

<style scoped lang="less">
.emptyMargin {
  margin-top: 200px;
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
  .iconCircle {
    font-size: 40px;
  }
  .publishTextOld {
    font-size: 40px;
  }
}
.asset_utilization {
  .search {
    position: relative;
    display: flex;
    align-items: center;
    background: #fff;
    padding: 20px 50px 32px;
    border-bottom: 2px solid @border_color;
    justify-content: space-between;
    .van-icon-search {
      position: absolute;
      font-size: 40px;
      left: 70px;
      color: @time_color;
    }
    span {
      font-size: 32px;
      font-weight: 600;
    }
    input {
      background: #f0f0f0;
      height: 58px;
      width: 555px;
      border-radius: 29px;
      font-size: 28px;
      text-indent: 70px;
    }
    .inputText {
      font-size: 35px;
    }
    .searchText {
      font-size: 40px;
    }
  }
  .searchInputOld {
    font-size: 45px !important;
  }
  .searchBtntOld {
    font-size: 45px !important;
    font-weight: 800 !important;
  }
  @twentyEight: 28px;
  @twentyFour: 24px;
  @thirty: 30px;
  @thirtyTwo: 32px;
  .list {
    background: #fff;
    padding: 0 30px;
    .item {
      display: flex;
      font-size: @twentyEight;
      padding: 24px 0;
      border-bottom: 2px solid @border_color;
      img {
        width: 270px;
        height: 188px;
        padding-right: 40px;
      }
      .content {
        width: 0;
        flex: 1;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        p {
          line-height: 40px;
          color: @time_color;
          &:nth-of-type(1) {
            font-size: @thirty;
            color: @title_color;
            height: 80px;
            font-weight: 600;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .firstP {
            font-size: calc(@thirty* @lowRatio);
          }
          &:nth-of-type(2) {
            flex: 1;
            padding-top: 15px;
          }
          .secondP {
            font-size: calc(@twentyEight* @lowRatio);
          }
          &:nth-of-type(3) {
            font-size: @twentyFour;
            display: flex;
            align-items: end;
            span:nth-of-type(1) {
              color: @price_color;
              font-size: @thirtyTwo;
            }
            .thirdPFirst {
              font-size: calc(@thirtyTwo* @lowRatio);
            }
            span:nth-of-type(2) {
              margin-left: auto;
            }
            .thirdPSecond {
              font-size: calc(@twentyFour* @lowRatio);
            }
          }
          .thirdP {
            font-size: calc(@twentyFour* @lowRatio);
          }
        }
        .titleOld {
          font-size: 50px !important;
          line-height: 52px;
          font-weight: 800 !important;
          white-space: nowrap;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
          overflow: hidden;
        }

        .priceOld {
          font-size: 35px !important;
          font-weight: 800;
        }
        .itemTypeOld {
          font-size: 45px;
          font-weight: 800;
          line-height: 40px;
        }
      }
    }
    .itemReset {
      font-size: calc(@twentyEight* @lowRatio);
    }
  }
  .add {
    width: 80px;
    height: 80px;
    position: fixed;
    right: 60px;
    bottom: 180px;
  }
}
.is-end {
  margin: 30px 0;
}
.tabReset {
  font-size: 35px;
}
</style>
<style lang="less">
.asset_utilization {
  .tabsOld {
    .van-tab__text {
      font-size: 40px !important;
      font-weight: 800;
    }
  }
}
</style>
