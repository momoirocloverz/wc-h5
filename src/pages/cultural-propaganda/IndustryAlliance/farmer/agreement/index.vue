<template>
  <div class="bigSignCon">
    <div class="articleCon">
      <div class="title">产业联盟土地认种协议</div>
      <img class="markImg" :src="state.markImg" v-if="state.showImg" />
      <div class="content" v-html="state.content"></div>
    </div>
    <div class="bottomCon fixBottom">
      <div class="bottom">
        <div class="cancelBtn" @click="cancelAction">取消</div>
        <div class="button" @click="agreeAction">{{ state.showImg ? '确定' : '手绘签名' }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      content:
        '根据《文成县低收入农户高水平小康计2018-2022》、《文成县财政专项扶贫资金和项目管理办法》(文财农（2019）259号)等文件精神和要求，发挥和推进中蜂产业发展，在低收入农户增收和壮大村集体经济的作用，经研究决定实施中蜂养殖折股量化扶贫项目，结合文成实际，特制定中蜂养殖折股量化扶贫项目实施方案（试行）。一、目标任务（一）经济效益目标2020年-2023年，全县计划在10-20个低收入农户相对集中的村组织实施中蜂养殖折股量化扶贫项目，发展中蜂养殖1000箱以上，实现每箱年收入400元（按8斤蜂蜜折算）以上，低收入农户三年户均增收1900元以上，村集体年增收万元以上，促进低收入农户、蜂农增收和壮大村集体经济,实现多盈。（二）社会效益目标通过中蜂扶贫折股量化项目推进中蜂产业发展，扶持10-20个养蜂大户和企业的发展三年实现增收200多万元，其中包括来自人工分蜂获得的收益；同时，为推进文成库区农民实现转产转业促进全县畜牧业转型升级，实现农民增收提供实践经一、目标任务（一）经济效益目标2020年-2023年，全县计划在10-20个低收入农户相对集中的村组织实施中蜂养殖折股量化扶贫项目，发展中蜂养殖1000箱以上，实现每箱年收入400元（按8斤蜂蜜折算）以上，低收入农户三年户均增收1900元以上，村集体年增收万元以上，促进低收入农户、蜂农增收和壮大村集体经济,实现多盈。（二）社会效益目标通过中蜂扶贫折股量化项目推进中蜂产业发展，扶持10-20个养蜂大户和企业的发展三年实现增收200多万元，其中包括来自人工分蜂获得的收益；同时，为推进文成库区农民实现转产转业促进全县畜牧业转型升级，实现农民增收提供实践经',
      justForShow: false,
      markImg: require('@/assets/imgs/sign2x.png'),
      showImg: false
    })
    const initAction = () => {
      /* Request.fetchMajorProtocol({
        farmer_id: Route.query.farmer_id
      })
        .then((res) => {
          if (res && res.code == 0) {
            state.content = res.data
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        }) */
      let sign = sessionStorage.getItem('signName1')
      if (sign) {
        let content = JSON.parse(sessionStorage.getItem('signName1'))
        state.showImg = true
      }
    }
    const checkRoute = () => {
      if (Route && Route.query && Route.query.forShow) {
        state.justForShow = true
      } else {
        state.justForShow = false
      }
    }
    onMounted(() => {
      checkRoute()
      initAction()
    })
    const agreeAction = () => {
      if (state.showImg) {
        Router.go(-1)
        // Router.replace({
        //   name: 'IndustryAllianceFarmerSubDetAction',
        //   query: {
        //     id: Route.query.id
        //   }
        // })
      } else {
        Router.push({
          name: 'IndustryAllianceFarmerAgreeSign',
          query: {
            id: Route.query.id
          }
        })
      }
    }
    const cancelAction = () => {
      sessionStorage.removeItem('signName1')
      sessionStorage.removeItem('signAreaValue1')
      //   Router.go(-1)
      Router.replace({
        name: 'IndustryAllianceFarmerAgreeSign',
        query: {
          id: Route.query.id
        }
      })
    }
    return {
      cancelAction,
      state,
      agreeAction,
      initAction
    }
  }
}
</script>

<style lang="less" scoped>
.fixBottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.bigSignCon {
  box-sizing: border-box;
  //   padding-bottom: 60px;
}
.articleCon {
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
  padding-bottom: 200px;
  position: relative;
}
.markImg {
  position: absolute;
  right: 20px;
  top: 30px;
  width: 165px;
  height: 165px;
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
  text-align: left;
  color: #333;
  line-height: 48px;
}
.bottomCon {
  width: 100%;
  height: 128px;
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
  padding-top: 16px;
  box-sizing: border-box;
  .cancelBtn {
    width: 44.5%;
    height: 96px;
    border: 2px solid #ff844e;
    box-sizing: border-box;
    border-radius: 48px;
    font-size: 36px;
    color: #ff844e;
    text-align: center;
    line-height: 96px;
    margin-right: 10px;
  }
  .button {
    width: 44.5%;
    height: 96px;
    background: linear-gradient(#ff844e 0%, #fe6d56 100%);
    border-radius: 48px;
    font-size: 36px;
    color: #fff;
    text-align: center;
    line-height: 96px;
  }
}
</style>
