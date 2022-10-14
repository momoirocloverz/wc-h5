<template>
  <div class="income">
    <div class="total flex-column align-items-center">
      <div class="fs-28">当前总收益</div>
      <div class="fs-48">¥{{ total }}元</div>
    </div>

    <title-bar
      title="蜂箱收益"
      customStyle="background-color: rgba(255, 255, 255, 0)"
      :showLine="false"
    ></title-bar>

    <ac-item
      v-for="(item, index) in list"
      :key="index"
      title="2021-12-13"
      :value="'¥ ' + item.amount + '元'"
    ></ac-item>

    <list-empty v-if="list.length == 0" title="暂无收益"></list-empty>
  </div>
</template>

<script>
import { Toast } from "vant";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import TitleBar from "@/components/titleBar.vue";
import AcItem from "@/components/acItem.vue";
import Request from "@/service/request";
import ListEmpty from "@/components/listEmpty.vue";
export default {
  components: { TitleBar, AcItem, ListEmpty },
  setup() {
    // 点击跳转到相关页面
    const list = ref([]);
    const total = ref(0);

    // 初始化当前列表
    const init = () => {
      Toast.loading({ duration: 0, message: "加载中...", forbidClick: true });
      Request.planBeeFarmerProfitList({
        page: 1,
        pageSize: 999,
      })
        .then((e) => {
          if (e.code === 0) {
            list.value = e.data.data;
            total.value = e.data.totalProfit;
          }
        })
        .finally(() => {
          Toast.clear();
        });
    };

    onMounted(() => {
      init();
    });
    return { list, total };
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../assets/css/fit.less";
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

  .empty {
    margin-top: 120px;
    .icon {
      width: 387px;
      height: 256px;
    }
    .describe {
      margin-top: 40px;
      color: #333;
    }
  }
}
</style>
