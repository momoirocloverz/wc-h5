<template>
  <div class="search-list">
    <slot />
    <div class="endCon">
      <div class="addressTrigger">
        <img src="https://img.hzanchu.com/acimg/00b5d4e00b19d6009f97c02238b2824d.png" />
        <!-- state.firstMixname -->
        <span class="fs-28" @click="popTown">
          <span> {{ state.firsttown_name }}</span
          ><span v-if="state.firstvillage_id">/{{ state.firstvillage_name }}</span></span
        >
      </div>
    </div>
    <van-skeleton class="van-skeleton" :row="6" :loading="isload">
      <!-- <van-list
        class="van-list fs-14"
        :finished="finished"
        finished-text=" "
        @load="load"
      >
        <div v-if="list.length > 0">
          <div v-for="(item, index) of list" :key="index">
            <item :item="item"></item>
          </div>
        </div>
        <list-empty v-else-if="list.length == 0 && finished"></list-empty>
      </van-list> -->
      <pull-refresh v-model="state.refreshing" @refresh="onRefresh">
        <list v-model:loading="state.loading" class="cusVanList" :immediate-check="false" :finished="state.finished" @load="onLoad">
          <div v-for="(item, index) of state.listData" :key="index">
            <item :item="item"></item>
          </div>
        </list>
        <list-empty v-if="!state.listData.length && state.finished"></list-empty>
      </pull-refresh>
    </van-skeleton>
    <van-popup v-model:show="state.showPicker" round position="bottom">
      <van-picker
        ref="pickerTarget"
        :loading="state.loading"
        :columns="state.columns"
        :columns-field-names="customFieldName"
        @cancel="state.showPicker = false"
        @confirm="onConfirm"
        @change="pickerChange"
      />
    </van-popup>
  </div>
</template>
<script>
import address from '@/static/address.json'
import Item from './item.vue'
import { onMounted, ref, reactive } from 'vue'
import { Toast, List, PullRefresh } from 'vant'
import Request from '@/service/request'
import ListEmpty from '@/components/listEmpty.vue'
import IsEmpty from '@/components/isEmpty.vue'
import IsEnd from '@/components/isEnd.vue'

export default {
  components: { Item, ListEmpty, IsEmpty, IsEnd, List, PullRefresh },
  setup(props) {
    const list = ref([])
    const isload = ref(true) // 当前骨架屏控制展示控制，默认为true表示需要展示骨架屏
    const page = ref(1)
    const pageSize = ref(10) // 一页10个
    const finished = ref(false) // 是否页面到底了
    const loading = ref(false) // 是否加载中，防止多次请求
    const state = reactive({
      listData: [],
      finished: false,
      loading: false,
      refreshing: false,
      page: 1,
      total: 0,
      showPicker: false,
      firsttown_id: '',
      firstvillage_id: '',
      firsttown_name: '文成县',
      firstvillage_name: '',
      firstMixname: '文成县',
      columns: address
    })
    onMounted(() => {
      onLoad()
    })

    const getList = () => {
      /*    if (loading.value || finished.value) return
      loading.value = true
      // 这里请求数据
      Toast.loading({ duration: 0, message: '加载中...', forbidClick: true })
      Request.fetchMajorFarmerHiveList({
        page: page.value,
        pageSize: pageSize.value
      })
        .then((e) => {
          if (e.code === 0) {
            let data = e.data.data
            list.value = page.value == 1 ? data : list.value.concat(data)
            page.value++
            isload.value = false
            finished.value = e.data.current_page >= e.data.last_page
          }
        })
        .finally(() => {
          Toast.clear()
        }) */
      state.loading = true
      Toast.loading({ duration: 0, message: '加载中...', forbidClick: true })
      Request.fetchMajorFarmerHiveList({
        page_size: 10,
        page: state.page,
        town_id: state.firsttown_id,
        village_id: state.firstvillage_id
      })
        .then((res) => {
          if (res && res.code === 0) {
            const resData = res.data.data
            let previous = state.listData
            state.total = res.data.total
            if (resData.length == 0) {
              state.finished = true
              state.loading = false
              state.refreshing = false
              state.listData = previous.concat(resData)
            } else if (resData.length < 10) {
              state.finished = true
              state.loading = false
              state.refreshing = false
              state.listData = previous.concat(resData)
            } else if (resData.length >= 10) {
              state.finished = false
              state.refreshing = false
              state.loading = false
              state.page++
              state.listData = previous.concat(resData)
            }
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          Toast.clear()
        })
    }

    const onLoad = () => {
      //   state.finished = true;
      //   state.loading = false
      //   state.refreshing = false
      getList()
    }

    const onRefresh = () => {
      state.listData = []
      state.page = 1
      state.finished = false
      state.loading = false
      //   state.refreshing = true
      onLoad()
      setTimeout(() => {
        state.refreshing = false
      }, 500)
    }
    const pickerTarget = ref(null)
    const popTown = (val) => {
      state.popSelect = val
      state.showPicker = true
    }
    const customFieldName = {
      text: 'town_name',
      children: 'children'
    }
    const onConfirm = (value) => {
      state.showPicker = false
      state.firsttown_id = value[0].id
      if (value[1]) {
        state.firstvillage_id = value[1].id
        state.firstvillage_name = value[1].town_name
      }
      state.firsttown_name = value[0].town_name
      if (state.firsttown_id) {
        if (state.firstvillage_id) {
          state.firstMixname = state.firsttown_name + state.firstvillage_name
          //   state.page3 = 1
          //   state.list3 = []
          //   state.listData = []
          //   state.page = 1
          //   onLoad()

          onRefresh()
        } else {
          state.firstMixname = state.firsttown_name
          //   state.page3 = 1
          //   state.list3 = []
          //   state.listData = []
          //   state.page = 1
          //   onLoad()

          onRefresh()
        }
      } else {
        state.firstMixname = '文成县'
        state.firstvillage_id = 0
        state.firstvillage_name = ''
        // state.page3 = 1
        // state.list3 = []
        // state.listData = []
        // state.page = 1
        // onLoad()

        onRefresh()
        console.log(state.firsttown_id, state.firstvillage_id)
      }
    }
    const pickerChange = (value) => {}
    return {
      pickerChange,
      onConfirm,
      customFieldName,
      popTown,
      pickerTarget,
      list,
      isload,
      page,
      pageSize,
      finished,
      loading,
      getList,
      state,
      onRefresh,
      onLoad
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../../../assets/css/fit.less';
.endCon {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
  padding-top: 20px;
  padding-bottom: 20px;
  box-sizing: border-box;
}
.addressTrigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  img {
    width: 32px;
    height: 32px;
  }
  span {
    color: #666;
  }
}
.search-list {
  width: 100%;
  height: 100%;
  padding: 0 30px;
  box-sizing: border-box;

  .empty {
    margin-top: 120px;
    .icon {
      width: 387px;
      height: 256px;
    }
    .describe {
      margin-top: 40px;
      color: #333;
    }
  }
}
</style>
