<template>
  <div class="outer">
    <div class="list">
      <div class="item" v-for="item in list" :key="item.id">
        <div class="image">
          <img src="" alt="">
        </div>
        <div class="info">
          <p class="lines-1">办法刚收到更是个大风歌大风歌大风歌撒地方官爱国</p>
          <p>10.00元/天</p>
          <p>2021-05-09</p>
        </div>
      </div>
    </div>
    <IsEnd></IsEnd>
    <ReleaseBtn :url="'/index'"></ReleaseBtn>
  </div>
</template>

<script>
import { ref } from 'vue';
import IsEnd from '@/components/isEnd';
import ReleaseBtn from '@/components/releaseBtn';
export default {
  components: {
    IsEnd,
    ReleaseBtn
  },
  setup() {
    const list = ref([{},{},{}]);

    return {
      list
    }
  }
}
</script>

<style lang="less" scoped>
  .outer {
    overflow: hidden;

  }
  .list {
    overflow: hidden;
    padding: 0 30px;
    background: #fff;
    margin-top: 15px;
    .item {
      height: 253px;
      background: #fff;
      border-bottom: 2px solid #edeff2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .image {
        width: 270px;
        height: 188px;
        position: relative;
        background: url(https://img.hzanchu.com/acimg/a00df9ebc4b71833879c97d9f898f306.png) no-repeat;
        background-size: 100%;
        image {
          width: 100%;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .info {
        width: 390px;
        p:nth-of-type(1) {
          font-size: 32px;
          font-weight: 600;
          color: #333;
          line-height: 34px;
        }
        p:nth-of-type(2) {
          font-size: 32px;
          font-weight: 600;
          color: #F51818;
          line-height: 34px;
          margin-top: 34px;
        }
        p:nth-of-type(3) {
          font-size: 26px;
          color: #999;
          line-height: 28px;
          margin-top: 32px;
        } 
      }
    }
  }
  .is-end {
    margin: 30px 0;
  }
  
</style>