<template>
  <div class="informationDetailCon">
    <img class="headImg" v-if="top_image" :src="top_image" />
    <div
      v-html="content"
      class="htmlCon"
      :class="[ZLBFitForOld ? 'contentOld' : '']"
      @click="checkHere"
    ></div>
  </div>
</template>
<script>
import { isZLB } from '@/util/index'
import { ImagePreview, Toast } from 'vant'
export default {
  data() {
    return {
      content: '',
      top_image: '',
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
    }
  },
  mounted() {
    if (this.$route.query && this.$route.query.top_image) {
      this.top_image = this.$route.query.top_image
    }
    this.content = sessionStorage.getItem('information')
  },
  unmounted() {
    // sessionStorage.removeItem('information')
  },
  methods: {
    checkHere(e) {
      let tagName = e.target.nodeName
      if (tagName == 'IMG') {
        let bridge = this.content
        var urlData = [] //存储需要的信息
        bridge.replace(
          /<img [^>]*src=['"]([^'"]+)[^>]*>/g,
          function (match, capture) {
            urlData.push(capture)
          }
        )
        if (urlData.length) {
          ImagePreview({
            images: urlData,
            startPosition: 0,
            closeable: true,
          })
        }
      }
    },
  },
}
</script>
<style lang="less" scoped>
@thirty: 30px;
@thirtySix: 36px;
.informationDetailCon {
  padding: 0.4rem;
  font-size: @thirty !important;
  line-height: @thirtySix !important;
  box-sizing: border-box;
  background-color: #fff;
  .headImg {
    width: 100%;
    margin-bottom: 20px;
  }
}
.contentOld {
  font-size: 50px !important;
  line-height: 57px !important ;
  font-weight: 800;
}
</style>
<style lang="less">
.informationDetailCon {
  .htmlCon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: flex-start;
    word-wrap: break-word;
    p {
      word-wrap: break-word;
      max-width: 100%;
    }
    video {
      width: 100%;
    }
    img {
      max-width: 100%;
      margin: 0 auto;
    }
  }
}
</style>
