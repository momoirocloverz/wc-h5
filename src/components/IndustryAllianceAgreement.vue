<!-- 自定义协议弹窗组件 -->
<template>
  <van-popup zIndex="9050" :show="showV" position="center" @click-overlay="cancel" style="background-color: #ffffff; border-radius: 16px">
    <div class="_agreement" :style="customStyle">
      <div class="_title fs-32" :style="'color: ' + titleColor">
        {{ title }}
      </div>
      <div v-html="content" class="_content fs-28"></div>
      <div class="_btn flex-row">
        <div class="common-btn-plain" @click="close">{{ cancelText }}</div>
        <div :class="showTime ? (isTimed ? 'common-btn' : 'common-btn-disable') : 'common-btn'" @click="confirm">
          {{ showTime ? (isTimed ? consfirmText : consfirmText + '(' + times + 's)') : consfirmText }}
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { ref, defineComponent } from 'vue'
import { onMounted } from '@vue/runtime-core'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: ''
    }, // 当前协议标题展示
    titleColor: {
      type: String,
      default: '#333'
    },
    content: {
      type: String,
      default: ''
    }, // 当前协议内容
    customStyle: {
      type: String,
      default: ''
    },
    showTime: {
      type: Boolean,
      default: false
    }, // 是否展示时间倒计时
    time: {
      type: Number,
      default: 10
    }, // 当前倒计时时间
    consfirmText: {
      type: String,
      default: '阅读并同意'
    },
    cancelText: {
      type: String,
      default: '取消'
    }
  },
  setup(props, { emit }) {
    const showV = ref(false) // 是否展示当前协议组件
    const isTimed = ref(false) // 是否已经阅读过当前协议了，在showTime为true的情况下，该参数才被用到
    const timer = ref(null)
    const times = ref(10) // 当前倒计时时间

    // 展示当前组件
    const show = () => {
      showV.value = true
      if (props.showTime && !isTimed.value) {
        // 如果当前需要展示时间倒计时并且当前还没有倒计时过
        if (timer.value) {
          clearInterval(timer.value)
          times.value = props.time // 倒计时时间
        }
        timer.value = setInterval(() => {
          --times.value
          // 倒计时结束
          if (times.value == 0) {
            // 展示当前是否已经倒计时结束
            isTimed.value = true
            clearInterval(timer.value)
          }
        }, 1000)
      }
    }
    // 关闭当前组件
    const close = () => {
      showV.value = false
    }
    // 点击确认当前组件
    const confirm = () => {
      // 是否阅读过
      if ((isTimed.value && props.showTime) || !props.showTime) {
        close()
        emit('confirm')
      }
    }
    onMounted(() => {})
    return { showV, show, close, isTimed, times, confirm }
  }
})
</script>

<style lang="less" scoped>
@import '../assets/css/fit.less';
._agreement {
  width: 80vw;
  // height: 100px;
  padding: 30px;
  box-sizing: border-box;
  border-radius: 12px;
  overflow: hidden;

  ._title {
    width: 100%;
    margin-bottom: 30px;
    text-align: center;
    font-weight: bold;
  }

  ._content {
    height: 40vh;
    color: #333;
    white-space: pre-wrap;
    overflow-y: scroll;
    // overflow-x: hidden;
    ::v-deep img {
      width: 100% !important;
      display: flex;
      justify-content: center;
      // height: 200px !important;
    }
  }

  ._btn {
    margin-top: 60px;
    div:nth-of-type(1) {
      flex: 1;
    }
    div:nth-of-type(2) {
      flex: 1;
      margin-left: 30px;
    }
  }
}
</style>
