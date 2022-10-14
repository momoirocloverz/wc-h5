<template>
  <div class="bigFarmerApplyCon">
    <BeeProgress activeStep="1" :textList="['基础资料', '资格自评']"></BeeProgress>

    <title-bar title="企业信息"></title-bar>
    <div class="form fs-28">
      <acfield title="企业名称">
        <input type="text" maxlength="50" v-model.trim="state.form.company_name" placeholder="请输入" />
      </acfield>
      <acfield title="社会统一信用代码">
        <input type="text" maxlength="50" v-model.trim="state.form.credit_code" placeholder="请输入" />
      </acfield>
      <acfield title="法定代表人">
        <input type="text" maxlength="50" v-model.trim="state.form.legal_rep" placeholder="请输入" />
      </acfield>
      <acfield title="法定代表人电话">
        <!-- type="number" -->
        <input maxlength="11" v-model.trim="state.form.mobile" placeholder="请输入" />
      </acfield>
      <acfield title="开户行">
        <input type="text" maxlength="50" v-model.trim="state.form.bank_name" placeholder="请输入" />
      </acfield>
      <acfield title="开户名称">
        <input type="text" maxlength="50" v-model.trim="state.form.bank_user" placeholder="请输入" />
      </acfield>
      <acfield title="银行账号">
        <input type="text" maxlength="50" v-model.trim="state.form.bank_card" placeholder="请输入" />
      </acfield>
      <acfield title="镇村">
        <div class="_field-arrow" @click="popTown">
          {{ state.form.village_id == '' || state.form.village_id == 0 ? '请选择村镇' : state.form.town_name + state.form.village_name }}
        </div>
      </acfield>
    </div>
    <title-bar title="联系人信息"></title-bar>
    <div class="form fs-28">
      <acfield title="联系人姓名">
        <input type="text" maxlength="50" v-model.trim="state.form.linkman" placeholder="请输入" />
      </acfield>
      <acfield title="联系电话">
        <!-- type="number" -->
        <input maxlength="11" v-model.trim="state.form.linkman_mobile" placeholder="请输入" />
      </acfield>
    </div>
    <title-bar title="蜂箱信息"></title-bar>
    <div class="form fs-28">
      <acfield title="养殖地点">
        <div class="_field-arrow" @click="toMap">{{ state.form.address || '请选择' }}<van-icon name="arrow" /></div>
      </acfield>
      <acfield title="蜂箱数量（箱）">
        <input type="number" maxlength="6" v-model.trim="state.form.train_hive" placeholder="请输入" @blur="trainHiveBlur" />
      </acfield>
      <acfield title="养殖年限（年）">
        <input type="number" maxlength="2" v-model.trim="state.form.train_year" placeholder="请输入" />
      </acfield>
      <acfield title="主要蜜源" :lineFeed="true">
        <textarea maxlength="500" rows="4" v-model.trim="state.form.bee_desc" placeholder="请输入当前养殖的主要蜜源，多个用“、”隔开" />
      </acfield>

      <acfield title="蜂场照片" tip="可上传多张，尽量拍摄全面" :lineFeed="true">
        <div class="pic-list">
          <div v-for="(item, index) in state.form.pic1" :key="item.id" class="image-box">
            <van-icon class="delete" name="clear" @click="toDelete1(index)" />
            <img :src="item.url" alt />
          </div>
          <div class="upload-btn" @click="choiceImg1">
            <van-icon name="plus" />
            <span>点击上传</span>
          </div>
        </div>
      </acfield>

      <div class="pic"></div>

      <!-- <div class="pic">
        <p>上传承诺书照片</p>
        <div class="pic-list">
          <div
            v-for="(item, index) in state.form.pic2"
            :key="item.id"
            class="image-box"
          >
            <van-icon class="delete" name="clear" @click="toDelete2(index)" />
            <img :src="item.url" alt />
          </div>
          <div
            class="upload-btn"
            v-show="state.form.pic2.length < 2"
            @click="choiceImg2"
          >
            <van-icon name="plus" />
            <span>点击上传</span>
          </div>
        </div>
      </div> -->
    </div>

    <div class="bottomArea">
      <div class="common-btn-plain" @click="goBack">上一步</div>
      <div class="common-btn" @click="toNext">下一步</div>
    </div>
    <input type="file" accept="image/*" id="upload_box" style="display: none" @change="upload" />
    <van-popup v-model:show="state.showPicker" round position="bottom">
      <van-picker
        ref="pickerTarget"
        :loading="state.loading"
        :columns="state.columns"
        :columns-field-names="customFieldName"
        @cancel="state.showPicker = false"
        @confirm="onConfirm"
        @change="pickerChange"
      />
    </van-popup>
  </div>
</template>
<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { RadioGroup, Radio, Toast, Picker, Popup } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import BeeProgress from '@/components/beeProgress'
import lrz from 'lrz'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
import OSS from 'ali-oss'
import TitleBar from '@/components/titleBar.vue'
import Acfield from '@/components/acfield.vue'
export default {
  components: {
    vanPopup: Popup,
    vanPicker: Picker,
    BeeProgress,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    TitleBar,
    Acfield
  },
  setup() {
    const pickerTarget = ref(null)
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      client: {},
      loading: false,
      storeTempTown: [],
      columns: [],
      townHolderText: '请选择村镇',
      showPicker: false,
      uploadTrack: 1,
      idFront: 'https://img.hzanchu.com/acimg/67ce63577e32f9ab28a5ee6fdd0b1ed3.png',
      idBack: 'https://img.hzanchu.com/acimg/86da62a3a6155cf6976f2f03b65a54f8.png',
      form: {
        company_name: '',
        credit_code: '',
        legal_rep: '',
        mobile: '',
        linkman: '',
        linkman_mobile: '',
        bank_name: '',
        bank_card: '',
        bank_user: '',
        bee_image: '',
        pro_image: '',
        bee_desc: '',
        address: '',
        lon: '',
        lat: '',
        town_id: '',
        village_id: '',
        train_hive: '',
        train_year: '',
        village_name: '',
        town_name: '',
        pic1: [],
        pic2: []
      }
    })
    const fetchTown = () => {
      Request.fetchPublicTown({})
        .then((res) => {
          if (res && res.code == 0) {
            state.storeTempTown = res.data
            let data = {
              town_id: res.data[0].id
            }
            Request.fetchPublicVillage(data)
              .then((subRes) => {
                if (subRes && subRes.code == 0) {
                  res.data[0].children = subRes.data.map((ele) => {
                    return {
                      ...ele,
                      town_name: ele.village_name
                    }
                  })
                  state.columns = res.data
                  state.loading = false
                } else {
                  Toast(subRes.msg)
                }
              })
              .catch((subErr) => {
                console.log('err', subErr)
              })
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
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
            // Toast('fetch Info success')
            let shazam = data.data
            // Toast(JSON.stringify(shazam))
            if (shazam && shazam.code === 0) {
              state.client = new OSS({
                region: shazam.data.region,
                accessKeyId: shazam.data.accessKeyId,
                accessKeySecret: shazam.data.accessKeySecret,
                bucket: shazam.data.bucket
              })
              state.client.path = shazam.data.path
              //   Toast(JSON.stringify(state.client))
              // console.log(state.client, 'client.value')
            }
          }
        })
      }
    }
    onMounted(() => {
      if (sessionStorage.getItem('bigFarmerApplySubmitData')) {
        initState()
      }
      fetchOss()
      initAction()
    })
    onUnmounted(() => {
      console.log(state.form.pic1)
      let data = {
        company_name: state.form.company_name,
        credit_code: state.form.credit_code,
        legal_rep: state.form.legal_rep,
        mobile: state.form.mobile,
        linkman: state.form.linkman,
        linkman_mobile: state.form.linkman_mobile,
        bank_name: state.form.bank_name,
        bank_card: state.form.bank_card,
        bee_image: state.form.pic1
          .map((ele) => {
            return ele.id
          })
          .join(','),
        bee_url: state.form.pic1
          .map((ele) => {
            return ele.url
          })
          .join(','),
        address: state.form.address,
        lon: state.form.lon,
        lat: state.form.lat,
        town_id: state.form.town_id,
        village_id: state.form.village_id,
        train_hive: state.form.train_hive,
        train_year: state.form.train_year,
        bank_user: state.form.bank_user,
        bee_desc: state.form.bee_desc,
        evaluation: 0,
        eva_info: ''
      }
      sessionStorage.setItem('bigFarmerApplySubmitData', JSON.stringify(data))
    })

    const initState = () => {
      let data = JSON.parse(sessionStorage.getItem('bigFarmerApplySubmitData'))
      state.form.company_name = data.company_name
      state.form.credit_code = data.credit_code
      state.form.legal_rep = data.legal_rep
      state.form.mobile = data.mobile
      state.form.linkman = data.linkman
      state.form.linkman_mobile = data.linkman_mobile
      state.form.bank_name = data.bank_name
      state.form.bank_card = data.bank_card
      state.form.address = data.address
      state.form.lon = data.lon
      state.form.lat = data.lat
      state.form.town_id = data.town_id
      state.form.village_id = data.village_id
      state.form.train_hive = data.train_hive
      state.form.train_year = data.train_year
      state.form.bank_user = data.bank_user
      state.form.bee_desc = data.bee_desc

      let id = data.bee_image ? data.bee_image.split(',') : []
      let url = data.bee_url ? data.bee_url.split(',') : []
      let pic1 = []
      console.log(id)

      for (let index in id) {
        pic1.push({
          url: url[index],
          id: id[index]
        })
      }
      state.form.pic1 = pic1
    }
    const choiceImg1 = () => {
      state.uploadTrack = 1
      document.getElementById('upload_box').click()
    }
    const choiceImg2 = () => {
      state.uploadTrack = 2
      document.getElementById('upload_box').click()
    }
    const upload = (e) => {
      let fileObj = e.target.files[0]
      let legal = fileObj.type == 'image/jpeg' || fileObj.type == 'image/jpg' || fileObj.type == 'image/png' || fileObj.type == 'image/gif'
      if (legal) {
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
                      if (state.uploadTrack == 1) {
                        state.form.pic1.push({
                          id: shazam.data.id,
                          url: shazam.data.url
                        })
                        e.target.value = ''
                      } else {
                        state.form.pic2.push({
                          id: shazam.data.id,
                          url: shazam.data.url
                        })
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
                if (state.uploadTrack == 1) {
                  state.form.pic1.push({
                    id: res.data.id,
                    url: res.data.url
                  })
                  e.target.value = ''
                } else {
                  state.form.pic2.push({
                    id: res.data.id,
                    url: res.data.url
                  })
                  e.target.value = ''
                }
              }
            })
          }
        })
      } else {
        return Toast('请上传jpeg,jpg,png,gif图片')
      }
    }
    const toDelete1 = (index) => {
      state.form.pic1.splice(index, 1)
    }
    const toDelete2 = (index) => {
      state.form.pic2.splice(index, 1)
    }
    const onConfirm = (value) => {
      state.showPicker = false
      // state.townHolderText = value[0].town_name + value[1].town_name;
      state.form.town_name = value[0].town_name
      state.form.village_name = value[1].village_name
      state.form.town_id = value[1].town_id
      state.form.village_id = value[1].id
    }
    const pickerChange = (value) => {
      if (value.length) {
        let findIndex = state.storeTempTown.findIndex((ele) => {
          return ele.id == value[0].id
        })
        let data = {
          town_id: value[0].id
        }
        Request.fetchPublicVillage(data)
          .then((subRes) => {
            if (subRes && subRes.code == 0) {
              const temp = subRes.data.map((ele) => {
                return {
                  ...ele,
                  town_name: ele.village_name
                }
              })
              state.storeTempTown[findIndex].children = temp
              pickerTarget.value.setColumnValues(1, temp)
              state.columns = state.storeTempTown
            } else {
              Toast(subRes.msg)
            }
          })
          .catch((subErr) => {
            console.log('err', subErr)
          })
      }
    }
    const popTown = () => {
      state.showPicker = true
      state.loading = true
      fetchTown()
    }
    const removeItem = () => {
      sessionStorage.removeItem('bigFarmerApplyFormData')
      sessionStorage.removeItem('bigFarmerApplyMap')
    }
    const toNext = () => {
      // Router.replace({
      //   name: "cultural-propaganda/zhongfeng/big/evaluation",
      // });
      const phoneReg = /^1[3-9]\d{9}$/
      const result = phoneReg.test(state.form.mobile)
      const result1 = phoneReg.test(state.form.linkman_mobile)
      if (!state.form.company_name) {
        return Toast.fail('企业名称不能为空')
      }
      if (!state.form.credit_code) {
        return Toast.fail('社会统一信用代码不能为空')
      }
      if (!state.form.legal_rep) {
        return Toast.fail('法定代表人不能为空')
      }
      if (!state.form.mobile || !result) {
        return Toast.fail('请输入正确的法定代表人电话')
      }
      if (!state.form.bank_name) {
        return Toast.fail('开户行不能为空')
      }
      if (!state.form.bank_user) {
        return Toast.fail('开户名称不能为空')
      }
      if (!state.form.bank_card) {
        return Toast.fail('银行账号不能为空')
      }
      if (!state.form.town_id) {
        return Toast.fail('镇村不能为空')
      }
      if (!state.form.village_id) {
        return Toast.fail('镇村不能为空')
      }
      if (!state.form.linkman) {
        return Toast.fail('联系人不能为空')
      }
      if (!state.form.linkman_mobile || !result1) {
        return Toast.fail('请输入正确的联系人电话')
      }
      if (!state.form.address) {
        return Toast.fail('养殖地点不能为空')
      }
      if (!state.form.lat) {
        return Toast.fail('经纬度不能为空')
      }
      if (!state.form.lon) {
        return Toast.fail('经纬度不能为空')
      }
      if (!state.form.train_hive) {
        return Toast.fail('蜂箱数量不能为空')
      }
      if (!state.form.train_year) {
        return Toast.fail('养殖年限不能为空')
      }
      if (!state.form.bee_desc) {
        return Toast.fail('主要蜜源不能为空')
      }
      if (!state.form.pic1.length) {
        return Toast.fail('蜂场照片不能为空')
      }
      let data = {
        company_name: state.form.company_name,
        credit_code: state.form.credit_code,
        legal_rep: state.form.legal_rep,
        mobile: state.form.mobile,
        linkman: state.form.linkman,
        linkman_mobile: state.form.linkman_mobile,
        bank_name: state.form.bank_name,
        bank_card: state.form.bank_card,
        bee_image: state.form.pic1
          .map((ele) => {
            return ele.id
          })
          .join(','),
        bee_url: state.form.pic1
          .map((ele) => {
            return ele.url
          })
          .join(','),
        address: state.form.address,
        lon: state.form.lon,
        lat: state.form.lat,
        town_id: state.form.town_id,
        village_id: state.form.village_id,
        train_hive: state.form.train_hive,
        train_year: state.form.train_year,
        bank_user: state.form.bank_user,
        bee_desc: state.form.bee_desc,
        evaluation: 0,
        eva_info: ''
      }

      if (Route.query.edit) {
        storeCurrentForm()
        sessionStorage.setItem('bigFarmerApplySubmitData', JSON.stringify(data))
        Router.push({
          name: 'cultural-propaganda/zhongfeng/big/evaluation',
          query: {
            edit: '1'
          }
        })
      } else {
        storeCurrentForm()
        sessionStorage.setItem('bigFarmerApplySubmitData', JSON.stringify(data))
        Router.push({
          name: 'cultural-propaganda/zhongfeng/big/evaluation'
        })
      }
    }
    const goBack = () => {
      Router.go(-1)
      // if (Route.query.edit) {
      //   Router.push({
      //     name: "culturalProBigCommitment",
      //     query: {
      //       edit: "1",
      //     },
      //   });
      // } else {
      //   Router.push({
      //     name: "culturalProBigCommitment",
      //   });
      // }
    }
    const customFieldName = {
      text: 'town_name',
      children: 'children'
    }
    const initAction = () => {
      if (Route.query.edit) {
        Request.majorInfo({})
          .then((res) => {
            if (res && res.code == 0) {
              state.form = res.data
              let newArray = res.data.bee_image.split(',')
              state.form.pic1 = res.data.bee_image_url.map((ele, index) => {
                return {
                  url: ele,
                  id: newArray[index]
                }
              })
              if (sessionStorage.getItem('bigFarmerApplyFormData')) {
                let after2Parse = JSON.parse(sessionStorage.getItem('bigFarmerApplyFormData'))
                state.form = after2Parse
                initTown()
              }
              if (sessionStorage.getItem('bigFarmerApplyMap')) {
                let afterParse = JSON.parse(sessionStorage.getItem('bigFarmerApplyMap'))
                state.form.address = afterParse.address
                state.form.lon = afterParse.lng
                state.form.lat = afterParse.lat
              }
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        if (sessionStorage.getItem('bigFarmerApplyFormData')) {
          let after2Parse = JSON.parse(sessionStorage.getItem('bigFarmerApplyFormData'))
          console.log(after2Parse)
          state.form = after2Parse
          initTown()
        }
        if (sessionStorage.getItem('bigFarmerApplyMap')) {
          let afterParse = JSON.parse(sessionStorage.getItem('bigFarmerApplyMap'))
          state.form.address = afterParse.address
          state.form.lon = afterParse.lng
          state.form.lat = afterParse.lat
        }
      }
    }
    const initTown = () => {
      if (state.form.town_id) {
        Request.fetchPublicTown({}).then((res) => {
          if (res && res.code == 0) {
            let data = {
              town_id: state.form.town_id
            }
            Request.fetchPublicVillage(data).then((subRes) => {
              if (subRes && subRes.code == 0) {
                console.log(subRes)
                let track2 = subRes.data.find((ele) => {
                  return ele.id == state.form.village_id
                })
                // state.townHolderText = track2.town_name + track2.village_name;
                state.form.town_name = track2.town_name
                state.form.village_name = track2.village_name
              } else {
                Toast(subRes.msg)
              }
            })
          } else {
            Toast(res.msg)
          }
        })
      }
    }

    const storeCurrentForm = () => {
      sessionStorage.setItem('bigFarmerApplyFormData', JSON.stringify(state.form))
    }
    const toMap = () => {
      Router.push({
        name: 'culturalProBigFarmerMapApply'
      })
      storeCurrentForm()
      //   sessionStorage.getItem('bigFarmerApplyMap')
    }

    // 这里控制输入蜂箱数量输入，最少100
    const trainHiveBlur = (e) => {
      console.log(e)
      if (e.target.value < 100) {
        state.form.train_hive = 100
      }
    }

    return {
      storeCurrentForm,
      toMap,
      pickerTarget,
      pickerChange,
      onConfirm,
      popTown,
      Route,
      choiceImg1,
      choiceImg2,
      upload,
      goBack,
      state,
      toDelete1,
      toDelete2,
      toNext,
      customFieldName,

      trainHiveBlur
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../assets/css/fit.less';

.form {
  padding: 0px 30px;
  box-sizing: border-box;
  background-color: #fff;
}
.bigFarmerApplyCon {
  box-sizing: border-box;
}

.pic-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-bottom: 30px;
  .image-box {
    width: 200px;
    height: 200px;
    position: relative;
    margin: 30px 20px 0 0;
    .delete {
      position: absolute;
      font-size: 36px;
      top: -18px;
      right: -18px;
      color: #ccc;
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
  .upload-btn {
    width: 200px;
    height: 200px;
    box-sizing: border-box;
    border: 2px dashed #ccc;
    text-align: center;
    overflow: hidden;
    border-radius: 10px;
    margin: 30px 20px 0 0;
    .van-icon {
      font-size: 80px;
      color: #ccc;
      margin-top: 45px;
    }
    span {
      font-size: 32px;
      color: #ccc;
      margin-top: 12px;
      display: block;
    }
  }
}

.bottomArea {
  padding: 40px 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  div:nth-of-type(1) {
    width: 290px;
  }
  div:nth-of-type(2) {
    width: 290px;
    margin-left: 70px;
  }
}
</style>
