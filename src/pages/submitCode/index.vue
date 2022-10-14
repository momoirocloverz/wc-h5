<template>
  <div class="outer submitHome">
    <Banner></Banner>
    <div class="horizontal-container" v-if="!state.ZLBFLAG || state.ZLBTRICKTRIGGER" key="1">
      <div class="scroll-wrapper" ref="scrollCon">
        <div class="scroll-content" :class="[state.ZLBFLAG ? 'resetLeft' : '']">
          <div class="flexCon" :class="[state.ZLBFLAG ? 'hundredPercent' : 'initwidth']">
            <div class="scroll-item" v-for="(item, i) in enterList" :key="i" v-show="item.show == '1'" @click="toDetail(item)">
              <img :src="item.icon" alt />
              <div class="itemName" :class="[state.ZLBFitForOld ? 'itemNameOlder' : '']">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="horizontalContainerForOld" key="2">
      <div class="scrollItem" :class="[state.ZLBFitForOld ? 'scrollItemOlder' : '']" v-for="(item, i) in oldEnterList" :key="i" v-show="item.show == '1'" @click="toDetail(item)">
        <img :class="[state.ZLBFitForOld ? 'scrollItemImgOlder' : '']" :src="item.icon" alt />
        <div class="itemName" :class="[state.ZLBFitForOld ? 'itemNameOlder' : '']">
          {{ item.name }}
        </div>
      </div>
    </div>
    <!-- <div class="barBase">
      <div class="littleBarCon">
        <div class="barItem"
             :style="{ marginLeft: state.dynamicDistance +'px',width:state.dynaminWidth + 'px' }"></div>
      </div>
        </div>-->
    <!-- <div v-if="!state.ZLBFLAG || state.ZLBTRICKTRIGGER" key="3">
      <div class="publishOuterCon">
        <img src="https://img.hzanchu.com/acimg/481e586298d05e86370b65e42d1b5ca7.png" @click="toPublicity" />
      </div>
    </div>
    <div v-else key="4">
      <div class="publishOuterOlderCon">
        <img src="https://img.hzanchu.com/acimg/481e586298d05e86370b65e42d1b5ca7.png" @click="toPublicity" />
      </div>
    </div> -->
    <div class="twinCon">
      <img src="https://img.hzanchu.com/acimg/d0509b12a83a90e28642040dd8ade59e.png" @click="toBee" />
      <img src="https://img.hzanchu.com/acimg/b3386f002578548eaa5a7b07a7dea416.png" @click="toGroup" />
    </div>
    <div v-if="!state.ZLBFitForOld" key="5">
      <div class="policy">
        <Policy></Policy>
      </div>
    </div>
    <div v-else key="6">
      <div class="policy">
        <Policy :ZLBFitForOld="state.ZLBFitForOld"></Policy>
      </div>
    </div>
    <!-- <div v-if="!state.ZLBFitForOld" key="7">
      <div class="message">
        <div class="messageTitle">精选推荐</div>
        <MIxList></MIxList>
      </div>
    </div>
    <div v-else key="8">
      <div class="message">
        <div class="messageTitleOld">精选推荐</div>
        <MIxList :ZLBFitForOld="state.ZLBFitForOld"></MIxList>
      </div>
    </div> -->
    <div class="serviceCon" v-if="state.ZLBFLAG">
      <div class="service" :class="[state.ZLBFitForOld ? 'serviceOld' : '']">本服务由浙江政务服务网、文成县农业农村局提供。</div>
      <div class="service" :class="[state.ZLBFitForOld ? 'serviceOld' : '']">
        服务咨询热线：
        <span @click="toCall">0577-59029723</span>
      </div>
    </div>
    <Overlay :show="state.showMask" class="cusOverlay">
      <div class="block">
        <Loading color="#ff844e" text-color="#ff844e" vertical size="24px">加载中...</Loading>
      </div>
    </Overlay>
  </div>
</template>
<script>
// 身份标记 1:农户 2:干部 3:医生 4:大户
import Help from '@/components/help.vue'
import Policy from '@/components/policy.vue'
import MIxList from '@/components/mixList.vue'
import BScroll from 'better-scroll'
import { ref, onMounted, reactive } from 'vue'
import Banner from '@/components/banner.vue'
import InformationList from '@/components/informationList.vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Request from '@/service/request.js'
import { Toast, Overlay, Loading } from 'vant'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
export default {
  name: 'home',
  components: {
    Banner,
    InformationList,
    Help,
    MIxList,
    Policy,
    Overlay,
    Loading
  },
  setup() {
    let scrollCon = ref(null)
    const router = useRouter()
    const route = useRoute()
    const Store = useStore()
    const state = reactive({
      showMask: false,
      dynamicDistance: 0,
      dynaminWidth: 1,
      showDialog: true,
      //       ZLBFLAG: true,
      //   ZLBFitForOld: true,
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      ZLBTRICKTRIGGER: false //false是为审核阶段准备
    })
    const oldEnterList = ref([])
    const enterList = ref([])
    const initAction = () => {
      checkType()
      fetchUserType()
    }
    const fetchUserType = () => {
      const sUserAgent = window.navigator.userAgent.toLowerCase()
      const bIsDtDreamApp = sUserAgent.indexOf('dtdreamweb') > -1 // 浙里办APP
      const bIsAlipayMini = sUserAgent.indexOf('miniprogram') > -1 && sUserAgent.indexOf('alipay') > -1
      const bIsWxMini = sUserAgent.includes('miniprogram/wx') || window.__wxjs_environment === 'miniprogram' // 微信小程序
      localStorage.removeItem('globalLegalPerson')
      if (bIsAlipayMini) {
        normalRequest()
      } else if (bIsDtDreamApp) {
        ZWJSBridge.getUserType({})
          .then((res) => {
            if (res.userType == 2) {
              localStorage.setItem('globalLegalPerson', '1')
              legalRequest()
            } else {
              normalRequest()
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else if (bIsWxMini) {
        //
        weixinRequest()
      }
    }
    const legalRequest = () => {
      if (state.ZLBFLAG) {
        fetchTrigger()
        if (route.query.token) {
          state.showMask = true
          localStorage.setItem('token', route.query.token)
          //       localStorage.setItem('zlbUserInfo', JSON.stringify(shazam.data.zhelb_user_info))
          //       localStorage.setItem('simpleUserInfo', JSON.stringify(shazam.data))
          //       let data = {
          //         time: Date.now(),
          //         ...shazam.data
          //       }
          //       if (data.type != 1 && data.is_check == 0) {
          //         localStorage.setItem('needTwiceAuth', '1')
          //       }
          //       localStorage.setItem('currentUserInfo', JSON.stringify(data))
          //       localStorage.setItem('type', shazam.data.type)
          //       Store.commit('setUserType', shazam.data.type)
          //       checkType()
          //       state.showMask = false
          apiUserInfo()
        }
      }
    }
    const normalRequest = () => {
      fetchTrigger()
      ticketRequest()
    }
    const weiXinTicket = () => {
      state.showMask = true
      let globalToken = localStorage.getItem('token')
      if (route.query.ticket) {
        if (globalToken) {
          state.showMask = false
        } else {
          Request.ssoToken({
            ticketId: route.query.ticket,
            appId: '2001885902'
          })
            .then((res) => {
              if (res && res.code == 0) {
                if (res.data.success) {
                  Request.ssoLogin({
                    token: res.data.data.accessToken
                  })
                    .then((subres) => {
                      console.log('subres', subres)
                      if (subres && subres.code == 0) {
                        localStorage.setItem('token', subres.data.token)
                        apiUserInfo()
                      } else {
                        Toast(subres.msg)
                        state.showMask = false
                      }
                    })
                    .catch((suberr) => {
                      state.showMask = false
                      console.log('suberr', suberr)
                    })
                }
              } else {
                Toast(res.msg)
                state.showMask = false
              }
            })
            .catch((err) => {
              state.showMask = false
              Toast(err)
              console.log('err', err)
            })
        }
      } else {
        state.showMask = false
      }
    }
    const weixinRequest = () => {
      fetchTrigger()
      weiXinTicket()
    }
    const apiUserInfo = () => {
      Request.getUserInfo()
        .then((res) => {
          if (res && res.code === 0) {
            localStorage.setItem('zlbUserInfo', JSON.stringify(res.data.zhelb_user_info))
            localStorage.setItem('simpleUserInfo', JSON.stringify(res.data))
            let data = {
              time: Date.now(),
              ...res.data
            }
            if (data.type != 1 && data.is_check == 0) {
              localStorage.setItem('needTwiceAuth', '1')
            }
            localStorage.setItem('currentUserInfo', JSON.stringify(data))
            localStorage.setItem('type', res.data.type)
            Store.commit('setUserType', res.data.type)
            checkType()
            state.showMask = false
          } else {
            Toast(res.msg)
            state.showMask = false
          }
        })
        .catch((err) => {
          console.log('e111rr', err)
          state.showMask = false
        })
    }
    const ticketRequest = () => {
      state.showMask = true
      if (state.ZLBFLAG) {
        if (route.query.ticket) {
          mgop({
            api: 'mgop.zjanchu.gfb.ticket', // 必须
            host: 'https://mapi.zjzwfw.gov.cn/',
            dataType: 'JSON',
            type: 'POST',
            data: {
              st: route.query.ticket
            },
            header: {
              Accept: 'application/prs.xkm.v1.0.0+json'
              //   isTestUrl: '1'
            },
            appKey: 'djk0at4y+2001885902+zngwuf', // 必须
            onSuccess: (data) => {
              let shazam = data.data
              state.showMask = false
              if (shazam && shazam.code === 0) {
                if (shazam.data.token) {
                  fetchUserInfo(shazam.data.token)
                }
              }
            },
            onFail: (err) => {
              Toast(JSON.stringify(err))
              state.showMask = false
            }
          })
        } else {
          state.showMask = false
        }
      }
    }
    const fetchUserInfo = (Token) => {
      state.showMask = true
      mgop({
        api: 'mgop.zjanchu.gfb.zlbUser', // 必须
        host: 'https://mapi.zjzwfw.gov.cn/',
        dataType: 'JSON',
        type: 'POST',
        data: {
          token: Token
        },
        header: {
          Accept: 'application/prs.xkm.v1.0.0+json'
          //   isTestUrl: '1'
        },
        appKey: 'djk0at4y+2001885902+zngwuf', // 必须
        onSuccess: (data) => {
          let shazam = data.data
          if (shazam && shazam.code === 0) {
            if (shazam.data.token) {
              localStorage.setItem('token', shazam.data.token)
              localStorage.setItem('zlbUserInfo', JSON.stringify(shazam.data.zhelb_user_info))
              localStorage.setItem('simpleUserInfo', JSON.stringify(shazam.data))
              let data = {
                time: Date.now(),
                ...shazam.data
              }
              if (data.type != 1 && data.is_check == 0) {
                localStorage.setItem('needTwiceAuth', '1')
              }
              localStorage.setItem('currentUserInfo', JSON.stringify(data))
              localStorage.setItem('type', shazam.data.type)
              Store.commit('setUserType', shazam.data.type)
              checkType()
              state.showMask = false
            }
          } else {
            Toast(shazam.msg)
            state.showMask = false
          }
        },
        onFail: (err) => {
          Toast(JSON.stringify(err))
          state.showMask = false
        }
      })
    }
    const fetchTrigger = () => {
      if (state.ZLBFLAG) {
        mgop({
          api: 'mgop.zjanchu.gfb.display', // 必须
          host: 'https://mapi.zjzwfw.gov.cn/',
          dataType: 'JSON',
          type: 'POST',
          data: {},
          header: {
            Authorization: localStorage.getItem('token') || '',
            Accept: 'application/prs.xkm.v1.0.0+json'
            // isTestUrl: '1'
          },
          appKey: 'djk0at4y+2001885902+zngwuf', // 必须
          onSuccess: (data) => {
            let shazam = data.data
            if (shazam && shazam.code === 0) {
              if (shazam.data) {
                if (shazam.data.is_display == '0') {
                  state.ZLBTRICKTRIGGER = false
                } else {
                  state.ZLBTRICKTRIGGER = true
                }
              } else {
                state.ZLBTRICKTRIGGER = true
              }
            } else {
              state.ZLBTRICKTRIGGER = true
            }
          },
          onFail: (err) => {
            Toast(JSON.stringify(err))
            state.ZLBTRICKTRIGGER = true
          }
        })
      }
    }
    const checkType = () => {
      // let scroll = new BScroll(scrollCon.value, {
      //     scrollX: true,
      //     probeType: 3,
      //     click: true,
      //     eventPassthrough: 'vertical',
      // })
      // var length = 174 * 4
      // var ratio = (67 / length) * (500 / 880).toFixed(2)
      // var finalLength = ((500 / length) * 67).toFixed(2)
      // state.dynaminWidth = finalLength
      // function onScroll (target) {
      //     state.dynamicDistance = -(target.x * ratio)
      // }
      // scroll.on('scroll', onScroll)
      let type = ''
      if (localStorage.getItem('type') == 'undefined' || localStorage.getItem('type') == null) {
        if (route.query.type) {
          type = route.query.type
          localStorage.setItem('type', type)
          Store.commit('setUserType', type)
        } else {
          localStorage.setItem('type', '4')
          type = '4'
          Store.commit('setUserType', '4')
        }
      } else {
        type = localStorage.getItem('type')
        Store.commit('setUserType', type)
      }
      let oldEnterInfo = [
        {
          icon: 'https://img.hzanchu.com/acimg/08e198fa43d61d8e24e0da8b53431aca.png',
          name: '我要培训',
          route: 'skills-training',
          verify: '1',
          show: '1'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/88001d0f14a82de12df7a3fe2b25d552.png',
          name: '我要买卖',
          route: '/agriculture',
          extraName: 'agricultureList',
          verify: '1',
          show: '1'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/dd9c797a2898f423d01d7f87ae2da803.png',
          name: '劳务大厅',
          route: '/job',
          extraName: 'jobList',
          verify: '1',
          show: '1'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/7f838f2f16b2164ec946773242ef7cd6.png',
          name: '资产出租',
          route: 'assetUtilizationVerify',
          extraName: 'asset-utilization',
          verify: '1',
          show: '1'
        }
      ]
      let enterInfo = [
        {
          icon: 'https://img.hzanchu.com/acimg/e843b25e90dd319425b486191a0ca3ce.png',
          name: '结对帮扶',
          route: '/tabList?i=0',
          verify: '1',
          show: '1'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/3c5a93b3631d53ffb6e98df9bd018110.png',
          name: '产业帮扶',
          route: '/cultural-propaganda',
          verify: '1',
          show: '1'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/9c315b628fd69db04370b445c242870f.png',
          name: '我的申领',
          route: '/subsidy/index',
          verify: '1',
          show: '1'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/08e198fa43d61d8e24e0da8b53431aca.png',
          name: '我要培训',
          route: 'skills-training',
          verify: '1',
          show: '1'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/88001d0f14a82de12df7a3fe2b25d552.png',
          name: '我要买卖',
          route: '/agriculture',
          extraName: 'agricultureList',
          verify: '1',
          show: '1'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/dd9c797a2898f423d01d7f87ae2da803.png',
          name: '劳务大厅',
          route: '/job',
          extraName: 'jobList',
          verify: '1',
          show: '1'
        },
        {
          icon: 'https://img.hzanchu.com/acimg/7f838f2f16b2164ec946773242ef7cd6.png',
          name: '资产出租',
          route: 'assetUtilizationVerify',
          extraName: 'asset-utilization',
          verify: '1',
          show: '1'
        }
      ]
      oldEnterList.value = oldEnterInfo
      enterList.value = enterInfo
      if (type == 4) {
        let noChoice = localStorage.getItem('nochoiceButIcon') ? localStorage.getItem('nochoiceButIcon') : ''
        // if (!noChoice) {
        //   let special = enterInfo.find((ele) => {
        //     return (ele.name = '结对帮扶')
        //   })
        //   special.show = 0
        // }
      }
    }
    onMounted(() => {
      initAction()
    })
    const toDetail = (item) => {
      if (item.verify == '1') {
        // if (localStorage.getItem("phone") && sessionStorage.getItem("uid")) {
        if (state.ZLBFLAG) {
          if (item.route) {
            if (item.name == '劳务大厅' || item.name == '我要买卖' || item.name == '资产出租') {
              let flag = localStorage.getItem('needTwiceAuth') ? localStorage.getItem('needTwiceAuth') : ''
              if (flag) {
                // router.push(item.route)
                let currentInfo = JSON.parse(localStorage.getItem('zlbUserInfo'))
                Request.userUpdate({
                  id_card: currentInfo.idnum,
                  real_name: currentInfo.username
                })
                  .then((res) => {
                    if (res && res.code === 0) {
                      localStorage.removeItem('needTwiceAuth')
                      router.push({
                        name: item.extraName
                      })
                    } else {
                      Toast(res.msg)
                    }
                  })
                  .catch((err) => {
                    console.log(err)
                  })
              } else {
                router.push({
                  name: item.extraName
                })
              }
            } else if (item.name == '结对帮扶') {
              let type = localStorage.getItem('type')
              if (type != 4) {
                let currentUserInfo = localStorage.getItem('currentUserInfo') ? JSON.parse(localStorage.getItem('currentUserInfo')) : ''
                if (currentUserInfo) {
                  if (currentUserInfo.farmer_info.is_show) {
                    if (currentUserInfo.type == 2 || currentUserInfo.type == 3) {
                      Store.commit('setGlobalDialog', true)
                    }
                  } else {
                    router.push(item.route)
                  }
                } else {
                  router.push(item.route)
                }
              } else {
                Toast('非低收入农户无法使用')
              }
            } else {
              router.push(item.route)
            }
          } else {
            Toast('即将开放，敬请期待')
          }
        } else {
          //h5端
          if (localStorage.getItem('phone')) {
            if (item.route) {
              if (item.name == '劳务大厅' || item.name == '我要买卖' || item.name == '资产出租') {
                let flag = localStorage.getItem('needTwiceAuth') ? localStorage.getItem('needTwiceAuth') : ''
                if (flag) {
                  router.push(item.route)
                } else {
                  router.push({
                    name: item.extraName
                  })
                }
              } else if (item.name == '结对帮扶') {
                let type = localStorage.getItem('type')
                if (type != 4) {
                  let currentUserInfo = localStorage.getItem('currentUserInfo') ? JSON.parse(localStorage.getItem('currentUserInfo')) : ''
                  if (currentUserInfo) {
                    if (currentUserInfo.farmer_info.is_show) {
                      if (currentUserInfo.type == 2 || currentUserInfo.type == 3) {
                        Store.commit('setGlobalDialog', true)
                      }
                    } else {
                      router.push(item.route)
                    }
                  } else {
                    router.push(item.route)
                  }
                } else {
                  Toast('非低收入农户无法使用')
                }
              } else {
                router.push(item.route)
              }
            } else {
              Toast('即将开放，敬请期待')
            }
            //   if ((data.type == 2) || (data.type == 3)) {
            //             if (data.farmer_info.is_show) {
            //               Store.commit('setGlobalDialog', true)
            //             }
            //           }
          } else {
            router.push({
              path: '/index',
              query: {
                url: encodeURIComponent(item.route)
              }
            })
          }
        }
      } else {
        if (item.route) {
          router.push(item.route)
        } else {
          Toast('即将开放，敬请期待')
        }
      }
    }
    const toBee = () => {
      if (state.ZLBFLAG) {
        router.push({
          name: 'zhongfengEntrance'
        })
      } else {
        if (localStorage.getItem('phone')) {
          router.push({
            name: 'zhongfengEntrance'
          })
        } else {
          router.push({
            path: '/index',
            query: {
              url: encodeURIComponent('/cultural-propaganda/zhongfeng')
            }
          })
        }
      }
    }
    const toGroup = () => {
      if (state.ZLBFLAG) {
        router.push({
          name: 'zhongfengGroupIncrease'
        })
      } else {
        if (localStorage.getItem('phone')) {
          router.push({
            name: 'zhongfengGroupIncrease'
          })
        } else {
          router.push({
            path: '/index',
            query: {
              url: encodeURIComponent('/cultural-propaganda/zhongfeng/groupIncrease')
            }
          })
        }
      }
    }
    const toPublicity = () => {
      //   Toast('即将开放，敬请期待')
      router.push({
        name: 'publicAnnouncement'
      })
    }
    const toCall = () => {
      ZWJSBridge.phoneCall({
        corpId: '0577-59029723'
      })
    }
    return {
      oldEnterList,
      enterList,
      toCall,
      router,
      toDetail,
      scrollCon,
      state,
      toPublicity,
      toBee,
      toGroup
    }
  }
}
</script>
<style lang="less" scoped>
@twentyEight: 28px;
.service {
  font-size: 26px;
  color: #98999b;
  text-align: center;
  line-height: 0.4rem;
  span {
    color: #008fff;
  }
}
.serviceOld {
  font-size: 31px;
  line-height: 0.5rem;
}
.serviceCon {
  margin-bottom: 20px;
  margin-top: 40px;
}
.barBase {
  width: 100%;
  position: absolute;
  // top: 642px;
  width: 85%;
}
.littleBarCon {
  margin: 0 auto;
  width: 67px;
  overflow: hidden;
  height: 6px;
  border-radius: 3px;
  background-color: #ccc;
}
.barItem {
  height: 6px;
  background-color: #ff844e;
}
.horizontalContainerForOld {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  align-content: center;
  margin-left: 30px;
  margin-right: 30px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 20px;
  .scrollItem {
    width: 25%;
    text-align: center;
    padding-top: 30px;
    padding-bottom: 30px;
  }
  img {
    width: 100px;
  }
}
.itemName {
  font-size: 35px;
  font-weight: 500;
  text-align: center;
  color: #333;
}
.scrollItemOlder {
  width: 50% !important;
}
.scrollItemImgOlder {
  width: 150px !important;
}
.itemNameOlder {
  font-size: 40px !important;
  font-weight: 900 !important;
}
.horizontal-container {
  margin-top: 30px;
  width: 100%;
  box-sizing: border-box;
  padding-left: 0.13%;
  padding-right: 0.13%;
  //   width: 750px;
  //   padding-left: 100px;
  //   padding-right: 100px;
  //   left: -70px;
  .scroll-item {
    // width: 174px;
    width: 25%;
    font-size: 24px;
    margin-bottom: 35px;
    text-align: center;
    img {
      width: 97px;
    }
    .itemName {
      margin-top: 0;
      line-height: 30px;
      font-size: @twentyEight;
      font-weight: 400;
      text-align: center;
      color: #333;
    }
    .itemNameReset {
      font-size: calc(@twentyEight* @newRatio);
    }
  }
}
.publishOuterCon {
  margin: 354px auto 0;
  //   width: 700px;
  width: 93.33%;
  overflow: hidden;
  img {
    width: 100%;
  }
}
.publishOuterOlderCon {
  margin: 50px auto 0;
  width: 93.33%;
  overflow: hidden;
  img {
    width: 100%;
  }
}
.scroll-wrapper {
  position: relative;
  // width: 700px;
  width: 93.33%;
  height: 360px;
  background-color: #fff;
  margin: 0 auto;
  padding: 30px 10px 0;
  box-sizing: border-box;
  white-space: nowrap;
  border-radius: 16px;
  overflow: hidden;
  .scroll-content {
    display: inline-block;
    position: relative;
    left: -10px;
    width: 100%;
  }
  .resetLeft {
    left: 0 !important;
  }
  .flexCon {
    // width: 110%;
    // width: 100%;
    flex-wrap: wrap;
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    // background-color: antiquewhite;
  }
  .initwidth {
    width: 704px;
  }
  .hundredPercent {
    width: 100% !important;
  }
}

.coverCon {
  position: absolute;
  top: 460px;
  background-color: #fff;
  height: 270px;
  width: 100%;
  box-sizing: border-box;
  padding-left: 100px;
  padding-right: 100px;
  .coverInner {
    margin-top: 100px;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    .coverItem {
      margin-left: 20px;
      margin-right: 20px;
      width: 150px;
      text-align: center;
      .coverImg {
        width: 88px;
        height: 88px;
      }
      .coverItemName {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin-top: 20px;
      }
    }
  }
}
.outer {
  position: relative;
  padding-bottom: 1.6rem;
}
@thirtyFour: 34px;
.policy {
  margin-top: 30px;
  padding-left: 30px;
  box-sizing: border-box;
  padding-right: 30px;
  .policyTitle {
    font-size: @thirtyFour;
    margin-bottom: 20px;
    font-weight: 600;
    text-align: left;
    color: #333;
  }
  .policyTitleOld {
    font-size: 50px;
    margin-bottom: 20px;
    font-weight: 800;
    text-align: left;
    color: #333;
  }
}
.message {
  overflow: hidden;
  margin-top: 30px;
  box-sizing: border-box;
  padding-left: 30px;
  padding-right: 30px;
  .messageTitle {
    font-size: @thirtyFour;
    margin-bottom: 20px;
    font-weight: 600;
    text-align: left;
    color: #333;
  }
  .messageTitleOld {
    font-size: 50px;
    margin-bottom: 20px;
    font-weight: 800;
    text-align: left;
    color: #333;
  }
}
.twinCon {
  margin-top: 30px;
  padding-left: 30px;
  box-sizing: border-box;
  padding-right: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  img {
    // width: 340px;
    width: 48%;
    height: 170px;
  }
}
</style>
<style lang="less">
.submitHome {
  .block {
    height: 120px;
    width: 120px;
  }
  .cusOverlay {
    background-color: rgba(0, 0, 0, 0.2);
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
