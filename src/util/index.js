export const util = {
  // 防抖
  debounce: (fn, wait, immediate = false) => {
    let timer,
      startTimeStamp = 0,
      context,
      args
    let run = (timerInterval) => {
      timer = setTimeout(() => {
        let now = new Date().getTime()
        let interval = now - startTimeStamp
        // 如果当前时间差小于传入的时间
        if (interval < timerInterval) {
          startTimeStamp = now
          run(wait - interval)
        } else {
          if (!immediate) {
            fn.apply(context, args)
          }
          clearTimeout(timer)
          timer = null
        }
      }, timerInterval)
    }
    return function () {
      context = this
      args = arguments
      let now = new Date().getTime()
      startTimeStamp = now
      if (!timer) {
        if (immediate) {
          fn.apply(context, args)
        }
        run(wait)
      }
    }
  },
  // 节流
  throttling: (fn, wait, immediate) => {
    let timer, context, args
    let run = () => {
      timer = setTimeout(() => {
        if (!immediate) {
          fn.apply(context, args)
        }
        clearTimeout(timer)
        timer = null
      }, wait)
    }
    return function () {
      context = this
      args = arguments
      if (!timer) {
        if (immediate) {
          fn.apply(context, args)
        }
        run()
      }
    }
  }
}

/**
 * TODO 获取URL参数
 * @param {name} String
 */
export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

export function isZLB() {
  const sUserAgent = window.navigator.userAgent.toLowerCase()
  const bIsDtDreamApp = sUserAgent.indexOf('dtdreamweb') > -1 // 浙里办APP
  const bIsAlipayMini = sUserAgent.indexOf('miniprogram') > -1 && sUserAgent.indexOf('alipay') > -1
  const bIsWxMini = sUserAgent.includes('miniprogram/wx') || window.__wxjs_environment === 'miniprogram' // 微信小程序
  return bIsDtDreamApp || bIsAlipayMini || bIsWxMini
}
export function isWeiXinMini() {
  const sUserAgent = window.navigator.userAgent.toLowerCase()
  const bIsWxMini = sUserAgent.includes('miniprogram/wx') || window.__wxjs_environment === 'miniprogram' // 微信小程序
  return bIsWxMini
}
export function ZLBJump() {
  const sUserAgent = window.navigator.userAgent.toLowerCase()
  const bIsAlipayMini = sUserAgent.indexOf('miniprogram') > -1 && sUserAgent.indexOf('alipay') > -1
  const bIsDtDreamApp = sUserAgent.indexOf('dtdreamweb') > -1 // 浙里办APP
  const bIsWxMini = sUserAgent.includes('miniprogram/wx') || window.__wxjs_environment === 'miniprogram' // 微信小程序
  localStorage.removeItem('globalLegalPerson')
  if (bIsAlipayMini) {
    try {
      location.replace('https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&servicecode=gfb')
    } catch (err) {
      console.log('err', err)
    }
  } else if (bIsDtDreamApp) {
    ZWJSBridge.getUserType({})
      .then((res) => {
        if (res.userType == 2) {
          localStorage.setItem('globalLegalPerson', '1')
          window.location.replace(
            'https://esso.zjzwfw.gov.cn/opensso/spsaehandler/metaAlias/sp?spappurl=https://wencheng-xkm.zjsszxc.com/api/zlb/legalInfo?goto=https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2001885902/reserved/index.html'
          )
          // window.location.replace(
          //   'https://esso.zjzwfw.gov.cn/opensso/spsaehandler/metaAlias/sp?spappurl=https://wencheng-xkm.zjsszxc.com/api/zlb/legalInfo?goto=https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2001885902/1.2.0/index.html?debug=true'
          // )
          // window.location.replace(
          //   'http://essotest.zjzwfw.gov.cn/opensso/spsaehandler/metaAlias/sp?spappurl=https://wencheng-xkm.anchu.vip/api/zlb/legalInfo?goto=https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2001885902/1.3.7/index.html?debug=true'
          // )
          window.onpageshow = (event) => {
            if (event.persisted || (window.performance && window.performance.navigation.type == 2)) {
              ZWJSBridge.close()
            }
          }
        } else {
          if (bIsAlipayMini) {
            try {
              location.replace('https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&servicecode=gfb')
              //测试环境示例
              // location.replace(
              //   'https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&servicecode=gfb&redirectUrl=https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2001XXXXXX948/2.X.X/index.html?debug=true'
              // )
            } catch (err) {
              console.log('err', err)
            }
          } else {
            window.onpageshow = (event) => {
              if (event.persisted || (window.performance && window.performance.navigation.type == 2)) {
                ZWJSBridge.close()
              }
            }
            window.location.replace('https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=gfb')
            //测试环境示例
            // window.location.replace(
            //   'https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=gfb&redirectUrl=https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/zj/2001XXXXXXX8/2.X.X/index.html?debug=true'
            // )
          }
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  } else if (bIsWxMini) {
    //
  }
}

export function isAliPay() {
  const sUserAgent = window.navigator.userAgent.toLowerCase()
  const bIsAlipayMini = sUserAgent.indexOf('miniprogram') > -1 && sUserAgent.indexOf('alipay') > -1
  return bIsAlipayMini
}

export function fitForOld() {
  localStorage.setItem('fitForOld', '2')
  const sUserAgent = window.navigator.userAgent.toLowerCase()
  const bIsDtDreamApp = sUserAgent.indexOf('dtdreamweb') > -1 // 浙里办APP
  if (bIsDtDreamApp) {
    let appId = document.getElementById('app')
    ZWJSBridge.getUiStyle({})
      .then((result) => {
        switch (result.uiStyle) {
          case 'normal':
            // 标准模式
            appId.style = '--size: 1;'
            break
          case 'elder':
            // 适老模式
            appId.style = '--size: 1.3;'
            localStorage.setItem('fitForOld', '1')
            break
          default:
            // 默认模式
            appId.style = '--size: 1;'
        }
        console.log(result)
      })
      //浙里办APP 6.11.0 版本以下版本标准模式兼容
      .catch((error) => {
        console.log(error)
        console.log('ZWJSBridge', '错误模式')
        appId.style = '--size: 1;'
      })
  }
}
function toCamel(a) {
  return a.replace(/_(\w)/g, function (a, b) {
    return b.toUpperCase()
  })
}

export function convert(obj) {
  if (Object.prototype.toString.call(obj) !== '[object Object]') return obj
  let res = {}
  for (let key in obj) {
    let newKey = toCamel(key)
    res[newKey] = obj[key]
  }
  return res
}

const xhrImg = (url) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('get', url, true)
    // 至关重要
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (this.status == 200) {
        //得到一个blob对象
        var blob = this.response
        // 至关重要
        let oFileReader = new FileReader()
        oFileReader.onloadend = function (e) {
          // 此处拿到的已经是 base64的图片了
          let base64 = e.target.result
          resolve(base64)
        }
        oFileReader.readAsDataURL(blob)
      }
    }
    xhr.send()
  })
}

export async function getBase64(imgUrl) {
  window.URL = window.URL || window.webkitURL
  let base64 = await xhrImg(imgUrl)
  return base64
}

// base64转File对象
export function base64ToPng(dataUrl, name) {
  var arr = dataUrl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], name + '.png', { type: 'image/png' })
}
