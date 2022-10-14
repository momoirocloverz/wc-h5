<template>
  <div class="drawCon">
    <div class="signHint">请在空白处手动签名</div>
    <div class="signOuter">
      <vue-esign ref="esign" :height="600" :isCrop="state.isCrop" :lineWidth="state.lineWidth" :lineColor="state.lineColor" />
    </div>
    <!-- v-model:bgColor="state.bgColor"  -->
    <div class="bottomCon fixBottom">
      <div class="bottom">
        <div class="cancelBtn" @click="cancelAction">取消</div>
        <div class="cancelBtn" @click="clearAction">清除</div>
        <div class="button" @click="confirmAction">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
import vueEsign from 'vue-esign'
import { Toast } from 'vant'
import { reactive, onMounted, ref, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import { isZLB, base64ToPng } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
import OSS from 'ali-oss'
import lrz from 'lrz'
export default {
  components: { vueEsign },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const esign = ref(null)
    const state = reactive({
      lineWidth: 4,
      lineColor: '#000000',
      //   bgColor: '#fff',
      resultImg: '',
      isCrop: false,
      ZLBFLAG: isZLB(),
      content: '',
      justForShow: false,
      client: {}
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
            } else {
              Toast(shazam.msg)
            }
          }
        })
      }
    }
    const upload = (e) => {
      const fileObj = base64ToPng(state.resultImg, '签名' + Date.now())
      if (fileObj) {
        let legal = fileObj.type == 'image/jpeg' || fileObj.type == 'image/jpg' || fileObj.type == 'image/png' || fileObj.type == 'image/gif'
        if (legal) {
          //   lrz(fileObj, { width: 600 }).then(async (result) => {
          if (state.ZLBFLAG) {
            // let shorter = result.file
            let shorter = fileObj
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
                      let imgInfo = {
                        url: shazam.data.url,
                        id: shazam.data.id
                      }
                      sessionStorage.setItem('signName1', JSON.stringify(imgInfo))
                      nextTick(() => {
                        Router.go(-1)
                      })
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
            params.append('file', fileObj, fileObj.name)
            Request.upload(params).then((res) => {
              if (res.code === 0) {
                let imgInfo = {
                  url: res.data.url,
                  id: res.data.id
                }
                sessionStorage.setItem('signName1', JSON.stringify(imgInfo))
                nextTick(() => {
                  Router.go(-1)
                })
              } else {
                Toast('上传失败，请重试')
              }
            })
          }
          //   })
        } else {
          return Toast('请上传jpeg,jpg,png,gif图片')
        }
      }
    }
    const checkRoute = () => {
      if (Route && Route.query && Route.query.forShow) {
        state.justForShow = true
      } else {
        state.justForShow = false
      }
    }
    onMounted(() => {
      checkRoute()
      fetchOss()
    })
    const cancelAction = () => {
      Router.go(-1)
    }
    const clearAction = () => {
      esign.value.reset()
    }
    const confirmAction = () => {
      esign.value
        .generate()
        .then((res) => {
          state.resultImg = res
          upload()
        })
        .catch((err) => {
          console.log(err) // 画布没有签字时会执行这里 'Not Signned'
          Toast('请填写签名')
        })
    }
    return {
      clearAction,
      confirmAction,
      esign,
      cancelAction,
      state
    }
  }
}
</script>

<style lang="less" scoped>
.fixBottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.bottomCon {
  width: 100%;
  height: 128px;
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
  padding-top: 16px;
  box-sizing: border-box;
}
.drawCon {
  box-sizing: border-box;
}
.signHint {
  padding-left: 32px;
  box-sizing: border-box;
  padding-top: 22px;
  padding-bottom: 22px;
  font-size: 32px;
  color: #666;
}
.signOuter {
  background-color: #fff;
}
.articleCon {
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
  padding-bottom: 200px;
}
.title {
  margin: 0 auto;
  margin-bottom: 50px;
  width: 572px;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  color: #333;
  line-height: 48px;
}
.content {
  font-size: 28px;
  font-weight: bold;
  text-align: left;
  color: #333;
  line-height: 48px;
}
.bottomCon {
  width: 100%;
  height: 104px;
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
  padding-top: 16px;
  box-sizing: border-box;
  .cancelBtn {
    width: 20%;
    height: 72px;
    border: 2px solid #ff844e;
    box-sizing: border-box;
    border-radius: 36px;
    font-size: 28px;
    color: #ff844e;
    text-align: center;
    line-height: 68px;
    margin-right: 16px;
  }
  .button {
    width: 20%;
    height: 72px;
    background: linear-gradient(#ff844e 0%, #fe6d56 100%);
    border-radius: 36px;
    font-size: 28px;
    color: #fff;
    text-align: center;
    line-height: 72px;
  }
}
</style>
