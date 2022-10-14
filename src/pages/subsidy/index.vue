<template>
  <div :class="['subsidyCon', state.ZLBFitForOld ? 'withOld' : '']">
    <div class="subsidyUpper">
      <div class="topPart">
        <div class="topDescribe">当前总申领</div>
        <div class="topMoney">¥{{ state.globalTotal }}</div>
      </div>
      <div v-if="state.masterList.length">
        <div class="titleTableCon">
          <div>申领项目</div>
          <div>申领金额</div>
          <div>次数</div>
        </div>
        <!-- <pull-refresh v-model="state.refreshing" @refresh="onRefresh" class="pullRefreshCon">
          <list v-model:loading="state.loading" class="cusVanList" :immediate-check="false" :finished="state.finished" @load="onLoad"> -->
        <template v-for="(item, index) in state.masterList" :key="index">
          <div class="itemTableCon" @click="popDetail(item)">
            <div>{{ item.wf_name }}</div>
            <div>{{ item.totalReward }}</div>
            <div>{{ item.num }}<van-icon name="arrow" /></div>
          </div>
        </template>
        <!-- </list>
        </pull-refresh> -->
      </div>
      <ListEmpty title="暂无记录" v-if="!state.masterList.length" />
    </div>
    <div class="subsidyBottom">
      <div class="titleCon">
        <img src="https://img.hzanchu.com/acimg/6b35c83f92333dcdae0216e74c86563c.png" />
        <div class="title">申领政策</div>
      </div>
      <div class="policyItemOuter">
        <template v-for="(item, index) in state.policyArray" :key="index">
          <div class="policyItemCon" @click="toPolicyDetail(item)">
            <div class="policyItemTitle">
              {{ item.title }}
            </div>
            <div class="policyItemTime">
              {{ item.release_at }}
            </div>
            <div class="fakeBorder" v-if="state.policyArray.length - index > 1"></div>
          </div>
        </template>
      </div>
    </div>
    <van-overlay :show="state.show" :lock-scroll="false" z-index="100">
      <div class="wrapper">
        <div class="block">
          <div class="blockTitle">
            <div>申领详情</div>
            <van-icon name="cross" size="20" @click.native="state.show = false" />
          </div>
          <div class="blockList">
            <table class="dialogTable">
              <thead>
                <tr>
                  <th>序号</th>
                  <th colspan="2">拨付时间</th>
                  <th colspan="2">拨付金额</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in state.dialogList" :key="index">
                  <tr>
                    <td>{{ index + 1 }}</td>
                    <td colspan="2">{{ dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss') }}</td>
                    <td colspan="2">{{ item.reward }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
import { List, PullRefresh, Dialog, Toast } from 'vant'
import dayjs from 'dayjs'
import { onMounted, ref, reactive } from 'vue'
import ListEmpty from './listEmpty.vue'
import { useRouter } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  components: {
    ListEmpty,
    PullRefresh,
    List
  },
  setup() {
    const Router = useRouter()
    const active = ref(0)
    const state = reactive({
      show: false,
      finished: false,
      loading: false,
      refreshing: false,
      page: 1,
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      policyArray: [],
      masterList: [],
      globalTotal: 0,
      dialogList: []
    })
    onMounted(() => {
      fetchNormal()
      onLoad()
    })
    const getList = () => {
      Request.applyMe({}).then((res) => {
        if (res && res.code === 0) {
          state.masterList = res.data
          setTimeout(() => {
            let pureArray = state.masterList.map((ele) => {
              return ele.totalReward
            })
            let res = pureArray.reduce((acc, current) => {
              return acc + current
            }, 0)
            state.globalTotal = res
          }, 300)
        }
      })
    }
    const popDetail = (item) => {
      state.show = true
      state.dialogList = item.sub_list
    }
    const toPolicyDetail = (item) => {
      Router.push({
        name: 'subsidyPolicyDetail',
        query: {
          id: item.id
        }
      })
    }
    const onRefresh = () => {
      state.masterList = []
      state.page = 1
      state.finished = false
      state.loading = false
      onLoad()
      //   state.refreshing = true
      setTimeout(() => {
        state.refreshing = false
      }, 500)
    }
    const onLoad = () => {
      getList()
    }
    const fetchNormal = () => {
      Request.applyPolicyList({}).then((res) => {
        if (res && res.code === 0) {
          state.policyArray = res.data
        }
      })
    }
    return {
      active,
      state,
      popDetail,
      toPolicyDetail,
      onRefresh,
      onLoad,
      fetchNormal,
      dayjs
    }
  }
}
</script>
<style lang="less" scoped>
.subsidyCon {
  .titleTableCon {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    vertical-align: center;
    font-size: 32px;
    &:last-child {
      border: none;
    }
    div {
      width: 33%;
      font-size: 32px;
      color: #333;
      font-weight: 500;
      padding-top: 32px;
      padding-bottom: 32px;
      box-sizing: border-box;
      text-align: center;
    }
  }
  .itemTableCon {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    vertical-align: center;
    div {
      width: 33%;
      text-align: center;
      color: #666;
      font-size: 28px;
      padding-top: 24px;
      padding-bottom: 24px;
      box-sizing: border-box;
    }
  }
  .pullRefreshCon {
    width: 100%;
    position: relative;
  }
  .cusVanList {
    width: 100%;
  }
  .subsidyUpper {
    background-color: #fff;
    padding-left: 32px;
    padding-right: 32px;
    padding-top: 60px;
    // padding-bottom: 30px;
    box-sizing: border-box;
    .topPart {
      text-align: center;
      padding-bottom: 40px;
      box-sizing: border-box;
      border-bottom: 2px solid #ebebeb;
      .topDescribe {
        font-size: 28px;
        color: #999;
      }
      .topMoney {
        margin-top: 20px;
        font-size: 48px;
        color: #333;
      }
    }
  }
  .subsidyBottom {
    margin-top: 30px;
    background-color: #fff;
  }
  .titleCon {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    vertical-align: center;
    padding: 25px 30px;
    box-sizing: border-box;
    border-bottom: 2px solid #ebebeb;
    img {
      width: 4px;
      height: 28px;
      margin-right: 8px;
    }
    .title {
      font-size: 32px;
      height: 34px;
      line-height: 34px;
      font-weight: 600;
      color: #333;
    }
  }
  .policyItemOuter {
    padding-top: 24px;
    box-sizing: border-box;
  }
  .policyItemCon {
    padding: 24px 32px;
    padding-top: 0;
    box-sizing: border-box;
  }
  .fakeBorder {
    border-bottom: 2px solid #ebebeb;
  }
  .policyItemTitle {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 28px;
    line-height: 39px;
    color: #333;
  }
  .policyItemTime {
    font-size: 28px;
    color: #666;
    text-align: right;
    margin-top: 10px;
    margin-bottom: 24px;
  }
  .dialogTable {
    width: 100%;
    tr {
      width: 100%;
      border-bottom: 2px solid #ebebeb;
      box-sizing: border-box;
      &:last-child {
        border: none;
      }
    }
    th {
      width: 20%;
      font-size: 32px;
      color: #333;
      font-weight: 500;
      padding-top: 32px;
      padding-bottom: 32px;
      box-sizing: border-box;
      text-align: center;
      &:first-child {
        width: 10%;
      }
    }
    td {
      width: 20%;
      text-align: center;
      color: #666;
      font-size: 28px;
      padding-top: 24px;
      padding-bottom: 24px;
      box-sizing: border-box;
      &:first-child {
        width: 10%;
      }
    }
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .block {
    width: 90%;
    height: 700px;
    border-radius: 10px;
    background-color: #fff;
    .blockTitle {
      display: flex;
      justify-content: space-between;
      align-content: center;
      align-items: center;
      border-bottom: 2px solid #ebebeb;
      padding: 32px;
      box-sizing: border-box;
      div {
        font-size: 36px;
        color: #333;
      }
    }
    .blockList {
      padding-left: 32px;
      padding-right: 32px;
      padding-bottom: 40px;
      box-sizing: border-box;
      height: 600px;
      overflow-y: scroll;
    }
  }
}
.withOld {
  .topDescribe {
    font-size: 35px !important;
  }
  .topMoney {
    font-size: 55px !important;
  }
  .titleCon {
    .title {
      font-size: 50px !important;
      font-weight: 600 !important;
    }
  }
  .policyItemTitle {
    font-size: 35px !important;
    height: 75px !important;
    line-height: 42px !important;
  }
  .policyItemTime {
    font-size: 30px !important;
  }
  .titleTableCon {
    div {
      font-size: 36px !important;
    }
  }
  .itemTableCon {
    div {
      font-size: 33px !important;
    }
  }
}
</style>
