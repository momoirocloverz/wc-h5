import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store'
// import './rem.js'
import 'amfe-flexible'
import { Swipe, SwipeItem, Field, Tab, Tabs, Icon, Picker, Popup, Uploader, RadioGroup, Radio, Dialog, Cascader, DatetimePicker, Image as VanImage, Overlay, Button, Form, Checkbox } from 'vant'
import { getQueryString, fitForOld } from './util/index.js'

import '@/assets/css/vant.less'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(Swipe)
app.use(SwipeItem)
app.use(Tab)
app.use(Icon)
app.use(Tabs)
app.use(Field)
app.use(Popup)
app.use(DatetimePicker)
app.use(Picker)
app.use(Uploader)
app.use(RadioGroup)
app.use(Radio)
app.use(Dialog)
app.use(Cascader)
app.use(VanImage)
app.use(Overlay)
app.use(Button)
app.use(Form)
app.use(Checkbox)
app.mount('#app')

/**
 * TODO 获取url参数信息
 */
fitForOld()
async function loader() {
//   localStorage.setItem('fitForOld', 1)
  //   localStorage.setItem( 'token','eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjRmMXQyM2E4OGJiIn0.eyJpc3MiOiJ4a20iLCJhdWQiOiJ3ZW5jaGVuZ194a20iLCJqdGkiOiI0ZjF0MjNhODhiYiIsImlhdCI6MTYzNTQ5MTg2MCwiZXhwIjoxNjM4MDgzODYwLCJ1aWQiOjYxfQ.W2mKVM3pe5-TIEfiiuXiQkrQpVn0vE5CzpPKd_pRbz4' )
  await new Promise((resolve) => {
    if (getQueryString('id')) {
      sessionStorage.setItem('uid', getQueryString('id'))
      let phoneWithUid = localStorage.getItem('phoneWithUid') ? JSON.parse(localStorage.getItem('phoneWithUid')) : ''
      if (phoneWithUid) {
        if (getQueryString('id') == phoneWithUid.uid) {
        } else {
          localStorage.removeItem('phone')
          localStorage.removeItem('needTwiceAuth')
          localStorage.removeItem('type')
          localStorage.removeItem('currentUserInfo')
          localStorage.removeItem('simpleUserInfo')
          localStorage.removeItem('hasChosen')
          localStorage.removeItem('chossenGuy')
          localStorage.removeItem('nochoiceButIcon')
          store.commit('initDataAction')
        }
      }
      resolve()
    } else {
      let phone = localStorage.getItem('phone') ? localStorage.getItem('phone') : ''
      let chosen = localStorage.getItem('hasChosen') ? localStorage.getItem('hasChosen') : ''
      if (phone) {
        if (!chosen) {
          let type = localStorage.getItem('type') ? localStorage.getItem('type') : ''
          if (type == 2 || type == 3) {
            localStorage.setItem('type', 4)
            store.commit('setUserType', 4)
            localStorage.setItem('nochoiceButIcon', '1')
          }
        }
      }
      resolve()
    }
    resolve()
  })
}
loader()
