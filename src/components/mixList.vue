<template>
  <div class="mixListCon">
    <div class="paddingTop">
      <pull-refresh v-model="state.refreshing" @refresh="onRefresh">
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
                <div class="imgCon">
                  <img v-if="item.image_path" :src="item.image_path[0]" alt />
                </div>
              </div>
              <div class="rightSide">
                <div class="title" :class="[state.oldFlag ? 'titleOld' : '']">
                  {{ item.issue_title }}
                </div>
                <div class="price" :class="[state.oldFlag ? 'priceOld' : '']">
                  {{ item.price }}元/{{ item.unit }}
                </div>
                <div class="lastLine">
                  <div
                    class="itemType"
                    :class="[state.oldFlag ? 'itemTypeOld' : '']"
                  >
                    {{ item.category_data }}
                  </div>
                  <div class="time" :class="[state.oldFlag ? 'timeOld' : '']">
                    {{ item.created_at.slice(0, 10) }}
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
  </div>
</template>
<script>
import Request from '@/service/request.js'
import IsEmpty from '@/components/isEmpty.vue'
import IsEnd from '@/components/isEnd.vue'
import { reactive, onMounted } from 'vue'
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
  props: {
    ZLBFitForOld: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const state = reactive({
      page: 1,
      total: 0,
      showLoading: false,
      id: '',
      listData: [],
      finished: false,
      loading: false,
      refreshing: false,
      issue_category: 1,
      ZLBFLAG: isZLB(),
      oldFlag: props.ZLBFitForOld,
    })
    const Router = useRouter()
    const onRefresh = () => {
      state.listData = []
      state.page = 1
      state.finished = false
      state.loading = false
      //   state.refreshing = true
      onLoad()
      setTimeout(() => {
        state.refreshing = false
      }, 2000)
    }
    onMounted(() => {
      let flag = sessionStorage.getItem('mixListReload')
        ? sessionStorage.getItem('mixListReload')
        : ''
      if (flag) {
        //
      } else {
        onLoad()
      }
    })
    const inside = () => {
      state.showLoading = true
      state.loading = true
      Request.issueList({
        page_size: 10,
        page: state.page,
        issue_type: '',
        issue_category: '',
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
            Toast(res.msg)
            state.finished = true
          }
        })
        .catch((err) => {
          state.finished = true
        })
        .finally(() => {
          setTimeout(() => {
            sessionStorage.removeItem('mixListReload')
          }, 2000)
        })
    }
    const onLoad = () => {
      //   state.finished = true;
      //   state.loading = false
      //   state.refreshing = false
      sessionStorage.setItem('mixListReload', '1')
      inside()
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
      checkDetail,
    }
  },
}
</script>
<style lang="less" scoped>
.mixListCon {
  border-radius: 16px;
  overflow: hidden;
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
  .cusVanList {
  }
  .cusCellItem {
  }
  .paddingTop {
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
    .listImgOuter {
      width: 270px;
      height: 188px;
      margin-right: 30px;
    }
    .listImg {
      //   width: 270px;
      //   height: 188px;
      //   border-radius: 20px;
    }
    .imgCon {
      width: 270px;
      height: 188px;
      border-radius: 10px;
      background: url('https://img.hzanchu.com/acimg/a00df9ebc4b71833879c97d9f898f306.png')
        no-repeat;
      position: relative;
      background-size: 100%;
      overflow: hidden;
      img {
        position: absolute;
        left: 0;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .rightSide {
      width: 480px;
    }
    @thirtyTwo: 32px;
    .title {
      height: 90px;
      font-size: @thirtyTwo;
      font-weight: 600;
      text-align: left;
      color: #333;
      line-height: 42px;
    }

    .titleOld {
      font-size: 50px;
      line-height: 52px;
      font-weight: 800;
      width: 90%;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      overflow: hidden;
    }

    @twentyEight: 28px;
    .price {
      font-size: @twentyEight;
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
    @twentySix: 26px;
    .itemType {
      font-size: @twentySix;
      text-align: left;
      color: #999;
      line-height: 42px;
    }
    .itemTypeOld {
      font-size: 45px;
      font-weight: 800;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      overflow: hidden;
      width: 35%;
      // background-color: aquamarine;
    }

    .time {
      font-size: @twentySix;
      font-weight: 500;
      text-align: left;
      color: #999;
    }
    .timeOld {
      font-size: 40px;
      font-weight: 800;
      width: 65%;
    }
  }
}
</style>
<style lang="less">
.mixListCon {
}
</style>
