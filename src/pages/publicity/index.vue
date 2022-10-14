<template>
  <div class="outer">
    <div class="header">公示公告</div>
    <div class="select">
      <div>
        <span>请选择镇</span>
        <van-icon name="arrow-down" />
      </div>
      <div>
        <span>请选择村</span>
        <van-icon name="arrow-down" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .outer {
    min-height: 100vh;
    background: #fff;
    overflow: hidden;
  }
  .header {
    height: 70px;
    background: #f3f6f9;
    font-size: 30px;
    font-weight: bold;
    color: #333;
    text-align: center;
    line-height: 70px;
  }
  .select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 70px;
    margin-top: 32px;
    div {
      width: 268px;
      height: 42px;
      border-radius: 8px;
      border: 2px solid #999999;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
    }
  }
</style>

