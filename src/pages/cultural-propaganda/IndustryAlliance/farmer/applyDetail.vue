<template>
  <div class="industryAllApplyRecorDetail">
    <div class="whiteBg withPadding32">
      <div class="itemCon">
        <div class="titleItem">姓名：</div>
        <div class="contextCon">{{ state.currentData && state.currentData.name && state.currentData.name.replace(state.currentData.name.substr(0, 1), '*') }}</div>
      </div>
      <div class="itemCon">
        <div class="titleItem">身份证号：</div>
        <div class="contextCon">{{ state.currentData && state.currentData.card && state.currentData.card.slice(0, 8) + '****' + state.currentData.card.slice(15) }}</div>
      </div>
      <div class="itemCon">
        <div class="titleItem">联系电话：</div>
        <div class="contextCon">{{ state.currentData && state.currentData.mobile && state.currentData.mobile.replace(state.currentData.mobile.substr(3, 4), '****') }}</div>
      </div>
      <div class="itemCon">
        <div class="titleItem">家庭地址：</div>
        <div class="contextCon">浙江省温州市文成县{{ state.currentData && state.currentData.town_name }}{{ state.currentData && state.currentData.village_name }}</div>
      </div>
      <div class="itemCon">
        <div class="titleItem">详细地址：</div>
        <div class="contextCon">{{ state.currentData && state.currentData.address }}</div>
      </div>

      <div class="itemCon">
        <div class="titleItem">开户银行：</div>
        <div class="contextCon">{{ state.currentData && state.currentData.bank_name }}</div>
      </div>

      <div class="itemCon">
        <div class="titleItem">银行卡号：</div>
        <div class="contextCon">{{ state.currentData && state.currentData.bank_account }}</div>
      </div>
      <div class="itemCon">
        <div class="titleItem">土地经营权面积：</div>
        <div class="contextCon">{{ state.currentData && state.currentData.area }}亩</div>
      </div>
      <div class="itemCon">
        <div class="titleItem">土地经营权合同或土地所有权证明：</div>
        <div class="contextCon">
          <div class="pic">
            <div class="pic-list">
              <div v-for="(item, index) in state.currentData.manage_img_list" :key="index" class="image-box">
                <img :src="item" @click="popPreview(state.currentData.manage_img_list, index)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomCon fixBottom" v-if="state.justForShow">
      <div class="bottom">
        <div class="cancelBtn" @click="cancelAction">取消申请</div>
        <div class="button" @click="agreeAction">修改材料</div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast, Dialog, ImagePreview } from 'vant'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      statusMap: {
        0: '待审批',
        1: '审批中',
        2: '已通过',
        3: '已拒绝',
        4: '已取消'
      },
      ZLBFLAG: isZLB(),
      show: false,
      currentData: {},
      justForShow: false
    })
    const initAction = () => {
      if (Route && Route.query && Route.query.justForShow) {
        state.justForShow = true
      } else {
        state.justForShow = false
      }
      Request.IndustryFarInfo({
        id: Route.query.id
      })
        .then((res) => {
          if (res && res.code == 0) {
            state.currentData = res.data
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    onMounted(() => {
      initAction()
    })
    const popPreview = (array, index) => {
      ImagePreview({
        images: array,
        startPosition: index,
        closeable: true
      })
    }
    const agreeAction = () => {
      Router.push({
        name: 'IndustryAllianceFarmerApply',
        query: {
          id: Route.query.id
        }
      })
    }
    const cancelAction = () => {
      Dialog.confirm({
        message: '确认取消申请？'
      })
        .then(() => {
          Request.IndustryErpCancel({
            id: Route.query.id
          })
            .then((res) => {
              if (res && res.code == 0) {
                Toast('取消成功')
                Router.go(-1)
              } else {
                Toast(res.msg)
              }
            })
            .catch((err) => {
              console.log('err', err)
            })
        })
        .catch(() => {
          // on cancel
        })
    }
    return {
      agreeAction,
      cancelAction,
      state,
      popPreview
    }
  }
}
</script>

<style lang="less" scoped>
.withPadding32 {
  box-sizing: border-box;
  padding: 32px;
  //   padding-left: 20px;
}
.industryAllApplyRecorDetail {
  box-sizing: border-box;
  padding-top: 24px;
}
.whiteBg {
  background-color: #fff;
}
.titleItem {
  width: 25%;
  color: #666;
  font-size: 28px;
  line-height: 44px;
}
.itemCon {
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-content: center;
}
.contextCon {
  color: #666;
  font-size: 28px;
  width: 70%;
  line-height: 44px;
}
.tableLeftCon {
  padding: 30px;
  box-sizing: border-box;
  padding-bottom: 100px;
}
.firstItem {
  padding: 32px 32px 0 32px;
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 24px;
}
.itemTop {
  padding-bottom: 24px;
}
.itemFir {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.statusCon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  width: 72%;
}
.static1 {
  color: #333;
  font-size: 28px;
}
.fixBottom {
  // bottom: constant(safe-area-inset-bottom);
  // bottom: env(safe-area-inset-bottom);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
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

.pic {
  p {
    font-size: 28px;
    color: #333;
  }
  .pic-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-bottom: 30px;
    .image-box {
      width: 200px;
      height: 200px;
      position: relative;
      margin: 0 20px 20px 0;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
<style lang="less">
.industryAllApplyRecorDetail {
  .dialogBeeTrainingCon {
    .van-dialog__content {
      padding: 30px;
      box-sizing: border-box;
    }
  }
}
</style>
