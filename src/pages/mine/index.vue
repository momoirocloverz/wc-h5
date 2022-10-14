<template>
  <div class="mineCon">
    <div class="avatarEntrance">
      <div class="avatarCon">
        <div class="avatarInner">
          <img class="avatar" @click="toEditInfo" :src="state.userInfo.avatar_image ? state.userInfo.avatar_image : 'https://img.hzanchu.com/acimg/bb0a8a029b7c183673a9d6c04fb17fd4.png'" />
          <span @click="toEditInfo" :class="[state.ZLBFitForOld ? 'spanOld' : '']">{{ state.isLogin ? state.userInfo.nickname : '注册/登录' }}</span>
        </div>
      </div>
    </div>
    <cell-group>
      <!-- <cell is-link @click="toMessage" v-if="!state.ZLBFLAG">
        <template #title>
          <van-icon name="comment-o" />
          <span
            class="custom-title"
            :class="[state.ZLBFitForOld ? 'customTitleOld' : '']"
            >消息通知</span
          >
        </template>
      </cell> -->
      <cell is-link @click="toMySubscribe">
        <template #title>
          <img class="titleImg" src="https://img.hzanchu.com/acimg/bc6f0a9029ea883bafc1418f0cd6cd1b.png" />
          <span class="custom-title" :class="[state.ZLBFitForOld ? 'customTitleOld' : '']">我的认种</span>
        </template>
      </cell>
      <cell is-link @click="toPreorder">
        <template #title>
          <img class="titleImg" src="https://img.hzanchu.com/acimg/4fd30cc5a5bcacbe5cf4b92671618309.png" />
          <span class="custom-title" :class="[state.ZLBFitForOld ? 'customTitleOld' : '']">我的预约</span>
        </template>
      </cell>
      <cell is-link @click="toJob">
        <template #title>
          <img class="titleImg" src="https://img.hzanchu.com/acimg/be9f321ed06305936e969c15e7b8c772.png" />
          <!-- <van-icon name="notes-o" /> -->
          <span class="custom-title" :class="[state.ZLBFitForOld ? 'customTitleOld' : '']">我的劳务</span>
        </template>
      </cell>
      <cell is-link @click="toArgiculture">
        <template #title>
          <img class="titleImg" src="https://img.hzanchu.com/acimg/b91f6925d65ba49a4a26601e714f1999.png" />
          <!-- <van-icon name="bullhorn-o" /> -->
          <span class="custom-title" :class="[state.ZLBFitForOld ? 'customTitleOld' : '']">我的买卖</span>
        </template>
      </cell>
      <cell is-link @click="toMyAsset">
        <template #title>
          <img class="titleImg" src="https://img.hzanchu.com/acimg/f5f385a3ae7212cf83cfbfade96c67f3.png" />
          <span class="custom-title" :class="[state.ZLBFitForOld ? 'customTitleOld' : '']">我的资产</span>
        </template>
      </cell>
      <cell is-link @click="toProposal">
        <template #title>
          <img class="titleImg" src="https://img.hzanchu.com/acimg/fc223ee7e1d5188a4ff30876c02a4922.png" />
          <!-- <van-icon name="envelop-o" /> -->
          <span class="custom-title" :class="[state.ZLBFitForOld ? 'customTitleOld' : '']">意见反馈</span>
        </template>
      </cell>
      <cell is-link @click="toSetting">
        <template #title>
          <img class="titleImg" src="https://img.hzanchu.com/acimg/7dae4ab8eaa800f53f3250a7c8a4ccd8.png" />
          <!-- <van-icon name="setting-o" /> -->
          <span class="custom-title" :class="[state.ZLBFitForOld ? 'customTitleOld' : '']">设置</span>
        </template>
      </cell>
    </cell-group>
  </div>
</template>

<script>
import Request from '@/service/request.js'
import { Cell, CellGroup, Icon, Toast } from 'vant'
import { reactive, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { isZLB, ZLBJump } from '@/util/index'
export default {
  name: 'submitcode',
  components: {
    Cell,
    CellGroup,
    Icon,
    Toast
  },
  setup() {
    const Router = useRouter()
    const state = reactive({
      userInfo: {},
      isLogin: false,
      ZLBFLAG: isZLB(),
      ZLBLOGINSTATUS: false,
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
    })
    onBeforeMount(() => {
      if (state.ZLBFLAG) {
        let bridge = Boolean(localStorage.getItem('token'))
        state.isLogin = bridge
        state.ZLBLOGINSTATUS = bridge
        if (bridge) {
          fetchUserInfo()
        }
      } else {
        state.isLogin = Boolean(localStorage.getItem('phone'))
        if (state.isLogin) {
          fetchUserInfo()
        } else {
          //
        }
      }
    })
    const fetchUserInfo = () => {
      Request.getUserInfo()
        .then((res) => {
          if (res && res.code === 0) {
            if (Number(res.data.nickname) && res.data.nickname.length == 11) {
              res.data.nickname = res.data.nickname.replace(res.data.nickname.substr(3, 4), '****')
            } else {
              res.data.nickname = res.data.nickname.replace(res.data.nickname.substr(0, 1), '*')
            }
            res.data.mobile = res.data.mobile.replace(res.data.mobile.substr(3, 4), '****')
            localStorage.setItem('simpleUserInfo', JSON.stringify(res.data))
            localStorage.setItem('zlbUserInfo', JSON.stringify(res.data))
            state.userInfo = res.data
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const toEditInfo = () => {
      if (state.isLogin) {
        Router.push({
          name: 'mineAvatar'
        })
      } else {
        if (state.ZLBFLAG) {
          ZLBJump()
        } else {
          Router.push({
            name: 'Index'
          })
        }
      }
    }
    const toArgiculture = () => {
      if (state.isLogin) {
        Router.push({
          name: 'mineAgriculture'
        })
      } else {
        Toast('请登录')
      }
    }
    const toJob = () => {
      if (state.isLogin) {
        Router.push({
          name: 'mineJob'
        })
      } else {
        Toast('请登录')
      }
    }
    const toMyAsset = () => {
      if (state.isLogin) {
        Router.push({
          name: 'mineAsset'
        })
      } else {
        Toast('请登录')
      }
    }
    const toMySubscribe = () => {
      if (state.isLogin) {
        Router.push({
          name: 'mineSubscribe'
        })
      } else {
        Toast('请登录')
      }
    }
    const toPreorder = () => {
      if (state.isLogin) {
        Router.push({
          name: 'minePre'
        })
      } else {
        Toast('请登录')
      }
    }
    const toSetting = () => {
      if (state.isLogin) {
        Router.push({
          name: 'mineSetting'
        })
      } else {
        Toast('请登录')
      }
    }
    const toProposal = () => {
      Router.push({
        name: 'Suggestion'
      })
    }

    const toMessage = () => {
      Toast('即将开放，敬请期待')
    }
    return {
      toMySubscribe,
      toPreorder,
      state,
      fetchUserInfo,
      toEditInfo,
      toArgiculture,
      toJob,
      toSetting,
      toProposal,
      toMessage,
      toMyAsset
    }
  }
}
</script>
<style lang="less" scoped>
@thirtyTwo: 32px;
.mineCon {
  background-color: #fff;
  .custom-title {
    font-size: @thirtyTwo;
    color: #4d4d4d;
    font-weight: 500;
  }
  .customTitleOld {
    font-size: 50px;
    font-weight: 800;
  }
  .titleImg {
    width: 40px;
    // margin-top: -5px;
    margin-right: 25px;
    margin-left: 17px;
  }
  .avatarEntrance {
    padding: 30px;
    box-sizing: border-box;
    .avatarCon {
      display: flex;
      justify-content: flex-start;
      align-content: center;
      align-items: center;
      height: 250px;
      background-color: #fab394;
      border-radius: 10px;
      .avatarInner {
        padding-left: 56px;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;
        align-content: center;
        align-items: center;
      }
      .spanOld {
        font-size: 50px;
        font-weight: 800;
      }
    }
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50px;
      background-color: #fff;
    }
    span {
      color: #fff;
      margin-left: 30px;
      font-size: 32px;
      font-weight: 500;
    }
  }
  .van-icon {
    font-size: 40px;
    margin-right: 16px;
  }
}
</style>
<style lang="less">
.mineCon {
  .van-cell__title {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
  }
  .van-hairline--top-bottom::after,
  .van-hairline-unset--top-bottom::after {
    border: none;
  }
}
</style>
