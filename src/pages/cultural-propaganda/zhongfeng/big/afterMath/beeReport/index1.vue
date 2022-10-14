<template>
  <div class="report">
    <report-list ref="reportRef"></report-list>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue'
import ReportList from './list.vue'
export default {
  components: { ReportList },
  setup() {
    const reportRef = ref(null) //
    onMounted(() => {})
    return {
      reportRef
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../../../assets/css/fit.less';
.report {
  width: 100%;
  .publish {
    width: 100%;
    padding: 24px 30px;
    box-sizing: border-box;
    text-align: right;
    color: var(--custom_color);
  }
}
</style>
