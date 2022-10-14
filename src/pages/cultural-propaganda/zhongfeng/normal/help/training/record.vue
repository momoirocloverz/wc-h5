<template>
  <div class="outer">
    <div class="itemCon" v-for="(item, index) in state.arrayList" :key="index">
      <div class="firstLine">
        <div class="firstLeft">
          预约时间：
          <span>{{ item.apply_at }}</span>
        </div>
        <div
          class="firstRight"
          :class="[item.status ? (item.status == 2 ? 'orange' : 'red') : '']"
        >
          {{
            item.status
              ? item.status == 2
                ? '申请成功'
                : '申请失败'
              : '待审核'
          }}
        </div>
      </div>
      <div class="secondLine">
        提交时间：
        <span>{{ item.created_at }}</span>
      </div>
      <div class="thirdLine" v-if="item.status == 3">
        拒绝理由：{{ item.comment }}
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, reactive } from 'vue'
import { useRouter } from 'vue-router'
// import { Dialog } from 'vant';
import Request from '@/service/request'
import { Toast } from 'vant'
import { isZLB } from '@/util/index'
export default {
  // components: {
  //   [Dialog.Component.name]: Dialog.Component,
  // },
  setup() {
    const Router = useRouter()
    const state = reactive({
      arrayList: [],
      ZLBFLAG: isZLB(),
    })
    const initAction = () => {
      Request.fetchFarmerTrainApplyInfo({})
        .then((res) => {
          if (res && res.code == 0) {
            state.arrayList = res.data
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
  position: relative;
  padding: 30px;
  box-sizing: border-box;
}
.firstLine {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  margin-bottom: 30px;
}
.firstLeft {
  font-size: 30px;
  color: #333;
  line-height: 48px;
}
.firstRight {
  font-size: 30px;
  font-weight: 500;
  color: #666;
  line-height: 48px;
}
.secondLine {
  font-size: 28px;
  color: #999;
}
.thirdLine {
  margin-top: 30px;
  font-size: 30px;
  color: #999;
  line-height: 40px;
  width: 90%;
}
.itemCon {
  border-radius: 10px;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
  margin-bottom: 30px;
}
.orange {
  color: #ff844e;
}
.red {
  color: #f51818;
}
</style>
