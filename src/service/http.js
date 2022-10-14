import axios from 'axios'
import config from './config'
import Router from '../router'
const Http = axios.create({
  baseURL: config.publicUrl,
  timeout: config.timeout,
  headers: {
    Accept: config.version,
  },
})
Http.interceptors.request.use(
  (config) => {
    let userInfo = localStorage.getItem('currentUserInfo')
      ? JSON.parse(localStorage.getItem('currentUserInfo'))
      : ''
    let token = userInfo ? userInfo.token : 'deecadaa23513b9c784d52a0c37cbe79'
    if (token) {
      if (userInfo) {
        let trackTime = userInfo.time
        // if (Date.now() - trackTime > 30 * 60 * 1000) {
        //   localStorage.removeItem('phone')
        //   localStorage.removeItem('currentUserInfo')
        //   config.headers['Authorization'] = 'deecadaa23513b9c784d52a0c37cbe79'
        //   config.headers['AccessToken'] = 'deecadaa23513b9c784d52a0c37cbe79'
        // } else {
        config.headers['Authorization'] = token
        config.headers['AccessToken'] = token
        // }
      } else {
        config.headers['Authorization'] = token
        config.headers['AccessToken'] = token
      }
      config.headers['Accept'] = 'application/prs.xkm.v1.0.0+json'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
Http.interceptors.response.use(
  (res) => {
    if (res.data.code === 21001) {
      Router.replace({
        path: '/index',
        query: { backUrl: encodeURIComponent(window.location.href) },
      })
    } else {
      let currentUserInfo = localStorage.getItem('currentUserInfo')
        ? JSON.parse(localStorage.getItem('currentUserInfo'))
        : ''
      if (currentUserInfo) {
        currentUserInfo.time = Date.now()
        localStorage.setItem('currentUserInfo', JSON.stringify(currentUserInfo))
      }
      return res.data
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default Http
