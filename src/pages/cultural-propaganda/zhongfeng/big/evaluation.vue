<!-- 资格自评 -->
<template>
  <div class="evaluation">
    <BeeProgress activeStep="2" :textList="['基础资料', '资格自评']"></BeeProgress>

    <choose-progress :list="progressList" :current="current" @changeNum="changeNum"></choose-progress>

    <!-- 还未开始步骤 -->
    <template v-if="current == 0">
      <title-bar title="评定规则"></title-bar>
      <div class="start fs-28">
        以 <span>60分</span>为帮扶资质认定分，以五星为标准评定：<br />
        60-80分：三星<br />
        80-90分：四星<br />
        > 90分： 五星<br /><br />
        星级越高帮扶核定箱数越多，星级评定一年一次。核定的蜂箱以上年度的养殖蜂箱为准，五星核准帮扶箱数为该养殖户上年度养殖箱数的<span>80%</span>；四星核准帮扶箱数为该养殖户上年度养殖箱数的<span>70%</span>；三星核准帮扶箱数为该养殖户上年度养殖箱数的<span>50%</span>。<br /><br />
        (2021年度养殖蜂箱数参考种畜禽普查数据)<br /><br />
        注：不得发生农产品质量安全、蜂蜜抽检不合格事件，发生一起将取消其来年帮扶资格。<br />
      </div>
    </template>

    <!--这里是公共的头部 -->
    <div v-if="current > 0" class="big-title">
      <div class="title fs-36">{{ getBigTitle }}</div>
      <div v-if="getTitle" class="flex-row align-items-center justify-content-between">
        <div class="sub-title fs-32">{{ getTitle }}</div>
        <div class="point fs-28">自评分数：{{ getPoint }}分</div>
      </div>
    </div>

    <step-select
      v-if="current > 0"
      ref="stepSelectRef"
      :step="getStep"
      :type="current"
      @left="dealLeft"
      @option="dealOption"
      @upload="dealUpload"
      @delete="imgDelete"
      @updateInput="updateInput"
      @updateInput1="updateInput1"
    ></step-select>

    <div class="bottom">
      <div v-if="current == 0" class="flex-row align-items-center justify-content-center">
        <div class="btn1 common-btn-plain" @click="goBack">上一步</div>
        <div class="btn2 common-btn" @click="current = 1">开始填写</div>
      </div>

      <div v-if="current > 0 && current < 9" class="flex-row align-items-center justify-content-center">
        <div class="btn1 common-btn-plain" @click="goBack">上一步</div>
        <div class="btn2 common-btn" @click="goNext">下一步</div>
      </div>

      <div v-if="current == 9" class="flex-row align-items-center justify-content-center">
        <div class="btn1 common-btn-plain" @click="goBack">上一步</div>
        <div class="btn2 common-btn" @click="submit(getAllPoint)">立即提交({{ getAllPoint }}分)</div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { RadioGroup, Radio, Toast, Picker, Popup, Dialog } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import BeeProgress from '@/components/beeProgress'

import TitleBar from '@/components/titleBar.vue'
import StepSelect from './components/stepSelect.vue'
import ChooseProgress from '@/components/chooseProgress.vue'
import Request from '@/service/request'
export default {
  components: {
    BeeProgress,

    TitleBar,
    StepSelect,
    ChooseProgress
  },
  computed: {
    getBigTitle: function () {
      let title = '基础分项'
      switch (this.current) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
          break
        case 7:
        case 8:
          title = '加分项'
          break
        case 9:
          title = '减分项'
          break
        default:
          break
      }
      return title
    },
    getTitle: function () {
      let title = ''
      switch (this.current) {
        case 1:
          title = '一、企业建设（20分）'
          break
        case 2:
          title = '二、养殖规模和年限（20分）'
          break
        case 3:
          title = '三、品牌和蜂蜜销量（20分）'
          break
        case 4:
          title = '四、扶贫帮扶经历（10分）'
          break
        case 5:
          title = '五、养殖台账和健康证（15分）'
          break
        case 6:
          title = '六、养殖保险（15分）'
          break
        case 7:
          title = '一、雇佣低收入农户（10分）'
          break
        case 8:
          title = '二、增加低收入农户收益（10分）'
          break
        default:
          break
      }
      return title
    },
    // 获取当前current下的所选择的分数
    getPoint: function () {
      let point = 0
      switch (this.current) {
        case 1:
          point = this.step1[0].point
          break
        case 2:
          point = this.step2[0].point + this.step2[1].point
          break
        case 3:
          point = this.step3[0].point + this.step3[1].point
          break
        case 4:
          point = this.step4[0].point
          break
        case 5:
          point = this.step5[0].point + this.step5[1].point
          break
        case 6:
          point = this.step6[0].point
          break
        case 7:
          point = this.step7[0].point
          break
        case 8:
          point = this.step8[0].point
          break
        default:
          break
      }
      return point
    },
    // 获取当前step步骤的展示数据
    getStep: function () {
      let step = []
      switch (this.current) {
        case 1:
          step = this.step1
          break
        case 2:
          step = this.step2
          break
        case 3:
          step = this.step3
          break
        case 4:
          step = this.step4
          break
        case 5:
          step = this.step5
          break
        case 6:
          step = this.step6
          break
        case 7:
          step = this.step7
          break
        case 8:
          step = this.step8
          break
        case 9:
          step = this.step9
          break
        default:
          break
      }
      return step
    },
    // 获取当前总分数
    getAllPoint: function () {
      let point = 0
      // 下面的总分先这么计算着
      point =
        this.step1[0].point +
        this.step2[0].point +
        this.step2[1].point +
        this.step3[0].point +
        this.step3[1].point +
        this.step4[0].point +
        this.step5[0].point +
        this.step5[1].point +
        this.step6[0].point +
        this.step7[0].point +
        this.step8[0].point -
        this.step9[0].point -
        this.step9[1].point
      return point
    }
  },
  setup() {
    const stepSelectRef = ref(null)
    const Router = useRouter()
    const Route = useRoute()
    const submitData = ref({})
    const current = ref(0) // 当前步骤，默认为0，0表示展示评定规则
    const lastCurrent = ref(0) // 上一个数值，主要用于更新顶部步骤finish更新
    const progressList = ref([
      { num: 1, finish: false },
      { num: 2, finish: false },
      { num: 3, finish: false },
      { num: 4, finish: false },
      { num: 5, finish: false },
      { num: 6, finish: false },
      { num: 7, finish: false },
      { num: 8, finish: false },
      { num: 9, finish: false }
    ])
    // 这里点击切换顶部的数字按钮
    const changeNum = (num) => {
      updateCurrent(parseInt(num))
    }

    const step1 = ref([
      {
        title: '1、合作社（家庭农场）、企业资格（20分）',
        multiple: true, // 是否多选
        point: 0, // 当前选择的分数
        sub: [
          {
            title: '取得县级龙头合作社（家庭农场）、企业资格（2分）',
            uploadText: '上传证书',
            upload: [], // 当前上传图片的列表
            point: 2,
            select: false // 如果存在多选，那么这里可以选择多项，如果不多选，那么这里只有一项
          },
          {
            title: '加入998质量安全联盟实施主体（2分）',
            uploadText: '上传证书',
            upload: [], // 当前上传图片的列表
            point: 2,
            select: false
          },
          {
            title: '取得省级龙头合作社（家庭农场、企业资格）（5分）',
            uploadText: '上传证书',
            upload: [], // 当前上传图片的列表
            point: 5,
            select: false
          },
          {
            title: '取得市级龙头合作社（家庭农场、企业资格）（8分）',
            uploadText: '上传证书',
            upload: [], // 当前上传图片的列表
            point: 8,
            select: false
          },
          {
            title: '荣誉证书',
            uploadText: '上传证书',
            upload: [], // 当前上传图片的列表
            point: 0,
            option: [
              { title: '县级（1分）', point: 1, select: false },
              { title: '市级（2分）', point: 2, select: false },
              { title: '省级（3分）', point: 3, select: false }
            ],
            optionText: '最高荣誉证书：',
            select: false
          }
        ]
      }
    ])
    const step2 = ref([
      {
        title: '1、养殖规模（10分）',
        multiple: false, // 是否多选
        point: 0, // 当前选择的分数
        sub: [
          {
            title: '100-199箱（2分）',
            point: 2,
            select: false,
            input: '',
            min: 100,
            max: 199,

            inputText: '具体箱数（箱）：',
            inputType: 'number'
          },
          {
            title: '200-299箱（4分）',
            point: 4,
            select: false,
            input: '',
            min: 200,
            max: 299,

            inputText: '具体箱数（箱）：',
            inputType: 'number'
          },
          {
            title: '300-399箱（6分）',
            point: 6,
            select: false,
            input: '',
            min: 300,
            max: 399,
            inputText: '具体箱数（箱）：',
            inputType: 'number'
          },
          {
            title: '400-499箱（8分）',
            point: 8,
            select: false,
            input: '',
            min: 400,
            max: 499,
            inputText: '具体箱数（箱）：',
            inputType: 'number'
          },
          {
            title: '1000箱及以上（10分）',
            point: 10,
            select: false,
            min: 1000,
            input: '',
            inputText: '具体箱数（箱）：',
            inputType: 'number'
          }
        ]
      },
      {
        title: '2、养殖年份（10分）',
        multiple: false, // 是否多选
        point: 0, // 当前选择的分数
        sub: [
          {
            title: '2年（2分）',
            point: 2,
            select: false,
            uploadText: '营业执照',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '2-3年（4分）',
            point: 4,
            select: false,
            uploadText: '营业执照',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '3-4年（6分）',
            point: 6,
            select: false,
            uploadText: '营业执照',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '4-5年（8分）',
            point: 8,
            select: false,
            uploadText: '营业执照',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '5年以上（10分）',
            point: 10,
            select: false,
            uploadText: '营业执照',
            upload: [] // 当前上传图片的列表
          }
        ]
      }
    ])
    const step3 = ref([
      {
        title: '1、品牌或商标（10分）',
        multiple: false, // 是否多选
        point: 0, // 当前选择的分数
        sub: [
          {
            title: '无（0分）',
            point: 0,
            select: false
          },
          {
            title: '有品牌或商标（5分）',
            point: 5,
            select: false,
            uploadText: '资格文件或证书上传',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '有商标且获得国家级/省级商标品牌基地（单位）称号（10分）',
            point: 10,
            select: false,
            uploadText: '资格文件或证书上传',
            upload: [] // 当前上传图片的列表
          }
        ]
      },
      {
        title: '2、蜂蜜销量（10分）',
        multiple: false, // 是否多选
        point: 0, // 当前选择的分数
        sub: [
          {
            title: '10万元以下（0分）',
            point: 0,
            select: false
            // uploadText: "企业年报/报销凭证",
            // upload: [], // 当前上传图片的列表
          },
          {
            title: '10-19万（1分）',
            point: 1,
            select: false,
            uploadText: '企业年报/报销凭证',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '20-29万（2分）',
            point: 2,
            select: false,
            uploadText: '企业年报/报销凭证',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '30-39万（3分）',
            point: 3,
            select: false,
            uploadText: '企业年报/报销凭证',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '40-49万（4分）',
            point: 4,
            select: false,
            uploadText: '企业年报/报销凭证',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '50-59万（5分）',
            point: 5,
            select: false,
            uploadText: '企业年报/报销凭证',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '60-69万（6分）',
            point: 6,
            select: false,
            uploadText: '企业年报/报销凭证',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '70-79万（7分）',
            point: 7,
            select: false,
            uploadText: '企业年报/报销凭证',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '80-89万（8分）',
            point: 8,
            select: false,
            uploadText: '企业年报/报销凭证',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '90-99万（9分）',
            point: 9,
            select: false,
            uploadText: '企业年报/报销凭证',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '100万以上（10分）',
            point: 10,
            select: false,
            uploadText: '企业年报/报销凭证',
            upload: [] // 当前上传图片的列表
          }
        ]
      }
    ])
    const step4 = ref([
      {
        title: '1、扶贫帮扶经历（10分）',
        multiple: false, // 是否多选
        point: 0, // 当前选择的分数
        sub: [
          {
            title: '1年以下（0分）',
            point: 0,
            select: false
          },
          {
            title: '1年-2年（2分）',
            point: 2,
            select: false,
            uploadText: '历年帮扶台账',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '2年-3年（4分）',
            point: 4,
            select: false,
            uploadText: '历年帮扶台账',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '3年-4年（6分）',
            point: 6,
            select: false,
            uploadText: '历年帮扶台账',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '4年-5年（8分）',
            point: 8,
            select: false,
            uploadText: '历年帮扶台账',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '5年以上（10分）',
            point: 10,
            select: false,
            uploadText: '历年帮扶台账',
            upload: [] // 当前上传图片的列表
          }
        ]
      }
    ])
    const step5 = ref([
      {
        title: '1、规范填写养殖台账（10分）',
        multiple: false, // 是否多选
        point: 0, // 当前选择的分数
        sub: [
          {
            title: '无（0分）',
            point: 0,
            select: false
          },
          {
            title: '有（10分）',
            point: 10,
            select: false,
            uploadText: '养殖台账',
            upload: [] // 当前上传图片的列表
          }
        ]
      },
      {
        title: '2、健康证（5分）',
        multiple: false, // 是否多选
        point: 0, // 当前选择的分数
        sub: [
          {
            title: '无（0分）',
            point: 0,
            select: false
          },
          {
            title: '有（5分）',
            point: 5,
            select: false,
            uploadText: '上传健康证',
            upload: [] // 当前上传图片的列表
          }
        ]
      }
    ])
    const step6 = ref([
      {
        title: '1、参加中蜂政策性养殖保险（15分）',
        multiple: false, // 是否多选
        point: 0, // 当前选择的分数
        sub: [
          {
            title: '否（0分）',
            point: 0,
            select: false
          },
          {
            title: '是（15分）',
            point: 15,
            select: false,
            uploadText: '上传保险证明',
            upload: [] // 当前上传图片的列表
          }
        ]
      }
    ])
    const step7 = ref([
      {
        title: '1、雇佣低收入农户参与中蜂养殖（10分）',
        multiple: false, // 是否多选
        point: 0, // 当前选择的分数
        sub: [
          {
            title: '无（0分）',
            point: 0,
            select: false
          },
          {
            title: '<2000/年（1分）',
            point: 1,
            select: false,
            uploadText: '上传工资发放名册和工作照片',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '2000<=工资<3000/年（2分）',
            point: 2,
            select: false,
            uploadText: '上传工资发放名册和工作照片',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '3000<=工资<4000/年（3分）',
            point: 3,
            select: false,
            uploadText: '上传工资发放名册和工作照片',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '4000<=工资<5000/年（4分）',
            point: 4,
            select: false,
            uploadText: '上传工资发放名册和工作照片',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '5000<=工资<6000/年（5分）',
            point: 5,
            select: false,
            uploadText: '上传工资发放名册和工作照片',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '6000<=工资<7000/年（6分）',
            point: 6,
            select: false,
            uploadText: '上传工资发放名册和工作照片',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '7000<=工资<8000/年（7分）',
            point: 7,
            select: false,
            uploadText: '上传工资发放名册和工作照片',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '8000<=工资<9000/年（8分）',
            point: 8,
            select: false,
            uploadText: '上传工资发放名册和工作照片',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '9000<=工资<10000/年（9分）',
            point: 9,
            select: false,
            uploadText: '上传工资发放名册和工作照片',
            upload: [] // 当前上传图片的列表
          },
          {
            title: '>=10000/年（10分）',
            point: 10,
            select: false,
            uploadText: '上传工资发放名册和工作照片',
            upload: [] // 当前上传图片的列表
          }
        ]
      }
    ])
    const step8 = ref([
      {
        title: '1、低收入农户和村集体保底收益（10分）',
        multiple: false, // 是否多选
        point: 0, // 当前选择的分数
        closeSelect: true, // 当前类目下是否可选，true表示不可选
        sub: [
          {
            title: '',
            point: 0,
            select: true,
            uploadText: '上传台账收益',
            upload: [], // 当前上传图片的列表
            inputText: '保底收益（元）',
            inputType: 'number',
            input: '',
            inputText1: '请输入分数（分）',
            input1: '',
            inputType1: 'number',
            inputTip1: '在政府指导收益基础上，每增加1%加1分，以此类推封顶10分。'
          }
        ]
      }
    ])
    const step9 = ref([
      {
        title: '1、未实时在APP上更新养殖信息（6分）',
        multiple: false, // 是否多选
        point: 0, // 当前选择的分数
        closeSelect: true, // 当前类目下是否可选，true表示不可选
        sub: [
          {
            title: '',
            point: -1,
            select: true,
            inputText: '请输入分数（分）',
            inputType: 'number',
            input: '',
            inputTip: '1年<3次/户,按结对户数更新养殖信息总量计算每下降10%扣2分(6分)，未及时将蜂蜜收益支付给低收入农户(4分)'
          }
        ]
      },
      {
        title: '2、未及时将蜂蜜收益支付给低收入农户（4分）',
        multiple: false, // 是否多选
        point: 0, // 当前选择的分数
        closeSelect: true, // 当前类目下是否可选，true表示不可选
        sub: [
          {
            title: '',
            point: -1,
            select: true,
            inputText: '请输入分数（分）',
            inputType: 'number',
            input: ''
          }
        ]
      }
    ])

    // 点击左边的按钮进行选择
    const dealLeft = (e) => {
      // console.log(e);
      let item = getItem(e.type, e.index)
      if (e.select) {
        // 已经选中状态，如果是取消选中状态
        item.sub[e.index1].select = false
        item.point = parseInt(item.point) - parseInt(item.sub[e.index1].point)
      } else {
        if (item.multiple) {
          // 如果可以多选
          item.sub[e.index1].select = true
          item.point = parseInt(item.point) + parseInt(item.sub[e.index1].point)
        } else {
          // 如果只是单选
          for (let item1 of item.sub) {
            item1.select = false
          }
          item.sub[e.index1].select = true
          item.point = parseInt(item.sub[e.index1].point)
        }
      }
    }

    // 这里处理下面子项选择操作
    const dealOption = (e) => {
      // console.log(e);
      let item = getItem(e.type, e.index)
      let item1 = getItemSub(e.type, e.index, e.index1) // 子选项item

      if (e.select) {
        // 已经选中状态，如果是取消选中状态
        item1.option[e.index2].select = false
        item1.point = parseInt(item1.point) - parseInt(item1.option[e.index2].point)
        item.point = parseInt(item.point) - parseInt(item1.option[e.index2].point)
      } else {
        if (item1.multiple) {
          // 如果可以多选，
          item1.option[e.index2].select = true
          item1.point = parseInt(item1.point) + parseInt(item1.option[e.index2].point)
          item.point = parseInt(item.point) + parseInt(item1.option[e.index2].point)
        } else {
          // 如果只是单选
          item.point = parseInt(item.point) - parseInt(item1.point) // 先把目前的分数减去
          for (let item2 of item1.option) {
            item2.select = false
          }
          item1.option[e.index2].select = true
          item1.point = parseInt(item1.option[e.index2].point)
          item.point = parseInt(item.point) + parseInt(item1.option[e.index2].point)
        }
      }
    }

    // 这里处理图片上传操作
    const dealUpload = (e) => {
      // console.log(e);
      let item = getItem(e.type, e.index)
      item.sub[e.index1].upload.push(e.e)
    }

    // 这里处理图片的删除操作
    const imgDelete = (e) => {
      let item = getItem(e.type, e.index)
      // console.log(JSON.stringify(item.sub[e.index1].upload))
      item.sub[e.index1].upload.splice(e.pos, 1)
      console.log(item.sub[e.index1].upload)
    }

    // 这里处理输入框输入
    const updateInput = (e) => {
      let item = getItem(e.type, e.index)
      let item1 = getItemSub(e.type, e.index, e.index1)
      item.sub[e.index1].input = e.input
      // 这里单独处理一下 如果type为9 的情况下，input需要单独，主要控制最大的分数
      if (e.type == 9) {
        let max = e.index == 0 ? 6 : 4
        if (e.input == '' || parseInt(e.input) <= 0) {
          item.point = 0
          item.sub[e.index1].input = 0
        } else if (parseInt(e.input) > max) {
          item.point = max
          item.sub[e.index1].input = max
        } else {
          item.point = parseInt(e.input)
          item.sub[e.index1].input = parseInt(e.input)
        }
      } else if (e.type == 2 && e.changeType == 'blur') {
        let max = item1.max
        let min = item1.min
        console.log(max, min)
        if (e.input == '' || parseInt(e.input) <= min) {
          item.sub[e.index1].input = min
        } else if (parseInt(e.input) > max) {
          item.sub[e.index1].input = max
        } else {
          item.sub[e.index1].input = parseInt(e.input)
        }
      }
    }

    // 这里处理输入框输入1
    const updateInput1 = (e) => {
      let item = getItem(e.type, e.index)
      item.sub[e.index1].input1 = e.input
      // 这里单独处理一下 如果type为8 的情况下，input1需要单独，主要控制最大打分分数
      if (e.type == 8) {
        // console.log(e.input);
        if (e.input == '' || parseInt(e.input) <= 0) {
          item.point = 0
          item.sub[e.index1].input1 = 0
        } else if (parseInt(e.input) > 10) {
          item.point = 10
          item.sub[e.index1].input1 = 10
        } else {
          item.point = parseInt(e.input)
          item.sub[e.index1].input1 = parseInt(e.input)
        }
      }
    }

    // 统一获取item对象
    const getItem = (type, index) => {
      let item = {}
      if (type == 1) {
        item = step1.value[index]
      } else if (type == 2) {
        item = step2.value[index]
      } else if (type == 3) {
        item = step3.value[index]
      } else if (type == 4) {
        item = step4.value[index]
      } else if (type == 5) {
        item = step5.value[index]
      } else if (type == 6) {
        item = step6.value[index]
      } else if (type == 7) {
        item = step7.value[index]
      } else if (type == 8) {
        item = step8.value[index]
      } else if (type == 9) {
        item = step9.value[index]
      }
      return item
    }
    // 统一获取item-sub对象
    const getItemSub = (type, index, index1) => {
      let item1 = {}
      if (type == 1) {
        item1 = step1.value[index].sub[index1]
      } else if (type == 2) {
        item1 = step2.value[index].sub[index1]
      } else if (type == 3) {
        item1 = step3.value[index].sub[index1]
      } else if (type == 4) {
        item1 = step4.value[index].sub[index1]
      } else if (type == 5) {
        item1 = step5.value[index].sub[index1]
      } else if (type == 6) {
        item1 = step6.value[index].sub[index1]
      } else if (type == 7) {
        item1 = step7.value[index].sub[index1]
      } else if (type == 8) {
        item1 = step8.value[index].sub[index1]
      } else if (type == 9) {
        item1 = step9.value[index].sub[index1]
      }
      return item1
    }

    // 更新当前current位置
    const updateCurrent = (cur) => {
      // console.log(cur);
      lastCurrent.value = current.value
      current.value = cur
      checkFinish()
    }

    // 返回
    const goBack = () => {
      if (current.value > 0) {
        updateCurrent(current.value - 1)
      } else {
        Router.go(-1)
      }
    }
    const goNext = () => {
      if (current.value < 9) {
        updateCurrent(current.value + 1)
      } else {
        // console.log(current.value);
        // 这里就执行提交操作
        Router.push({
          name: 'cultural-propaganda/zhongfeng/big/result'
        })
      }
    }

    // 统一检查当前是否已经完成资料上传
    const checkFinish = () => {
      // console.log("checkFinish", lastCurrent.value);
      let step = []
      if (lastCurrent.value <= 0) {
        return
      }
      if (lastCurrent.value == 1) {
        step = step1.value
      } else if (lastCurrent.value == 2) {
        step = step2.value
      } else if (lastCurrent.value == 3) {
        step = step3.value
      } else if (lastCurrent.value == 4) {
        step = step4.value
      } else if (lastCurrent.value == 5) {
        step = step5.value
      } else if (lastCurrent.value == 6) {
        step = step6.value
      } else if (lastCurrent.value == 7) {
        step = step7.value
      } else if (lastCurrent.value == 8) {
        step = step8.value
      } else if (lastCurrent.value == 9) {
        step = step9.value
      }
      // console.log(step);
      let status = 0 // 状态，主要判断用户是否已经上传完毕材料

      for (let index in step) {
        // console.log(index);
        // 主要循环当前sub配置项，判断是否已经在选中的情况下，材料是否上传、填写、选择完整
        for (let item1 of step[index].sub) {
          // console.log(item1);
          // 判断材料是否上传、填写
          if (item1.select) {
            if (item1.inputText) {
              if (item1.input != '' || parseInt(item1.input) >= 0) {
                status = 1
              } else {
                status = 0
                break
              }
            }
            if (item1.inputText1) {
              if (item1.input1 != '' || parseInt(item1.input1) >= 0) {
                status = 1
              } else {
                status = 0
                break
              }
            }
            if (item1.uploadText) {
              if (item1.upload.length > 0) {
                status = 1
              } else {
                status = 0
                break
              }
            }
            if (item1.optionText) {
              // 判断材料是否选择完整
              let select = false
              for (let item2 of item1.option) {
                if (item2.select) {
                  select = true
                  break
                }
              }
              if (select) {
                status = 1
              } else {
                status = 0
                break
              }
            }
            // 如果选中了，但是对应的分数是0分，也需要标记为已填写
            if (item1.point == 0) {
              status = 1
            }
          }
        }
        // 如果满足item.sub中有一项 status == 0，那么直接break即可
        if (status == 0) {
          break
        } else if (index < step.length - 1) {
          // 如果能继续循环，那么说明，当前循环的前面一项为为选中通过，那么status需要重置为0。进行下一项的验证
          status = 0
        }
      }

      // console.log(status);

      // 如果最终结果status == 1，那么表示当前选择的情况下，已经完成了材料的上传、输入、选择等操作
      if (status == 1) {
        progressList.value[lastCurrent.value - 1].finish = true
      } else {
        progressList.value[lastCurrent.value - 1].finish = false
      }
    }

    // 立即提交分数
    const submit = (point) => {
      // 如果是点击了最后一步，那么肯定需要检查step9，所以这里的 lastCurrent = current = 9
      lastCurrent.value = current.value
      checkFinish()
      let isFinish = false
      setTimeout(() => {
        for (let item of progressList.value) {
          if (!item.finish) {
            isFinish = false
            break
          } else {
            isFinish = true
          }
        }
        if (isFinish) {
          Dialog.confirm({
            title: '是否确认提交？',
            message: '请确认信息是否填写正确，提交成功后，审核完成后才可修改！',
            showCancelButton: true,
            confirmButtonText: '立即提交',
            confirmButtonColor: '#FF844E'
          })
            .then(() => {
              update(point)
            })
            .catch(() => {})
        } else {
          Toast('请先完成每步的信息')
        }
      }, 250)
    }

    // 提交信息
    const update = (point) => {
      // console.log(point);
      try {
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
          loadingType: 'spinner',
          duration: 0
        })
        let step = {
          step1: dealImgId(JSON.parse(JSON.stringify(step1.value))),
          step2: dealImgId(JSON.parse(JSON.stringify(step2.value))),
          step3: dealImgId(JSON.parse(JSON.stringify(step3.value))),
          step4: dealImgId(JSON.parse(JSON.stringify(step4.value))),
          step5: dealImgId(JSON.parse(JSON.stringify(step5.value))),
          step6: dealImgId(JSON.parse(JSON.stringify(step6.value))),
          step7: dealImgId(JSON.parse(JSON.stringify(step7.value))),
          step8: dealImgId(JSON.parse(JSON.stringify(step8.value))),
          step9: dealImgId(JSON.parse(JSON.stringify(step9.value)))
        }

        let eva_info = JSON.stringify(step)
        eva_info = eva_info.replaceAll('"', "'")

        if (Route.query.edit) {
          Request.beeMajorEdit({
            ...submitData.value,
            evaluation: point,
            eva_info
          })
            .then((res) => {
              if (res && res.code == 0) {
                Toast('修改成功！')
                // removeItem();
                Router.go(-3) // 暂定-3
              } else {
                Toast(res.msg)
              }
            })
            .catch((err) => {
              console.log('err', err)
              Toast.clear()
              Dialog.confirm({
                confirmButtonText: '确定',
                message: JSON.stringify(err)
              }).then(() => {})
            })
        } else {
          Request.majorApply({
            ...submitData.value,
            evaluation: point,
            eva_info
          })
            .then((res) => {
              if (res && res.code == 0) {
                Toast('申请成功！')
                // removeItem();
                Router.go(-3)
              } else {
                Toast(res.msg)
              }
            })
            .catch((err) => {
              console.log('err', err)
              Toast.clear()
              Dialog.confirm({
                confirmButtonText: '确定',
                message: JSON.stringify(err)
              }).then(() => {})
            })
        }
      } catch (err) {
        Toast.clear()
        Dialog.confirm({
          confirmButtonText: '确定',
          message: JSON.stringify(err)
        }).then(() => {})
      }
    }

    // 处理图片只存id
    const dealImgId = (list) => {
      for (let item of list) {
        let sub = item.sub
        for (let item1 of sub) {
          if (item1.uploadText && item1.upload.length > 0) {
            let new_upload = []
            for (let item2 of item1.upload) {
              new_upload.push({ id: item2.id })
            }
            item1.upload = new_upload
          }
        }
      }
      return list
    }

    // 初始化信息
    const init = () => {
      Request.majorInfo({})
        .then((res) => {
          if (res && res.code == 0) {
            let data = res.data
            console.log(data)
            // let step = JSON.parse(data.eva_info)
            let step = data.eva_info
            step1.value = step.step1
            step2.value = step.step2
            step3.value = step.step3
            step4.value = step.step4
            step5.value = step.step5
            step6.value = step.step6
            step7.value = step.step7
            step8.value = step.step8
            step9.value = step.step9
          } else {
            Toast(res.msg)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }

    onMounted(() => {
      submitData.value = JSON.parse(sessionStorage.getItem('bigFarmerApplySubmitData'))
      if (Route.query&&Route.query.edit == 1) {
        init()
      } else {
        if (sessionStorage.getItem('eva_info')) {
          let step = JSON.parse(sessionStorage.getItem('eva_info'))
          step1.value = step.step1
          step2.value = step.step2
          step3.value = step.step3
          step4.value = step.step4
          step5.value = step.step5
          step6.value = step.step6
          step7.value = step.step7
          step8.value = step.step8
          step9.value = step.step9
        }
      }

      // console.log(submitData.value);
    })

    onUnmounted(() => {
      let step = {
        step1: step1.value,
        step2: step2.value,
        step3: step3.value,
        step4: step4.value,
        step5: step5.value,
        step6: step6.value,
        step7: step7.value,
        step8: step8.value,
        step9: step9.value
      }
      let eva_info = JSON.stringify(step)
      sessionStorage.setItem('eva_info', eva_info)
    })

    return {
      stepSelectRef,
      goBack,
      goNext,
      current,
      Route,
      step1,
      step2,
      step3,
      step4,
      step5,
      step6,
      step7,
      step8,
      step9,
      submit,

      checkFinish,

      dealLeft,
      dealOption,
      dealUpload,
      imgDelete,
      changeNum,
      updateInput,
      updateInput1,

      progressList
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../assets/css/fit.less';
.evaluation {
  width: 100%;
}

.start {
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;

  span {
    color: var(--custom_color);
  }
}

.big-title {
  width: 100%;
  margin-top: 30px;
  padding: 30px;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom: 2px solid #ebebeb;

  .title {
    margin-bottom: 30px;
    text-align: center;
    font-weight: bold;
  }

  .sub-title {
    font-weight: bold;
  }

  .point {
    color: #999;
  }
}

.bottom {
  // position: fixed;
  // bottom: 0px;
  width: 100%;
  margin-top: 30px;
  margin-bottom: 30px;
  margin-bottom: calc(30px + constant(safe-area-inset-bottom));
  margin-bottom: calc(30px + env(safe-area-inset-bottom));
  // padding: 30px 60px;
  // padding-bottom: calc(30px + constant(safe-area-inset-bottom));
  // padding-bottom: calc(30px + env(safe-area-inset-bottom));
  // box-sizing: border-box;
  // background-color: #fff;
  .btn1 {
    width: 290px;
  }
  .btn2 {
    width: 290px;
    margin-left: 70px;
  }
}

.placeholder {
  width: 100%;
  height: 300px;
}
</style>
