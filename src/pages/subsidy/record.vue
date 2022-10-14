<template>
  <div class="outer">
    <div class="list">
      <div
        class="item"
        v-for="(item, index) in list"
        :key="index"
        @click="toDetail(item)"
      >
        <div>
          <span>子女姓名</span>
          <span v-if="state.ZLBFLAG">{{
            item.children_name.replace(item.children_name.substr(0, 1), '*')
          }}</span>
          <span v-else>{{ item.children_name }}</span>
        </div>
        <div>
          <span>申报时间</span>
          <span>{{ item.apply_at }}</span>
        </div>
        <div>
          <span>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注</span>
          <span>{{
            item.farm_comment
              ? item.farm_comment
              : item.edu_comment
              ? item.edu_comment
              : item.town_comment
              ? item.town_comment
              : item.village_comment || '无'
          }}</span>
        </div>
        <!-- 待审批 -->
        <img
          v-show="item.status === 0"
          src="https://img.hzanchu.com/acimg/948320666516281666b9bd699480b530.png"
          alt
        />
        <!-- 审批中 -->
        <img
          v-show="item.status === 1"
          src="https://img.hzanchu.com/acimg/d3fb8165d94cc9a05156b1b609f323a1.png"
          alt
        />
        <!-- 已通过 -->
        <img
          v-show="item.status === 2"
          src="https://img.hzanchu.com/acimg/a7ccfdd602d7e5276196693f54b21f11.png"
          alt
        />
        <!-- 已拒绝 -->
        <img
          v-show="item.status === 3"
          src="https://img.hzanchu.com/acimg/2a4573738c891f09eca0e8f2899e5b0c.png"
          alt
        />
        <van-icon v-show="item.status === 3" name="arrow" />
      </div>
    </div>
  </div>
  <IsEmpty :text="'暂无申报记录'" v-if="isEmpty"></IsEmpty>
  <IsEnd v-if="isEnd"></IsEnd>
</template>

<script>
import { onMounted, ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import IsEmpty from '@/components/isEmpty.vue'
import IsEnd from '@/components/isEnd.vue'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
import { Toast } from 'vant'
export default {
  components: {
    IsEmpty,
    IsEnd,
  },
  setup() {
    const Router = useRouter()
    const route = useRoute()
    const list = ref([])
    const state = reactive({
      ZLBFLAG: isZLB(),
    })
    const isEmpty = ref(false)
    const isEnd = ref(false)
    onMounted(() => {
      getList()
    })
    const getList = () => {
      Request.applyRate({
        plan_id: route.query.plan_id,
        user_id: sessionStorage.getItem('uid'),
      }).then((res) => {
        if (res.code === 0) {
          if (res.data.length) {
            list.value = res.data
            isEnd.value = true
          } else {
            isEmpty.value = true
          }
        }
      })
    }

    const toDetail = (item) => {
      if (item.status === 3) {
        Router.push({
          path: '/subsidy/declare',
          query: { sid: item.id, plan_id: route.query.plan_id },
        })
      } else {
        return
      }
    }

    return {
      list,
      isEmpty,
      isEnd,
      toDetail,
      state,
    }
  },
}
</script>

<style lang="less" scoped>
.outer {
  overflow: hidden;
}
.list {
  padding: 0 30px;
  overflow: hidden;
  .item {
    overflow: hidden;
    padding: 7px 30px 50px;
    border-radius: 30px;
    margin-top: 15px;
    background: #fff;
    position: relative;
    div {
      display: flex;
      align-items: flex-start;
      font-size: 30px;
      margin-top: 40px;
      span:nth-of-type(1) {
        color: #999;
        width: 125px;
        text-align: right;
        line-height: 40px;
      }
      span:nth-of-type(2) {
        color: #333;
        margin-left: 20px;
        width: 358px;
        line-height: 40px;
      }
    }
    img {
      position: absolute;
      width: 123px;
      top: 0;
      right: 50px;
    }
    .van-icon {
      position: absolute;
      font-size: 30px;
      color: #333;
      right: 50px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
.is-end {
  margin: 30px 0;
}
.is-empty {
  margin-top: 30%;
}
</style>
