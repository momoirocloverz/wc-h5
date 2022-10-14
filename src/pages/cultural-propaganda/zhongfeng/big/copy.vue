<template>
  <div class="normalLocationMapCon">
    <div class="inputCon">
      <input type="text" id="pickerInput" placeholder="请输入地址" />
    </div>
    <div id="container4"></div>
    <div class="bottomArea">
      <div class="displayCurrent">{{ state.current.address }}</div>
      <div class="button" @click="confirmArea">确认位置</div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AMapLoader from '@amap/amap-jsapi-loader'
export default {
  setup() {
    const Router = useRouter()
    const state = reactive({
      current: {},
      mapInstance: {},
      globalCity: ''
    })
    const onComplete = (data) => {
      Toast('定位成功')
    }
    const onFail = (data) => {
      console.log('失败原因排查信息', data.message)
      //   Toast(data.message)
    }
    const initAction = () => {
      AMapUI.loadUI(['misc/PositionPicker', 'misc/PoiPicker'], function (PositionPicker, PoiPicker) {
        var map = new AMap.Map('container4', {
          zoom: 11,
          resizeEnable: true
        })
        state.mapInstance = map
        var poiPicker = new PoiPicker({
          input: 'pickerInput'
        })
        poiPickerReady(poiPicker)
        function poiPickerReady(poiPicker) {
          window.poiPicker = poiPicker
          var marker = new AMap.Marker()
          //选取了某个POI
          poiPicker.on('poiPicked', function (poiResult) {
            var source = poiResult.source,
              poi = poiResult.item,
              info = {
                source: source,
                id: poi.id,
                name: poi.name,
                location: poi.location.toString(),
                address: poi.address
              }
            marker.setMap(map)
            let res = {
              lat: poi.location.lat,
              lng: poi.location.lng,
              address: poi.address
            }
            sessionStorage.setItem('bigFarmerApplyMap', JSON.stringify(res))
            state.current = res
            marker.setPosition(poi.location)
            map.setCenter(marker.getPosition())
          })
          poiPicker.onCityReady(function () {
            //   poiPicker.suggest('美食')
          })
        }
        AMap.plugin('AMap.Geolocation', function () {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：5s
            buttonPosition: 'RB', //定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(10, 20) //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            //   zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
          })
          map.addControl(geolocation)
          geolocation.getCurrentPosition(function (status, result) {
            if (status == 'complete') {
              onComplete(result)
            } else {
              onFail(result)
            }
          })
        })
        var positionPicker = new PositionPicker({
          mode: 'dragMarker',
          map: map,
          iconStyle: {
            //自定义外观
            url: '//webapi.amap.com/ui/1.0/assets/position-picker2.png',
            ancher: [24, 40],
            size: [48, 48]
          }
        })
        positionPicker.on('success', function (positionResult) {
          console.log('success', positionResult)
          let res = {
            lat: positionResult.position.lat,
            lng: positionResult.position.lng,
            address: positionResult.address
          }
          sessionStorage.setItem('bigFarmerApplyMap', JSON.stringify(res))
          state.current = res
        })
        positionPicker.on('fail', function (positionResult) {
          console.log('fail', positionResult)
        })
        positionPicker.start()
      })
    }

    const confirmArea = () => {
      console.log(state.current)
      state.mapInstance.destroy()
      Router.go(-1)
    }

    const newInit = () => {
      AMapLoader.load({
        key: '6a3c4a688ab41d79e1629f094389905d',
        plugins: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Geolocation'],
        AMapUI: {
          version: '1.1',
          plugins: ['misc/PositionPicker']
        }
      })
        .then((AMap) => {
          var map = new AMap.Map('container4', {
            zoom: 11,
            resizeEnable: true
          })
          state.mapInstance = map
          AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
            // console.log('PositionPicker', PositionPicker)
            var positionPicker = new PositionPicker({
              mode: 'dragMap',
              map: map,
              iconStyle: {
                //自定义外观
                url: '//webapi.amap.com/ui/1.0/assets/position-picker2.png',
                ancher: [24, 40],
                size: [48, 48]
              }
            })
            positionPicker.on('success', function (positionResult) {
              console.log(positionResult, 'positionResult')
              //   console.log('success', positionResult)
              if (positionResult && positionResult.regeocode && positionResult.regeocode && positionResult.regeocode.addressComponent && positionResult.regeocode.addressComponent.city) {
                state.globalCity = positionResult.regeocode.addressComponent.city
              }
              let res = {
                lat: positionResult.position.lat,
                lng: positionResult.position.lng,
                address: positionResult.address
              }
              sessionStorage.setItem('bigFarmerApplyMap', JSON.stringify(res))
              state.current = res
            })
            positionPicker.on('fail', function (positionResult) {
              console.log('fail', positionResult)
            })
            positionPicker.start()
          })
          setTimeout(() => {
            AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Geolocation'], function () {
              var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, //是否使用高精度定位，默认:true
                timeout: 10000, //超过10秒后停止定位，默认：5s
                buttonPosition: 'RB', //定位按钮的停靠位置
                buttonOffset: new AMap.Pixel(10, 20) //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                //   zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
              })
              map.addControl(geolocation)
              geolocation.getCurrentPosition(function (status, result) {
                console.log(status, result, 'result')
                if (status == 'complete') {
                  onComplete(result)
                } else {
                  onFail(result)
                }
              })
              var autoOptions = {
                city: state.globalCity,
                input: 'pickerInput' //使用联想输入的input的id
              }
              var autocomplete = new AMap.Autocomplete(autoOptions)
              var placeSearch = new AMap.PlaceSearch({
                city: state.globalCity,
                map: map
              })
              AMap.event.addListener(autocomplete, 'select', function (e) {
                //TODO 针对选中的poi实现自己的功能
                // console.log('e', e)
                placeSearch.setCity(e.poi.adcode)
                placeSearch.search(e.poi.name)
              })
            })
          }, 500)
        })
        .catch((e) => {
          console.log(e)
        })
    }

    onMounted(() => {
      newInit()
    })

    return {
      state,
      confirmArea
    }
  }
}
</script>

<style lang="less" scoped>
#container4 {
  width: 100%;
  height: 100vh;
}
.normalLocationMapCon {
  box-sizing: border-box;
}
.bottomArea {
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 253px;
  background-color: #fff;
  width: 74%;
  border-radius: 20px;
  padding: 30px;
  box-sizing: border-box;
}
.button {
  height: 88px;
  background: linear-gradient(#ff844e 0%, #fe6d56 100%);
  border-radius: 44px;
  font-size: 32px;
  color: #fff;
  text-align: center;
  line-height: 88px;
}
.displayCurrent {
  font-size: 32px;
  height: 96px;
  margin-bottom: 10px;
  position: relative;
  &::before {
    content: ' ';
    position: absolute;
    height: 10px;
    width: 10px;
    left: -14px;
    top: 10px;
    border-radius: 5px;
    background-color: #ff844e;
  }
}
.inputCon {
  z-index: 100;
  position: fixed;
  top: 0;
  height: 136px;
  width: 100%;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  background-color: #fff;
  padding-top: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;

  input {
    width: 90%;
    height: 80px;
    background-color: #f7f7f7;
    border-radius: 41px;
    padding-left: 30px;
    font-size: 30px;
  }
}
/deep/ .amap_lib_placeSearch .poibox.highlight {
  background-color: #cae1ff;
}

/deep/ .amap_lib_placeSearch .poi-more {
  display: none !important;
}
/deep/ .amap-ui-poi-picker-sugg-list .sugg-item {
  font-size: 30px;
  padding-top: 17px;
  padding-bottom: 17px;
}
</style>
