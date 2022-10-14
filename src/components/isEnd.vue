<template>
  <div class="is-end">
    ———— <span>{{text}}</span> ————
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '已经到底了哦'
    }
  },
  setup() {
    
  }
}
</script>

<style lang="less" scoped>
  .is-end {
    text-align: center;
    font-size: 0.3rem;
    color: #999;
    line-height: 0.4rem;
    span {
      padding: 0 0.2rem;
    }
  }
</style>