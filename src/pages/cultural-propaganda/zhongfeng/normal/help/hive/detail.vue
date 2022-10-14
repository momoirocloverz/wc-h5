<template>
  <div class="normalHiveDetailCon">
    <div class="tableLeftCon">
      <div class="currentInfo" @click="popSelect">
        <div class="currentHivo">蜂箱编号：{{ state.active }}号</div>
        <van-icon class="arrow" name="arrow" />
      </div>
      <pull-refresh v-model="state.refreshing" @refresh="onRefresh">
        <list
          v-model:loading="state.loading"
          class="cusVanList"
          :immediate-check="false"
          :finished="state.finished"
          @load="onLoad"
        >
          <div
            class="firstItem"
            v-for="(item, index) in state.tableList1"
            :key="index"
          >
            <div class="firstItemLeft">
              <div class="bindTopLeft">
                <div class="bindTopNo">更新时间：{{ item.created_at }}</div>
              </div>
              <div class="bottomCon">
                <div class="addressText" @click="toMap(item)">
                  定位地址：{{ item.address }}
                  <img
                    class="marker"
                    src="https://img.hzanchu.com/acimg/b33478a3358bc6b93405d4d5de43ecc6.png"
                  />
                </div>
                <div class="beePicsCon">
                  <img
                    class="beePics"
                    @click="popPreview(item.img_url, 0)"
                    :src="
                      item.img_url && item.img_url.length && item.img_url[0]
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </list>
        <IsEmpty class="emptyStyle" v-if="!state.tableList1.length"></IsEmpty>
        <IsEnd class="endStyle" v-if="state.tableList1.length"></IsEnd>
      </pull-refresh>
    </div>
    <popup position="bottom" v-model:show="state.showPicker">
      <picker
        title="蜂箱编号"
        @confirm="onConfirm"
        @cancel="onCancel"
        @change="onChange"
        :columns="state.columns"
        :columns-field-names="customFieldName"
        :default-index="state.pickerDefault"
      />
    </popup>
  </div>
</template>
<script>
import {
  Toast,
  Dialog,
  Field,
  ImagePreview,
  Picker,
  Popup,
  List,
  PullRefresh,
} from 'vant'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import IsEnd from '@/components/isEnd.vue'
import IsEmpty from '@/components/isEmpty.vue'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  components: {
    Field,
    Picker,
    Popup,
    [Dialog.Component.name]: Dialog.Component,
    List,
    PullRefresh,
    IsEnd,
    IsEmpty,
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      showPicker: false,
      pickerDefault: '',
      active: 0,
      currentId: '',
      onlyOne:
        'https://img.hzanchu.com/acimg/1d44466b4483e781869a3512228a61b3.png',
      show: false,
      tableList1: [],
      columns: [],
      finished: false,
      loading: false,
      refreshing: false,
      page: 1,
    })
    const customFieldName = {
      text: 'hive_no',
      children: 'children',
    }
    const setArray = () => {
      state.active = Route.query.hive_no
      state.currentId = Route.query.hive_id
      if (Route.query.list) {
        let array = JSON.parse(Route.query.list)
        state.columns = array
      }
    }
    const forInit = (res) => {
      const resData = res.data.data
      let previous = state.tableList1
      if (resData.length == 0) {
        state.finished = true
        state.loading = false
        state.refreshing = false
        state.tableList1 = previous.concat(resData)
      } else if (resData.length < 10) {
        state.finished = true
        state.loading = false
        state.refreshing = false
        state.tableList1 = previous.concat(resData)
      } else if (resData.length >= 10) {
        state.finished = false
        state.refreshing = false
        state.loading = false
        state.page++
        state.tableList1 = previous.concat(resData)
      }
    }
    const initAction = () => {
      state.loading = true
      let data = {
        page_size: 10,
        page: state.page,
        hive_id: state.currentId,
      }
      Request.fetchFarmerHivereport(data)
        .then((res) => {
          if (res && res.code == 0) {
            forInit(res)
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    onMounted(() => {
      setArray()
      initAction()
    })
    const toMap = (item) => {
      Router.push({
        name: 'myHiveMarkerMap',
        query: {
          lat: item.lat,
          lng: item.lon,
        },
      })
    }
    const popPreview = (array, index) => {
      ImagePreview({
        images: array,
        startPosition: index,
        closeable: true,
      })
    }
    const popSelect = () => {
      state.showPicker = true
    }
    const onChange = (value, index) => {
      state.pickerDefault = index
    }
    const onCancel = () => {
      state.showPicker = false
    }
    const onConfirm = (value) => {
      state.showPicker = false
      state.active = value.hive_no
      state.currentId = value.hive_id
      state.tableList1 = []
      state.page = 1
      initAction()
    }
    const onRefresh = () => {
      state.tableList1 = []
      state.page = 1
      state.finished = false
      state.loading = false
      state.refreshing = true
      onLoad()
      setTimeout(() => {
        state.refreshing = false
      }, 500)
    }
    const onLoad = () => {
      initAction()
    }
    return {
      state,
      popPreview,
      toMap,
      popSelect,
      customFieldName,
      onChange,
      onCancel,
      onConfirm,
      setArray,
      onRefresh,
      onLoad,
    }
  },
}
</script>

<style lang="less" scoped>
.normalHiveDetailCon {
  box-sizing: border-box;
}
.beePicsCon {
  margin-top: 32px;
}
.marker {
  width: 20px;
}
.beePics {
  width: 180px;
  height: 180px;
  border-radius: 4px;
}
.addressText {
  font-size: 30px;
  text-align: left;
  color: #666;
  margin-top: 32px;
}
.bindTopNo {
  font-size: 30px;
  color: #666;
}
.currentInfo {
  padding: 40px;
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  margin-bottom: 30px;
  .currentHivo {
    font-size: 32px;
    font-weight: 500;
    color: #333;
  }
  .arrow {
    font-size: 30px;
    color: #333;
    vertical-align: middle;
  }
}
.tableLeftCon {
  padding: 30px;
  box-sizing: border-box;
  padding-bottom: 100px;
}
.firstItem {
  padding: 40px;
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  margin-bottom: 30px;
}
.firstItemLeft {
}
.button {
  left: 50%;
  width: 100%;
  height: 70px;
  background: linear-gradient(#ff844e 0%, #fe6d56 100%);
  border-radius: 35px;
  font-size: 32px;
  color: #fff;
  text-align: center;
  line-height: 70px;
}
</style>
<style lang="less">
.normalHiveDetailCon {
  .dialogBeeTrainingCon {
    .van-dialog__content {
      padding: 30px;
      box-sizing: border-box;
    }
  }
}
</style>
