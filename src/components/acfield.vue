<!-- 自定义安厨图片展示组件 -->
<template>
  <div
    :class="
      '_field fs-28 ' + (lineFeed ? '' : ' flex-row justify-content-between')
    "
    :style="(showLine ? '' : ' border-bottom: 2px solid #fff; ') + customStyle"
  >
    <div
      class="_title flex-row align-items-center"
      :style="lineFeed ? 'width: 100%;margin-bottom: 10px;' : ''"
    >
      {{ title }}
      <div v-if="tip" class="_tip fs-26">{{ tip }}</div>
    </div>
    <slot />
  </div>
</template>

<script>
import { ref, defineComponent } from "vue";
import { onMounted } from "@vue/runtime-core";

export default defineComponent({
  props: {
    title: {
      type: String,
      default: "",
    }, // title标题
    tip: {
      type: String,
      default: "",
    }, // 是否展示tip（一般来说存在于换行的情况下）
    customStyle: {
      type: String,
      default: "",
    },
    lineFeed: {
      type: Boolean,
      default: false,
    }, // 是否换行，主要用于textArea等其他需要展示在下面的空控件
    showLine: {
      type: Boolean,
      default: true,
    }, // 是否展示底部的横线
  },
  setup() {
    onMounted(() => {});
    return {};
  },
});
</script>

<style lang="less" scoped>
@import "../assets/css/fit.less";

._field {
  // height: 86px;
  padding: 20px 0;
  box-sizing: border-box;
  border-bottom: 2px solid #ebebeb;
  ._title {
    width: 250px;
    color: #333;
  }

  ._tip {
    margin-left: 15px;
    color: #cccccc;
    align-self: flex-end;
  }

  input {
    flex: 1 !important;
    margin-left: 40px;
    text-align: right !important;
    color: #333;
  }

  input::placeholder {
    color: #b3b3b3;
  }

  ._field-arrow {
    flex: 1 !important;
    margin-left: 40px;
    text-align: right !important;
    // color: #b3b3b3;
    color: #333;
  }

  textarea {
    width: 100%;
    height: auto;
    color: #333;
  }
}
/deep/ input {
  flex: 1 !important;
  margin-left: 40px;
  text-align: right !important;
  color: #333;
}
/deep/ input::placeholder {
  color: #b3b3b3;
}

/deep/ ._field-arrow {
  flex: 1 !important;
  margin-left: 40px;
  text-align: right !important;
  color: #333;
}

/deep/ textarea {
  width: 100%;
  height: auto;
  color: #333;
}
</style>

<style lang="less" >
// input {
//   flex: 1 !important;
//   margin-left: 40px;
//   text-align: right !important;
//   color: #333;
// }

// input::placeholder {
//   color: #b3b3b3;
// }

// ._field-arrow {
//   flex: 1 !important;
//   margin-left: 40px;
//   text-align: right !important;
//   color: #333;
// }

// textarea {
//   width: 100%;
//   height: auto;
//   color: #333;
// }
</style>
