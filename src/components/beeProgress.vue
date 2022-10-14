<template>
  <div class="progressCon">
    <div class="alignCenter">
      <img class="commonImg" :src="state.active1Current" />
      <div
        class="notactiveProgressText"
        :class="activeStep == 1 ? 'activeProgressText' : ''"
      >
        {{ textList[0] }}
      </div>
    </div>
    <div class="dashLine"></div>
    <div class="alignCenter">
      <img class="commonImg" :src="state.active2Current" />
      <div
        class="notactiveProgressText"
        :class="activeStep == 2 ? 'activeProgressText' : ''"
      >
        {{ textList[1] }}
      </div>
    </div>
    <!-- <div class="dashLine"></div>
    <div>
      <img class="commonImg" :src="state.active3Current" />
      <div
        class="notactiveProgressText"
        :class="activeStep == 3 ? 'activeProgressText' : ''"
      >
        签约
      </div>
    </div> -->
  </div>
</template>
<script>
import { reactive, onMounted } from "vue";
export default {
  props: {
    activeStep: {
      default: 1,
    },
    textList: {
      default: ["申报信息填写", "选择养殖大户"],
    },
  },
  setup(props) {
    const state = reactive({
      active1Img:
        "https://img.hzanchu.com/acimg/538b8d50b1e7e27fffbd56c69c8a7214.png",
      active2Img:
        "https://img.hzanchu.com/acimg/01718e6c54fd94fb8bcad056413f73b9.png",
      active3Img:
        "https://img.hzanchu.com/acimg/68296c19b9c2b4ac55d4667cdc738c90.png",
      back1Img:
        "https://img.hzanchu.com/acimg/260161abb494bb8bf3f820fb4d0b6699.png",
      back2Img:
        "https://img.hzanchu.com/acimg/28bd641679bab9767b936e1c85300d0b.png",
      back3Img:
        "https://img.hzanchu.com/acimg/251daf2700e6d053f8ee7be864d63d32.png",
      border1Img:
        "https://img.hzanchu.com/acimg/d6037ddfb855e451cc2e07132255274e.png",
      border2Img:
        "https://img.hzanchu.com/acimg/dda82b259d8936caf7142e748e6091aa.png",
      border3Img:
        "https://img.hzanchu.com/acimg/2a16b4bc6361cb7e9c5f409837e6a61a.png",
      active1Current: "",
      active2Current: "",
      active3Current: "",
    });

    const analyse = () => {
      if (props.activeStep == 1) {
        state.active1Current = state.active1Img;
        state.active2Current = state.border2Img;
        state.active3Current = state.border3Img;
      } else if (props.activeStep == 2) {
        state.active1Current = state.back1Img;
        state.active2Current = state.active2Img;
        state.active3Current = state.border3Img;
      } else {
        state.active1Current = state.back1Img;
        state.active2Current = state.back2Img;
        state.active3Current = state.active3Img;
      }
    };
    onMounted(() => {
      analyse();
    });
    return {
      state,
    };
  },
};
</script>

<style lang="less" scoped>
.progressCon {
  box-sizing: border-box;
  padding: 25px 116px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  overflow: hidden;
  .alignCenter {
    text-align: center;
  }
  .commonImg {
    height: 60px;
    width: 60px;
    margin-bottom: 10px;
  }
  .notactiveProgressText {
    font-size: 30px;
    font-weight: 400;
    color: #999999;
  }
  .activeProgressText {
    font-size: 30px;
    font-weight: 500;
    color: #ff844e;
  }
  .dashLine {
    margin-top: -50px;
    border-bottom: 2px dashed #d2d2d2;
    height: 1px;
    width: 30%;
  }
}
</style>
