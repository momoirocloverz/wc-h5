<template>
  <div class="outer">
    <van-tabs v-model="active" animated @click="selectNav">
      <van-tab v-for="item in navList" :title="item.title" :key="item.title">
        <div class="list">
          <div
            class="item"
            v-for="(item, index) in state.list"
            :key="index"
            @click="toDetail(item)"
          >
            <p>{{ item.name }}</p>
            <img :src="item.img" alt />
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { onMounted, ref, reactive } from 'vue'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
  setup() {
    const Router = useRouter()
    const active = ref(0)
    const navList = ref([
      {
        title: '补助',
      },
      {
        title: '补贴',
      },
    ])

    const state = reactive({
      list: [],
      ZLBFLAG: isZLB(),
    })

    onMounted(() => {
      getList()
    })

    const selectNav = (name, title) => {
      console.log(name, title)
      if (name === 1) {
        state.list = [
          {
            name: '危旧房补贴',
            id: '',
            img: 'https://img.hzanchu.com/acimg/d7d071f8e119ac70e05d8e07c82f8db3.png',
            path: '',
          },
          {
            name: '人才补贴',
            id: '',
            img: 'https://img.hzanchu.com/acimg/4ab4544db52bbe3dc14ee21c9b9a8bcf.png',
            path: '',
          },
          {
            name: '创业补贴',
            id: '',
            img: 'https://img.hzanchu.com/acimg/647c673806b19b1c7372aa7379ef6cf6.png',
            path: '',
          },
        ]
      } else {
        getList()
      }
    }
    const getList = () => {
      Request.planList({
        id: sessionStorage.getItem('uid'),
        contact: localStorage.getItem('phone'),
      }).then((res) => {
        if (res && res.code === 0) {
          if (res.data && res.data.length) {
            let withImg = res.data[0]
            withImg.img =
              'https://img.hzanchu.com/acimg/a1c7891e1eac12a56bee9656882454eb.png'
            withImg.path = '/subsidy/yulujihua'
            withImg.query = {
              plan_id: 'id',
            }
            state.list = [
              withImg,
              {
                name: '特困补助',
                id: '',
                img: 'https://img.hzanchu.com/acimg/e93b41bb73efec5fcd69c55ad54e1da5.png ',
                path: 'http://59.202.42.149:8088/st/djz/login.jsp?redirectCount_index=1&l=1',
              },
              {
                name: '低保补助',
                id: '',
                img: 'https://img.hzanchu.com/acimg/e6c66e26ded002952dbd7c1cb663c77d.png ',
                path: 'http://59.202.42.149:8088/st/djz/login.jsp?redirectCount_index=1&l=1',
              },
              {
                name: '教育补助',
                id: '',
                img: 'https://img.hzanchu.com/acimg/6c395865b4f2513443a7990d8984b7fd.png ',
                path: '',
              },
              {
                name: '医疗补助',
                id: '',
                img: 'https://img.hzanchu.com/acimg/7a526fc4ad0608601d8335f43766d55f.png ',
                path: '',
              },
              {
                name: '残疾人补助',
                id: '',
                img: 'https://img.hzanchu.com/acimg/48f66a7f31ae1b919df8772c616551de.png ',
                path: '',
              },
              {
                name: '异地搬迁',
                id: '',
                img: 'https://img.hzanchu.com/acimg/432870b1344d6e9c443bceb631560930.png',
                path: '',
              },
              {
                name: '小额贷款',
                id: '',
                img: 'https://img.hzanchu.com/acimg/18e49f18d9dc34604ce6cf529a21e421.png',
                path: '',
              },
            ]
          }
        }
      })
    }

    const toDetail = (item) => {
      if (item.path) {
        if (item.path.indexOf('http') > -1) {
          if (state.ZLBFLAG) {
            ZWJSBridge.openLink({
              url: item.path,
            })
              .then((res) => {
                console.log(res)
              })
              .catch((err) => {
                console.log(err)
              })
          } else {
            window.location.href = item.path
          }
        } else {
          if (item.path == '/subsidy/yulujihua') {
            Router.push({
              path: '/subsidy/yulujihua',
              query: { plan_id: item.id },
            })
          } else {
            Router.push({
              path: item.path,
            })
          }
        }
      } else {
        Toast('即将开放，敬请期待')
      }
    }

    return {
      toDetail,
      selectNav,
      active,
      navList,
      state,
    }
  },
}
</script>

<style lang="less" scoped>
.outer {
  overflow: hidden;
}
.list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  flex-wrap: wrap;
  padding: 0 30px 100px;
}
.item {
  // width: 330px;
  width: 44%;
  height: 359px;
  border-radius: 30px;
  background: #fff;
  overflow: hidden;
  position: relative;
  margin-top: 30px;
  p {
    font-size: 38px;
    color: #333;
    font-weight: 600;
    margin-top: 42px;
    padding: 0 37px;
  }
  img {
    width: 233px;
    position: absolute;
    bottom: 15px;
    right: 10px;
  }
}
</style>
