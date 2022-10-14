<template>
  <div class="bigAppStatus">
    <div class="waitingCon" v-if="state.type == '4'">
      <div class="imgCon">
        <img class="statusImg" :src="state.waitingSrc" />
      </div>
      <div class="centerCon">
        <div class="shortRes">待村级审核</div>
        <div class="detailRes">
          您的申请已提交，3天完成审核， 请留意短信通知
        </div>
        <div class="countDownCon">（{{ state.count }}s）后自动返回 1</div>
      </div>
    </div>
    <div class="successCon" v-if="state.type == '2'">
      <div class="imgCon">
        <img class="statusImg" :src="state.successSrc" />
      </div>
      <div class="centerCon">
        <div class="shortRes">审核通过</div>
        <div class="detailRes">
          村级审核已同意您的申请， 将通知低收入农户重新选择
        </div>
      </div>
    </div>
    <div class="failedCon" v-if="state.type == '3'">
      <div class="imgCon">
        <img class="statusImg" :src="state.failedSrc" />
      </div>
      <div class="centerCon">
        <div class="shortRes">审核失败</div>
        <div class="detailRes">
          村级审核不同意您的申请， 您和低收入农户已匹配成功！
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
export default {
  components: {},
  setup() {
    const Router = useRouter();
    const Route = useRoute();
    const state = reactive({
      type: "1",
      count: 5,
      waitingSrc:
        "https://img.hzanchu.com/acimg/5c651f9cd1166d6be001ffbe03034a64.png",
      successSrc:
        "https://img.hzanchu.com/acimg/16448b1899949cf76bf36fd16209ced3.png",
      failedSrc:
        "https://img.hzanchu.com/acimg/585e5ad33aca50434e0cc1080141f3ed.png",
    });
    const agreeAction = () => {
      // Router.push({
      //     name:''
      // })
    };
    const initAction = () => {
      console.log("Route", Route.query);
      state.type = Route.query.type;
      if (state.type == "4") {
        window.time2 = setInterval(() => {
          if (state.count > 0) {
            state.count--;
          } else {
            clearInterval(window.time2);
            Router.go(-1);
          }
        }, 1000);
      }
    };
    const clearTime = () => {
      clearInterval(window.time2);
    };
    onMounted(() => {
      initAction();
    });
    onBeforeUnmount(() => {
      clearTime();
    });
    return {
      state,
      agreeAction,
    };
  },
};
</script>

<style lang="less" scoped>
.bigAppStatus {
  padding-top: 30px;
  box-sizing: border-box;
}
.successCon {
  padding-top: 130px;
  box-sizing: border-box;
}
.waitingCon {
  padding-top: 130px;
  box-sizing: border-box;
}
.failedCon {
  padding-top: 130px;
  box-sizing: border-box;
}
.centerCon {
  text-align: center;
}
.countDownCon {
  width: 300px;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  color: #666;
  line-height: 48px;
  margin: 0 auto;
  margin-top: 60px;
}
.shortRes {
  width: 182px;
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin: 0 auto;
  margin-top: 50px;
  margin-bottom: 30px;
}
.detailRes {
  width: 552px;
  font-size: 30px;
  font-weight: bold;
  color: #666;
  line-height: 48px;
  margin: 0 auto;
}
.imgCon {
  text-align: center;
}
.statusImg {
  width: 212px;
  height: 212px;
  text-align: center;
}
</style>
