<template>
  <div class="groupIncreaseCon">
    <img class="mainImg" src="https://img.hzanchu.com/acimg/ea786000196f1780df69e71cbbd27eb3.png" />
    <div class="title">文成县经济薄弱村和低收入农户抱团增收的实施细则</div>
    <div class="contentCon">
      根据《文成县经济薄弱村和低收入农户抱团增收的实施》（文委发﹝2019﹞号）精神，为有序推进经济薄弱村和低收入农户抱团增收，实现低收入农户高水平全面小康水平，特制订本实施细则。
      <p class="margin1">一、抱团对象</p>
      <p>1、经济薄弱村：年经营性收入少于8万元的行政村，全县共有132个行政村。</p>
      <p>2、低收入农户：经乡镇、县农业农村局、县民政局核实后的低收入农户。</p>
      <p class="margin1">二、增收目标</p>
      <p>1、经济薄弱村：2019年所有行政村的经营性收入超过6万元；2020年所有行政村的经营性收入超过8万元。</p>
      <p>2、低收入农户：让无劳动能力的对象年增收1000－2000元。</p>
      <p class="margin1">三、抱团项目</p>
      <p>1、乡镇内抱团：以乡镇兴村公司牵头，跨村抱团投资村办小水电、农贸市场、民宿等项目。</p>
      <p>2、县内抱团：以县兴村投资公司牵头，跨乡镇抱团投资高一电、百丈漈小微园、物流仓储等项目。</p>
      <p>3、县外抱团项目：以县兴村公司负责对处投资，包括平湖－文成“飞地经济”产业园、瑞安山海协作“飞地”项目等。</p>
      <p class="margin1">四、投资计划</p>
      <p>1、2019年，计划投资1.1亿元。</p>
      <p>2、2020年，计划投资2.2亿元。</p>
      <p class="margin1">五、投资顺序</p>
      <p>1、先由经济薄弱村投资，再由低收入农户投资。</p>
      <p>2、先低收入农户中先考虑无劳动能力的，后有劳动能力的。</p>
      <p>3、根据抱团项目的成熟程度和项目的进展程度，分期分批筹集资金。</p>
      <p class="margin1">六、投资流程</p>
      <p>1、资金根据县兴村公司的要求分批注入。</p>
      <p>2、经济薄弱村和低收入农户投资以乡镇兴村公司名义抱团入股。</p>
      <p>3、每年12月县兴村公司按8-10%的年回报率统一分红给乡镇兴村公司，再由乡镇兴村公司按实际情况合理分配给薄弱村和低收入农户。</p>
      <p>4、统一需要到县农商银行贷款的村和户，以乡镇兴村公司名义贷款。</p>
      <p class="margin1">七、筹资方式</p>
      <p>1、经济薄弱村：村自有资金+相关奖励资金+宅基地补助资金+挂钩帮扶资金+捐助资金+银行贷款资金+其他资金。</p>
      <p>2、低收入农户：自有资金+帮扶资金+捐助资金+银行贷款资金+其他资金。</p>
      <p class="margin1">八、抱团要求</p>
      <p>1、抱团增收的行政村必须复垦宅基地3亩以上，或由所在乡镇统筹，确保入股的每个村平均复垦宅基地3亩以上。</p>
      <p>2、低收入农户必须以村为单位进行抱团投资，自筹资金不得少于5000元。</p>
      <p>3、首批抱团项目中，经济薄弱村投资规模最高50万元，低收入农户投资规模最高2万元，之后根据抱团项目情况再扩大投资规模。</p>
    </div>
    <div class="bottom">
      <div class="button2" @click="refuseAction">取消</div>
      <div class="button" @click="agreeAction">我要加入</div>
    </div>
  </div>
</template>
<script>
import { useRouter, useRoute } from 'vue-router'
import { reactive } from 'vue'
import { Toast, Dialog } from 'vant'
export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      type: ''
    })
    const refuseAction = () => {
      Router.go(-1)
    }
    const agreeAction = () => {
      let track = localStorage.getItem('currentUserInfo') ? JSON.parse(localStorage.getItem('currentUserInfo')) : ''
      if (track) {
        state.type = track.type
        if (track.type == 1) {
          Router.push({
            name: 'zhongfengtoJoinGroup'
          })
        } else {
          Dialog.alert({
            title: '抱歉',
            message: '抱团增收政策仅支持低收入农户，您不是低收入农户，暂不支持申请'
          }).then(() => {
            // on close
          })
        }
      } else {
        Dialog.alert({
          title: '抱歉',
          message: '抱团增收政策仅支持低收入农户，您不是低收入农户，暂不支持申请'
        }).then(() => {
          // on close
        })
      }
    }
    return {
      state,
      refuseAction,
      agreeAction
    }
  }
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
  .title {
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    color: #333;
    margin-top: 34px;
    margin-bottom: 20px;
  }
  .margin1 {
    margin-top: 20px;
    margin-bottom: 10px;
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
    }
    .button2 {
      width: 310px;
      height: 66px;
      border: 2px solid #fe6d56;
      background: #fff;
      color: #fe6d56;
      border-radius: 33px;
      font-size: 32px;
      text-align: center;
      line-height: 70px;
    }
  }
}
</style>
