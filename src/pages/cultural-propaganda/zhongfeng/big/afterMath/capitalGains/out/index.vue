<template>
  <div class="out">
    <div class="total flex-column align-items-center">
      <div class="fs-28">当前总打款</div>
      <div class="fs-48">¥{{ total }}元</div>
      <div class="common-btn" @click="toSubmit">上传打款凭证</div>
      <!-- <div class="fs-28" @click="checkList">查看各村集体打款账号</div> -->
    </div>
    <out-list ref="listRef" @list="dealList"></out-list>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import OutList from "./list.vue";
import { Toast } from "vant";
export default {
  components: { OutList },
  setup() {
    const Router = useRouter();
    const listRef = ref(null);
    // 点击跳转到相关页面
    const total = ref(0);
    // 点击去上传凭证
    const toSubmit = () => {
      Router.push({
        name: "culturalProBigSubmit",
      });
    };
    // 查看各村集体打款账号
    const checkList = () => {
      Toast("暂无打款账号数据");
    };
    const dealList = (e) => {
      total.value = e.remitTotal;
    };
    onMounted(() => {
      listRef.value.load();
    });
    return { total, toSubmit, listRef, dealList, checkList };
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../../../assets/css/fit.less";
.out {
  width: 100%;
  height: 100%;

  .total {
    padding: 40px;
    box-sizing: border-box;
    background-color: #fff;
    div:nth-of-type(1) {
      width: 100%;
      margin-top: 30px;
      text-align: center;
      color: #999999;
    }
    div:nth-of-type(2) {
      width: 100%;
      margin-top: 30px;
      text-align: center;
      font-weight: bold;
      color: #333;
    }

    div:nth-of-type(3) {
      width: 400px;
      margin-top: 30px;
    }

    div:nth-of-type(4) {
      width: 100%;
      margin-top: 30px;
      text-align: center;
      color: var(--custom_color);
    }
  }
}
</style>
