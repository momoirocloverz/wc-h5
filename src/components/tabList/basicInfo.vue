<template>
  <ul class="basic-info">
    <li>
      <span>联系方式</span>
      <span>{{ data.Tel && data.Tel.slice(0, 3) }}***{{ data.Tel && data.Tel.slice(7) }}</span>
    </li>
    <li>
      <span>乡镇</span>
      <span v-if="state.ZLBFLAG">{{ data.town_name && data.town_name.replace(data.town_name.substr(0, 1), '*') }}</span>
      <span v-else>{{ data.town_name || '' }}</span>
    </li>
    <li>
      <span>行政村</span>
      <span v-if="state.ZLBFLAG">{{ data.village_name && data.village_name.replace(data.village_name.substr(0, 1), '*') }}</span>
      <span v-else>{{ data.village_name || '' }}</span>
    </li>
    <li>
      <span>家庭地址</span>
      <span v-if="state.ZLBFLAG">{{ data.Address && data.Address.replace(data.Address.substr(1, 3), '***') }}</span>
      <span v-else>{{ data.Address || '' }}</span>
    </li>
    <li>
      <span>保障人数</span>
      <span>1</span>
    </li>
    <li>
      <span>低保编号</span>
      <span>{{ data.DBBH || '' }}</span>
    </li>
    <li>
      <span>救助证件</span>
      <span>{{ data.JZBH || '' }}</span>
    </li>
    <li>
      <span>残疾证号</span>
      <span>{{ data.CJBH || '' }}</span>
    </li>
    <li>
      <span>结对单位</span>
      <span>{{ data.JDDW || '' }}</span>
    </li>
    <li>
      <span>就诊卡号</span>
      <span>{{ data.JZBH || '' }}</span>
    </li>
    <li>
      <span>致贫原因</span>
      <span>{{ data.ZPYY || '' }}</span>
    </li>
    <li>
      <span>状态</span>
      <span>{{ data.zt_name || '' }}</span>
    </li>
    <div v-if="data.family_list">
      <div v-for="(item, index) in data.family_list" :key="index">
        <li>
          <span>关联家属</span>
          <span>{{ item.TName }}</span>
        </li>
        <li>
          <span>身份证号</span>
          <span>{{ item.Card && item.Card.slice(0, 10) }}****{{ item.Card && item.Card.slice(15) }}</span>
        </li>
      </div>
    </div>
  </ul>
</template>

<script>
import { isZLB } from '@/util/index'
import { reactive } from 'vue'
export default {
  name: 'basicinfo',
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  setup() {
    const state = reactive({
      ZLBFLAG: isZLB()
    })
    return {
      state
    }
  }
}
</script>

<style lang="less" scoped>
@twentySix: 26px;
.basic-info {
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 10px 0px 30px 0px;
  li {
    width: 688px;
    height: 77px;
    margin: 0px auto;
    border: #dee2e6 solid 2px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 26px;
    border-top: none;
    span:nth-of-type(1) {
      width: 170px;
      height: 77px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      border-right: #dee2e6 solid 2px;
      color: #999;
    }
    span:nth-of-type(2) {
      width: 519px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }
  .resetLi {
    font-size: 35px;
  }
  li:first-child {
    border-top: #dee2e6 solid 2px;
  }
}
</style>
