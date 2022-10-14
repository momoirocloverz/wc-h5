<template>
  <div class="normalLocationMapCon">
    <!-- <div class="inputCon">
      <input type="text" id="pickerInput" placeholder="请输入地址" />
    </div>
    <div id="container4"></div>
    <div class="bottomArea">
      <div class="displayCurrent">{{ state.current.address }}</div>
      <div class="button" @click="confirmArea">确认位置</div>
    </div> -->
    <div class="head-handle">
      <div class="confirm" @click="confirmArea">确定</div>
    </div>
    <div id="container4" class="map-container"></div>
    <div class="address-list">
      <div class="inputCon">
        <input type="text" placeholder="搜索地址" @input="watchInput" />
      </div>
      <div class="list">
        <template v-for="item in state.placeList" :key="item.id">
          <div class="item" @click="choicePlace(item)">
            <div class="detail-info">
              <p>{{ item.name }}</p>
              <p class="addressP">{{ item.address && item.address.length ? item.address : item.district }}</p>
            </div>
            <van-icon name="success" color="#FE6D56" v-show="state.picker.id === item.id" />
          </div>
        </template>
      </div>
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
      picker: {},
      mapInstance: {},
      keyValue: '',
      placeList: [],
      timer: null,
      dragMarker: null,
      geolocationInstance: null
    })
    const mapOverlay = reactive({
      marker: ''
    })
    const littleIcon = {
      icon: 'https://img.hzanchu.com/acimg/57f48460638ed6e537fc419be36a2c50.png',
      ancher: 'center',
      zIndex: 199
    }
    const bigIcon = {
      icon: 'https://img.hzanchu.com/acimg/cfe916135a93116f16ec80c3d80447a6.png',
      draggable: true,
      ancher: 'center',
      zIndex: 200
    }
    const onComplete = (data) => {
      //   Toast('定位成功')
    }
    const onFail = (data) => {
      console.log('失败原因排查信息', data.message)
      //   Toast(`定位失败${data.message}`)
    }

    const geoCode = (lng, lat) => {
      AMap.plugin('AMap.Geocoder', function () {
        var geocoder = new AMap.Geocoder({
          // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
          city: '010'
        })
        var lnglat = [lng, lat]
        geocoder.getAddress(lnglat, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // result为对应的地理位置详细信息
            // console.log(result.regeocode)
            let res = {
              lat: lat,
              lng: lng,
              address: result.regeocode.formattedAddress
            }
            sessionStorage.setItem('bigHelp1Address', JSON.stringify(res))
            state.current = res
          }
        })
      })
    }

    const dragMarkInit = (lng, lat) => {
      var marker = new AMap.Marker({
        map: state.mapInstance,
        position: [lng, lat],
        offset: new AMap.Pixel(-19, -40),
        ...bigIcon
        // draggable: true,
        // ancher: 'center',
        // icon: 'https://webapi.amap.com/ui/1.0/assets/position-picker2.png',
      })
      state.dragMarker = marker
      state.mapInstance.add(marker)
      geoCode(lng, lat)
      state.dragMarker.on('dragend', (e) => {
        geoCode(e.lnglat.lng, e.lnglat.lat)
      })
    }

    const newInit = () => {
      AMapLoader.load({
        key: '6a3c4a688ab41d79e1629f094389905d',
        plugins: ['AMap.Geolocation', 'AMap.Marker', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Geocoder'],
        AMapUI: {
          version: '1.1',
          plugins: ['misc/PositionPicker', 'control/BasicControl']
        }
      })
        .then((AMap) => {
          state.mapInstance = new AMap.Map('container4', {
            zoom: 11,
            resizeEnable: true,
            animateEnable: false
          })
          //   positionPickerAction()
          AMapUI.loadUI(['control/BasicControl'], function (BasicControl) {
            var zoomCtrl1 = new BasicControl.Zoom({
              position: 'br'
            })
            // state.mapInstance.addControl(zoomCtrl1)
          })
          var geolocation = new AMap.Geolocation({
            // 是否使用高精度定位，默认：true
            enableHighAccuracy: false,
            // 设置定位超时时间，默认：无穷大
            timeout: 10000,
            // 定位按钮的停靠位置的偏移量
            offset: [10, 20],
            //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            zoomToAccuracy: true,
            //  定位按钮的排放位置,  RB表示右下
            position: 'RB'
          })
          state.mapInstance.addControl(geolocation)
          state.geolocationInstance = geolocation

          geolocation.getCityInfo(function (status, result) {
            if (status == 'complete') {
              state.keyValue = result.city
              state.mapInstance.setCenter(result.center)
              mapOverlay.marker = new AMap.Marker({
                position: new AMap.LngLat(result.center[0], result.center[1]),
                offset: new AMap.Pixel(-9, -9),
                ...littleIcon
              })
              state.mapInstance.add(mapOverlay.marker)
              searchPlace()
              dragMarkInit(result.center[0], result.center[1])
              state.geolocationInstance.getCurrentPosition(function (status, result) {
                // console.log('result', result)
                if (status == 'complete') {
                  onComplete(result)
                  state.keyValue = result.formattedAddress
                  searchPlace()
                  //   dragMarkInit(result.position.lng, result.position.lat)
                  if (state.dragMarker) {
                    state.dragMarker.setPosition([result.position.lng, result.position.lat])
                    let res = {
                      lat: result.position.lat,
                      lng: result.position.lng,
                      address: result.formattedAddress
                    }
                    sessionStorage.setItem('bigHelp1Address', JSON.stringify(res))
                    state.current = res
                  } else {
                    dragMarkInit(result.position.lng, result.position.lat)
                  }
                } else {
                  onFail(result)
                }
              })
            } else {
              // onError(result)
            }
          })
        })
        .catch((e) => {
          console.log(e)
        })
    }

    const watchInput = (e) => {
      clearTimeout(state.timer)
      state.timer = setTimeout(() => {
        const { value } = e.target
        state.keyValue = value
        searchPlace()
      }, 1000)
    }

    const searchPlace = async () => {
      var autoOptions = {
        //city 限定城市，默认全国
        city: '全国'
      }
      // 实例化AutoComplete

      var autoComplete = new AMap.Autocomplete(autoOptions)
      // 根据关键字进行搜索
      autoComplete.search(state.keyValue, function (status, result) {
        // 搜索成功时，result即是对应的匹配数据
        // console.log('result', result)
        if (status == 'complete') {
          state.placeList = result.tips.filter((ele) => {
            return ele.location.lat
          })
        }
      })
    }

    const rePlant = (res) => {
      var marker = new AMap.Marker({
        map: state.mapInstance,
        icon: 'https://webapi.amap.com/ui/1.0/assets/position-picker2.png',
        position: [res.lng, res.lat],
        draggable: true,
        ancher: 'center',
        offset: new AMap.Pixel(-19, -40)
      })
      state.dragMarker = marker
      state.mapInstance.add(marker)
    }

    const choicePlace = (item) => {
      state.picker = item
      let lnglat = [item.location.lng, item.location.lat]
      //   console.log('item', item)
      state.mapInstance.setCenter(lnglat)
      //   console.log(item, 'item')
      updataMark(lnglat)
      let res = {
        lat: item.location.lat,
        lng: item.location.lng,
        address: item.name
      }
      sessionStorage.setItem('bigHelp1Address', JSON.stringify(res))
      state.current = res
      if (state.dragMarker) {
        state.dragMarker.setPosition([res.lng, res.lat])
      } else {
        rePlant(res)
      }
    }

    const updataMark = (lnglat) => {
      state.mapInstance.remove(mapOverlay.marker)
      mapOverlay.marker = new AMap.Marker({
        position: lnglat,
        offset: new AMap.Pixel(-9, -9),
        ...littleIcon
      })
      state.mapInstance.add(mapOverlay.marker)
    }

    const confirmArea = () => {
      console.log(state.current)
      state.mapInstance.destroy()
      Router.go(-1)
    }

    onMounted(() => {
      newInit()
    })

    return {
      state,
      mapOverlay,
      confirmArea,
      watchInput,
      choicePlace
    }
  }
}
</script>

<style lang="less" scoped>
.head-handle {
  height: 120px;
  position: fixed;
  //   background-color: #fff;
  top: 0;
  right: 20px;
  //   padding: 20px;
  //   box-sizing: border-box;
  //   width: 100%;
  z-index: 800;
  display: flex;
  //   justify-content: space-between;
  align-items: center;
  .confirm {
    width: 126px;
    height: 56px;
    background: linear-gradient(90deg, #ff844e 0%, #fe6d56 100%);
    font-size: 28px;
    line-height: 56px;
    text-align: center;
    color: #fff;
    border-radius: 10px;
    margin-left: 20px;
  }
  .displayCurrent {
    font-size: 24px;
    // height: 100px;
    width: 80%;
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
}
.normalLocationMapCon {
  box-sizing: border-box;
}

.map-container {
  height: calc(100vh - 680px);
}
.address-list {
  height: 680px;
  z-index: 900;
  position: relative;
  background: #fff;
  .inputCon {
    height: 118px;
    background: #fff;
    overflow: hidden;
    input {
      width: 650px;
      height: 68px;
      display: block;
      margin: 20px auto 0;
      border-radius: 8px;
      background: #f7f7f7;
      line-height: normal;
      padding: 0 20px;
      font-size: 30px;
    }
  }
  .list {
    height: calc(680px - 118px);
    overflow-y: scroll;
    padding: 0 30px;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 30px;
      color: #333;
      padding: 22px 0;
      border-bottom: 2px solid #f3f6f9;
      p {
        width: 560px;
        line-height: 48px;
      }
    }
  }
}
.addressP {
  font-size: 24px;
  color: #999;
}

::-webkit-input-placeholder {
  font-size: 30px;
}

.bottomArea {
  position: fixed;
  //   bottom: 60px;
  top: 60px;
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
</style>
