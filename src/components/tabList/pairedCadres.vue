<template>
  <!-- 内容区域 -->
  <div class="group-content">
    <div class="group-header">
      <div class="group-li">
        <span class="group-title">干部姓名</span>
        <span class="group-title">张献忠</span>
      </div>
      <div class="group-li">
        <span class="group-title">电话</span>
        <span class="group-title">15132145789</span>
      </div>
      <div class="group-li">
        <span class="group-title">随访次数</span>
        <span class="group-title">2</span>
      </div>
    </div>

    <div class="group-table">
      <div class="group-table-header">
        <div class="table-header-title">随访日期</div>
        <div class="table-header-title">随访内容</div>
      </div>
      <div class="group-table-content">
        <div class="table-content-title">2021.03.21</div>
        <div class="table-content">
          <span>春节走访维问</span>
        </div>
      </div>
      <div class="group-table-content">
        <div class="table-content-title">2021.03.21</div>
        <div class="table-content">
          <span>春节走访维问</span>
        </div>
      </div>
      <div class="group-table-content">
        <div class="table-content-title">2021.03.21</div>
        <div class="table-content">
          <span>春节走访维问</span>
        </div>
      </div>
      <div class="group-table-content">
        <div class="table-content-title">2021.03.21</div>
        <div class="table-content">
          <span>春节走访维问</span>
          <img
            src="https://img.hzanchu.com/acimg/e30777e9085b27ac7e4037966c706cd7.jpeg"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "pairedCadres",
};
</script>
<style lang="less" scoped>
.group-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  background: #fff;
  padding-bottom: 30px;
  .group-table {
    // width: 690px;
    width: 92%;
    margin: 16px auto 0px auto;
    display: flex;
    flex-direction: column;
  }
  .group-table-header {
    width: 688px;
    border: #dee2e6 solid 2px;
    background: #f8f8f9;
    display: flex;
    flex-direction: row;
    height: 77px;
    align-items: center;
  }
  .table-header-title {
    width: 343.5px;
    height: 77px;
    line-height: 77px;
    text-align: center;
    font-size: 26px;
    font-weight: bold;
  }
  .table-header-title:first-child {
    border-right: #dee2e6 solid 2px;
  }
  .group-table-content {
    width: 688px;
    display: flex;
    flex-direction: row;
    border: #dee2e6 solid 2px;
    border-top: none;
  }
  .table-content-title {
    width: 343px;
    font-size: 26px;
    border-right: #dee2e6 solid 2px;
    padding: 25px 0px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .table-content {
    width: 343px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span {
      font-size: 26px;
      padding: 20px 0px;
    }
    img {
      height: 160px;
      border-radius: 15px;
      margin-bottom: 20px;
    }
  }
}
</style>