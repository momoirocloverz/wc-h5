<template>
  <div class="assistanceActivityCon">
    <div class="message-list">
      <div class="itemCon"
           v-for="(item, index) in state.messageList"
           :key="index"
           @click="toDetail( item )">
        <div class="TextCon">
          <div class="itemTitle line-clamp-2">{{item.title}}</div>
          <div class="itemTime">{{item.updated_at}}</div>
        </div>
        <div class="imgCon" :style=" 'background-image: url(' + item.img1 + ')'  ">
        </div>
      </div>
    </div>
    <!-- <IsEmpty v-if="!messageList.length"></IsEmpty>
    <IsEnd v-if="messageList.length"></IsEnd> -->
  </div>
</template>
  <script>
import { ref, reactive, onBeforeMount } from 'vue'
import Request from '@/service/request.js'
import IsEmpty from '@/components/isEmpty.vue'
import IsEnd from '@/components/isEnd.vue';
import { useRouter } from 'vue-router';
export default {
  components: {
    IsEmpty,
    IsEnd
  },
  setup () {
    const Router = useRouter();
    const state = reactive({
      messageList: [],
    })
    const getList = () => {
      state.messageList = [
        {
          title: '帮扶干部走访困难群众 ,关注防寒保暖',
          desc: '珊溪镇各村帮扶干部关注困难农户和孤寡老人保暖防寒，进一步压实“一户一策一干部”精准帮扶工作责任，认真做好低收入农户结对帮扶走访活动。',
          updated_at: '2021-4-27 20:40',
          img1: 'https://img.hzanchu.com/acimg/0f5fa2344377de1d1e9d4b3dda99720d.jpeg',
          img2: 'https://img.hzanchu.com/acimg/7635e073c804fdf63c7c6dd191567e44.jpeg'
        },
        {
          title: '大峃镇关注低收入农户防疫，提供口罩等防疫物资',
          desc: '大峃镇为低收入农户送去防疫口罩，保障特殊时期低收入农户防疫物资需求，并嘱咐他们少出门，不聚集，勤洗手，多通风，为打赢疫情防控阻击战贡献自己的一份力量。',
          updated_at: '2021-4-27 20:40',
          img1: 'https://img.hzanchu.com/acimg/1d7fa8c868f1a86f43fc64e6f280914b.jpeg',
          img2: 'https://img.hzanchu.com/acimg/e552f0e95e033cd4093ba24244c45983.jpeg'
        },
        {
          title: '徐小艳同社区、村干部走访困难党员，发放春节慰问金',
          desc: '春节将至，文成县委县政府十分关心困难党员的生活。2021年2月5日下午井源村开展困难党员慰问，县派第一书记徐小艳与村干部、社区干部一同前往困难党员家中，了解其生活近况，并送上慰问金，让困难党员过一个幸福美满的春节，党员群众对此纷纷点赞。',
          updated_at: '2021-4-27 20:40',
          img1: 'https://img.hzanchu.com/acimg/ec74e743dfd217d4b32e40fd4531c805.jpeg',
          img2: 'https://img.hzanchu.com/acimg/4e36d5a9f7d2d0adb6f459f100ba184b.jpeg'
        },
        {
          title: '胡岳考书记携相关干部走访困难群众，发放春节慰问金',
          desc: '春节将至，为了解困难群众生活近况，保障其备年货迎春节。2021年2月5日上午农业农村局领导，胡岳考书记、周莉副书记、历国锋主任，在县派第一书记徐小艳和村干部的陪同下前往困难群众家中，了解其生活近况，送上慰问金，让困难群众过一个幸福美满的年，困难群众对此纷纷点赞。',
          updated_at: '2021-4-27 20:40',
          img1: 'https://img.hzanchu.com/acimg/44bbeeed95a1038f22429ed82651c784.jpeg',
          img2: 'https://img.hzanchu.com/acimg/e17138e6235e36e409d05c3becd28384.jpeg'
        }
      ]
    }
    onBeforeMount(() => {
      getList();
    })
    const toDetail = (item) => {
      Router.push({
        name: 'socialAssistanceDetail',
        query: {
          title: item.title,
          content: item.desc,
          img1: item.img1,
          img2: item.img2
        }
      })
    }
    return {
      state,
      getList,
      toDetail
    }
  }
}
  </script>

  <style lang="less" scoped>
.assistanceActivityCon {
  padding-top: 20px;
}
.textCon {
}
.itemCon {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  height: 195px;
  box-sizing: border-box;
  padding-top: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  &:last-child {
    border: none;
  }
  .itemTitle {
    width: 100%;
    font-size: 30px;
    font-weight: 500;
    text-align: left;
    color: #333333;
    line-height: 42px;
    height: 80px;
    width: 330px;
    margin-bottom: 20px;
  }
  .itemTime {
    font-size: 26px;
    text-align: left;
    color: #999999;
    line-height: 44px;
    letter-spacing: 1px;
  }
}
.tab {
  height: 86px;
  display: flex;
  align-items: center;
  background: #fff;
  div {
    flex: 1;
    font-size: 30px;
    color: #999;
    text-align: center;
    line-height: 86px;
    position: relative;
    height: 86px;
    span {
      width: 125px;
      height: 5px;
      background: #ff9a16;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
.message-list {
  padding: 0 32px;
  background-color: #fff;
}

.TextCon {
}
.imgCon {
  width: 240px;
  height: 160px;
  border-radius: 10px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.is-end {
  margin-top: 0.5rem;
}
.is-empty {
  margin: 1rem auto;
}
</style>
