<template>
  <div class="capQuitCon">
    <div class="topCon">
      若要退出，请提前与村集体沟通确认代养蜂箱的分配方案，并明确每个结对低收入农户对应移交的中蜂企业；上传成功后，低收入农户所在村审核相应信息，审核通过的，结对取消；所有结对低收入农户所在村都审核通过才退出成功。
    </div>
    <div class="bottomCon">
      <div class="titleCon">
        <img src="https://img.hzanchu.com/acimg/6b35c83f92333dcdae0216e74c86563c.png" />
        <div class="title">低收入农户分配</div>
      </div>
      <div class="listCon">
        <table class="mainTable">
          <thead>
            <tr>
              <th>结对低收入农户</th>
              <th>移交中蜂企业</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in state.masterList" :key="index">
              <tr>
                <td>{{ item.farmer_name }}</td>
                <td>
                  <div class="borderStyle" @click="popDetail(item)">
                    <span>{{ item.majorName || '请选择' }}</span>
                    <van-icon name="arrow" />
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="titleCon">
        <img src="https://img.hzanchu.com/acimg/6b35c83f92333dcdae0216e74c86563c.png" />
        <div class="title">上传详细分配方案</div>
      </div>
      <div class="uploadArea">
        <template v-for="(item, index) in state.fileList" :key="index">
          <div class="listItem">
            <div class="listLeft">
              <van-icon name="photo-o" size="20" />
              <span @click="popPreview(index)">{{ item.name }}</span>
            </div>
            <van-icon @click.stop="deleteCurrent(index)" name="cross" size="20" />
          </div>
        </template>
        <div class="addBtn" @click="trigger">
          <van-icon name="plus" size="20" />
          <span>添加附件</span>
        </div>
        <div class="describe">支持png、jpg、jpeg格式</div>
        <div class="button positiveBtn" @click="toNext">提交</div>
      </div>
    </div>
    <van-popup v-model:show="state.show" round position="bottom">
      <van-picker :columns="state.columns" :columns-field-names="state.customFieldName" @cancel="state.show = false" @confirm="onConfirm" />
    </van-popup>
    <input type="file" accept="image/*" id="upload_box" style="display: none" @change="upload" />
  </div>
</template>
<script>
import { Toast, ImagePreview } from 'vant'
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
import OSS from 'ali-oss'
import lrz from 'lrz'
export default {
  computed: {},
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      client: {},
      info: {},
      masterList: [],
      columns: [],
      fileList: [],
      show: false,
      customFieldName: {
        text: 'company_name'
      },
      storeItem: {}
    })
    const firstReq = () => {
      Request.planBeeMajorMajorMatchList({
        page: 1,
        pageSize: 99999
      })
        .then((res) => {
          if (res && res.code == 0) {
            state.masterList = res.data.sucList.map((ele) => {
              return {
                farmer_id: ele.farmer_id,
                farmer_name: ele.farmerInfo.name,
                majorName: '',
                majorId: ''
              }
            })
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
      Request.majorMajorList({
        page: 1,
        pageSize: 9999
      })
        .then((res) => {
          if (res && res.code == 0) {
            console.log(res.data)
            res.data.forEach((ele) => {
              ele.value = ele.major_id
            })
            state.columns = res.data
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const initAction = () => {
      firstReq()
    }
    onMounted(() => {
      fetchOss()
      initAction()
    })
    const popPreview = (index) => {
      let array = state.fileList.map((ele) => {
        return ele.url
      })
      ImagePreview({
        images: array,
        startPosition: index,
        closeable: true
      })
    }
    const onConfirm = (e) => {
      //   console.log('e', e)
      state.show = false
      state.storeItem.majorName = e.company_name
      state.storeItem.majorId = e.major_id
    }
    const popDetail = (item) => {
      state.show = true
      state.storeItem = item
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
            }
          }
        })
      }
    }
    const upload = (e) => {
      let fileObj = e.target.files[0]
      let legal = fileObj.type == 'image/jpeg' || fileObj.type == 'image/jpg' || fileObj.type == 'image/png' || fileObj.type == 'image/gif'
      console.log('fileObj', fileObj)
      if (legal) {
        if (fileObj) {
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
                        let split = shazam.data.url.split('/')
                        state.fileList.push({
                          id: shazam.data.id,
                          url: shazam.data.url,
                          name: split[split.length - 1]
                        })
                        e.target.value = ''
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
                  let split = res.data.url.split('/')
                  state.fileList.push({
                    id: res.data.id,
                    url: res.data.url,
                    name: split[split.length - 1]
                  })
                  e.target.value = ''
                }
              })
            }
          })
        }
      } else {
        return Toast('请上传jpeg,jpg,png,gif图片')
      }
    }
    const trigger = () => {
      document.getElementById('upload_box').click()
    }
    const deleteCurrent = (index) => {
      state.fileList.splice(index, 1)
    }
    const toNext = () => {
      let checkNameListLegal = state.masterList.every((ele) => {
        return ele.majorName
      })
      if (checkNameListLegal) {
        console.log
      } else {
        return Toast('请检查低收入农户分配')
      }
      if (state.fileList && state.fileList.length) {
      } else {
        return Toast('请上传详细分配方案')
      }
      if (checkNameListLegal && state.fileList && state.fileList.length) {
        // console.log('state.masterList', state.masterList)
        // console.log('ahsdghags', state.fileList)
        let data = {
          farmerStr: state.masterList
            .map((ele) => {
              return ele.farmer_id
            })
            .join(','),
          majorStr: state.masterList
            .map((ele) => {
              return ele.majorId
            })
            .join(','),
          file_id: state.fileList
            .map((ele) => {
              return ele.id
            })
            .join(',')
        }
        // console.log('data', data)
        Request.planBeeMajorDropDrop(data)
          .then((res) => {
            if (res && res.code == 0) {
              Toast('提交成功')
              Router.go(-1)
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    }
    return {
      state,
      popPreview,
      onConfirm,
      popDetail,
      upload,
      trigger,
      deleteCurrent,
      toNext
    }
  }
}
</script>

<style lang="less" scoped>
.capQuitCon {
  padding: 30px;
  box-sizing: border-box;
  .topCon {
    padding: 24px;
    box-sizing: border-box;
    background-color: #ff844e;
    border-radius: 10px;
    opacity: 0.85;
    font-size: 30px;
    color: #fff;
    line-height: 45px;
    font-weight: 500;
  }
  .bottomCon {
    margin-top: 30px;
    padding: 32px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0px 2px 20px 1px rgba(0, 0, 0, 0.058823529411764705);
    border-radius: 10px 10px 10px 10px;
  }
  .titleCon {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    vertical-align: center;
    img {
      width: 4px;
      height: 28px;
      margin-right: 8px;
    }
    .title {
      font-size: 32px;
      height: 34px;
      line-height: 34px;
      font-weight: 600;
      color: #333;
    }
  }
  .mainTable {
    tr {
      width: 100%;
    }
    th {
      width: 10%;
      font-size: 32px;
      color: #333;
      font-weight: 500;
      padding-top: 32px;
      padding-bottom: 32px;
      box-sizing: border-box;
      text-align: center;
      text-align: left;
    }
    td {
      width: 10%;
      text-align: center;
      color: #666;
      font-size: 28px;
      padding-top: 10px;
      padding-bottom: 10px;
      box-sizing: border-box;
      text-align: left;
    }
    .borderStyle {
      height: 64px;
      border-radius: 8px 8px 8px 8px;
      border: 2px solid #ccc;
      padding-left: 10px;
      padding-right: 10px;
      display: flex;
      justify-content: space-between;
      align-content: center;
      align-items: center;
      span {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
  .listCon {
    margin-bottom: 40px;
  }
  .uploadArea {
    padding-top: 32px;
    box-sizing: border-box;
  }
  .addBtn {
    padding: 12px 16px;
    border-radius: 8px 8px 8px 8px;
    border: 2px solid #cccccc;
    color: #666;
    font-size: 28px;
    width: 200px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    margin-bottom: 24px;
  }
  .describe {
    color: #666;
    font-size: 24px;
  }
  .listItem {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    margin-bottom: 30px;
  }
  .listLeft {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    align-items: center;
    span {
      font-size: 20px;
      margin-left: 20px;
    }
  }
  .button {
    height: 70px;
    border-radius: 35px;
    font-size: 32px;
    color: #fff;
    text-align: center;
    line-height: 70px;
    margin-top: 80px;
  }
  .positiveBtn {
    background-color: #ff844e;
    width: 100%;
  }
}
</style>
