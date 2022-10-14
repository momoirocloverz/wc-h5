<template>
  <div class="assetUtilCon">
    <div class="hintBlock">请确保信息真实、有效，如若不实，一切后果将由发布者承担</div>
    <div class="topCon">
      <div class="firstSelectionCon">
        <div class="title">选择发布类型</div>
        <div class="topArrayCon">
          <div class="baseStyle" @click="switchType(index)" :class="[state.activeNow == index ? 'activeStyle' : '']" v-for="(item, index) in state.topArray" :key="index">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
    <div class="middleCon">
      <div>
        <field label v-model.trim="state.title" clearable placeholder="请填写标题，最多10个字" maxlength="10" />
        <div class="fakeBorder"></div>
      </div>
      <div class="hugeCon">
        <field label v-model.trim="state.content" type="textarea" rows="4" clearable placeholder="请填写您需要发布的内容，最少10个字" maxlength="1000" />
        <div class="uploadCon">
          <van-uploader v-model="state.fileList" max-count="5" :after-read="afterRead" @delete="deleteAction" />
        </div>
      </div>
    </div>
    <div class="bottomCon">
      <cell-group>
        <cell is-link @click="popDialog" title="价格（元）">
          <template #default>{{ state.price }}元</template>
        </cell>
        <field label="面积" clearable v-model.trim="state.area" input-align="right" placeholder="请输入面积" type="number" maxlength="11" />
        <cell is-link @click="popUnit" title="单位">
          <template #default>{{ state.unit ? state.unit : '请选择' }}</template>
        </cell>
        <field label="联系电话" readonly clearable v-model.trim="state.showMobile" input-align="right" placeholder="请输入联系电话" maxlength="11" />
        <field input-align="right" v-model="state.addressIdsString" disabled name="addressIdsString" placeholder="请选择村镇" class="removeDisabled" label="村镇" @click="popAddress" />
        <cell title="联系地址"></cell>
        <field label type="textarea" rows="2" v-model.trim="state.address" clearable placeholder="请输入联系地址，如楼道，门牌号等" maxlength="100" />
      </cell-group>
    </div>
    <div class="buttonCon">
      <div class="fakeBtn" :class="[!state.title || !state.content || !state.price || !state.unit || !state.address || !state.mobile || !state.town ? '' : 'ableBtn']" @click="action">发 布</div>
    </div>
    <popup position="bottom" v-model:show="state.showPicker">
      <picker title="单位" @confirm="onConfirm" @cancel="onCancel" @change="onChange" :columns="columns" :default-index="state.pickerDefault" />
    </popup>
    <div class="mask" v-show="state.show">
      <div class="dialogWhite">
        <div>
          <radio-group class="dialogRadio" v-model="state.priceType" direction="horizontal">
            <div>
              <radio name="1">价格（元）</radio>
              <field label type="number" :disabled="state.priceType == '2'" class="dialogField" clearable v-model.trim="state.price1" placeholder="填写价格" maxlength="11" />
            </div>
            <div class="secondLine">
              <radio name="2">价格区间（元）</radio>
              <div class="levelCon">
                <input v-model.trim="state.price2" type="number" :disabled="state.priceType == '1'" placeholder="最低价" />
                <span>至</span>
                <input :disabled="state.priceType == '1'" type="number" v-model.trim="state.price3" placeholder="最高价" />
              </div>
            </div>
          </radio-group>
        </div>
        <div class="buttomBtnCon">
          <div class="cancelD" @click="cancelDialog">取消</div>
          <div class="confirmD" @click="confirmDialog">确认</div>
        </div>
      </div>
    </div>
    <div class="dialogMask" v-show="state.showDialog">
      <div class="dialogWhite">
        <img src="https://img.hzanchu.com/acimg/de183258777d511a934fbda1d84cebf6.png" />
        <div class="success">发布成功</div>
        <div class="infoCon">
          <div class="line1">请保持手机通畅，审核员</div>
          <div class="line2">会在7-14个工作日内给您回电</div>
        </div>
        <div class="confirmPopBtn" @click="confirmAction">确定</div>
      </div>
    </div>
    <van-popup v-model:show="state.showPop" round position="bottom">
      <van-cascader v-model="state.cascaderValue" title="请选择所在地区" :field-names="fieldNames" :options="state.options" @close="state.showPop = false" @change="onPopChange" @finish="onFinish" />
    </van-popup>
  </div>
</template>
<script>
import Request from '@/service/request.js'
import { reactive, onMounted } from 'vue'
import { Cell, CellGroup, Field, RadioGroup, Radio, Picker, Popup, Toast, Dialog } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import lrz from 'lrz'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
import OSS from 'ali-oss'
export default {
  components: {
    Cell,
    CellGroup,
    Field,
    RadioGroup,
    Radio,
    Picker,
    Popup
  },
  setup() {
    const state = reactive({
      options: [],
      showDialog: false,
      name: '',
      cascaderValue: '',
      area: '',
      town: '',
      village: '',
      showPop: false,
      price: '',
      customFieldName: {
        text: 'town_name'
      },
      priceType: '1',
      price1: '',
      price2: '',
      price3: '',
      activeNow: 0,
      id: '',
      showMobile: '',
      showPicker: false,
      show: false,
      gender: '1',
      fileList: [],
      image_ids: [],
      topArray: [
        // {
        //   title: '房屋租赁',
        //   id: '房屋租赁'
        // },
      ],
      ZLBFLAG: isZLB()
    })
    const Router = useRouter()
    const Route = useRoute()
    const columns = ['平方米', '公顷', '平方厘米', '平方公里']
    const fieldNames = {
      text: 'town_name',
      value: 'id',
      children: 'children'
    }
    const action = () => {
      if (!state.title || !state.content || !state.price || !state.unit || !state.address || !state.mobile || !state.town) {
        return Toast('信息不能为空')
      }
      if (state.fileList && !state.fileList.length) {
        return Toast('请上传图片')
      }
      if (state.content.length < 10) {
        return Toast('发布内容最少10个字')
      }
      submit()
      //   if (state.fileList.length) {
      //     uploadImg(0)
      //   } else {
      //     submit()
      //   }
    }
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
    onMounted(() => {
      fetchOss()
      fetchTown()
      fetchUserInfo()
    })
    const fetchUserInfo = () => {
      Request.getUserInfo()
        .then((res) => {
          if (res && res.code === 0) {
            console.log('res', res.data)
            state.mobile = res.data.mobile
            state.showMobile = res.data.mobile.replace(res.data.mobile.substr(3, 4), '****')
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const fetchTypes = () => {
      Request.propertyType().then((res) => {
        if (res.code === 0) {
          let after = res.data.map((ele) => {
            return {
              ...ele,
              title: ele.name
            }
          })
          state.topArray = after
          fetchDetail()
        }
      })
    }
    const fetchDetail = () => {
      let id = Route.query.id
      if (id) {
        Request.propertyInfo({
          property_id: id
        })
          .then((res) => {
            if (res && res.code == 0) {
              let shorter = res.data
              state.ids = [shorter.town_id, shorter.village_id]
              state.town = shorter.town_name
              state.cascaderValue = state.ids.join('/')
              Request.getVillage({ town_id: shorter.town_id }).then((res) => {
                if (res.code === 0) {
                  let track = state.options.find((ele) => {
                    return ele.id == shorter.town_id
                  })
                  let after = res.data.map((ele) => {
                    return {
                      ...ele,
                      town_name: ele.village_name
                    }
                  })
                  track.children = after
                  state.village = after.find((ele) => {
                    return ele.id == shorter.village_id
                  }).town_name
                  state.addressIdsString = state.town + state.village
                }
              })
              let trackIndex = state.topArray.findIndex((ele) => {
                return ele.id == shorter.release_type
              })
              state.activeNow = trackIndex
              state.title = shorter.title
              state.content = shorter.content
              state.unit = shorter.unit
              state.area = shorter.area
              state.mobile = shorter.mobile
              state.address = shorter.address
              let ids = shorter.image.split(',')
              state.image_ids = ids
              state.fileList = shorter.image_path.map((ele, index) => {
                return {
                  url: ele,
                  id: ids[index]
                }
              })
              let checkPriceType = shorter.price.includes('-')
              state.price = shorter.price
              if (checkPriceType) {
                state.priceType = '2'
                let splitRes = shorter.price.split('-')
                state.price2 = splitRes[0]
                state.price3 = splitRes[1]
              } else {
                state.priceType = '1'
                state.price1 = shorter.price
              }
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
    const fetchTown = () => {
      Request.getTown().then((res) => {
        if (res.code === 0) {
          state.options = res.data.map((ele) => {
            return {
              ...ele,
              children: []
            }
          })
        }
        fetchTypes()
      })
    }
    const onFinish = ({ selectedOptions }) => {
      state.showPop = false
      state.town = selectedOptions[0].town_name
      state.village = selectedOptions[1].town_name
      state.cascaderValue = selectedOptions.map((option) => option.id).join('/')
      state.ids = [selectedOptions[0].id, selectedOptions[1].id]
      state.addressIdsString = selectedOptions[0].town_name + selectedOptions[1].town_name
    }
    const onPopChange = ({ value, tabIndex }) => {
      if (tabIndex == 0) {
        Request.getVillage({ town_id: value }).then((res) => {
          if (res.code === 0) {
            let track = state.options.find((ele) => {
              return ele.id == value
            })
            let after = res.data.map((ele) => {
              return {
                ...ele,
                town_name: ele.village_name
              }
            })
            track.children = after
          }
        })
      }
    }
    const popAddress = () => {
      state.showPop = true
    }
    const uploadImg = (index) => {
      lrz(state.fileList[index].file, { width: 600 }).then((res) => {
        if (state.ZLBFLAG) {
          let fileObj = res.file
          let url = `${state.client.path}/${state.fileList[index].file.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${fileObj.type.split('/')[1]}`
          let reader = new FileReader()
          reader.readAsDataURL(fileObj)
          reader.onloadend = () => {
            state.client.multipartUpload(url, fileObj).then(async (data) => {
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
                    state.image_ids.push(shazam.data.id)
                    if (state.image_ids.length === state.fileList.length) {
                      submit()
                    } else {
                      uploadImg(index + 1)
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
          params.append('file', res.file, state.fileList[0].file.name)
          Request.upload(params).then((res2) => {
            if (res2.code === 0) {
              state.image_ids.push(res2.data.id)
              if (state.image_ids.length === state.fileList.length) {
                submit()
              } else {
                uploadImg(index + 1)
              }
            }
          })
        }
      })
    }
    const submit = () => {
      let id = Route.query.id
      if (id) {
        let requestData = {
          property_id: id,
          release_type: state.topArray[state.activeNow].id,
          release_name: state.topArray[state.activeNow].name,
          title: state.title,
          content: state.content,
          image: state.image_ids.length ? state.image_ids.join(',') : '',
          price: state.price,
          unit: state.unit,
          area: state.area,
          address: state.address,
          town_id: state.ids[0],
          village_id: state.ids[1],
          mobile: state.mobile
        }
        console.log('requestData', requestData)
        Request.propertyUserEditProperty(requestData).then((res) => {
          if (res && res.code == 0) {
            //   state.showDialog = true
            Dialog.confirm({
              title: '提交成功！',
              message: '请耐心等待审核，审核通过将立即发布;可前往“我的-我的资产”中查看进度。',
              confirmButtonText: '前往查看',
              cancelButtonText: '返回'
            })
              .then(() => {
                let flag1 = sessionStorage.getItem('fromMyAsset') ? sessionStorage.getItem('fromMyAsset') : ''
                if (flag1) {
                  Router.go(-1)
                } else {
                  Router.replace({
                    name: 'mineAsset'
                  })
                }
              })
              .catch(() => {
                // on cancel
                Router.replace({
                  name: 'asset-utilization'
                })
              })
          } else {
            Toast(res.msg)
          }
        })
      } else {
        let requestData = {
          release_type: state.topArray[state.activeNow].id,
          release_name: state.topArray[state.activeNow].name,
          title: state.title,
          content: state.content,
          image: state.image_ids.length ? state.image_ids.join(',') : '',
          price: state.price,
          unit: state.unit,
          area: state.area,
          address: state.address,
          town_id: state.ids[0],
          village_id: state.ids[1],
          mobile: state.mobile
        }
        console.log('requestData', requestData)
        Request.propertyAdd(requestData).then((res) => {
          if (res && res.code == 0) {
            //   state.showDialog = true
            Dialog.confirm({
              title: '提交成功！',
              message: '请耐心等待审核，审核通过将立即发布;可前往“我的-我的资产”中查看进度。',
              confirmButtonText: '前往查看',
              cancelButtonText: '返回'
            })
              .then(() => {
                // Router.replace({
                //   name: 'mineAsset',
                // })
                let flag1 = sessionStorage.getItem('fromMyAsset') ? sessionStorage.getItem('fromMyAsset') : ''
                if (flag1) {
                  Router.go(-1)
                } else {
                  Router.replace({
                    name: 'mineAsset'
                  })
                }
                //   Router.go(-1)
              })
              .catch(() => {
                // on cancel
                Router.replace({
                  name: 'asset-utilization'
                })
              })
          } else {
            Toast(res.msg)
          }
        })
      }
    }

    const cancelDialog = () => {
      state.show = false
    }
    const confirmDialog = () => {
      if (state.priceType == '1') {
        if (state.price1) {
          state.show = false
          state.price = `${state.price1}`
        } else {
          Toast('请输入单价')
        }
      } else {
        if (!state.price2 || !state.price3) {
          Toast('请输入单价')
        } else if (+state.price2 > +state.price3) {
          Toast('最低价不能大于最高价')
        } else {
          state.show = false
          state.price = `${state.price2}-${state.price3}`
        }
      }
    }
    const switchType = (index) => {
      state.activeNow = index
    }
    const popDialog = () => {
      state.show = true
    }
    const switchSecond = (index) => {
      state.secondActive = index
    }
    const popUnit = () => {
      state.showPicker = true
    }
    const onConfirm = (value, index) => {
      state.unit = value
      state.showPicker = false
    }
    const onChange = (value, index) => {
      state.pickerDefault = index
    }
    const onCancel = () => {
      state.showPicker = false
    }
    const confirmAction = () => {
      //   state.showDialog = false
      //   setTimeout(() => {
      //     sessionStorage.setItem('jobListReload', '1')
      //     Router.go(-1)
      //   }, 200)
    }
    const deleteAction = (file, index) => {
      state.image_ids.splice(index.index, 1)
    }
    const afterRead = (file) => {
      let legal = file.file.type == 'image/jpeg' || file.file.type == 'image/jpg' || file.file.type == 'image/png' || file.file.type == 'image/gif'
      if (legal) {
        file.status = 'uploading'
        file.message = '上传中...'
        lrz(file.file, { width: 600 }).then((res) => {
          let fileObj = res.file
          if (state.ZLBFLAG) {
            let url = `${state.client.path}/${res.origin.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${fileObj.type.split('/')[1]}`
            let reader = new FileReader()
            reader.readAsDataURL(fileObj)
            reader.onloadend = () => {
              state.client.multipartUpload(url, fileObj).then(async (data) => {
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
                    // isTestUrl: '1'
                  },
                  onSuccess: (data) => {
                    let shazam = data.data
                    if (shazam && shazam.code === 0) {
                      state.image_ids.push(shazam.data.id)
                      file.status = 'success'
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
            params.append('file', fileObj, res.origin.name.split('.')[0])
            Request.upload(params).then((res2) => {
              console.log(res2)
              if (res2.code === 0) {
                state.image_ids.push(res2.data.id)
                file.status = 'success'
              }
            })
          }
        })
      } else {
        return Toast('请上传jpeg,jpg,png,gif图片')
      }
    }
    return {
      state,
      columns,
      action,
      cancelDialog,
      confirmDialog,
      switchType,
      popDialog,
      switchSecond,
      popUnit,
      onConfirm,
      onChange,
      onCancel,
      confirmAction,
      popAddress,
      onFinish,
      onPopChange,
      fieldNames,
      deleteAction,
      afterRead
    }
  }
}
</script>
<style lang="less" scoped>
.hintBlock {
  background-color: rgba(253, 132, 78, 0.06);
  color: #fd844e;
  font-size: 30px;
  line-height: 40px;
  padding: 10px 32px;
}
.confirmPopBtn {
  width: 200px;
  height: 70px;
  background: #ff844e;
  border-radius: 35px;
  box-shadow: 0px 20px 30px 0px rgba(255, 79, 39, 0.2);
  line-height: 70px;
  text-align: center;
  font-size: 32px;
  font-weight: 500;
  color: #fff;
  margin: 0 auto;
}
.dialogMask {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  .dialogWhite {
    border-radius: 10px;
    background-color: #fff;
    // width: 550px;
    width: 73%;
    height: 610px;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    padding-top: 62px;
    box-sizing: border-box;
    img {
      width: 175px;
      margin: 0 auto;
    }
    .success {
      font-size: 32px;
      font-weight: 500;
      text-align: center;
      color: #333333;
      margin-top: 30px;
      margin-bottom: 27px;
    }
    .infoCon {
      font-size: 24px;
      font-weight: 500;
      text-align: center;
      color: #666666;
      line-height: 34px;
      margin-bottom: 63px;
    }
    .line1 {
    }
    .line2 {
    }
  }
}
.dialogField {
  width: 450px;
  border: 1px solid #dbdbdb;
  box-sizing: border-box;
  padding: 0;
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 32px;
  color: #ccc;
  height: 60px;
}
.levelCon {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  span {
    margin-left: 25px;
    margin-right: 25px;
    font-size: 32px;
    color: #333333;
    line-height: 50px;
  }
  input {
    width: 180px;
    height: 60px;
    font-size: 32px;
    color: #333;
    line-height: 60px;
    border: 1px solid #dbdbdb;
    box-sizing: border-box;
    padding-left: 10px;
    border-radius: 10px;
  }
}
.mask {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  .dialogWhite {
    border-radius: 10px;
    background-color: #fff;
    // width: 690px;
    width: 92%;
    height: 535px;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .buttomBtnCon {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 85px;
    width: 100%;
    border-top: 1px solid #f7f7f7;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    text-align: center;
    .cancelD {
      width: 50%;
      height: 85px;
      line-height: 85px;
      font-size: 28px;
      color: #333;
      box-sizing: border-box;
      border-right: 1px solid #f7f7f7;
    }
    .confirmD {
      height: 85px;
      line-height: 85px;
      width: 50%;
      font-size: 28px;
      color: #fe6d56;
    }
  }
}
.uploadCon {
  padding-left: 30px;
  box-sizing: border-box;
  padding-bottom: 20px;
}
.genderCon {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}
.setFieldWidth {
  width: 70%;
}
.radioParent {
  font-size: 18px;
}
.assetUtilCon {
  .topCon {
    background-color: #fff;
    margin-bottom: 15px;
    box-sizing: border-box;
    padding-left: 30px;
    .firstSelectionCon {
    }
    .title {
      padding-top: 40px;
      font-size: 28px;
      text-align: left;
      color: #333;
      padding-bottom: 40px;
    }
    .describe {
      font-size: 28px;
      text-align: left;
      color: #333;
      padding-top: 40px;
      padding-bottom: 24px;
    }
    .topArrayCon {
      display: flex;
      justify-content: flex-start;
      align-content: center;
      align-items: center;
      flex-wrap: wrap;
      padding-bottom: 40px;
      box-sizing: border-box;
    }
    .baseStyle {
      width: 150px;
      height: 60px;
      margin-bottom: 10px;
      border-radius: 30px;
      line-height: 60px;
      box-sizing: border-box;
      font-size: 28px;
      text-align: center;
      color: #999;
      border: 2px solid #999;
      margin-right: 30px;
    }
    .activeStyle {
      background: linear-gradient(to right, #ff844e 0%, #fe6d56 100%);
      border-color: rgba(0, 0, 0, 0);
      color: #fff;
    }
  }
  .middleCon {
    background-color: #fff;
    margin-bottom: 15px;
  }
  .bottomCon {
  }
  .buttonCon {
    padding-left: 100px;
    padding-right: 100px;
    box-sizing: border-box;
    margin-top: 50px;
    margin-bottom: 50px;
  }
  .fakeBtn {
    font-size: 32px;
    height: 70px;
    border-radius: 35px;
    background-color: #d1d1d1;
    text-align: center;
    line-height: 70px;
    color: #fff;
  }
  .ableBtn {
    background: linear-gradient(to right, #ff844e 0%, #fe6d56 100%);
  }
  .dialogRadio {
    box-sizing: border-box;
    padding: 50px;
    display: block;
  }
}
</style>
<style lang="less">
.assetUtilCon {
  .van-radio__icon--checked .van-icon {
    background-color: #fe6d56;
    border-color: #fe6d56;
  }
  .dialogRadio {
    .van-radio__label {
      font-size: 32px;
      color: #333;
      line-height: 50px;
    }
  }
  .van-radio__label {
    font-size: 24px;
  }
  .hugeCon {
    .van-cell::after {
      border-bottom-color: rgba(0, 0, 0, 0);
    }
  }
  .removeDisabled {
    .van-field__label {
      color: #646566 !important;
    }
    .van-field__control:disabled {
      color: rgb(50, 50, 51) !important;
      -webkit-text-fill-color: rgb(50, 50, 51) !important;
    }
    .van-cell__value {
      color: rgb(50, 50, 51) !important;
    }
  }
}
</style>
