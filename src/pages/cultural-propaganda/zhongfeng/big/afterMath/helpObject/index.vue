<template>
  <div class="bigHelpObjectCon">
    <van-tabs v-model:active="current" @click-tab="onClickTab" class="fixedTab">
      <van-tab title="申请中"></van-tab>
      <van-tab title="已结对"></van-tab>
      <van-tab title="已结束"></van-tab>
    </van-tabs>

    <help-list v-if="current == 0" ref="helpRef1" :type="current"></help-list>
    <help-list v-if="current == 1" ref="helpRef1" :type="current"></help-list>
    <help-list v-if="current == 2" ref="helpRef1" :type="current"></help-list>

    <!-- <div v-if="current == 0"> 
      <help-list ref="helpRef1" :type="1" title="已申请"></help-list>
      <help-list ref="helpRef2" :type="2" title="已拒绝"></help-list>
    </div>

    <div v-if="current == 1">
      <help-list ref="helpRef3" :type="3" title="待蜂箱上传"></help-list>
      <help-list ref="helpRef4" :type="4" title="待审核"></help-list>
      <help-list ref="helpRef5" :type="5" title="结对成功"></help-list>
    </div>

    <div v-if="current == 2">
      <help-list ref="helpRef6" :type="6" title="待送箱上门"></help-list>
      <help-list ref="helpRef7" :type="7" title="已送箱上门"></help-list>
    </div> -->
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HelpList from './list.vue'
export default {
  components: { HelpList },
  setup() {
    const Router = useRouter()
    const Route = useRoute()
    const current = ref(0) // 当前 current step选项
    const helpRef1 = ref(null) //
    const helpRef2 = ref(null) //
    const helpRef3 = ref(null) //
    const helpRef4 = ref(null) //
    const helpRef5 = ref(null) //
    const helpRef6 = ref(null) //
    const helpRef7 = ref(null) //

    const onClickTab = (val) => {
      Router.replace({
        name: 'culturalProBigHelpObject',
        query: {
          tab: val.name
        }
      })
      if (!val.name == 1) {
        sessionStorage.removeItem('bigHelpObjectWithSelectInfo')
      }

      // helpRef1.value.reload();
      // switch (current.value) {
      //   case 0:
      //     setTimeout(() => {
      //       helpRef1.value.reload();
      //       helpRef2.value.reload();
      //     }, 250);

      //     break;
      //   case 1:
      //     setTimeout(() => {
      //       helpRef3.value.reload();
      //       helpRef4.value.reload();
      //       helpRef5.value.reload();
      //     }, 250);

      //     // window.location.href="www.baidu.com"

      //     break;
      //   case 2:
      //     setTimeout(() => {
      //       helpRef6.value.reload();
      //       helpRef7.value.reload();
      //     }, 250);
      //     break;
      // }
    }

    const removeAction = () => {
      sessionStorage.removeItem('bigHiveNumberData1')
      sessionStorage.removeItem('bigHiveNumberData2')
      sessionStorage.removeItem('bigHiveNumberDataidBackImgObj')
      sessionStorage.removeItem('bigHiveNumberDataidFrontImgObj')
      sessionStorage.removeItem('bigHiveNumberDataid2FrontImgObj')
      sessionStorage.removeItem('bigHiveNumberDataid2BackImgObj')
      sessionStorage.removeItem('bigHelp1Address')
      sessionStorage.removeItem('bigHelp2Address')
    }

    // 初始化
    const init = () => {
      // helpRef1.value.reload();
      // helpRef2.value.reload();
      if (Route.query && Route.query.tab) {
        current.value = +Route.query.tab
      }
    }

    onMounted(() => {
      // 这里主要是清除之前地图带数据
      removeAction()
      init()
    })

    return {
      helpRef1,
      helpRef2,
      helpRef3,
      helpRef4,
      helpRef5,
      helpRef6,
      helpRef7,
      current,
      onClickTab,
      Router
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../../../assets/css/fit.less';
.bigHelpObjectCon {
  box-sizing: border-box;
  padding-top: 80px;
}
.fixedTab {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 5;
}
</style>
