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
        <div v-if="list.length > 0">
          <div v-for="(item, index) of list" :key="index">
            <item :item="item" @reload="reload" :type="type"></item>
          </div>
        </div>
        <list-empty v-else-if="list.length == 0 && finished"></list-empty>
      </van-list>
    </van-skeleton>
  </div>
</template>

<script>
import Item from "./item.vue";
import { onMounted, ref } from "vue";
import { Toast } from "vant";
import Request from "@/service/request";
import ListEmpty from "@/components/listEmpty.vue";

export default {
  components: { Item, ListEmpty },
  props: {
    type: {
      type: Number,
    }, // 顶部tab切换，分为0、1
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
        Request.majorWorkTrainList({
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
      } else if (props.type == 1) {
        Request.majorWorkTrainApplyList({
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
}
</style>
