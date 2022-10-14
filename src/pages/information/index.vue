<template>
  <div class="con">
    <Banner></Banner>
    <div class="message">
      <InformationList></InformationList>
    </div>
  </div>
</template>

<script>
import Banner from '@/components/banner.vue'
import InformationList from '@/components/informationList.vue'
export default {
  name: 'information',
  components: {
    Banner,
    InformationList
  }
}
</script>

<style lang="less" scoped>
.con {
  overflow-y: scroll;
  box-sizing: border-box;
  padding-bottom: 120px;
}
.message {
  margin-top: 20px;
}
</style>