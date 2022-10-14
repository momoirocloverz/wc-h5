<template>
  <div class="submit fs-28">
    <acfield title="镇村">
      <div class="_field-arrow" @click="chooseVillage">
        {{ state.town }}
      </div>
    </acfield>

    <acfield title="打款金额">
      <input
        type="number"
        maxlength="11"
        v-model.trim="state.money"
        placeholder="请输入"
      />
    </acfield>
    <acfield title="上传打款凭证" :lineFeed="true" :showLine="false">
      <image-upload
        :max="9"
        @upload="dealUpload"
        @delete="dealDelete"
      ></image-upload>
    </acfield>
  </div>

  <div
    :class="
      state.town_id && state.imgList.length > 0 && state.money
        ? 'bottom common-btn'
        : 'bottom common-btn-disable'
    "
    @click="submit"
  >
    提交
  </div>

  <village ref="villageRef" @confirm="villageConfirm"></village>
</template>

<script>
import { reactive, onMounted, ref } from "vue";
import Acfield from "@/components/acfield.vue";
import Village from "@/components/village.vue";
import ImageUpload from "@/components/imageUpload.vue";
import { Dialog, Toast } from "vant";
import { useRouter } from "vue-router";
import Request from "@/service/request";
export default {
  components: {
    Acfield,
    Village,
    ImageUpload,
  },
  setup() {
    const Router = useRouter();
    const villageRef = ref(null);
    const state = reactive({
      town_id: "",
      village_id: "",
      imgList: [],
      town: "请选择村镇",
      money: "",
    });
    // 点击选择城镇
    const chooseVillage = () => {
      villageRef.value.show();
    };
    // 选择村结果
    const villageConfirm = (e) => {
      console.log(e);
      state.town = e.text;
      state.town_id = e.town_id;
      state.village_id = e.village_id;
    };
    // 上传图片成功回调用
    const dealUpload = (e) => {
      console.log(e);
      state.imgList.push(e);
    };
    // 删除图片
    const dealDelete = (e) => {
      console.log(e);
      state.imgList.splice(e.pos, 1);
    };
    // 最终提交
    const submit = () => {
      if (state.town_id == "") {
        Toast("请选择城镇");
        return;
      }
      if (state.money == "" || state.money == 0) {
        Toast("请输入打款金额");
        return;
      }
      if (state.imgList.length == 0) {
        Toast("请上传打款凭证");
        return;
      }
      Dialog.confirm({
        message: "是否确认提交？",
        showCancelButton: true,
        confirmButtonColor: "#FF844E",
      })
        .then(() => {
          // Router.go(-1);

          remit(); // 进行打款操作
        })
        .catch(() => {
          // on cancel
        });
    };

    // 打款
    const remit = () => {
      Toast.loading({ duration: 0, message: "提交中...", forbidClick: true });
      let img_id = "";
      for (let item of state.imgList) {
        img_id += item.id + ",";
      }
      img_id = img_id.substring(0, img_id.length - 1);

      Request.planBeeMajorMajorRemit({
        amount: state.money,
        town_id: state.town_id,
        village_id: state.village_id,
        img_id,
      })
        .then((e) => {
          if (e.code === 0) {
            Toast("打款成功！");
            setTimeout(() => {
              Router.go(-1);
            }, 250);
          } else {
            Toast.clear();
          }
        })
        .catch(() => {
          Toast.clear();
        });
    };
    onMounted(() => {});
    return {
      state,
      villageRef,
      chooseVillage,
      villageConfirm,
      dealUpload,
      dealDelete,
      submit,
    };
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../../assets/css/fit.less";
.submit {
  width: 100%;
  padding: 0px 30px;
  box-sizing: border-box;
  background-color: #fff;
}

.bottom {
  position: fixed;
  bottom: 30px;
  bottom: calc(30px+ constant(safe-area-inset-bottom));
  bottom: calc(30px + env(safe-area-inset-bottom));
  left: 10%;
  width: 80%;
}
</style>
