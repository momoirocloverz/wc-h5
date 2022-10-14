<template>
  <div class="skills_trainingCon">
    <van-tabs
      v-model="activeId"
      sticky
      animated
      @click="onClick"
      :class="[state.ZLBFitForOld ? 'tabsOld' : '']"
    >
      <van-tab v-for="item in navList" :title="item.name" :key="item.name">
        <div class="list">
          <!-- <popover v-model:show="state.showPopover" :actions="actions" @select="onSelect">
            <template #reference>
              <div class="sorting" :class="{is_syria: sorting}" @click="changeSorting">
                <p>{{state.statusText}}</p>
                <van-icon name="arrow-down" />
              </div>
            </template>
                    </popover>-->
          <!-- <div class="sorting"
               :class="{ is_syria: sorting }"
               @click="changeSorting">
            <p>时间排序</p>
            <van-icon name="arrow-down" />
                    </div>-->
          <div
            class="item"
            v-for="item in list"
            :key="item.name"
            @click="toDetail(item)"
          >
            <div class="leftCon">
              <img class="viderPoster" :src="item.image_path[0]" alt />
              <img
                class="playBtn"
                src="https://img.hzanchu.com/acimg/14b8bfbd4d391d102663147ccdd72cb4.png"
              />
              <!-- <div class="duration">{{item.video_time}}</div> -->
            </div>
            <div class="content">
              <p
                class="itemName"
                :class="[state.ZLBFitForOld ? 'itemNameOld' : '']"
              >
                {{ item.title }}
              </p>
              <p :class="[state.ZLBFitForOld ? 'itemContentOld' : '']">
                {{ item.content }}
              </p>
              <p :class="[state.ZLBFitForOld ? 'itemCreatedOld' : '']">
                {{ item.created_at }}
              </p>
            </div>
          </div>
        </div>
        <is-end v-if="navList.length" />
        <is-empty class="emptyMargin" v-else />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import isEmpty from '@/components/isEmpty'
import isEnd from '@/components/isEnd'
import { useRouter } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { Popover, Toast } from 'vant'
import Request from '@/service/request.js'
import { isZLB } from '@/util/index'
export default {
  components: {
    isEmpty,
    isEnd,
    Popover,
  },
  setup() {
    const state = reactive({
      showPopover: false,
      statusText: '时间排序',
      orderFlag: true,
      ZLBFLAG: isZLB(),
      ZLBFitForOld:
        localStorage.getItem('fitForOld') &&
        localStorage.getItem('fitForOld') == 1
          ? true
          : false,
    })
    const Router = useRouter()
    const navList = ref([])
    const list = ref([])
    const actions = [{ text: '从远到近' }, { text: '从近到远' }]
    onMounted(() => {
      getTypeList()
    })
    const onSelect = (action) => {
      if (state.statusText == '时间排序' && action.text == '从近到远') {
        setTimeout(() => {
          state.statusText = action.text
        }, 100)
      } else if (state.statusText == '时间排序' && action.text == '从远到近') {
        setTimeout(() => {
          state.statusText = action.text
        }, 100)
        list.reverse()
      } else if (action.text == state.statusText) {
        setTimeout(() => {
          state.statusText = action.text
        }, 100)
      } else {
        setTimeout(() => {
          state.statusText = action.text
        }, 100)
        list.reverse()
      }
    }
    let activeId = ref('')
    let sorting = ref(true)

    const getTypeList = () => {
      Request.skillType().then((res) => {
        if (res.code === 0) {
          navList.value = res.data
          activeId.value = navList.value[0].id
          getList()
        }
      })
    }
    const onClick = (index) => {
      activeId.value = navList.value[index].id
      getList()
    }
    const changeSorting = () => {
      sorting.value = !sorting.value
      //   list.reverse()
    }
    const getList = () => {
      Request.skillList({
        type: activeId.value,
      }).then((res) => {
        if (res.code === 0) {
          list.value = res.data.data
          console.log(list.value, 'list.value')
        }
      })
    }

    const toDetail = (item) => {
      Router.push({
        path: '/skills-training/detail',
        query: {
          id: item.id,
        },
      })
    }

    return {
      navList,
      list,
      activeId,
      sorting,
      onClick,
      changeSorting,
      toDetail,
      state,
      actions,
      onSelect,
    }
  },
}
</script>

<style scoped lang="less">
.emptyMargin {
  margin-top: 200px;
}
.list {
  margin-top: 14px;
  background: #fff;
  padding: 0 30px 0;
  margin-bottom: 50px;
  .sorting {
    display: flex;
    height: 30px;
    line-height: 30px;
    padding: 20px 20px 0;
    font-size: 28px;
    color: @content_color;
    .van-icon {
      transition-duration: 0.5s;
      transform: rotate(180deg);
    }
  }
  .is_syria {
    .van-icon {
      transform: rotate(0deg);
    }
  }
  .item {
    display: flex;
    font-size: 28px;
    padding: 24px 0;
    border-bottom: 2px solid @border_color;

    .leftCon {
      width: 270px;
      height: 188px;
      position: relative;
      margin-right: 40px;
    }
    .playBtn {
      position: absolute;
      left: 50%;
      top: 35%;
      width: 60px;
      transform: translateX(-30px);
    }
    .duration {
      position: absolute;
      bottom: 0;
      right: 0;
      color: #fff;
      width: 84px;
      text-align: center;
      line-height: 36px;
      height: 36px;
      font-size: 22px;
      border-radius: 10px;
      background-color: rgba(0, 0, 0, 0.4);
    }

    .viderPoster {
      width: 270px;
      height: 188px;
    }
    .content {
      width: 0;
      flex: 1;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      p {
        line-height: 40px;
        &:nth-of-type(1) {
          margin-top: 6px;
          font-size: 30px;
          font-weight: 700;
          padding-bottom: 10px;
        }
        &:nth-of-type(2) {
          color: @content_color;
          height: 75px;
          line-height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        &:nth-of-type(3) {
          color: @time_color;
          font-size: 24px;
        }
      }
      .itemNameOld {
        font-size: 50px !important;
        line-height: 52px;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        overflow: hidden;
      }
      .itemContentOld {
        font-size: 42px !important;
        line-height: 42px !important;
        height: 80px !important;
      }
      .itemCreatedOld {
        font-size: 45px !important;
      }
    }
  }
}
</style>
<style lang="less">
.skills_trainingCon {
  .tabsOld {
    .van-tab__text {
      font-size: 40px !important;
      font-weight: 800;
    }
  }
}
</style>
