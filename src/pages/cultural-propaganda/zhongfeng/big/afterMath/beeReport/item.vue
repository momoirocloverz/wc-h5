<template>
  <div class="_item fs-30" @click="gotoDetail">
    <div class="flex-row align-items-center">
      <div class="_left flex-row align-items-center justify-content-between">
        <img src="https://img.hzanchu.com/acimg/c4a8113deba557239d27518aa24b89da.png" />
        申请人
      </div>
      <div class="_main flex-row align-items-center justify-content-between">
        {{ item.farmerInfo.name }}
      </div>
    </div>

    <div class="c-666 flex-row align-items-center">
      <div class="_left">地址</div>
      <div class="_main">
        {{ item.farmerInfo.address || '-' }}
      </div>
    </div>

    <div class="c-666 flex-row align-items-center">
      <div class="_left">代养时间</div>
      <div class="_main">
        {{ item.apply_at || '-' }}
      </div>
    </div>
    <div class="c-666 flex-row align-items-center">
      <div class="_left">蜂箱编号</div>
      <div class="_main">
        {{ item.hive_no }}
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import Request from '@/service/request'
export default {
  props: {
    item: {
      type: Object
    } // 必传
  },
  setup(props, { emit }) {
    const Router = useRouter()
    // 跳转到详情页
    const gotoDetail = (e) => {
      Router.push({
        name: 'culturalProBigBeeReportDetail',
        query: {
          id: props.item.id,
          hive_id: props.item.id,
          farmer_id: props.item.farmer_id,
          name: props.item.farmerInfo.name,
          address: props.item.farmerInfo.address
        }
      })
    }

    return {
      gotoDetail
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../../../assets/css/fit.less';
._item {
  width: 100%;
  padding: 30px;
  //   margin-top: 30px;
  margin-bottom: 30px;
  box-sizing: border-box;
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
}
</style>
