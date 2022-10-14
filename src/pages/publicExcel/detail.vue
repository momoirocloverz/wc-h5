<template>
  <div class="outer">
    <div class="header" :class="[state.ZLBFitForOld ? 'headerOlder' : '']">
      关于2021年雨露计划补助情况的公示
    </div>
    <div class="tableOuter">
      <div
        class="type2Content"
        :class="[state.ZLBFitForOld ? 'type2ContentOlder' : '']"
      >
        <div class="contentText">
          &nbsp;&nbsp;&nbsp;&nbsp;为了加强对扶贫资金的管理和监督，提高扶贫资金使用情况的透明度，切实维护群众的利益，根据《关于加强雨露计划支持农村贫困家庭新成长劳动力接受职业教育的意见》（国开办发〔2015〕19
          号）、《关于实施“雨露计划”工作中严格按扶持范围执行的通知》（浙扶贫办〔2018〕9
          号）、雨露计划职业教育工作指南（试行）》的规定等文件精神，经各乡镇申报及有关部门审核，结合我县实际，现对2021年雨露计划补助名单予以公示，公示期限为2021年12月20日至2021年12月29日。公示期间，如反映公示内容存在问题，可采取来信、来电和来访方式，向县农业农村局、县教育局和县财政局反映（县农业农村局联系电话：0577-59026167（596167），地址：文成县大峃镇伯温路4号；县教育局学生指导和资助管理中心联系电话：67833316，地址：大峃镇招待所巷12号；县财政局农财科联系电话：67833137，地址：县财税大楼6楼）。
        </div>
        <div class="middle">
          &nbsp;&nbsp;&nbsp;&nbsp;附件：2021年雨露计划补助名单汇总表
        </div>
        <div class="alignRight">文成县农业农村局</div>
        <div class="alignRight">文成县教育局</div>
        <div class="alignRight marginBottom20">文成县财政局</div>
      </div>
      <div class="imgCon">
        <div
          class="tableTitle marginBottom20"
          :class="[state.ZLBFitForOld ? 'tableTitleOlder' : '']"
        >
          文成县2021年度雨露计划补助名单汇总表
        </div>
        <img
          :src="state.imgs && state.imgs[0]"
          @click="popPreview(state.imgs, 0)"
        />
        <img
          :src="state.imgs && state.imgs[1]"
          @click="popPreview(state.imgs, 1)"
        />
        <img
          :src="state.imgs && state.imgs[2]"
          @click="popPreview(state.imgs, 2)"
        />
        <img
          :src="state.imgs && state.imgs[3]"
          @click="popPreview(state.imgs, 3)"
        />
        <img
          :src="state.imgs && state.imgs[4]"
          @click="popPreview(state.imgs, 4)"
        />
        <img
          :src="state.imgs && state.imgs[5]"
          @click="popPreview(state.imgs, 5)"
        />
      </div>
      <div class="imgCon">
        <img
          :src="state.img2s && state.img2s[0]"
          @click="popPreview(state.img2s, 0)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { ImagePreview } from 'vant'
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { isZLB } from '@/util/index'
export default {
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const state = reactive({
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
      month: '6',
      tableList1: [],
      title: '',
      imgs: [
        'https://img.hzanchu.com/acimg/e5d02d8d9925d98d91c5cd2a9f7d5040.png',
        'https://img.hzanchu.com/acimg/4d6a86e99db1e4d764c8be1fd3b7581b.png',
        'https://img.hzanchu.com/acimg/2dbc6ca71ca9c3fda5f0d8ca8bf9b863.png',
        'https://img.hzanchu.com/acimg/3eaa7e7720b2a3c9c4b12cb800113db7.png',
        'https://img.hzanchu.com/acimg/f6b9bc924019982bece9ec07b718f194.png',
        'https://img.hzanchu.com/acimg/a1100aed77d650edba5823012f43b934.png',
      ],
      img2s: [
        'https://img.hzanchu.com/acimg/c6a390a883df77cb7c4c8fbba8811c12.png',
      ],
    })
    const initAction = () => {
      //   switch (Route.query.id) {
      //   }
    }
    const popPreview = (array, index) => {
      ImagePreview({
        images: array,
        startPosition: index,
        closeable: true,
      })
    }
    onMounted(() => {
      initAction()
    })
    return {
      popPreview,
      state,
      Route,
    }
  },
}
</script>
<style lang="less" scoped>
@thirtyFour: 34px;
@twentyFour: 24px;
.outer {
  min-height: 100vh;
  padding: 30px;
  background-color: #fff;
  box-sizing: border-box;
}
.header {
  width: 65.3%;
  font-size: @thirtyFour;
  font-weight: bold;
  text-align: center;
  color: #333;
  line-height: 52px;
  margin: 0 auto;
  margin-bottom: 30px;
}
.headerOlder {
  font-size: 50px;
  font-weight: 800;
}
.tableOuter {
  box-sizing: border-box;
}
.item {
  padding: 30px;
  box-sizing: border-box;
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 20px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  font-size: 30px;
  color: #333;
  line-height: 48px;
  &:last-child {
    margin-bottom: 0;
  }
}
.type2Content {
  color: #333;
  font-size: 32px;
}
.contentText {
  line-height: 35px;
}
.type2ContentOlder {
  font-size: 40px;
}
.middle {
  margin-top: 20px;
  margin-bottom: 20px;
}
.alignRight {
  text-align: right;
}
.imgCon {
  display: flex;
  flex-direction: column;
  img {
    width: 100%;
  }
  .tableTitle {
    font-size: 30px;
    text-align: center;
  }
  .tableTitleOlder {
    font-size: 35px;
  }
}
.marginBottom20 {
  margin-bottom: 20px;
}
</style>
