<template>
  <div class="detail">
    <div class="main">
      <title-bar
        :showLine="false"
        title="培训状态"
        customStyle="padding: 0px;margin: 0px;"
      ></title-bar>
      <div
        class="status flex-row align-items-center justify-content-between fs-32"
      >
        {{ getStatusTitle }}
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

    <!--  v-if="state.status && (state.status == 2 || state.status == 4)" -->

    <div v-if="state.status && state.status == 4" class="main">
      <title-bar
        :showLine="false"
        title="实到人数（人）"
        customStyle="padding: 0px;margin: 0px;"
      ></title-bar>
      <input
        class="people fs-28"
        type="number"
        maxlength="6"
        v-model.trim="people"
        placeholder="请输入"
        :disabled="isSubmit ? true : false"
      />

      <title-bar
        :showLine="false"
        title="培训签到表"
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
        title="培训照片"
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
        title="培训主题"
        customStyle="padding: 0px;margin: 0px;"
      ></title-bar>
      <div class="title fs-36">{{ getStatusTitle }}</div>
      <div class="sub-title fs-28">培训开始时间</div>
      <div class="value fs-28">{{ state.start_time }}</div>
      <div class="sub-title fs-28">培训结束时间</div>
      <div class="value fs-28">{{ state.end_time }}</div>
      <div class="sub-title fs-28">培训内容</div>
      <div class="value fs-28">
        {{ state.content }}
      </div>
      <div class="sub-title fs-28">培训地址</div>
      <div class="value fs-28">
        {{ state.address }}
      </div>
      <div class="sub-title fs-28">培训要求</div>
      <div class="value fs-28">
        {{ state.demand }}
      </div>
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
          (index == state.applyList.length - 1
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
export default {
  components: { TitleBar, Item, ImageUpload, AcImage },
  computed: {
    getStatusTitle: function () {
      let status = "";
      let state = this.state;
      // 0待审核；2已通过；3已拒绝；4已结束
      if (state.id) {
        // if (state.status == 0) {
        //   status = "待审核";
        // } else if (state.status == 2) {
        //   status = "已通过";
        // } else if (state.status == 3) {
        //   status = "已拒绝";
        // } else if (state.status == 4) {
        //   status = "已结束";
        // }
        status = this.state.status_name;
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

    // 前去编辑当前发布培训
    const gotoEdit = () => {
      Router.push({
        name: "culturalProBigBeeTrainingPublish",
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

    // 提交照片信息
    const submitImg = () => {
      if (imgList1.value.length == 0) {
        Toast("请先上传签到照片");
        return;
      }
      if (imgList2.value.length == 0) {
        Toast("请先上传培训照片");
        return;
      }
      if (people.value == "" || people.value <= 0) {
        Toast("请先输入实际培训人数");
        return;
      }
      Toast.loading({
        duration: 0,
        message: "提交中...",
        forbidClick: true,
      });

      let train_image = "";
      let sign_image = "";
      for (let item of imgList1.value) {
        train_image += item.id + ",";
      }
      for (let item of imgList2.value) {
        sign_image += item.id + ",";
      }
      train_image = train_image.substring(0, train_image.length - 1);
      sign_image = sign_image.substring(0, sign_image.length - 1);

      Request.majorWorkTrainApplyUpload({
        id: id.value,
        train_image,
        sign_image,
        sign_num: people.value,
      })
        .then((res) => {
          if (res.code == 0) {
            Toast("提交成功！");
            setTimeout(() => {
              init();
            }, 500);
          } else {
            Toast(res.msg);
          }
        })
        .catch(() => {
          Toast.clear();
        });
    };

    // 获取当前培训的详情
    const init = (id) => {
      Toast.loading({
        duration: 0,
        message: "获取详情中...",
        forbidClick: true,
      });
      Request.planBeeMajorMajorTrainInfo({
        id,
      })
        .then((res) => {
          console.log(res);
          if (res.code == 0) {
            state.value = res.data;
            isSubmit.value = res.sign_num ? true : false;
            people.value = res.data.sign_num ? res.data.sign_num : "";
            if (res.data.sign_image_url) {
              for (let item of res.data.sign_image_url) {
                imgList1.value.push({
                  url: item,
                });
              }
            }
            if (res.data.train_image_url) {
              for (let item of res.data.train_image_url) {
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
      people,
      submitImg,
      dealUpload,
      dealDelete,
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

    .people {
      width: 100%;
      margin-top: 30px;
      margin-bottom: 30px;
      padding: 10px 30px;
      box-sizing: border-box;
      border: 1px solid #d0d0d0;
      color: #333;
    }

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
