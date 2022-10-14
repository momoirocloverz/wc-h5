<template>
  <ul class="medical-detail">
    <li>
      <span class="medical-bold">就诊日期</span>
      <span class="medical-bold">就诊诊断</span>
    </li>
    <li v-for="(item, i) in list" :key="i">
      <span>2021.03.21</span>
      <span>血压较高</span>
    </li>
    <div class="empty" v-if="!list.length">暂无数据</div>
  </ul>
</template>

<script>
export default {
  name:'medicalTreatment',
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  
}
</script>

<style lang="less" scoped>
  .medical-detail{
    width: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 10px 0px 30px 0px;
    li{
      width: 688px;
      height: 77px;
      margin: 0px auto;
      display: flex;
      flex-direction: row;
      align-items: center;
      border:#DEE2E6 solid 2px;
      border-top: none;
      span {
        width: 343px;
        height: 77px;
        line-height: 77px;
        font-size: 26px;
        text-align: center;
        border-right: #DEE2E6 solid 2px;
      }
      .medical-bold {
        font-weight: bold;
      }
      :last-child {
        border: none;
      }
    }

    li:first-child{
      border-top:#DEE2E6 solid 2px;
      background: #F8F8F9;
    }
    
    .empty {
      color: #999;
      font-size: 0.32rem;
      text-align: center;
      line-height: 77px;
      width: 688px;
      border:  #DEE2E6 solid 2px;
      border-top: none;
      margin: 0px auto;
    }
  }
</style>