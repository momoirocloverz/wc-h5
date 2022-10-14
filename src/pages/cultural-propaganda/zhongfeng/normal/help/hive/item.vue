<template>
  <div class="_item fs-30" @click="gotoDetail">
    <title-bar
      :showLine="false"
      :title="item.hive_no + '号蜂箱'"
      customStyle="padding: 0px;margin: 0px;"
    ></title-bar>
    <detail-item title="上传时间" :value="item.created_at"></detail-item>
    <detail-item title="定位" :value="item.address"></detail-item>
    <div class="_sub-title fs-28">蜂箱照片</div>
    <div class="w-100 flex-row flex-wrap">
      <ac-image
        v-for="(item1, index1) in item.img_url"
        :key="index1"
        :src="item1"
        width="95px"
        height="95px"
        customStyle="margin-top: 8px;margin-right: 10px"
      ></ac-image>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import titleBar from "@/components/titleBar.vue";
import DetailItem from "@/components/detailItem.vue";
import AcImage from "@/components/acImage.vue";
export default {
  components: { titleBar, DetailItem, AcImage },
  props: {
    item: {
      type: Object,
    }, // 必传
    type: {
      type: Number,
      default: 0,
    }, // 当前item的类型，默认为0，表示是发布培训模块item、1表示培训通知item
  },
  computed: {
    getColor: function () {
      let className = "";
      if (this.item.status == 2) {
        className = "#3787F5";
      } else if (this.item.status == 0) {
        className = "#FF844E";
      } else if (this.item.status == 3) {
        className = "#FF0000";
      }
      return className;
    },
    getStatus: function () {
      let status = "";
      status = this.item.status_name;
      return status;
      if (this.item.status == 2) {
        status = "报名中";
      } else if (this.item.status == 0) {
        status = "待审核";
      } else if (this.item.status == 3) {
        status = "审核不通过";
      }
      return status;
    },
  },
  setup(props, { emit }) {
    const Router = useRouter();
    const gotoDetail = () => {
      // Router.push({
      //   name: "farmersTrainingDetail",
      //   query: {
      //     id: props.item.id,
      //   },
      // });
    };
    return { gotoDetail };
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

  ._sub-title {
    margin-top: 30px;
    color: #999999;
  }
}
</style>
