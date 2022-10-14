<template>
  <div class="groupIncreaseSelectCon">
    <template v-for="(item, index) in state.list" :key="index">
      <div
        class="itemCon"
        @click="checkTarget(item)"
        :class="[state.ZLBFLAG ? 'fixItemCon' : '']"
      >
        <img class="mainImg" :src="item.img" />
        <div class="itemTitle" :class="['color' + index]">{{ item.title }}</div>
        <div class="itemDesc" :class="['color' + index]">{{ item.next }}</div>
      </div>
    </template>
  </div>
</template>
<script>
import { useRouter, useRoute } from 'vue-router'
import { reactive, onMounted } from 'vue'
import { Toast } from 'vant'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      drop_status: 0,
      list: [
        {
          title: '我的申报',
          next: '查看申报详情',
          name: 'zhongfengtoGroupMyDeclaration',
          img: 'https://img.hzanchu.com/acimg/abd25186358bbfb6e741ccc21ae7cc32.png',
        },
        {
          title: '我的收益',
          next: '查看收益详情',
          name: 'zhongfengtoGroupMyEarning',
          img: 'https://img.hzanchu.com/acimg/f84fd2185f91ed82b8f17f435f359ae6.png',
        },
        {
          title: '我要退出',
          next: '退出抱团增收项目',
          name: 'zhongfengtoGroupToQuit',
          img: 'https://img.hzanchu.com/acimg/c31341e90b300a0b2ac1df09e4b43f35.png',
        },
      ],
    })
    onMounted(() => {
      fetchGroupInfo()
    })
    const fetchGroupInfo = () => {
      Request.planIncomeInfo({})
        .then((res) => {
          if (res && res.code === 0) {
            if (!res.data.id) {
            } else {
              state.drop_status = res.data.drop_status
            }
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const checkTarget = (item) => {
      if (item.name == 'zhongfengtoGroupToQuit') {
        if (state.drop_status) {
          if (state.drop_status == 3) {
            if (state.account_status == 4) {
              Router.push({
                name: 'zhongfengtoGroupAuditRes',
              })
            } else {
              Router.push({
                name: item.name,
              })
            }
          } else {
            Router.push({
              name: 'zhongfengtoGroupAuditRes',
            })
          }
        } else {
          Router.push({
            name: item.name,
          })
        }
      } else {
        Router.push({
          name: item.name,
        })
      }
    }
    return {
      state,
      checkTarget,
    }
  },
}
</script>

<style scoped lang="less">
.groupIncreaseSelectCon {
  background-color: #fff;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 18px;
  padding-bottom: 0;
  .itemCon {
    position: relative;
    height: 232px;
    margin-bottom: 10px;
  }
  .fixItemCon {
    height: 15vh;
    margin-bottom: 2vh;
  }
  .color0 {
    color: #f7866c;
  }
  .color1 {
    color: #06b99b;
  }
  .color2 {
    color: #39a4d9;
  }
  .itemTitle {
    font-size: 38px;
    font-weight: 700;
    letter-spacing: 2px;
    position: absolute;
    top: 68px;
    left: 96px;
  }
  .itemDesc {
    font-size: 28px;
    letter-spacing: 1px;
    position: absolute;
    top: 134px;
    left: 96px;
  }
  .mainImg {
    width: 100%;
    position: absolute;
  }
  .title {
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    color: #333;
    margin-top: 34px;
    margin-bottom: 20px;
  }
}
</style>
