<template>
  <div class="normalPairCon">
    <BeeProgress
      activeStep="2"
      :textList="['申报信息填写', '选择养殖大户']"
    ></BeeProgress>

    <div class="contentCon">
      <div class="listCon">
        <van-radio-group v-model="state.checked">
          <template v-for="(item, index) in state.sourceArray" :key="index">
            <div class="itemCon">
              <div class="itemLeft">
                <div class="itemSingleCon">
                  <div>企业名称</div>
                  <div>{{ item.company_name }}</div>
                </div>
                <div class="itemSingleCon">
                  <div>公司地址</div>
                  <div>{{ item.address }}</div>
                </div>
                <div class="itemSingleCon">
                  <div>法人名称</div>
                  <div>{{ item.linkman }}</div>
                </div>
                <!-- <div class="itemSingleCon">
                  <div>品牌</div>
                  <div></div>
                </div> -->
                <!-- <div class="itemSingleCon">
                  <div>养殖年限</div>
                  <div></div>
                </div> -->
                <div class="itemSingleCon">
                  <div>电话号码</div>
                  <div>{{ item.linkman_mobile }}</div>
                </div>
                <div class="itemSingleCon">
                  <div>蜂箱数</div>
                  <div>
                    剩余{{ item.train_hive_surplus }}箱/共{{
                      item.train_hive
                    }}箱
                  </div>
                </div>
              </div>
              <div class="itemRight">
                <van-radio
                  class="setRadio"
                  :name="index"
                  checked-color="#FF844E"
                ></van-radio>
              </div>
            </div>
          </template>
        </van-radio-group>
        <empty v-if="!state.sourceArray.length" description="暂无" />
      </div>
    </div>
    <div class="bottomCon">
      <div class="bottom">
        <div class="button2" @click="goback" v-if="!Route.query.fromEdit">
          上一步
        </div>
        <div class="button" @click="getResult">申请结对</div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast, Dialog, Empty } from "vant";
import { reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import BeeProgress from "@/components/beeProgress";
import Request from "@/service/request";
import { isZLB } from "@/util/index";
export default {
  components: {
    BeeProgress,
    Empty,
    [Dialog.Component.name]: Dialog.Component,
  },
  setup() {
    const Router = useRouter();
    const Route = useRoute();
    const state = reactive({
      ZLBFLAG: isZLB(),
      checked: 0,
      sourceArray: [],
    });
    const initAction = () => {
      Request.fetchMajorList({})
        .then((res) => {
          if (res && res.code == 0) {
            state.sourceArray = res.data;
          } else {
            Toast(res.msg);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    };
    onMounted(() => {
      initAction();
    });
    const getResult = () => {
      let track = state.sourceArray[state.checked];
      if (track) {
        Dialog.confirm({
          title: "请再次确认：",
          message: `您已选择${track.company_name}为结对对象`,
        })
          .then(() => {
            let data = {
              major_id: track.major_id,
            };
            Request.actionFarmerMatch(data)
              .then((res) => {
                if (res && res.code == 0) {
                  Toast("申请成功");
                  Router.replace({
                    name: "culturalProNormalSignResult",
                  });
                } else {
                  Toast(res.msg);
                }
              })
              .catch((err) => {
                console.log("err", err);
              });
          })
          .catch(() => {
            // on cancel
          });
      }
    };
    const goback = () => {
      Router.replace({
        name: "culturalProNormalFarmerApply",
        query: {
          edit: "1",
        },
      });
    };
    return {
      Route,
      goback,
      state,
      getResult,
    };
  },
};
</script>
<style lang="less" scoped>
.normalPairCon {
  box-sizing: border-box;
  padding-bottom: 200px;
}
.listCon {
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
}
.contentCon {
  padding-top: 15px;
  box-sizing: border-box;
}
.submit {
  position: fixed;
  width: 73%;
  height: 70px;
  background: linear-gradient(#ff844e 0%, #fe6d56 100%);
  border-radius: 35px;
  font-size: 32px;
  color: #fff;
  text-align: center;
  line-height: 70px;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
}
.itemCon {
  font-size: 28px;
  color: #666;
  background-color: #fff;
  padding: 15px 30px;
  box-sizing: border-box;
  border-bottom: 2px solid #ebebeb;
  border-radius: 10px;
  &:last-child {
    border: none;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  .itemLeft {
  }
  .itemRight {
  }
  .itemSingleCon {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    margin-bottom: 16px;
    div {
      &:nth-child(1) {
        width: 140px;
        margin-right: 10px;
      }
      &:nth-child(2) {
        color: #333;
      }
    }
  }
}
hr {
  height: 2px;
  background-color: #ebebeb;
}
.requestCon {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
}
.requestBtn {
  width: 144px;
  height: 60px;
  border: 1px solid #fd844e;
  border-radius: 34px;
  line-height: 60px;
  color: #fd844e;
  text-align: center;
  margin-top: 20px;
}
.bottomCon {
  width: 100%;
  height: 150px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0px -3px 15px rgba(0, 0, 0, 0.08);
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
  box-sizing: border-box;
  .button {
    width: 38%;
    height: 70px;
    background: linear-gradient(#ff844e 0%, #fe6d56 100%);
    border-radius: 35px;
    font-size: 32px;
    color: #fff;
    text-align: center;
    line-height: 70px;
  }
  .button2 {
    width: 38%;
    height: 66px;
    border: 2px solid #fe6d56;
    background: #fff;
    color: #fe6d56;
    border-radius: 33px;
    font-size: 32px;
    text-align: center;
    line-height: 68px;
    margin-right: 40px;
  }
}
</style>
