<template>
  <div class="detail">
    <div class="content" v-if="type === 'shanyao'">
      <img src="https://img.hzanchu.com/acimg/10878dbaa52f57c38df012bf87733339.png" alt="" />
      <p class="title">糯米山药</p>
      <p>文成位于浙南山区，以明朝开国元勋刘基（刘伯温）的谥号“文成”作县名。是浙江省第二大侨乡，革命老根据地县，是国家重点生态功能区、国家级生态示范区，文成是温州900万人口中700万居民的饮用水源地，境内生态环境优越，先后获评国家生态县、中国长寿之乡、中国气候养身福地等名片。</p>
      <img class="subImg" src="https://img.hzanchu.com/acimg/7f8dd313a82266766cda114bbaed3523.png" alt="" />
      <p>文成是全省十大山地蔬菜示范县之一,其中糯米山药是文成特有的优良地方品种，有着悠久的种植历史，据传为刘伯温告老还乡时朱元璋恩赐刘伯温带回家乡分发农民种植所传，因其糯性韧性与糯米相似，俗称“糯米山药”文成糯米山药具有粮、菜、药兼用的功效，它外表乌黑毛糙，内里嫩白如玉，入口黏而不腻，口感软滑韧柔香糯，因独特的口感和药用价值而成为山药界的新宠，深受广大消费者青睐！多次获得省、市农博会金奖，连续两年获得参加浙江省农博会品鉴会主食菜品、上海农展会推介产品的殊荣。2018年被省农业农村厅列为绿色精品基地建设项目，2019年被列为《浙江省特色优势农产品区域布局规划》山地蔬菜类产品。2020年“文成糯米山药”成功注册国家地理证明商标。目前栽培面积6000多亩，预计总产量达9000多吨，总产值9000多万元。</p>
    </div>
    <div class="content" v-if="type === 'yangmei'">
      <video 
        id="video" 
        class="video" 
        controls
        x5-video-player-type="h5" 
        x5-video-player-fullscreen="true"
        style="object-fit:fill"
        poster="https://img.hzanchu.com/acimg/4f7eaa9fc1f65dcfe9985e8113004106.png"
      >
        <source src="https://hzanchu-test.oss-cn-hangzhou.aliyuncs.com/acvideo/%E5%8E%BF%E9%95%BF%E8%AF%B7%E6%82%A8%E5%90%83%E6%9D%A8%E6%A2%85.mp4" />
      </video>
      <p class="title">文成杨梅</p>
      <p>杨梅是文成县第一大水果，位居文成县农业三大主导产业之首。至2020年，文成县杨梅栽培面积6.12万亩，产量2.23万吨，销售额2.38亿元。品种以东魁杨梅和荸荠种杨梅为主，良种覆盖率达98%以上。已形成了以珊溪镇、大峃镇为中心的飞云江沿岸杨梅核心产业带，以黄坦镇、西坑镇为中心的中山地区杨梅产业带，以南田镇百丈漈镇为中心的高山台地杨梅产业带。分别在珊溪南阳、仰山塘山、雅坪、南田武阳、岳洋、大峃塔山等地建成6个千亩杨梅示范区，200亩以上示范基地56个。目前，全县从事杨梅生产经营的果农1.5万多户，3.1万人。可以说，杨梅产业是我县惠及农民最多、农民受惠面最广的农业主导产业。</p>
      <!-- <video controls playsinline>
        <source src="https://hzanchu-test.oss-cn-hangzhou.aliyuncs.com/acvideo/%E6%9D%A8%E6%A2%85%E5%AE%A3%E4%BC%A0%E7%89%872.mp4" />
      </video> -->
      <img src="https://img.hzanchu.com/acimg/f224dcb7405503a9e56baa5c220ab597.png">
      <p>文成杨梅具有“熟期长、品质优、绿色生态”的特点，是浙江省内成熟时间最早（六月初成熟）、下市时间最晚（七月中、下旬下市）的杨梅产区，杨梅鲜果有效销售期长达45天以上。近年来，通过部署实施“杨梅上山、梯度开发”的战略，引导杨梅产业向中、高山区转移发展利用各产区不同的海拔高度，大力发展高山杨梅基地，使广大的山区变成杨梅天然“保鲜库”。目前，全县高山杨梅基地达2万多亩，因于7月初成熟上市，实现了错峰上市，统货产地批发价高达30－40元/公斤，经济效益显著。2020年，文成杨梅认定为浙江省特色农产品优势区，文成县被列入浙江省绿色精品农产品基地创建县（文成杨梅、文成糯米山药）。全县杨梅有无公害农产品基地认证22家，绿色食品基地认证7家。2018年，“文成杨梅”首次出口加拿大，2019年取得美国FDA认证。</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
export default {
  setup () {
    const route = useRoute();
    let type = ref('');

    type = route.query.type
    return {
      type
    }
  }
}
</script>

<style scoped lang="less">
.detail {
  .content {
    padding: 10px 30px 30px;
    .title {
      font-size: 32px;
      font-weight: 600;
      text-align: center;
      padding: 20px 0;
      text-indent: 0;
    }
    p {
      font-size: 28px;
      line-height: 44px;
      text-indent: 2em;
    }
    img,
    video {
      width: 100%;
      border-radius: 10px;
      padding: 20px 0;
    }

    .subImg {
      padding-left: 25px;
      padding-right: 25px;
      box-sizing: border-box;
    }
  }
}
</style>
