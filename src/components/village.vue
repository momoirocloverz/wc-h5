<!-- 自定义村庄选择器展示组件 -->
<template>
  <van-popup v-model:show="showPicker" round position="bottom">
    <van-picker
      ref="pickerTarget"
      :loading="loading"
      :columns="state.columns"
      :columns-field-names="fieldName"
      @cancel="close"
      @confirm="onConfirm"
      @change="pickerChange"
    />
  </van-popup>
</template>

<script>
import { ref, defineComponent } from "vue";
import { onMounted } from "@vue/runtime-core";
import Request from "@/service/request";

export default defineComponent({
  props: {
    type: {
      type: Number,
    }, // 该参数不必传，主要用于回调区分
    showCancel: {
      type: Boolean,
      defalut: false,
    },
  },
  setup(props, { emit }) {
    const showPicker = ref(false); // 是否展示当前
    const pickerTarget = ref(null);
    const loading = ref(false);
    const state = ref({
      storeTempTown: [],
      columns: [],
      townHolderText: "请选择村镇",
    });
    const fieldName = {
      text: "town_name",
      children: "children",
    };
    // 展示当前
    const show = () => {
      showPicker.value = true;
      fetchTown();
    };
    const close = () => {
      showPicker.value = false;
    };
    const onConfirm = (value) => {
      emit("confirm", {
        type: props.type,
        text: value[0].town_name + value[1].town_name,
        town_id: value[1].town_id,
        village_id: value[1].id,
      });
      close();
    };
    // 获取城镇数据
    const fetchTown = () => {
      Request.fetchPublicTown({})
        .then((res) => {
          if (res && res.code == 0) {
            state.value.storeTempTown = res.data;
            let data = {
              town_id: res.data[0].id,
            };
            Request.fetchPublicVillage(data)
              .then((subRes) => {
                if (subRes && subRes.code == 0) {
                  res.data[0].children = subRes.data.map((ele) => {
                    return {
                      ...ele,
                      town_name: ele.village_name,
                    };
                  });
                  state.value.columns = res.data;
                  loading.value = false;
                } else {
                  Toast(subRes.msg);
                }
              })
              .catch((subErr) => {
                console.log("err", subErr);
              });
          } else {
            Toast(res.msg);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    };
    // 点击城镇调整数据
    const pickerChange = (value) => {
      if (value.length) {
        let findIndex = state.value.storeTempTown.findIndex((ele) => {
          return ele.id == value[0].id;
        });
        let data = {
          town_id: value[0].id,
        };
        Request.fetchPublicVillage(data)
          .then((subRes) => {
            if (subRes && subRes.code == 0) {
              const temp = subRes.data.map((ele) => {
                return {
                  ...ele,
                  town_name: ele.village_name,
                };
              });
              state.value.storeTempTown[findIndex].children = temp;
              pickerTarget.value.setColumnValues(1, temp);
              state.value.columns = state.value.storeTempTown;
            } else {
              Toast(subRes.msg);
            }
          })
          .catch((subErr) => {
            console.log("err", subErr);
          });
      }
    };
    onMounted(() => {
      fetchTown();
    });
    return {
      fieldName,
      state,
      loading,
      showPicker,
      show,
      close,
      onConfirm,
      pickerChange,
      pickerTarget,
    };
  },
});
</script>

<style lang="less" scoped>
@import "../assets/css/fit.less";
._village {
  width: 100%;
}
</style>
