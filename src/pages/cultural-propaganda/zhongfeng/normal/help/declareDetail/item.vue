<template>
  <div class="_item fs-30" @click="gotoDetail">
    <div class="_main flex-row fs-28">
      <div class="_title">企业名称：</div>
      <div class="_content">{{ item.company_name }}</div>
    </div>

    <div class="_main flex-row fs-28">
      <div class="_title">公司地址：</div>
      <div class="_content">{{ item.address }}</div>
    </div>

    <div class="_main flex-row fs-28">
      <div class="_title">法人名称：</div>
      <div class="_content">{{ item.legal_rep }}</div>
    </div>

    <div class="_main flex-row fs-28">
      <div class="_title">品牌：</div>
      <div class="_content">-</div>
    </div>

    <div class="_main flex-row fs-28">
      <div class="_title">养殖年限：</div>
      <div class="_content">{{ item.train_year }}年</div>
    </div>

    <div class="_main flex-row fs-28">
      <div class="_title">电话号码：</div>
      <div class="_content">{{ item.mobile }}</div>
    </div>

    <div class="_main flex-row fs-28">
      <div class="_title">蜂箱数：</div>
      <div class="_content">
        剩余<span style="color: var(--custom_color)">{{
          item.train_hive_surplus ? item.train_hive_surplus : 0
        }}</span
        >箱/共{{ item.act_train_hive ? item.act_train_hive : 0 }}箱
      </div>
    </div>

    <div class="_line"></div>

    <div class="_operate flex-row align-items-center justify-content-end">
      <div
        :class="item.train_hive_surplus - 1 <= 0 ? 'btn2' : 'btn1'"
        @click="submit"
      >
        申请结对
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from "vue";
import Request from "@/service/request";
import { Toast, Dialog } from "vant";
export default {
  props: {
    item: {
      type: Object,
    }, // 必传
  },
  setup(props, { emit }) {
    const Router = useRouter();
    const submit = () => {
      // act_train_hive 是总数、train_hive_surplus是当前剩余数量
      if (props.item.train_hive_surplus - 1 <= 0) {
        Toast("当前企业蜂箱剩余数量不足");
        return;
      }
      Dialog.alert({
        message: "是否确定申请结对当前企业？",
        showCancelButton: true,
        confirmButtonColor: "#FF844E",
      })
        .then(() => {
          Toast.loading({
            duration: 0,
            message: "提交中...",
            forbidClick: true,
          });
          Request.actionFarmerMatch({
            majorId: props.item.major_id,
          }).then((res) => {
            if (res.code == 0) {
              Toast("申请成功！");
              setTimeout(() => {
                Router.go(-1);
              }, 500);
            } else {
              Toast(res.msg);
            }
          });
        })
        .catch(() => {
          // on cancel
          Toast.clear();
        });
    };
    return { submit };
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../../assets/css/fit.less";
._item {
  width: 100%;
  padding: 30px;
  margin-top: 30px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 31, 116, 0);
  background-color: #ffffff;
  border-radius: 10px;

  ._main {
    margin-bottom: 10px;
  }

  ._title {
    width: 150px;
    color: #666666;
  }
  ._content {
    flex: 1;
    color: #333333;
  }

  ._line {
    width: 100%;
    height: 2px;
    margin-top: 30px;
    margin-bottom: 30px;
    background-color: #ebebeb;
  }

  ._operate {
    width: 100%;

    ._refuse {
      width: 400px;
      background-color: #fff;
      color: #ff0000;
    }
    .btn1 {
      height: 60px;
      padding-left: 30px;
      padding-right: 30px;
      line-height: 60px;
      box-sizing: border-box;
      border: 2px solid #fd844e;
      border-radius: 34px;
      font-size: 26px;
      color: #fd844e;
    }
    .btn2 {
      height: 60px;
      margin-right: 30px;
      padding-left: 30px;
      padding-right: 30px;
      line-height: 60px;
      box-sizing: border-box;
      border: 2px solid #cccccc;
      border-radius: 34px;
      font-size: 26px;
      color: #999999;
    }
  }
}
</style>
