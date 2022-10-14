<!-- 自定义安厨图片展示组件 -->
<template>
  <div :style="customStyle" class="_select">
    <template v-if="step.length > 0">
      <div v-for="(item, index) in step" :key="index" class="_item">
        <div class="_title fs-32">{{ item.title }}</div>
        <div v-for="(item1, index1) in item.sub" :key="index1" class="_item1 fs-28 flex-row">
          <!-- 这里判断是否需要开启左边按钮选择 -->
          <img
            v-if="!item.closeSelect"
            :src="item1.select ? 'https://img.hzanchu.com/acimg/a749422927f1d8e2925378fd26118932.png' : 'https://img.hzanchu.com/acimg/ad9bfad18d010d22d80003722ce18a08.png'"
            class="_select-icon"
            @click="selectLeft(index, index1, item1.select)"
          />
          <div class="_main">
            {{ item1.title }}

            <template v-if="item1.select && item1.optionText && item1.optionText != ''">
              <div class="_sub-title fs-28"><span>*</span>{{ item1.optionText }}</div>
              <div class="flex-row flex-wrap">
                <div v-for="(item2, index2) in item1.option" :key="index2" :class="item2.select ? '_option-selected' : '_option-unselected'" @click="selectOption(index, index1, index2, item2.select)">
                  {{ item2.title }}
                </div>
              </div>
            </template>

            <!-- 这里是输入框设置 -->
            <template v-if="item1.select && item1.inputText && item1.inputText != ''">
              <div class="_sub-title fs-28"><span>*</span> {{ item1.inputText }}</div>
              <input
                class="_input"
                :value="item1.input"
                :type="item1.inputType ? item1.inputType : 'text'"
                placeholder="请输入"
                @input="
                  (e) => {
                    updateInput(e, index, index1, 'input')
                  }
                "
                @blur="
                  (e) => {
                    updateInput(e, index, index1, 'blur')
                  }
                "
              />
              <div class="_tip fs-28">{{ item1.inputTip }}</div>
            </template>

            <!-- 这里是图片上传 -->
            <template v-if="item1.select && item1.uploadText && item1.uploadText != ''">
              <div class="_sub-title fs-28"><span>*</span> {{ item1.uploadText }}</div>
              <image-upload
                :list="item1.upload"
                :max="9"
                @upload="
                  (e) => {
                    dealUpload(e, index, index1)
                  }
                "
                @delete="
                  (pos) => {
                    dealDelete(pos.pos, index, index1)
                  }
                "
              ></image-upload>
            </template>

            <!-- 这里是输入框设置1，按照当前业务流程，先暂时默认排在图片选择组件下 -->
            <template v-if="item1.select && item1.inputText1 && item1.inputText1 != ''">
              <div class="_sub-title fs-28"><span>*</span> {{ item1.inputText1 }}</div>
              <input
                class="_input"
                :value="item1.input1"
                :type="item1.inputType1 ? item1.inputType1 : 'text'"
                placeholder="请输入"
                :max="item1.max1 ? item1.max1 : ''"
                :min="item1.min1 ? item1.min1 : ''"
                @input="
                  (e) => {
                    updateInput1(e, index, index1, 'input')
                  }
                "
                @blur="
                  (e) => {
                    updateInput1(e, index, index1, 'blur')
                  }
                "
              />
              <div class="_tip fs-28">{{ item1.inputTip1 }}</div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'
import { onMounted, reactive } from '@vue/runtime-core'
import ImageUpload from '@/components/imageUpload1.vue'

export default defineComponent({
  components: { ImageUpload },
  props: {
    step: {
      type: Array
    },
    type: {
      type: Number,
      default: 0
    }, // 额外可以传的参数，主要用于回调等相关操作
    customStyle: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    // 点击是否选中
    const selectLeft = (index, index1, select) => {
      emit('left', {
        index,
        index1,
        select,
        type: props.type
      })
    }

    // 点击选择options选项
    const selectOption = (index, index1, index2, select) => {
      emit('option', {
        index,
        index1,
        index2,
        select,
        type: props.type
      })
    }

    // 上传图片回调
    const dealUpload = (e, index, index1) => {
      // console.log(e, index, index1);
      emit('upload', {
        e,
        index,
        index1,
        type: props.type
      })
    }

    // 删除图片回调
    const dealDelete = (pos, index, index1) => {
      // console.log(pos);
      emit('delete', {
        pos,
        index,
        index1,
        type: props.type
      })
    }

    // 这里输入框进行输入设置
    const updateInput = (e, index, index1, changeType) => {
      console.log(e, index, index1)
      emit('updateInput', {
        input: e.target.value,
        index,
        index1,
        type: props.type,
        changeType
      })
    }

    // 这里输入框进行输入设置1
    const updateInput1 = (e, index, index1, changeType) => {
      emit('updateInput1', {
        input: e.target.value,
        index,
        index1,
        type: props.type,
        changeType
      })
    }

    onMounted(() => {})
    return {
      selectLeft,
      selectOption,
      dealUpload,
      dealDelete,
      updateInput,
      updateInput1
    }
  }
})
</script>

<style lang="less" scoped>
@import '../../../../../assets/css/fit.less';

._select {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;

  ._item {
    width: 100%;

    ._title {
      margin-bottom: 30px;
      font-weight: bold;
      color: #333;
    }
    ._item1 {
      width: 100%;
      margin-bottom: 30px;

      ._select-icon {
        width: 36px;
        height: 36px;
        margin-top: 20px;
        margin-right: 15px;
      }

      ._main {
        flex: 1;
        min-height: 88px;
        padding: 20px;
        box-sizing: border-box;
        background-color: #fafafa;
        border-radius: 8px;

        ._sub-title {
          margin-top: 20px;
          margin-bottom: 10px;
          color: #666666;
          span {
            color: #ff0000;
          }
        }

        ._input {
          // flex: 1;
          width: 100% !important;
          height: 50px;
          margin-top: 10px;
          padding: 0 15px;
          box-sizing: border-box;
          background-color: #fff !important;
          border-radius: 8px;
          border: 1px solid #b3b3b3;
        }

        ._tip {
          width: 100%;
          margin-top: 20px;
          margin-bottom: 10px;
          color: #999999;
        }

        ._option-selected {
          margin-right: 15px;
          padding: 10px 15px;
          box-sizing: border-box;
          background-color: #ffe6db;
          border-radius: 8px;
          color: #ff844e;
        }

        ._option-unselected {
          margin-right: 15px;
          padding: 10px 15px;
          box-sizing: border-box;
          background-color: #efefef;
          border-radius: 8px;
          color: #b3b3b3;
        }
      }
    }
  }
}
</style>
