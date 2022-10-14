<template>
  <div class="outer">
    <div class="title">文成县农业农村局 文成县教育局 文成县财政局 <br />关于申报2020年度雨露计划的通知</div>
    <div class="main-body">
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为进一步贯彻落实《关于加强雨露计划支持农村贫困家庭新成长劳动力接受职业教育的意见》（国开办发〔2015〕19 号）、《关于实施“雨露计划”工作中严格按扶持范围执行的通知》（浙扶贫办 〔2018〕9 号）、雨露计划职业教育工作指南（试行）》的规定，加大教育促进力度，促进低收入农户增收，现将申报2020年度“雨露计划”的有关事项通知如下：</p>
      <p class="subtitle">一、扶持对象</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用于就读中、高等职业教育学校（在教育部、 人力资源社会保障部的学籍管理系统注册正式学籍） 的在校低收入农户家庭子女。</p>
      <p class="subtitle">二、扶持标准</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对符合条件的低收入农户家庭子女，每生每学 年给予3000元的助学补助。</p>
      <p class="subtitle">三、申报程序</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;坚持公开、公平、公正原则，按照自下而上、 逐级审核的方式进行。严格按照申报条件要求，确 认对象受助资格；受助对象申请表、申报材料、公 示名单等相关材料齐全。 （一）对象申报。按照申报条件，各乡镇符合 条件的申报对象填写《助学补助申请表》（附件1）， 提供所需申报材料，并向所在村（居）提出申请。 申报材料包括:《助学补助申请表》（附件1）、 低收入农户家庭户主及子女户口本复印件、身份证复 印件，中、高等职业院校就读证明。 （二）村民委员会审议。各村民委员会负责本村 申报程序的规范性、申报材料的真实性，对申报对象 的基本情况、在校信息等进行初审。 （三）乡镇人民政府公示确认。乡镇对申报材料 进行核审后，将符合条件的对象向所在乡镇及村 （居）公开公示。公开公示无异议后（公示情况以照 片形式上报），上报文成县农业农村局、教育局审 核，并向县农业农村局上报“雨露计划”补助花名 册（附件3）。</p>
    </div>

    <div class="btn">
      <button :disabled="disabled" class="to-declare" @click="toDeclare">我要申报</button>
      <button class="to-detail" @click="toRecord">申报记录</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
export default {
  setup() {
    const Router = useRouter();
    const route = useRoute();
    const disabled = ref(false);

    const toDeclare = () => {
      Router.push({path: '/subsidy/declare', query: {plan_id: route.query.plan_id}});
    }

    const toRecord = () => {
      Router.push({path: '/subsidy/record', query: {plan_id: route.query.plan_id}});
    }

    return {
      disabled,
      toDeclare,
      toRecord
    }
  }
}
</script>

<style lang="less" scoped>
  .outer {
    padding: 0 32px 160px;
    background: #fff;
    overflow: hidden;
  }
  .title {
    color: #333;
    font-size: 32px;
    line-height: 44px;
    font-weight: 600;
    text-align: center;
    margin: 40px 0;
  }
  .main-body {
    line-height: 40px;
    font-size: 30px;
    color: #333;
    .subtitle {
      font-weight: 600;
    }
  }
  .btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 50px;
    // width: 698px;
    width: 92%;
    .to-declare {
      height: 80px;
      border-radius: 40px;
      color: #fff;
      background: #FF844E;
      text-align: center;
      line-height: 80px;
      font-size: 30px;
      border: 0;
      flex: 1;
    }
    .to-detail {
      height: 78px;
      width: 328px;
      border: 2px solid #FF844E;
      color: #FF844E;
      font-size: 30px;
      text-align: center;
      line-height: normal;
      border-radius: 39px;
      margin-left: 30px;
      background: #fff;
    }
  }
</style>