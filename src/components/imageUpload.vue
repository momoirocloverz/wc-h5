<!-- 自定义安厨图片上传组件 -->
<template>
  <div class="flex-row flex-wrap" :style="customStyle">
    <van-uploader
      v-model="file"
      :max-count="max"
      :accept="accept"
      :multiple="multiple"
      :style="'--upload-width: ' + width + '; --upload-height:' + height"
      :after-read="afterRead"
      :before-read="
        () => {
          // setPos(8);
          return true
        }
      "
      :before-delete="dealDelete"
    >
      <van-image src="https://img.hzanchu.com/acimg/39598ca781d11e4fbd0ac1b229bd5320.png" :width="width" :height="height"></van-image>
    </van-uploader>
  </div>

  <pre-video ref="preVideo" :src="videoSrc"></pre-video>
</template>

<script>
import { ref, defineComponent } from 'vue'
import { onMounted } from '@vue/runtime-core'
import { Toast } from 'vant'
import preVideo from '@/components/preview/video.vue'
import { isZLB } from '@/util/index'
import Compressor from 'compressorjs'
import Request from '@/service/request'
import { mgop } from '@aligov/jssdk-mgop'
import OSS from 'ali-oss'

export default defineComponent({
  components: { preVideo },
  props: {
    list: {
      type: Array
    },
    customStyle: {
      type: String,
      default: ''
    },
    max: {
      type: Number,
      default: 1
    }, // 最大的上传数量，默认为1
    multiple: {
      type: Boolean,
      default: false
    }, // 是否选择多样化，比如视频等
    width: {
      type: String,
      default: '95px'
    }, // 当前单个item的宽度
    height: {
      type: String,
      default: '95px'
    }, // 当前单个item的高度
    accept: {
      type: String,
      default: 'image/*'
    } // image/*,video/*
  },
  watch: {
    list(val) {
      console.log(val)
    }
  },
  setup(props, { emit }) {
    const file = ref([])
    const maxSize = ref(104857600) // 100MB大小
    const ossInfo = ref({
      client: {},
      path: ''
    }) // 当前oss上传相关字段
    const preVideo = ref(null)
    const videoSrc = ref('')

    // 是否超出大小
    const isOverSize = (file) => {
      if (file.size >= maxSize.value) {
        Toast('只能上传小于100MB大小的文件')
        return true
      } else {
        return false
      }
    }

    const afterRead = (file) => {
      console.log(file);
      if (file.file.size > maxSize.value) {
        Toast('只能上传小于100MB大小的文件')
        return
      }
      Toast.loading({
        duration: 0,
        message: '压缩中...',
        forbidClick: true
      })
      if (file.file.type.indexOf('video') != -1) {
        const data = new FormData()
        data.append('file', file.file)
        if (isZLB()) {
          uploadOss(file.file)
        } else {
          uploadImg(data)
        }
      } else {
        let legal = file.file.type == 'image/jpeg' || file.file.type == 'image/jpg' || file.file.type == 'image/png' || file.file.type == 'image/gif'
        if (legal) {
          new Compressor(file.file, {
            // 图片压缩
            quality: 0.7,
            success(result) {
              // console.log(result);
              const data = new FormData()
              data.append('file', result)
              if (isZLB()) {
                uploadOss(result)
              } else {
                uploadImg(data)
              }
            },
            error() {
              Toast('图片压缩失败，请重试')
              Toast.clear()
            }
          })
        } else {
          return Toast('请上传jpeg,jpg,png,gif图片')
        }
      }
    }

    // 上传到oss
    const uploadOss = (result) => {
      let url = `${ossInfo.value.path}/${result.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${result.type.split('/')[1]}`
      // 如果在浙里办环境下，先上传到oss
      ossInfo.value.client
        .multipartUpload(url, result)
        .then((data) => {
          Toast.clear()
          // 上传成功之后，回调，再通过调取自己服务器代码
          let str = data.res.requestUrls[0]
          setTimeout(() => {
            uploadImg({
              osspath: str.split('?')[0]
            })
          }, 150)
        })
        .catch((e) => {})
    }

    // 上传图片
    const uploadImg = (data) => {
      Toast.loading({
        duration: 0,
        message: '上传中...',
        forbidClick: true
      })

      Request.upload(data)
        .then((res) => {
          if (res.code === 0) {
            // console.log(res);
            emit('upload', res.data)
            Toast.clear()
          } else {
            Toast(res.msg)
          }
        })
        .catch(() => {
          Toast.clear()
        })
    }
    // 默认获取当前oss上传相关信息
    const getOssInfo = () => {
      mgop({
        api: 'mgop.zjanchu.gfb.ossInfo', // 必须
        host: 'https://mapi.zjzwfw.gov.cn/',
        dataType: 'JSON',
        type: 'POST',
        appKey: 'djk0at4y+2001885902+zngwuf', // 必须
        header: {
          Accept: 'application/prs.xkm.v1.0.0+json',
          Authorization: localStorage.getItem('token') || '',
        //   isTestUrl: '1'
        },
        onSuccess: (data) => {
          let oss = data.data.data
          ossInfo.value.client = new OSS({
            region: oss.region,
            accessKeyId: oss.accessKeyId,
            accessKeySecret: oss.accessKeySecret,
            bucket: oss.bucket
          })
          ossInfo.value.path = oss.path
        }
      })
    }

    // 删除当前文件，当前参数为 f（file）、detail
    const dealDelete = (f, detail) => {
      // console.log(file, detail);
      // 默认本地删除一条数据，然后上抛根页面数据
      file.value.splice(detail.index, 1)
      emit('delete', {
        pos: detail.index
      })
    }

    // 初始化当前默认数据
    const init = () => {
      // 这里的格式主要是 [{url: "xxxxxx", id: 234324, ....}] 即可
      file.value = props.list
    }

    onMounted(() => {
      console.log(props.list)
      if (isZLB()) {
        getOssInfo()
      }
      init()
    })
    return { file, afterRead, preVideo, videoSrc, dealDelete, init }
  }
})
</script>

<style lang="less" scoped>
@import '../assets/css/fit.less';
/deep/ .van-uploader__preview {
  width: var(--upload-width);
  height: var(--upload-height);
}
/deep/ .van-uploader__preview-image {
  width: var(--upload-width);
  height: var(--upload-height);
}
</style>
