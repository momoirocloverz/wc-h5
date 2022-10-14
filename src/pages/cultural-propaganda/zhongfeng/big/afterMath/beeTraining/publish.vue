<template>
  <div class="publish">
    <div class="main">
      <acfield title="培训主题">
        <input
          type="text"
          maxlength="50"
          v-model.trim="state.title"
          placeholder="请输入"
        />
      </acfield>
      <acfield title="培训开始时间">
        <div @click="time(1)">{{ state.startTime }}</div>
      </acfield>
      <acfield title="培训结束时间">
        <div @click="time(2)">{{ state.endTime }}</div>
      </acfield>
      <acfield title="联系方式">
        <input
          type="text"
          maxlength="11"
          v-model.trim="state.contact"
          placeholder="请输入"
        />
      </acfield>
      <acfield title="培训内容" :lineFeed="true">
        <textarea
          maxlength="500"
          rows="4"
          v-model.trim="state.content"
          placeholder="请输入培训内容"
        />
      </acfield>
      <!-- <acfield title="培训地址">
        <div class="_field-arrow" @click="chooseVillage">
          {{ state.town }}
        </div>
      </acfield> -->
      <acfield title="培训详细地址">
        <input type="text" v-model.trim="state.address" placeholder="请输入" />
      </acfield>
      <acfield title="培训要求" :showLine="false" :lineFeed="true">
        <textarea
          maxlength="500"
          rows="4"
          v-model.trim="state.demand"
          placeholder="请输入培训要求"
        />
      </acfield>
    </div>
    <div class="btn common-btn" @click="submit">提交</div>
  </div>

  <village ref="villageRef" @confirm="villageConfirm"></village>
  <time-show ref="timeRef" @select="timeSelect" type="datetime"></time-show>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import Acfield from "@/components/acfield.vue";
import { Dialog, Toast } from "vant";
import Village from "@/components/village.vue";
import { useRouter, useRoute } from "vue-router";
import TimeShow from "@/components/timeShow.vue";
import Request from "@/service/request";

export default {
  components: { Acfield, Village, TimeShow },
  setup() {
    const Router = useRouter();
    const Route = useRoute();
    const id = ref(0);
    const villageRef = ref(null);
    const timeRef = ref(null);
    const state = reactive({
      title: "", // 培训主题
      startTime: "请选择开始时间",
      endTime: "请选择结束时间",
      contact: "",
      content: "",
      demand: "",
      address: "",
    });

    // 点击选择城镇
    const chooseVillage = () => {
      villageRef.value.show();
    };
    // 选择村结果
    const villageConfirm = (e) => {
      console.log(e);
      state.town = e.text;
      state.town_id = e.town_id;
      state.village_id = e.village_id;
    };

    // 点击选择时间
    const time = (e) => {
      timeRef.value.showPicker(e);
    };

    // 时间选择回调
    const timeSelect = (e) => {
      console.log(e);
      if (e.choose == 1) {
        // 如果选择的是开始时间
        state.startTime = e.time;
      } else {
        state.endTime = e.time;
      }
    };

    // 提交最终表单
    const submit = () => {
      if (state.title == "") {
        Toast("请输入培训主题");
        return;
      }
      if (
        state.startTime == "请选择开始时间" ||
        state.endTime == "请选择结束时间"
      ) {
        Toast("请选择开始时间或结束时间");
        return;
      }
      if (state.contact == "") {
        Toast("请输入联系方式");
        return;
      }
      if (state.content == "") {
        Toast("请输入培训内容");
        return;
      }
      if (state.town_id == "") {
        Toast("请选择培训地址");
        return;
      }

      if (state.demand == "") {
        Toast("请输入培训要求");
        return;
      }
      Dialog.confirm({
        message: "是否确认提交？",
        showCancelButton: true,
        confirmButtonColor: "#FF844E",
      })
        .then(() => {
          // Router.go(-1);
          add();
        })
        .catch(() => {
          // on cancel
        });
    };

    // 提交新增培训
    const add = () => {
      Toast.loading({ duration: 0, message: "提交中...", forbidClick: true });
      let data = {
        title: state.title,
        content: state.content,
        address: state.address,
        demand: state.demand,
        start_time: state.startTime,
        end_time: state.endTime,
        contact: state.contact,
      };

      if (id.value > 0) {
        // 如果是编辑操作
        Request.planBeeMajorMajorTrainEdit({
          id: id.value,
          ...data,
        })
          .then((e) => {
            if (e.code === 0) {
              Toast("提交成功！");
              setTimeout(() => {
                Router.go(-1);
              }, 250);
            } else {
              Toast.clear();
              Dialog.confirm({
                message: e.msg,
                showCancelButton: false,
                confirmButtonColor: "#FF844E",
              }).then(() => {
                // Router.go(-1);
              });
            }
          })
          .catch(() => {
            Toast.clear();
          });
      } else {
        Request.planBeeMajorMajorTrainAdd(data)
          .then((e) => {
            if (e.code === 0) {
              Toast("发布成功！");
              setTimeout(() => {
                Router.go(-1);
              }, 250);
            } else {
              Toast.clear();
              Dialog.confirm({
                message: e.msg,
                showCancelButton: false,
                confirmButtonColor: "#FF844E",
              }).then(() => {
                // Router.go(-1);
              });
            }
          })
          .catch(() => {
            Toast.clear();
          });
      }
    };

    // 获取当前培训的详情
    const init = (id) => {
      Request.planBeeMajorMajorTrainInfo({
        id,
      }).then((res) => {
        console.log(res);
        if (res.code == 0) {
          let data = res.data;
          state.title = data.title; // 培训主题
          state.startTime = data.start_time;
          state.endTime = data.end_time;
          state.contact = data.contact;
          state.content = data.content;
          state.demand = data.demand;
          state.address = data.address;
        } else {
          Dialog.confirm({
            message: "获取详情失败，请返回重试！",
            showCancelButton: false,
            confirmButtonColor: "#FF844E",
          }).then(() => {
            Router.go(-1);
          });
        }
      });
    };

    // 初始化数据
    onMounted(() => {
      if (Route.query.id) {
        id.value = Route.query.id;
        init(Route.query.id);
      }
    });
    return {
      state,
      submit,
      villageRef,
      chooseVillage,
      villageConfirm,
      time,
      timeRef,
      timeSelect,
    };
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../../assets/css/fit.less";
.publish {
  width: 100%;
  .main {
    width: 100%;
    padding: 0 30px;
    margin-top: 15px;
    box-sizing: border-box;
    background-color: #fff;
  }

  .btn {
    width: 80%;
    margin-top: 60px;
    margin-left: 10%;
  }
}
</style>
