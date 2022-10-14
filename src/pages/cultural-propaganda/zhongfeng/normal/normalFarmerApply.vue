<template>
  <div class="normalFarmerApplyCon">
    <!-- <BeeProgress
      activeStep="1"
      :textList="['申报信息填写', '选择养殖大户']"
    ></BeeProgress> -->

    <div class="topAreaWhite">
      <div class="item">
        <div class="homeTag">
          <div class="tagLine"></div>
          <div class="tagText">农户信息</div>
        </div>
      </div>
      <div class="item">
        <span>姓名</span>
        <div class="itemContent" v-if="state.ZLBFLAG">
          {{ state.form.name.replace(state.form.name.substr(0, 1), '*') }}
        </div>
        <div class="itemContent" v-else>{{ state.form.name }}</div>
      </div>
      <div class="item">
        <span>身份证号</span>
        <div class="itemContent" v-if="state.ZLBFLAG">
          {{ state.form.identity.replace(state.form.identity.substr(3, 12), '************') }}
        </div>
        <div class="itemContent" v-else>{{ state.form.identity }}</div>
      </div>
      <div class="item">
        <span>村镇</span>
        <div class="itemContent">{{ state.form.town_name }} / {{ state.form.village_name }}</div>
      </div>
      <div class="item">
        <span>电话号码</span>
        <div class="itemContent" v-if="state.ZLBFLAG">
          {{ state.form.mobile.replace(state.form.mobile.substr(3, 4), '****') }}
        </div>
        <div class="itemContent" v-else>{{ state.form.mobile }}</div>
      </div>
      <div class="item">
        <span>家庭地址</span>
        <div class="itemContent" v-if="state.ZLBFLAG">
          {{ state.form.address.replace(state.form.address.substr(2, 4), '****') }}
        </div>
        <div class="itemContent" v-else>{{ state.form.address }}</div>
      </div>
      <div class="item">
        <span>开户行</span>
        <input type="text" maxlength="30" v-model.trim="state.form.bankName" placeholder="请输入" />
      </div>
      <div class="item">
        <span>银行账号</span>
        <input type="text" maxlength="30" v-model.trim="state.form.bankNo" placeholder="低收入农户经费发放账号" />
      </div>
      <!-- <div class="pic">
        <p>上传身份证正反面照片</p>
        <div class="idMaster">
          <div class="idFrontCon" :style="state.idFrontImgObj" @click="choiceImg(2)">
            <van-icon class="delete" name="clear" @click.stop="toDeleteFront" v-if="state.form.idFront.length" />
          </div>
          <div class="idBackCon" :style="state.idBackImgObj" @click="choiceImg(3)">
            <van-icon class="delete" name="clear" @click.stop="toDeleteBack" v-if="state.form.idBack.length" />
          </div>
        </div>
      </div> -->
    </div>
    <div class="bottomArea">
      <!-- <div class="button positiveBtn" @click="toNext">下一步</div> -->
      <div class="button positiveBtn" @click="toNext">提交</div>
    </div>
    <input type="file" accept="image/*" id="upload_box" style="display: none" @change="upload" />
  </div>
</template>
<script>
import { reactive, onMounted } from 'vue'
import { RadioGroup, Radio, Toast, Dialog } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import BeeProgress from '@/components/beeProgress'
import lrz from 'lrz'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
import OSS from 'ali-oss'
export default {
  components: {
    [Dialog.Component.name]: Dialog.Component,
    BeeProgress,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio
  },
  setup() {
    const Router = useRouter()
    const route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      client: {},
      show: false,
      idTrackFlag: 1,
      idFrontImgObj: {},
      idBackImgObj: {},
      idFrontImage: '',
      idBackImage: '',
      form: {
        name: '',
        identity: '',
        address: '',
        mobile: '',
        village_id: '',
        town_id: '',
        bankName: '',
        bankNo: '',
        pic: [],
        idFront: [],
        idBack: [],
        town_name: '',
        village_name: ''
      }
    })
    const resetIDLeft = () => {
      state.idFrontImgObj = {
        backgroundImage: 'url(' + 'https://img.hzanchu.com/acimg/d9f9c544f9b5556107db983c9d35e612.png' + ')'
      }
    }
    const resetIDRight = () => {
      state.idBackImgObj = {
        backgroundImage: 'url(' + 'https://img.hzanchu.com/acimg/7adaac3fa0d65ca6827d5630e4177268.png' + ')'
      }
    }
    const initAction = () => {
      resetIDLeft()
      resetIDRight()
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
            state.form.village_name = track.farmer_info.basic.village_name
            state.form.town_name = track.farmer_info.basic.town_name
          }
        }
      }
      if (route.query.edit) {
        Request.fetchFarmerBeeInfo({})
          .then((res) => {
            if (res && res.code == 0) {
              console.log(res.data)
              forInitEdit(res)
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        setValue()
      }
    }
    const forInitEdit = (res) => {
      let afterSplit1 = res.data.identity_image.split(',')
      //   let afterSplit2 = res.data.entrust_image.split(',')
      //   state.form.pic = [
      //     {
      //       id: afterSplit2[0],
      //       url: res.data.entrust_image_url[0],
      //     },
      //     {
      //       id: afterSplit2[1],
      //       url: res.data.entrust_image_url[1],
      //     },
      //   ]
      //   state.form.idFront = [
      //     {
      //       id: afterSplit1[0],
      //       url: res.data.identity_image_url[0]
      //     }
      //   ]
      //   state.form.idBack = [
      //     {
      //       id: afterSplit1[1],
      //       url: res.data.identity_image_url[1]
      //     }
      //   ]
      //   state.idFrontImgObj = {
      //     backgroundImage: 'url(' + res.data.identity_image_url[0] + ')'
      //   }
      //   state.idBackImgObj = {
      //     backgroundImage: 'url(' + res.data.identity_image_url[1] + ')'
      //   }
      state.form.bankName = res.data.bank_name
      state.form.bankNo = res.data.bank_card
      setValue()
    }

    const setValue = () => {
      if (sessionStorage.getItem('farmerApplyInfo')) {
        let obj = JSON.parse(sessionStorage.getItem('farmerApplyInfo'))
        if (obj.pic.length) {
          state.form.pic = obj.pic
        } else {
          state.form.pic = []
        }
        /*   if (obj.idFront.length) {
          state.form.idFront = obj.idFront
          state.idFrontImgObj = {
            backgroundImage: 'url(' + obj.idFront[0].url + ')'
          }
        } else {
          state.form.idFront = []
          resetIDLeft()
        }
        if (obj.idBack.length) {
          state.form.idBack = obj.idBack
          state.idBackImgObj = {
            backgroundImage: 'url(' + obj.idBack[0].url + ')'
          }
        } else {
          state.form.idBack = []
          resetIDRight()
        } */
        state.form.bankName = obj.bankName
        state.form.bankNo = obj.bankNo
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
      initAction()
    })
    const choiceImg = (index) => {
      state.idTrackFlag = index
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
                        if (state.idTrackFlag == 1) {
                          state.form.pic.push({
                            id: shazam.data.id,
                            url: shazam.data.url
                          })
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
                        } else {
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
                  if (state.idTrackFlag == 1) {
                    state.form.pic.push({
                      id: res.data.id,
                      url: res.data.url
                    })
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
                  } else {
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
    const toDelete = (index) => {
      state.form.pic.splice(index, 1)
    }
    const toNext = () => {
      if (!state.form.bankName) {
        return Toast.fail('开户银行不能为空')
      }
      if (!state.form.bankNo) {
        return Toast.fail('银行账号不能为空')
      }
      //   if (!state.form.idFront.length) {
      //     return Toast.fail('身份证照不能为空')
      //   }
      //   if (!state.form.idBack.length) {
      //     return Toast.fail('身份证照不能为空')
      //   }
      let data = {
        name: state.form.name,
        identity: state.form.identity,
        mobile: state.form.mobile,
        bank_name: state.form.bankName,
        bank_card: state.form.bankNo,
        village_id: state.form.village_id,
        town_id: state.form.town_id,
        address: state.form.address,
        identity_image: 0,
        lon: 120.112834,
        lat: 27.796317
      }
      if (route.query.edit) {
        //编辑
        Request.beeFarmerEdit(data)
          .then((res) => {
            if (res && res.code == 0) {
              Toast('提交成功')
              if (route.query.fromEdit) {
                Router.replace({
                  name: 'beekeepingSupport'
                })
              } else {
                // Request.fetchFarmerMatchInfo({})
                //   .then((res) => {
                //     if (res && res.code == 0) {
                //       if (res.data.company_name) {
                //         if (res.data.status == 3) {
                //           Router.replace({
                //             name: "beekeepingSupport",
                //           });
                //           // Router.replace({
                //           //   name: "culturalProNormalPair",
                //           //   query: {
                //           //     edit: "1",
                //           //   },
                //           // });
                //         } else {
                //           Router.replace({
                //             name: "beekeepingSupport",
                //           });
                //         }
                //       } else {
                //         Router.replace({
                //           name: "beekeepingSupport",
                //         });
                //         // Router.replace({
                //         //   name: "culturalProNormalPair",
                //         //   query: {
                //         //     edit: "1",
                //         //   },
                //         // });
                //       }
                //     } else {
                //       Toast(res.msg);
                //     }
                //   })
                //   .catch((err) => {
                //     console.log("err", err);
                //   });
              }
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      } else {
        //新建
        Request.actionFarmerApply(data)
          .then((res) => {
            if (res && res.code == 0) {
              Toast('提交成功')
              Router.replace({
                name: 'beekeepingSupport'
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
    const goBack = () => {
      sessionStorage.removeItem('currentAddress')
      Router.go(-1)
    }

    // 点击提交，并且反馈结果
    const toSubmit = () => {
      Router.push({
        name: 'cultural-propaganda/zhongfeng/big/result'
      })
    }
    return {
      route,
      choiceImg,
      upload,
      state,
      toDelete,
      toNext,
      goBack
    }
  }
}
</script>
<style lang="less" scoped>
.limitImg {
  width: 210px;
  height: 210px;
  margin: 0 auto;
}
.dialogCon {
  text-align: center;
}
.normalFarmerApplyCon {
  box-sizing: border-box;
}
.topAreaWhite {
  background-color: #fff;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 50px;
  box-sizing: border-box;
  margin-top: 15px;
  margin-bottom: 15px;
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
    text-align: right;
    font-size: 28px;
    color: #333;
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
  .van-icon {
    font-size: 30px;
    margin-left: 16px;
    color: #666;
  }
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
  p {
    font-size: 28px;
    color: #333;
    margin-top: 30px;
  }
}
.pic:nth-last-child(1) {
  border: 0;
}
.bottomArea {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  padding-top: 30px;
  box-sizing: border-box;
  padding-bottom: 40px;
  margin-top: 280px;
}
.button {
  width: 278px;
  height: 70px;
  border-radius: 35px;
  font-size: 32px;
  color: #fff;
  text-align: center;
  line-height: 70px;
}
.positiveBtn {
  background: linear-gradient(#ff844e 0%, #fe6d56 100%);
  width: 73%;
}
</style>
