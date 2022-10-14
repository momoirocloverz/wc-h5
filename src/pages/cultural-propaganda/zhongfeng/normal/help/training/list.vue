<template>
  <div class="search-list">
    <slot />
    <van-skeleton class="van-skeleton" :row="6" :loading="isload">
      <van-list
        class="van-list fs-14"
        :finished="finished"
        finished-text=" "
        @load="load"
      >
        <!-- 低收入农户申请培训 -->
        <div v-if="type == 1" class="_submit">
          <div class="_top fs-30">
            您可以主动预约结对中蜂养殖企业进行培训请选择预约时间：
          </div>

          <div class="_main">
            <acfield title="预约时间">
              <div @click="timeShow(1)">
                {{ state.time }}<van-icon name="arrow" />
              </div>
            </acfield>

            <!-- <acfield title="联系人姓名">
              <input
                type="text"
                maxlength="50"
                v-model.trim="state.name"
                placeholder="请输入"
              />
            </acfield>
            <acfield title="联系电话">
              <input
                type="number"
                maxlength="11"
                v-model.trim="state.mobile"
                placeholder="请输入"
              />
            </acfield> -->
          </div>

          <div class="btn common-btn" @click="submit">立即申请</div>
        </div>

        <title-bar
          v-if="type == 1"
          title="申请记录"
          customStyle="background-color: rgba(255,255,255,0);padding-bottom: 0px;"
          :showLine="false"
        ></title-bar>
        <div v-if="list.length > 0">
          <div v-for="(item, index) of list" :key="index">
            <item :item="item" @reload="reload" :type="type"></item>
          </div>
        </div>

        <list-empty v-else-if="list.length == 0 && finished"></list-empty>
      </van-list>
    </van-skeleton>
  </div>
  <time-show ref="timeRef" type="datetime" @select="timeSelect"></time-show>
</template>

<script>
import Item from "./item.vue";
import { onMounted, ref } from "vue";
import { Dialog, Toast } from "vant";
import Acfield from "@/components/acfield.vue";
import TitleBar from "@/components/titleBar.vue";
import Request from "@/service/request";
import ListEmpty from "@/components/listEmpty.vue";
import TimeShow from "@/components/timeShow.vue";

export default {
  components: { Item, Acfield, TitleBar, ListEmpty, TimeShow },
  props: {
    type: {
      type: Number,
    },
  },
  watch: {
    type(val) {
      // console.log(val);
      this.reload();
    },
  },
  setup(props) {
    const list = ref([]);
    const isload = ref(true); // 当前骨架屏控制展示控制，默认为true表示需要展示骨架屏
    const page = ref(1);
    const pageSize = ref(10); // 一页10个
    const finished = ref(false); // 是否页面到底了
    const loading = ref(false); // 是否加载中，防止多次请求
    const timeRef = ref(null);

    const state = ref({
      time: "请选择预约时间",
      name: "",
      mobile: "",
    }); // 申请内容

    // 点击展示当前时间组件
    const timeShow = (type) => {
      timeRef.value.showPicker(type);
    };

    // 点击时间回调
    const timeSelect = (e) => {
      // console.log(e);
      state.value.time = e.time;
    };

    // 申请培训操作
    const submit = () => {
      if (state.value.time == "请选择预约时间") {
        Toast("请选择预约时间");
        return;
      }
      Dialog.confirm({
        message: "是否确认申请培训？",
        showCancelButton: true,
        confirmButtonColor: "#FF844E",
      })
        .then(() => {
          Toast.loading({
            duration: 0,
            message: "提交中...",
            forbidClick: true,
          });
          Request.farmerTrainApply({
            apply_at: state.value.time,
          })
            .then((e) => {
              if (e.code === 0) {
                Toast("提交成功！");
                setTimeout(() => {
                  reload();
                }, 250);
              } else {
                Toast.clear();
                Dialog.confirm({
                  message: e.msg,
                  showCancelButton: false,
                  confirmButtonColor: "#FF844E",
                }).then(() => {
                  // Router.go(-1);
                });
              }
            })
            .catch(() => {
              Toast.clear();
            });
        })
        .catch(() => {
          // on cancel
        });
    };

    const reload = () => {
      page.value = 1;
      list.value = [];
      finished.value = false;
      loading.value = false;
      isload.value = true;
      load();
    };

    const load = () => {
      getList();
    };

    const getList = () => {
      if (loading.value || finished.value) return;
      loading.value = true;
      // 这里请求数据
      Toast.loading({ duration: 0, message: "加载中...", forbidClick: true });
      if (props.type == 0) {
        Request.fetchFarmerTrainList({
          page: page.value,
          pageSize: pageSize.value,
        })
          .then((e) => {
            if (e.code === 0) {
              let data = e.data.data;
              list.value = page.value == 1 ? data : list.value.concat(data);
              page.value++;
              isload.value = false;
              finished.value = e.data.current_page >= e.data.last_page;
            }
          })
          .finally(() => {
            Toast.clear();
          });
      } else {
        Request.planBeeFarmerTrainApplyList({
          page: page.value,
          pageSize: pageSize.value,
        })
          .then((e) => {
            if (e.code === 0) {
              // let data = e.data.data;
              // list.value = page.value == 1 ? data : list.value.concat(data);
              // page.value++;
              // isload.value = false;
              // finished.value = e.data.current_page >= e.data.last_page;

              let data = e.data;
              list.value = data;
              page.value++;
              isload.value = false;
              finished.value = true;
            }
          })
          .finally(() => {
            Toast.clear();
          });
      }
    };

    return {
      list,
      isload,
      page,
      pageSize,
      finished,
      loading,
      reload,
      load,
      getList,

      timeShow,
      timeSelect,
      submit,
      timeRef,

      state,
    };
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../../assets/css/fit.less";
.search-list {
  width: 100%;
  height: 100%;
  padding: 0 30px;
  box-sizing: border-box;

  .empty {
    margin-top: 120px;
    .icon {
      width: 387px;
      height: 256px;
    }
    .describe {
      margin-top: 40px;
      color: #333;
    }
  }

  ._submit {
    width: 100%;
    margin-top: 30px;
    border-radius: 10px;
    background-color: #fff;
    overflow: hidden;
    ._top {
      padding: 30px;
      background-color: var(--custom_color);
      box-sizing: border-box;
      color: #fff;
    }
    .btn {
      width: 80%;
      margin-top: 30px;
      margin-bottom: 30px;
      margin-left: 10%;
    }
    ._main {
      padding: 0 30px;
      box-sizing: border-box;
    }
  }
}
</style>
