<template>
  <div class="bigTrainingCon">
    <van-tabs v-model:active="state.active" @change="onClickTab" sticky>
      <van-tab title="发布培训">
        <div class="tableLeftCon" key="1">
          <pull-refresh v-model="state.refreshing" @refresh="onRefresh">
            <list
              v-model:loading="state.loading"
              class="cusVanList"
              :immediate-check="false"
              :finished="state.finished"
              @load="onLoad"
            >
              <div
                class="firstItem"
                v-for="(item, index) in state.tableList1"
                :key="index"
                @click="toDetail(item)"
              >
                <div class="firstItemLeft">
                  <div class="trainingName">{{ item.title }}</div>
                  <div class="trainingTime">
                    培训时间: {{ item.train_time }}
                  </div>
                  <div class="trainingTime">
                    培训时间: {{ item.train_time }}
                  </div>
                </div>
                <div class="firstItemRight">
                  <div class="statusText" v-if="item.farm_audit == 0">
                    待审核
                  </div>
                  <van-icon v-else class="arrow" name="arrow" />
                </div>
              </div>
            </list>
            <IsEmpty
              class="emptyStyle"
              v-if="!state.tableList1.length"
            ></IsEmpty>
            <IsEnd class="endStyle" v-if="state.tableList1.length"></IsEnd>
          </pull-refresh>
        </div>
      </van-tab>
      <van-tab title="培训通知">
        <div class="tableRightCon" key="2">
          <pull-refresh v-model="state.refreshing" @refresh="onRefresh">
            <list
              v-model:loading="state.loading"
              class="cusVanList"
              :immediate-check="false"
              :finished="state.finished"
              @load="onLoad"
            >
              <div
                class="secondItem"
                v-for="(item, index) in state.tableList2"
                :key="index"
              >
                <div class="rightCommon">
                  <div class="rightCommonText" v-if="item.type == 2">
                    <div v-if="item.status == 2">
                      农户
                      <span class="speicalColor">{{ item.name }}</span
                      >申请 <span class="speicalColor">{{ item.apply_at }}</span
                      >进行养殖培训成功，请按时参与培训。
                    </div>
                    <div v-else-if="item.status == 3">
                      农户
                      <span class="speicalColor">{{ item.name }}</span
                      >申请 <span class="speicalColor">{{ item.apply_at }}</span
                      >进行养殖培训失败。
                    </div>
                    <div v-else>
                      农户
                      <span class="speicalColor">{{ item.name }}</span
                      >申请 <span class="speicalColor">{{ item.apply_at }}</span
                      >进行养殖培训，如 拒绝申请，请填写原因及空闲时间。
                    </div>
                  </div>
                  <div class="rightCommonText" v-else>
                    农户
                    <span class="speicalColor">{{ item.name }}</span
                    >申请 <span class="speicalColor">{{ item.apply_at }}</span
                    >进行养殖培训成功，请按时参与培训。
                  </div>
                </div>
                <div
                  class="commitTime"
                  v-if="item.type == 2 && item.status == 0"
                >
                  提交时间：{{ item.created_at }}
                </div>
                <div
                  class="operateCon"
                  v-if="item.type == 2 && item.status == 0"
                >
                  <div class="button2" @click="refuseAction(item)">拒绝</div>
                  <div class="button1" @click="agreeAction(item)">同意</div>
                </div>
              </div>
            </list>
            <IsEmpty
              class="emptyStyle"
              v-if="!state.tableList2.length"
            ></IsEmpty>
            <IsEnd class="endStyle" v-if="state.tableList2.length"></IsEnd>
          </pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <div class="whiteFixBack" v-if="state.active == 0">
      <div class="button" @click="toNew">新增培训</div>
    </div>
    <van-dialog
      v-model:show="state.show"
      class="dialogBeeTrainingCon"
      title="请输入拒绝原因及空闲时间"
      :before-close="beforeAction"
      show-cancel-button
    >
      <field
        class="borderField"
        v-model.trim="state.message"
        rows="3"
        autosize
        label
        type="textarea"
        placeholder="请输入拒绝原因"
      />
      <div class="item">
        <span>空闲时间</span>
        <div class="timerText" @click="popCalendar">
          {{ state.calendarText }}
        </div>
        <img
          class="calendarImg"
          src="https://img.hzanchu.com/acimg/df2e857712c9a6f7321cb9aa7252588a.png"
        />
      </div>
    </van-dialog>
    <van-popup v-model:show="state.dateShow" round position="bottom">
      <van-datetime-picker
        v-model="state.date"
        type="datetime"
        title="选择年月日"
        :min-date="state.minDate"
        :max-date="state.maxDate"
        @confirm="confirmDate"
        @cancel="cancelDate"
      />
    </van-popup>
  </div>
</template>

<script>
import {
  Toast,
  Tab,
  Tabs,
  Dialog,
  Field,
  Popup,
  DatetimePicker,
  List,
  PullRefresh,
} from "vant";
import { reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import IsEnd from "@/components/isEnd.vue";
import IsEmpty from "@/components/isEmpty.vue";
import Request from "@/service/request";
import dayjs from "dayjs";
import { isZLB } from "@/util/index";
export default {
  components: {
    [Popup.name]: Popup,
    [DatetimePicker.name]: DatetimePicker,
    vanTab: Tab,
    vanTabs: Tabs,
    Field,
    [Dialog.Component.name]: Dialog.Component,
    List,
    PullRefresh,
    IsEnd,
    IsEmpty,
  },
  setup() {
    const Router = useRouter();
    const Route = useRoute();
    const state = reactive({
      ZLBFLAG: isZLB(),
      dateShow: false,
      date: "",
      calendarText: "请选择时间",
      show: false,
      minDate: new Date(),
      maxDate: new Date(2027, 10, 1),
      active: 0,
      tableList1: [],
      tableList2: [],
      actionBridge: {},
      finished: false,
      loading: false,
      refreshing: false,
      page: 1,
    });
    const forInit = (res) => {
      const resData = res.data.data;
      let previous = state.tableList1;
      if (resData.length == 0) {
        state.finished = true;
        state.loading = false;
        state.refreshing = false;
        state.tableList1 = previous.concat(resData);
      } else if (resData.length < 10) {
        state.finished = true;
        state.loading = false;
        state.refreshing = false;
        state.tableList1 = previous.concat(resData);
      } else if (resData.length >= 10) {
        state.finished = false;
        state.refreshing = false;
        state.loading = false;
        state.page++;
        state.tableList1 = previous.concat(resData);
      }
    };
    const initAction = () => {
      state.loading = true;
      Request.majorWorkTrainList({
        page_size: 10,
        page: state.page,
        type: 4,
      })
        .then((res) => {
          if (res && res.code == 0) {
            forInit(res);
          } else {
            Toast(res.msg);
            state.finished = true;
            state.tableList1 = state.tableList1.concat([
              {
                title: "title",
                train_time: "2020-20-20 00:00:00",
                farm_audit: 0,
              },
            ]);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    };
    onMounted(() => {
      initAction();
    });
    const toDeclaDetail = () => {
      Router.push({
        name: "culturalProBigDeclaDetails",
      });
    };
    const forFetch2Table = (res) => {
      const resData = res.data.data;
      let previous = state.tableList2;
      if (resData.length == 0) {
        state.finished = true;
        state.loading = false;
        state.refreshing = false;
        state.tableList2 = previous.concat(resData);
      } else if (resData.length < 10) {
        state.finished = true;
        state.loading = false;
        state.refreshing = false;
        state.tableList2 = previous.concat(resData);
      } else if (resData.length >= 10) {
        state.finished = false;
        state.refreshing = false;
        state.loading = false;
        state.page++;
        state.tableList2 = previous.concat(resData);
      }
    };
    const fetch2Table = () => {
      state.loading = true;
      Request.majorWorkTrainApplyList({
        page_size: 10,
        page: state.page,
      })
        .then((res) => {
          if (res && res.code == 0) {
            forFetch2Table(res);
          } else {
            Toast(res.msg);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    };
    const onClickTab = (title) => {
      state.page = 1;
      if (title) {
        state.tableList2 = [];
        fetch2Table();
      } else {
        state.tableList1 = [];
        initAction();
      }
    };
    const toNew = () => {
      Router.push({
        name: "culturalProBigNewTraining",
      });
    };
    const refuseAction = (item) => {
      state.actionBridge = item;
      state.message = "";
      state.calendarText = "请选择时间";
      state.date = "";
      state.show = true;
    };
    const popCalendar = () => {
      state.dateShow = true;
    };
    const agreeAction = (item) => {
      state.actionBridge = item;
      let data = {
        comment: "",
        id: state.actionBridge.id,
        status: 2,
        edit_apply_at: dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      };
      Request.majorWorkTrainAudit(data)
        .then((res) => {
          if (res && res.code == 0) {
            Toast("操作成功");
            state.page = 1;
            state.tableList2 = [];
            fetch2Table();
          } else {
            Toast(res.msg);
            return false;
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    };
    const beforeAction = (item) => {
      if (item == "confirm") {
        if (!state.message) {
          Toast.fail("请输入拒绝原因");
          return false;
        }
        if (!state.date) {
          Toast.fail("请选择空闲时间");
          return false;
        }

        let data = {
          comment: state.message,
          id: state.actionBridge.id,
          status: 3,
          edit_apply_at: state.date,
        };
        Request.majorWorkTrainAudit(data)
          .then((res) => {
            if (res && res.code == 0) {
              Toast("操作成功");
              state.show = false;
              state.page = 1;
              state.tableList2 = [];
              fetch2Table();
            } else {
              Toast(res.msg);
              return false;
            }
          })
          .catch((err) => {
            console.log("err", err);
          });
      } else {
        state.show = false;
      }
    };
    const toDetail = (item) => {
      if (item.farm_audit) {
        Router.push({
          name: "culturalProBigTrainingDetail",
          query: {
            id: item.id,
          },
        });
      }
    };
    const confirmDate = (val) => {
      state.date = dayjs(val).format("YYYY-MM-DD HH:mm:ss");
      state.dateShow = false;
      state.calendarText = state.date;
    };
    const cancelDate = () => {
      state.dateShow = false;
    };
    const onRefresh = () => {
      state.tableList1 = [];
      state.tableList2 = [];
      state.page = 1;
      state.finished = false;
      state.loading = false;
      state.refreshing = true;
      onLoad();
      setTimeout(() => {
        state.refreshing = false;
      }, 500);
    };
    const onLoad = () => {
      if (state.active) {
        fetch2Table();
      } else {
        initAction();
      }
    };
    return {
      beforeAction,
      state,
      popCalendar,
      toDeclaDetail,
      onClickTab,
      toNew,
      refuseAction,
      agreeAction,
      toDetail,
      confirmDate,
      cancelDate,
      onRefresh,
      onLoad,
    };
  },
};
</script>

<style lang="less" scoped>
.emptyStyle {
  margin-top: 100px;
  margin-bottom: 140px;
}
.endStyle {
  margin-top: 20px;
  margin-bottom: 20px;
}
.bigTrainingCon {
  box-sizing: border-box;
}
.tableRightCon {
  padding: 30px;
  box-sizing: border-box;
}
.item {
  margin-top: 40px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
}
.calendarImg {
  width: 34px;
  height: 34px;
  margin-left: 20px;
  vertical-align: middle;
}
.secondItem {
  padding: 40px;
  box-sizing: border-box;
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 30px;
  .rightCommon {
    .rightCommonText {
      font-size: 30px;
      color: #333;
      line-height: 48px;
    }
  }
  .commitTime {
    font-size: 28px;
    color: #999;
    margin-top: 30px;
  }
  .speicalColor {
    color: #ff844e;
  }
  .operateCon {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    margin-top: 40px;
  }
}
.tableLeftCon {
  padding: 30px;
  box-sizing: border-box;
  padding-bottom: 100px;
}
.firstItem {
  padding: 40px;
  box-sizing: border-box;
  width: 100%;
  height: 168px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  margin-bottom: 30px;
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
  .arrow {
    font-size: 30px;
    color: #333;
    vertical-align: middle;
  }
}
.button1 {
  width: 300px;
  height: 70px;
  background: linear-gradient(#ff844e 0%, #fe6d56 100%);
  border-radius: 35px;
  font-size: 32px;
  color: #fff;
  text-align: center;
  line-height: 70px;
  box-sizing: border-box;
}
.button2 {
  width: 300px;
  height: 66px;
  border: 2px solid #fe6d56;
  background: #fff;
  color: #fe6d56;
  border-radius: 33px;
  font-size: 32px;
  text-align: center;
  line-height: 70px;
}
.borderField {
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
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
.bigTrainingCon {
  .dialogBeeTrainingCon {
    .van-dialog__content {
      padding: 30px;
      box-sizing: border-box;
    }
  }
}
</style>
