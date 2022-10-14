<!-- 自定义安厨图片展示组件 -->
<template>
  <div class="result">
    <div class="main flex-column align-items-center">
      <img class="icon" :src="getIcon" />
      <div class="status fs-36">{{ getStatus }}</div>
      <div class="title fs-36">{{ getTitle }}</div>
      <div class="tip fs-28">{{ getTip }}</div>

      <div class="btn flex-row justify-content-between">
        <div class="common-btn-plain" @click="goHome">返回首页</div>
        <div class="common-btn" @click="goDetail">查看进度</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from "vue";
import { onMounted } from "@vue/runtime-core";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  computed: {
    getIcon: function () {
      let src =
        "https://img.hzanchu.com/acimg/37a910e65259bc77ed5b7f0d5580c3eb.png";
      return src;
    },
    // 获取当前状态
    getStatus: function () {
      let title = "提交成功";
      return title;
    },
    getTitle: function () {
      let title = "";
      if (this.type == 1) {
        // 如果是 大户资格认定
        title = "审核结果将以短信形式通知";
      }
      return title;
    },
    // 获取当前状态
    getTip: function () {
      let tip = "";
      if (this.type == 1) {
        // 如果是 大户资格认定
        tip = "可在申报详情中查看进度";
      }
      return tip;
    },
  },
  setup() {
    const Router = useRouter();
    const Route = useRoute();
    const status = ref(1); // 是否成功，1表示成功，
    const type = ref(1); // 1表示大户资格认定

    // 返回首页
    const goHome = () => {
      Router.go(-5);
    };
    // 查看进度
    const goDetail = () => {};
    onMounted(() => {
      // 这里获取成功的展示方式
      if (Route.params.type) {
        type.value = Route.params.type;
        console.log(type.value);
      }
    });
    return { status, type, goHome, goDetail };
  },
});
</script>

<style lang="less" scoped>
@import "../../../../assets/css/fit.less";
.result {
  width: 100%;
  .main {
    width: 100%;
    padding: 0 65px;
    box-sizing: border-box;

    .icon {
      width: 140px;
      height: 140px;
      margin-top: 120px;
    }

    .status {
      width: 80%;
      margin-top: 60px;
      text-align: center;
      color: #333;
    }

    .title {
      width: 80%;
      margin-top: 10px;
      text-align: center;
      color: #333;
    }

    .tip {
      width: 80%;
      margin-top: 10px;
      text-align: center;
      color: #666;
    }

    .btn {
      width: 100%;
      margin-top: 120px;
      div:nth-of-type(1) {
        flex: 1;
      }
      div:nth-of-type(2) {
        flex: 1;
        margin-left: 70px;
      }
    }
  }
}
</style>
