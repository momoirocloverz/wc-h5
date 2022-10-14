<template>
  <div class="mineAgricultureCon">
    <pull-refresh v-model="state.refreshing" @refresh="onRefresh">
      <list
        v-model:loading="state.loading"
        class="cusVanList"
        :immediate-check="false"
        :finished="state.finished"
        @load="onLoad"
      >
        <div
          class="cusCellItem"
          v-for="(item, index) in state.listData"
          :key="index"
        >
          <div class="itemCon" @click="checkDetail(item)">
            <div class="listImgOuter">
              <div
                class="imgCon"
                :style="
                  item.image_path && item.image_path.length
                    ? 'background-image: url(' + item.image_path[0] + ')'
                    : 'background-image: url(https://img.hzanchu.com/acimg/a00df9ebc4b71833879c97d9f898f306.png)'
                "
              ></div>
              <div
                class="itemType"
                :class="[state.ZLBFitForOld ? 'itemTypeOld' : '']"
              >
                {{ item.category_data }}
              </div>
            </div>
            <div
              class="rightSide"
              :class="[state.ZLBFitForOld ? 'rightSideOld' : '']"
            >
              <div
                class="title line-clamp-2"
                :class="[state.ZLBFitForOld ? 'titleOld' : '']"
              >
                {{ item.issue_title }}
              </div>
              <div class="time" :class="[state.ZLBFitForOld ? 'timeOld' : '']">
                {{ item.created_at }}
              </div>
            </div>
          </div>
          <divider :style="{ margin: '0', padding: '10px 0' }" />
          <div class="operateCon">
            <div class="statusCon">
              <div
                class="statusText"
                :class="[
                  item.audit_status == 3 ? 'red' : '',
                  item.audit_status == 1 ? 'orange' : '',
                  item.audit_status == 2 && item.is_open == 0 ? 'orange' : '',
                ]"
              >
                {{
                  item.audit_status != 2
                    ? state.statusMap[item.audit_status]
                    : item.audit_status == 2 && item.is_open == 0
                    ? '已下架'
                    : '已通过'
                }}
              </div>
              <img
                v-if="item.audit_status == 3"
                src="https://img.hzanchu.com/acimg/b9238eb9232fedaf5db7aa1ff2c8c069.png"
                @click="checkReason(item)"
              />
            </div>
            <div class="btnsCons">
              <div
                class="borderBtn"
                v-if="item.audit_status == 2 && item.is_open == 1"
                @click="popReject(item)"
              >
                下架
              </div>
              <div
                class="backBtn"
                v-if="item.audit_status == 2 && item.is_open == 0"
                @click="toEdit(item)"
              >
                重新上架
              </div>
              <div class="backBtn" v-else @click="toEdit(item)">编辑</div>
            </div>
          </div>
        </div>
      </list>
      <IsEmpty class="emptyStyle" v-if="!state.listData.length"></IsEmpty>
      <IsEnd class="endStyle" v-if="state.listData.length"></IsEnd>
    </pull-refresh>
  </div>
</template>
<script>
import Request from '@/service/request.js'
import { reactive, onMounted } from 'vue'
import { Field, List, PullRefresh, Icon, Divider, Dialog, Toast } from 'vant'
import { useRouter } from 'vue-router'
import IsEmpty from '@/components/isEmpty.vue'
import IsEnd from '@/components/isEnd.vue'
import { isZLB } from '@/util/index'
export default {
  components: {
    Field,
    List,
    PullRefresh,
    Icon,
    Divider,
    Dialog,
    Toast,
    IsEmpty,
    IsEnd,
  },
  setup() {
    const state = reactive({
      listData: [],
      finished: false,
      loading: false,
      refreshing: false,
      page: 1,
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
      statusMap: {
        1: '待审核',
        2: '已通过',
        3: '审核未通过',
      },
    })
    const Router = useRouter()
    onMounted(() => {
      sessionStorage.removeItem('fromMyAgriculture')
      onLoad()
    })
    const fetchList = async () => {
      state.loading = true
      let data = {
        issue_category: '',
        issue_type: '1',
        page_size: 10,
        page: state.page,
      }
      Request.userIssue(data)
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
    }
    const onRefresh = () => {
      state.listData = []
      state.page = 1
      state.finished = false
      state.loading = false
      onLoad()
      //   state.refreshing = true
      setTimeout(() => {
        state.refreshing = false
      }, 500)
    }
    const onLoad = () => {
      //   state.finished = true;
      //   state.loading = false
      //   state.refreshing = false
      fetchList()
    }
    const checkDetail = (item) => {
      Router.push({
        name: 'agricultureDetail',
        query: {
          id: item.id,
        },
      })
    }
    const popReject = (item) => {
      Dialog.confirm({
        title: '下架确认',
        message: '下架后，“我要买卖界面”将不再展示，确认下架吗？',
      })
        .then(() => {
          // on confirm
          let data = {
            is_open: 0,
            id: item.id,
          }
          Request.userSetProperty(data)
            .then((res) => {
              if (res && res.code === 0) {
                Toast('操作成功')
                onRefresh()
              }
            })
            .catch((err) => {
              console.log('err', err)
            })
        })
        .catch(() => {
          // on cancel
        })
    }
    const popDelete = (item) => {
      Dialog.alert({
        message: '确认要删除该条目',
        showCancelButton: true,
      })
        .then(() => {
          // on close
        })
        .catch((err) => {})
    }
    const toEdit = (item) => {
      sessionStorage.setItem('fromMyAgriculture', '1')
      Router.push({
        name: 'agriculturePublish',
        query: {
          id: item.id,
        },
      })
    }
    const checkReason = (item) => {
      Dialog.confirm({
        title: '审核未通过',
        message: item.audit_comment ? item.audit_comment : item.edit_comment,
        confirmButtonText: '修改内容',
        cancelButtonText: '返回',
      })
        .then(() => {
          sessionStorage.setItem('fromMyAgriculture', '1')
          Router.push({
            name: 'agriculturePublish',
            query: {
              id: item.id,
            },
          })
        })
        .catch(() => {})
    }
    return {
      state,
      fetchList,
      onRefresh,
      onLoad,
      checkDetail,
      popDelete,
      toEdit,
      checkReason,
      popReject,
    }
  },
}
</script>
<style lang="less" scoped>
@thirtyTwo: 32px;
@twentySix: 26px;
.mineAgricultureCon {
  padding-top: 30px;
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
  .cusVanList {
  }
  .emptyStyle {
    margin-top: 100px;
    margin-bottom: 140px;
  }
  .endStyle {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .listImgOuter {
    width: 250px;
    height: 194px;
    margin-right: 30px;
    position: relative;
    .itemType {
      position: absolute;
      left: 0;
      bottom: 0;
      font-size: @twentySix;
      text-align: left;
      color: #fff;
      padding-left: 10px;
      padding-right: 10px;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 5px;
      line-height: 42px;
    }
    .itemTypeOld {
      font-size: 45px;
      font-weight: 800;
    }
  }
  .imgCon {
    width: 250px;
    height: 194px;
    border-radius: 10px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
  .cusCellItem {
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
    margin-bottom: 20px;
    border-radius: 10px;
    overflow: hidden;
  }
  .deleteBtn {
    font-size: @twentySix;
    font-weight: 500;
    color: #999;
    line-height: 42px;
  }
  .deleteBtnOld {
    font-size: 45px;
    font-weight: 800;
  }
  .deIcon {
    vertical-align: -4px;
    margin-right: 5px;
  }
  .itemCon {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    .rightSide {
      width: 480px;
      height: 194px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-direction: column;
    }
    .rightSideOld {
      width: 400px;
    }
    .title {
      height: 85px;
      margin-bottom: 5px;
      font-size: @thirtyTwo;
      text-align: left;
      color: #333333;
      line-height: 42px;
      width: 100%;
    }
    .titleOld {
      width: 40%;
      font-size: 50px;
      line-height: 53px;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      overflow: hidden;
      font-weight: 800;
    }
    .price {
      font-size: @thirtyTwo;
      text-align: left;
      color: #f51818;
      line-height: 42px;
      margin-bottom: 10px;
    }
    .priceOld {
      font-size: 45px;
      font-weight: 800;
    }
    .lastLine {
      display: flex;
      justify-content: space-between;
      align-content: center;
      align-items: center;
    }

    .time {
      font-size: @twentySix;
      font-weight: 500;
      text-align: left;
      color: #999;
      margin-top: 6px;
    }
    .timeOld {
      font-size: 40px;
      font-weight: 800;
    }
  }
}
.operateCon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.statusCon {
  font-size: 26px;
  .statusText {
    color: #333;
  }
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  img {
    width: 32px;
    height: 32px;
  }
}
.btnsCons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
  .borderBtn {
    width: 176px;
    height: 56px;
    border: 2px solid #ff844e;
    background: #fff;
    border-radius: 35px;
    color: #ff844e;
    box-sizing: border-box;
    text-align: center;
    font-size: 32px;
    line-height: 56px;
    margin-right: 20px;
  }
  .backBtn {
    width: 176px;
    height: 56px;
    background: linear-gradient(90deg, #ff844e 0%, #fe6d56 100%);
    border-radius: 35px;
    text-align: center;
    font-size: 32px;
    color: #fff;
    line-height: 56px;
  }
}
.orange {
  color: #ff844e !important;
}
.grey {
  color: #999 !important;
}
.red {
  color: #ff0000 !important;
}
</style>
