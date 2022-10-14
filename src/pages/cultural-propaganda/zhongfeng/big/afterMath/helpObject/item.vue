<template>
  <div class="_item fs-30" :style="customStyle">
    <div class="flex-row align-items-center" @click="toDetail(item)">
      <div class="_left flex-row align-items-center justify-content-between">
        <img src="https://img.hzanchu.com/acimg/c4a8113deba557239d27518aa24b89da.png" />
        申请人
      </div>
      <div class="_main flex-row align-items-center justify-content-between">
        {{ (item.farmerInfo && item.farmerInfo.name) || (item && item.name) }}
        <div v-if="type == 4">
          {{ statusMap[item.hive_status] }}
        </div>
      </div>
    </div>
    <div v-if="item.farmerInfo" class="c-666 flex-row align-items-center" @click="toDetail(item)">
      <div class="_left">地址</div>
      <div class="_main">{{ item.farmerInfo && item.farmerInfo.town_name }}{{ item.farmerInfo && item.farmerInfo.village_name }}</div>
    </div>
    <div class="c-666 flex-row align-items-center" @click="toDetail(item)">
      <div class="_left">联系方式</div>
      <div class="_main">
        {{ (item.farmerInfo && item.farmerInfo.mobile) || (item && item.mobile) }}
      </div>
    </div>

    <div class="c-666 flex-row align-items-center" @click="toDetail(item)">
      <div class="_left">申请时间</div>
      <div class="_main">
        {{ item.created_at }}
      </div>
    </div>

    <div v-if="type == 1 || type == 3 || type == 4" class="_line"></div>

    <div v-if="type == 1" class="_operate flex-row align-items-center justify-content-end">
      <div class="btn2" @click="refuse">拒绝</div>
      <div class="btn1" @click="pass">通过</div>
    </div>

    <div v-if="type == 3" class="_operate flex-row align-items-center justify-content-end">
      <div class="btn1" @click="gotoPublish(0)">上传蜂箱照片</div>
    </div>

    <div v-if="type == 4 && item.hive_status == 3" class="_operate flex-row align-items-center justify-content-between">
      <div class="_refuse fs-26">
        {{ item.hive_comment }}
      </div>
      <div class="btn1" @click="gotoPublish(1)">重新上传</div>
    </div>
  </div>

  <van-dialog v-model:show="refuseShow" title="拒绝理由" show-cancel-button confirm-button-color="#FF844E" cancel-button-color="#999999" @close="refuseClose" @confirm="refuseConfirm">
    <div class="_dialog">
      <p>请说明拒绝理由，便于低收入农户重新选择</p>
      <textarea v-model.trim="reason" placeholder="请输入拒绝原因，例'距离太远'" rows="3" />
    </div>
  </van-dialog>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'
import { isZLB } from '@/util/index'
import Request from '@/service/request'
import { Toast, ImagePreview, Dialog } from 'vant'
export default {
  props: {
    item: {
      type: Object
    }, // 必传
    type: {
      type: Number
    }, // type 为以下的类型参数
    // 1、2
    // 3、4、5
    // 6、7
    customStyle: {
      type: String,
      default: ''
    },
    ableclick: {
      type: Boolean,
      default: false
    },
    townsInfo: {}
  },
  computed: {},
  setup(props, { emit }) {
    const Router = useRouter()
    const refuseShow = ref(false)
    const reason = ref('')
    const statusMap = reactive({
      0: '待审批',
      1: '审批中',
      2: '审批通过',
      3: '已拒绝'
    })
    // 更新蜂箱照片、重新上传
    const gotoPublish = (isEdit) => {
      if (props.townsInfo && props.townsInfo.firsttown_name) {
        sessionStorage.setItem('bigHelpObjectWithSelectInfo', JSON.stringify(props.townsInfo))
      }
      if (isEdit) {
        localStorage.removeItem('bigBeeHiveNumberAddress')
      }
      Router.push({
        name: 'culturalProBigBeeHiveNumber',
        query: {
          farmer_id: props.item.farmer_id ? props.item.farmer_id : '',
          id: isEdit == 1 ? props.item.hive_id : ''
        }
      })
    }

    // 点击拒绝按钮
    const refuse = () => {
      refuseShow.value = true
    }

    // 确认提交拒绝
    const refuseConfirm = () => {
      Dialog.alert({
        message: '是否确定提交拒绝原因？',
        showCancelButton: true,
        confirmButtonColor: '#FF844E'
      })
        .then(() => {
          Toast.loading({
            duration: 0,
            message: '提交中...',
            forbidClick: true
          })
          Request.majorReject({
            farmer_id: props.item.farmer_id,
            comment: reason.value
          }).then((res) => {
            if (res.code == 0) {
              Toast('处理成功')
              emit('reload')
            } else {
              Toast.clear()
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    }

    // 关闭当前拒绝弹窗
    const refuseClose = () => {
      refuseShow.value = false
    }

    // 通过
    const pass = () => {
      Dialog.alert({
        message: '是否通过当前申请？',
        showCancelButton: true,
        confirmButtonColor: '#FF844E'
      })
        .then(() => {
          Toast.loading({
            duration: 0,
            message: '提交中...',
            forbidClick: true
          })
          Request.majorAgree({
            farmer_id: props.item.farmer_id
          }).then((res) => {
            if (res.code == 0) {
              Toast('处理成功')
              emit('reload')
            } else {
              Toast.clear()
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    }
    const toDetail = (item) => {
      if (props.townsInfo && props.townsInfo.firsttown_name) {
        sessionStorage.setItem('bigHelpObjectWithSelectInfo', JSON.stringify(props.townsInfo))
      }
      if (props.ableclick) {
        localStorage.removeItem('bigBeeHiveNumberAddress')
        Router.push({
          name: 'culturalProBigBeeHiveNumber',
          query: {
            farmer_id: props.item.farmer_id ? props.item.farmer_id : '',
            id: props.item.hive_id,
            operateDisable: '1'
          }
        })
      }
    }
    return {
      toDetail,
      refuseShow,
      refuse,
      pass,
      refuseClose,
      refuseConfirm,
      gotoPublish,
      reason,
      statusMap
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../../../assets/css/fit.less';
._item {
  width: 100%;
  margin-top: 15px;
  padding: 30px;
  box-sizing: border-box;
  //  box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 31, 116, 0);
  background-color: #ffffff;
  border-radius: 10px;
  ._left {
    width: 130px;
    text-align: right;
    img {
      width: 23px;
      height: 25px;
    }
  }

  ._main {
    flex: 1;
    margin-left: 30px;
  }

  .c-666 {
    color: #666666;
  }

  ._line {
    width: 100%;
    height: 2px;
    margin-top: 15px;
    margin-bottom: 15px;
    background-color: #ebebeb;
  }

  ._operate {
    width: 100%;

    ._refuse {
      width: 400px;
      background-color: #fff;
      color: #ff0000;
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
    }
    .btn2 {
      height: 60px;
      margin-right: 30px;
      padding-left: 30px;
      padding-right: 30px;
      line-height: 60px;
      box-sizing: border-box;
      border: 2px solid #cccccc;
      border-radius: 34px;
      font-size: 26px;
      color: #999999;
    }
  }
}

._dialog {
  padding-left: 25px;
  padding-right: 25px;
  box-sizing: border-box;
  textarea {
    width: 100%;
    height: 144px;
    box-sizing: border-box;
    padding: 20px;
    background-color: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
  }
  p {
    margin-top: 20px;
    margin-bottom: 30px;
    color: #999;
    font-size: 28px;
  }
}
</style>
