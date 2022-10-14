<template>
  <div class="submit fs-28">
    <!-- <acfield title="定位">
      <div class="_field-arrow" @click="choosePos">
        {{ state.address }}
        <van-icon name="arrow" />
      </div>
    </acfield> -->
    <van-cell-group inset>
      <div class="locationCon">
        <van-field v-model="state.address" required label="详细地址" placeholder="请输入详细地址" />
        <div class="jumpTrigger" @click="choosePos">定位<van-icon name="arrow" /></div>
      </div>
      <van-field v-model="state.lon" required label="经度" placeholder="请输入经度" />
      <van-field v-model="state.lat" required label="纬度" placeholder="请输入纬度" />
    </van-cell-group>
    <div class="outerWrapper">
      <acfield title="蜂箱照片" :lineFeed="true" :showLine="false">
        <image-upload ref="imageRef" :list="state.imgList" :max="9" @upload="dealUpload" @delete="dealDelete"></image-upload>
      </acfield>
    </div>
  </div>
  <div :class="state.imgList.length > 0 ? 'bottom common-btn' : 'bottom common-btn-disable'" @click="submit">提交</div>
</template>

<script>
import { reactive, onMounted, ref, onUnmounted } from 'vue'
import Acfield from '@/components/acfield.vue'
import ImageUpload from '@/components/imageUpload.vue'
import { Dialog, Toast } from 'vant'
import { useRouter, onBeforeRouteLeave, useRoute } from 'vue-router'
import Request from '@/service/request'
export default {
  components: {
    Acfield,
    ImageUpload
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()

    const imageRef = ref(null)
    const state = ref({
      hive_id: 0,
      farmer_id: 0,
      imgList: [],
      address: '',
      lon: '',
      lat: ''
    })

    // 上传图片成功回调用
    const dealUpload = (e) => {
      state.value.imgList.push(e)
    }
    // 删除图片
    const dealDelete = (e) => {
      state.value.imgList.splice(e.pos, 1)
    }
    // 最终提交
    const submit = () => {
      if (!state.value.address) {
        Toast('请输入详细地址')
        return
      }
      if (!state.value.lat) {
        Toast('请输入纬度')
        return
      }
      if (!state.value.lon) {
        Toast('请输入经度')
        return
      }
      if (state.value.imgList.length == 0) {
        Toast('请上传蜂箱照片照片')
        return
      }
      Dialog.confirm({
        message: '是否确认提交？',
        showCancelButton: true,
        confirmButtonColor: '#FF844E'
      })
        .then(() => {
          localStorage.setItem(
            'bigBeeReportPublishAddress',
            JSON.stringify({
              address: state.value.address,
              lat: state.value.lat,
              lon: state.value.lon
            })
          )
          report() // 进行打款操作
        })
        .catch(() => {
          // on cancel
        })
    }

    // 点击去选择定位
    const choosePos = () => {
      localStorage.setItem('beeReportPublishState', JSON.stringify(state.value))
      Router.push({
        name: 'culturalProBigFarmerMapApply'
      })
    }

    // 上传
    const report = () => {
      Toast.loading({ duration: 0, message: '提交中...', forbidClick: true })
      let img_id = ''
      for (let item of state.value.imgList) {
        img_id += item.id + ','
      }
      img_id = img_id.substring(0, img_id.length - 1)
      Request.majorSubmitHiveReport({
        lon: state.value.lon,
        lat: state.value.lat,
        img_id,
        farmer_id: state.value.farmer_id,
        hive_id: state.value.hive_id,
        address: state.value.address
      })
        .then((e) => {
          if (e.code === 0) {
            Toast('上传成功！')
            setTimeout(() => {
              Router.go(-1)
            }, 250)
          } else {
            Toast.clear()
          }
        })
        .catch(() => {
          Toast.clear()
        })
    }

    // 这里去获取当前的经纬度
    const getLonLat = () => {
      let obj = JSON.parse(sessionStorage.getItem('bigFarmerApplyMap'))
      if (obj && obj.lat) {
        state.value.lat = obj.lat
        state.value.lon = obj.lng
        state.value.address = obj.address
      } else {
        if (localStorage.getItem('bigBeeReportPublishAddress')) {
          let store = JSON.parse(localStorage.getItem('bigBeeReportPublishAddress'))
          state.value.lat = store.lat
          state.value.lon = store.lon
          state.value.address = store.address
        }
      }
      sessionStorage.removeItem('bigFarmerApplyMap')
    }

    // 重新初始化当前状态等数据
    const init = () => {
      let obj = JSON.parse(localStorage.getItem('beeReportPublishState'))
      if (obj && obj.imgList) {
        state.value.imgList = obj.imgList
        setTimeout(() => {
          imageRef.value.init()
        }, 250)
      }
      setTimeout(() => {
        localStorage.removeItem('beeReportPublishState')
      }, 500)
    }

    // onBeforeRouteLeave((to, from) => {
    //   // console.log(to);
    //   //离开当前的组件，触发
    //   if (to.fullPath.indexOf('/map') != -1) {
    //     console.log(state.value)
    //     localStorage.setItem('beeReportPublishState', JSON.stringify(state.value))
    //   }
    // })

    onMounted(() => {
      if (Route.query.hive_id && Route.query.farmer_id) {
        state.value.hive_id = Route.query.hive_id
        state.value.farmer_id = Route.query.farmer_id
        init()
        getLonLat()
      } else {
        Dialog.alert({
          message: '获取详情失败，请返回重试！',
          confirmButtonColor: '#FF844E'
        })
          .then(() => {
            Router.go(-1)
          })
          .catch(() => {})
      }
    })

    return {
      imageRef,
      state,
      dealUpload,
      dealDelete,
      submit,
      choosePos
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../../../assets/css/fit.less';
.locationCon {
  padding-right: 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.outerWrapper {
  padding: 0 30px;
  box-sizing: border-box;
}
.jumpTrigger {
  width: 130px;
  height: 50px;
  font-size: 24px;
  line-height: 50px;
  text-align: center;
  background-color: #ff844e;
  color: #fff;
  border-radius: 10px;
}
.submit {
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
}

.bottom {
  position: fixed;
  bottom: 30px;
  bottom: calc(30px+ constant(safe-area-inset-bottom));
  bottom: calc(30px + env(safe-area-inset-bottom));
  left: 10%;
  width: 80%;
}
</style>
