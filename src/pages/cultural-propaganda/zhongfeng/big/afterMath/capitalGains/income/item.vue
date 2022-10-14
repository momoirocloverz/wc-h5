<template>
  <div class="_item">
    <title-bar
      title="蜂箱费用"
      :showMore="true"
      :moreText="'共¥' + item.amount + '元'"
    ></title-bar>
    <ac-item title="是否打款" value="已打款"></ac-item>
    <ac-item
      title="打款时间"
      :value="item.created_at"
      :showLine="false"
    ></ac-item>
  </div>
</template>

<script>
import TitleBar from "@/components/titleBar.vue";
import AcItem from "@/components/acItem.vue";
export default {
  components: { TitleBar, AcItem },
  props: {
    item: {
      type: Object,
    }, // 必传
  },
  setup() {
    return {};
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../../../assets/css/fit.less";
._item {
  width: 100%;
}
</style>
