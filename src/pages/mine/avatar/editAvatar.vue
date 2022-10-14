<template>
  <div class="editAvatarCon">
    <div class="describe" :class="[state.ZLBFitForOld ? 'describeOld' : '']">选择头像</div>
    <div class="uploadCon">
      <!-- <uploader v-model="state.fileList" :max-count="1" /> -->
    </div>
    <div class="buttonCon">
      <div class="fakeBtn" @click="onSave" :class="[state.fileList && state.fileList.length ? 'ableBtn' : '', state.ZLBFitForOld ? 'fakeBtnOld' : '']">保 存</div>
    </div>
    <div class="mask" v-show="state.showLoading">
      <loading color="#ff844e" class="setLoading" size="50px" vertical>图片上传中...</loading>
    </div>
    <!-- <Cropper v-if="state.cropperVisible"
             :imagePath="state.imagePath"
             fileType="blob"
             :cropSize="300"
             @save="onSave"
        @cancel="onCancel" />-->
  </div>
</template>
<script>
// import Cropper from "vue3-cropper";
// import 'vue3-cropper/lib/vue3-cropper.css';
import Request from '@/service/request.js'
import { Uploader, Loading, Toast } from 'vant'
import { reactive, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import lrz from 'lrz'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
import OSS from 'ali-oss'
export default {
  components: {
    Uploader,
    Loading,
    Toast
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      client: {},
      fileList: [],
      sourceId: '',
      showLoading: false,
      imagePath: '',
      previewImage: null,
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false
    })
    onBeforeMount(() => {
      init()
    })
    const fetchOss = () => {
    //   if (state.ZLBFLAG) {
    //     mgop({
    //       api: 'mgop.zjanchu.gfb.ossInfo', // 必须
    //       host: 'https://mapi.zjzwfw.gov.cn/',
    //       dataType: 'JSON',
    //       type: 'POST',
    //       appKey: 'djk0at4y+2001885902+zngwuf', // 必须
    //       header: {
    //         Accept: 'application/prs.xkm.v1.0.0+json',
    //         Authorization: localStorage.getItem('token') || ''
    //         // isTestUrl: '1'
    //       },
    //       onSuccess: (data) => {
    //         let shazam = data.data
    //         if (shazam && shazam.code === 0) {
    //           state.client = new OSS({
    //             region: shazam.data.region,
    //             accessKeyId: shazam.data.accessKeyId,
    //             accessKeySecret: shazam.data.accessKeySecret,
    //             bucket: shazam.data.bucket
    //           })
    //           state.client.path = shazam.data.path
    //         }
    //       }
    //     })
    //   }
    }
    const init = () => {
      const avatar_image = Route.query.avatar_image
      if (avatar_image) {
        state.fileList = [
          {
            url: avatar_image,
            id: Route.query.id
          }
        ]
      }
      fetchOss()
    }
    const onSave = () => {
      //   if (state.fileList.length) {
      //     if (state.fileList[0].id) {
      //       Router.go(-1)
      //     } else {
      //       state.showLoading = true
      //       lrz(state.fileList[0].file, { width: 600 }).then((res) => {
      //         let params = new FormData()
      //         params.append('file', res.file, state.fileList[0].file.name)
      //         if (state.ZLBFLAG) {
      //           let fileObj = res.file
      //           let url = `${state.client.path}/${
      //             state.fileList[0].file.name.split('.')[0]
      //           }-${Date.parse(new Date()) / 1000}.${fileObj.type.split('/')[1]}`
      //           let reader = new FileReader()
      //           reader.readAsDataURL(fileObj)
      //           reader.onloadend = () => {
      //             state.client
      //               .multipartUpload(url, fileObj)
      //               .then(async (data) => {
      //                 let str = data.res.requestUrls[0]
      //                 mgop({
      //                   api: 'mgop.zjanchu.gfb.zlbUpload', // 必须
      //                   host: 'https://mapi.zjzwfw.gov.cn/',
      //                   dataType: 'JSON',
      //                   type: 'POST',
      //                   appKey: 'djk0at4y+2001885902+zngwuf', // 必须
      //                   data: {
      //                     osspath: str.split('?')[0],
      //                   },
      //                   header: {
      //                     Authorization: localStorage.getItem('token') || '',
      //                     Accept: 'application/prs.xkm.v1.0.0+json',
      //                     // isTestUrl: '1'
      //                   },
      //                   onSuccess: (data) => {
      //                     let shazam = data.data
      //                     if (shazam && shazam.code === 0) {
      //                       saveAvatar(shazam.data.id)
      //                     } else {
      //                       Toast(shazam.msg)
      //                     }
      //                   },
      //                   onFail: (err) => {
      //                     console.log(err, 'errrr')
      //                   },
      //                 })
      //               })
      //           }
      //         } else {
      //           Request.upload(params).then((res2) => {
      //             if (res2.code === 0) {
      //               saveAvatar(res2.data.id)
      //             }
      //           })
      //         }
      //       })
      //     }
      //   } else {
      //     Toast('请选择图片')
      //   }
    }
    const saveAvatar = (id) => {
      let data = {
        avatar_id: id
      }
      Request.userUpdate(data)
        .then((res) => {
          if (res && res.code === 0) {
            Toast('头像保存成功')
            localStorage.removeItem('simpleUserInfo')
            setTimeout(() => {
              Router.go(-1)
            }, 200)
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    // const onCancel = () => {
    //   state.cropperVisible = false
    // };
    // const afterRead = (file) => {
    //   // 此时可以自行将文件上传至服务器
    //   state.imagePath = URL.createObjectURL(file.file);
    //   state.cropperVisible = true
    // };
    return {
      state,
      init,
      // action,
      // beforeRead,
      onSave
      // onCancel,
      // afterRead,
    }
  }
}
</script>
<style lang="less" scoped>
.editAvatarCon {
  position: relative;
  .describe {
    height: 100px;
    font-size: 32px;
    line-height: 100px;
    font-weight: 600;
    text-align: left;
    color: #4d4d4d;
    box-sizing: border-box;
    padding-left: 30px;
  }
  .describeOld {
    font-size: 50px;
    font-weight: 800;
  }
  .uploadCon {
    background-color: #fff;
    padding: 30px;
    padding-bottom: 20px;
    box-sizing: border-box;
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
  .fakeBtnOld {
    font-size: 45px;
  }
  .ableBtn {
    background: linear-gradient(to right, #ff844e 0%, #fe6d56 100%);
  }
  .mask {
    z-index: 3;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.9);
    .setLoading {
      margin-top: 5rem;
    }
  }
}
</style>
<style lang="less">
.editAvatarCon {
}
</style>
