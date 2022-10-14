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
              <div v-if="getEditText != ''" class="edit-btn common-btn-plain" @click="toEditInfo()">
                {{ getEditText }}
              </div>
            </div>

            <div v-if="state.info?.status == 3" class="c-red">
              {{ state.info?.comment }}
            </div>

            <div class="statusText">申请时间：{{ state.info?.created_at }}</div>
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
          <span>姓名</span>
          <div v-if="state.ZLBFLAG" class="content">
            {{ state.info && state.info.name.replace(state.info.name.substr(0, 1), '*') }}
          </div>
          <div v-else class="content">{{ state.info && state.info.name }}</div>
        </div>
        <div class="itemCon">
          <span>身份证号</span>
          <div v-if="state.ZLBFLAG" class="content">
            {{ state.info && state.info.identity.replace(state.info.identity.substr(3, 12), '************') }}
          </div>
          <div v-else class="content">
            {{ state.info && state.info.identity }}
          </div>
        </div>
        <div class="itemCon">
          <span>电话号码</span>
          <div v-if="state.ZLBFLAG" class="content">
            {{ state.info && state.info.mobile.replace(state.info.mobile.substr(3, 4), '****') }}
          </div>
          <div v-else class="content">
            {{ state.info && state.info.mobile }}
          </div>
        </div>
        <div class="itemCon">
          <span>家庭地址</span>
          <div v-if="state.ZLBFLAG" class="content">
            {{ state.info && state.info.address.replace(state.info.address.substr(2, 4), '****') }}
          </div>
          <div v-else class="content">
            {{ state.info && state.info.address }}
          </div>
        </div>
        <div class="itemCon">
          <span>开户行</span>
          <div class="content">{{ state.info && state.info.bank_name }}</div>
        </div>
        <div class="itemCon">
          <span>银行账户</span>
          <div class="content">{{ state.info && state.info.bank_card }}</div>
        </div>
        <!-- <div class="itemCon">
          <span>身份证照</span>
          <div class="content">
            <template
              v-for="(item, index) in state.info &&
              state.info.identity_image_url"
              :key="index"
            >
              <img
                @click="popPreview(state.info.identity_image_url, index)"
                class="picItem"
                :src="item"
              />
            </template>
          </div>
        </div> -->
      </div>
    </div>
    <div class="bottomAreaCon">
      <div class="areaTitle">
        <div class="areaTitleBar"></div>
        <div class="areaTitleText">结对对象</div>
      </div>
      <div class="tableCon">
        <div class="itemCon">
          <span>企业名称</span>
          <div class="content">{{ (state.info && state.info.matchInfo && state.info.matchInfo.company_name) || '-' }}</div>
        </div>
        <div class="itemCon">
          <span>电话号码</span>
          <div v-if="state.ZLBFLAG" class="content">
            <!-- {{ state.info?.matchInfo?.mobile.replace(state.info?.matchInfo?.mobile.substr(3, 4), '****') }} -->
            {{ state.info && state.info.matchInfo && state.info.matchInfo.mobile && state.info.mobile.replace(state.info.mobile.substr(3, 4), '****') }}
          </div>
          <div v-else class="content">
            <!-- {{ state.info?.matchInfo?.mobile }} -->
            {{ state.info && state.info.matchInfo && state.info.matchInfo.mobile }}
          </div>
        </div>
        <div class="itemCon">
          <span>公司地址</span>
          <div v-if="state.ZLBFLAG" class="content">
            <!-- {{ state.info?.matchInfo?.address.replace(state.info?.matchInfo?.address.substr(2, 4), '****') }} -->
            {{ state.info && state.info.matchInfo && state.info.matchInfo.address && state.info.address.replace(state.info.mobile.substr(2, 4), '****') }}
          </div>
          <!-- <div v-else class="content">{{ state.info?.matchInfo?.address }}</div> -->
          <div v-else class="content">{{ state.info && state.info.matchInfo && state.info.matchInfo.address }}</div>
        </div>
      </div>
    </div>
    <!-- <div class="editArea" v-if="state.info && state.info.status == 3">
      <div class="editTrigger" @click="toFirst">编辑</div>
    </div> -->
  </div>
</template>

<script>
import { Toast, ImagePreview, Dialog } from 'vant'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  components: {},
  computed: {
    // 这里获取当前状态
    //   0待审核；2已通过；3已拒绝；4已结束
    getStatus: function () {
      let title = ''
      if (this.state.info.status == 0) {
        title = '待审核'
      } else if (this.state.info.status == 2) {
        if (!Array.isArray(this.state.info?.matchInfo)) {
          if (this.state.info.matchInfo.status == 2) {
            if (!Array.isArray(this.state.info?.matchInfo?.hiveInfo)) {
              if (this.state.info.matchInfo?.hiveInfo?.drop_status == 1) {
                title = '自己养申请中'
              } else if (this.state.info.matchInfo?.hiveInfo?.drop_status == 2 && this.state.info.matchInfo?.hiveInfo?.drop_audit == 2) {
                title = '自己养申请通过'
              } else {
                if (this.state.info.matchInfo?.hiveInfo?.status == 1) {
                  title = '结对审批中'
                } else if (this.state.info.matchInfo?.hiveInfo?.status == 2) {
                  title = '结对成功'
                } else if (this.state.info.matchInfo?.hiveInfo?.status == 3) {
                  title = '结对失败'
                }
                //         title = '结对成功'
              }
            } else {
              title = '等待养殖大户上传蜂箱'
            }
          } else if (this.state.info.matchInfo?.status == 3) {
            title = '养殖大户不通过'
          } else {
            title = '待养殖大户审核'
          }
        } else {
          title = '审批通过'
        }
      } else if (this.state.info.status == 3) {
        title = '已拒绝'
      }
      return title
    },
    getEditText: function () {
      let title = ''
      if (this.state.info.status == 2) {
        console.log(Array.isArray(this.state.info?.matchInfo))
        if (Array.isArray(this.state.info?.matchInfo)) {
          title = '选择养殖大户'
        } else {
          if (this.state.info?.matchInfo?.status == 2) {
            if (Array.isArray(this.state.info?.matchInfo?.hiveInfo)) {
              title = ''
            } else {
              if (this.state.info?.matchInfo?.hiveInfo?.drop_status == 1) {
                title = '取消申请'
              } else if (this.state.info?.matchInfo?.hiveInfo?.drop_status == 2 && this.state.info?.matchInfo?.hiveInfo?.drop_audit == 2) {
                title = '收到蜂箱'
              } else {
                if (this.state.info?.matchInfo?.hiveInfo?.status == 2) {
                  title = '自己养'
                }
              }
            }
          } else if (this.state.info?.matchInfo?.status == 3) {
            title = '重新选择'
          } else {
            title = ''
          }
        }
      } else if (this.state.info?.status == 3) {
        title = '重新编辑'
      }
      return title
    }
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      progressActive: 0,
      type: '1',
      tableList: [],
      info: {},
      secondData: {},
      ZLBFLAG: isZLB()
    })

    const agreeAction = () => {}
    const firstReq = () => {
      Request.fetchFarmerBeeInfo({})
        .then((res) => {
          if (res && res.code == 0) {
            state.info = res.data
            // state.progressActive = res.data.audit_list.length - 1;
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const secReq = () => {
      // Request.fetchFarmerMatchInfo({
      //   status: "2",
      // })
      //   .then((res) => {
      //     if (res && res.code == 0) {
      //       state.secondData = res.data;
      //     } else {
      //       Toast(res.msg);
      //     }
      //   })
      //   .catch((err) => {
      //     console.log("err", err);
      //   });
    }
    const initAction = () => {
      firstReq()
      secReq()
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
    const toFirst = () => {
      Router.replace({
        name: 'culturalProNormalFarmerApply',
        query: {
          edit: '1'
        }
      })
    }
    const toEditInfo = () => {
      if (state.info?.status == 0) {
        Toast('当前申报审核中，请耐心等待')
        return
      } else if (state.info.status == 2) {
        if (Array.isArray(state.info?.matchInfo)) {
          Router.push({
            name: 'declareChoose'
          })
          return
        } else {
          if (state.info?.matchInfo?.status == 2) {
            if (Array.isArray(state.info?.matchInfo?.hiveInfo)) {
              return
            } else {
              if (state.info?.matchInfo?.hiveInfo?.drop_status == 1) {
                // title = "取消申请";
                cancelApply()
              } else if (state.info?.matchInfo?.hiveInfo?.drop_status == 2 && state.info?.matchInfo?.hiveInfo?.drop_audit == 2) {
                receive()
                // title = "收到蜂箱";
              } else {
                doMySelf()
                // title = "自己养";
              }
            }
          } else if (state.info?.matchInfo?.status == 3) {
            Router.push({
              name: 'declareChoose'
            })
            return
          } else {
            return
          }
        }
      } else if (state.info?.status == 3) {
        Router.push({
          name: 'culturalProNormalFarmerApply',
          query: {
            edit: '1',
            fromEdit: '1'
          }
        })
        return
      }
    }
    // 取消申请自己养
    const cancelApply = () => {
      Dialog.confirm({
        title: '取消申请',
        message: '您是否确定取消自己养申请？取消后，蜂箱会继续由当前结对养殖大户代养。',
        showCancelButton: true,
        confirmButtonColor: '#FF844E'
      })
        .then(() => {
          Toast.loading({
            duration: 0,
            message: '取消中...',
            forbidClick: true
          })
          Request.planBeefarmerCancelDelivery({})
            .then((e) => {
              if (e.code === 0) {
                Toast('取消成功！')
                setTimeout(() => {
                  initAction()
                }, 250)
              } else {
                Toast.clear()
                Dialog.confirm({
                  message: e.msg,
                  showCancelButton: false,
                  confirmButtonColor: '#FF844E'
                }).then(() => {
                  // Router.go(-1);
                })
              }
            })
            .catch(() => {
              Toast.clear()
            })
        })
        .catch(() => {
          // on cancel
        })
    }
    // 确认收到蜂箱
    const receive = () => {
      Dialog.confirm({
        title: '收到蜂箱',
        message: '请确认是否完整收到蜂箱，点击确认后将立即终止代养？',
        showCancelButton: true,
        confirmButtonColor: '#FF844E'
      })
        .then(() => {
          Toast.loading({
            duration: 0,
            message: '确认中...',
            forbidClick: true
          })
          Request.planBeefarmerConfirmDelivery({})
            .then((e) => {
              if (e.code === 0) {
                Toast('确认成功！')
                Router.go(-4) // 收到成功就返回
                // setTimeout(() => {
                //   initAction();
                // }, 250);
              } else {
                Toast.clear()
                Dialog.confirm({
                  message: e.msg,
                  showCancelButton: false,
                  confirmButtonColor: '#FF844E'
                }).then(() => {
                  // Router.go(-1);
                })
              }
            })
            .catch(() => {
              Toast.clear()
            })
        })
        .catch(() => {
          // on cancel
        })
    }
    // 申请自己养
    const doMySelf = () => {
      Dialog.confirm({
        titile: '自己养？',
        message: '是否确定申请自己养？提交申请后村审核，审核通过后，养殖大户将送蜂箱上门。',
        showCancelButton: true,
        confirmButtonColor: '#FF844E'
      })
        .then(() => {
          Toast.loading({
            duration: 0,
            message: '提交种...',
            forbidClick: true
          })
          Request.planBeefarmerApplyDeliveryt({})
            .then((e) => {
              if (e.code === 0) {
                Toast('提交成功！')
                setTimeout(() => {
                  initAction()
                }, 250)
              } else {
                Toast.clear()
                Dialog.confirm({
                  message: e.msg,
                  showCancelButton: false,
                  confirmButtonColor: '#FF844E'
                }).then(() => {
                  // Router.go(-1);
                })
              }
            })
            .catch(() => {
              Toast.clear()
            })
        })
        .catch(() => {
          // on cancel
        })
    }
    const reGroup = () => {
      Router.push({
        name: 'culturalProNormalPair',
        query: {
          edit: '1',
          fromEdit: '1'
        }
      })
    }
    const toSign = () => {
      Router.push({
        name: 'culturalProNormalSign'
      })
    }
    return {
      toSign,
      toEditInfo,
      reGroup,
      state,
      agreeAction,
      popPreview,
      toFirst
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
}
.itemCon {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: center;
  margin-bottom: 40px;
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
        margin-top: 24px;
        margin-bottom: 10px;
        font-size: 32px;
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
.editArea {
  margin-top: 30px;
  background-color: #fff;
  padding: 30px;
  box-sizing: border-box;
}
.editTrigger {
  width: 550px;
  margin: 0 auto;
  height: 70px;
  background: linear-gradient(#ff844e 0%, #fe6d56 100%);
  border-radius: 35px;
  font-size: 32px;
  color: #fff;
  text-align: center;
  line-height: 70px;
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
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.08);
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
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  height: 60px;
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

.edit-btn {
  padding: 10px 20px;
}

.c-red {
  color: red;
}
</style>
