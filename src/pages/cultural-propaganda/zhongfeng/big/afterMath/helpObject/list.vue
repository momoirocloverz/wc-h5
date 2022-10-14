<template>
  <div class="search-list">
    <slot />
    <van-skeleton class="van-skeleton" :row="6" :loading="isload">
      <van-list class="van-list fs-14" finished="true" finished-text=" " @load="load">
        <template v-if="type == 0">
          <title-bar title="已申请" customStyle="padding: 0px;background-color: transparent;border: none;"></title-bar>
          <div v-if="state.list1 && state.list1.length > 0">
            <div v-for="(item, index) of state.list1" :key="index">
              <item :item="item" :type="1" @reload="reload"></item>
            </div>
          </div>
          <list-empty v-else-if="state.list1 && state.list1.length == 0"></list-empty>
          <div class="btn1" v-if="!state.finished1" @click="more1">加载更多</div>
          <title-bar title="已拒绝" customStyle="padding: 0px;background-color: transparent;border: none;"></title-bar>
          <div v-if="state.list2 && state.list2.length > 0">
            <div v-for="(item, index) of state.list2" :key="index">
              <item :item="item" :type="2" @reload="reload"></item>
            </div>
          </div>
          <list-empty v-else-if="state.list2 && state.list2.length == 0"></list-empty>
          <div class="btn1" v-if="!state.finished2" @click="more2">加载更多</div>
        </template>
        <template v-if="type == 1">
          <div class="title-bar flex-row align-items-center justify-content-between" :style="true ? ' ' : ' border-bottom: 1px solid rgba(255,255,255,0); '">
            <div class="flex-row align-items-center">
              <div class="bar" :style="'background-color: ' + '#fd844e'"></div>
              <span class="title fs-32" :style="'color: ' + '#333'">待蜂箱上传</span>
            </div>
            <div class="addressTrigger">
              <img src="https://img.hzanchu.com/acimg/00b5d4e00b19d6009f97c02238b2824d.png" />
              <span class="fs-28" @click="popTown(1)">
                <span> {{ state.firsttown_name }}</span
                ><span v-if="state.firstvillage_id">/{{ state.firstvillage_name }}</span></span
              >
            </div>
          </div>
          <div v-if="state.list3 && state.list3.length > 0">
            <div v-for="(item, index) of state.list3" :key="index">
              <item
                :item="item"
                :type="3"
                @reload="reload"
                :townsInfo="{
                  firsttown_id: state.firsttown_id,
                  firstvillage_id: state.firstvillage_id,
                  firsttown_name: state.firsttown_name,
                  firstvillage_name: state.firstvillage_name,
                  secondtown_id: state.secondtown_id,
                  secondvillage_id: state.secondvillage_id,
                  secondtown_name: state.secondtown_name,
                  secondvillage_name: state.secondvillage_name,
                  thirdtown_id: state.thirdtown_id,
                  thirdtown_name: state.thirdtown_name,
                  thirdvillage_id: state.thirdvillage_id,
                  thirdvillage_name: state.thirdvillage_name
                }"
              ></item>
            </div>
          </div>
          <list-empty v-else-if="state.list3 && state.list3.length == 0 && state.finished3"></list-empty>
          <div class="btn1" v-if="!state.finished3" @click="more3">加载更多</div>
          <!-- <title-bar title="待审核" customStyle="padding: 0px;background-color: transparent;border: none;"></title-bar> -->
          <div class="title-bar flex-row align-items-center justify-content-between" :style="true ? ' ' : ' border-bottom: 1px solid rgba(255,255,255,0); '">
            <div class="flex-row align-items-center">
              <div class="bar" :style="'background-color: ' + '#fd844e'"></div>
              <span class="title fs-32" :style="'color: ' + '#333'">待审核</span>
            </div>
            <div class="addressTrigger">
              <img src="https://img.hzanchu.com/acimg/00b5d4e00b19d6009f97c02238b2824d.png" />
              <span class="fs-28" @click="popTown(3)">
                <span> {{ state.thirdtown_name }}</span
                ><span v-if="state.thirdvillage_id">/{{ state.thirdvillage_name }}</span></span
              >
            </div>
          </div>
          <div v-if="state.list4 && state.list4.length > 0">
            <div v-for="(item, index) of state.list4" :key="index">
              <item
                :ableclick="true"
                :item="item"
                :type="4"
                :townsInfo="{
                  firsttown_id: state.firsttown_id,
                  firstvillage_id: state.firstvillage_id,
                  firsttown_name: state.firsttown_name,
                  firstvillage_name: state.firstvillage_name,
                  secondtown_id: state.secondtown_id,
                  secondvillage_id: state.secondvillage_id,
                  secondtown_name: state.secondtown_name,
                  secondvillage_name: state.secondvillage_name,
                  thirdtown_id: state.thirdtown_id,
                  thirdtown_name: state.thirdtown_name,
                  thirdvillage_id: state.thirdvillage_id,
                  thirdvillage_name: state.thirdvillage_name
                }"
                @reload="reload"
              ></item>
            </div>
          </div>
          <list-empty v-else-if="state.list4 && state.list4.length == 0"></list-empty>
          <div class="btn1" v-if="!state.finished4" @click="more4">加载更多</div>
          <div class="title-bar flex-row align-items-center justify-content-between" :style="true ? ' ' : ' border-bottom: 1px solid rgba(255,255,255,0); '">
            <div class="flex-row align-items-center">
              <div class="bar" :style="'background-color: ' + '#fd844e'"></div>
              <span class="title fs-32" :style="'color: ' + '#333'"> 结对成功</span>
            </div>
            <div class="addressTrigger">
              <img src="https://img.hzanchu.com/acimg/00b5d4e00b19d6009f97c02238b2824d.png" />
              <span class="fs-28" @click="popTown(2)">
                <span> {{ state.secondtown_name }}</span
                ><span v-if="state.secondvillage_id">/{{ state.secondvillage_name }}</span>
              </span>
            </div>
          </div>
          <div v-if="state.list5 && state.list5.length > 0">
            <div v-for="(item, index) of state.list5" :key="index">
              <item :item="item" :type="5" @reload="reload" :ableclick="true"></item>
            </div>
          </div>
          <list-empty v-else-if="state.list5 && state.list5.length == 0"></list-empty>
          <div class="btn1" v-if="!state.finished5" @click="more5">加载更多</div>
        </template>
        <template v-if="type == 2">
          <title-bar title="待送箱上门" customStyle="padding: 0px;background-color: transparent;border: none;"></title-bar>
          <div v-if="state.list6?.length > 0">
            <div v-for="(item, index) of state.list6" :key="index">
              <item :item="item" :type="6" @reload="reload"></item>
            </div>
          </div>
          <list-empty v-else-if="state.list6?.length == 0"></list-empty>
          <div class="btn1" v-if="!state.finished6" @click="more6">加载更多</div>
          <title-bar title="已送箱上门" customStyle="padding: 0px;background-color: transparent;border: none;"></title-bar>
          <div v-if="state.list7?.length > 0">
            <div v-for="(item, index) of state.list7" :key="index">
              <item :item="item" :type="7" @reload="reload"></item>
            </div>
          </div>
          <list-empty v-else-if="state.list7?.length == 0"></list-empty>
          <div class="btn1" v-if="!state.finished7" @click="more7">加载更多</div>
        </template>
      </van-list>
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
import { Toast } from 'vant'
import TitleBar from '@/components/titleBar.vue'
import Request from '@/service/request'
import ListEmpty from '@/components/listEmpty.vue'
export default {
  components: { Item, TitleBar, ListEmpty },
  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: Number
    }
  },
  setup(props) {
    const list = ref([])
    const data = ref({})
    const isload = ref(true) // 当前骨架屏控制展示控制，默认为true表示需要展示骨架屏
    const page = ref(1)
    const pageSize = ref(10)
    const loading = ref(false) // 是否加载中，防止多次请求
    const state = reactive({
      page1: 1,
      page2: 1,
      page3: 1,
      page4: 1,
      page5: 1,
      page6: 1,
      page7: 1,
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      list7: [],
      finished1: false,
      finished2: false,
      finished3: false,
      finished4: false,
      finished5: false,
      finished6: false,
      finished7: false,
      showPicker: false,
      loading: false,
      firsttown_id: '',
      firstvillage_id: '',
      firsttown_name: '文成县',
      firstvillage_name: '',
      secondtown_id: '',
      secondvillage_id: '',
      secondtown_name: '文成县',
      secondvillage_name: '',
      thirdtown_id: '',
      thirdtown_name: '文成县',
      thirdvillage_id: '',
      thirdvillage_name: '',
      columns: address,
      popSelect: 1
    })
    const reload = () => {
      list.value = []
      loading.value = false
      isload.value = true
      load()
    }
    const load = () => {
      getList()
    }
    const fetchArray1 = () => {
      Toast.loading({ duration: 0, message: '加载中...', forbidClick: true })
      Request.planBeeMajorApplyWaitList({
        page: state.page1,
        pageSize: pageSize.value
      })
        .then((res) => {
          if (res && res.code == 0) {
            const resData = res.data.data
            let previous = state.list1
            if (resData.length == 0) {
              state.finished1 = true
              state.list1 = previous.concat(resData)
            } else if (resData.length < 10) {
              state.finished1 = true
              state.list1 = previous.concat(resData)
            } else if (resData.length >= 10) {
              state.finished1 = false
              state.list1 = previous.concat(resData)
            }
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
        .finally(() => {
          Toast.clear()
        })
    }
    const fetchArray2 = () => {
      Toast.loading({ duration: 0, message: '加载中...', forbidClick: true })
      Request.planBeeMajorApplyRejectList({
        page: state.page2,
        pageSize: pageSize.value
      })
        .then((res) => {
          if (res && res.code == 0) {
            const resData = res.data.data
            let previous = state.list2
            if (resData.length == 0) {
              state.finished2 = true
              state.list2 = previous.concat(resData)
            } else if (resData.length < 10) {
              state.finished2 = true
              state.list2 = previous.concat(resData)
            } else if (resData.length >= 10) {
              state.finished2 = false
              state.list2 = previous.concat(resData)
            }
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
        .finally(() => {
          Toast.clear()
        })
    }
    const fetchArray3 = () => {
      Toast.loading({ duration: 0, message: '加载中...', forbidClick: true })
      Request.planBeeMajorWaitUpload({
        page: state.page3,
        pageSize: pageSize.value,
        town_id: state.firsttown_id,
        village_id: state.firstvillage_id
      })
        .then((res) => {
          if (res && res.code == 0) {
            const resData = res.data.data
            let previous = state.list3
            if (resData.length == 0) {
              state.finished3 = true
              state.list3 = previous.concat(resData)
            } else if (resData.length < 10) {
              state.finished3 = true
              state.list3 = previous.concat(resData)
            } else if (resData.length >= 10) {
              state.finished3 = false
              state.list3 = previous.concat(resData)
            }
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
        .finally(() => {
          Toast.clear()
        })
    }
    const fetchArray4 = () => {
      Toast.loading({ duration: 0, message: '加载中...', forbidClick: true })
      Request.planBeeMajorWaitAudit({
        page: state.page4,
        pageSize: pageSize.value,
        town_id: state.thirdtown_id,
        village_id: state.thirdvillage_id
      })
        .then((res) => {
          if (res && res.code == 0) {
            const resData = res.data.data
            let previous = state.list4
            if (resData.length == 0) {
              state.finished4 = true
              state.list4 = previous.concat(resData)
            } else if (resData.length < 10) {
              state.finished4 = true
              state.list4 = previous.concat(resData)
            } else if (resData.length >= 10) {
              state.finished4 = false
              state.list4 = previous.concat(resData)
            }
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
        .finally(() => {
          Toast.clear()
        })
    }
    const fetchArray5 = () => {
      Toast.loading({ duration: 0, message: '加载中...', forbidClick: true })
      Request.planBeeMajorWaitSuc({
        page: state.page5,
        pageSize: pageSize.value,
        town_id: state.secondtown_id,
        village_id: state.secondvillage_id
      })
        .then((res) => {
          if (res && res.code == 0) {
            const resData = res.data.data
            let previous = state.list5
            if (resData.length == 0) {
              state.finished5 = true
              state.list5 = previous.concat(resData)
            } else if (resData.length < 10) {
              state.finished5 = true
              state.list5 = previous.concat(resData)
            } else if (resData.length >= 10) {
              state.finished5 = false
              state.list5 = previous.concat(resData)
            }
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
        .finally(() => {
          Toast.clear()
        })
    }
    const fetchArray6 = () => {
      Toast.loading({ duration: 0, message: '加载中...', forbidClick: true })
      Request.planBeeMajorOverWaitList({
        page: state.page6,
        pageSize: pageSize.value
      })
        .then((res) => {
          if (res && res.code == 0) {
            const resData = res.data.data
            let previous = state.list6
            if (resData.length == 0) {
              state.finished6 = true
              state.list6 = previous.concat(resData)
            } else if (resData.length < 10) {
              state.finished6 = true
              state.list6 = previous.concat(resData)
            } else if (resData.length >= 10) {
              state.finished6 = false
              state.list6 = previous.concat(resData)
            }
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
        .finally(() => {
          Toast.clear()
        })
    }
    const fetchArray7 = () => {
      Toast.loading({ duration: 0, message: '加载中...', forbidClick: true })
      Request.planBeeMajorOverEndList({
        page: state.page7,
        pageSize: pageSize.value
      })
        .then((res) => {
          if (res && res.code == 0) {
            const resData = res.data.data
            let previous = state.list7
            if (resData.length == 0) {
              state.finished7 = true
              state.list7 = previous.concat(resData)
            } else if (resData.length < 10) {
              state.finished7 = true
              state.list7 = previous.concat(resData)
            } else if (resData.length >= 10) {
              state.finished7 = false
              state.list7 = previous.concat(resData)
            }
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
        .finally(() => {
          Toast.clear()
        })
    }
    const resetAction = () => {
      state.page1 = 1
      state.page2 = 1
      state.page3 = 1
      state.page4 = 1
      state.page5 = 1
      state.page6 = 1
      state.page7 = 1
      state.list1 = []
      state.list2 = []
      state.list3 = []
      state.list4 = []
      state.list5 = []
      state.list6 = []
      state.list7 = []
      state.finished1 = false
      state.finished2 = false
      state.finished3 = false
      state.finished4 = false
      state.finished5 = false
      state.finished6 = false
      state.finished7 = false
    }
    const more7 = () => {
      state.page7++
      fetchArray7()
    }
    const more6 = () => {
      state.page6++
      fetchArray6()
    }
    const more5 = () => {
      state.page5++
      fetchArray5()
    }
    const more4 = () => {
      state.page4++
      fetchArray4()
    }
    const more3 = () => {
      state.page3++
      fetchArray3()
    }
    const more2 = () => {
      state.page2++
      fetchArray2()
    }
    const more1 = () => {
      state.page1++
      fetchArray1()
    }
    const analyseStorage = () => {
      if (sessionStorage.getItem('bigHelpObjectWithSelectInfo')) {
        let store = JSON.parse(sessionStorage.getItem('bigHelpObjectWithSelectInfo'))
        state.firsttown_id = store.firsttown_id
        state.firstvillage_id = store.firstvillage_id
        state.firsttown_name = store.firsttown_name
        state.firstvillage_name = store.firstvillage_name
        state.secondtown_id = store.secondtown_id
        state.secondvillage_id = store.secondvillage_id
        state.secondtown_name = store.secondtown_name
        state.secondvillage_name = store.secondvillage_name
        state.thirdtown_id = store.thirdtown_id
        state.thirdtown_name = store.thirdtown_name
        state.thirdvillage_id = store.thirdvillage_id
        state.thirdvillage_name = store.thirdvillage_name
      }
    }
    const getList = () => {
      resetAction()
      if (loading.value) return
      loading.value = true
      if (props.type == 0) {
        fetchArray1()
        fetchArray2()
      } else if (props.type == 1) {
        analyseStorage()
        fetchArray3()
        fetchArray4()
        fetchArray5()
      } else {
        fetchArray6()
        fetchArray7()
      }
    }
    onMounted(() => {
      load()
    })
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
      if (state.popSelect == 1) {
        state.firsttown_id = value[0].id
        if (value[1]) {
          state.firstvillage_id = value[1].id
          state.firstvillage_name = value[1].town_name
        }
        state.firsttown_name = value[0].town_name
        if (state.firsttown_id) {
          if (state.firstvillage_id) {
            state.page3 = 1
            state.list3 = []
            fetchArray3()
          } else {
            state.page3 = 1
            state.list3 = []
            fetchArray3()
          }
        } else {
          state.firstvillage_id = 0
          state.firstvillage_name = ''
          state.page3 = 1
          state.list3 = []
          fetchArray3()
          console.log(state.firsttown_id, state.firstvillage_id)
        }
      } else if (state.popSelect == 2) {
        state.secondtown_id = value[0].id
        if (value[1]) {
          state.secondvillage_id = value[1].id
          state.secondvillage_name = value[1].town_name
        }
        state.secondtown_name = value[0].town_name
        if (state.secondtown_id) {
          if (state.secondvillage_id) {
            state.page5 = 1
            state.list5 = []
            fetchArray5()
          } else {
            state.page5 = 1
            state.list5 = []
            fetchArray5()
          }
        } else {
          state.secondvillage_id = 0
          state.secondvillage_name = ''
          state.page5 = 1
          state.list5 = []
          fetchArray5()
          console.log(state.secondtown_id, state.firstvillage_id)
        }
      } else {
        state.thirdtown_id = value[0].id
        if (value[1]) {
          state.thirdvillage_id = value[1].id
          state.thirdvillage_name = value[1].town_name
        }
        state.thirdtown_name = value[0].town_name
        if (state.thirdtown_id) {
          if (state.thirdvillage_id) {
            state.page4 = 1
            state.list4 = []
            fetchArray4()
          } else {
            state.page4 = 1
            state.list4 = []
            fetchArray4()
          }
        } else {
          state.thirdvillage_id = 0
          state.thirdvillage_name = ''
          state.page4 = 1
          state.list4 = []
          fetchArray4()
        }
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
      data,
      isload,
      page,
      pageSize,
      loading,
      reload,
      load,
      getList,
      state,
      more7,
      more6,
      more5,
      more4,
      more3,
      more2,
      more1
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../../../assets/css/fit.less';
.title-bar {
  margin-top: 15px;
  .bar {
    width: 6px;
    height: 34px;
    border-radius: 2px;
  }
  .title {
    flex: 1;
    margin-left: 10px;
    font-weight: bold;
  }
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
.btn1 {
  height: 60px;
  padding-left: 30px;
  padding-right: 30px;
  line-height: 60px;
  box-sizing: border-box;
  border: 2px solid #fd844e;
  border-radius: 34px;
  font-size: 26px;
  color: #fd844e;
  text-align: center;
  margin-top: 20px;
}
.search-list {
  width: 100%;
  height: 100%;
  padding: 30px;
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
