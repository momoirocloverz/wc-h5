<template>
  <div
    class="title-bar flex-row align-items-center justify-content-between"
    :style="
      (showLine ? ' ' : ' border-bottom: 1px solid rgba(255,255,255,0); ') +
      customStyle
    "
  >
    <div class="flex-row align-items-center">
      <div
        v-if="showBar"
        class="bar"
        :style="'background-color: ' + barColor"
      ></div>
      <span class="title fs-32" :style="'color: ' + titleColor">{{
        title
      }}</span>
    </div>

    <span
      v-if="showMore"
      class="fs-28"
      :style="'color: ' + moreColor"
      @click="gotoMore"
      >{{ moreText }}</span
    >
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  props: {
    barColor: {
      type: String,
      default: "#fd844e",
    }, // bar颜色
    showBar: {
      type: Boolean,
      default: true,
    }, // 可以控制是否展示bar
    title: {
      type: String,
      default: "",
    },
    titleColor: {
      type: String,
      default: "#333333",
    }, // title颜色
    customStyle: {
      type: String,
      default: "",
    }, // 可传样式
    showMore: {
      type: Boolean,
      default: false,
    }, // 是否展示更多，默认为false
    moreRouter: {
      type: String,
      default: "",
    },
    moreText: {
      type: String,
      default: "更多",
    },
    moreColor: {
      type: String,
      default: "#333333",
    },
    showLine: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const Router = useRouter();
    const gotoMore = () => {
      if (props.moreRouter) {
        Router.push(props.moreRouter);
      } else {
        emit("more");
      }
    };
    return {
      gotoMore,
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped>
@import "../assets/css/fit.less";
.title-bar {
  margin-top: 15px;
  padding: 20px 30px;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom: 1px solid #ebebeb;
  .bar {
    width: 6px;
    height: 34px;
    border-radius: 2px;
  }
  .title {
    flex: 1;
    margin-left: 10px;
    font-weight: bold;
  }
}
</style>
