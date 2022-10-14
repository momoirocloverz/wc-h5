<template>
  <div class="groupIncreaseCon">
    <div class="title">村股份经济合作社与低收入农户帮扶协议</div>
    <div class="contentCon">
      <p>
        为了深入实施乡村振兴战略，加快低收入农户高水平全面小康步伐，使帮扶工作取得实效和成果，确保低收入农户增收致富，经村股份经济合作社与低收入农户双方协商达成如下协议：
      </p>
      <p>
        低收入农户利用多方筹措的低收入农户帮扶资金，通过村股份经济合作社入股上级抱团增收项目，每年获取稳定收益。
      </p>
      <p>
        低收入农户帮扶资金的家庭出资和银行贷款，产权归低收入农户家庭所有；配置的消薄脱贫使命基金，产权归村股份经济合作社所有。
      </p>
      <p>
        村股份经济合作社保证低收入农户享有每年入股资金8-10%的收益权，村股份经济合作社于每年12月31日前支付给低收入农户。低收入农户未能确定指定支付至某一家庭成员账号的，由村股份经济合作社按份支付给每一家庭成员（村股份经济合作社可按每一家庭成员的要求将其应得收益支付至其所指定的银行账户）。其中2020年度收益按实计算。
      </p>
      <p>
        1、低收入农户仅享有入股资金8-10%的收益分配权，不享有决策权、增值权等其他权利。
      </p>
      <p>2、低收入农户股权不得抵押、担保、转让给他人。股权不得继承。</p>
      <p>3、低收入农户家庭成员应遵纪守法，配合基层治理。</p>
      <p>
        低收入农户在持有帮扶股份后，根据民政局提供的每年6月底低保户和低保边缘户信息库名单复核，如不再列入信息库名单的，可继续持股一年，至低收入农户不再列入信息库名单的下一年7月1日自动退出。
      </p>
      <p>
        有下列情形的，低收入农户股份全额退出（自退股情形出现的下一个7月1日办理退股手续）：
      </p>
      <p>1、低收入农户申请退股的；</p>
      <p>2、低收入农户的股份被司法、行政机关强制执行的；</p>
      <p>
        3、被举报低收入农户不符合低保户和低保边缘户条件的，并经民政局查实的；
      </p>
      <p>4、违反入股帮扶约定的；</p>
      <p>
        5、存在其他应全额退出原因的。
        低收入农户退股，低收入农户的家庭出资由村股份经济合作社退还给低收入农户，银行贷款按三方托管协议归还给银行，消薄脱贫使命基金退回到村股份经济合作社。
      </p>
    </div>
    <div class="bottom">
      <div class="button" @click="goBack">返回</div>
    </div>
  </div>
</template>
<script>
import { useRouter, useRoute } from 'vue-router'
import { reactive } from 'vue'
import { Toast } from 'vant'
export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({})
    const goBack = () => {
      Router.go(-1)
    }
    return {
      state,
      goBack,
    }
  },
}
</script>

<style scoped lang="less">
.groupIncreaseCon {
  background-color: #fff;
  padding: 0 30px;
  padding-top: 30px;
  padding-bottom: 120px;
  box-sizing: border-box;
  min-height: 100vh;
  .mainImg {
    width: 100%;
  }
  p {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .title {
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    color: #333;
    margin-top: 34px;
    margin-bottom: 20px;
  }
  .contentCon {
    font-size: 28px;
    color: #333;
    letter-spacing: 3px;
    line-height: 30px;
  }
  .bottom {
    // width: 690px;
    width: 92%;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    left: 30px;
    right: 30px;
    bottom: 20px;
    .button {
      width: 310px;
      height: 70px;
      background: linear-gradient(#ff844e 0%, #fe6d56 100%);
      border-radius: 35px;
      font-size: 32px;
      color: #fff;
      text-align: center;
      line-height: 70px;
      margin: 0 auto;
    }
  }
}
</style>
