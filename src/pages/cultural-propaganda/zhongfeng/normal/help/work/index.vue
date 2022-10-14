<template>
  <div class="outer">
    <template v-for="item in state.list" :key="item.type">
      <img :src="item.img" @click="toDetail(item)" />
    </template>
    <div v-if="!state.list.length" class="nothing">暂无</div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { Dialog, Popup, Toast } from 'vant'
import { ref, reactive, onBeforeMount } from 'vue'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  setup() {
    const Router = useRouter()
    const state = reactive({
      list: [],
      ZLBFLAG: isZLB(),
    })
    const toDetail = (item) => {
      Router.push({
        name: 'workDetail',
        query: {
          id: item.id,
          is_apply: item.is_apply,
        },
      })
    }
    const forInit = (res) => {
      if (res.data.data.length) {
        let empty = []
        let track1 = res.data.data.find((ele) => {
          return ele.type == 1
        })
        if (track1) {
          empty.push({
            id: track1.id,
            img: 'https://img.hzanchu.com/acimg/a2d61f676fdcf9d29b716bd832f768ba.png',
            type: '1',
            is_apply: track1.is_apply,
          })
        }
        let track2 = res.data.data.find((ele) => {
          return ele.type == 2
        })
        if (track2) {
          empty.push({
            id: track2.id,
            img: 'https://img.hzanchu.com/acimg/a44ccd5892bc14a94f917482e8448750.png',
            type: '2',
            is_apply: track2.is_apply,
          })
        }
        let track3 = res.data.data.find((ele) => {
          return ele.type == 3
        })
        if (track3) {
          empty.push({
            id: track3.id,
            img: 'https://img.hzanchu.com/acimg/11871d53cf82d793b4a994674d010b1b.png',
            type: '3',
            is_apply: track3.is_apply,
          })
        }
        state.list = empty
      }
    }
    const initAction = () => {
      Request.fetchFarmerWorkList({})
        .then((res) => {
          if (res && res.code == 0) {
            forInit(res)
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    onBeforeMount(() => {
      initAction()
    })

    return {
      toDetail,
      state,
    }
  },
}
</script>

<style lang="less" scoped>
.nothing {
  font-size: 28px;
  color: #666;
  line-height: 28px;
  margin-top: 24px;
  text-align: center;
}
.outer {
  padding: 0 30px;
  img {
    width: 100%;
    margin-top: 40px;
  }
}
</style>
