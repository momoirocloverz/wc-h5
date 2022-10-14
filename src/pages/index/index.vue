<template>
  <div class="loginCon" v-show="show">
    <div class="title">手机号登录/注册</div>
    <div class="inputArea">
      <div class="firstInputCon">
        <span>手机号</span>
        <input
          class="phoneInput"
          maxlength="11"
          @blur="phoneBlur"
          v-model="linkCode"
          type="tel"
          placeholder="请输入联系方式"
        />
      </div>
      <div class="smsCon">
        <div class="leftPart">
          <span>验证码</span>
          <input
            class="smsInput"
            maxlength="6"
            @blur="smsBlur"
            v-model="state.sms"
            type="tel"
            placeholder="请输入短信验证码"
          />
        </div>
        <button :disabled="btnAble" class="smsButton" @click="fetch">
          {{ state.btnText }}
        </button>
      </div>
    </div>
    <div class="buttonCon">
      <div
        class="fakeBtn"
        @click="action"
        :class="[!state.phonePass || !state.sms ? '' : 'ableBtn']"
      >
        提 交
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive, computed } from "vue";
import { Field, Button, Toast } from "vant";
import { useRouter, useRoute } from "vue-router";
import { getQueryString } from "@/util/index.js";
import Request from "@/service/request.js";
import { useStore } from "vuex";
import { isZLB } from "@/util/index";
export default {
  name: "submitcode",
  components: {
    [Field.name]: Field,
    [Button.name]: Button,
  },
  setup() {
    const linkCode = ref("");
    const Store = useStore();
    const Router = useRouter();
    const Route = useRoute();
    const state = reactive({
      sms: "",
      smsDisable: false,
      btnText: "获取验证码",
      counter: 60,
      timer: null,
      phonePass: false,
      ZLBFLAG: isZLB(),
    });
    const show = ref(false);
    if (Route.query.mobile) {
      show.value = false;
      Request.loginRedirect({
        mobile: Route.query.mobile,
      }).then((res) => {
        if (res && res.code === 0) {
          localStorage.setItem("phone", Route.query.mobile);
          let data = {
            time: Date.now(),
            ...res.data,
          };
          localStorage.setItem("type", data.type);
          Store.commit("setUserType", data.type);
          //   if ((data.type == 2) || (data.type == 3)) {
          //     if (data.farmer_info.is_show) {
          //       Store.commit('setGlobalDialog', true)
          //     }
          //   }
          localStorage.setItem("currentUserInfo", JSON.stringify(data));
          localStorage.setItem(
            "phoneWithUid",
            JSON.stringify({
              phone: linkCode.value,
              uid: sessionStorage.getItem("uid"),
            })
          );
          if (res.data.type != 1 && res.data.is_check == 0) {
            localStorage.setItem("needTwiceAuth", "1");
          }
          if (Route.query.backUrl) {
            window.location.replace(decodeURIComponent(Route.query.backUrl));
          } else {
            Router.replace({
              path: "/home",
              query: {
                type: res.data.type,
              },
            });
          }
        } else {
          Toast(res.msg);
        }
      });
    } else {
      show.value = true;
    }

    const btnAble = computed(() => {
      const phoneReg = /^1[3-9]\d{9}$/;
      const result = phoneReg.test(linkCode.value);
      state.phonePass = result;
      if (!linkCode.value.length) {
        return true;
      } else {
        if (state.phonePass) {
          if (state.smsDisable) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
    });
    const phoneBlur = () => {
      const phoneReg = /^1[3-9]\d{9}$/;
      const result = phoneReg.test(linkCode.value);
      state.phonePass = result;
      if (linkCode.value) {
        if (!result) {
          Toast("请输入正确手机号");
        }
      }
    };
    const smsBlur = () => {
      //
    };
    const action = () => {
      const phoneReg = /^1[3-9]\d{9}$/;
      const result = phoneReg.test(linkCode.value);
      if (linkCode.value.length != 11 || !result) {
        return Toast("请填写正确的手机号");
      }

      if (!state.sms) {
        return Toast("请填写短信验证码");
      }
      let id = sessionStorage.getItem("uid")
        ? sessionStorage.getItem("uid")
        : "";
      //   if (!id) {
      //     return Toast("缺少id");
      //   }
      if (linkCode.value.length === 11 && state.sms) {
        // sessionStorage.setItem('phone', linkCode.value)
        // sessionStorage.setItem('uid',getQueryString('id'))
        // Router.push(decodeURIComponent(proxy.$root.$route.query.url))

        Request.loginAction({
          mobile: linkCode.value,
          code: state.sms,
          id: id,
        })
          .then((res) => {
            if (res && res.code === 0) {
              localStorage.setItem("phone", linkCode.value);
              let data = {
                time: Date.now(),
                ...res.data,
              };
              localStorage.setItem("type", data.type);
              Store.commit("setUserType", data.type);
              // if ((data.type == 2) || (data.type == 3)) {
              //   if (data.farmer_info.is_show) {
              //     Store.commit('setGlobalDialog', true)
              //   }
              // }
              localStorage.setItem("currentUserInfo", JSON.stringify(data));
              localStorage.setItem(
                "phoneWithUid",
                JSON.stringify({
                  phone: linkCode.value,
                  uid: sessionStorage.getItem("uid"),
                })
              );
              if (res.data.type != 1 && res.data.is_check == 0) {
                localStorage.setItem("needTwiceAuth", "1");
              }
              Toast("登录成功");
              if (Route.query.backUrl) {
                window.location.replace(
                  decodeURIComponent(Route.query.backUrl)
                );
                //   Router.replace({
                //     path: decodeURIComponent(Route.query.backUrl),
                //     query: {
                //       type: res.data.type
                //     }
                //   });
              } else {
                Router.replace({
                  path: "/home",
                  query: {
                    type: res.data.type,
                  },
                });
              }
            } else {
              Toast(res.msg);
            }
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
    };
    const fetch = () => {
      if (!state.smsDisable) {
        state.smsDisable = true;
        Request.loginSms({
          mobile: linkCode.value,
        })
          .then((res) => {
            if (res && res.code === 0) {
              Toast("验证码发送成功");
              state.smsDisable = true;
              state.timer = setInterval(() => {
                state.counter = state.counter - 1;
                state.btnText = `${state.counter}s后重新发送`;
                if (state.counter == 0) {
                  state.smsDisable = false;
                  state.counter = 60;
                  state.btnText = "获取验证码";
                  clearInterval(state.timer);
                }
              }, 1000);
            } else {
              state.smsDisable = false;
              Toast(res.msg);
            }
          })
          .catch((err) => {
            console.log(err);
            state.smsDisable = false;
          });
      }
    };
    return {
      linkCode,
      state,
      fetch,
      btnAble,
      phoneBlur,
      smsBlur,
      action,
      show,
    };
  },
};
</script>
<style lang="less" scoped>
.leftPart {
  height: 88px;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  padding-left: 30px;
  span {
    font-size: 30px;
    margin-right: 12px;
    color: #646566;
    text-align: left;
  }
}
.smsInput {
  width: 400px;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  font-size: 28px;
  color: #333;
  font-weight: 500;
  padding-left: 10px;
}
.phoneInput {
  font-size: 28px;
  color: #333;
  font-weight: 500;
  padding-left: 10px;
}
.firstInputCon {
  height: 88px;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  padding-left: 30px;
  border-bottom: 2px solid #e6e6e6;
  span {
    font-size: 30px;
    margin-right: 12px;
    color: #646566;
    text-align: left;
  }
}
.loginCon {
  height: 100vh;
  box-sizing: border-box;
  padding-top: 50px;
  background-color: #fff;
  .title {
    font-size: 32px;
    font-weight: 500;
    text-align: left;
    color: #333;
    padding-left: 30px;
    box-sizing: border-box;
    margin-bottom: 70px;
  }
  .fakeBorder {
    width: 690px;
    margin: 0 auto;
    height: 2px;
    background-color: #e6e6e6;
  }
  .smsCon {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    border-bottom: 2px solid #e6e6e6;
  }
  .smsButton {
    font-size: 24px;
    color: #ff844e;
    background-color: #fff;
    height: 60px;
    line-height: 60px;
    margin-right: 30px;
  }
}
.buttonCon {
  padding-left: 100px;
  padding-right: 100px;
  box-sizing: border-box;
  margin-top: 210px;
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
</style>
<style lang="less">
.loginCon {
  .van-field__label {
    width: 3em;
  }

  .van-cell::after {
    border: none;
  }
  .smsInput {
    .van-field__control {
      font-size: 28px;
      color: #333;
      font-weight: 500;
    }
  }
  .van-cell input {
    text-align: left;
  }
  .van-cell__value {
    text-align: left;
  }
}
</style>
