<template>
  <div class="bigDeclaDetailsCon">
    <div class="topAreaCon">
      <div class="areaTitle">
        <div class="areaTitleBar"></div>
        <div class="areaTitleText">申报进度</div>
      </div>
      <div class="stepCon">
        <div class="progressCon">
          <div class="progressLeft fs-26">
            <div class="statusText flex-row align-items-center justify-content-between fs-32">
              {{ getStatus }}
              <!-- <div class="fakeBtn" @click="toEditInfo">修改资料</div> -->
              <!-- <div v-if="state.info?.status == 3" :class="'edit-btn ' + (state.info?.status == 3 ? 'common-btn-plain' : 'common-btn-disable-plain')" @click="toEditInfo(state.info.status)">
                {{ getEditText }}
              </div> -->
              <div
                v-if="getEditText"
                :class="'edit-btn ' + (state.info && ((state.info.status == 2 && !state.info.drop_status) || state.info.status == 3) ? 'common-btn-plain' : 'common-btn-disable-plain')"
                @click="toEditInfo(state.info.status)"
              >
                {{ getEditText }}
              </div>
              <div :class="'edit-btn ' + 'common-btn-plain'" v-if="state.info && state.info.status == 2 && state.info.drop_status == 1" @click="popCancel(state.info.status)">取消申请</div>
              <div v-if="state.info && state.info.status == 2 && state.info.drop_status == 3" :class="'edit-btn  common-btn-plain'" @click="reQuit(state.info.status)">重新申请退出</div>
            </div>
            <template v-if="state.info&&state.info.status == 2 && !state.info.drop_status">
              <div class="statusText">评级：{{ state.info&&state.info.star }}星（{{ state.info&&state.info.ma_evaluation }}分）</div>
              <div class="statusText">帮扶箱数：{{ state.info&&state.info.farm_audit }}箱</div>
              <div class="statusText">(五星核准帮扶箱数为该养殖户上年度养殖箱数的80%)</div>
            </template>
            <div v-if="state.info&&state.info.status == 3" class="c-red">
              {{ state.info&&state.info.farm_comment }}
            </div>
            <div class="statusText">申请时间：{{ state.info&&state.info.created_at }}</div>
          </div>
          <!-- <img
            src="https://img.hzanchu.com/acimg/ee53518a02dfee3a86b4015d08284386.png"
          /> -->
        </div>
      </div>
    </div>

    <div class="middleAreaCon">
      <div class="areaTitle">
        <div class="areaTitleBar"></div>
        <div class="areaTitleText">基础信息</div>
      </div>
      <div class="itemMasterCon">
        <div class="itemCon">
          <span>资格自评</span>
          <div class="content">{{ state.info.evaluation }}分</div>
        </div>
        <hr />
        <div class="itemCon">
          <span>企业名称</span>
          <div class="content">{{ state.info.company_name }}</div>
        </div>
        <hr />
        <div class="itemCon">
          <span>社会统一 信用代码</span>
          <div class="content">{{ state.info.credit_code }}</div>
        </div>
        <hr />
        <div class="itemCon">
          <span>法定代表人</span>
          <div class="content" v-if="state.ZLBFLAG">
            {{ state.info.legal_rep.replace(state.info.legal_rep.substr(0, 1), '*') }}
          </div>
          <div v-else class="content">{{ state.info.legal_rep }}</div>
        </div>
        <hr />
        <div class="itemCon">
          <span>电话</span>
          <div class="content" v-if="state.ZLBFLAG">
            {{ state.info.mobile.replace(state.info.mobile.substr(3, 4), '****') }}
          </div>
          <div v-else class="content">{{ state.info.mobile }}</div>
        </div>
        <hr />
        <div class="itemCon">
          <span>开户行</span>
          <div class="content">{{ state.info.bank_name }}</div>
        </div>
        <hr />
        <!-- <div class="itemCon">
          <span>养殖年限</span>
          <div class="content">{{ state.info.train_year }}年</div>
        </div> -->

        <div class="itemCon">
          <span>开户名称</span>
          <div class="content">{{ state.info.bank_user }}</div>
        </div>
        <hr />
        <div class="itemCon">
          <span>银行账户</span>
          <div class="content">{{ state.info.bank_card }}</div>
        </div>
        <hr />
        <div class="itemCon">
          <span>联系人姓名</span>
          <div class="content">{{ state.info.linkman }}</div>
        </div>
        <hr />
        <div class="itemCon">
          <span>联系电话</span>
          <div class="content">{{ state.info.linkman_mobile }}</div>
        </div>
        <hr />
        <div class="itemCon">
          <span>养殖地点</span>
          <div class="content">
            {{ state.info.address }}
          </div>
        </div>
        <hr />
        <div class="itemCon">
          <span>经度</span>
          <div class="content">{{ state.info.lon }}</div>
        </div>
        <hr />
        <div class="itemCon">
          <span>纬度</span>
          <div class="content">{{ state.info.lat }}</div>
        </div>
        <hr />
        <div class="itemCon">
          <span>蜂箱数量</span>
          <div class="content">{{ state.info.train_hive }}</div>
        </div>
        <hr />
        <div class="itemCon">
          <span>主要蜜源</span>
          <div class="content">{{ state.info.bee_desc }}</div>
        </div>
        <hr />
        <div class="itemCon">
          <span>蜂场照片</span>
          <div class="content">
            <template v-for="(item, index) in state.info.bee_image_url" :key="index">
              <img class="picItem" :src="item" @click="popPreview(state.info.bee_image_url, index)" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, ImagePreview, Dialog } from 'vant'
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
  computed: {
    // 这里获取当前状态
    //   0待审核；2已通过；3已拒绝；4已结束
    getStatus: function () {
      let title = ''
      title = this.state.info.status_name
      if (this.state.info.status == 2) {
        if (this.state.info.drop_status) {
          switch (this.state.info.drop_status) {
            case 1:
              title = '退出申请审批中'
              break
            // case 2:
            //   title = '退出申请已通过'
            //   break
            case 3:
              title = '退出申请不通过'
              break
          }
        }
      }
      return title
      //   if (this.state.info.status == 0) {
      //     title = '待审核'
      //   } else if (this.state.info.status == 2) {
      //     title = '已通过'
      //   } else if (this.state.info.status == 3) {
      //     title = '已拒绝'
      //   }
      //   return title
    },
    getEditText: function () {
      let title = ''
      if (this.state.info.status == 0) {
        title = '修改信息'
      } else if (this.state.info.status == 2) {
        if (this.state.info.drop_status) {
          console
        } else {
          title = '申请退出'
        }
      } else if (this.state.info.status == 3) {
        title = '修改信息'
      }
      return title
    }
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      type: '1',
      tableList: [],
      info: {}
    })
    const firstReq = () => {
      Request.majorInfo({})
        .then((res) => {
          if (res && res.code == 0) {
            state.info = res.data
            console.log(state.info, 'info')
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const initAction = () => {
      firstReq()
    }
    onMounted(() => {
      initAction()
    })
    const popPreview = (array, index) => {
      ImagePreview({
        images: array,
        startPosition: index,
        closeable: true
      })
    }
    const toEditInfo = (status) => {
      if (status == 0) {
        Toast('正在审核中，暂不支持编辑')
      } else if (status == 2) {
        Router.push({
          name: 'culturalProCapQuit',
          query: {
            edit: '1'
          }
        })
      } else {
        Router.push({
          name: 'culturalProBigFarmerApply',
          query: {
            edit: '1'
          }
        })
      }
    }
    const reQuit = () => {
      Router.push({
        name: 'culturalProCapQuit',
        query: {
          edit: '1'
        }
      })
    }
    const popCancel = () => {
      Dialog.confirm({
        title: '取消申请',
        message: '取消退出申请，将继续履行结对养殖大户职责，确认取消吗?',
        confirmButtonColor: '#ff844e'
      })
        .then(() => {
          Request.planBeeMajorDropCancel({})
            .then((res) => {
              if (res && res.code == 0) {
                Toast('取消成功')
                firstReq()
              } else {
                Toast(res.msg)
              }
            })
            .catch((err) => {
              console.log('err', err)
            })
        })
        .catch(() => {
          // on cancel
          console.log('cancel')
        })
    }
    return {
      state,
      toEditInfo,
      popPreview,
      popCancel,
      reQuit
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../../../assets/css/fit.less';
table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #dee2e6;
  td {
    border: 1px solid #dee2e6;
    padding-top: 26px;
    padding-bottom: 26px;
    box-sizing: border-box;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: #333;
  }
  th {
    border: 1px solid #dee2e6;
    padding-top: 26px;
    padding-bottom: 26px;
    box-sizing: border-box;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: #333;
  }
}
.bluePhone {
  color: #20a0ff;
}
.bigDeclaDetailsCon {
  padding: 30px;
  box-sizing: border-box;
}
.picItem {
  height: 100px;
  width: 100px;
  margin-right: 30px;
  &:last-child {
    margin-right: 0;
  }
}
.itemMasterCon {
  margin-top: 30px;
  .itemCon {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: center;
    padding-top: 20px;
    padding-bottom: 20px;
    span {
      width: 150px;
      font-size: 30px;
      color: #999;
    }
    .content {
      width: 420px;
      font-size: 30px;
      text-align: left;
      color: #333;
      margin-left: 20px;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.stepCon {
  margin-top: 10px;
  .progressCon {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: flex-start;
    img {
      width: 83px;
      height: 92px;
    }
    .progressLeft {
      flex: 1;
      margin-right: 30px;
      // font-size: 26px;
      color: #999;

      .statusText {
        margin-top: 15px;
        margin-bottom: 10px;
        color: #333;
        // font-size: 32px;
      }
      .statusDescribe {
        margin-bottom: 10px;
        color: #999;
      }
    }
    .progressRight {
    }
  }
}
.areaTitle {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
}
.areaTitleBar {
  width: 7px;
  height: 36px;
  background-color: #ff844e;
  border-radius: 4px;
  margin-right: 12px;
}
.areaTitleText {
  line-height: 36px;
  height: 36px;
  font-size: 32px;
  font-weight: 500;
  color: #333;
}
.topAreaCon {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  box-sizing: border-box;
}
.middleAreaCon {
  background-color: #fff;
  margin-top: 30px;
  margin-bottom: 30px;
  border-radius: 10px;
  padding: 30px;
  box-sizing: border-box;
}
.bottomAreaCon {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  box-sizing: border-box;
}
.tableCon {
  margin-top: 35px;
}
.fakeBtn {
  height: 60px;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  border: 2px solid #fd844e;
  border-radius: 30px;
  font-size: 26px;
  color: #fd844e;
  line-height: 60px;
  text-align: center;
}
.yellowText {
  color: #fd844e;
}
.redText {
  color: #e85447;
}
hr {
  background-color: #ebebeb;
  height: 2px;
}

.edit-btn {
  padding: 10px 20px;
}

.c-red {
  color: red;
}
</style>
