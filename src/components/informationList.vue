<template>
  <div class="tab">
    <div
      v-for="(item, tab) in tabList"
      :key="tab"
      class="commonFont"
      :style="{
        color: select_tab === item.value ? '#FE9E17' : '#999999',
        fontWeight: select_tab === item.value ? '600' : '400',
      }"
      :class="[state.ZLBFitForOld ? 'commonFontOld' : '']"
      @click="selectTab(item, tab)"
    >
      {{ item.title }}
      <span v-show="select_tab === item.value"></span>
    </div>
  </div>
  <div class="message-list">
    <div
      class="itemCon"
      v-for="(item, index) in messageList"
      :key="index"
      @click="toDetail(item)"
    >
      <div class="TextCon">
        <div
          class="itemTitle line-clamp-2"
          :class="[state.ZLBFitForOld ? 'itemTitleOld' : '']"
        >
          {{ item.title }}
        </div>
        <div
          class="itemTime"
          :class="[state.ZLBFitForOld ? 'itemTimeOld' : '']"
        >
          {{ item.updated_at }}
        </div>
      </div>
      <div
        class="imgCon"
        :style="
          item.top_image
            ? 'background-image: url(' + item.top_image + ')'
            : 'background-image: url(https://img.hzanchu.com/acimg/a00df9ebc4b71833879c97d9f898f306.png)'
        "
      ></div>
    </div>
  </div>
  <IsEmpty v-if="!messageList.length"></IsEmpty>
  <IsEnd v-if="messageList.length"></IsEnd>
</template>

<script>
import { ref, onBeforeMount, reactive } from 'vue'
import Request from '@/service/request.js'
import IsEmpty from '@/components/isEmpty.vue'
import IsEnd from '@/components/isEnd.vue'
import { useRouter, useRoute } from 'vue-router'
import { isZLB } from '@/util/index'
import { Toast } from 'vant'
export default {
  components: {
    IsEmpty,
    IsEnd,
  },
  setup() {
    const Router = useRouter()
    const route = useRoute()
    const tabList = [
      { title: '公告公示', value: '1' },
      { title: '最新政策', value: '2' },
      { title: '热点资讯', value: '3' },
    ]
    const state = reactive({
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
      ZLBFLAG: isZLB(),
    })
    const select_tab = ref(route.query.i || '1')
    const messageList = ref([])
    onBeforeMount(() => {
      // let index = sessionStorage.getItem('homeInformationIndex') ? sessionStorage.getItem('homeInformationIndex') : 1
      // if (index) {
      //   select_tab.value = index
      // }
      getList()
    })
    const getList = () => {
      Request.getList({
        type: select_tab.value,
        is_top: '1',
      }).then((res) => {
        if (res.code === 0) {
          messageList.value = res.data
        }
      })
    }
    const selectTab = (item) => {
      sessionStorage.setItem('homeInformationIndex', item.value)
      if (select_tab.value == item.value) {
        return
      }
      select_tab.value = item.value
      getList()
    }

    const toDetail = (item) => {
      sessionStorage.removeItem('information')
      if (item.top_image) {
        Router.push({
          path: '/information/detail',
          query: {
            top_image: item.top_image,
          },
        })
      } else {
        Router.push('/information/detail')
      }
      sessionStorage.setItem('information', item.content)
    }
    return {
      tabList,
      select_tab,
      selectTab,
      messageList,
      getList,
      toDetail,
      state,
    }
  },
}
</script>

<style lang="less" scoped>
@thirty: 30px;
@twentySix: 26px;
.itemCon {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  height: 195px;
  box-sizing: border-box;
  padding-top: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border: none;
  }
  .itemTitle {
    font-size: @thirty;
    font-weight: 500;
    text-align: left;
    color: #333333;
    line-height: 42px;
    height: 80px;
    width: 330px;
    margin-bottom: 20px;
  }

  .itemTitleOld {
    width: 450px;
    font-size: 45px;
    line-height: 45px;
    height: 85px;
    font-weight: 800;
  }

  .itemTime {
    font-size: @twentySix;
    text-align: left;
    color: #999999;
    line-height: 44px;
    letter-spacing: 1px;
  }
  .itemTimeOld {
    font-size: 40px;
    font-weight: 800;
  }
}
.tab {
  border-radius: 16px;
  height: 86px;
  display: flex;
  align-items: center;
  background: #fff;
  .commonFont {
    flex: 1;
    font-size: @thirty;
    color: #999;
    text-align: center;
    line-height: 86px;
    position: relative;
    height: 86px;
    span {
      width: 125px;
      height: 5px;
      background: #ff9a16;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .commonFontOld {
    font-size: 45px;
    font-weight: 800 !important;
  }
}

.message-list {
  padding: 0 32px;
  background-color: #fff;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  //   div {
  //     height: 106px;
  //     line-height: 106px;
  //     font-size: 28px;
  //     color: #333;
  //     border-top: 2px solid #f5f7fa;
  //     white-space: nowrap;
  //     overflow: hidden;
  //     text-overflow: ellipsis;
  //   }
}

.TextCon {
}
.imgCon {
  width: 240px;
  height: 160px;
  border-radius: 10px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.is-end {
  margin-top: 0.5rem;
}
.is-empty {
  margin: 1rem auto;
}
</style>
