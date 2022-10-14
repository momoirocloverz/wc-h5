<template>
  <div class="industryAllApplyRecord">
    <div class="tableLeftCon">
      <pull-refresh v-model="state.refreshing" @refresh="onRefresh">
        <list v-model:loading="state.loading" class="cusVanList" :immediate-check="false" :finished="state.finished" @load="onLoad">
          <div class="firstItem" v-for="(item, index) in state.tableList1" :key="index">
            <div class="itemTop" @click="toDetail(item)">
              <div class="itemFir">
                <div class="titleItem FirstTitleIt ellipsis" :class="[state.ZLBFitForOld ? 'FirstTitleItOld' : '']">{{ item.title }}</div>
                <div class="statusCon">
                  <div class="static1"></div>
                  <div :class="['statusMap', 'status' + item.status]">
                    {{ state.statusMap[item.status] }}
                  </div>
                </div>
              </div>
              <div class="itemSec">
                <div class="titleItem" :class="[state.ZLBFitForOld ? 'titleItemOld' : '']">认种农作物：</div>
                <div class="statusCon static1" :class="[state.ZLBFitForOld ? 'static1Old' : '']">{{ item.type }}</div>
              </div>
              <div class="itemThird">
                <div class="titleItem" :class="[state.ZLBFitForOld ? 'titleItemOld' : '']">认种面积：</div>
                <div class="statusCon static1" :class="[state.ZLBFitForOld ? 'static1Old' : '']">{{ item.area }}亩</div>
              </div>
              <div class="itemFourth">
                <div class="titleItem" :class="[state.ZLBFitForOld ? 'titleItemOld' : '']">预估收益：</div>
                <div class="statusCon static1" :class="[state.ZLBFitForOld ? 'static1Old' : '']">{{ item.pre_income }}元</div>
              </div>
              <div class="itemFifth">
                <div class="titleItem" :class="[state.ZLBFitForOld ? 'titleItemOld' : '']">预付款：</div>
                <div class="statusCon static1" :class="[state.ZLBFitForOld ? 'static1Old' : '']">{{ item.pre_pay || '-' }}元</div>
              </div>

              <div class="itemSixth">
                <div class="titleItem" :class="[state.ZLBFitForOld ? 'titleItemOld' : '']">创建时间：</div>
                <div class="statusCon static1" :class="[state.ZLBFitForOld ? 'static1Old' : '']">{{ item.created_at || '-' }}</div>
              </div>
            </div>
            <div class="itemBottom" v-if="item.status != 2">
              <div class="opearateBtn" v-if="item.status == 1" @click="popMoney(item)">查看打款凭证</div>
              <div class="opearateBtn ml16" @click="popAgreement(item)">查看协议</div>
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
import { Toast, Dialog, Field, List, PullRefresh, ImagePreview } from 'vant'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import IsEnd from '@/components/isEnd.vue'
import IsEmpty from '@/components/isEmpty.vue'
import { isZLB } from '@/util/index'
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
        0: '待打款',
        1: '已打款',
        2: '已取消'
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
      page: 1,
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
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
      Request.IndustrySeedUserApplyList({
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
      /*   Router.push({
        name: 'IndustryAllianceFarmerApplyRecorDetail',
        query: {
          id: item.id,
          justForShow: item.status == 1 || item.status == 3 || item.status == 0 ? '1' : ''
        }
      }) */
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
      /*     Router.push({
        name: 'IndustryAllianceFarmerApplyRecorDetail',
        query: {
          id: item.id
        }
      }) */
    }
    const cancelAction = (item) => {
      //
    }
    const popMoney = (item) => {
      ImagePreview({
        images: item.confirm_img_list,
        startPosition: 0,
        closeable: true
      })
    }
    const popAgreement = (item) => {
      ImagePreview({
        images: item.sign_img_list,
        startPosition: 0,
        closeable: true
      })
    }
    return {
      popMoney,
      popAgreement,
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
  padding-bottom: 24px;
}
.titleItem {
  width: 30%;
  color: #666;
  font-size: 28px;
}
.titleItemOld {
  font-size: 30px;
}
.itemFir {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.FirstTitleIt {
  font-size: 32px;
  color: #333;
  font-weight: 500;
  width: 100%;
}
.FirstTitleItOld {
  font-size: 40px;
}
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}
.statusCon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  width: 72%;
}
.static1 {
  color: #333;
  font-size: 28px;
}
.static1Old {
  font-size: 30px;
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
.status0 {
  color: #ff6a2a;
  background-color: rgba(255, 106, 42, 0.3);
}
.status1 {
  color: #1bb578;
  background-color: rgba(27, 181, 120, 0.3);
}
.status2 {
  color: #999;
  background-color: rgba(153, 153, 153, 0.3);
}
.itemSec {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.itemThird {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-content: center;
}
.itemFourth {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.itemSixth {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.itemFifth {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
    // width: 160px;
    height: 56px;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
    text-align: center;
    line-height: 56px;
    border-radius: 28px 28px 28px 28px;
    font-size: 28px;
    border: 2px solid #b9bcbf;
  }
}
.ml16 {
  margin-left: 16px;
}

.firstItemLeft {
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
  .statusText {
    font-size: 30px;
    color: #ff844e;
  }
  .more {
    width: 8px;
    vertical-align: top;
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
</style>
<style lang="less">
.van-image__img {
  background-color: #fff;
}
.industryAllApplyRecord {
  .dialogBeeTrainingCon {
    .van-dialog__content {
      padding: 30px;
      box-sizing: border-box;
    }
  }
}
</style>
