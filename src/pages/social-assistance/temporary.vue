<template>
  <div class="assistanceTemporaryCon">
    <div class="title">
      请填写个人资料
    </div>
    <div>
      <field label="姓名"
             class="dialogField"
             clearable
             v-model.trim="state.name"
             placeholder="填写姓名"
             maxlength="20" />
      <field label="电话"
             type="number"
             class="dialogField"
             clearable
             v-model.trim="state.mobile"
             placeholder="填写电话"
             maxlength="11" />
      <field label="身份证号"
             class="dialogField"
             clearable
             v-model.trim="state.id"
             placeholder="填写身份证号"
             maxlength="18" />
      <field label="详细地址"
             class="dialogField"
             clearable
             v-model.trim="state.address"
             placeholder="填写详细地址"
             maxlength="70" />
      <cell title="请简单描述家庭情况"></cell>
      <field label=""
             type="textarea"
             rows="2"
             v-model.trim="state.describe"
             clearable
             placeholder="请填写"
             maxlength="100" />
    </div>
    <div class="buttonCon">
      <div class="fakeBtn"
           :class="[ !state.name || !state.mobile || !state.id || !state.address || !state.describe? '' :'ableBtn' ]"
           @click="action">提交</div>
    </div>
    <div class="mask"
         v-show="state.showDialog">
      <div class="dialogWhite">
        <img src="https://img.hzanchu.com/acimg/de183258777d511a934fbda1d84cebf6.png">
        <div class="success">提交成功</div>
        <div class="infoCon">
          <div class="line1">请保持手机通畅，审核员</div>
          <div class="line2">会在7-14个工作日内给您回电</div>
        </div>
        <div class="confirm"
             @click="confirmAction">确定</div>
      </div>
    </div>
  </div>
</template>
  <script>
import { Cell, CellGroup, Icon, Toast, Field } from 'vant';
import { ref, reactive, onBeforeMount } from 'vue'
import Request from '@/service/request.js'
import { useRouter } from 'vue-router';
export default {
  components: {
    Cell, CellGroup, Icon, Toast, Field
  },
  setup () {
    const Router = useRouter();
    const state = reactive({
      name: '',
      describe: '',
      mobile: '',
      id: '',
      address: '',
      showDialog: false,
      phonePass: false,
      idPass: false,
    })
    onBeforeMount(() => {
    })
    const action = () => {
      const phoneReg = /^1[3-9]\d{9}$/;
      const result = phoneReg.test(state.mobile)
      const idCardRge = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
      state.phonePass = result
      const result1 = idCardRge.test(state.id)
      state.idPass = result1
      if (state.name && state.mobile && state.id && state.address && state.describe) {
        if (!state.phonePass) {
          Toast('请输入正确手机号码')
        } else if (!state.idPass) {
          Toast('请输入正确身份证号')
        } else {
          state.showDialog = true
        }
      }
    }
    const confirmAction = () => {
      console.log('asdgahsg')
      state.showDialog = false
    }
    return {
      state,
      action,
      confirmAction,
    }
  }
}
  </script>
  
  <style lang="less" scoped>
.assistanceTemporaryCon {
}
.title {
  padding-left: 30px;
  box-sizing: border-box;
  height: 68px;
  line-height: 68px;
  font-size: 28px;
  font-weight: 500;
  color: #4d4d4d;
}
.buttonCon {
  padding-left: 100px;
  padding-right: 100px;
  box-sizing: border-box;
  margin-top: 50px;
  margin-bottom: 50px;
}
.fakeBtn {
  font-size: 32px;
  height: 70px;
  border-radius: 35px;
  background-color: #d1d1d1;
  text-align: center;
  line-height: 70px;
  color: #fff;
}
.ableBtn {
  background: linear-gradient(to right, #ff844e 0%, #fe6d56 100%);
}
.confirm {
  width: 200px;
  height: 70px;
  background: #ff844e;
  border-radius: 35px;
  box-shadow: 0px 20px 30px 0px rgba(255, 79, 39, 0.2);
  line-height: 70px;
  text-align: center;
  font-size: 32px;
  font-weight: 500;
  color: #fff;
  margin: 0 auto;
}
.mask {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  .dialogWhite {
    border-radius: 10px;
    background-color: #fff;
    width: 550px;
    // height: 610px;
    width: 81%;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    padding-top: 62px;
    box-sizing: border-box;
    img {
      width: 175px;
      margin: 0 auto;
    }
    .success {
      font-size: 32px;
      font-weight: 500;
      text-align: center;
      color: #333333;
      margin-top: 30px;
      margin-bottom: 27px;
    }
    .infoCon {
      font-size: 24px;
      font-weight: 500;
      text-align: center;
      color: #666666;
      line-height: 34px;
      margin-bottom: 63px;
    }
    .line1 {
    }
    .line2 {
    }
  }
}
</style>
<style lang="less">
.assistanceTemporaryCon {
  .van-cell__title {
    font-size: 28px;
    font-weight: 500;
    color: #666;
  }
}
</style>