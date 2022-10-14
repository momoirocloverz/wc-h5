<template>
  <div class="assistanceActivityDetailCon">
    <div class="fakePadding"></div>
    <div class="topImg">
      <!--      <img src="https://img.hzanchu.com/acimg/006bcc889bb861749e14cf74cc3d3046.png">-->
      <img :src="img1" alt="">
    </div>
    <div class="middleCon">
      <!--      <div class="header">中蜂养殖折股量化扶贫项目实施方案（试行）</div>-->
      <div class="header">{{ title }}</div>
        <!--      <div class="content">中蜂养殖折股量化扶贫项目实施方案（试行）中蜂养殖折股量化扶贫项目实施方案（试行）中蜂养殖折股量化扶贫项目实施方案（试行）中蜂养殖折股量化扶贫项目实施方案（试行）</div>-->
        <div class="content">{{ content }}</div>
      </div>
      <div class="bottomCon">
        <!--      <img src="https://img.hzanchu.com/acimg/2129444351bdc895dfdfb2dcf2d5e31f.png">-->
        <img :src="img2" alt="">
      </div>
  </div>
</template>
<script>
import {  useRoute } from 'vue-router';
export default {
  setup () {
    const Route = useRoute()
    const { title, content, img1, img2 } = Route.query
    return {
      title,
      content,
      img1,
      img2
    }
  }
}
</script>
<style lang="less" scoped>
.assistanceActivityDetailCon {
  //   padding-top: 20px;
  box-sizing: border-box;
  height: 100vh;
  background-color: #fff;
}
.fakePadding {
  background-color: #f5f7fa;
  height: 20px;
}
.topImg {
  background-color: #fff;
  padding-top: 40px;
  img {
    width: 100%;
  }
}
.middleCon {
  background-color: #fff;
}
.header {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  color: #333333;
  line-height: 42px;
  margin-bottom: 20px;
}
.content {
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
  font-size: 28px;
  font-weight: 500;
  text-align: left;
  color: #333;
  line-height: 42px;
  padding-bottom: 60px;
}
.bottomCon {
  background-color: #fff;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 100px;
  img {
    width: 100%;
  }
}
</style>
