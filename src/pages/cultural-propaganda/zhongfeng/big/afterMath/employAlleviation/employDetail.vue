<template>
  <div class="bigTrainingDetailCon">
    <div class="tableLeftCon" key="1">
      <div class="tableOuter">
        <table border="1" cellpadding="0" cellspacing="0" class="table-one">
          <tbody>
            <tr>
              <th>序号</th>
              <th>姓名</th>
              <th>电话号码</th>
            </tr>
            <template v-for="(item, index) in state.tableList1" :key="index">
              <tr>
                <td>{{ index + 1 }}</td>
                <td>{{ item.name }}</td>
                <td class="bluePhone">
                  {{ item.mobile.replace(item.mobile.substr(3, 4), '****') }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <empty v-if="!state.tableList1.length" description="暂无" />
      </div>
      <div class="tableLeftDetail">
        <div class="item">
          <span>工作内容</span>
          <div class="itemContent">{{ state.form.content }}</div>
        </div>
        <div class="item">
          <span>工作要求</span>
          <div class="itemContent">{{ state.form.demand }}</div>
        </div>
        <div class="item">
          <span>工作日期</span>
          <div class="itemContent">{{ state.form.work_date }}</div>
        </div>
        <div class="item">
          <span>工作时间</span>
          <div class="itemContent">{{ state.form.work_time }}</div>
        </div>
        <div class="item">
          <span>工作地址</span>
          <div class="itemContent">{{ state.form.address }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast, Dialog, Field, Empty } from 'vant'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  components: {
    Field,
    Empty,
    [Dialog.Component.name]: Dialog.Component,
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      active: 0,
      show: false,
      form: {
        content: '',
        demand: '',
        work_date: '',
        work_time: '',
        address: '',
      },
      tableList1: [],
      ZLBFLAG: isZLB(),
    })
    const firstAction = () => {
      let data = {
        id: Route.query.id,
        status: 2,
      }
      Request.majorWorkApplyList(data)
        .then((res) => {
          if (res && res.code == 0) {
            state.tableList1 = res.data.data
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const secondAction = () => {
      Request.fetchFarmerWorkinfo({
        id: Route.query.id,
      })
        .then((res) => {
          if (res && res.code == 0) {
            state.form = {
              content: res.data.content,
              demand: res.data.demand,
              work_date: res.data.work_date,
              work_time: res.data.work_time,
              address: res.data.address,
            }
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const initAction = () => {
      firstAction()
      secondAction()
    }
    onMounted(() => {
      initAction()
    })
    const saveAction = () => {
      Router.go(-1)
    }
    return {
      state,
      saveAction,
    }
  },
}
</script>

<style lang="less" scoped>
.bigTrainingDetailCon {
  box-sizing: border-box;
}
.bluePhone {
  color: #20a0ff;
}
table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #dee2e6;
  td {
    border: 1px solid #dee2e6;
    padding-top: 26px;
    padding-bottom: 26px;
    box-sizing: border-box;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: #333;
    background-color: #fff;
  }
  th {
    border: 1px solid #dee2e6;
    padding-top: 26px;
    padding-bottom: 26px;
    box-sizing: border-box;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: #333;
    background-color: #f7f7f8;
  }
}
.tableLeftDetail {
  background-color: #fff;
  box-sizing: border-box;
  margin-bottom: 15px;
  padding-left: 30px;
  padding-right: 30px;
}
.item {
  height: 86px;
  display: flex;
  align-items: center;
  align-content: center;
  border-bottom: 2px solid #ebebeb;
  &:last-child {
    border: none;
  }
  span {
    font-size: 28px;
    color: #333;
    width: 246px;
  }
  span:nth-of-type(2) {
    width: auto;
    margin-left: auto;
  }
  input {
    width: 410px;
    height: 100%;
    text-align: right;
    font-size: 28px;
    color: #333;
    margin-left: auto;
  }
  .itemContent {
    width: 410px;
    height: 100%;
    text-align: right;
    font-size: 28px;
    color: #333;
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
    align-content: center;
    align-items: center;
  }
  .calendarImg {
    width: 34px;
    height: 34px;
    margin-left: 20px;
    vertical-align: middle;
  }
}
.tableRightCon {
  background-color: #fff;
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
  margin-top: 15px;
  //   margin-bottom: 15px;
}
.pic {
  border-bottom: 2px solid #ebebeb;
  p {
    font-size: 28px;
    color: #333;
    margin-top: 30px;
  }
  .pic-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding-bottom: 30px;
    .image-box {
      width: 200px;
      height: 200px;
      position: relative;
      margin: 30px 20px 0 0;
      .delete {
        position: absolute;
        font-size: 36px;
        top: -18px;
        right: -18px;
        color: #ccc;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .upload-btn {
      width: 200px;
      height: 200px;
      box-sizing: border-box;
      border: 2px dashed #ccc;
      text-align: center;
      overflow: hidden;
      border-radius: 10px;
      margin: 30px 20px 0 0;
      .van-icon {
        font-size: 80px;
        color: #ccc;
        margin-top: 45px;
      }
      span {
        font-size: 32px;
        color: #ccc;
        margin-top: 12px;
        display: block;
      }
    }
  }
}
.pic:nth-last-child(1) {
  border: 0;
}
.tableLeftCon {
  margin-top: 15px;
  box-sizing: border-box;
  padding-bottom: 100px;
}
.tableOuter {
  background-color: #fff;
  padding: 30px;
  box-sizing: border-box;
  margin-bottom: 20px;
}
.button1 {
  width: 300px;
  height: 70px;
  background: linear-gradient(#ff844e 0%, #fe6d56 100%);
  border-radius: 35px;
  font-size: 32px;
  color: #fff;
  text-align: center;
  line-height: 70px;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 70px;
}
</style>
