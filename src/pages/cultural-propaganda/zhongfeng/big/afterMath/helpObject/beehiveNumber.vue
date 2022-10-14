<template>
  <div class="beeHiveNumberCon">
    <div class="topAreaWhite">
      <div class="item">
        <div class="homeTag">
          <div class="tagLine"></div>
          <div class="tagText">蜂箱</div>
        </div>
      </div>
      <div class="twoPixelBorder">
        <van-cell-group inset>
          <div class="locationCon">
            <van-field v-model="state.form.address" :readonly="state.cannotOperate" required label="详细地址" placeholder="请输入详细地址" />
            <div class="jumpTrigger" @click="toMap1" v-if="!state.cannotOperate">定位<van-icon name="arrow" /></div>
          </div>
          <van-field v-model="state.form.lon" :readonly="state.cannotOperate" required label="经度" placeholder="请输入经度" />
          <van-field v-model="state.form.lat" :readonly="state.cannotOperate" required label="纬度" placeholder="请输入纬度" />
        </van-cell-group>
        <!-- <div class="item resetItem">
          <span>养殖地点</span>
          <div class="itemContent" @click="toMap1">{{ state.form.address || '请选择' }}<van-icon name="arrow" /></div>
        </div>
        <div class="addressSmall" v-if="state.form.lon">经度：{{ state.form.lon }} 纬度：{{ state.form.lat }}</div> -->
      </div>
      <div class="pic">
        <div class="picTitle">
          <p>蜂场照片</p>
          <div class="picDescribe">请按要求分别上传两张图片</div>
        </div>
        <div class="idMaster">
          <div class="idFrontCon" :style="state.idFrontImgObj" @click="choiceImg(2)">
            <van-icon class="delete" name="clear" @click.stop="toDeleteFront" v-if="state.form.idFront.length && !state.cannotOperate" />
          </div>
          <div class="idBackCon" :style="state.idBackImgObj" @click="choiceImg(3)">
            <van-icon class="delete" name="clear" @click.stop="toDeleteBack" v-if="state.form.idBack.length && !state.cannotOperate" />
          </div>
        </div>
      </div>
    </div>
    <div class="bottomArea" v-if="!state.cannotOperate">
      <div class="button positiveBtn" @click="saveAction">保存上传</div>
    </div>
    <input type="file" accept="image/*" id="upload_box" style="display: none" @change="upload" />
  </div>
</template>
<script>
import { Toast, ImagePreview } from 'vant'
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
import lrz from 'lrz'
import OSS from 'ali-oss'
export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      firstReason: '',
      firstShow: false,
      active: 0,
      ZLBFLAG: isZLB(),
      cannotOperate: false,
      form: {
        hive_no: '',
        lon: '',
        address: '',
        lat: '',
        idFront: [],
        idBack: []
      },
      idTrackFlag: 1,
      idFrontImgObj: {},
      idBackImgObj: {},
      client: {}
    })
    onMounted(() => {
      fetchOss()
      initAction()
    })
    const fetchOss = () => {
      if (state.ZLBFLAG) {
        mgop({
          api: 'mgop.zjanchu.gfb.ossInfo', // 必须
          host: 'https://mapi.zjzwfw.gov.cn/',
          dataType: 'JSON',
          type: 'POST',
          appKey: 'djk0at4y+2001885902+zngwuf', // 必须
          header: {
            Accept: 'application/prs.xkm.v1.0.0+json',
            Authorization: localStorage.getItem('token') || ''
            // isTestUrl: '1'
          },
          onSuccess: (data) => {
            let shazam = data.data
            if (shazam && shazam.code === 0) {
              state.client = new OSS({
                region: shazam.data.region,
                accessKeyId: shazam.data.accessKeyId,
                accessKeySecret: shazam.data.accessKeySecret,
                bucket: shazam.data.bucket
              })
              state.client.path = shazam.data.path
            }
          }
        })
      }
    }
    const popPreview = (array, index) => {
      ImagePreview({
        images: array,
        startPosition: index,
        closeable: true
      })
    }
    const initAction = () => {
      resetIDLeft()
      resetIDRight()
      setInitValue()
    }
    const choiceImg = (index) => {
      if (state.cannotOperate) {
        //
      } else {
        state.idTrackFlag = index
        document.getElementById('upload_box').click()
      }
    }
    const upload = (e) => {
      let fileObj = e.target.files[0]
      let legal = fileObj.type == 'image/jpeg' || fileObj.type == 'image/jpg' || fileObj.type == 'image/png' || fileObj.type == 'image/gif'
      if (legal) {
        if (fileObj) {
          lrz(fileObj, { width: 600 }).then(async (result) => {
            if (state.ZLBFLAG) {
              let shorter = result.file
              let url = `${state.client.path}/${fileObj.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${shorter.type.split('/')[1]}`
              let reader = new FileReader()
              reader.readAsDataURL(shorter)
              reader.onloadend = () => {
                state.client.multipartUpload(url, shorter).then(async (data) => {
                  let str = data.res.requestUrls[0]
                  mgop({
                    api: 'mgop.zjanchu.gfb.zlbUpload', // 必须
                    host: 'https://mapi.zjzwfw.gov.cn/',
                    dataType: 'JSON',
                    type: 'POST',
                    appKey: 'djk0at4y+2001885902+zngwuf', // 必须
                    data: {
                      osspath: str.split('?')[0]
                    },
                    header: {
                      Authorization: localStorage.getItem('token') || '',
                      Accept: 'application/prs.xkm.v1.0.0+json'
                      //   isTestUrl: '1'
                    },
                    onSuccess: (data) => {
                      let shazam = data.data
                      if (shazam && shazam.code === 0) {
                        if (state.idTrackFlag == 3) {
                          state.form.idBack = [
                            {
                              id: shazam.data.id,
                              url: shazam.data.url
                            }
                          ]
                          state.idBackImgObj = {
                            backgroundImage: 'url(' + shazam.data.url + ')'
                          }
                          e.target.value = ''
                        } else if (state.idTrackFlag == 2) {
                          state.form.idFront = [
                            {
                              id: shazam.data.id,
                              url: shazam.data.url
                            }
                          ]
                          state.idFrontImgObj = {
                            backgroundImage: 'url(' + shazam.data.url + ')'
                          }
                          e.target.value = ''
                        }
                      } else {
                        Toast(shazam.msg)
                      }
                    },
                    onFail: (err) => {
                      console.log(err, 'errrr')
                    }
                  })
                })
              }
            } else {
              let params = new FormData()
              params.append('file', result.file, fileObj.name)
              Request.upload(params).then((res) => {
                if (res.code === 0) {
                  if (state.idTrackFlag == 3) {
                    state.form.idBack = [
                      {
                        id: res.data.id,
                        url: res.data.url
                      }
                    ]
                    state.idBackImgObj = {
                      backgroundImage: 'url(' + res.data.url + ')'
                    }
                    e.target.value = ''
                  } else if (state.idTrackFlag == 2) {
                    state.form.idFront = [
                      {
                        id: res.data.id,
                        url: res.data.url
                      }
                    ]
                    state.idFrontImgObj = {
                      backgroundImage: 'url(' + res.data.url + ')'
                    }
                    e.target.value = ''
                  }
                }
              })
            }
          })
        }
      } else {
        return Toast('请上传jpeg,jpg,png,gif图片')
      }
    }
    const toDeleteFront = () => {
      state.form.idFront = []
      resetIDLeft()
    }
    const toDeleteBack = () => {
      state.form.idBack = []
      resetIDRight()
    }

    const resetIDLeft = () => {
      state.idFrontImgObj = {
        backgroundImage: 'url(' + 'https://img.hzanchu.com/acimg/b58880110d1a720ad3c5d7cd7b3389bd.png' + ')'
      }
    }
    const resetIDRight = () => {
      state.idBackImgObj = {
        backgroundImage: 'url(' + 'https://img.hzanchu.com/acimg/7c12dbe79b418b750ae42a9f7f74bdc7.png' + ')'
      }
    }
    const saveAction = () => {
      if (!state.form.address) {
        return Toast.fail('详细地址不能为空')
      }
      if (!state.form.lon) {
        return Toast.fail('经度不能为空')
      }
      if (!state.form.lat) {
        return Toast.fail('纬度不能为空')
      }
      if (!state.form.idFront.length && !state.form.idBack.length) {
        return Toast.fail('蜂场照片不能为空')
      }
      //   if (!state.form.idBack.length) {
      //     return Toast.fail('蜂场照片不能为空')
      //   }
      if (Route.query.id) {
        let mix =
          state.form.idFront.length && state.form.idFront[0].id && state.form.idBack.length && state.form.idBack[0].id
            ? state.form.idFront[0].id + ',' + state.form.idBack[0].id
            : state.form.idFront.length && state.form.idFront[0].id
            ? state.form.idFront[0].id
            : state.form.idBack.length && state.form.idBack[0].id
        let data1 = {
          img_id: mix,
          farmer_id: Route.query.farmer_id,
          hive_no: state.form.hive_no,
          lon: state.form.lon,
          lat: state.form.lat,
          address: state.form.address,
          id: Route.query.id
        }
        localStorage.setItem(
          'bigBeeHiveNumberAddress',
          JSON.stringify({
            address: state.form.address,
            lon: state.form.lon,
            lat: state.form.lat
          })
        )
        Request.beeMajorEditHive(data1)
          .then((res) => {
            if (res && res.code == 0) {
              Router.go(-1)
              sessionStorage.removeItem('bigHiveNumberData1')
              sessionStorage.removeItem('bigHiveNumberData2')
              sessionStorage.removeItem('bigHiveNumberDataidBackImgObj')
              sessionStorage.removeItem('bigHiveNumberDataidFrontImgObj')
              sessionStorage.removeItem('bigHelp1Address')
              sessionStorage.removeItem('bigHelp2Address')
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        let mix =
          state.form.idFront.length && state.form.idFront[0].id && state.form.idBack.length && state.form.idBack[0].id
            ? state.form.idFront[0].id + ',' + state.form.idBack[0].id
            : state.form.idFront.length && state.form.idFront[0].id
            ? state.form.idFront[0].id
            : state.form.idBack.length && state.form.idBack[0].id
        let data1 = {
          img_id: mix,
          farmer_id: Route.query.farmer_id,
          hive_no: state.form.hive_no,
          lon: state.form.lon,
          lat: state.form.lat,
          address: state.form.address
        }
        localStorage.setItem(
          'bigBeeHiveNumberAddress',
          JSON.stringify({
            address: state.form.address,
            lon: state.form.lon,
            lat: state.form.lat
          })
        )
        Request.majorSubmitHive(data1)
          .then((res) => {
            if (res && res.code == 0) {
              Router.go(-1)
              sessionStorage.removeItem('bigHiveNumberData1')
              sessionStorage.removeItem('bigHiveNumberData2')
              sessionStorage.removeItem('bigHiveNumberDataidBackImgObj')
              sessionStorage.removeItem('bigHiveNumberDataidFrontImgObj')
              sessionStorage.removeItem('bigHelp1Address')
              sessionStorage.removeItem('bigHelp2Address')
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    }
    const toMap1 = () => {
      toMapSaveAction()
      Router.push({
        name: 'culturalProBigHelpMap1'
      })
    }
    const toMapSaveAction = () => {
      sessionStorage.setItem('bigHiveNumberData1', JSON.stringify(state.form))
      sessionStorage.setItem('bigHiveNumberDataidBackImgObj', JSON.stringify(state.idBackImgObj))
      sessionStorage.setItem('bigHiveNumberDataidFrontImgObj', JSON.stringify(state.idFrontImgObj))
    }
    const analyseStorage = () => {
      if (sessionStorage.getItem('bigHiveNumberData1')) {
        state.form = JSON.parse(sessionStorage.getItem('bigHiveNumberData1'))
      }
      if (sessionStorage.getItem('bigHelp1Address')) {
        state.form.address = JSON.parse(sessionStorage.getItem('bigHelp1Address')).address
        state.form.lon = JSON.parse(sessionStorage.getItem('bigHelp1Address')).lng
        state.form.lat = JSON.parse(sessionStorage.getItem('bigHelp1Address')).lat
      } else {
        //提交后永久保存的地图数据
        if (localStorage.getItem('bigBeeHiveNumberAddress')) {
          let store = JSON.parse(localStorage.getItem('bigBeeHiveNumberAddress'))
          state.form.lat = store.lat
          state.form.lon = store.lon
          state.form.address = store.address
        }
      }
      if (sessionStorage.getItem('bigHiveNumberDataidBackImgObj')) {
        state.idBackImgObj = JSON.parse(sessionStorage.getItem('bigHiveNumberDataidBackImgObj'))
      }
      if (sessionStorage.getItem('bigHiveNumberDataidFrontImgObj')) {
        state.idFrontImgObj = JSON.parse(sessionStorage.getItem('bigHiveNumberDataidFrontImgObj'))
      }
    }
    const setInitValue = () => {
      if (Route.query.operateDisable == '1') {
        state.cannotOperate = true
      } else {
        state.cannotOperate = false
      }
      if (Route.query.id) {
        let data = {
          hive_id: Route.query.id,
          farmer_id: Route.query.farmer_id
        }
        Request.beeMajorHiveInfo(data)
          .then((res) => {
            if (res && res.code == 0) {
              let shorter = res.data
              let idsSplit = shorter.img_id.split(',')
              if (sessionStorage.getItem('bigHiveNumberData1')) {
                //
              } else {
                state.form = {
                  hive_no: shorter.hive_no,
                  lon: shorter.lon,
                  address: shorter.address,
                  lat: shorter.lat,
                  idFront:
                    idsSplit.length > 1
                      ? [
                          {
                            id: idsSplit[0],
                            url: shorter.img_url[0]
                          }
                        ]
                      : [
                          {
                            id: idsSplit[0],
                            url: shorter.img_url[0]
                          }
                        ],
                  idBack:
                    idsSplit.length > 1
                      ? [
                          {
                            id: idsSplit[1],
                            url: shorter.img_url[1]
                          }
                        ]
                      : []
                }
              }
              if (sessionStorage.getItem('bigHiveNumberDataidBackImgObj')) {
                //
              } else {
                if (idsSplit.length > 1) {
                  state.idFrontImgObj = {
                    backgroundImage: 'url(' + shorter.img_url[1] + ')'
                  }
                  state.idBackImgObj = {
                    backgroundImage: 'url(' + shorter.img_url[0] + ')'
                  }
                } else {
                  state.idFrontImgObj = {
                    backgroundImage: 'url(' + shorter.img_url[0] + ')'
                  }
                }
              }
              if (sessionStorage.getItem('bigHiveNumberDataidFrontImgObj')) {
                //
              } else {
                if (idsSplit.length > 1) {
                  state.idFrontImgObj = {
                    backgroundImage: 'url(' + shorter.img_url[1] + ')'
                  }
                  state.idBackImgObj = {
                    backgroundImage: 'url(' + shorter.img_url[0] + ')'
                  }
                } else {
                  state.idFrontImgObj = {
                    backgroundImage: 'url(' + shorter.img_url[0] + ')'
                  }
                }
              }
              analyseStorage()
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
      analyseStorage()
    }
    return {
      toMapSaveAction,
      setInitValue,
      toMap1,
      saveAction,
      choiceImg,
      upload,
      toDeleteFront,
      toDeleteBack,
      popPreview,
      state
    }
  }
}
</script>

<style lang="less" scoped>
.topAreaWhite {
  background-color: #fff;
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
  margin-top: 30px;
  margin-bottom: 15px;
}
.middleAreaWhite {
  background-color: #fff;
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
  margin-top: 30px;
  margin-bottom: 15px;
}
.bottomArea {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  padding-top: 30px;
  box-sizing: border-box;
  padding-bottom: 60px;
}
.button {
  width: 73.33%;
  height: 70px;
  border-radius: 35px;
  font-size: 32px;
  color: #fff;
  text-align: center;
  line-height: 70px;
}
.positiveBtn {
  background: linear-gradient(#ff844e 0%, #fe6d56 100%);
}
.ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.item {
  height: 86px;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #ebebeb;
  &:last-child {
    border: none;
  }
  span {
    font-size: 28px;
    color: #333;
    width: 246px;
  }
  span:nth-of-type(2) {
    width: auto;
    margin-left: auto;
  }

  .itemContent {
    width: 410px;
    height: 100%;
    text-align: right;
    font-size: 28px;
    color: #333;
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
    align-content: center;
    align-items: center;
  }
  small {
    font-size: 28px;
    color: #333;
    width: 90%;
    overflow: hidden;
  }
  input {
    width: 410px;
    height: 100%;
    text-align: right;
    font-size: 28px;
    color: #333;
    margin-left: auto;
  }
  .van-icon {
    font-size: 30px;
    margin-left: 16px;
    color: #666;
  }
}
.picTitle {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  .picDescribe {
    font-size: 26px;
    margin-top: 30px;
    color: #ccc;
    margin-left: 20px;
  }
}
.resetItem {
  height: 140px;
  border-bottom: none;
}
.twoPixelBorder {
  border-bottom: 2px solid #ebebeb;
}
.locationCon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
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
.addressSmall {
  font-size: 28px;
  color: #333;
  text-align: right;
  margin-bottom: 20px;
}
.idMaster {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  margin-top: 35px;
}
.idFrontCon {
  margin-right: 40px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 292px;
  height: 191px;
  position: relative;
  .delete {
    position: absolute;
    font-size: 36px;
    top: -18px;
    right: -18px;
    color: #ccc;
  }
}
.idBackCon {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 292px;
  height: 191px;
  position: relative;
  .delete {
    position: absolute;
    font-size: 36px;
    top: -18px;
    right: -18px;
    color: #ccc;
  }
}
.pic {
  border-bottom: 2px solid #ebebeb;
  padding-bottom: 40px;
  box-sizing: border-box;
  p {
    font-size: 28px;
    color: #333;
    margin-top: 30px;
  }
}
.pic:nth-last-child(1) {
  border: 0;
}
.beeHiveNumberCon {
  box-sizing: border-box;
}
.commonShadow {
  width: 100%;
  background-color: #fff;
  border: 1px solid rgba(0, 31, 116, 0);
  box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  margin-bottom: 24px;
  padding: 30px;
  box-sizing: border-box;
}
.marginRight30 {
  margin-right: 30px;
}
.marginBottom24 {
  margin-bottom: 24px;
}
.itemCon {
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 30px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
