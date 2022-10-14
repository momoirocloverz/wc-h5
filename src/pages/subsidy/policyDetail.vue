<template>
  <div :class="['subsidyPolicyDetailCon', state.ZLBFitForOld ? 'withOld' : '']">
    <div class="topPart">
      <div class="title">{{ state.title }}</div>
      <div class="short">{{ state.code }}</div>
      <div class="describeCon">
        <div class="">文件发布者：{{ state.release_name }}</div>
        <div class="">发布日期：{{ state.release_at }}</div>
      </div>
    </div>
    <div class="bottomPart">
      <div class="htmlCon" v-html="state.content"></div>
    </div>
  </div>
</template>
<script>
import { onMounted, ref, reactive } from 'vue'
import { Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
      content: '',
      code: '',
      title: '',
      release_at: '',
      release_name: ''
    })
    onMounted(() => {
      getList()
    })
    const getList = () => {
      Request.applyPolicyInfo({
        id: Route.query.id
      }).then((res) => {
        if (res && res.code === 0) {
          let shorter = res.data
          state.content = shorter.content
          state.code = shorter.code
          state.title = shorter.title
          state.release_at = shorter.release_at
          state.release_name = shorter.release_name
        }
      })
    }
    return {
      state
    }
  }
}
</script>
<style lang="less" scoped>
.subsidyPolicyDetailCon {
  background-color: #fff;
  padding: 32px;
  box-sizing: border-box;
  .topPart {
    border-bottom: 2px solid #ebebeb;
    padding-bottom: 16px;
    box-sizing: border-box;
  }
  .title {
    font-size: 32px;
    color: #333;
    font-weight: 500;
    text-align: center;
    line-height: 45px;
  }
  .describeCon {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    font-size: 24px;
    color: #999;
  }
  .short {
    font-size: 28px;
    text-align: center;
    color: #666;
    line-height: 45px;
    margin-bottom: 30px;
  }
  .bottomPart {
    padding-top: 16px;
    box-sizing: border-box;
    font-size: 28px;
    line-height: 39px;
  }
  ::v-deep .htmlCon {
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
.withOld {
  .title {
    font-size: 34px !important;
  }
  .short {
    font-size: 32px !important;
  }
  .describeCon {
    font-size: 27px !important;
  }
}
</style>
