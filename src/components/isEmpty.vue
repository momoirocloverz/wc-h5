<template>
  <div class="is-empty">
    <img :src="image" alt="">
    <p>{{text}}</p>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      default: 'https://img.hzanchu.com/acimg/eac5a718827700552e4aafa0d5b5b30a.png'
    },
    text: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>

<style lang="less" scoped>
  .is-empty {
    text-align: center;
    img {
      width: 400px;
    }
    p {
      font-size: 32px;
      line-height: 40px;
      color: #999;
    }
  }
</style>