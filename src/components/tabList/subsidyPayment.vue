<template>
    <ul class="subsidy-pay">
        <li>
          <em class="subsidy-em">日期</em>
          <em class="subsidy-em">款项名称</em>
          <em class="subsidy-em">款项金额</em>
          <em class="subsidy-em">发放情况</em>
        </li>
        <li v-for="(item, i) in list" :key="i">
          <em>{{item.bznd}}.{{item.bzyf}}</em>
          <em>{{item.xmmc}}</em>
          <em>{{item.ffje}}</em>
          <em>{{item.zfjg == 1 ? '已发放' : '申请中'}}</em>
        </li>
        <div class="empty" v-if="!list.length">暂无数据</div>
    </ul>
</template>
<script>
export default {
  name:'subsidypayment',
  props: {
    list: {
      type: Array,
      default: []
    }
  }
}
</script>
<style lang="less" scoped>
    .subsidy-pay{
        width: 100%;
        display: flex;
        flex-direction: column;
        padding:10px 0px 30px 0px;
        background: #fff;
        li {
          width: 688px;
          height: 77px;
          margin: 0px auto;
          display: flex;
          flex-direction: row;
          align-items: center;
          border:  #DEE2E6 solid 2px;
          border-top: none;
          em {
              width: 25%;
              height: 77px;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              border-right:  #DEE2E6 solid 2px;
              font-size: 26px;
          }
          :last-child {
              border-right: none;
          }
          .subsidy-em {
              font-weight: bold;
          }
        }
        li:first-child {
            background: #F8F8F9;
            border-top: #DEE2E6 solid 2px;
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