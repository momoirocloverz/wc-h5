<template>
  <div class="bigMapCon">
    <div id="container16"></div>
    <div class="button" @click="goBack">返回</div>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AMapLoader from '@amap/amap-jsapi-loader'
export default {
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({})
    const initAction = () => {
      AMapLoader.load({
        key: '6a3c4a688ab41d79e1629f094389905d'
        // plugins: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Geolocation'],
        // AMapUI: {
        //   version: '1.1',
        //   plugins: ['misc/PositionPicker']
        // }
      })
        .then((AMap) => {
          var map = new AMap.Map('container16', {
            resizeEnable: true,
            center: [Route.query.lng, Route.query.lat],
            zoom: 13
          })
          var marker = new AMap.Marker({
            position: new AMap.LngLat(Route.query.lng, Route.query.lat),
            offset: new AMap.Pixel(-10, -10),
            icon: '//vdata.amap.com/icons/b18/1/2.png', // 添加 Icon 图标 URL
            title: '1'
          })
          map.add(marker)
        })
        .catch((err) => {
          console.log('err', err)
        })
      //   var map = new AMap.Map('container16', {
      //     resizeEnable: true,
      //     center: [Route.query.lng, Route.query.lat],
      //     zoom: 13
      //   })
      //   var marker = new AMap.Marker({
      //     position: new AMap.LngLat(Route.query.lng, Route.query.lat),
      //     offset: new AMap.Pixel(-10, -10),
      //     icon: '//vdata.amap.com/icons/b18/1/2.png', // 添加 Icon 图标 URL
      //     title: '1'
      //   })
      //   map.add(marker)
    }
    onMounted(() => {
      initAction()
    })
    const goBack = () => {
      Router.go(-1)
    }
    return {
      state,
      goBack
    }
  }
}
</script>

<style lang="less" scoped>
#container16 {
  width: 100%;
  height: 100vh;
}
.bigMapCon {
  box-sizing: border-box;
}
.button {
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 550px;
  height: 70px;
  background: linear-gradient(#ff844e 0%, #fe6d56 100%);
  border-radius: 35px;
  font-size: 32px;
  color: #fff;
  text-align: center;
  line-height: 70px;
}
</style>
