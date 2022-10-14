<template>
  <div class="money flex-column align-items-center">
    <img
      src="https://img.hzanchu.com/acimg/9ae1394fb3c705f53a294a565d327dbc.png"
      @click="goto(1)"
    />
    <img
      src="https://img.hzanchu.com/acimg/1798781f328218bc9f0aaca2c58bedff.png"
      @click="goto(2)"
    />
  </div>
</template>

<script>
import { Toast } from "vant";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
export default {
  setup() {
    const Router = useRouter();
    // 点击跳转到相关页面
    const goto = (type) => {
      if (type == 1) {
        Router.push({
          name: "culturalProBigIncome",
        });
      } else if (type == 2) {
        Router.push({
          name: "culturalProBigOut",
        });
      }
    };
    onMounted(() => {});
    return { goto };
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../../assets/css/fit.less";
.money {
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  img {
    width: 100%;
    margin-top: 30px;
  }
}
</style>
