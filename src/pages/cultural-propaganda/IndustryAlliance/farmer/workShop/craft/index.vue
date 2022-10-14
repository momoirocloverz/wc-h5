<template>
  <div class="industryAllianceWorkCraftCon">
    <div class="tableLeftCon">
      <pull-refresh v-model="state.refreshing" @refresh="onRefresh">
        <list v-model:loading="state.loading" class="cusVanList" :immediate-check="false" :finished="state.finished" @load="onLoad">
          <div class="firstItem" v-for="(item, index) in state.tableList1" :key="index">
            <div class="itemTop" @click="toDetail(item)">
              <div class="itemFir">
                <div class="titleItem boldHere">{{ item.name }}</div>
                <div class="statusCon">
                  <div :class="['statusMap', 'status' + item.is_open]">
                    {{ state.statusMap[item.is_open] }}
                  </div>
                </div>
              </div>
              <div class="itemThird">
                <div class="titleItem addressText">{{ item.address }}</div>
              </div>
              <div class="itemSec">
                <img src="https://img.hzanchu.com/acimg/b54d13b3e4bbf7356977b5085c288bb9.png" />
                <div>截止日期 {{ item.start_date }}<span v-if="item.start_date && item.end_date">至</span>{{ item.end_date }}</div>
              </div>
            </div>
            <div class="itemBottom" v-if="item.is_open == 1">
              <div class="opearateBtn" @click="toEdit(item)">我要预约</div>
            </div>
          </div>
        </list>
        <IsEmpty class="emptyStyle" v-if="!state.tableList1.length"></IsEmpty>
        <IsEnd class="endStyle" v-if="state.tableList1.length"></IsEnd>
      </pull-refresh>
    </div>
  </div>
</template>
<script>
import { Toast, Dialog, Field, List, PullRefresh } from 'vant'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import IsEnd from '@/components/isEnd.vue'
import IsEmpty from '@/components/isEmpty.vue'
import { isZLB } from '@/util/index'
import dayjs from 'dayjs'
export default {
  components: {
    Field,
    [Dialog.Component.name]: Dialog.Component,
    List,
    PullRefresh,
    IsEnd,
    IsEmpty
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      statusMap: {
        0: '结束预约',
        1: '开放预约'
      },
      ZLBFLAG: isZLB(),
      showPicker: false,
      active: 0,
      show: false,
      deleteObj: {},
      tableList1: [],
      finished: false,
      loading: false,
      refreshing: false,
      page: 1
    })
    const forInit = (res) => {
      const resData = res.data.data
      let previous = state.tableList1
      if (resData.length == 0) {
        state.finished = true
        state.loading = false
        state.refreshing = false
        state.tableList1 = previous.concat(resData)
      } else if (resData.length < 10) {
        state.finished = true
        state.loading = false
        state.refreshing = false
        state.tableList1 = previous.concat(resData)
      } else if (resData.length >= 10) {
        state.finished = false
        state.refreshing = false
        state.loading = false
        state.page++
        state.tableList1 = previous.concat(resData)
      }
    }
    const initAction = () => {
      state.loading = true
      Request.IndustryPlantLists({
        page_size: 10,
        page: state.page
      })
        .then((res) => {
          if (res && res.code == 0) {
            forInit(res)
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    onMounted(() => {
      initAction()
    })
    const toDetail = (item) => {
      Router.push({
        name: 'IndustryAllianceFarmerWorkCraftDetail',
        query: {
          plant_id: item.id,
          showOperate: item.is_open == 1 ? '1' : ''
        }
      })
    }
    const onRefresh = () => {
      state.tableList1 = []
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
    const toEdit = (item) => {
      let trans = dayjs(item.end_date).format('YYYY/MM/DD')
      if (new Date(trans).getTime() > Date.now()) {
        Router.push({
          name: 'IndustryAllianceFarmerWorkCraftDetail',
          query: {
            plant_id: item.id,
            showOperate: item.is_open == 1 ? '1' : ''
          }
        })
      } else {
        Toast('超出截止时间，不可预约')
      }
    }
    const cancelAction = (item) => {
      Request.IndustryErpCancel({
        id: item.id
      })
        .then((res) => {
          if (res && res.code == 0) {
            Toast('取消成功')
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }

    return {
      toEdit,
      cancelAction,
      state,
      toDetail,
      onRefresh,
      onLoad
    }
  }
}
</script>

<style lang="less" scoped>
.industryAllianceWorkCraftCon {
  box-sizing: border-box;
}
.titleItem {
  color: #666;
  font-size: 24px;
}
.addressText {
}
.boldHere {
  font-size: 32px;
  font-weight: 500;
  color: #333;
}
.tableLeftCon {
  padding: 30px;
  box-sizing: border-box;
  padding-bottom: 100px;
}
.itemSec {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  height: 58px;
  background: #fafafa;
  border-radius: 12px 12px 12px 12px;
  padding-left: 26px;
  box-sizing: border-box;
  img {
    width: 30px;
    height: 30px;
    margin-right: 16px;
  }
  div {
    height: 30px;
    line-height: 30px;
    font-size: 24px;
    color: #666;
  }
}
.firstItem {
  padding: 32px 32px 0 32px;
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 24px;
}
.itemTop {
  padding-bottom: 24px;
}
.itemFir {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.statusCon {
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   align-content: center;
  //   width: 72%;
}
.static1 {
  color: #333;
  font-size: 28px;
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
.status1 {
  color: #1bb578;
  background-color: rgba(27, 181, 120, 0.3);
}
.status0 {
  color: #999;
  background-color: rgba(153, 153, 153, 0.3);
}
.itemThird {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-content: center;
}
.itemBottom {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
  padding-top: 24px;
  padding-bottom: 24px;
  box-sizing: border-box;
  border-top: 1px solid #e8e9ec;
  .opearateBtn {
    width: 160px;
    height: 56px;
    color: #fd844e;
    box-sizing: border-box;
    text-align: center;
    line-height: 56px;
    border-radius: 28px 28px 28px 28px;
    font-size: 28px;
    border: 2px solid #fd844e;
  }
}
</style>
<style lang="less">
.industryAllianceWorkCraftCon {
}
</style>
