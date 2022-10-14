<template>
  <div class="outer submitHome"></div>
</template>
<script>
import { ref, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { isZLB, ZLBJump } from '@/util/index'
import Request from '@/service/request.js'
export default {
  name: 'home',
  setup() {
    const Router = useRouter()
    const Store = useStore()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBLOGINSTATUS: false,
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      ticket: ''
    })
    onMounted(() => {
      fetchUserType()
    })
    const legalAction = () => {
      if (getQuery('token') == null && !state.token) {
        ZLBJump()
      } else {
        state.token = getQuery('token')
        Router.replace({
          name: 'home',
          query: {
            token: state.token
          }
        })
      }
    }
    const fetchUserType = () => {
      const sUserAgent = window.navigator.userAgent.toLowerCase()
      const bIsDtDreamApp = sUserAgent.indexOf('dtdreamweb') > -1 // 浙里办APP
      const bIsAlipayMini = sUserAgent.indexOf('miniprogram') > -1 && sUserAgent.indexOf('alipay') > -1
      localStorage.removeItem('globalLegalPerson')
      const bIsWxMini = sUserAgent.includes('miniprogram/wx') || window.__wxjs_environment === 'miniprogram' // 微信小程序
      if (bIsAlipayMini) {
        mainAction()
      } else if (bIsDtDreamApp) {
        ZWJSBridge.getUserType({})
          .then((res) => {
            if (res.userType == 2) {
              localStorage.setItem('globalLegalPerson', '1')
              legalAction()
            } else {
              mainAction()
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else if (bIsWxMini) {
        WeixinAction()
      }
    }
    const WeixinAction = () => {
      localStorage.removeItem('token')
      const url = new URL(location.href)
      const searchParams = new URLSearchParams(url.search)
      const ticketId = searchParams.get('ticketId')
      if (ticketId == null && state.ticket == '') {
        // ZLBJump()
      } else {
        state.ticket = ticketId
        Router.replace({
          path: 'home',
          query: {
            ticket: state.ticket
          }
        })
      }
    }
    const mainAction = () => {
      const sUserAgent = window.navigator.userAgent.toLowerCase()
      const bIsDtDreamApp = sUserAgent.indexOf('dtdreamweb') > -1 // 浙里办APP
      const bIsAlipayMini = sUserAgent.indexOf('miniprogram') > -1 && sUserAgent.indexOf('alipay') > -1
      if (getQuery('ticket') == null && state.ticket == '') {
        ZLBJump()
      } else {
        state.ticket = getQuery('ticket')
        Router.replace({
          path: 'home',
          query: {
            ticket: state.ticket
          }
        })
      }
    }
    const getQuery = (name) => {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    }
    return {
      state
    }
  }
}
</script>
