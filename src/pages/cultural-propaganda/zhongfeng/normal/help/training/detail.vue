<template>
  <div class="detail">
    <div class="main">
      <title-bar
        :showLine="false"
        title="培训主题"
        customStyle="padding: 0px;margin: 0px;"
      ></title-bar>
      <div class="title fs-36">报名中</div>
      <div class="sub-title fs-28">培训主题</div>
      <div class="value fs-28">{{ state?.title }}</div>
      <div class="sub-title fs-28">培训开始时间</div>
      <div class="value fs-28">{{ state?.start_time }}</div>
      <div class="sub-title fs-28">培训结束时间</div>
      <div class="value fs-28">{{ state?.end_time }}</div>
      <div class="sub-title fs-28">培训内容</div>
      <div class="value fs-28">
        {{ state?.content }}
      </div>
      <div class="sub-title fs-28">培训地址</div>
      <div class="value fs-28">
        {{ state?.address }}
      </div>
      <div class="sub-title fs-28">培训要求</div>
      <div class="value fs-28">
        {{ state?.demand }}
      </div>

      <div class="btn common-btn" @click="join">
        {{ state?.isApply == 1 ? "取消报名" : "立即报名" }}
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
  setup() {
    const Router = useRouter();
    const Route = useRoute();
    const id = ref(0);
    const state = ref({});
    // 点击立即报名
    const join = () => {
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
            Request.planBeefarmerTrainCancel({
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
            Request.farmerTrainEnter({
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
      Request.fetchFarmerTrainInfo({
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
    return { join, state };
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

    .title {
      margin-top: 24px;
      font-weight: bold;
    }

    .sub-title {
      margin-top: 30px;
      color: #999999;
    }
    .value {
      margin-top: 16px;
      color: #333333;
    }

    .btn {
      margin-top: 60px;
    }
  }
}
</style>
