<template>
  <div class="outer">
    <div class="content">
      <div class="header">
        <span>代养蜂箱数量</span>
        <span>蜂蜜收益（元）</span>
        <span>劳务收入（元）</span>
      </div>
      <div class="item" v-for="item in state.list" :key="item.id">
        <span>{{ item.num }}</span>
        <span>{{ item.money1 }}</span>
        <span>{{ item.money2 }}</span>
      </div>
      <empty v-if="!state.list.length" description="暂无" />
    </div>
  </div>
</template>
<script>
import { onBeforeMount, reactive } from 'vue'
import Request from '@/service/request'
import { Toast, Empty } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { isZLB } from '@/util/index'
export default {
  components: {
    Empty,
  },
  setup() {
    const state = reactive({
      list: [],
      ZLBFLAG: isZLB(),
    })
    const initAction = () => {
      Request.fetchFarmerIncome()
        .then((res) => {
          if (res && res.code == 0) {
            console.log(res.data.data)
            state.list = res.data.data
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    onBeforeMount(() => {
      initAction()
    })
    return {
      state,
    }
  },
}
</script>

<style lang="less" scoped>
.outer {
  padding: 30px;
  overflow: hidden;
}
.content {
  overflow: hidden;
  .header {
    height: 76px;
    display: flex;
    align-items: center;
    background: #f7f7f8;
    border: 2px solid #dee2e6;
    border-right: none;
    span {
      flex: 1;
      line-height: 76px;
      text-align: center;
      font-weight: bold;
      font-size: 28px;
      color: #333;
      border-right: 2px solid #dee2e6;
    }
  }
  .item {
    height: 76px;
    display: flex;
    align-items: center;
    background: #fff;
    border: 2px solid #dee2e6;
    border-right: none;
    span {
      flex: 1;
      line-height: 76px;
      text-align: center;
      font-weight: bold;
      font-size: 28px;
      color: #333;
      border-right: 2px solid #dee2e6;
    }
  }
}
</style>
