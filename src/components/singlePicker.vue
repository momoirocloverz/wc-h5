<template>
  <van-popup :show="showS" position="bottom">
    <van-picker :columns="list" @confirm="onConfirm" @cancel="showS = false" />
  </van-popup>
</template>

<script>
// import { useRouter } from "vue-router";
import { onMounted } from "@vue/runtime-core";
import { ref } from "vue";
// import $store from "../store/index";

export default {
  name: "",
  props: {
    ctype: {
      type: Number,
    },
    bottom: {
      type: String,
      default: "",
    },
    zIndex: {
      type: Number,
      default: 9000,
    },
    list: {
      type: Array,
    },
  },
  setup(props, { emit }) {
    // const Router = useRouter();
    const showS = ref(false); // 是否展示当前村选择器
    const hide = () => {
      showS.value = false;
    };
    const show = () => {
      showS.value = true;
    };
    const onConfirm = (values) => {
      emit("select", values);
      showS.value = false;
    };

    onMounted(() => {});
    return {
      showS,
      show,
      hide,
      onConfirm,
    };
  },
};
</script>

<style scoped lang="less">
@import "../assets/css/fit.less";
</style>
