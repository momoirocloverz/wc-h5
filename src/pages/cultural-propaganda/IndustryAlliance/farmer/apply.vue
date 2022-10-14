<template>
  <div class="formCon industryFarmerApplyCon">
    <van-form @failed="onFailed" @submit="onSubmit">
      <van-field required input-align="left" v-model="form2.name" name="name" label="姓名" maxlength="20" :rules="state.validator.name" placeholder="请输入姓名" readonly />
      <van-field required input-align="left" v-model="form2.card" name="card" label="身份证号" maxlength="20" :rules="state.validator.card" readonly placeholder="请输入身份证号" />
      <van-field required input-align="left" v-model="form2.mobile" name="mobile" label="联系电话" maxlength="11" :rules="state.validator.mobile" readonly placeholder="请输入联系电话" />
      <van-field required input-align="left" readonly v-model="form2.gender" name="gender" label="性别" maxlength="11" :rules="state.validator.gender" placeholder="请选择性别" @click="popGender" />

      <van-field required input-align="left" v-model="form2.townName" name="town_id" label="所属乡镇" :rules="state.validator.town_id" placeholder="请输入所属乡镇" readonly @click="popTown" />
      <van-field required input-align="left" v-model="form2.villageName" name="village_id" label="所属村" :rules="state.validator.village_id" placeholder="请输入所属村" readonly @click="popVillage" />
      <van-field required input-align="left" v-model="form2.address" name="address" label="详细地址" maxlength="50" :rules="state.validator.address" placeholder="请输入详细地址" />
      <van-field required :rules="state.validator.bank_name" input-align="left" v-model="form2.bank_name" name="bank_name" label="开户银行" maxlength="20" placeholder="请输入开户银行" />
      <van-field required input-align="left" :rules="state.validator.bank_account" v-model="form2.bank_account" name="bank_account" label="银行卡号" maxlength="20" placeholder="请输入银行卡号" />
      <van-field
        required
        input-align="left"
        v-model="form2.area"
        name="area"
        type="number"
        label="土地经营权面积(亩)"
        maxlength="20"
        :rules="state.validator.area"
        placeholder="请输入土地经营权面积"
        @change="moneyChange"
      />
      <div class="pic">
        <div class="betweenFlex">
          <p class="van-field__label--required">土地经营权合同或土地所有权证明</p>
          <p class="greyText">最多上传九张</p>
        </div>
        <div class="pic-list">
          <div v-for="(item, index) in form2.pic" :key="item.id" class="image-box">
            <van-icon class="delete" name="clear" @click="toDelete('2', index)" />
            <img :src="item.url" alt />
          </div>
          <div class="upload-btn" v-show="form2.pic.length < 9" @click="choiceImg('2')">
            <van-icon name="plus" />
            <span>添加图片</span>
          </div>
        </div>
      </div>
      <!-- <div class="checkCon">
        <van-checkbox class="checkFlex" v-model="state.checked" checked-color="#FD844E" icon-size="16px">本人已阅读并同意</van-checkbox>
        <span @click="toPolicy">《桂山黄年糕产业联盟加入协议》</span>
      </div> -->
      <!-- <div>
        <van-button block type="primary" native-type="submit">下一步</van-button>
      </div> -->
      <div class="bottomCon fixBottom">
        <div class="checkCon">
          <van-checkbox class="checkFlex" v-model="state.checked" checked-color="#FD844E" icon-size="16px">本人已阅读并同意</van-checkbox>
          <span @click="toPolicy">《桂山黄年糕产业联盟加入协议》</span>
        </div>
        <div class="bottom">
          <div class="cancelBtn" @click="cancelAction">取消</div>
          <van-button block class="fixButton" type="primary" native-type="submit" :disabled="!state.checked">申请加入</van-button>
        </div>
      </div>
    </van-form>
    <input type="file" accept="image/*" id="upload_box" style="display: none" @change="upload" />
    <van-popup v-model:show="townState.show" round position="bottom">
      <van-picker :columns="townState.columns" @cancel="townState.show = false" @confirm="onTown" :columns-field-names="townState.customFieldName" />
    </van-popup>
    <van-popup v-model:show="villageState.show" round position="bottom">
      <van-picker :columns="villageState.columns" @cancel="villageState.show = false" @confirm="onVillage" :columns-field-names="villageState.customFieldName" />
    </van-popup>
    <van-popup v-model:show="genderState.show" round position="bottom">
      <van-picker :columns="genderState.columns" @cancel="genderState.show = false" @confirm="onGender" :columns-field-names="genderState.customFieldName" />
    </van-popup>
    <IndustryAllianceAgreement ref="agreementRef" :showTime="true" title="桂山黄年糕产业联盟加入协议" :content="state.protocol" @confirm="confrim"></IndustryAllianceAgreement>
  </div>
</template>
<script>
import { ref, reactive, onMounted } from 'vue'
import { RadioGroup, Radio, Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import IndustryAllianceAgreement from '@/components/IndustryAllianceAgreement'
import { mgop } from '@aligov/jssdk-mgop'
import OSS from 'ali-oss'
import lrz from 'lrz'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  components: {
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    IndustryAllianceAgreement
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const agreementRef = ref(null) // 当前同意协议弹窗ref
    const info = reactive({
      town: '',
      townId: '',
      village: '',
      villageId: '',
      gender: ''
    })
    const state = reactive({
      protocol:
        '根据《文成县低收入农户高水平小康计2018-2022》、《文成县财政专项扶贫资金和项目管理办法》(文财农（2019）259号)等文件精神和要求，发挥和推进中蜂产业发展，在低收入农户增收和壮大村集体经济的作用，经研究决定实施中蜂养殖折股量化扶贫项目，结合文成实际，特制定中蜂养殖折股量化扶贫项目实施方案（试行）。一、目标任务（一）经济效益目标2020年-2023年，全县计划在10-20个低收入农户相对集中的村组织实施中蜂养殖折股量化扶贫项目，发展中蜂养殖1000箱以上，实现每箱年收入400元（按8斤蜂蜜折算）以上，低收入农户三年户均增收1900元以上，村集体年增收万元以上，促进低收入农户、蜂农增收和壮大村集体经济,实现多盈。（二）社会效益目标通过中蜂扶贫折股量化项目推进中蜂产业发展，扶持10-20个养蜂大户和企业的发展三年实现增收200多万元，其中包括来自人工分蜂获得的收益；同时，为推进文成库区农民实现转产转业促进全县畜牧业转型升级，实现农民增收提供实践经一、目标任务（一）经济效益目标2020年-2023年，全县计划在10-20个低收入农户相对集中的村组织实施中蜂养殖折股量化扶贫项目，发展中蜂养殖1000箱以上，实现每箱年收入400元（按8斤蜂蜜折算）以上，低收入农户三年户均增收1900元以上，村集体年增收万元以上，促进低收入农户、蜂农增收和壮大村集体经济,实现多盈。（二）社会效益目标通过中蜂扶贫折股量化项目推进中蜂产业发展，扶持10-20个养蜂大户和企业的发展三年实现增收200多万元，其中包括来自人工分蜂获得的收益；同时，为推进文成库区农民实现转产转业促进全县畜牧业转型升级，实现农民增收提供实践经',
      checked: false,
      client: {},
      imageFlag: '2',
      validator: {
        name: [{ trigger: 'onBlur', message: '请输入', required: true }],
        bank_account: [{ trigger: 'onBlur', message: '请输入', required: true }],
        card: [
          {
            requied: true,
            trigger: 'onBlur',
            // pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
            message: '请输入正确身份证号'
          }
        ],
        area: [{ trigger: 'onBlur', message: '请输入', required: true }],
        bank_name: [{ trigger: 'onBlur', message: '请输入', required: true }],
        mobile: [
          {
            requied: true,
            trigger: 'onBlur',
            // pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确手机号'
          }
        ],
        gender: [{ trigger: 'onBlur', message: '请输入', required: true }],
        town_id: [{ trigger: 'onBlur', message: '请输入', required: true }],
        village_id: [{ trigger: 'onBlur', message: '请输入', required: true }],
        address: [{ trigger: 'onBlur', message: '请输入', required: true }]
      },
      show: false,
      customFieldName: {
        text: 'name'
      },
      value: '1',
      ZLBFLAG: isZLB()
    })
    const form2 = reactive({
      pic: [],
      pic2: [],
      name: '',
      gender: '',
      bank_name: '',
      bank_account: '',
      area: '',
      card: '',
      mobile: '',
      address: '',
      town_id: '',
      village_id: '',
      townName: '',
      villageName: ''
    })
    const moneyChange = (e) => {
      let bridge = e.target.value
      if (isNaN(+bridge)) {
        form2.area = 0
      } else {
        let after = (+bridge).toFixed(2)
        form2.area = +after
      }
    }
    const townState = reactive({
      show: false,
      columns: [],
      customFieldName: {
        text: 'town_name'
      }
    })
    const genderState = reactive({
      show: false,
      columns: [
        {
          town_name: '男'
        },
        {
          town_name: '女'
        }
      ],
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
      getTownList()
      fetchUserInfo()
      getInfo()
    })
    const fetchUserInfo = () => {
      Request.getUserInfo()
        .then((res) => {
          if (res && res.code === 0) {
            let shorter = res.data
            form2.name = shorter.real_name.replace(shorter.real_name.substr(0, 1), '*')
            form2.card = shorter.zhelb_user_info.idnum.slice(0, 8) + '****' + shorter.zhelb_user_info.idnum.slice(15)
            form2.mobile = shorter.mobile.replace(shorter.mobile.substr(3, 4), '****')
            form2.nameReal = shorter.real_name
            form2.cardReal = shorter.zhelb_user_info.idnum
            form2.mobileReal = shorter.mobile
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const getInfo = () => {
      if (Route.query.id) {
        Request.IndustryFarInfo({
          id: Route.query.id
        })
          .then((res) => {
            if (res && res.code == 0) {
              let shorter = res.data
              //   form2.name = shorter.name
              form2.bank_name = shorter.bank_name
              form2.area = shorter.area
              form2.bank_account = shorter.bank_account
              //   form2.card = shorter.card
              form2.gender = shorter.gender
              //   form2.mobile = shorter.mobile
              form2.address = shorter.address
              form2.town_id = shorter.town_id
              form2.village_id = shorter.village_id
              form2.townName = shorter.town_name
              form2.villageName = shorter.village_name
              let ids = shorter.manage_img_str.split(',')
              let mix = ids.map((ele, index) => {
                return {
                  id: ele,
                  url: shorter.manage_img_list[index]
                }
              })
              form2.pic = mix
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        form2.pic = []
        // form2.name = ''
        form2.bank_name = ''
        form2.area = ''
        form2.bank_account = ''
        // form2.card = ''
        // form2.mobile = ''
        form2.address = ''
        form2.town_id = ''
        form2.village_id = ''
        form2.townName = ''
        form2.villageName = ''
      }
    }
    const choiceImg = (type) => {
      state.imageFlag = type
      document.getElementById('upload_box').click()
    }
    const upload = (e) => {
      let fileObj = e.target.files[0]
      if (fileObj) {
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
                      // isTestUrl: '1'
                    },
                    onSuccess: (data) => {
                      let shazam = data.data
                      if (shazam && shazam.code === 0) {
                        switch (state.imageFlag) {
                          case '2':
                            // form2.pic = [
                            //   {
                            //     url: shazam.data.url,
                            //     id: shazam.data.id
                            //   }
                            // ]
                            form2.pic.push({
                              url: shazam.data.url,
                              id: shazam.data.id
                            })
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
                  switch (state.imageFlag) {
                    case '2':
                      //   form2.pic = [
                      //     {
                      //       url: res.data.url,
                      //       id: res.data.id
                      //     }
                      //   ]
                      form2.pic.push({
                        url: res.data.url,
                        id: res.data.id
                      })
                      break
                    case '3':
                  }
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
    }
    const toDelete = (type, index) => {
      if (type == '2') {
        form2.pic.splice(index, 1)
      }
    }
    const onChange = (e) => {
      state.text = e.name
      state.value = e.value
    }
    const selectTown = () => {
      townState.show = true
    }
    const onVillage = (e) => {
      info.village = e.village_name
      info.villageId = e.id
      form2.village_id = e.id
      form2.villageName = e.village_name
      villageState.show = false
    }
    const onGender = (e) => {
      info.gender = e.town_name
      form2.gender = e.town_name
      genderState.show = false
    }
    const getTownList = () => {
      Request.getTown().then((res) => {
        if (res.code === 0) {
          townState.columns = res.data
        }
      })
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
    const onTown = (e) => {
      info.town = e.town_name
      info.townId = e.id
      form2.townName = e.town_name
      form2.town_id = e.id
      getVillageList()
      townState.show = false
    }
    const onFailed = (err) => {
      console.log(err)
    }
    const onSubmit = (params) => {
      if (form2.pic.length) {
        let data = {
          bank_name: form2.bank_name,
          bank_account: form2.bank_account,
          area: form2.area,
          //   card: form2.card,
          //  mobile: form2.mobile,
          //     name: form2.name,
          card: form2.cardReal,
          name: form2.nameReal,
          mobile: form2.mobileReal,
          gender: form2.gender,
          address: form2.address,
          town_id: form2.town_id,
          village_id: form2.village_id
        }
        data.manage_img_str = form2.pic
          .map((item) => {
            return item.id
          })
          .join(',')
        if (Route.query.id) {
          data.id = Route.query.id
          Request.IndustryFarEdit(data).then((res) => {
            if (res.code === 0) {
              Toast('提交成功')
              Router.replace({
                name: 'IndustryAllianceFarmerSuccess'
              })
            } else {
              Toast(res.msg)
              Router.replace({
                name: 'IndustryAllianceFarmerFailed',
                query: {
                  msg: res.msg
                }
              })
            }
          })
        } else {
          Request.IndustryFarapply(data).then((res) => {
            if (res.code === 0) {
              Toast('提交成功')
              Router.replace({
                name: 'IndustryAllianceFarmerSuccess'
              })
            } else {
              Toast(res.msg)
              Router.replace({
                name: 'IndustryAllianceFarmerFailed',
                query: {
                  msg: res.msg
                }
              })
            }
          })
        }
      } else {
        Toast('请上传图片')
      }
    }
    const popTown = () => {
      townState.show = true
    }
    const popGender = () => {
      genderState.show = true
    }
    const popVillage = () => {
      if (info.town) {
        villageState.show = true
      }
    }
    const toPolicy = () => {
      agreementRef.value.show()
    }
    const confrim = () => {
      // 判断当前是否已经阅读过
      if (agreementRef.value.isTimed) {
        state.checked = true
      } else {
        agreementRef.value.show()
      }
    }
    const cancelAction = () => {
      Router.go(-1)
    }
    return {
      agreementRef,
      confrim,
      cancelAction,
      popGender,
      genderState,
      onGender,
      moneyChange,
      toPolicy,
      popVillage,
      popTown,
      form2,
      onChange,
      Route,
      choiceImg,
      upload,
      toDelete,
      state,
      townState,
      villageState,
      info,
      onFailed,
      onSubmit,
      selectTown,
      onVillage,
      onTown
    }
  }
}
</script>

<style lang="less" scoped>
.formCon {
  min-height: 100%;
  overflow: hidden;
  padding-top: 22px;
  box-sizing: border-box;
  padding-bottom: 250px;
}
.bottomCon {
  width: 100%;
  height: 228px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0px -3px 15px rgba(0, 0, 0, 0.08);
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  //   padding-top: 10px;
  box-sizing: border-box;
  .cancelBtn {
    width: 44.5%;
    height: 96px;
    border: 2px solid #ff844e;
    box-sizing: border-box;
    border-radius: 48px;
    font-size: 36px;
    color: #ff844e;
    text-align: center;
    line-height: 96px;
    margin-right: 10px;
  }
}
.content {
  overflow: hidden;
}
.type {
  height: 86px;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #ebebeb;
  span {
    font-size: 28px;
    color: #333;
    width: 246px;
  }
  span:nth-of-type(2) {
    width: auto;
    margin-left: auto;
  }
  .van-icon {
    font-size: 30px;
    margin-left: 16px;
    color: #666;
  }
}
.item {
  height: 86px;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #ebebeb;
  span {
    font-size: 28px;
    color: #333;
    width: 246px;
  }
  span:nth-of-type(2) {
    width: auto;
    margin-left: auto;
  }
  input {
    width: 410px;
    height: 100%;
    text-align: left;
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
.checkFlex {
  align-items: flex-start;
}
.checkCon {
  color: #333;
  background-color: #fff;
  padding: 32px;
  box-sizing: border-box;
  font-size: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  span {
    color: #fd844e;
  }
}
.pic {
  border-bottom: 2px solid #ebebeb;
  background-color: #fff;
  padding: 32px;
  box-sizing: border-box;
  p {
    font-size: 28px;
    color: #333;
  }
  .greyText {
    color: #b3b5b9;
    font-size: 24px;
  }
  .betweenFlex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
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
}
.pic:nth-last-child(1) {
  border: 0;
}
</style>
<style lang="less">
.industryFarmerApplyCon {
  .fixButton {
    width: 44.5%;
    height: 96px;
    background: linear-gradient(#ff844e 0%, #fe6d56 100%);
    border-radius: 48px;
    border: none;
    font-size: 36px;
    color: #fff;
    text-align: center;
    line-height: 96px;
  }
}
</style>
