<template>
  <div class="editNameCon">
    <div>
      <field
        label="昵称"
        v-model.trim="state.nickName"
        clearable
        placeholder="请填写昵称"
        maxlength="20"
        :class="[state.ZLBFitForOld ? 'cellTitle' : '']"
      />
    </div>
    <div class="buttonCon">
      <div
        class="fakeBtn"
        @click="action"
        :class="[
          state.nickName ? 'ableBtn' : '',
          state.ZLBFitForOld ? 'fakeBtnOld' : '',
        ]"
      >
        保 存
      </div>
    </div>
  </div>
</template>
<script>
import Request from '@/service/request.js'
import { Field, Toast } from 'vant'
import { reactive, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { isZLB } from '@/util/index'
export default {
  components: {
    Field,
    Toast,
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      nickName: '',
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
    })
    onBeforeMount(() => {
      init()
    })
    const init = () => {
      const nickName = Route.query.nickName
      if (nickName) {
        state.nickName = nickName
      }
    }
    const fetchUserInfo = () => {
      Request.getUserInfo()
        .then((res) => {
          if (res && res.code === 0) {
            localStorage.setItem('simpleUserInfo', JSON.stringify(res.data))
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const action = () => {
      if (state.nickName) {
        let data = {
          nickname: state.nickName,
        }
        Request.userUpdate(data)
          .then((res) => {
            console.log('res', res)
            if (res && res.code === 0) {
              Toast('昵称修改成功')
              localStorage.removeItem('simpleUserInfo')
              setTimeout(() => {
                Router.go(-1)
              }, 200)
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        Toast('请填写昵称')
      }
    }
    return {
      state,
      init,
      fetchUserInfo,
      action,
    }
  },
}
</script>
<style lang="less" scoped>
.editNameCon {
  position: relative;
  .buttonCon {
    padding-left: 100px;
    padding-right: 100px;
    box-sizing: border-box;
    margin-top: 50px;
    margin-bottom: 50px;
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
.editNameCon {
  .cellTitle {
    .van-cell__title {
      font-size: 50px;
      font-weight: 800;
    }
    .van-field__control {
      font-size: 50px;
      font-weight: 800;
    }
  }
}
</style>
