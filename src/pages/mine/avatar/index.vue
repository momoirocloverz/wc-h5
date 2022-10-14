<template>
  <div class="mineAvatarCon">
    <!-- @click="toAvatar" -->
    <cell-group>
      <cell  class="firstLine" title="头像" :class="[state.ZLBFitForOld ? 'firstLineOld' : '']">
        <template #default>
          <img class="avatarImg" :src="state.userInfo.avatar_image ? state.userInfo.avatar_image : 'https://img.hzanchu.com/acimg/bb0a8a029b7c183673a9d6c04fb17fd4.png'" />
        </template>
      </cell>
      <cell title="昵称" is-link @click="editName" :class="[state.ZLBFitForOld ? 'firstLineOld' : '']">
        <template #default>
          <span class="custom-title" :class="[state.ZLBFitForOld ? 'customTitleOld' : '']">
            {{ state.userInfo.nickname ? state.userInfo.nickname : '-' }}
          </span>
        </template>
      </cell>
      <cell title="姓名" :class="[state.ZLBFitForOld ? 'firstLineOld' : '']">
        <template #default>
          <span class="custom-title" :class="[state.ZLBFitForOld ? 'customTitleOld' : '']" v-if="state.ZLBFLAG">
            {{ state.userInfo.real_name ? state.userInfo.real_name.replace(state.userInfo.real_name.substr(0, 1), '*') : '-' }}
          </span>
          <span class="custom-title" v-else>
            {{ state.userInfo.real_name ? state.userInfo.real_name : '-' }}
          </span>
        </template>
      </cell>
      <cell title="身份证号" :class="[state.ZLBFitForOld ? 'firstLineOld' : '']">
        <template #default>
          <span class="custom-title" :class="[state.ZLBFitForOld ? 'customTitleOld' : '']">
            {{ state.userInfo.id_card ? state.userInfo.id_card : '-' }}
          </span>
        </template>
      </cell>
      <cell title="手机号" :class="[state.ZLBFitForOld ? 'firstLineOld' : '']">
        <template #default>
          <span class="custom-title" :class="[state.ZLBFitForOld ? 'customTitleOld' : '']">
            {{ state.userInfo.mobile ? state.userInfo.mobile : '-' }}
          </span>
        </template>
      </cell>
    </cell-group>
    <div class="bottomText" :class="[state.ZLBFitForOld ? 'bottomTextOld' : '']">如需修改个人信息，请联系管理员，电话18158512049</div>
  </div>
</template>
<script>
import Request from '@/service/request.js'
import { Cell, CellGroup, Icon, Toast } from 'vant'
import { reactive, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { isZLB } from '@/util/index'
export default {
  components: {
    Cell,
    CellGroup,
    Icon
  },
  setup() {
    const Store = useStore()
    const Router = useRouter()
    const state = reactive({
      userInfo: {},
      ZLBFLAG: isZLB(),
      ZLBLOGINSTATUS: false,
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
    })
    onBeforeMount(() => {
      let info = localStorage.getItem('simpleUserInfo') ? JSON.parse(localStorage.getItem('simpleUserInfo')) : ''
      if (info) {
        state.userInfo = info
      } else {
        fetchUserInfo()
      }
      fetchLogin()
    })
    const fetchLogin = () => {
      if (state.ZLBFLAG) {
        let bridge = Boolean(localStorage.getItem('token'))
        state.ZLBLOGINSTATUS = bridge
      }
    }
    const fetchUserInfo = () => {
      Request.getUserInfo()
        .then((res) => {
          if (res && res.code === 0) {
            localStorage.setItem('simpleUserInfo', JSON.stringify(res.data))
            localStorage.setItem('zlbUserInfo', JSON.stringify(res.data))
            state.userInfo = res.data
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const toAvatar = () => {
      let loginStatus = Boolean(localStorage.getItem('phone'))
      if (loginStatus || state.ZLBLOGINSTATUS) {
        if (state.userInfo.avatar_image) {
          Router.push({
            name: 'editAvatar',
            query: {
              avatar_image: state.userInfo.avatar_image,
              id: state.userInfo.avatar_id
            }
          })
        } else {
          Router.push({
            name: 'editAvatar'
          })
        }
      } else {
        Toast('请重新登录')
      }
    }
    const editName = () => {
      let loginStatus = Boolean(localStorage.getItem('phone'))
      if (loginStatus || state.ZLBLOGINSTATUS) {
        Router.push({
          name: 'editName',
          query: {
            nickName: state.userInfo.nickname
          }
        })
      } else {
        Toast('请重新登录')
      }
    }
    return {
      state,
      fetchUserInfo,
      toAvatar,
      editName
    }
  }
}
</script>
<style lang="less" scoped>
.buttonCon {
  padding-left: 100px;
  padding-right: 100px;
  box-sizing: border-box;
  margin-top: 180px;
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
.ableBtn {
  background: linear-gradient(to right, #ff844e 0%, #fe6d56 100%);
}
.mineAvatarCon {
  position: relative;
  height: 100vh;
  .firstLine {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
  }
  .avatarImg {
    width: 70px;
    height: 70px;
    background-color: #fff;
    border-radius: 35px;
  }
  @twentyFour: 24px;
  .bottomText {
    position: absolute;
    width: 100%;
    text-align: center;
    font-size: @twentyFour;
    font-weight: 500;
    color: #808080;
    bottom: 34px;
  }
  .bottomTextOld {
    font-size: 45px;
    font-weight: 800;
  }
}
.customTitleOld {
  font-size: 45px;
  font-weight: 800;
}
</style>
<style lang="less">
.mineAvatarCon {
  .firstLine {
    .van-cell__value {
      display: flex;
      justify-content: flex-end;
      align-content: center;
      align-items: center;
    }
  }
  .firstLineOld {
    .van-cell__title {
      font-size: 50px;
      font-weight: 800;
    }
  }
}
</style>
