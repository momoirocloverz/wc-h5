<template>
  <div class="_item fs-30" @click="gotoDetail">
    <template v-if="type == 0">
      <div class="_title flex-row align-items-center justify-content-between">
        <div class="fs-32">{{ item.title }}</div>
        <div class="fs-28" :style="'color: ' + getColor">{{ getStatus }}</div>
      </div>
      <div class="_time fs-28">开始时间： {{ item.created_at }}</div>
      <div class="_time fs-28">结束时间： {{ item.created_at }}</div>
    </template>

    <template v-if="type == 1">
      <div v-if="item.status == 0" class="_submit fs-32">
        {{ item.name }} 申请
        <span>{{ item.created_at }}</span> 进行养殖培训，请按时参加
      </div>
      <div v-if="item.status == 2 || item.status == 3" class="_submit-refuse">
        {{ item.name }} 申请 {{ item.created_at }} 进行养殖培训，{{
          item.status == 2 ? "请按时参加" : "已拒绝"
        }}
      </div>

      <div class="_time fs-28">姓名：{{ item.name }}</div>
      <div class="_time fs-28">联系方式：{{ item.mobile }}</div>

      <div v-if="item.status == 0 && item.type == 2" class="_btn flex-row">
        <div class="common-btn-plain" @click="refuse">拒绝</div>
        <div class="common-btn" @click="pass">同意</div>
      </div>
    </template>
  </div>

  <van-dialog
    v-model:show="refuseShow"
    title="拒绝理由"
    show-cancel-button
    confirm-button-color="#FF844E"
    cancel-button-color="#999999"
    @close="refuseClose"
    @confirm="refuseConfirm"
  >
    <div class="_dialog">
      <p>请输入拒绝原因</p>
      <textarea
        v-model.trim="reason"
        placeholder="请输入拒绝原因，例'距离太远'"
        rows="3"
      />
      <p>空闲时间</p>
      <div
        class="time-select flex-row align-items-center justify-content-between"
        @click="timeShow"
      >
        <div>{{ freeTime }}</div>
        <van-icon name="arrow" />
      </div>
    </div>
  </van-dialog>

  <time-show ref="timeRef" type="datetime" @select="timeSelect"></time-show>
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from "vue";
import Request from "@/service/request";
import { Toast, Dialog } from "vant";
import TimeShow from "@/components/timeShow.vue";
export default {
  components: {
    TimeShow,
  },
  props: {
    item: {
      type: Object,
    }, // 必传
    type: {
      type: Number,
      default: 0,
    }, // 当前item的类型，默认为0，表示是发布培训模块item、1表示培训通知item
  },
  computed: {
    getColor: function () {
      let className = "";
      if (this.item.farm_audit == 0) {
        className = "#3787F5";
      } else if (this.item.farm_audit == 1) {
        className = "#FF844E";
      } else if (this.item.farm_audit == 2) {
        className = "#FF0000";
      } else if (this.item.farm_audit == 3) {
        className = "#FF0000";
      }
      return className;
    },
    getStatus: function () {
      let status = "";
      status = this.item.status_name;
      return status;
      if (this.item.farm_audit == 0) {
        status = "报名中";
      } else if (this.item.farm_audit == 1) {
        status = "待审核";
      } else if (this.item.farm_audit == 2) {
        status = "已结束";
      } else if (this.item.farm_audit == 3) {
        status = "审核不通过";
      }
      return status;
    },
  },
  setup(props, { emit }) {
    const Router = useRouter();
    const refuseShow = ref(false);
    const timeRef = ref(null);
    const reason = ref("");
    const freeTime = ref("请选择空闲时间");

    // 跳转到详情页
    const gotoDetail = (e) => {
      // 如果是发布培训，那么这里点击可以跳转到培训详情页
      if (props.type == 0) {
        Router.push(
          "/cultural-propaganda/zhongfeng/bigBeeTrainingDetail?id=" +
            props.item.id
        );
      }
    };

    // 点击拒绝按钮
    const refuse = () => {
      refuseShow.value = true;
    };

    // 确认提交拒绝
    const refuseConfirm = () => {
      Dialog.alert({
        message: "是否确定提交拒绝原因？",
        showCancelButton: true,
        confirmButtonColor: "#FF844E",
      })
        .then(() => {
          Toast.loading({
            duration: 0,
            message: "提交中...",
            forbidClick: true,
          });
          Request.majorWorkTrainAudit({
            id: props.item.id,
            status: 3,
            comment: reason.value,
            edit_apply_at: freeTime.value,
          })
            .then((e) => {
              if (e.code == 0) {
                Toast("提交成功！");
                emit("reload");
                refuseClose();
              } else {
                Toast(e.msg);
              }
            })
            .catch(() => {
              Toast.clear();
            });
        })
        .catch(() => {
          // on cancel
        });
    };

    // 关闭当前拒绝弹窗
    const refuseClose = () => {
      refuseShow.value = false;
    };

    // 点击展示当前时间组件
    const timeShow = () => {
      timeRef.value.showPicker(1);
    };

    // 点击时间回调
    const timeSelect = (e) => {
      console.log(e);
      freeTime.value = e.time;
    };

    // 关闭当前时间选择弹窗
    const timeClose = () => {
      timeRef.value.cancel();
    };

    // 通过
    const pass = () => {
      Dialog.alert({
        message: "是否通过当前申请？",
        showCancelButton: true,
        confirmButtonColor: "#FF844E",
      })
        .then(() => {
          Toast.loading({
            duration: 0,
            message: "提交中...",
            forbidClick: true,
          });
          Request.majorWorkTrainAudit({
            id: props.item.id,
            status: 2,
          })
            .then((e) => {
              if (e.code == 0) {
                Toast("提交成功！");
                emit("reload");
                refuseClose();
              } else {
                Toast(e.msg);
              }
            })
            .catch(() => {
              Toast.clear();
            });
        })
        .catch(() => {
          // on cancel
        });
    };
    return {
      timeShow,
      timeClose,
      timeRef,
      timeSelect,
      freeTime,

      refuseShow,
      refuseClose,
      refuseConfirm,

      refuse,
      pass,
      reason,
      gotoDetail,
    };
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../../assets/css/fit.less";
._item {
  width: 100%;
  padding: 30px;
  margin-top: 30px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 31, 116, 0);
  background-color: #ffffff;
  border-radius: 10px;

  ._title {
    width: 100%;
    margin-bottom: 15px;
    div:nth-of-type(1) {
      flex: 1;
      margin-right: 30px;
      font-weight: bold;
    }
    div:nth-of-type(2) {
      width: 120px;
      text-align: right;
    }
  }

  ._submit {
    color: #333;
    span {
      color: var(--custom_color);
    }
  }
  ._submit-refuse {
    color: #666;
  }

  ._time {
    margin-top: 5px;
    color: #999;
  }

  ._btn {
    width: 100%;
    margin-top: 30px;
    div:nth-of-type(1) {
      flex: 1;
      padding: 10px 0px !important;
    }
    div:nth-of-type(2) {
      flex: 1;
      margin-left: 30px;
      padding: 10px 0px !important;
    }
  }
}

._dialog {
  padding-left: 25px;
  padding-right: 25px;
  box-sizing: border-box;
  textarea {
    width: 100%;
    height: 144px;
    box-sizing: border-box;
    padding: 20px;
    background-color: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
  }
  p {
    margin-top: 20px;
    margin-bottom: 30px;
    color: #999;
    font-size: 28px;
  }

  .time-select {
    width: 100%;
    margin-bottom: 30px;
    box-sizing: border-box;
    padding: 20px;
    background-color: #fff;
    border: 1px solid #e5e5e5;
    color: #b3b3b3;
  }
}
</style>
