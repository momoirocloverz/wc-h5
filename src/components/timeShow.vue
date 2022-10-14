<template>
  <van-popup
    :show="show"
    :overlay="overlay"
    z-index="999"
    position="bottom"
    @click-overlay="cancel"
    style="z-index: 9999 !important"
  >
    <van-datetime-picker
      :v-model="type == 'time' ? currentTime : currentDate"
      :type="type"
      :title="title"
      :min-date="minDate"
      :max-date="maxDate"
      :formatter="formatter"
      @confirm="confirm"
      @cancel="cancel"
    />
  </van-popup>
</template>

<script>
// import { useRouter } from "vue-router";
import { onMounted } from "@vue/runtime-core";
import { ref } from "vue";

export default {
  props: {
    // type可选情况
    // 默认为date。date表示选择<年月日>、year-month表示选择<年月>，month-day表示选择<月日>，datetime表示选择<年月日-时分>，time表示选择时间<时分>
    type: {
      type: String,
      default: "date",
    },
    // 可传样式
    customStyle: {
      type: String,
      default: "",
    },
    overlay: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    // const Router = useRouter();
    const minDate = ref(new Date(2010, 1, 1)); // 最小日期
    const maxDate = ref(new Date(2030, 1, 1)); // 最大日期
    const currentDate = ref(new Date()); // 当前日期
    const currentTime = ref("00:00");
    const show = ref(false); // 是否展示底部选择日期picker
    const time1 = ref("开始时间"); // 当前已经选择的时间
    const time2 = ref("结束时间"); // 当前已经选择的时间
    const choose = ref(1); // 当前选中的是哪一个（有可能有1个，有可能有2个，看传值情况
    const showPicker = (e) => {
      choose.value = e;
      show.value = true;
    };
    // 选项格式化函数
    const formatter = (type, val) => {
      if (type === "month") {
        return `${val}月`;
      } else if (type === "day") {
        return `${val}日`;
      } else if (type === "year") {
        return `${val}年`;
      }
      return val;
    };
    // 点击确定，这里需要做判断优化，如果选择时间小
    const confirm = (e) => {
      console.log(e);
      if (props.type == "time") {
        const hours = e.split(":")[0];
        const minutes = e.split(":")[1];
        const time = hours + ":" + minutes;
        emit("select", {
          time,
          minutes,
          hours,
          choose: choose.value,
        });
      } else if (props.type == "datetime") {
        const year = e.getFullYear();
        const month =
          e.getMonth() + 1 < 10 ? "0" + (e.getMonth() + 1) : e.getMonth() + 1;
        const day = e.getDate() < 10 ? "0" + e.getDate() : e.getDate();
        const hours = e.getHours() < 10 ? "0" + e.getHours() : e.getHours();
        const minutes =
          e.getMinutes() < 10 ? "0" + e.getMinutes() : e.getMinutes();
        const time =
          year + "-" + month + "-" + day + " " + hours + ":" + minutes;
        emit("select", {
          year,
          month,
          day,
          time,
          minutes,
          hours,
          choose: choose.value,
        });
      } else if (props.type == "date") {
        const year = e.getFullYear();
        const month =
          e.getMonth() + 1 < 10 ? "0" + (e.getMonth() + 1) : e.getMonth() + 1;
        const day = e.getDate() < 10 ? "0" + e.getDate() : e.getDate();
        const time = year + "-" + month + "-" + day;
        emit("select", { year, month, day, time, choose: choose.value });
      } else if (props.type == "year-month") {
        const year = e.getFullYear();
        const month =
          e.getMonth() + 1 < 10 ? "0" + (e.getMonth() + 1) : e.getMonth() + 1;
        const time = year + "-" + month;
        emit("select", { year, month, time, choose: choose.value });
      } else if (props.type == "month-day") {
        const month =
          e.getMonth() + 1 < 10 ? "0" + (e.getMonth() + 1) : e.getMonth() + 1;
        const day = e.getDate() < 10 ? "0" + e.getDate() : e.getDate();
        const time = year + "-" + month + "-" + day;
        emit("select", { month, day, time, choose: choose.value });
      }

      cancel();
    };
    // 关闭当前取消
    const cancel = () => {
      show.value = false;
    };
    onMounted(() => {});
    return {
      minDate,
      maxDate,
      currentDate,
      currentTime,
      show,
      showPicker,
      formatter,
      time1,
      time2,
      confirm,
      cancel,
    };
  },
};
</script>

<style scoped lang="less">
@import "../assets/css/fit.less";

/deep/.van-popup {
  z-index: 9000 !important;
}
::v-deep .van-overlay {
  z-index: 9000 !important;
}
</style>
