<template>
  <div class="formCon industryFarmerApplyCon">
    <div class="describe">基本信息</div>
    <van-form @failed="onFailed" @submit="onSubmit">
      <van-field
        required
        input-align="left"
        v-model="form2.name"
        name="name"
        label="姓名"
        :readonly="state.info && state.info.zhelb_user_info && state.info.zhelb_user_info.username ? true : false"
        maxlength="20"
        :rules="state.validator.name"
        placeholder="请输入姓名"
      />
      <van-field required input-align="left" v-model="form2.card" name="card" label="身份证号" maxlength="20" :rules="state.validator.card" placeholder="请输入身份证号" />
      <van-field required input-align="left" v-model="form2.mobile" name="mobile" label="联系电话" maxlength="11" :rules="state.validator.mobile" placeholder="请输入联系电话" />
      <van-field required input-align="left" v-model="form2.townName" name="town_id" label="所属乡镇" :rules="state.validator.town_id" placeholder="请输入所属乡镇" readonly @click="popTown" />
      <van-field required input-align="left" v-model="form2.villageName" name="village_id" label="所属村" :rules="state.validator.village_id" placeholder="请输入所属村" readonly @click="popVillage" />
      <van-field required input-align="left" v-model="form2.address" name="address" label="详细地址" maxlength="50" :rules="state.validator.address" placeholder="请输入详细地址" />
      <div class="describe mt24">费用预估</div>
      <div class="flexCon whiteBg">
        <van-field
          required
          class="resetWidth"
          input-align="left"
          v-model="form2.weight"
          name="weight"
          label="委托加工量"
          maxlength="20"
          :rules="state.validator.weight"
          placeholder="请输入委托加工量"
          @change="weightChange"
          type="number"
        />
        <span class="addonText">斤</span>
      </div>
      <div class="hintBlock">委托加工量须大于等于10斤</div>
      <div class="flexCon whiteBg">
        <van-field
          required
          readonly
          class="resetWidth"
          input-align="left"
          v-model="form2.price"
          name="price"
          label="加工费用"
          maxlength="20"
          :rules="state.validator.price"
          placeholder="请输入加工费用"
          @change="fileChange"
          type="number"
        />
        <span class="addonText">元</span>
      </div>
      <van-field
        required
        :rules="state.validator.limit_date"
        input-align="left"
        v-model="form2.limit_date"
        name="limit_date"
        label="预期完成时间"
        maxlength="20"
        placeholder="请选择预期完成时间"
        readonly
        @click="popGender"
      />
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
        v-model="state.limit_date"
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
      minDate: new Date(Date.now()),
      validator: {
        name: [{ trigger: 'onBlur', message: '请输入', required: true }],
        card: [{ trigger: 'onBlur', message: '请输入', required: true }],
        book_time: [{ trigger: 'onBlur', message: '请输入', required: true }],
        mobile: [
          {
            requied: true,
            trigger: 'onBlur',
            // pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确手机号'
          }
        ],
        limit_date: [{ trigger: 'onBlur', message: '请输入', required: true }],
        town_id: [{ trigger: 'onBlur', message: '请输入', required: true }],
        village_id: [{ trigger: 'onBlur', message: '请输入', required: true }],
        address: [{ trigger: 'onBlur', message: '请输入', required: true }],
        weight: [{ trigger: 'onBlur', message: '请输入', required: true }],
        price: [{ trigger: 'onBlur', message: '请输入', required: true }]
      },
      show: false,
      customFieldName: {
        text: 'name'
      },
      value: '1',
      ZLBFLAG: isZLB()
    })
    const form2 = reactive({
      nameReal: '',
      cardReal: '',
      mobileReal: '',
      name: '',
      card: '',
      mobile: '',
      address: '',
      town_id: '',
      village_id: '',
      limit_date: '',
      weight: '',
      price: '',
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
      let id = Route.query.id
      if (id) {
        Request.IndustryplantProcessinfo({ id })
          .then((res) => {
            console.log('res', res)
            let shorter = res.data
            if (res && res.code == 0) {
              form2.address = shorter.address
              form2.town_id = shorter.town_id
              form2.village_id = shorter.village_id
              form2.townName = shorter.town_name
              form2.villageName = shorter.village_name
              form2.weight = shorter.weight
              form2.price = shorter.price
              form2.limit_date = dayjs(shorter.limit_date).format('YYYY-MM-DD')
            }
          })
          .catch((err) => {
            console.log('err', err)
          })
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
      form2.limit_date = dayjs(e).format('YYYY-MM-DD')
      state.limit_date = dayjs(e).format('YYYY-MM-DD')
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
        type: 1,
        name: form2.nameReal,
        card: form2.cardReal,
        mobile: form2.mobileReal,
        address: form2.address,
        town_id: form2.town_id,
        village_id: form2.village_id,
        limit_date: form2.limit_date,
        weight: form2.weight,
        price: form2.price
      }
      let id = Route.query.id
      if (id) {
        data.id = id
        Request.IndustryplantProcessEdit(data).then((res) => {
          if (res.code === 0) {
            Toast('提交成功')
            Router.go(-1)
          } else {
            Toast(res.msg)
          }
        })
      } else {
        Request.IndustryplantProcessApply(data).then((res) => {
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
    const fileChange = (e) => {
      let bridge = e.target.value
      if (isNaN(+bridge)) {
        form2.price = 0
      } else {
        let after = (+bridge).toFixed(2)
        form2.price = +after
      }
    }
    const moneyFormat = (value) => {
      if (value || value == 0) {
        let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2)
        return fix
      }
    }
    const weightChange = (e) => {
      let bridge = e.target.value
      if (isNaN(+bridge)) {
        form2.weight = 0
        form2.price = 0
      } else {
        let after = (+bridge).toFixed(2)
        if (after < 10) {
          form2.weight = 10
          form2.price = moneyFormat(form2.weight * 15)
        } else {
          form2.weight = +after
          form2.price = moneyFormat(form2.weight * 15)
        }
      }
    }
    return {
      weightChange,
      fileChange,
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
.hintBlock {
  height: 56px;
  background-color: rgba(253, 132, 78, 0.06);
  color: #fd844e;
  font-size: 28px;
  line-height: 56px;
  padding-left: 32px;
}
.flexCon {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  padding-right: 30px;
  box-sizing: border-box;
}
.whiteBg {
  background-color: #fff;
}
.addonText {
  font-size: var(--van-cell-font-size);
}
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
.resetWidth {
  width: 520px;
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
