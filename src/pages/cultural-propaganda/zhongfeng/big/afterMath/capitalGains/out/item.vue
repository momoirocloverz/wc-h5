<template>
  <div class="item">
    <ac-item :title="item.created_at"></ac-item>
    <ac-item title="村集体" :value="item.groupName"></ac-item>
    <ac-item title="打款凭证" :imgList="item.img_url"></ac-item>
    <ac-item
      title="打款金额"
      :value="'¥' + item.amount + '元'"
      :showLine="false"
    ></ac-item>
  </div>
</template>

<script>
import AcItem from "@/components/acItem.vue";
export default {
  components: { AcItem },
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
.item {
  width: 100%;
  margin-top: 30px;
}
</style>
