<template>
  <div class="income">
    <div class="total flex-column align-items-center">
      <div class="fs-28">当前总收益</div>
      <div class="fs-48">¥{{ total }}元</div>
    </div>
    <income-list ref="listRef" @list="dealList"></income-list>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import IncomeList from "./list.vue";
export default {
  components: { IncomeList },
  setup() {
    // 点击跳转到相关页面
    const total = ref(0);
    const listRef = ref(null);
    // 处理列表
    const dealList = (e) => {
      total.value = e.profitTotal;
    };

    onMounted(() => {
      listRef.value.load();
    });
    return { total, listRef, dealList };
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../../../assets/css/fit.less";
.income {
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
  }
}
</style>
