<template>
  <div class="_item fs-30" @click="gotoDetail">
    <div class="_main flex-row align-items-center jusfity-content-center fs-28">
      <div class="_title">工作内容：</div>
      <div class="_content">{{ item.content  }}</div>
      <div :style="'color: ' + getColor">{{ getStatus }}</div>
    </div>

    <div class="_main flex-row jusfity-content-center fs-28">
      <div class="_title">工作日期：</div>
      <div class="_content">{{ item.start_time }} - {{ item.end_time }}</div>
    </div>

    <div class="_main flex-row jusfity-content-center fs-28">
      <div class="_title">工作时长：</div>
      <div class="_content">{{ item.work_time }}</div>
    </div>

    <div class="_main flex-row jusfity-content-center fs-28">
      <div class="_title">招聘人数：</div>
      <div class="_content">{{ item.work_num }}人</div>
    </div>

    <div class="_main flex-row jusfity-content-center fs-28">
      <div class="_title">薪资：</div>
      <div class="_content">{{ item.salary }}元 / 天</div>
    </div>

    <div class="_main flex-row jusfity-content-center fs-28">
      <div class="_title">工作地址：</div>
      <div class="_content">{{ item.address }}</div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from "vue";
import Request from "@/service/request";
import { Toast, Dialog } from "vant";
export default {
  props: {
    item: {
      type: Object,
    }, // 必传
  },
  computed: {
    getColor: function () {
      let className = "";
      if (this.item.status == 2) {
        className = "#3787F5";
      } else if (this.item.status == 0) {
        className = "#FF844E";
      } else if (this.item.status == 3) {
        className = "#FF0000";
      }
      return className;
    },
    getStatus: function () {
      let status = "";
      status = this.item.status_name;
      return status;
      if (this.item.status == 2) {
        status = "报名中";
      } else if (this.item.status == 0) {
        status = "待审核";
      } else if (this.item.status == 3) {
        status = "审核不通过";
      }
      return status;
    },
    getContent: function () {
      //  1割蜜；2蜂场转场；3整理蜂场
      let content = "其他";
      if (this.item.type == 1) {
        content = "割蜜";
      } else if (this.item.type == 2) {
        content = "蜂场转场";
      } else if (this.item.type == 3) {
        content = "整理蜂场";
      }
      return content;
    },
  },
  setup(props, { emit }) {
    const Router = useRouter();
    const gotoDetail = () => {
      Router.push(
        "/cultural-propaganda/zhongfeng/work/detail1?id=" + props.item.id
      );
    };
    return { gotoDetail };
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

  ._main {
    margin-bottom: 10px;
  }

  ._title {
    width: 150px;
    color: #666666;
  }
  ._content {
    flex: 1;
    color: #333333;
  }
}
</style>
