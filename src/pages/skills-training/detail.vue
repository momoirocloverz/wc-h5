<template>
  <div class="skillDetail">
    <video
      id="video"
      class="video"
      controls
      x5-video-player-type="h5"
      x5-video-player-fullscreen="true"
      style="object-fit: fill"
      :poster="info.image_path ? info.image_path[0] : ''"
      :src="info.video_path ? info.video_path[0] : ''"
    >
      <source :src="info.video_path ? info.video_path[0] : ''" />
    </video>
    <div class="name">
      <p
        class="title"
        :class="[state.ZLBFitForOld ? 'titleOld' : '']"
        v-if="info.title"
      >
        {{ info.title }}
      </p>
      <p
        :class="[state.ZLBFitForOld ? 'secondOld' : '']"
        v-if="info.created_at"
      >
        {{ info.created_at + '上传' }}
      </p>
    </div>
    <p class="title" :class="[state.ZLBFitForOld ? 'titleOld' : '']">简介</p>
    <p :class="[state.ZLBFitForOld ? 'contentOld' : '']" v-if="info.content">
      {{ info.content }}
    </p>
  </div>
</template>

<script>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { Toast } from 'vant'
import Request from '@/service/request.js'
import { useRoute } from 'vue-router'
import { isZLB } from '@/util/index'
export default {
  setup() {
    const route = useRoute()
    const state = reactive({
      showPlay: true,
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
    })
    const info = ref('')

    onMounted(() => {
      getInfo()
    })

    const getInfo = () => {
      Request.skillInfo({
        skill_id: route.query.id,
      }).then((res) => {
        if (res.code === 0) {
          info.value = res.data
        }
      })
    }
    return {
      state,
      info,
    }
  },
}
</script>

<style scoped lang="less">
.skillDetail {
  position: relative;
  font-size: 28px;
  line-height: 44px;
  color: @content_color;
  .palyIcon {
    width: 94px;
    position: absolute;
    left: 50%;
    transform: translateX(-47px);
    top: 17%;
  }
  .video {
    width: 100%;
    height: 375px;
  }
  p {
    padding: 10px 32px 0;
  }

  .name {
    border-bottom: 2px solid @border_color;
    padding-bottom: 20px;
    p:nth-of-type(2) {
      color: @time_color;
      font-size: 24px;
    }
    .secondOld {
      font-size: 50px !important;
      font-weight: 800 !important;
    }
  }
  .title {
    font-size: 32px;
    font-weight: 500;
  }
  .titleOld {
    font-size: 50px;
    font-weight: 800;
  }
  .contentOld {
    font-size: 58px;
    line-height: 60px;
    font-weight: 800;
  }
}
</style>
