<template>
  <div class="toJoinGroupIncreaseCon">
    <div class="top">
      <div class="title">个人信息</div>
      <div class="itemCon">
        <div class="itemCommon">
          <div class="itemLeft">姓名</div>
          <!-- <div
                        v-if="state.ZLBFLAG"
                    >{{ state.form.name.replace(state.form.name.substr(0, 1), "*") }}</div>
                    <div v-else>{{ state.form.name }}</div> -->
          <div>{{ state.form.name }}</div>
        </div>
        <div class="itemCommon">
          <div class="itemLeft">身份证号</div>
          <!-- <div v-if="state.ZLBFLAG">
            {{
              state.form.identity.replace(
                state.form.identity.substr(3, 12),
                '************'
              )
            }}
          </div>
          <div v-else>{{ state.form.identity }}</div> -->
          <div>{{ state.form.identity }}</div>
        </div>
        <div class="itemCommon">
          <div class="itemLeft">电话</div>
          <!-- <div v-if="state.ZLBFLAG">
            {{
              state.form.mobile.replace(state.form.mobile.substr(3, 4), '****')
            }}
          </div>
          <div v-else>{{ state.form.mobile }}</div> -->
          <div>{{ state.form.mobile }}</div>
        </div>
        <div class="itemCommon">
          <div class="itemLeft">所属镇</div>
          <!-- <div v-if="state.ZLBFLAG">
            {{ state.form.town.replace(state.form.town.substr(0, 1), '*') }}
          </div>
          <div v-else>{{ state.form.town }}</div> -->
          <div>{{ state.form.town }}</div>
        </div>
        <div class="itemCommon">
          <div class="itemLeft">所属村</div>
          <!-- <div v-if="state.ZLBFLAG">
            {{
              state.form.village.replace(state.form.village.substr(0, 1), '*')
            }}
          </div>
          <div v-else>{{ state.form.village }}</div> -->
          <div>{{ state.form.village }}</div>
        </div>
        <div class="itemCommon">
          <div class="itemLeft">详细地址</div>
          <!-- <div v-if="state.ZLBFLAG">
            {{
              state.form.address.replace(
                state.form.address.substr(2, 4),
                '****'
              )
            }}
          </div>
          <div v-else>{{ state.form.address }}</div> -->
          <div>{{ state.form.address }}</div>
        </div>
      </div>
    </div>
    <div class="middle">
      <div class="title">贷款金额</div>
      <radio-group v-model="state.checked" direction="horizontal">
        <radio class="customRadio" checked-color="#FF844E" name="1">20000</radio>
        <radio class="customRadio" checked-color="#FF844E" name="2">30000</radio>
      </radio-group>
    </div>
    <div class="middleNext">
      <div class="title">自筹状态</div>
      <div class="statusText">已汇款</div>
    </div>
    <div class="imgMaster">
      <div class="title">汇款凭证</div>
      <div class="pic-list">
        <div v-for="(item, index) in state.form.pic" :key="item.id" class="image-box">
          <van-icon class="delete" name="clear" @click="toDelete(index)" />
          <img class="uploadItem" :src="item.url" />
        </div>
        <div class="upload-btn" v-show="state.form.pic.length < 1" @click="choiceImg">
          <van-icon name="plus" />
          <span>点击上传</span>
        </div>
      </div>
    </div>
    <input type="file" accept="image/*" id="upload_box" style="display: none" @change="upload" />
    <div class="btnsCon">
      <div class="button2" @click="refuseAction">取消</div>
      <div class="button" @click="agreeAction">申报</div>
    </div>
    <div>
      <checkbox v-model="state.agree" checked-color="#FF844E">
        <span class="small">我已阅读并同意</span>
        <span class="agreement" @click="checkAgreement">《村股份经济合作社与低收入农户帮扶协议》</span>
      </checkbox>
    </div>
  </div>
</template>
<script>
import { useRouter, useRoute } from 'vue-router'
import { reactive, onMounted } from 'vue'
import { Toast, RadioGroup, Radio, Checkbox } from 'vant'
import lrz from 'lrz'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
import OSS from 'ali-oss'
export default {
  components: {
    RadioGroup,
    Radio,
    Checkbox
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      checked: '1',
      agree: false,
      form: {
        name: '',
        identity: '',
        mobile: '',
        village: '',
        town: '',
        village_id: '',
        town_id: '',
        address: '',
        pic: [],
        id: ''
      }
    })
    const checkValue = () => {
      let res = sessionStorage.getItem('groupIncreaseToJoin') ? JSON.parse(sessionStorage.getItem('groupIncreaseToJoin')) : ''
      if (res) {
        state.form.pic = res.pics
        state.agree = res.agree
        state.checked = res.checked
      }
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
            }
          }
        })
      }
    }
    onMounted(() => {
      fetchOss()
      initData()
      fetchData()
      checkValue()
    })
    const initData = () => {
      let track = localStorage.getItem('currentUserInfo') ? JSON.parse(localStorage.getItem('currentUserInfo')) : ''
      if (track) {
        if (track.type == 1) {
          if (track.farmer_info && track.farmer_info.basic) {
            state.form.name = track.farmer_info.basic.TName
            state.form.identity = track.farmer_info.basic.Card
            state.form.address = track.farmer_info.basic.Address
            state.form.mobile = track.farmer_info.basic.Tel
            state.form.village_id = track.farmer_info.basic.XCID
            state.form.town_id = track.farmer_info.basic.XZID
            state.form.village = track.farmer_info.basic.village_name
            state.form.town = track.farmer_info.basic.town_name
          }
        }
      }
    }
    const fetchData = () => {
      Request.planIncomeInfo({})
        .then((res) => {
          if (res && res.code === 0) {
            if (res.data && res.data.id) {
              state.form.id = res.data.id
              state.checked = String(res.data.type)
              state.form.pic = [
                {
                  id: res.data.evidence_img,
                  url: res.data.evidence_img_url[0]
                }
              ]
              checkValue()
            }
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const refuseAction = () => {
      sessionStorage.removeItem('groupIncreaseToJoin')
      Router.go(-1)
    }
    const agreeAction = () => {
      if (!state.form.pic.length) {
        return Toast.fail('汇款凭证不能为空')
      }
      if (!state.agree) {
        return Toast.fail('请阅读并勾选《村股份经济合作社与低收入农户帮扶协议》')
      }
      let data = {
        name: state.form.name,
        identity: state.form.identity,
        mobile: state.form.mobile,
        address: state.form.address,
        type: state.checked,
        town_id: state.form.town_id,
        village_id: state.form.village_id,
        evidence_img: state.form.pic[0].id
      }
      if (state.form.id) {
        data.id = state.form.id
        Request.planIncomeEdit(data)
          .then((res) => {
            if (res && res.code == 0) {
              Toast('提交成功')
              sessionStorage.removeItem('groupIncreaseToJoin')
              Router.push({
                name: 'zhongfengtoGroupSelect'
              })
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        Request.planIncomeApply(data)
          .then((res) => {
            if (res && res.code == 0) {
              Toast('提交成功')
              sessionStorage.removeItem('groupIncreaseToJoin')
              Router.push({
                name: 'zhongfengtoGroupSelect'
              })
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    }
    const toDelete = (index) => {
      state.form.pic.splice(index, 1)
    }
    const choiceImg = (index) => {
      document.getElementById('upload_box').click()
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
                      Accept: 'application/prs.xkm.v1.0.0+json',
                    //   isTestUrl: '1'
                    },
                    onSuccess: (data) => {
                      let shazam = data.data
                      if (shazam && shazam.code === 0) {
                        state.form.pic.push({
                          id: shazam.data.id,
                          url: shazam.data.url
                        })
                        e.target.value = ''
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
                  state.form.pic.push({
                    id: res.data.id,
                    url: res.data.url
                  })
                  e.target.value = ''
                }
              })
            }
          })
        }
      } else {
        return Toast('请上传jpeg,jpg,png,gif图片')
      }
    }
    const checkAgreement = () => {
      let data = {
        pics: state.form.pic,
        agree: state.agree,
        checked: state.checked
      }
      sessionStorage.setItem('groupIncreaseToJoin', JSON.stringify(data))
      Router.push({
        name: 'zhongfengtoGroupAgreement'
      })
    }
    return {
      state,
      refuseAction,
      agreeAction,
      toDelete,
      choiceImg,
      upload,
      checkAgreement,
      checkValue
    }
  }
}
</script>

<style scoped lang="less">
.toJoinGroupIncreaseCon {
  background-color: #fff;
  padding: 30px;
  box-sizing: border-box;
  min-height: 100vh;
  .agreement {
    font-size: 24px;
    font-weight: 700;
    color: #333;
  }
  .small {
    font-size: 24px;
    color: #999;
  }
  .btnsCon {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    margin-bottom: 54px;
  }
  .button {
    width: 310px;
    height: 70px;
    background: linear-gradient(#ff844e 0%, #fe6d56 100%);
    border-radius: 35px;
    font-size: 32px;
    color: #fff;
    text-align: center;
    line-height: 70px;
  }
  .button2 {
    width: 310px;
    height: 66px;
    border: 2px solid #fe6d56;
    background: #fff;
    color: #fe6d56;
    border-radius: 33px;
    font-size: 32px;
    text-align: center;
    line-height: 70px;
  }
  .customRadio {
    font-size: 28px;
  }
  .pic-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-bottom: 30px;
    .uploadItem {
      width: 200px;
      height: 200px;
    }
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
  .itemCon {
    font-size: 28px;
    color: #666;
  }
  .itemCommon {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    margin-bottom: 16px;
  }
  .itemLeft {
    width: 190px;
    padding-left: 10px;
    box-sizing: border-box;
  }
  .title {
    font-size: 32px;
    font-weight: 700;
    color: #333;
    margin-bottom: 24px;
  }
  .top {
    margin-bottom: 30px;
  }
  .middle {
    margin-bottom: 30px;
  }
  .middleNext {
    margin-bottom: 30px;
    .statusText {
      font-size: 28px;
      font-weight: 700;
      color: #fe7354;
    }
  }
  .imgMaster {
    margin-bottom: 30px;
  }
}
</style>
