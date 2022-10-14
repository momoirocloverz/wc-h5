<template>
  <div class="homeMaster">
    <router-view />
    <div class="nav-bottom fixBottom">
      <div v-for="(item, i) in list" :key="i" @click="toPage(item)">
        <img :src="cur_path === item.router ? item.icon_s : item.icon" alt />
        <p :style="{ color: cur_path === item.router ? '#FE9E17' : '#333' }" :class="[ZLBFitForOld ? 'pOlder' : '']">
          {{ item.title }}
        </p>
      </div>
    </div>
    <div class="dialogMask" v-show="showDialog">
      <div class="dialogWhite">
        <div class="dialogTopCon">
          <van-icon name="cross" @click="shutDialog" />
        </div>
        <div class="dialogTitle">请选择你要随访的农户</div>
        <div class="userListCon">
          <radio-group v-model="checked">
            <template v-for="(item, index) in userList" :key="index">
              <radio class="customRadio" checked-color="#FF844E" :name="item.ID">{{ item.TName }}</radio>
            </template>
          </radio-group>
        </div>
        <div class="confirmPopBtn" @click="confirmAction">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Request from '@/service/request.js'
import { Icon, RadioGroup, Radio, Toast } from 'vant'
import { isZLB } from '@/util/index'
export default {
  components: {
    Icon,
    RadioGroup,
    Radio
  },
  data() {
    return {
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      ZLBFLAG: isZLB(),
      userList: [{ ID: 'none', TName: '暂不选择', LB: '4' }],
      cur_path: '',
      checked: '',
      list: [
        {
          icon: 'https://img.hzanchu.com/acimg/f126f53383c58913c38be4b98bd3b667.png ',
          icon_s: 'https://img.hzanchu.com/acimg/f0da2829962a5e7f9c1b6d200752870f.png ',
          title: '首页',
          router: '/home'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/226a0ffaf7b87b40125d893b1e6088bc.png ',
          icon_s: 'https://img.hzanchu.com/acimg/20d885a4f31e6d5ce184dceb0caa0799.png ',
          title: '精准帮扶',
          router: '/tabList',
          query: {
            i: 0
          }
        },
        {
          icon: 'https://img.hzanchu.com/acimg/18d0eb6f710a676989017e67924fd279.png ',
          icon_s: 'https://img.hzanchu.com/acimg/edfb7008d4f3bfe2c16d5b5abaafbc8a.png ',
          title: '信息动态',
          router: '/information'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/9c042496442c6288d6da3379254c2168.png ',
          icon_s: 'https://img.hzanchu.com/acimg/8984721d38976ea13afe46336d300d84.png ',
          title: '我的',
          router: '/mine'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getUserType: 'getUserType',
      showDialog: 'getGlobalDialog'
    })
  },
  watch: {
    $route(to, from) {
      this.cur_path = to.path
    },
    getUserType(nval, val) {
      //   console.log(nval)
      if (nval) {
        if (nval == 1 || nval == 2 || nval == 3) {
          this.switchToFourItem()
        } else {
          this.switchToThreeItem()
        }
      }
    }
  },
  beforeMount() {
    let type = this.getUserType
    // console.log('home初始化', type)
    if (type) {
      if (type == 1 || type == 2 || type == 3) {
        this.switchToFourItem()
      } else {
        this.switchToThreeItem()
      }
    } else {
      this.switchToFourItem()
    }
    this.cur_path = this.$route.path
    let info =
      localStorage.getItem('currentUserInfo') && JSON.parse(localStorage.getItem('currentUserInfo')).farmer_info && JSON.parse(localStorage.getItem('currentUserInfo')).farmer_info.related_user_list
        ? JSON.parse(localStorage.getItem('currentUserInfo')).farmer_info.related_user_list.concat({
            ID: 'none',
            TName: '暂不选择',
            LB: '4'
          })
        : [{ ID: 'none', TName: '暂不选择', LB: '4' }]
    this.userList = info
  },
  methods: {
    switchToThreeItem() {
      this.list = [
        {
          icon: 'https://img.hzanchu.com/acimg/f126f53383c58913c38be4b98bd3b667.png ',
          icon_s: 'https://img.hzanchu.com/acimg/f0da2829962a5e7f9c1b6d200752870f.png ',
          title: '首页',
          router: '/home'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/18d0eb6f710a676989017e67924fd279.png ',
          icon_s: 'https://img.hzanchu.com/acimg/edfb7008d4f3bfe2c16d5b5abaafbc8a.png ',
          title: '信息动态',
          router: '/information'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/9c042496442c6288d6da3379254c2168.png ',
          icon_s: 'https://img.hzanchu.com/acimg/8984721d38976ea13afe46336d300d84.png ',
          title: '我的',
          router: '/mine'
        }
      ]
    },
    switchToFourItem() {
      this.list = [
        {
          icon: 'https://img.hzanchu.com/acimg/f126f53383c58913c38be4b98bd3b667.png ',
          icon_s: 'https://img.hzanchu.com/acimg/f0da2829962a5e7f9c1b6d200752870f.png ',
          title: '首页',
          router: '/home'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/18d0eb6f710a676989017e67924fd279.png ',
          icon_s: 'https://img.hzanchu.com/acimg/edfb7008d4f3bfe2c16d5b5abaafbc8a.png ',
          title: '信息动态',
          router: '/information'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/9c042496442c6288d6da3379254c2168.png ',
          icon_s: 'https://img.hzanchu.com/acimg/8984721d38976ea13afe46336d300d84.png ',
          title: '我的',
          router: '/mine'
        }
      ]
    },
    toPage(item) {
      sessionStorage.setItem('homeInformationIndex', '1')
      if (item.query) {
        // let isLogin = Boolean(localStorage.getItem("phone") && sessionStorage.getItem("uid"))
        let isLogin = Boolean(localStorage.getItem('phone'))
        if (isLogin) {
          this.$router.replace({
            path: item.router,
            query: item.query
          })
        } else {
          this.$router.push({ path: '/index' })
        }
      } else {
        this.$router.replace(item.router)
      }
      this.cur_path = item.router
    },
    confirmAction() {
      if (!this.checked) {
        Toast('请选择你要随访的农户')
      } else {
        let track = this.userList.find((ele) => {
          return ele.ID == this.checked
        })
        localStorage.setItem('hasChosen', '1')
        if (this.checked == 'none') {
          this.$store.commit('setGlobalDialog', false)
          //   localStorage.setItem('type', track.LB)
          //   this.$store.commit('setUserType', track.LB)
          localStorage.setItem('nochoiceButIcon', '1')
        } else {
          this.$store.commit('setGlobalDialog', false)
          localStorage.removeItem('nochoiceButIcon')
          localStorage.setItem('chossenGuy', this.checked)
          Request.userFarmerInfo({
            mobile: localStorage.getItem('phone'),
            id: this.checked,
            type: localStorage.getItem('type')
          })
            .then((res) => {
              let currentInfo = localStorage.getItem('currentUserInfo') ? JSON.parse(localStorage.getItem('currentUserInfo')) : ''
              if (currentInfo) {
                currentInfo.farmer_info.basic = res.data.basic
                currentInfo.farmer_info.btk_list = res.data.btk_list
                currentInfo.farmer_info.visit_family = res.data.visit_family
                localStorage.setItem('currentUserInfo', JSON.stringify(currentInfo))
              }
              this.$router.push({
                path: '/tabList',
                query: {
                  i: 0
                }
              })
            })
            .catch((err) => {
              console.log('err', err)
            })
        }
      }
    },
    shutDialog() {
      localStorage.setItem('nochoiceButIcon', '1')
      //   localStorage.setItem('type', 4)
      //   this.$store.commit('setUserType', 4)
      localStorage.setItem('hasChosen', '1')
      this.$store.commit('setGlobalDialog', false)
    }
  }
}
</script>
<style lang="less" scoped>
@twentyTwo: 22px;
.confirmPopBtn {
  width: 100%;
  height: 64px;
  background: #ff844e;
  border-radius: 0 0 12px 12px;
  text-align: center;
  line-height: 64px;
  font-size: 32px;
  font-weight: 500;
  color: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
}
.dialogMask {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  .dialogWhite {
    border-radius: 10px;
    background-color: #fff;
    width: 538px;
    height: 664px;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    padding-top: 20px;
    box-sizing: border-box;
    .dialogTopCon {
      text-align: right;
      font-size: 40px;
      box-sizing: border-box;
      padding-right: 20px;
    }
    .dialogTitle {
      font-size: 32px;
      font-weight: 500;
      text-align: center;
      color: #333;
      margin-top: 46px;
      margin-bottom: 46px;
    }
    .userListCon {
      padding-left: 112px;
      padding-right: 112px;
      box-sizing: border-box;
      overflow-y: scroll;
      height: 370px;
    }
  }
}
.nav-bottom {
  height: 96px;
  width: 100%;
  background: #ffffff;
  box-shadow: 1px 5px 51px 10px rgba(7, 8, 7, 0.1);
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    overflow: hidden;
    text-align: center;
    flex: 1;
    img {
      height: 46px;
    }
    p {
      font-size: @twentyTwo;
      font-weight: 500;
      margin-block-start: 0;
      margin-block-end: 0;
    }
    .pOlder {
      font-size: 37px;
      font-weight: 800;
    }
  }
}
.customRadio {
  flex-direction: row-reverse;
  justify-content: space-between;
  font-size: 30px;
  font-weight: 500;
  color: #333;
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f2f2f2;
  box-sizing: border-box;
  &:first-child {
    border-top: 1px solid #f2f2f2;
  }
}
.fixBottom {
  // bottom: constant(safe-area-inset-bottom);
  // bottom: env(safe-area-inset-bottom);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.homeMaster {
  padding-bottom: 40px;
  box-sizing: border-box;
}
</style>
