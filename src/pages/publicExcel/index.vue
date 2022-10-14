<template>
  <div class="outer">
    <div
      class="item"
      v-for="(item, index) in state.array"
      :key="index"
      :class="[state.ZLBFitForOld ? 'itemOlder' : '']"
      @click="toDetail(item)"
    >
      {{ item.text }}
    </div>
  </div>
</template>
<script>
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { isZLB } from '@/util/index'
export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
      ZLBFLAG: isZLB(),
      array: [
        {
          text: '关于2021年雨露计划补助情况的公示',
          id: '1',
        },
        // {
        //   text: '关于2021年雨露计划补助情况的公示',
        //   id: '2',
        // },
        // {
        //     text: '文成县2021年度1月份城乡居民最低生活保障 人员名单',
        //     id: '3',
        // },
      ],
    })
    const toDetail = (item) => {
      Router.push({
        name: 'publicAnnouncementDetail',
        query: {
          id: item.id,
        },
      })
    }
    return {
      state,
      toDetail,
    }
  },
}
</script>
<style lang="less" scoped>
@thirty: 30px;
.outer {
  min-height: 100vh;
  padding: 30px;
  box-sizing: border-box;
}
.item {
  padding: 30px;
  box-sizing: border-box;
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 20px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  font-size: @thirty;
  color: #333;
  line-height: 48px;
  &:last-child {
    margin-bottom: 0;
  }
}
.itemOlder {
  font-size: 50px;
  font-weight: 800;
}
</style>
