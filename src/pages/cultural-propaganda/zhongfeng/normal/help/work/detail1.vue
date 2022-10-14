<template>
  <div class="detail">
    <div class="main fs-30">
      <div class="item">
        <div class="title">工作内容：</div>
        <div class="content">{{ state?.content }}</div>
      </div>
      <div class="item">
        <div class="title">工作日期：</div>
        <div class="content">
          {{ state?.start_time }} ～ {{ state?.end_time }}
        </div>
      </div>
      <div class="item">
        <div class="title">工作时长：</div>
        <div class="content">{{ state?.work_time }}</div>
      </div>
      <div class="item">
        <div class="title">薪资：</div>
        <div class="content">{{ state?.salary }}元/天</div>
      </div>
      <div class="item">
        <div class="title">联系方式：</div>
        <div class="content">{{ state?.contact }}</div>
      </div>
      <div class="item">
        <div class="title">工作地址：</div>
      </div>
      <div class="content">
        {{ state?.address }}
      </div>
      <div class="item">
        <div class="title">工作要求：</div>
      </div>
      <div class="content">
        {{ state?.demand }}
      </div>

      <div
        :class="
          state.applyNum >= state.work_num && state?.isApply != 1
            ? 'btn common-btn-disable'
            : 'btn common-btn'
        "
        @click="join"
      >
        {{ state?.isApply == 1 ? "取消报名" : "立即报名" }}
      </div>
      <div class="info">
        <div>
          已报名<span>{{ state.applyNum }}人</span>
        </div>
        <div>
          共招聘<span>{{ state.work_num }}人</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Toast, Dialog } from "vant";
import Request from "@/service/request";
export default {
  computed: {
    getContent: function () {
      //  1割蜜；2蜂场转场；3整理蜂场
      let content = "其他";
      if (this.state.type == 1) {
        content = "割蜜";
      } else if (this.state.type == 2) {
        content = "蜂场转场";
      } else if (this.state.type == 3) {
        content = "整理蜂场";
      }
      return content;
    },
  },
  setup() {
    const Router = useRouter();
    const Route = useRoute();
    const id = ref(0);
    const state = ref({});

    // 点击立即报名
    const join = () => {
      // 如果已经报名的人数超过了，那么则不能继续报名
      if (
        state.value.applyNum >= state.value.work_num &&
        state.value.isApply != 1
      ) {
        return;
      }
      Dialog.alert({
        message:
          state.value.isApply == 1 ? "是否立即取消报名？" : "是否立即报名？",
        showCancelButton: true,
        confirmButtonColor: "#FF844E",
      })
        .then(() => {
          Toast.loading({
            duration: 0,
            message: "提交中...",
            forbidClick: true,
          });
          if (state.value.isApply == 1) {
            Request.planBeeFarmerCancelWork({
              id: id.value,
            })
              .then((res) => {
                if (res.code == 0) {
                  Toast("取消报名成功！");
                  setTimeout(() => {
                    init(id.value);
                  }, 500);
                } else {
                  Toast(res.msg);
                }
              })
              .catch(() => {
                Toast.clear();
              });
          } else {
            Request.farmerWorkenter({
              id: id.value,
            })
              .then((res) => {
                if (res.code == 0) {
                  Toast("报名成功！");
                  setTimeout(() => {
                    init(id.value);
                  }, 500);
                } else {
                  Toast(res.msg);
                }
              })
              .catch(() => {
                Toast.clear();
              });
          }
        })
        .catch(() => {
          // on cancel
        });
    };

    // 获取当前培训的详情
    const init = (id) => {
      Toast.loading({
        duration: 0,
        message: "获取详情中...",
        forbidClick: true,
      });
      Request.fetchFarmerWorkinfo({
        id,
      })
        .then((res) => {
          console.log(res);
          if (res.code == 0) {
            state.value = res.data;
          }
        })
        .finally(() => {
          Toast.clear();
        });
    };

    onMounted(() => {
      if (Route.query.id) {
        id.value = Route.query.id;
        init(Route.query.id);
      } else {
        Dialog.alert({
          message: "获取详情失败，请返回重试！",
          confirmButtonColor: "#FF844E",
        })
          .then(() => {
            Router.go(-1);
          })
          .catch(() => {});
      }
    });
    return { state, join };
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../../assets/css/fit.less";
.detail {
  width: 100%;
  padding: 30px;
  box-sizing: border-box;

  .main {
    width: 100%;
    margin-bottom: 30px;
    padding: 24px 30px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;

    .item {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .title {
      width: 180px;
      margin-top: 10px;
      color: #666666;
    }
    .content {
      margin-top: 10px;
      color: #333;
    }
    .btn {
      margin-top: 60px;
    }

    .info {
      margin-top: 30px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      div:nth-of-type(1) {
        color: #333;
      }
      div:nth-of-type(2) {
        margin-left: 30px;
      }
      span {
        margin-left: 5px;
        color: var(--custom_color);
      }
    }
  }
}
</style>
