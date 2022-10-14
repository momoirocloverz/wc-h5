<template>
  <div class="_item fs-30" @click="gotoDetail">
    <template v-if="type == 0">
      <div class="_title flex-row align-items-center justify-content-between">
        <div class="fs-32">{{ item.title }}</div>
        <div class="fs-28" :style="'color: ' + getColor">{{ getStatus }}</div>
      </div>
      <div class="_time fs-28">开始时间： {{ item.start_time }}</div>
      <div class="_time fs-28">结束时间： {{ item.end_time }}</div>
    </template>

    <template v-if="type == 1">
      <div class="_submit flex-row align-items-center fs-28">
        预约时间：{{ item.apply_at }}
        <div :style="'color: ' + getColor">{{ getStatus }}</div>
      </div>
      <div class="_submit fs-28">提交时间：{{ item.created_at }}</div>
      <div v-if="item.status == 3" class="_submit fs-28">
        拒绝理由：{{ item.comment }}
      </div>
      <div class="_submit fs-28">养殖大户名称：{{ item.company_name }}</div>
      <div class="_submit fs-28">联系方式：{{ item.mobile }}</div>
    </template>
  </div>
</template>

<script>
import { ref } from "vue";
import Request from "@/service/request";
import { useRouter } from "vue-router";
export default {
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
  },
  setup(props, { emit }) {
    const Router = useRouter();
    const gotoDetail = () => {
      // 如果是自己申请的
      if (props.type == 0) {
        Router.push({
          name: "farmersTrainingDetail",
          query: {
            id: props.item.id,
          },
        });
      }
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

  ._time {
    margin-top: 5px;
    color: #999;
  }

  ._submit {
    margin-top: 5px;
    color: #333;
    div {
      flex: 1;
      text-align: right;
    }
  }
}
</style>
