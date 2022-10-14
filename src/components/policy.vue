<template>
  <div class="policyCon">
    <div class="titleCon">
      <img src="https://img.hzanchu.com/acimg/6b35c83f92333dcdae0216e74c86563c.png" />
      <div class="title" :class="[state.oldFlag ? 'titleOld' : '']">最新动态</div>
    </div>
    <div v-if="!state.list.length" class="empty">加载中...</div>
    <van-swipe v-else class="my-swipe" :autoplay="0" :indicator-color="'#FF844E'" lazy-render>
      <!-- :height="state.oldFlag ? 330 : 144" -->
      <van-swipe-item v-for="(item, i) in state.list" :key="i" @click="toDetail(item)">
        <div class="itemCon">
          <div class="policyTitle" :class="[state.oldFlag ? 'policyTitleOld' : '']">
            {{ item.title }}
          </div>
          <div class="policyContent" :class="[state.oldFlag ? 'policyContentOld' : '']" v-if="item.fakecontent" :content="item.fakecontent" v-html="item.fakecontent"></div>
          <span v-if="!state.oldFlag" :class="[state.oldFlag ? 'spanOld' : '']">查看详情>></span>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import Request from '@/service/request.js'
import { isZLB } from '@/util/index'
export default {
  props: {
    ZLBFitForOld: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const Router = useRouter()
    const state = reactive({
      ZLBFLAG: isZLB(),
      info: '',
      oldFlag: props.ZLBFitForOld,
      //   oldFlag:true,
      list: []
    })
    onMounted(() => {
      getList()
    })
    const getList = async () => {
      let empty = []
      const res1 = await Request.getList({
        type: '',
        is_recommend: '1'
      })
      if (res1 && res1.code == 0) {
        let bridge = res1.data
        let sec = bridge.map((ele) => {
          let copy = ele.content
          let shorter = copy
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/gi, '')
            .replace(/\s/gi, '')
          return {
            ...ele,
            fakecontent: shorter.length > 95 ? shorter.substr(0, 95) + '...' : '<br/>' + shorter + '<br/>'
          }
        })
        if (sec && sec.length) {
          empty = sec
        }
      }
      state.list = empty
      //   const res1 = await Request.getList({
      //     type: '1',
      //     is_recommend: '1'
      //   })
      //   const res2 = await Request.getList({
      //     type: '2',
      //     is_recommend: '1'
      //   })
      //   const res3 = await Request.getList({
      //     type: '3',
      //     is_recommend: '1'
      //   })
      //   if (res1 && res1.code == 0) {
      //     let bridge = res1.data.slice(0, 1)
      //     let sec = bridge.map((ele) => {
      //       let copy = ele.content
      //       let shorter = copy.replace(/<[^>]+>/g, '')
      //       return {
      //         ...ele,
      //         fakecontent: shorter.length > 100 ? shorter.substr(0, 100) + '...' : shorter
      //       }
      //     })
      //     if (sec && sec.length) {
      //       empty.push(sec[0])
      //     }
      //   }
      //   if (res2 && res2.code == 0) {
      //     let bridge = res2.data.slice(0, 1)
      //     let sec = bridge.map((ele) => {
      //       let copy = ele.content
      //       let shorter = copy.replace(/<[^>]+>/g, '')
      //       return {
      //         ...ele,
      //         fakecontent: shorter.length > 100 ? shorter.substr(0, 100) + '...' : shorter
      //       }
      //     })
      //     if (sec && sec.length) {
      //       empty.push(sec[0])
      //     }
      //   }
      //   if (res3 && res3.code == 0) {
      //     let bridge = res3.data.slice(0, 1)
      //     let sec = bridge.map((ele) => {
      //       let copy = ele.content
      //       let shorter = copy.replace(/<[^>]+>/g, '')
      //       return {
      //         ...ele,
      //         fakecontent: shorter.length > 100 ? shorter.substr(0, 100) + '...' : shorter
      //       }
      //     })
      //     if (sec && sec.length) {
      //       empty.push(sec[0])
      //     }
      //   }
      //   state.list = empty.sort((a, b) => {
      //     return a.type - b.type
      //   })
    }
    const toDetail = (item) => {
      console.log(item)
      sessionStorage.removeItem('information')
      if (item.top_image) {
        Router.push({
          path: '/information/detail',
          query: {
            top_image: item.top_image
          }
        })
      } else {
        Router.push('/information/detail')
      }
      sessionStorage.setItem('information', item.content)
    }

    return {
      state,
      toDetail
    }
  }
}
</script>
<style lang="less" scoped>
@thirty: 30px;
@thirtySix: 36px;
@twentyEight: 28px;
@fourty: 40px;
.policyCon {
  background-color: #fff;
  border-radius: 16px;
  padding: 30px;
  box-sizing: border-box;
  .itemCon {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .policyTitle {
    font-size: @thirty;
    font-weight: 500;
    text-align: left;
    color: #333;
    margin-bottom: 30px;
    line-height: @thirtySix;
  }
  .policyContent {
    font-size: @twentyEight;
    line-height: @fourty;
    text-align: left;
    color: #333;
    p {
      word-wrap: break-word;
    }
  }
  span {
    position: absolute;
    font-size: 28px;
    right: 0;
    bottom: 10px;
    z-index: 3;
    color: #3787f5;
    line-height: 24px;
    background-color: #fff;
  }
  .spanOld {
    font-size: 50px;
  }
  .policyTitleOld {
    font-size: 50px;
    line-height: 50px;
  }
  .policyContentOld {
    font-size: 50px;
    line-height: 53px;
  }
}
.titleCon {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  vertical-align: center;
  img {
    width: 4px;
    height: 28px;
    margin-right: 8px;
  }
  margin-bottom: 32px;
  .title {
    font-size: 32px;
    height: 34px;
    line-height: 34px;
    font-weight: 600;
    color: #333;
  }
  .titleOld {
    font-size: 50px;
    font-weight: 600;
    color: #333;
    //   margin-bottom: 32px;
  }
}

.empty {
  text-align: center;
  font-size: 26px;
  height: 200px;
}
</style>
<style lang="less">
.policyCon {
  .van-swipe__indicators {
    bottom: 0px;
    .van-swipe__indicator {
      background-color: #d5d5d5;
      opacity: 1;
    }
    .van-swipe__indicator--active {
      background-color: rgb(255, 132, 78) !important;
    }
  }
  .van-swipe__indicator {
    background-color: #666;
  }
  .my-swipe {
    padding-bottom: 30px;
  }
  .policyContent {
    word-wrap: break-word;
    letter-spacing: 2px;
    p {
      word-wrap: break-word;
    }
  }
}
</style>
