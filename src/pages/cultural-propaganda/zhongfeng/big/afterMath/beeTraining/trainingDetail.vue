<template>
  <div class="bigTrainingDetailCon">
    <van-tabs v-model:active="state.active" @change="onClickTab" sticky>
      <van-tab title="报名列表">
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
                    <td>
                      {{ item.name.replace(item.name.substr(0, 1), '*') }}
                    </td>
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
              <span>培训主题</span>
              <div class="itemContent">{{ state.form.theme }}</div>
            </div>
            <div class="item">
              <span>培训内容</span>
              <div class="itemContent">{{ state.form.content }}</div>
            </div>
            <div class="item">
              <span>培训时间</span>
              <div class="itemContent">{{ state.form.calendarText }}</div>
            </div>
            <div class="item">
              <span>培训地点</span>
              <div class="itemContent">{{ state.form.location }}</div>
            </div>
            <div class="item">
              <span>培训要求</span>
              <div class="itemContent">{{ state.form.demand }}</div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="培训报告">
        <div class="tableRightCon" key="2">
          <div class="item">
            <span>实际参与人数</span>
            <input v-if="!state.disable" type="text" maxlength="30" v-model.trim="state.form2.count" placeholder="请输入人数" />
            <div class="itemContent" v-else>{{ state.form2.count }}人</div>
          </div>
          <div class="pic">
            <p>上传培训照片</p>
            <div class="pic-list">
              <div v-for="(item, index) in state.form2.pic1" :key="item.id" class="image-box">
                <van-icon v-if="!state.disable" class="delete" name="clear" @click="toDelete1(index)" />
                <img :src="item.url" alt />
              </div>
              <div class="upload-btn" v-show="state.form2.pic1.length < 2" @click="choiceImg1">
                <van-icon name="plus" />
                <span>点击上传</span>
              </div>
            </div>
          </div>
          <div class="pic">
            <p>上传培训签到表</p>
            <div class="pic-list">
              <div v-for="(item, index) in state.form2.pic2" :key="item.id" class="image-box">
                <van-icon v-if="!state.disable" class="delete" name="clear" @click="toDelete2(index)" />
                <img :src="item.url" alt />
              </div>
              <div class="upload-btn" v-show="state.form2.pic2.length < 2" @click="choiceImg2">
                <van-icon name="plus" />
                <span>点击上传</span>
              </div>
            </div>
          </div>
        </div>
        <div class="button1" @click="saveAction" v-if="!state.disable">保存</div>
      </van-tab>
    </van-tabs>
    <input type="file" accept="image/*" id="upload_box" style="display: none" @change="upload" />
  </div>
</template>
<script>
import { Toast, Tab, Tabs, Dialog, Field, Empty } from 'vant'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import lrz from 'lrz'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
import OSS from 'ali-oss'
export default {
  components: {
    vanTab: Tab,
    vanTabs: Tabs,
    Field,
    Empty,
    [Dialog.Component.name]: Dialog.Component
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      client: {},
      active: 0,
      show: false,
      disable: false,
      form: {
        theme: '',
        content: '',
        calendarText: '',
        location: '',
        demand: ''
      },
      form2: {
        count: '',
        pic2: [],
        pic1: []
      },
      tableList1: []
    })
    const initAction = () => {
      fetchList()
    }
    const fetchOss = () => {
      if (state.ZLBFLAG) {
        mgop({
          api: 'mgop.zjanchu.gfb.ossInfo', // 必须
          host: 'https://mapi.zjzwfw.gov.cn/',
          dataType: 'JSON',
          type: 'POST',
          appKey: 'djk0at4y+2001885902+zngwuf', // 必须
          header: {
            Accept: 'application/prs.xkm.v1.0.0+json',
            Authorization: localStorage.getItem('token') || '',
            // isTestUrl: '1'
          },
          onSuccess: (data) => {
            let shazam = data.data
            if (shazam && shazam.code === 0) {
              state.client = new OSS({
                region: shazam.data.region,
                accessKeyId: shazam.data.accessKeyId,
                accessKeySecret: shazam.data.accessKeySecret,
                bucket: shazam.data.bucket
              })
              state.client.path = shazam.data.path
              // console.log(state.client, 'client.value')
            }
          }
        })
      }
    }
    onMounted(() => {
      fetchOss()
      initAction()
    })
    const onClickTab = (title) => {
      //   console.log(title)
    }
    const firstFetch = () => {
      let data = {
        id: Route.query.id,
        page_size: 150,
        page: 1
      }
      Request.majorWorkTrainApplyList(data)
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
    const forSecondFetch = (res) => {
      let short = res.data
      state.form = {
        theme: res.data.title,
        content: res.data.content,
        calendarText: res.data.train_time,
        location: res.data.address,
        demand: res.data.demand
      }
      if (res.data.join_num) {
        state.form2.count = res.data.join_num
        state.disable = true
      }
      if (short.sign_image_url) {
        state.form2.pic2 = short.sign_image_url.map((ele) => {
          return {
            url: ele
          }
        })
      }
      if (short.train_image_url) {
        state.form2.pic1 = short.train_image_url.map((ele) => {
          return {
            url: ele
          }
        })
      }
    }
    const secondFetch = () => {
      Request.fetchFarmerTrainInfo({
        id: Route.query.id
      })
        .then((res) => {
          if (res && res.code == 0) {
            forSecondFetch(res)
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const fetchList = () => {
      firstFetch()
      secondFetch()
    }
    const choiceImg1 = () => {
      state.uploadTrack = 1
      document.getElementById('upload_box').click()
    }
    const choiceImg2 = () => {
      state.uploadTrack = 2
      document.getElementById('upload_box').click()
    }
    const upload = (e) => {
      let fileObj = e.target.files[0]
      let legal = fileObj.type == 'image/jpeg' || fileObj.type == 'image/jpg' || fileObj.type == 'image/png' || fileObj.type == 'image/gif'
      if (legal) {
        lrz(fileObj, { width: 600 }).then(async (result) => {
          if (state.ZLBFLAG) {
            let shorter = result.file
            let url = `${state.client.path}/${fileObj.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${shorter.type.split('/')[1]}`
            let reader = new FileReader()
            reader.readAsDataURL(shorter)
            reader.onloadend = () => {
              state.client.multipartUpload(url, shorter).then(async (data) => {
                let str = data.res.requestUrls[0]
                mgop({
                  api: 'mgop.zjanchu.gfb.zlbUpload', // 必须
                  host: 'https://mapi.zjzwfw.gov.cn/',
                  dataType: 'JSON',
                  type: 'POST',
                  appKey: 'djk0at4y+2001885902+zngwuf', // 必须
                  data: {
                    osspath: str.split('?')[0]
                  },
                  header: {
                    Authorization: localStorage.getItem('token') || '',
                    Accept: 'application/prs.xkm.v1.0.0+json',
                    //   isTestUrl: '1'
                  },
                  onSuccess: (data) => {
                    let shazam = data.data
                    if (shazam && shazam.code === 0) {
                      if (state.uploadTrack == 1) {
                        state.form2.pic1.push({
                          id: shazam.data.id,
                          url: shazam.data.url
                        })
                        e.target.value = ''
                      } else {
                        state.form2.pic2.push({
                          id: shazam.data.id,
                          url: shazam.data.url
                        })
                        e.target.value = ''
                      }
                    } else {
                      Toast(shazam.msg)
                    }
                  },
                  onFail: (err) => {
                    console.log(err, 'errrr')
                  }
                })
              })
            }
          } else {
            let params = new FormData()
            params.append('file', result.file, fileObj.name)
            Request.upload(params).then((res) => {
              if (res.code === 0) {
                if (state.uploadTrack == 1) {
                  state.form2.pic1.push({
                    id: res.data.id,
                    url: res.data.url
                  })
                  e.target.value = ''
                } else {
                  state.form2.pic2.push({
                    id: res.data.id,
                    url: res.data.url
                  })
                  e.target.value = ''
                }
              }
            })
          }
        })
      } else {
        return Toast('请上传jpeg,jpg,png,gif图片')
      }
    }
    const toDelete1 = (index) => {
      state.form2.pic1.splice(index, 1)
    }
    const toDelete2 = (index) => {
      state.form2.pic2.splice(index, 1)
    }
    const saveAction = () => {
      if (!state.form2.count) {
        return Toast.fail('参与人数不能为空')
      }
      if (!state.form2.pic1.length) {
        return Toast.fail('培训照片不能为空')
      }
      if (!state.form2.pic2.length) {
        return Toast.fail('培训签到表不能为空')
      }
      let data = {
        id: Route.query.id,
        join_num: state.form2.count,
        train_image: state.form2.pic1
          .map((ele) => {
            return ele.id
          })
          .join(','),
        sign_image: state.form2.pic2
          .map((ele) => {
            return ele.id
          })
          .join(',')
      }

      Request.majorWorkTrainApplyUpload(data)
        .then((res) => {
          if (res && res.code == 0) {
            Toast('保存成功')
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    return {
      state,
      onClickTab,
      choiceImg1,
      choiceImg2,
      upload,
      toDelete1,
      toDelete2,
      saveAction
    }
  }
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
