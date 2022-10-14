<template>
  <div class="outer">
    <!-- <img
            class="topBack"
            src="https://img.hzanchu.com/acimg/27cd9cfae67851644ee1302725cda5c0.png"
        /> -->
    <div class="total flex-column align-items-center">
      <div class="fs-28">当前总收益</div>
      <div class="fs-48">¥{{ total }}元</div>
      <div class="fs-28" @click="checkMoney">查看详情</div>
    </div>
    <div class="itemMaster">
      <template v-for="(item, index) in list" :key="index">
        <img class="itemImg" :src="item.img" alt @click="toDetail(item)" />
      </template>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { Toast } from "vant";
import Request from "@/service/request";
export default {
  setup() {
    const Router = useRouter();
    const total = ref(0);
    const state = ref({});
    const toDetail = (item) => {
      if (item.path == "/cultural-propaganda/zhongfeng/declare/detail") {
        Router.push(item.path);
        return;
      }
      if (state.value.status == 0) {
        Toast("审核尚未通过，请耐心等待");
      } else {
        Router.push(item.path);
      }
    };
    // 点击查看资金详情
    const checkMoney = () => {
      if (state.value.status == 0) {
        Toast("审核尚未通过，请耐心等待");
      } else {
        Router.push("/cultural-propaganda/zhongfeng/income");
      }
    };
    // 初始化当前总收益、请求当前信息
    const init = () => {
      Request.planBeeFarmerProfitList({
        page: 1,
        pageSize: 999,
      })
        .then((e) => {
          if (e.code === 0) {
            total.value = e.data.totalProfit;
          }
        })
        .finally(() => {
          Toast.clear();
        });

      Request.fetchFarmerBeeInfo({})
        .then((res) => {
          if (res && res.code == 0) {
            state.value = res.data;
          } else {
            Toast(res.msg);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    };

    onMounted(() => {
      init();
    });
    return {
      list: [
        {
          img: "https://img.hzanchu.com/acimg/efcbf0c1cb210dcbd4f7bf1c1444a0ae.png",
          path: "/cultural-propaganda/zhongfeng/training/farmersIndex1",
        },
        {
          img: "https://img.hzanchu.com/acimg/6df818b54585bbbc64750ccca22192fb.png",
          path: "/cultural-propaganda/zhongfeng/work/index1",
        },
        {
          img: "https://img.hzanchu.com/acimg/fa7f8c8182e92850a30fb0153ca82f3b.png",
          path: "/cultural-propaganda/zhongfeng/hive/index1",
        },
        // {
        //     img:
        //         'https://img.hzanchu.com/acimg/d65dae032a62f129718a868ff65982f2.png',
        //     path: '/cultural-propaganda/zhongfeng/earning/index',
        // },
        // {
        //     img:
        //         'https://img.hzanchu.com/acimg/a16def908739bfea6f2dcb3fb324c6d6.png',
        //     path: '/cultural-propaganda/zhongfeng/protocol/index',
        // },
        {
          img: "https://img.hzanchu.com/acimg/0f5e11797ff68c8d619e3c612103b401.png",
          path: "/cultural-propaganda/zhongfeng/declare/detail",
        },
      ],
      toDetail,
      checkMoney,
      total,
    };
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../assets/css/fit.less";
.outer {
  overflow: hidden;
  .topBack {
    width: 100%;
  }
  .itemMaster {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .itemImg {
    width: 330px;
    margin-left: 30px;
    margin-top: 30px;
  }
}

.total {
  padding: 40px;
  box-sizing: border-box;
  background-color: #fff;
  div:nth-of-type(1) {
    width: 100%;
    margin-top: 30px;
    text-align: center;
    color: #999999;
  }
  div:nth-of-type(2) {
    width: 100%;
    margin-top: 15px;
    text-align: center;
    font-weight: bold;
    color: #333;
  }
  div:nth-of-type(3) {
    width: 100%;
    margin-top: 15px;
    text-align: center;
    color: var(--custom_color);
  }
}
</style>
