<template>
  <div class="outer">
    <!-- <div class="steps">
      <div>
        <img src="../../assets/imgs/step1.png"
             alt=""
             v-show="active === '1'">
        <img src="../../assets/imgs/step_ok.png"
             alt=""
             v-show="active === '2'">
        <p :style="{ color: '#FF814F' }">基本信息填写</p>
      </div>
      <span></span>
      <div>
        <img src="../../assets/imgs/step2.png"
             alt=""
             v-show="active === '1'">
        <img src="../../assets/imgs/step2_s.png"
             alt=""
             v-show="active === '2'">
        <p :style="{ color: active === '2' ? '#FF814F' : '#666' }">证明材料上传</p>
      </div>
        </div>-->
    <div class="center" v-show="active === '1'">
      <div class="item">
        <span>申请人姓名</span>
        <input type="text" placeholder="请填写申请人姓名" v-model="info.name" @blur="onBlur" />
      </div>
      <div class="item">
        <span>联系电话</span>
        <input type="text" placeholder="请填写联系电话" v-model="info.mobile" @blur="onBlur" />
      </div>
      <div class="item">
        <span>家庭人口（人）</span>
        <input type="tel" placeholder="请填写家庭人口" v-model="info.people" />
      </div>
      <div class="item">
        <span>户籍地址</span>
        <input type="text" placeholder="请填写户籍地址" v-model="info.domicileAddress" />
      </div>
      <div class="item">
        <span>实际居住地址</span>
        <input type="text" placeholder="请填写实际居住地址" v-model="info.address" />
      </div>
      <div class="item">
        <span>开户银行</span>
        <input type="text" placeholder="请填写开户银行" v-model="info.bank" />
      </div>
      <div class="item">
        <span>开户人</span>
        <input type="text" placeholder="请填写开户人" v-model="info.bankuser" />
      </div>
      <div class="item">
        <span>银行账号</span>
        <input type="text" placeholder="请填写银行账号" v-model="info.bankCard" />
      </div>
    </div>

    <div class="upload" v-show="active === '2'">
      <div class="item">
        <p>低收入农户户主户口本</p>
        <div class="image-box" @click.stop="chiceImg('1')">
          <img v-show="info.image1.url" :src="info.image1.url" alt />
          <van-icon class="add" name="plus" />
          <van-icon v-show="info.image1.url" @click.stop="toDelete('1')" class="close" name="clear" />
        </div>
      </div>
      <div class="item">
        <p>户主身份证正、反面照</p>
        <div class="box">
          <div class="image-box" @click.stop="chiceImg('2')">
            <img v-show="info.image2.url" :src="info.image2.url" alt />
            <van-icon class="add" name="plus" />
            <van-icon v-show="info.image2.url" @click.stop="toDelete('2')" class="close" name="clear" />
          </div>
          <div class="image-box" @click.stop="chiceImg('3')">
            <img v-show="info.image3.url" :src="info.image3.url" alt />
            <van-icon class="add" name="plus" />
            <van-icon v-show="info.image3.url" @click.stop="toDelete('3')" class="close" name="clear" />
          </div>
        </div>
      </div>
      <div class="item">
        <p>低收入农户子女户口本</p>
        <div class="image-box" @click.stop="chiceImg('4')">
          <img v-show="info.image4.url" :src="info.image4.url" alt />
          <van-icon class="add" name="plus" />
          <van-icon v-show="info.image4.url" @click.stop="toDelete('4')" class="close" name="clear" />
        </div>
      </div>
      <div class="item">
        <p>子女身份证正、反面照</p>
        <div class="box">
          <div class="image-box" @click.stop="chiceImg('5')">
            <img v-show="info.image5.url" :src="info.image5.url" alt />
            <van-icon class="add" name="plus" />
            <van-icon v-show="info.image5.url" @click.stop="toDelete('5')" class="close" name="clear" />
          </div>
          <div class="image-box" @click.stop="chiceImg('6')">
            <img v-show="info.image6.url" :src="info.image6.url" alt />
            <van-icon class="add" name="plus" />
            <van-icon v-show="info.image6.url" @click.stop="toDelete('6')" class="close" name="clear" />
          </div>
        </div>
      </div>
      <div class="item">
        <p>子女社保卡正、反面照</p>
        <div class="box">
          <div class="image-box" @click.stop="chiceImg('7')">
            <img v-show="info.image7.url" :src="info.image7.url" alt />
            <van-icon class="add" name="plus" />
            <van-icon v-show="info.image7.url" @click.stop="toDelete('7')" class="close" name="clear" />
          </div>
          <div class="image-box" @click.stop="chiceImg('8')">
            <img v-show="info.image8.url" :src="info.image8.url" alt />
            <van-icon class="add" name="plus" />
            <van-icon v-show="info.image8.url" @click.stop="toDelete('8')" class="close" name="clear" />
          </div>
        </div>
      </div>
      <div class="item">
        <p>子女中高职业院校就读证明</p>
        <div class="image-box" @click.stop="chiceImg('9')">
          <img v-show="info.image9.url" :src="info.image9.url" alt />
          <van-icon class="add" name="plus" />
          <van-icon v-show="info.image9.url" @click.stop="toDelete('9')" class="close" name="clear" />
        </div>
      </div>
      <div class="item">
        <p>信息真实性书面承诺</p>
        <div class="image-box" @click.stop="chiceImg('10')">
          <img v-show="info.image10.url" :src="info.image10.url" alt />
          <van-icon class="add" name="plus" />
          <van-icon v-show="info.image10.url" @click.stop="toDelete('10')" class="close" name="clear" />
        </div>
      </div>
      <input style="display: none" type="file" accept="image/*" id="upload_box" @change="upload" />
    </div>

    <div class="btn" v-show="active === '1'">
      <button @click="toNext">提交</button>
    </div>
    <div class="next-btn" v-show="active === '2'">
      <button @click="active = '1'">上一步</button>
      <button @click="submit">提交</button>
    </div>
    <!-- 类型选择 -->
    <van-popup v-model:show="typeState.show" round position="bottom">
      <van-picker :columns="typeState.columns" @cancel="typeState.show = false" @confirm="onType" :columns-field-names="typeState.customFieldName" />
    </van-popup>
    <!-- 关系选择 -->
    <van-popup v-model:show="relativeState.show" round position="bottom">
      <van-picker :columns="relativeState.columns" @cancel="relativeState.show = false" @confirm="onRelative" />
    </van-popup>
    <!-- 院校类型选择 -->
    <!-- <van-popup v-model:show="schoolState.show"
               round
               position="bottom">
      <van-picker :columns="schoolState.columns"
                  @cancel="schoolState.show = false"
                  @confirm="onSchool" />
        </van-popup>-->
    <!-- 乡镇选择 -->
    <van-popup v-model:show="townState.show" round position="bottom">
      <van-picker :columns="townState.columns" @cancel="townState.show = false" @confirm="onTown" :columns-field-names="townState.customFieldName" />
    </van-popup>
    <!-- 乡镇选择 -->
    <van-popup v-model:show="villageState.show" round position="bottom">
      <van-picker :columns="villageState.columns" @cancel="villageState.show = false" @confirm="onVillage" :columns-field-names="villageState.customFieldName" />
    </van-popup>
  </div>
</template>

<script>
import { Step, Steps, Toast } from 'vant'
import { ref, reactive, onMounted } from 'vue'
import lrz from 'lrz'
import { useRoute, useRouter } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
import OSS from 'ali-oss'
export default {
  components: {
    [Step.name]: Step,
    [Steps.name]: Steps
  },
  setup() {
    const Router = useRouter()
    const route = useRoute()
    const active = ref('1')
    const state = reactive({
      ZLBFLAG: isZLB(),
      client: {}
    })
    const info = reactive({
      name: '',
      phone: '',
      cardID: '',
      childrenName: '',
      childrenCardID: '',
      type: '',
      typeId: '',
      relative: '',
      school: '',
      // schoolType: '',
      town: '',
      townId: '',
      village: '',
      villageId: '',
      image1: {},
      image2: {},
      image3: {},
      image4: {},
      image5: {},
      image6: {},
      image7: {},
      image8: {},
      image9: {},
      image10: {}
    })
    const typeState = reactive({
      show: false,
      columns: [
        { title: '低保户', value: 1 },
        { title: '低边户', value: 2 },
        { title: '五保户', value: 3 }
      ],
      customFieldName: {
        text: 'title'
      }
    })
    const relativeState = reactive({
      show: false,
      columns: ['父子', '父女', '母子', '母女', '其他']
      // customFieldName: {
      //   text: 'title',
      // }
    })
    const schoolState = reactive({
      show: false,
      columns: ['中等', '高等']
    })
    const townState = reactive({
      show: false,
      columns: [],
      customFieldName: {
        text: 'town_name'
      }
    })
    const villageState = reactive({
      show: false,
      columns: [],
      customFieldName: {
        text: 'village_name'
      }
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
            Authorization: localStorage.getItem('token') || '',
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
              // console.log(state.client, 'client.value')
            } else {
              Toast(shazam.msg)
            }
          }
        })
      }
    }

    onMounted(() => {
      fetchOss()
    })

    const onType = (e) => {
      info.type = e.title
      info.typeId = e.value
      typeState.show = false
    }
    const selectType = () => {
      typeState.show = true
    }

    const onRelative = (e) => {
      info.relative = e
      relativeState.show = false
    }
    const selectRelative = () => {
      relativeState.show = true
    }
    const onTown = (e) => {
      info.town = e.town_name
      info.townId = e.id
      getVillageList()
      townState.show = false
    }
    const selectTown = () => {
      townState.show = true
    }

    const onVillage = (e) => {
      info.village = e.village_name
      info.villageId = e.id
      villageState.show = false
    }
    const selectVillage = () => {
      villageState.show = true
    }

    const getVillageList = () => {
      Request.getVillage({
        town_id: info.townId
      }).then((res) => {
        if (res.code === 0) {
          villageState.columns = res.data
        }
      })
    }
    var uploadIndex = ''
    const chiceImg = (index) => {
      uploadIndex = index
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
                    Accept: 'application/prs.xkm.v1.0.0+json',
                    //   isTestUrl: '1'
                  },
                  onSuccess: (data) => {
                    let shazam = data.data
                    if (shazam && shazam.code === 0) {
                      switch (uploadIndex) {
                        case '1':
                          info.image1.url = shazam.data.url
                          info.image1.id = shazam.data.id
                          break

                        case '2':
                          info.image2.url = shazam.data.url
                          info.image2.id = shazam.data.id
                          break

                        case '3':
                          info.image3.url = shazam.data.url
                          info.image3.id = shazam.data.id
                          break

                        case '4':
                          info.image4.url = shazam.data.url
                          info.image4.id = shazam.data.id
                          break

                        case '5':
                          info.image5.url = shazam.data.url
                          info.image5.id = shazam.data.id
                          break

                        case '6':
                          info.image6.url = shazam.data.url
                          info.image6.id = shazam.data.id
                          break

                        case '7':
                          info.image7.url = shazam.data.url
                          info.image7.id = shazam.data.id
                          break

                        case '8':
                          info.image8.url = shazam.data.url
                          info.image8.id = shazam.data.id
                          break

                        case '9':
                          info.image9.url = shazam.data.url
                          info.image9.id = shazam.data.id
                          break

                        case '10':
                          info.image10.url = shazam.data.url
                          info.image10.id = shazam.data.id
                          break
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
                switch (uploadIndex) {
                  case '1':
                    info.image1.url = res.data.url
                    info.image1.id = res.data.id
                    break

                  case '2':
                    info.image2.url = res.data.url
                    info.image2.id = res.data.id
                    break

                  case '3':
                    info.image3.url = res.data.url
                    info.image3.id = res.data.id
                    break

                  case '4':
                    info.image4.url = res.data.url
                    info.image4.id = res.data.id
                    break

                  case '5':
                    info.image5.url = res.data.url
                    info.image5.id = res.data.id
                    break

                  case '6':
                    info.image6.url = res.data.url
                    info.image6.id = res.data.id
                    break

                  case '7':
                    info.image7.url = res.data.url
                    info.image7.id = res.data.id
                    break

                  case '8':
                    info.image8.url = res.data.url
                    info.image8.id = res.data.id
                    break

                  case '9':
                    info.image9.url = res.data.url
                    info.image9.id = res.data.id
                    break

                  case '10':
                    info.image10.url = res.data.url
                    info.image10.id = res.data.id
                    break
                }
                // file.status = '';
                // file.message = '';
                // file.id = _data.data.id;
              } else {
                Toast('上传失败，请重试')
              }
            })
          }
        })
      } else {
        return Toast('请上传jpeg,jpg,png,gif图片')
      }
    }

    const toDelete = (item) => {
      switch (item) {
        case '1':
          info.image1 = {}
          break

        case '2':
          info.image2 = {}
          break

        case '3':
          info.image3 = {}
          break

        case '4':
          info.image4 = {}
          break

        case '5':
          info.image5 = {}
          break

        case '6':
          info.image6 = {}
          break

        case '7':
          info.image7 = {}
          break

        case '8':
          info.image8 = {}
          break

        case '9':
          info.image9 = {}
          break

        case '10':
          info.image10 = {}
          break
      }
    }
    const onBlur = () => {
      Request.match({
        head_card: info.cardID,
        head_name: info.name
      }).then((res) => {
        if (res.code === 0) {
          info.phone = res.data.contact
        }
      })
    }
    const toNext = () => {
      if (!info.name || !info.mobile || !info.people || !info.domicileAddress || !info.address || !info.bank || !info.bankuser || !info.bankCard) {
        Toast('请检查所有基本信息是否都已填写')
        return
      }
      Toast('提交成功')
      Router.replace({
        name: 'subsistenceAllowanceSuccess'
      })
    }
    const submit = () => {
      // Router.replace('/subsidy/success');

      if (
        !info.image1.url ||
        !info.image2.url ||
        !info.image3.url ||
        !info.image4.url ||
        !info.image5.url ||
        !info.image6.url ||
        !info.image7.url ||
        !info.image8.url ||
        !info.image9.url ||
        !info.image10.url
      ) {
        Toast('请检查所有材料证明是否都已上传')
        return
      }
      let year = new Date().getFullYear(),
        month = new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1),
        date = new Date().getDate() > 9 ? new Date().getDate() : '0' + new Date().getDate(),
        hours = new Date().getHours() > 9 ? new Date().getHours() : '0' + new Date().getHours(),
        minutes = new Date().getMinutes() > 9 ? new Date().getMinutes() : '0' + new Date().getMinutes(),
        seconds = new Date().getSeconds() > 9 ? new Date().getSeconds() : '0' + new Date().getSeconds()

      let params = {
        plan_id: route.query.plan_id,
        user_id: sessionStorage.getItem('uid'),
        head_card: info.cardID,
        head_name: info.name,
        head_contact: info.phone,
        type: info.typeId,
        children_name: info.childrenName,
        children_card: info.childrenCardID,
        relation: info.relative,
        college_name: info.school,
        college_type: '无',
        town_id: info.townId,
        village_id: info.villageId,
        hkb_hz_img: info.image1.id,
        hkb_zn_img: info.image2.id,
        hz_card_zm_img: info.image3.id,
        hz_card_fm_img: info.image4.id,
        zv_card_zm_img: info.image5.id,
        zv_card_fm_img: info.image6.id,
        zv_sb_zm_img: info.image7.id,
        zv_sb_fm_img: info.image8.id,
        zv_jdzm_img: info.image9.id,
        smcn_img: info.image10.id,
        apply_at: year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds
      }
      if (route.query.sid) {
        Request.edit({
          ...params,
          id: route.query.sid
        }).then((res) => {
          if (res.code === 0) {
            Toast('提交成功')
            Router.replace('/subsidy/success')
          } else {
            Toast(res.msg)
          }
        })
      } else {
        Request.planApply({
          ...params
        }).then((res) => {
          if (res.code === 0) {
            Toast('提交成功')
            Router.replace('/subsidy/success')
          } else {
            Toast(res.msg)
          }
        })
      }
    }
    return {
      state,
      active,
      info,
      typeState,
      selectType,
      onType,
      onRelative,
      relativeState,
      selectRelative,
      // onSchool,
      // selectSchool,
      schoolState,
      onTown,
      selectTown,
      townState,
      villageState,
      onVillage,
      selectVillage,
      submit,
      // afterRead,
      // beforeDelete
      upload,
      chiceImg,
      toNext,
      onBlur,
      toDelete
    }
  }
}
</script>

<style lang="less" scoped>
.fakeBorder {
  width: 100%;
  margin: 0 auto;
  height: 2px;
  background-color: #e6e6e6;
}
.spBorder {
  border-bottom: 2px solid #e6e6e6;
}
.outer {
  overflow: hidden;
  padding: 0 30px;
}
.steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
  padding: 0 30px;

  span {
    display: block;
    width: 60px;
    height: 5px;
    background: #ccc;
  }
  div {
    display: flex;
    align-items: center;
    img {
      width: 46px;
      height: 46px;
    }
    p {
      font-size: 32px;
      margin-left: 10px;
      transition: all 0.3s;
    }
  }
}
.center {
  overflow: hidden;
  border-radius: 30px;
  background: #fff;
  padding: 0 30px;
  margin: 26px 0 160px;
  .item {
    height: 109px;
    display: flex;
    align-items: center;
    span:nth-of-type(1) {
      display: block;
      font-size: 30px;
      color: #666;
      width: 230px;
    }
    span:nth-of-type(2) {
      font-size: 30px;
      margin-left: 49px;
    }
    input {
      height: 109px;
      line-height: normal;
      width: 56%;
      margin-left: 49px;
      font-size: 30px;
    }
    ::-webkit-input-placeholder {
      color: #b8b8b8;
    }
    .van-icon {
      margin-left: auto;
      color: #666;
      font-size: 30px;
    }
    img {
      width: 36px;
      margin-left: auto;
    }
  }
}
.upload {
  overflow: hidden;
  border-radius: 30px;
  background: #fff;
  padding: 0 30px;
  margin: 26px 0 160px;
  .item {
    border-bottom: 2px solid #e6e6e6;
    padding-bottom: 20px;
    overflow: hidden;
    p {
      display: block;
      font-size: 30px;
      color: #666666;
      margin-top: 38px;
    }
    .box {
      display: flex;
      align-items: center;
    }
    .image-box {
      width: 150px;
      height: 150px;
      background: #f6f7f9;
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      margin: 34px 20px 0 0;
      img {
        width: 100%;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 9;
      }
      input {
        display: none;
      }
      .add {
        position: absolute;
        font-size: 80px;
        color: #999;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .close {
        position: absolute;
        font-size: 36px;
        color: #ff3737;
        top: 8px;
        right: 8px;
        z-index: 10;
      }
    }
  }
}
.btn {
  width: 100%;
  height: 109px;
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  button {
    // width: 690px;
    width: 92%;
    height: 80px;
    border-radius: 40px;
    background: linear-gradient(#ff844e 0%, #fe6d56 100%);
    font-size: 30px;
    color: #fff;
    text-align: center;
    line-height: normal;
  }
}
.next-btn {
  width: 100%;
  height: 109px;
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  button {
    font-size: 30px;
    text-align: center;
    line-height: normal;
  }
  button:nth-of-type(1) {
    width: 198px;
    height: 78px;
    border-radius: 39px;
    border: 2px solid #ff844e;
    color: #ff844e;
    background: transparent;
  }
  button:nth-of-type(2) {
    width: 460px;
    height: 80px;
    border-radius: 40px;
    color: #fff;
    background: linear-gradient(#ff844e 0%, #fe6d56 100%);
    margin-left: 30px;
  }
}
</style>
