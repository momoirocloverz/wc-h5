<template>
  <div class="bigTrainingCon">
    <div class="tableLeftCon">
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
            @click="toDetail(item)"
          >
            <div class="firstItemLeft">
              <div class="trainingName">{{ item.content }}</div>
              <div class="trainingTime">工作日期: {{ item.work_date }}</div>
            </div>
            <div class="firstItemRight" @click.stop="popMask(item)">
              <img
                class="more"
                src="https://img.hzanchu.com/acimg/f41cb4db4144679965f13720b91d0990.png"
              />
            </div>
          </div>
        </list>
        <IsEmpty class="emptyStyle" v-if="!state.tableList1.length"></IsEmpty>
        <IsEnd class="endStyle" v-if="state.tableList1.length"></IsEnd>
      </pull-refresh>
    </div>
    <div class="whiteFixBack">
      <div class="button" @click="toNew">新增工作</div>
    </div>
    <action-sheet
      v-model:show="state.show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect"
    />
  </div>
</template>
<script>
import { Toast, Dialog, Field, ActionSheet, List, PullRefresh } from 'vant'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import IsEnd from '@/components/isEnd.vue'
import IsEmpty from '@/components/isEmpty.vue'
import { isZLB } from '@/util/index'
export default {
  components: {
    Field,
    [Dialog.Component.name]: Dialog.Component,
    ActionSheet,
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
      active: 0,
      show: false,
      deleteObj: {},
      tableList1: [],
      finished: false,
      loading: false,
      refreshing: false,
      page: 1,
    })
    const actions = [{ name: '编辑' }, { name: '终止招聘' }]
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
      Request.majorWorkList({
        page_size: 10,
        page: state.page,
      })
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
      initAction()
    })
    const toNew = () => {
      Router.push({
        name: 'culturalProBigNewEmploy',
      })
    }
    const toDetail = (item) => {
      Router.push({
        name: 'culturalProBigEmployDetail',
        query: {
          id: item.id,
        },
      })
    }
    const popMask = (item) => {
      state.show = true
      state.deleteObj = item
    }
    const onSelect = (item) => {
      state.show = false
      if (item.name == '终止招聘') {
        Dialog.confirm({
          message: '是否终止招聘？',
        })
          .then(() => {
            // on close
            Request.majorWorkDelete({
              id: state.deleteObj.id,
            })
              .then((res) => {
                if (res && res.code == 0) {
                  Toast('终止成功')
                  state.tableList1 = []
                  state.page = 1
                  initAction()
                } else {
                  Toast(res.msg)
                }
              })
              .catch((err) => {
                console.log('err', err)
              })
          })
          .catch(() => {
            console.log()
          })
      } else {
        Router.push({
          name: 'culturalProBigNewEmploy',
          query: {
            id: state.deleteObj.id,
          },
        })
      }
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
      onSelect,
      actions,
      toNew,
      toDetail,
      popMask,
      onRefresh,
      onLoad,
    }
  },
}
</script>

<style lang="less" scoped>
.bigTrainingCon {
  box-sizing: border-box;
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
  height: 168px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  margin-bottom: 30px;
}
.firstItemLeft {
  .trainingName {
    font-size: 32px;
    font-weight: 500;
    color: #333;
    margin-bottom: 30px;
  }
  .trainingTime {
    font-size: 30px;
    text-align: left;
    color: #666;
  }
}
.firstItemRight {
  .statusText {
    font-size: 30px;
    color: #ff844e;
  }
  .more {
    width: 8px;
    vertical-align: top;
  }
}
.whiteFixBack {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 108px;
  background-color: #fff;
  box-sizing: border-box;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 20px;
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
.bigTrainingCon {
  .dialogBeeTrainingCon {
    .van-dialog__content {
      padding: 30px;
      box-sizing: border-box;
    }
  }
}
</style>
