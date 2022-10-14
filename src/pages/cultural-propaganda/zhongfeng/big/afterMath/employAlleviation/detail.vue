<template>
  <div class="detail">
    <div class="main">
      <title-bar
        :showLine="false"
        title="工作状态"
        customStyle="padding: 0px;margin: 0px;"
      ></title-bar>
      <div
        class="status flex-row align-items-center justify-content-between fs-32"
      >
        {{ getStatusTitle }}
        <div
          v-if="state.status && state.status == 2"
          class="common-btn-plain fs-28"
          @click="stopWork"
        >
          停止招聘
        </div>
        <div
          v-if="state.status && state.status == 3"
          class="common-btn-plain fs-28"
          @click="gotoEdit"
        >
          重新编辑
        </div>
      </div>
      <div v-if="state.status && state.status == 3" class="not-pass fs-28">
        {{ state.comment }}
      </div>
    </div>

    <div v-if="state.status && state.status == 4" class="main">
      <title-bar
        :showLine="false"
        title="工资单"
        customStyle="padding: 0px;margin: 0px;"
      ></title-bar>
      <image-upload
        v-if="!isSubmit"
        :list="imgList1"
        :max="9"
        customStyle=" margin-top: 15px;"
        @upload="
          (e) => {
            dealUpload(1, e);
          }
        "
        @delete="
          (e) => {
            dealDelete(1, e);
          }
        "
      ></image-upload>
      <div v-else class="flex-row flex-wrap">
        <ac-image
          v-for="(item, index) in imgList1"
          :key="index"
          :src="item.url"
          width="95px"
          height="95px"
          customStyle="margin-right: 5px;margin-top: 10px;"
        ></ac-image>
      </div>

      <title-bar
        :showLine="false"
        title="工作照片"
        customStyle="padding: 0px;margin-top: 15px;"
      ></title-bar>
      <image-upload
        v-if="!isSubmit"
        :list="imgList2"
        :max="9"
        customStyle=" margin-top: 15px;"
        @upload="
          (e) => {
            dealUpload(2, e);
          }
        "
        @delete="
          (e) => {
            dealDelete(2, e);
          }
        "
      ></image-upload>
      <div v-else class="flex-row flex-wrap">
        <ac-image
          v-for="(item, index) in imgList2"
          :key="index"
          :src="item.url"
          width="95px"
          height="95px"
          customStyle="margin-right: 5px;margin-top: 10px;"
        ></ac-image>
      </div>

      <div v-if="!isSubmit" class="submit common-btn" @click="submitImg">
        提交/更新照片信息
      </div>
    </div>

    <div class="main">
      <title-bar
        :showLine="false"
        title="工作主题"
        customStyle="padding: 0px;margin: 0px;"
      ></title-bar>
      <div class="title fs-36">{{ getStatusTitle }}</div>
      <detail-item
        title="工作时间"
        :value="state.start_time + ' - ' + state.end_time"
      ></detail-item>
      <detail-item title="工作时长" :value="state.work_time"></detail-item>
      <detail-item title="工作地址" :value="state.address"></detail-item>
      <detail-item title="联系方式" :value="state.contact"></detail-item>
      <detail-item title="薪资" :value="state.salary + '元 / 天'"></detail-item>
      <detail-item
        title="招聘人数"
        :value="state.work_num + '人'"
      ></detail-item>
      <detail-item title="工作要求" :value="state.demand"></detail-item>
    </div>

    <div
      class="main"
      v-if="state.status && (state.status == 2 || state.status == 4)"
    >
      <title-bar
        :showLine="false"
        title="报名信息"
        customStyle="padding: 0px;margin: 0px;"
      ></title-bar>
      <item
        v-for="(item, index) in state.applyList"
        :key="index"
        :item="item"
        :type="0"
        :customStyle="
          'padding: 15px 0;margin-top: 0px;' +
          (index == list.length - 1
            ? ' border-bottom: 1px solid #fff;'
            : 'border-bottom: 1px solid #EBEBEB;')
        "
      ></item>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import TitleBar from "@/components/titleBar.vue";
import Item from "../helpObject/item.vue";
import ImageUpload from "@/components/imageUpload.vue";
import Request from "@/service/request";
import AcImage from "@/components/acImage.vue";
import { Dialog, Toast } from "vant";
import DetailItem from "@/components/detailItem.vue";
export default {
  components: { TitleBar, Item, ImageUpload, AcImage, DetailItem },
  computed: {
    getStatusTitle: function () {
      let status = "";
      let state = this.state;
      status = this.state.status_name;
      return status;
      // 0待审核；2已通过；3已拒绝；4已结束
      if (state.id) {
        if (state.status == 0) {
          status = "待审核";
        } else if (state.status == 2) {
          status = "进行中";
        } else if (state.status == 3) {
          status = "已拒绝";
        } else if (state.status == 4) {
          status = "已结束";
        }
      }
      return status;
    },
  },
  setup() {
    const Router = useRouter();
    const Route = useRoute();
    const id = ref(0);
    const list = ref([
      {
        farmer_name: "farmer_name",
        farmerAddr: "farmerAddr",
        mobile: "mobile",
        created_at: "created_at",
      },
      {
        farmer_name: "farmer_name",
        farmerAddr: "farmerAddr",
        mobile: "mobile",
        created_at: "created_at",
      },
    ]);
    // 照片信息
    const isSubmit = ref(false); // 当前是否已经提交过照片等信息
    const imgList1 = ref([]);
    const imgList2 = ref([]);
    const people = ref(""); // 实际签到人数
    const state = ref({}); // 详情信息

    // 前去编辑当前发布工作
    const gotoEdit = () => {
      Router.push({
        name: "culturalProBigEmployAlleviationPublish",
        query: {
          id: id.value,
        },
      });
    };

    // 新增照片信息
    const dealUpload = (type, e) => {
      if (type == 1) {
        imgList1.value.push(e);
      } else if (type == 2) {
        imgList2.value.push(e);
      }
    };

    // 删除照片信息
    const dealDelete = (type, e) => {
      if (type == 1) {
        imgList1.value.splice(e.pos, 1);
      } else if (type == 2) {
        imgList2.value.splice(e.pos, 1);
      }
    };

    // 停止招聘
    const stopWork = () => {
      Toast.loading({
        duration: 0,
        message: "停止中...",
        forbidClick: true,
      });
      Request.majorWorkDelete({
        id: id.value,
      })
        .then((res) => {
          console.log(res);
          if (res.code == 0) {
            Toast("停止成功！");
            setTimeout(() => {
              init(id.value);
            }, 500);
          }
        })
        .finally(() => {
          Toast.clear();
        });
    };

    // 提交照片信息
    const submitImg = () => {
      if (imgList1.value.length == 0) {
        Toast("请先上传签到照片");
        return;
      }
      if (imgList2.value.length == 0) {
        Toast("请先上传工作照片");
        return;
      }

      let salary_image = "";
      let work_image = "";
      for (let item of imgList1.value) {
        salary_image += item.id + ",";
      }
      for (let item of imgList2.value) {
        work_image += item.id + ",";
      }
      salary_image = salary_image.substring(0, salary_image.length - 1);
      work_image = work_image.substring(0, work_image.length - 1);

      Request.planBeeMajorMajorWorkEditImg({
        id: id.value,
        salary_image,
        work_image,
      })
        .then((res) => {
          if (res.code == 0) {
            Toast("提交成功！");
            setTimeout(() => {
              init(id.value);
            }, 500);
          } else {
            Toast(res.msg);
          }
        })
        .catch(() => {
          Toast.clear();
        });
    };

    // 获取当前工作的详情
    const init = (id) => {
      Toast.loading({
        duration: 0,
        message: "获取详情中...",
        forbidClick: true,
      });
      Request.planBeeMajorMajorWorkInfo({
        id,
      })
        .then((res) => {
          console.log(res);
          if (res.code == 0) {
            state.value = res.data;
            isSubmit.value = res.sign_num ? true : false;
            if (res.data.salary_image_url) {
              for (let item of res.data.salary_image_url) {
                imgList1.value.push({
                  url: item,
                });
              }
            }
            if (res.data.work_image_url) {
              for (let item of res.data.work_image_url) {
                imgList2.value.push({
                  url: item,
                });
              }
            }
          }
        })
        .finally(() => {
          Toast.clear();
        });
    };
    onMounted(() => {
      if (Route.query.id) {
        id.value = Route.query.id;
        init(Route.query.id);
      } else {
        Dialog.alert({
          message: "获取详情失败，请返回重试！",
          confirmButtonColor: "#FF844E",
        })
          .then(() => {
            Router.go(-1);
          })
          .catch(() => {});
      }
    });
    return {
      state,
      list,
      isSubmit,
      imgList1,
      imgList2,
      submitImg,
      dealUpload,
      dealDelete,
      stopWork,
      gotoEdit,
    };
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../../assets/css/fit.less";
.detail {
  width: 100%;
  padding: 30px;
  box-sizing: border-box;

  .main {
    width: 100%;
    margin-bottom: 30px;
    padding: 24px 30px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;

    .status {
      margin-top: 24px;
      div {
        // width: 164px;
        padding: 12px 30px;
      }
    }
    .not-pass {
      margin-top: 10px;
      color: red;
    }
    .title {
      margin-top: 24px;
      font-weight: bold;
    }

    .sub-title {
      margin-top: 30px;
      color: #999999;
    }
    .value {
      margin-top: 16px;
      color: #333333;
    }

    .submit {
      margin-top: 30px;
    }
  }
}
</style>
