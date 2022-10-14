<template>
  <div class="suggestion">
    <div class="suggestion-top" :class="[state.ZLBFitForOld ? 'suggestionTopOld' : '']">
      <span>咨询须知：</span>
      本平台只接受在脱贫工作中群众反映 的各类问题意见、建议和低收入人员申请。
      <span class="red">不受 理信访和投诉事项。</span>
    </div>
    <ul class="suggestion-content">
      <li>
        <img class="suggestion-icon" src="https://img.hzanchu.com/acimg/084a7b5375d6b5659c6061a243d6acd0.png" />
        <span class="suggestion-title" :class="[state.ZLBFitForOld ? 'suggestionTitleOld' : '']">姓名：</span>
        <van-field placeholder="请输入姓名" v-model="name" class="suggestion-ipt" :class="[state.ZLBFitForOld ? 'suggestionIptOld' : '']"></van-field>
      </li>
      <li>
        <img class="suggestion-icon" src="https://img.hzanchu.com/acimg/8952c3421d6adf1ca291d32e26c0dadc.png" />
        <span class="suggestion-title" :class="[state.ZLBFitForOld ? 'suggestionTitleOld' : '']">电话：</span>
        <van-field placeholder="请输入手机号(必填)" readonly v-model="state.showMobile" class="suggestion-ipt" :class="[state.ZLBFitForOld ? 'suggestionIptOld' : '']"></van-field>
      </li>
      <li>
        <img class="suggestion-icon" src="https://img.hzanchu.com/acimg/fb4484dad9949db31f0c8cc96a135672.png" />
        <span class="suggestion-title" :class="[state.ZLBFitForOld ? 'suggestionTitleOld' : '']">标题：</span>
        <van-field placeholder="请输入标题" v-model="title" class="suggestion-ipt" :class="[state.ZLBFitForOld ? 'suggestionIptOld' : '']"></van-field>
      </li>
      <li>
        <img class="suggestion-icon" src="https://img.hzanchu.com/acimg/47a82315f39334ba980cdab01410952b.png" />
        <span class="suggestion-title" :class="[state.ZLBFitForOld ? 'suggestionTitleOld' : '']">内容：</span>
        <van-field placeholder="请输入内容" v-model="content" class="suggestion-ipt" :class="[state.ZLBFitForOld ? 'suggestionIptOld' : '']"></van-field>
      </li>
      <li>
        <img class="suggestion-icon" src="https://img.hzanchu.com/acimg/ba9e61d2bd79a0cdbc61fee63573f378.png" />
        <span class="suggestion-title" :class="[state.ZLBFitForOld ? 'suggestionTitleOld' : '']">上传：</span>
        <van-uploader v-model="fileList" multiple max-count="2" class="suggestion-upload" />
      </li>
    </ul>
    <van-button type="primary" class="suggestion-submit" :class="[state.ZLBFitForOld ? 'suggestionSubmitOld' : '']" @click="upload">提交</van-button>
  </div>
</template>
<script>
import { ref, reactive, onBeforeMount } from 'vue'
import { Field, Uploader, Button } from 'vant'
import Request from '@/service/request.js'
import lrz from 'lrz'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import { isZLB, isAliPay } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
import OSS from 'ali-oss'
export default {
  name: 'suggestion',
  components: {
    [Field.name]: Field,
    [Uploader.name]: Uploader,
    [Button.name]: Button
  },
  setup() {
    const name = ref('')
    const mobile = ref('')
    const title = ref('')
    const content = ref('')
    const fileList = ref([])
    const imageList = ref([])
    const Router = useRouter()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ALIPAY: isAliPay(),
      client: {},
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      showMobile: ''
    })
    onBeforeMount(() => {
      fetchOss()
      fetchUserInfo()
    })
    const fetchUserInfo = () => {
      Request.getUserInfo()
        .then((res) => {
          if (res && res.code === 0) {
            mobile.value = res.data.mobile
            state.showMobile = res.data.mobile.replace(res.data.mobile.substr(3, 4), '****')
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
            Authorization: localStorage.getItem('token') || '',
            Accept: 'application/prs.xkm.v1.0.0+json'
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
    const upload = () => {
      for (let i = 0; i < fileList.value.length; i++) {
        console.log(fileList.value[i], 'fileList.value[i]')
        let legal =
          fileList.value[i].file.type == 'image/jpeg' || fileList.value[i].file.type == 'image/jpg' || fileList.value[i].file.type == 'image/png' || fileList.value[i].file.type == 'image/gif'
        if (legal) {
          lrz(fileList.value[i].file, { width: 600 }).then((res) => {
            if (state.ZLBFLAG) {
              let fileObj = res.file
              let url = `${state.client.path}/${fileList.value[i].file.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${fileObj.type.split('/')[1]}`
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
                        imageList.value.push(shazam.data.id)
                        if (imageList.value.length === fileList.value.length) {
                          submit()
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
              params.append('file', res.file, fileList.value[i].file.name)
              Request.upload(params).then((res2) => {
                if (res2.code === 0) {
                  imageList.value.push(res2.data.id)
                  if (imageList.value.length === fileList.value.length) {
                    submit()
                  }
                }
              })
            }
          })
        } else {
          return Toast('请上传jpeg,jpg,png,gif图片')
        }
      }
    }
    const submit = () => {
      const phoneReg = /^1[3-9]\d{9}$/
      const result = phoneReg.test(mobile.value)
      if (!result) {
        return Toast('请填写正确的手机号')
      }
      Request.suggestion({
        name: name.value,
        contact: mobile.value,
        title: title.value,
        content: content.value,
        image_id: imageList.value.join(',')
      }).then((res) => {
        if (res.code === 0) {
          Router.push(`/index?type=${localStorage.getItem('type')}`)
          Toast('提交成功')
        } else {
          Toast(res.msg)
        }
      })
    }
    return {
      state,
      name,
      mobile,
      title,
      content,
      fileList,
      imageList,
      upload
    }
  }
}
</script>
<style lang="less" scoped>
@thirty: 30px;
.suggestion {
  width: 100%;
  display: flex;
  flex-direction: column;
  .suggestion-top {
    // width: 640px;
    width: 85.33%;
    // height: 140px;
    background: #fff;
    margin: 20px auto;
    border-radius: 10px;
    font-size: @thirty;
    padding: 18px 25px;
    line-height: 50px;
    span {
      font-weight: bold;
    }
    .red {
      color: #f98686;
    }
  }
  .suggestionTopOld {
    font-size: 50px;
    font-weight: 800;
  }

  .suggestion-content {
    // width: 690px;
    width: 92%;
    background: #fff;
    display: flex;
    flex-direction: column;
    margin: 10px auto 0px auto;
    li {
      // width: 630px;
      width: 84%;
      height: 90px;
      margin: 0px auto;
      border-bottom: #f8fafc solid 2px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .suggestion-icon {
        width: 44px;
        height: 44px;
      }
      .suggestion-title {
        margin-left: 14px;
        font-size: @thirty;
        font-weight: 500;
      }
      .suggestionTitleOld {
        font-size: 45px;
        font-weight: 800;
      }
      .suggestion-ipt {
        // width: 470px;
        width: 62.66%;
      }
      .suggestionIptOld {
        font-size: 45px;
      }
    }
    li:last-child {
      border: none;
      height: auto;
    }
  }
  .suggestion-upload {
    // width: 440px;
    width: 58.66%;
    margin-left: 30px;
    margin-top: 10px;
  }
  .suggestion-submit {
    // width: 690px;
    width: 92%;
    margin: 40px auto;
  }
  .suggestionSubmitOld {
    font-size: 45px;
  }
}
</style>
