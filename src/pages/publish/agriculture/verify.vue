<template>
  <div class="agricultureVerifyCon">
    <div v-if="!state.ZLBFLAG">
      <div class="infoText" :class="[state.ZLBFitForOld ? 'infoTextOld' : '']">
        请填写您的个人信息
      </div>
      <cell-group>
        <field
          v-model="state.name"
          label="姓名"
          placeholder="请输入姓名"
          input-align="right"
          :class="[state.ZLBFitForOld ? 'fieldOld' : '']"
        />
        <field
          v-model="state.id"
          label="身份证号"
          placeholder="请输入身份证号"
          input-align="right"
          :class="[state.ZLBFitForOld ? 'fieldOld' : '']"
        />
      </cell-group>
      <div class="buttonCon">
        <div
          class="fakeBtn"
          @click="action"
          :class="[
            !state.id || !state.name ? '' : 'ableBtn',
            state.ZLBFitForOld ? 'fakeBtnOld' : '',
          ]"
        >
          提 交
        </div>
      </div>
    </div>
    <div v-else :class="['center', state.ZLBFitForOld ? 'fakeBtnOld' : '']">
      自动加载中
    </div>
    <div
      class="bottomText"
      :class="[state.ZLBFitForOld ? 'bottomTextOld' : '']"
    >
      如有疑问，请联系管理员18158512049
    </div>
    <Overlay :show="state.showMask" class="cusOverlay">
      <div class="block">
        <Loading color="#ff844e" text-color="#ff844e" vertical size="24px"
          >加载中...</Loading
        >
      </div>
    </Overlay>
  </div>
</template>
<script>
import Request from '@/service/request.js'
import { reactive, onMounted } from 'vue'
import { CellGroup, Field, Toast, Overlay, Loading } from 'vant'
import { useRouter } from 'vue-router'
import { isZLB } from '@/util/index'
export default {
  components: {
    CellGroup,
    Field,
    Overlay,
    Loading,
  },
  setup() {
    const state = reactive({
      name: '',
      id: '',
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
      showMask: false,
    })
    const Router = useRouter()
    let idCardRge =
      /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
    const ZLBautoLogin = () => {
      if (state.ZLBFLAG) {
        state.showMask = true
        let currentInfo = JSON.parse(localStorage.getItem('zlbUserInfo'))

        Request.userUpdate({
          id_card: currentInfo.idnum,
          real_name: currentInfo.username,
        })
          .then((res) => {
            if (res && res.code === 0) {
              localStorage.removeItem('needTwiceAuth')
              Router.push({
                name: 'agricultureList',
              })
              state.showMask = false
            } else {
              Toast(res.msg)
              state.showMask = false
            }
          })
          .catch((err) => {
            console.log(err)
            state.showMask = false
          })
      }
    }
    onMounted(() => {
      ZLBautoLogin()
    })

    const action = () => {
      const track = !state.id || !state.name
      let idCheck = idCardRge.test(state.id)
      if (track) {
        return
      } else {
        if (idCheck) {
          Request.userUpdate({
            id_card: state.id,
            real_name: state.name,
          })
            .then((res) => {
              if (res && res.code === 0) {
                localStorage.removeItem('needTwiceAuth')
                Router.push({
                  name: 'agricultureList',
                })
              } else {
                Toast(res.msg)
              }
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          return Toast('请输入正确的身份证号')
        }
      }
    }
    return {
      state,
      action,
    }
  },
}
</script>
<style lang="less" scoped>
.agricultureVerifyCon {
  .center {
    text-align: center;
    padding-top: 100px;
    box-sizing: border-box;
    font-size: 30px;
  }
  position: relative;
  height: 100vh;
  .infoText {
    height: 54px;
    font-size: 24px;
    line-height: 54px;
    font-weight: 500;
    text-align: left;
    color: #4d4d4d;
    box-sizing: border-box;
    padding-left: 30px;
  }
  .infoTextOld {
    font-size: 50px;
    font-weight: 800;
  }
  .bottomText {
    position: absolute;
    width: 100%;
    text-align: center;
    font-size: 24px;
    font-weight: 500;
    color: #808080;
    bottom: 34px;
  }
  .bottomTextOld {
    font-size: 50px;
    font-weight: 800;
  }
  .buttonCon {
    padding-left: 100px;
    padding-right: 100px;
    box-sizing: border-box;
    margin-top: 290px;
  }
  .fakeBtn {
    font-size: 32px;
    height: 70px;
    border-radius: 35px;
    background-color: #d1d1d1;
    text-align: center;
    line-height: 70px;
    color: #fff;
  }
  .fakeBtnOld {
    font-size: 45px;
  }
  .ableBtn {
    background: linear-gradient(to right, #ff844e 0%, #fe6d56 100%);
  }
}
</style>
<style lang="less">
.agricultureVerifyCon {
  .cusOverlay {
    background-color: rgba(0, 0, 0, 0.2);
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .fieldOld {
    .van-cell__title {
      font-size: 50px;
      line-height: 52px;
      font-weight: 800;
    }
    .van-field__body {
      input {
        font-size: 50px;
        line-height: 52px;
        font-weight: 800;
      }
    }
  }
}
</style>
