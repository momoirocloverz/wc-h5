<template>
  <div class="industryAllApplyRecord">
    <div class="hintBlock" v-if="props.type == 'crop'">发布认种需求请联系产业联盟：15121078956</div>
    <div class="tableLeftCon">
      <pull-refresh v-model="state.refreshing" @refresh="onRefresh">
        <list v-model:loading="state.loading" class="cusVanList" :immediate-check="false" :finished="state.finished" @load="onLoad">
          <div class="firstItem" v-for="(item, index) in state.tableList1" :key="index">
            <div class="itemTop">
              <div class="itemFir">
                <div
                  class="firstItemLeft"
                  :style="{
                    backgroundImage: 'url(' + item.img_list[0] + ')'
                  }"
                >
                  <div :class="['statusMap', 'status' + item.status]">{{ state.statusMap[item.status] }}</div>
                </div>
                <div class="firstItemRight">
                  <div class="betweenHere">
                    <div class="subFirLeft">{{ item.title }}</div>
                    <div class="subFirRight">{{ item.type }}</div>
                  </div>
                  <div class="progress-bar">
                    <div :class="['progress-bar_inner']" :style="{ width: item.finish_rate * 100 + '%' }"></div>
                    <div :class="['rateText', item.finish_rate > 0.6 ? 'whiteColor' : '']">完成率{{ rateFormat(item.finish_rate * 100) }}%</div>
                  </div>
                  <div class="priceCon">
                    <div>{{ item.price }}元/斤</div>
                  </div>
                  <div class="flexStartTemp1">
                    <div>认种总面积</div>
                    <div>{{ item.area }}亩</div>
                  </div>
                </div>
                <!-- <div class="trainingName">{{ item.content }}</div>
                  <div class="trainingTime">工作日期: {{ item.work_date }}</div> -->
              </div>
              <div class="itemSec">
                <img src="https://img.hzanchu.com/acimg/b54d13b3e4bbf7356977b5085c288bb9.png" />
                <div>截止日期 {{ item.limit_date }}</div>
              </div>
            </div>
            <div class="itemBottom">
              <div class="itemBotLeft">已有{{ item.join_num }}人参与</div>
              <div class="opearateBtn" @click="toDetail(item)" v-if="props.type != 'crop'">我要认种</div>
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
  props: {
    type: {
      default: 'farmer'
    }
  },
  setup(props) {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      showPicker: false,
      active: 0,
      show: false,
      deleteObj: {},
      tableList1: [],
      finished: false,
      loading: false,
      refreshing: false,
      page: 1,
      statusMap: {
        0: '进行中',
        1: '已下架',
        2: '已结束'
      }
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
      //  if (props.type == 'crop') {
      Request.IndustrySeedLists({
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
      let trans = dayjs(item.limit_date).format('YYYY/MM/DD HH:mm:ss')
      if (new Date(trans).getTime() > Date.now()) {
        Router.push({
          name: 'IndustryAllianceFarmerSubDetail',
          query: {
            id: item.id
          }
        })
      } else {
        Toast('超出截止时间，不可预约')
      }
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
    const rateFormat = (value) => {
      if (value || value == 0) {
        let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(0)
        return fix
      }
    }
    return {
      rateFormat,
      state,
      toDetail,
      onRefresh,
      onLoad,
      props
    }
  }
}
</script>

<style lang="less" scoped>
.flexStartTemp1 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  div {
    &:nth-child(1) {
      font-size: 24px;
      color: #666;
      margin-right: 6px;
    }
    &:nth-child(2) {
      font-size: 24px;
      font-weight: 500;
      color: #333333;
    }
  }
}
.progress-bar {
  margin-bottom: 26px;
  height: 24px;
  border-radius: 12px;
  background-color: rgba(245, 245, 245, 1);
  width: 100%;
  position: relative;
}
.priceCon {
  font-size: 32px;
  font-weight: 500;
  color: #e63633;
  margin-bottom: 10px;
}
.progress-bar_inner {
  position: absolute;
  z-index: 2;
  height: 24px;
  width: 50%;
  left: 0;
  top: 0;
  background-color: #fd844e;
  border-radius: 12px;
}
.rateText {
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  color: #999;
  z-index: 100;
}
.whiteColor {
  color: #fff;
}
.statusMap {
  height: 38px;
  margin-left: 12px;
  margin-top: 12px;
  width: 88px;
  text-align: center;
  font-size: 24px;
  line-height: 38px;
  border-radius: 4px 4px 4px 4px;
  opacity: 0.9;
  padding-left: 10px;
  padding-right: 10px;
}
.status0 {
  color: #1bb578;
  background-color: rgba(27, 181, 120, 0.3);
}
.status1 {
  color: #e63633;
  background-color: rgba(230, 54, 51, 0.3);
}
.status2 {
  color: #999;
  background-color: rgba(153, 153, 153, 0.3);
}
.hintBlock {
  height: 56px;
  background-color: rgba(253, 132, 78, 0.06);
  color: #fd844e;
  font-size: 28px;
  line-height: 56px;
  padding-left: 32px;
}
.industryAllApplyRecord {
  box-sizing: border-box;
}
.tableLeftCon {
  padding: 30px;
  box-sizing: border-box;
  padding-bottom: 100px;
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
  padding-bottom: 16px;
  box-sizing: border-box;
}
.itemFir {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-content: center;
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
  margin-top: 24px;
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
.itemThird {
}
.itemBottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  padding-top: 24px;
  padding-bottom: 24px;
  box-sizing: border-box;
  border-top: 1px solid #e8e9ec;
  .itemBotLeft {
    width: 148px;
    height: 34px;
    font-size: 24px;
    color: #999999;
    line-height: 40px;
  }
  .opearateBtn {
    width: 160px;
    height: 56px;
    text-align: center;
    line-height: 56px;
    color: #fd844e;
    border-radius: 28px;
    font-size: 28px;
    border: 2px solid #fd844e;
  }
}
.ml16 {
  margin-left: 16px;
}

.firstItemLeft {
  //   width: 252px;
  width: 40%;
  height: 190px;
  border-radius: 8px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  .trainingName {
    font-size: 32px;
    font-weight: 500;
    color: #333;
    margin-bottom: 30px;
  }
  .trainingTime {
    font-size: 30px;
    text-align: left;
    color: #666;
  }
}
.firstItemRight {
  width: 55%;

  .statusText {
    font-size: 30px;
    color: #ff844e;
  }
  .more {
    width: 8px;
    vertical-align: top;
  }
}
.betweenHere {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  margin-bottom: 15px;
  margin-top: 13px;
}
.subFirLeft {
  font-weight: 500;
  font-size: 32px;
  color: #333;
  width: 220px;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}
.subFirRight {
  height: 34px;
  background-color: rgba(253, 132, 78, 0.0588);
  border-radius: 4px 4px 4px 4px;
  padding: 4px 12px;
  box-sizing: border-box;
  border: 1px solid #fd844e;
  font-size: 24px;
  color: #fd844e;
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
</style>
<style lang="less">
.industryAllApplyRecord {
  .dialogBeeTrainingCon {
    .van-dialog__content {
      padding: 30px;
      box-sizing: border-box;
    }
  }
}
</style>
