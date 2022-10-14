<template>
  <div class="outer">
    <img
      v-if="status === 0 || status === 1"
      src="https://img.hzanchu.com/acimg/d2d22a72ad2838c1d1ae5aa07bfdeec2.png?x-oss-process=image/resize,l_300"
      alt
    />
    <img
      v-if="status === 3"
      src="https://img.hzanchu.com/acimg/f03101b5288b375759f3259990e2f1e0.png?x-oss-process=image/resize,l_300"
      alt
    />
    <img
      v-if="status === 2"
      src="https://img.hzanchu.com/acimg/2e5402380846a5910ce2d6f122681e57.png?x-oss-process=image/resize,l_300"
      alt
    />
    <div class="status">{{ statusName }}</div>
    <div class="note" v-if="status === 3">备注：{{ note }}</div>
    <div class="content" v-if="status === 2">
      <div class="name">{{ name }}</div>
      <div class="list">
        <div class="header">
          <span>{{ type === 1 ? '代养单位' : '帮扶村集体' }}</span>
          <span>蜂箱数量</span>
          <span>帮扶户数</span>
          <span>预计每户收入</span>
        </div>
        <div class="item" v-for="item in list" :key="item.id">
          <span>{{ type === 1 ? item.major_name : item.group_name }}</span>
          <span>{{ item.bee_num }}</span>
          <span>{{ item.user_num }}</span>
          <span>{{ item.income }}元</span>
        </div>
      </div>
    </div>
    <div class="btn" v-if="status === 0 || status === 1" @click="toBack">
      返回
    </div>
    <div class="btn" v-if="status === 3" @click="reApply">重新申请</div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Request from '@/service/request'
import { Toast } from 'vant'
import { isZLB } from '@/util/index'
export default {
  setup() {
    const Router = useRouter()
    const route = useRoute()
    const type = ref('') // 1 村集体  2 养殖大户
    const status = ref(11)
    const note = ref('')
    const statusName = ref('')
    const list = ref([])
    const id = ref('')
    const name = ref('')
    const state = reactive({
      ZLBFLAG: isZLB(),
    })

    onMounted(() => {
      getInfo()
    })

    const getInfo = () => {
      // if(type.value === '2') {

      Request.zhongfengInfo().then((res) => {
        if (res.code === 0) {
          type.value = res.data.user_type
          status.value = res.data.status
          if (res.data.user_type === 1) {
            if (res.data.farm_comment) {
              note.value = res.data.farm_comment
            } else if (res.data.town_comment) {
              note.value = res.data.town_comment
            } else {
              note.value = res.data.village_comment
            }
            console.log()
          } else {
            note.value = res.data.farm_comment || res.data.bee_comment
          }
          id.value = res.data.id
          name.value = res.data.user_type === 1 ? '村集体' : '养殖大户'
          if (res.data.status === 0 || res.data.status === 1) {
            statusName.value = '审批中'
          } else if (res.data.status === 2) {
            statusName.value = '已通过'
            getList()
          } else {
            statusName.value = '已拒绝'
          }
        }
      })

      // } else {
      //   Request.groupInfo().then(res => {
      //     if(res.code === 0) {
      //       status.value = res.data.status;
      //       note.value = res.data.farm_comment || res.data.village_comment;
      //       console.log(res.data.status, 'status')
      //       if(res.data.status === 0 || res.data.status === 1) {
      //         statusName.value = '审批中';
      //       } else if(res.data.status === 2) {
      //         statusName.value = '已通过';
      //       } else {
      //         statusName.value = '已拒绝';
      //       }
      //     }
      //   })
      // }
    }

    const getList = () => {
      Request.zhongfengIncome({
        user_type: type.value,
      }).then((res) => {
        if (res.code === 0) {
          list.value = res.data
        }
      })
    }

    const toBack = () => {
      Router.replace('/cultural-propaganda/zhongfeng/zhegulianghua')
    }

    const reApply = () => {
      Router.replace({
        path: '/cultural-propaganda/zhongfeng/apply',
        query: { id: id.value },
      })
    }

    return {
      type,
      status,
      note,
      statusName,
      toBack,
      list,
      reApply,
      name,
      state,
    }
  },
}
</script>

<style lang="less" scoped>
.outer {
  min-height: 100vh;
  overflow: hidden;
  text-align: center;
  background: #fff;
}
img {
  width: 213px;
  margin-top: 118px;
}
.status {
  font-size: 36px;
  color: #333;
  margin-top: 46px;
}
.note {
  font-size: 30px;
  color: #666;
  margin-top: 25px;
}
.content {
  overflow: hidden;
  padding: 0 30px;
  .name {
    font-size: 30px;
    color: #333;
    margin-top: 38px;
    text-align: left;
    font-weight: 600;
  }
  .list {
    margin-top: 34px;
    .header {
      height: 76px;
      display: flex;
      align-items: center;
      border-top: 2px solid #ccc;
      span {
        display: block;
        width: 100%;
        text-align: center;
        line-height: 28px;
        font-size: 24px;
        color: #333;
        font-weight: 600;
      }
    }
    .item {
      min-height: 74px;
      padding: 14px 0;
      display: flex;
      align-items: center;
      span {
        display: block;
        width: 100%;
        text-align: center;
        line-height: 28px;
        font-size: 24px;
        color: #333;
      }
    }
  }
}
.btn {
  width: 278px;
  height: 70px;
  background: #ff844e;
  border-radius: 35px;
  text-align: center;
  line-height: 70px;
  color: #fff;
  font-size: 30px;
  margin: 80px auto 0;
}
</style>
