<template>
  <div class="outer">
    <div id="container6"></div>
    <div class="hive-list">
      <div class="item" v-for="item in state.current" :key="item.id">
        <div class="itemInfoCon" @click="checkHistory(item)">
          <img class="icon" :src="item.marker" />
          <div class="infoTextCon">
            <div class="topLine">
              <div class="hive_noCon">蜂箱{{ item.hive_no }}号</div>
              <van-icon class="arrow" name="arrow" />
            </div>
            <div class="updateCon">
              更新时间:{{ cutAction(item.created_at) }}
            </div>
          </div>
        </div>
        <div class="img-list">
          <template
            v-for="(sub, subIndex) in item.last_img_url &&
            item.last_img_url.length
              ? item.last_img_url
              : item.img_url"
            :key="subIndex"
          >
            <img
              @click="
                popPreview(
                  item.last_img_url && item.last_img_url.length
                    ? item.last_img_url
                    : item.img_url,
                  index
                )
              "
              :src="sub"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { onMounted, ref, reactive } from "vue";
import Request from "@/service/request";
import { Toast, ImagePreview } from "vant";
import { useRouter, useRoute } from "vue-router";
import { isZLB } from "@/util/index";
export default {
  setup() {
    const state = reactive({
      current: {},
      ZLBFLAG: isZLB(),
    });
    const Router = useRouter();
    const Route = useRoute();
    const forInit = (res) => {
      state.current = res.data.data.map((ele, index) => {
        return {
          ...ele,
          // marker: index
          //   ? 'https://img.hzanchu.com/acimg/d6d8f2b127d917d1795de073e6de6581.png'
          //   : 'https://img.hzanchu.com/acimg/f51043ca4f8398484094803726b1335c.png',
          // img_url: ele.img_url.slice(0, 2),
        };
      });
      // var map = new AMap.Map('container6', {
      //   resizeEnable: true,
      //   center: [+state.current[0].lon, +state.current[0].lat],
      //   zoom: 13,
      // })
      // var startIcon = new AMap.Icon({
      //   // 图标尺寸
      //   size: new AMap.Size(24, 34),
      //   // 图标的取图地址
      //   image: '//img.hzanchu.com/acimg/f51043ca4f8398484094803726b1335c.png',
      //   // 图标所用图片大小
      //   imageSize: new AMap.Size(23, 33),
      //   // 图标取图偏移量
      //   imageOffset: new AMap.Pixel(0, 0),
      // })
      // var marker1 = new AMap.Marker({
      //   position: new AMap.LngLat(+state.current[0].lon, +state.current[0].lat),
      //   offset: new AMap.Pixel(-12, -17),
      //   icon: startIcon,
      // })
      // map.add(marker1)
      // var endIcon = new AMap.Icon({
      //   // 图标尺寸
      //   size: new AMap.Size(24, 34),
      //   // 图标的取图地址
      //   image: '//img.hzanchu.com/acimg/d6d8f2b127d917d1795de073e6de6581.png',
      //   // 图标所用图片大小
      //   imageSize: new AMap.Size(23, 33),
      //   // 图标取图偏移量
      //   imageOffset: new AMap.Pixel(0, 0),
      // })
      // var marker2 = new AMap.Marker({
      //   position: new AMap.LngLat(+state.current[1].lon, +state.current[1].lat),
      //   offset: new AMap.Pixel(-12, -17),
      //   icon: endIcon,
      // })
      // map.add(marker2)
    };
    const initAction = () => {
      let data = {};
      Request.fetchFarmerHive(data)
        .then((res) => {
          if (res && res.code == 0) {
            // forInit(res)
            // forInit([{}]);
          } else {
            Toast(res.msg);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    };
    const popPreview = (array, index) => {
      ImagePreview({
        images: array,
        startPosition: index,
        closeable: true,
      });
    };
    const checkHistory = (item) => {
      let newArr = state.current.map((ele) => {
        return {
          hive_id: ele.id,
          hive_no: ele.hive_no,
        };
      });
      Router.push({
        name: "myHiveDetail",
        query: {
          hive_no: item.hive_no,
          hive_id: item.id,
          list: JSON.stringify(newArr),
        },
      });
    };
    const cutAction = (item) => {
      if (item) {
        return dayjs(item).format("YYYY-MM-DD");
      }
    };
    onMounted(() => {
      initAction();
    });

    return {
      state,
      popPreview,
      checkHistory,
      cutAction,
    };
  },
};
</script>

<style lang="less" scoped>
.outer {
  position: relative;
}
#container6 {
  width: 100%;
  height: 100vh;
}
.hive-list {
  width: 630px;
  overflow: hidden;
  background: #fff;
  border-radius: 10px;
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 30px;
  .item {
    height: 170px;
    display: flex;
    align-items: center;
    border-bottom: 2px solid #ebebeb;
    z-index: 99;
    .itemInfoCon {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      align-content: center;
      .infoTextCon {
        margin-left: 18px;
        .arrow {
          font-size: 30px;
          color: #333;
          vertical-align: middle;
        }
        .topLine {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          align-content: center;
          margin-bottom: 20px;
        }
        .hive_noCon {
          font-size: 32px;
          font-weight: 500;
          color: #333;
        }
      }
      .updateCon {
        width: 267px;
        font-size: 26px;
        color: #999;
      }
      .icon {
        width: 46px;
        height: 57px;
      }
    }
    .img-list {
      display: flex;
      align-items: center;
      margin-left: auto;
      img {
        width: 110px;
        height: 110px;
        margin-left: 30px;
      }
    }
  }
}
</style>
