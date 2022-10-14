<template>
  <div class="contract-doctor">
    <ul class="contract-header">
      <li>
        <span>干部姓名</span>
        <span v-if="ZLBFLAG">{{ data.cadre_name&&data.cadre_name.replace(data.cadre_name.substr(0, 1), '*') }}</span>
        <span v-else>{{ data.cadre_name || ''}}</span>
      </li>
      <div v-if="data.cadre_contact">
        <li @click="phoneCall" v-if="ZLBFLAG">
          <span>电话</span>
          <span>
            <van-icon name="phone-o" color="#F88A8A" size="20px" />
            {{ data.cadre_contact ? data.cadre_contact.substr(0, 3) + '****' + data.cadre_contact.substr(8) : '' }}
          </span>
        </li>
        <a :href="'tel:' + data.cadre_contact" v-else>
          <li>
            <span>电话</span>
            <span>
              <van-icon name="phone-o" color="#F88A8A" size="20px" />
              {{ data.cadre_contact ? data.cadre_contact.substr(0, 3) + '****' + data.cadre_contact.substr(8) : '' }}
            </span>
          </li>
        </a>
      </div>
      <li v-else>
        <span>电话</span>
        <span>
          <van-icon name="phone-o" color="#F88A8A" size="20px" />
          {{ data.cadre_contact ? data.cadre_contact.substr(0, 3) + '****' + data.cadre_contact.substr(8) : '' }}
        </span>
      </li>
      <li>
        <span>随访次数</span>
        <span>{{ data.visit_count||'' }}</span>
      </li>
    </ul>
    <!-- 填写随访记录 -->
    <div class="write-record" v-if="type != 1">
      <div class="record-title"><em></em>&nbsp;&nbsp;填写随访记录</div>
      <ul class="record-table">
        <li>
          <span>受访人员</span>
          <div class="be-visited" @click="showPeople">
            <p :style="{ color: name ? '#333' : '#d2d3d5' }">
              {{ name || '请选择受访人员' }}
            </p>
            <van-icon name="arrow" />
          </div>
        </li>
        <!-- <li>
          <span>随访时间</span>
          <van-field
              placeholder="输入随访时间"
              v-model="date"
              class="record-doctor"
          />
                </li>-->
        <li>
          <span>随访时间</span>
          <div class="be-visited" @click="state.show = true">
            <p :style="{ color: date ? '#333' : '#d2d3d5' }">
              {{ date || '请选择随访时间' }}
            </p>
            <van-icon name="arrow" />
          </div>
        </li>
        <li>
          <span>干部姓名</span>
          <van-field placeholder="请输入干部姓名" v-model="officialName" class="record-doctor" />
        </li>
        <li class="visit-content">
          <span>随访内容</span>
          <van-field placeholder="请输入随访内容" type="textarea" v-model="textDescription" rows="3" class="record-content" />
        </li>
        <li class="visit-picture">
          <span>随访图片</span>
          <van-uploader v-model="fileList" max-count="3" class="visit-upload" />
        </li>
      </ul>
      <van-button type="primary" size="small" class="submit-btn" @touchend="upload">提交</van-button>
    </div>
    <!-- 历史随访记录 -->
    <div class="write-record history-record">
      <div class="record-title"><em></em>&nbsp;&nbsp;历史随访记录</div>
      <div class="group-table">
        <div class="group-table-header">
          <div class="table-header-title">随访日期</div>
          <div class="table-header-title">随访内容</div>
        </div>
        <div class="group-table-content" v-for="(item, i) in data.list" :key="i">
          <div class="table-content-title">
            {{ item.visit_at && item.visit_at.slice(0, 10) }}
          </div>
          <div class="table-content">
            <p>{{ item.content }}</p>
            <div>
              <img v-for="(item2, i2) in item.image" :key="i2" :src="item2" />
            </div>
          </div>
        </div>
        <div class="group-table-empty" v-if="data.list && data.list.length == 0">暂无随访记录</div>
      </div>
    </div>
    <!-- 受访人员选择 -->
    <van-popup v-model:show="people.show" round position="bottom">
      <van-picker :columns="people.peopleColumns" :columns-field-names="people.fieldName" @confirm="onConfirmPeople" @cancel="people.show = false" />
    </van-popup>
    <!-- 随访时间选择 -->
    <van-popup v-model:show="state.show" round position="bottom">
      <van-datetime-picker v-model="state.currentDate" type="datetime" title="选择完整时间" :min-date="state.minDate" :max-date="state.maxDate" @confirm="onConfirmDate" @cancel="state.show = false" />
    </van-popup>
  </div>
</template>
<script>
import { Icon, Field, Popup, Picker, Uploader, Button, Toast, DatetimePicker } from 'vant'
import Request from '@/service/request'
import lrz from 'lrz'
import { isZLB } from '@/util/index'
import { mgop } from '@aligov/jssdk-mgop'
import OSS from 'ali-oss'
export default {
  name: 'contractDoctorWork',
  props: {
    data: {
      type: Object,
      default: {}
    },
    family: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      visitName: '',
      showPicker: false,
      officialName: '',
      textDescription: '',
      date: '',
      columns: ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华'],
      visitDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
      fileList: [],
      image_ids: [],
      name: '',
      card: '',
      people: {
        show: false,
        peopleColumns: [],
        fieldName: {
          text: 'TName'
        }
      },
      state: {
        show: false,
        currentDate: new Date(),
        minDate: new Date(new Date().getFullYear() - 1, 0, 1),
        maxDate: new Date(new Date().getFullYear() + 1, 0, 1)
      },
      ZLBFLAG: isZLB(),
      client: {},
      type: localStorage.getItem('type')
    }
  },
  components: {
    [Icon.name]: Icon,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Uploader.name]: Uploader,
    [Button.name]: Button,
    [DatetimePicker.name]: DatetimePicker
  },
  mounted() {
    this.fetchOss()
  },
  methods: {
    fetchOss() {
      if (this.ZLBFLAG) {
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
              this.client = new OSS({
                region: shazam.data.region,
                accessKeyId: shazam.data.accessKeyId,
                accessKeySecret: shazam.data.accessKeySecret,
                bucket: shazam.data.bucket
              })
              this.client.path = shazam.data.path
              // console.log(state.client, 'client.value')
            }
          }
        })
      }
    },
    showPeople() {
      this.people.peopleColumns = this.family
      this.people.show = true
    },
    chooseVisit() {
      this.showPicker = true
    },
    getDateString() {
      const now = new Date()
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    },
    resetFields() {
      this.visitName = ''
      this.officialName = ''
      this.textDescription = ''
      this.date = ''
      this.fileList = []
    },
    validationCheck() {
      if (this.date === '') {
        throw new Error('日期为必填项')
      }
      if (this.officialName === '') {
        throw new Error('干部姓名为必填项')
      }
      if (this.textDescription === '') {
        throw new Error('随访内容为必填项')
      }
      if (this.fileList.length < 1) {
        throw new Error('图片为必填项')
      }
    },
    onConfirmPeople(e) {
      console.log(e, 'e')
      this.name = e.TName
      this.card = e.Card
      this.people.show = false
    },
    onConfirmDate(e) {
      let year = e.getFullYear(),
        month = e.getMonth() + 1 > 9 ? e.getMonth() + 1 : '0' + (e.getMonth() + 1),
        date = e.getDate() > 9 ? e.getDate() : '0' + e.getDate(),
        hours = e.getHours() > 9 ? e.getHours() : '0' + e.getHours(),
        minutes = e.getMinutes() > 9 ? e.getMinutes() : '0' + e.getMinutes(),
        seconds = e.getSeconds() > 9 ? e.getSeconds() : '0' + e.getSeconds()

      this.date = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds

      console.log(this.date, 'date')
      this.state.show = false
    },
    upload() {
      let _this = this
      if (this.date === '') {
        Toast('日期为必填项')
        return
      }
      if (this.doctorName === '') {
        Toast('干部姓名为必填项')
        return
      }
      if (this.textDescription === '') {
        Toast('随访内容为必填项')
        return
      }
      if (this.fileList.length < 1) {
        Toast('图片为必填项')
        return
      }

      this.uploadImg(0)
    },
    uploadImg(index) {
      let legal =
        this.fileList[index].file.type == 'image/jpeg' ||
        this.fileList[index].file.type == 'image/jpg' ||
        this.fileList[index].file.type == 'image/png' ||
        this.fileList[index].file.type == 'image/gif'
      if (legal) {
        let _this = this
        lrz(_this.fileList[index].file, { width: 600 }).then((res) => {
          if (this.ZLBFLAG) {
            let fileObj = res.file
            let url = `${this.client.path}/${this.fileList[index].file.name.split('.')[0]}-${Date.parse(new Date()) / 1000}.${fileObj.type.split('/')[1]}`
            let reader = new FileReader()
            reader.readAsDataURL(fileObj)
            reader.onloadend = () => {
              this.client.multipartUpload(url, fileObj).then(async (data) => {
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
                      _this.image_ids.push(shazam.data.id)
                      if (_this.image_ids.length === _this.fileList.length) {
                        _this.submit()
                      } else {
                        _this.uploadImg(index++)
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
            params.append('file', res.file, _this.fileList[0].file.name)
            Request.upload(params).then((res2) => {
              console.log(res2)
              if (res2.code === 0) {
                _this.image_ids.push(res2.data.id)
                if (_this.image_ids.length === _this.fileList.length) {
                  _this.submit()
                } else {
                  _this.uploadImg(index++)
                }
              }
            })
          }
        })
      } else {
        return Toast('请上传jpeg,jpg,png,gif图片')
      }
    },
    phoneCall() {
      ZWJSBridge.phoneCall({
        corpId: this.data.cadre_contact
      })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    submit() {
      const params = {
        card: this.card,
        type: 1,
        visit_at: this.date,
        visit_name: this.officialName,
        content: this.textDescription,
        image_id: this.image_ids.join(',')
      }
      Request.submitRecord(params).then((res) => {
        console.log(res, 'resssssss')
        if (res.code === 0) {
          Toast('提交成功')
          this.resetFields()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.contract-doctor {
  width: 100%;
  background: #fff;
  margin-top: 7px;
  padding-bottom: 30px;
  .contract-header {
    // width: 690px;
    width: 92%;
    margin: 0px auto;
    display: flex;
    flex-direction: column;
    li {
      width: 100%;
      height: 95px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border-bottom: #f8fafc solid 2px;
      span {
        font-size: 30px;
        font-weight: 500;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
    li:last-child {
      border-bottom: none;
    }
  }
  .write-record {
    // width: 690px;
    width: 92%;
    display: flex;
    flex-direction: column;
    margin: 20px auto 0px auto;
    .record-title {
      font-size: 30px;
      color: #70abfb;
      font-weight: 700;
      display: flex;
      flex-direction: row;
      align-items: center;
      em {
        display: flex;
        width: 8px;
        height: 27px;
        background: #70abfb;
      }
    }
    .record-table {
      // width: 690px;
      width: 92%;
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      li {
        display: flex;
        flex-direction: row;
        width: 688px;
        height: 77px;
        border: #dee2e6 solid 2px;
        border-top: none;
        span {
          width: 168px;
          height: 77px;
          color: #999999;
          font-size: 26px;
          text-align: center;
          line-height: 77px;
          border-right: #dee2e6 solid 2px;
        }
        .record-visit,
        .record-doctor {
          width: 520px;
          font-size: 28px;
          height: 77px;
          line-height: 77px;
          padding: 0px;
          margin-left: 20px;
        }
        .be-visited {
          width: 520px;
          font-size: 28px;
          height: 77px;
          line-height: 77px;
          padding: 0px;
          margin-left: 20px;
          display: flex;
          align-items: center;
          p {
            font-size: 28px;
          }
          .van-icon {
            margin-left: auto;
            margin-right: 26px;
            font-size: 28px;
          }
        }
        .record-content {
          width: 520px;
          font-size: 28px;
          height: 150px;
          padding: 0px;
          margin: 10px 0px 0px 20px;
        }
        em {
          width: 500px;
          height: 77px;
          line-height: 77px;
          font-size: 28px;
          text-indent: 20px;
        }
      }
      .visit-content {
        height: 180px;
        span {
          height: 180px;
          line-height: 180px;
        }
      }
      .visit-picture {
        height: auto;
        span {
          height: auto;
          line-height: 200px;
        }
        .visit-upload {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          width: 520px;
          margin: 20px 0px 0px 20px;
        }
      }
      li:first-child {
        border-top: #dee2e6 solid 2px;
      }
    }
  }
  .history-record {
    margin-top: 30px;
  }
  .show-bottom {
    font-size: 28px;
  }
  .submit-btn {
    margin-top: 30px;
  }
  .group-table {
    // width: 690px;
    width: 92%;
    margin: 16px auto 0px auto;
    display: flex;
    flex-direction: column;
  }
  .group-table-header {
    width: 688px;
    border: #dee2e6 solid 2px;
    background: #f8f8f9;
    display: flex;
    height: 77px;
    align-items: center;
  }
  .table-header-title {
    height: 77px;
    line-height: 77px;
    text-align: center;
    font-size: 26px;
    font-weight: bold;
  }
  .table-header-title:first-child {
    border-right: #dee2e6 solid 2px;
    width: 283px;
  }
  .table-header-title:last-child {
    width: calc(688px - 283px);
  }
  .group-table-content {
    width: 688px;
    display: flex;
    flex-direction: row;
    border: #dee2e6 solid 2px;
    border-top: none;
  }
  .group-table-empty {
    width: 688px;
    height: 77px;
    text-align: center;
    font-size: 32px;
    color: #999;
    border: #dee2e6 solid 2px;
    line-height: 77px;
    border-top: none;
  }
  .table-content-title {
    width: 283px;
    font-size: 26px;
    border-right: #dee2e6 solid 2px;
    padding: 25px 0px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .table-content {
    width: calc(688px - 283px);
    p {
      font-size: 26px;
      line-height: 36px;
      padding: 0 16px;
      text-align: center;
    }
    img {
      height: 160px;
      border-radius: 15px;
      margin-bottom: 20px;
      float: left;
    }
  }
}
</style>
