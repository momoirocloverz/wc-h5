<template>
  <div class="publish">
    <div class="main">
      <acfield title="工作内容">
        <div @click="contentShow">
          {{ state.content }} <van-icon name="arrow" />
        </div>
      </acfield>
      <acfield title="工作开始日期">
        <div @click="timeShow(1)">{{ state.startDate }}</div>
      </acfield>
      <acfield title="工作结束日期">
        <div @click="timeShow(2)">{{ state.endDate }}</div>
      </acfield>
      <acfield title="工作开始时间">
        <div @click="timeShow(3)">{{ state.startTime }}</div>
      </acfield>
      <acfield title="工作结束时间">
        <div @click="timeShow(4)">{{ state.endTime }}</div>
      </acfield>
      <!-- <acfield title="工作地址">
        <div class="_field-arrow" @click="chooseVillage">
          {{ state.town }}
        </div>
      </acfield> -->
      <acfield title="工作地址">
        <input type="text" v-model.trim="state.address" placeholder="请输入" />
      </acfield>
      <acfield title="联系方式">
        <input
          type="text"
          maxlength="11"
          v-model.trim="state.contact"
          placeholder="请输入"
        />
      </acfield>
      <acfield title="薪资（元/天）">
        <input
          type="text"
          maxlength="6"
          v-model.trim="state.salary"
          placeholder="请输入"
        />
      </acfield>
      <acfield title="招聘人数（人）">
        <input
          type="text"
          maxlength="5"
          v-model.trim="state.work_num"
          placeholder="请输入"
        />
      </acfield>
      <acfield title="工作要求" :showLine="false" :lineFeed="true">
        <textarea
          maxlength="500"
          rows="4"
          v-model.trim="state.demand"
          placeholder="请输入工作要求"
        />
      </acfield>
    </div>
    <div class="btn common-btn" @click="submit">立即发布</div>
  </div>

  <village ref="villageRef" @confirm="villageConfirm"></village>
  <time-show ref="timeRef" @select="timeSelect" :type="timeType"></time-show>
  <single-picker
    ref="pickerRef"
    :list="getList"
    @select="pickerSelect"
  ></single-picker>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import Acfield from "@/components/acfield.vue";
import { Dialog, Toast } from "vant";
import Village from "@/components/village.vue";
import TimeShow from "@/components/timeShow.vue";
import SinglePicker from "@/components/singlePicker.vue";
import Request from "@/service/request";
import { useRouter, useRoute } from "vue-router";
export default {
  components: { Acfield, Village, TimeShow, SinglePicker },
  computed: {
    getList: function () {
      return this.contentList;
    },
  },
  setup() {
    const Router = useRouter();
    const Route = useRoute();
    const id = ref(0);
    const villageRef = ref(null);
    const timeRef = ref(null);
    const pickerRef = ref(null);
    const timeType = ref("date"); // 这里2中type，一种是date表示选择年月日、一种是time时间选择
    const state = reactive({
      startDate: "请选择工作开始日期",
      endDate: "请选择工作结束日期",
      startTime: "请选择工作开始时间",
      endTime: "请选择工作结束时间",
      contact: "",
      content: "请选择工作内容",
      type: 0,
      demand: "",
      salary: "", // 薪资
      work_num: "", // 招聘人数
      address: "", // 具体的工作地址
      town_id: "",
      village_id: "",
      town: "请选择工作地址",
    });

    // 当前工作内容列表
    const contentList = ref([
      { text: "割蜜", type: 1 },
      { text: "蜂场转场", type: 1 },
      { text: "整理蜂场", type: 1 },
    ]);

    // 点击回调控制展示
    const pickerSelect = (e) => {
      console.log(e);
      state.content = e.text;
      state.type = e.type;
    };

    // 点击展示
    const contentShow = () => {
      pickerRef.value.show();
    };

    // 点击选择城镇
    const chooseVillage = () => {
      villageRef.value.show();
    };
    // 选择村结果
    const villageConfirm = (e) => {
      console.log(e);
      // state.town = e.text;
      // state.town_id = e.town_id;
      // state.village_id = e.village_id;
    };

    // 点击展示当前时间组件
    const timeShow = (type) => {
      if (type == 1 || type == 2) {
        timeType.value = "date";
      } else {
        timeType.value = "time";
      }
      // console.log(timeType.value);
      setTimeout(() => {
        timeRef.value.showPicker(type);
      }, 250);
    };

    // 点击时间回调
    const timeSelect = (e) => {
      console.log(e);
      if (e.choose == 1) {
        state.startDate = e.time;
      } else if (e.choose == 2) {
        state.endDate = e.time;
      } else if (e.choose == 3) {
        state.startTime = e.time;
      } else if (e.choose == 4) {
        state.endTime = e.time;
      }
    };

    // 关闭当前时间选择弹窗
    const timeClose = () => {
      timeRef.value.cancel();
    };

    // 提交最终表单
    const submit = () => {
      if (state.type == 0) {
        Toast("请选择工作内容");
        return;
      }
      if (
        state.startDate == "请选择工作开始日期" ||
        state.endDate == "请选择工作结束日期"
      ) {
        Toast("请选择开始日期或结束日期");
        return;
      }
      if (
        state.startTime == "请选择工作开始时间" ||
        state.endTime == "请选择工作结束日期"
      ) {
        Toast("请选择开始时间或结束时间");
        return;
      }
      if (state.contact == "") {
        Toast("请输入联系方式");
        return;
      }
      // if (state.content == "") {
      //   Toast("请输入工作内容");
      //   return;
      // }
      if (state.salary == "") {
        Toast("请输入薪资");
        return;
      }
      if (state.work_num == "") {
        Toast("请输入招聘人数");
        return;
      }
      if (state.address == "") {
        Toast("请选择工作地址");
        return;
      }

      if (state.demand == "") {
        Toast("请输入工作要求");
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

    // 新增工作
    const add = () => {
      Toast.loading({ duration: 0, message: "提交中...", forbidClick: true });
      let data = {
        type: state.type,
        content: state.content,
        demand: state.demand,
        contact: state.contact,
        start_time: state.startDate,
        end_time: state.endDate,
        work_time: state.startTime + " - " + state.endTime,
        work_num: state.work_num,
        salary: state.salary,
        address: state.address,
      };

      if (id.value > 0) {
        console.log(id.value);
        // 如果是编辑操作
        Request.majorWorkEdit({
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
        Request.majorWorkAdd(data)
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
      Request.planBeeMajorMajorWorkInfo({
        id,
      }).then((res) => {
        console.log(res);
        if (res.code == 0) {
          let data = res.data;
          state.type = data.type;
          state.work_num = data.work_num;
          state.startDate = data.start_time;
          state.endDate = data.end_time;
          state.contact = data.contact;
          state.content = contentList.value[state.type].text;
          state.demand = data.demand;
          state.salary = data.salary;
          state.address = data.address;
          state.startTime = data.work_time.split("-")[0];
          state.endTime = data.work_time.split("-")[1];
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
    onMounted(() => {
      if (Route.query.id) {
        id.value = Route.query.id;
        init(Route.query.id);
      }
    });
    return {
      timeShow,
      timeClose,
      timeRef,
      timeSelect,
      timeType,

      id,

      contentList,
      pickerRef,
      pickerSelect,
      contentShow,

      state,
      submit,
      villageRef,
      chooseVillage,
      villageConfirm,
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
