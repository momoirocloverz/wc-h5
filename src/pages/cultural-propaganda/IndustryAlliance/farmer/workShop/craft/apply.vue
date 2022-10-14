<template>
  <div class="formCon industryFarmerApplyCon">
    <div class="describe">基本信息</div>
    <van-form @failed="onFailed" @submit="onSubmit">
      <van-field required input-align="left" v-model="form2.name" name="name" label="姓名" maxlength="20" :rules="state.validator.name" placeholder="请输入姓名" />
      <van-field required input-align="left" v-model="form2.card" name="card" label="身份证号" maxlength="20" :rules="state.validator.card" placeholder="请输入身份证号" />
      <van-field required input-align="left" v-model="form2.mobile" name="mobile" label="联系电话" maxlength="11" :rules="state.validator.mobile" placeholder="请输入联系电话" />
      <van-field required input-align="left" v-model="form2.townName" name="town_id" label="所属乡镇" :rules="state.validator.town_id" placeholder="请输入所属乡镇" readonly @click="popTown" />
      <van-field required input-align="left" v-model="form2.villageName" name="village_id" label="所属村" :rules="state.validator.village_id" placeholder="请输入所属村" readonly @click="popVillage" />
      <van-field required input-align="left" v-model="form2.address" name="address" label="详细地址" maxlength="50" :rules="state.validator.address" placeholder="请输入详细地址" />
      <div class="describe mt24">预约设置</div>
      <van-field
        required
        :rules="state.validator.book_date"
        input-align="left"
        v-model="form2.book_date"
        name="book_date"
        label="预约日期"
        maxlength="20"
        placeholder="请选择预约日期"
        readonly
        @click="popGender"
      />
      <div class="flexStart radioCon">
        <div class="van-field__label--required van-field__label">具体时间</div>
        <van-radio-group v-model="form2.book_time" direction="horizontal">
          <van-radio name="上午" icon-size="14px" checked-color="#FD844E">上午</van-radio>
          <van-radio name="下午" icon-size="14px" checked-color="#FD844E">下午</van-radio>
        </van-radio-group>
      </div>
      <div class="bottomCon fixBottom">
        <div class="bottom">
          <div class="cancelBtn" @click="cancelAction">取消</div>
          <van-button block class="fixButton" type="primary" native-type="submit">提交</van-button>
        </div>
      </div>
    </van-form>
    <van-popup v-model:show="townState.show" round position="bottom">
      <van-picker :columns="townState.columns" @cancel="townState.show = false" @confirm="onTown" :columns-field-names="townState.customFieldName" />
    </van-popup>
    <van-popup v-model:show="villageState.show" round position="bottom">
      <van-picker :columns="villageState.columns" @cancel="villageState.show = false" @confirm="onVillage" :columns-field-names="villageState.customFieldName" />
    </van-popup>
    <van-popup v-model:show="genderState.show" round position="bottom">
      <van-datetime-picker
        v-model="state.book_date"
        type="date"
        title="选择结束日期"
        @cancel="genderState.show = false"
        @confirm="confirmEndDate"
        :min-date="state.minDate"
        :max-date="state.maxDate"
      />
    </van-popup>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { ref, reactive, onMounted } from 'vue'
import { RadioGroup, Radio, Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { mgop } from '@aligov/jssdk-mgop'
import OSS from 'ali-oss'
import lrz from 'lrz'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  components: {
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio
  },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const info = reactive({
      town: '',
      townId: '',
      village: '',
      villageId: '',
      gender: ''
    })
    const state = reactive({
      minDate: '',
      maxDate: '',
      validator: {
        name: [{ trigger: 'onBlur', message: '请输入', required: true }],
        card: [{ trigger: 'onBlur', message: '请输入', required: true }],
        book_time: [{ trigger: 'onBlur', message: '请输入', required: true }],
        mobile: [
          {
            requied: true,
            trigger: 'onBlur',
            // pattern: /^1[3-9]\d{9}$/,
            message: '请输入手机号'
          }
        ],
        book_date: [{ trigger: 'onBlur', message: '请输入', required: true }],
        town_id: [{ trigger: 'onBlur', message: '请输入', required: true }],
        village_id: [{ trigger: 'onBlur', message: '请输入', required: true }],
        address: [{ trigger: 'onBlur', message: '请输入', required: true }]
      },
      show: false,
      customFieldName: {
        text: 'name'
      },
      value: '1',
      ZLBFLAG: isZLB()
    })
    const form2 = reactive({
      id: '',
      name: '',
      nameReal: '',
      cardReal: '',
      mobileReal: '',
      card: '',
      mobile: '',
      address: '',
      town_id: '',
      village_id: '',
      book_date: '',
      book_time: '上午',
      plant_id: '',
      townName: '',
      villageName: ''
    })
    const moneyChange = (e) => {
      let bridge = e.target.value
      if (isNaN(+bridge)) {
        form2.area = 0
      } else {
        let after = (+bridge).toFixed(2)
        form2.area = +after
      }
    }
    const townState = reactive({
      show: false,
      columns: [],
      customFieldName: {
        text: 'town_name'
      }
    })
    const genderState = reactive({
      show: false,
      columns: [
        {
          town_name: '男'
        },
        {
          town_name: '女'
        }
      ],
      customFieldName: {
        text: 'town_name'
      }
    })
    const villageState = reactive({
      show: false,
      columns: [],
      customFieldName: {
        text: 'village_name'
      }
    })
    onMounted(() => {
      getTownList()
      getInfo()
      fetchUserInfo()
    })
    const fetchUserInfo = () => {
      Request.getUserInfo()
        .then((res) => {
          if (res && res.code === 0) {
            let shorter = res.data
            form2.name = shorter.real_name.replace(shorter.real_name.substr(0, 1), '*')
            form2.card = shorter.zhelb_user_info.idnum.slice(0, 8) + '****' + shorter.zhelb_user_info.idnum.slice(15)
            form2.mobile = shorter.mobile.replace(shorter.mobile.substr(3, 4), '****')
            form2.nameReal = shorter.real_name
            form2.cardReal = shorter.zhelb_user_info.idnum
            form2.mobileReal = shorter.mobile
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const getInfo = () => {
      form2.address = ''
      form2.town_id = ''
      form2.village_id = ''
      form2.townName = ''
      form2.villageName = ''
      let plant_id = Route.query.plant_id
      let id = Route.query.id
      form2.plant_id = plant_id
      if (plant_id) {
        Request.IndustryPlantInfo({
          id: plant_id
        })
          .then((res) => {
            if (res && res.code == 0) {
              state.info = res.data
              state.minDate = new Date(res.data.start_date)
              state.maxDate = new Date(res.data.end_date)
            } else {
              Toast(res.msg)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
      if (id) {
        form2.id = id
        let tempInfo = sessionStorage.getItem('preOrderInfo1') ? JSON.parse(sessionStorage.getItem('preOrderInfo1')) : ''
        if (tempInfo) {
          form2.address = tempInfo.address
          form2.town_id = tempInfo.town_id
          form2.village_id = tempInfo.village_id
          form2.book_date = tempInfo.book_date
          form2.book_time = tempInfo.book_time
          form2.townName = tempInfo.town_name
          form2.villageName = tempInfo.village_name
        }
      }
    }
    const selectTown = () => {
      townState.show = true
    }
    const onVillage = (e) => {
      info.village = e.village_name
      info.villageId = e.id
      form2.village_id = e.id
      form2.villageName = e.village_name
      villageState.show = false
    }
    const onGender = (e) => {
      info.gender = e.town_name
      form2.gender = e.town_name
      genderState.show = false
    }
    const confirmEndDate = (e) => {
      form2.book_date = dayjs(e).format('YYYY-MM-DD')
      state.book_date = dayjs(e).format('YYYY-MM-DD')
      genderState.show = false
    }
    const getTownList = () => {
      Request.getTown().then((res) => {
        if (res.code === 0) {
          townState.columns = res.data
        }
      })
    }
    const getVillageList = () => {
      Request.getVillage({
        town_id: info.townId
      }).then((res) => {
        if (res.code === 0) {
          villageState.columns = res.data
        }
      })
    }
    const onTown = (e) => {
      info.town = e.town_name
      info.townId = e.id
      form2.townName = e.town_name
      form2.town_id = e.id
      getVillageList()
      townState.show = false
    }
    const onFailed = (err) => {
      console.log(err)
    }
    const onSubmit = (params) => {
      let data = {
        name: form2.nameReal,
        card: form2.cardReal,
        mobile: form2.mobileReal,
        address: form2.address,
        town_id: form2.town_id,
        village_id: form2.village_id,
        plant_id: form2.plant_id,
        book_date: form2.book_date,
        book_time: form2.book_time
      }
      if (form2.id) {
        data.id = form2.id
        Request.IndustryPlantEdit(data).then((res) => {
          if (res.code === 0) {
            Toast('提交成功')
            Router.go(-1)
          } else {
            Toast(res.msg)
          }
        })
      } else {
        Request.IndustryPlantApply(data).then((res) => {
          if (res.code === 0) {
            Toast('提交成功')
            Router.go(-1)
          } else {
            Toast(res.msg)
          }
        })
      }
    }
    const popTown = () => {
      townState.show = true
    }
    const popGender = () => {
      genderState.show = true
    }
    const popVillage = () => {
      if (info.town) {
        villageState.show = true
      }
    }
    const toPolicy = () => {
      //
    }
    const cancelAction = () => {
      //
    }
    return {
      confirmEndDate,
      cancelAction,
      popGender,
      genderState,
      onGender,
      moneyChange,
      toPolicy,
      popVillage,
      popTown,
      form2,
      Route,
      state,
      townState,
      villageState,
      info,
      onFailed,
      onSubmit,
      selectTown,
      onVillage,
      onTown
    }
  }
}
</script>

<style lang="less" scoped>
.flexStart {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
}
.radioCon {
  background-color: #fff;
  padding: var(--van-cell-vertical-padding) var(--van-cell-horizontal-padding);
  color: var(--van-cell-text-color);
  font-size: var(--van-cell-font-size);
  line-height: var(--van-cell-line-height);
}
.describe {
  font-size: 28px;
  font-weight: 500;
  color: #666666;
  margin-bottom: 16px;
  padding-left: 32px;
  box-sizing: border-box;
}
.mt24 {
  margin-top: 24px;
}
.formCon {
  min-height: 100%;
  overflow: hidden;
  padding-top: 22px;
  box-sizing: border-box;
  padding-bottom: 250px;
}
.bottomCon {
  width: 100%;
  height: 128px;
  position: fixed;
  bottom: 0;
  padding-top: 16px;
  box-sizing: border-box;
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0px -3px 15px rgba(0, 0, 0, 0.08);
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  //   padding-top: 10px;
  box-sizing: border-box;
  .cancelBtn {
    width: 44.5%;
    height: 96px;
    border: 2px solid #ff844e;
    box-sizing: border-box;
    border-radius: 48px;
    font-size: 36px;
    color: #ff844e;
    text-align: center;
    line-height: 96px;
    margin-right: 10px;
  }
}
.content {
  overflow: hidden;
}
</style>
<style lang="less">
.industryFarmerApplyCon {
  .fixButton {
    width: 44.5%;
    height: 96px;
    background: linear-gradient(#ff844e 0%, #fe6d56 100%);
    border-radius: 48px;
    border: none;
    font-size: 36px;
    color: #fff;
    text-align: center;
    line-height: 96px;
  }
}
</style>
