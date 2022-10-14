<template>
  <div class="normalSignCon">
    <BeeProgress
      activeStep="1"
      :textList="['承诺书签署', '基础信息填写']"
    ></BeeProgress>

    <div class="articleCon">
      <div class="title">寄养承诺书</div>
      <!-- <div class="content" v-html="state.content"></div> -->
      <div class="content">
        文成县经济薄弱村和低收入农户抱团增收的实施细则
        根据《文成县经济薄弱村和低收入农户抱团增收的实施》（文委发﹝2019﹞号）精神，为有序推进经济薄弱村和低收入农户抱团增收，实现低收入农户高水平全面小康水平，特制订本实施细则。
        一、抱团对象
        1、经济薄弱村：年经营性收入少于8万元的行政村，全县共有132个行政村。
        2、低收入农户：经乡镇、县农业农村局、县民政局核实后的低收入农户。
        二、增收目标
        1、经济薄弱村：2019年所有行政村的经营性收入超过6万元；2020年所有行政村的经营性收入超过8万元。
        2、低收入农户：让无劳动能力的对象年增收1000－2000元。 三、抱团项目
        1、乡镇内抱团：以乡镇兴村公司牵头，跨村抱团投资村办小水电、农贸市场、民宿等项目。
        2、县内抱团：以县兴村投资公司牵头，跨乡镇抱团投资高一电、百丈漈小微园、物流仓储等项目。
        3、县外抱团项目：以县兴村公司负责对处投资，包括平湖－文成“飞地经济”产业园、瑞安山海协作“飞地”项目等。
        四、投资计划 1、2019年，计划投资1.1亿元。 2、2020年，计划投资2.2亿元。
        四、投资顺序 1、先由经济薄弱村投资，再由低收入农户投资。
        2、先低收入农户中先考虑无劳动能力的，后有劳动能力的。
        3、根据抱团项目的成熟程度和项目的进展程度，分期分批筹集资金。
        六、投资流程 1、资金根据县兴村公司的要求分批注入。
        2、经济薄弱村和低收入农户投资以乡镇兴村公司名义抱团入股。
        3、每年12月县兴村公司按8-10%的年回报率统一分红给乡镇兴村公司，再由乡镇兴村公司按实际情况合理分配给薄弱村和低收入农户。
        4、统一需要到县农商银行贷款的村和户，以乡镇兴村公司名义贷款。
        六、筹资方式
        1、经济薄弱村：村自有资金+相关奖励资金+宅基地补助资金+挂钩帮扶资金+捐助资金+银行贷款资金+其他资金。
        2、低收入农户：自有资金+帮扶资金+捐助资金+银行贷款资金+其他资金。
        七、抱团要求
        1、抱团增收的行政村必须复垦宅基地3亩以上，或由所在乡镇统筹，确保入股的每个村平均复垦宅基地3亩以上。
        2、低收入农户必须以村为单位进行抱团投资，自筹资金不得少于5000元。
        3、首批抱团项目中，经济薄弱村投资规模最高50万元，低收入农户投资规模最高2万元，之后根据抱团项目情况再扩大投资规模。
      </div>
    </div>
    <div class="bottomCon">
      <div class="bottom">
        <div class="button" @click="agreeAction">同意，下一步</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import BeeProgress from "@/components/beeProgress";
import Request from "@/service/request";
import { isZLB } from "@/util/index";
export default {
  components: {
    BeeProgress,
  },
  setup() {
    const Router = useRouter();
    const Route = useRoute();
    const state = reactive({
      content: "",
      ZLBFLAG: isZLB(),
    });
    const initAction = () => {};
    onMounted(() => {
      initAction();
    });
    const agreeAction = () => {
      if (Route.query.edit) {
        Router.push({
          name: "culturalProBigFarmerApply",
          query: {
            edit: "1",
          },
        });
      } else {
        Router.push({
          name: "culturalProBigFarmerApply",
        });
      }
    };
    const refuseAction = () => {
      Router.go(-1);
    };
    return {
      state,
      agreeAction,
      refuseAction,
    };
  },
};
</script>

<style lang="less" scoped>
.normalSignCon {
  box-sizing: border-box;
}
.articleCon {
  margin-top: 30px;
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
  padding-bottom: 140px;
}
.title {
  margin: 0 auto;
  margin-bottom: 50px;
  width: 572px;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  color: #333;
  line-height: 48px;
}
.content {
  font-size: 28px;
  font-weight: bold;
  text-align: left;
  color: #333;
  line-height: 48px;
}
.bottomCon {
  width: 100%;
  height: 150px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0px -3px 15px rgba(0, 0, 0, 0.08);
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
  box-sizing: border-box;
  .button {
    width: 73.33%;
    height: 70px;
    background: linear-gradient(#ff844e 0%, #fe6d56 100%);
    border-radius: 35px;
    font-size: 32px;
    color: #fff;
    text-align: center;
    line-height: 70px;
  }
}
</style>
