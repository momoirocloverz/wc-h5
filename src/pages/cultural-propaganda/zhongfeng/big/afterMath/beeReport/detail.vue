<template>
  <div class="detail">
    <div class="main">
      <title-bar :showLine="false" title="基本信息" customStyle="padding: 0px;margin: 0px;"></title-bar>
      <div class="status flex-row align-items-center justify-content-between fs-32">
        {{ name }}
        <div class="common-btn-plain fs-28" @click="gotoSubmit">上传蜂箱报告</div>
      </div>
      <div class="status fs-32">{{ address }}</div>
    </div>

    <template v-for="(item, index) in list" :key="index">
      <div class="main">
        <title-bar :showLine="false" :title="item.hive_no + '号蜂箱'" customStyle="padding: 0px;margin: 0px;"></title-bar>
        <detail-item title="上传时间" :value="item.created_at"></detail-item>
        <detail-item title="定位" :value="item.address"></detail-item>
        <div class="sub-title fs-28">蜂箱照片</div>
        <div class="w-100 flex-row flex-wrap">
          <ac-image v-for="(item1, index1) in item.img_url" :key="index1" :src="item1" width="95px" height="95px" customStyle="margin-top: 8px;margin-right: 10px"></ac-image>
        </div>
      </div>
    </template>
    <list-empty v-if="list.length == 0" title="暂无养蜂报告"> </list-empty>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import { Dialog, Toast } from 'vant'
import TitleBar from '@/components/titleBar.vue'
import AcImage from '@/components/acImage.vue'
import DetailItem from '@/components/detailItem.vue'
import ListEmpty from '@/components/listEmpty.vue'
export default {
  components: { TitleBar, AcImage, DetailItem, ListEmpty },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const id = ref(0)
    const hive_id = ref(0)
    const farmer_id = ref(0)
    const name = ref('') // 申请人名字
    const address = ref('') // 申请人地址
    const list = ref([
      //   {
      //     id: 1,
      //     hive_id: 3,
      //     img_id: "33",
      //     address: "寰诺",
      //     lon: "",
      //     lat: "",
      //     created_at: "2022-03-11 10:02:19",
      //     img_url: [
      //       "https://img.hzanchu.com/acimg/ba9e61d2bd79a0cdbc61fee63573f378.png",
      //     ],
      //   },
    ])

    // 前去提交蜂箱发布
    const gotoSubmit = () => {
      Router.push({
        name: 'culturalProBigBeeReportPublish',
        query: {
          hive_id: hive_id.value,
          farmer_id: farmer_id.value
        }
      })
    }
    // 获取当前
    const init = (id) => {
      Toast.loading({
        duration: 0,
        message: '获取详情中...',
        forbidClick: true
      })
      Request.fetchMajorFarmerHiveReportList({
        hive_id: id,
        page: 1,
        pageSize: 999
      })
        .then((res) => {
          if (res.code == 0) {
            // 这里暂时不做分页了
            list.value = res.data.data
          }
        })
        .finally(() => {
          Toast.clear()
        })
    }
    onMounted(() => {
      sessionStorage.removeItem('bigFarmerApplyMap')
      localStorage.removeItem('beeReportPublishState')
      if (Route.query.id) {
        id.value = Route.query.id
        hive_id.value = Route.query.hive_id
        farmer_id.value = Route.query.farmer_id
        name.value = Route.query.name
        address.value = Route.query.address
        init(Route.query.id)
      } else {
        Dialog.alert({
          message: '获取详情失败，请返回重试！',
          confirmButtonColor: '#FF844E'
        })
          .then(() => {
            Router.go(-1)
          })
          .catch(() => {})
      }
    })
    return {
      list,
      name,
      address,
      gotoSubmit
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../../../assets/css/fit.less';
.detail {
  width: 100%;
  padding: 30px;
  box-sizing: border-box;

  .main {
    width: 100%;
    margin-bottom: 30px;
    padding: 24px 30px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;

    .status {
      margin-top: 24px;
      div {
        // width: 164px;
        padding: 12px 30px;
      }
    }

    .sub-title {
      margin-top: 30px;
      color: #999999;
    }
    .value {
      margin-top: 16px;
      color: #333333;
    }
  }
}
</style>
