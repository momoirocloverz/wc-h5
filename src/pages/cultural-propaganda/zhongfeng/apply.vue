<template>
    <div class="outer">
        <div class="type" @click="showPopup">
            <span>申报类型</span>
            <span>我是{{ typeName }}</span>
            <van-icon v-if="!route.query.id" name="arrow" />
        </div>
        <!-- 养殖大户申请 -->
        <div class="content" v-if="type === '2'">
            <div class="item">
                <span>申报单位名称</span>
                <input type="text" v-model="form.unitName" />
            </div>
            <div class="item">
                <span>社会统一信用代码</span>
                <input type="number" v-model="form.creditName" />
            </div>
            <div class="item">
                <span>法定代表人</span>
                <input type="text" v-model="form.legalName" />
            </div>
            <div class="item">
                <span>代表人电话</span>
                <input type="tel" v-model="form.legalMobile" />
            </div>
            <div class="item">
                <span>联系人</span>
                <input type="text" v-model="form.people" />
            </div>
            <div class="item">
                <span>联系人电话</span>
                <input type="tel" v-model="form.mobile" />
            </div>
            <div class="item">
                <span>基本户开户银行</span>
                <input type="text" v-model="form.bank" />
            </div>
            <div class="item">
                <span>银行账号</span>
                <input type="number" v-model="form.bankCard" />
            </div>
            <!-- <div class="item" @click="selectTown">
        <span>所属乡镇</span>
        <span>{{info.town}}</span>
        <van-icon v-if="!route.query.id" name="arrow" />
      </div>
      <div class="item" @click="selectVillage">
        <span>所属村</span>
        <span>{{info.village}}</span>
        <van-icon v-if="!route.query.id" name="arrow" />
            </div>-->
            <div class="pic">
                <p>上传蜂场照片</p>
                <div class="pic-list">
                    <div v-for="(item, index) in form.pic1" :key="item.id" class="image-box">
                        <van-icon class="delete" name="clear" @click="toDelete('1', index)" />
                        <img :src="item.url" alt />
                    </div>
                    <div class="upload-btn" v-show="form.pic1.length < 2" @click="choiceImg('1')">
                        <van-icon name="plus" />
                        <span>添加图片</span>
                    </div>
                </div>
            </div>
            <div class="pic">
                <p>上传承诺书照片</p>
                <div class="pic-list">
                    <div v-for="(item, index) in form.pic2" :key="item.id" class="image-box">
                        <van-icon class="delete" name="clear" @click="toDelete('2', index)" />
                        <img :src="item.url" alt />
                    </div>
                    <div class="upload-btn" v-show="form.pic2.length < 9" @click="choiceImg('2')">
                        <van-icon name="plus" />
                        <span>添加图片</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 村集体申请 -->
        <div class="content" v-else>
            <div class="item">
                <span>申报单位名称</span>
                <input type="text" v-model="form2.unitName" />
            </div>
            <div class="item">
                <span>社会统一信用代码</span>
                <input type="number" v-model="form2.creditName" />
            </div>
            <div class="item">
                <span>法定代表人</span>
                <input type="text" v-model="form2.legalName" />
            </div>
            <div class="item">
                <span>代表人电话</span>
                <input type="tel" v-model="form2.legalMobile" />
            </div>
            <div class="item">
                <span>联系人</span>
                <input type="text" v-model="form2.people" />
            </div>
            <div class="item">
                <span>联系人电话</span>
                <input type="tel" v-model="form2.mobile" />
            </div>
            <div class="item">
                <span>申报低收入农户户数</span>
                <input type="tel" v-model="form2.num" />
            </div>
            <div class="item">
                <span>基本户开户银行</span>
                <input type="text" v-model="form2.bank" />
            </div>
            <div class="item">
                <span>银行账号</span>
                <input type="number" v-model="form2.bankCard" />
            </div>
            <div class="item" @click="selectTown">
                <span>所属乡镇</span>
                <span>{{ info.town }}</span>
                <van-icon v-if="!route.query.id" name="arrow" />
            </div>
            <div class="item" @click="selectVillage">
                <span>所属村</span>
                <span>{{ info.village }}</span>
                <van-icon v-if="!route.query.id" name="arrow" />
            </div>
            <div class="pic">
                <p>中蜂养殖折股量化项目申报表照片</p>
                <div class="pic-list">
                    <div v-for="(item, index) in form2.pic" :key="item.id" class="image-box">
                        <van-icon class="delete" name="clear" @click="toDelete('3', index)" />
                        <img :src="item.url" alt />
                    </div>
                    <div class="upload-btn" v-show="form2.pic.length < 3" @click="choiceImg('3')">
                        <van-icon name="plus" />
                        <span>添加图片</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="button" @click="joinIn">申请</div>
        <input type="file" accept="image/*" id="upload_box" style="display:none;" @change="upload" />

        <van-popup v-model:show="state.show" round position="bottom" :style="{ height: '30%' }">
            <van-picker
                title="申报类型"
                :columns="state.columns"
                :columns-field-names="state.customFieldName"
                @confirm="onConfirm"
                @cancel="state.show = false"
                @change="onChange"
            />
        </van-popup>

        <!-- 乡镇选择 -->
        <van-popup v-model:show="townState.show" round position="bottom">
            <van-picker
                :columns="townState.columns"
                @cancel="townState.show = false"
                @confirm="onTown"
                :columns-field-names="townState.customFieldName"
            />
        </van-popup>
        <!-- 乡镇选择 -->
        <van-popup v-model:show="villageState.show" round position="bottom">
            <van-picker
                :columns="villageState.columns"
                @cancel="villageState.show = false"
                @confirm="onVillage"
                :columns-field-names="villageState.customFieldName"
            />
        </van-popup>
    </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { RadioGroup, Radio, Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import lrz from 'lrz'
import Request from '@/service/request'
import { isZLB } from '@/util/index'
export default {
    components: {
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
    },
    setup () {
        const Router = useRouter()
        const route = useRoute()
        const type = ref('1') // 1 村集体  2 养殖大户
        const typeName = ref('村集体')
        const info = reactive({
            town: '',
            townId: '',
            village: '',
            villageId: '',
        })
        const state = reactive({
            columns: [
                { name: '村集体', value: '1' },
                { name: '养殖大户', value: '2' },
            ],
            show: false,
            customFieldName: {
                text: 'name',
            },
            text: '村集体',
            value: '1',
            ZLBFLAG: isZLB(),
        })

        const form = reactive({
            unitName: '',
            creditName: '',
            legalName: '',
            legalMobile: '',
            people: '',
            mobile: '',
            bank: '',
            bankCard: '',
            pic1: [],
            pic2: [],
        })
        const form2 = reactive({
            unitName: '',
            creditName: '',
            legalName: '',
            legalMobile: '',
            people: '',
            mobile: '',
            bank: '',
            bankCard: '',
            num: '',
            pic: [],
        })
        const imageSpace = ref('')
        const townState = reactive({
            show: false,
            columns: [],
            customFieldName: {
                text: 'town_name',
            },
        })
        const villageState = reactive({
            show: false,
            columns: [],
            customFieldName: {
                text: 'village_name',
            },
        })

        onMounted(() => {
            getTownList()
            getInfo()
        })

        const getInfo = () => {

        }

        const choiceImg = (type) => {
            imageSpace.value = type
            document.getElementById('upload_box').click()
        }

        const upload = (e) => {
          
        }

        const toDelete = (type, index) => {
            if (type === '1') {
                form.pic1.splice(index, 1)
            } else if (type === '2') {
                form.pic2.splice(index, 1)
            } else {
                form2.pic.splice(index, 1)
            }
        }

        const joinIn = () => {
            let params = ''
            if (type.value === '2') {
                if (
                    !form.unitName ||
                    !form.creditName ||
                    !form.legalName ||
                    !form.legalMobile ||
                    !form.people ||
                    !form.mobile ||
                    !form.bank ||
                    !form.bankCard ||
                    !form.pic1.length ||
                    !form.pic2.length
                ) {
                    Toast('请完善信息后再提交申请')
                    return
                }
                let images1 = [],
                    images2 = []

                form.pic1.map((item) => {
                    images1.push(item.id)
                })
                console.log(images1, 'images1')
                form.pic2.map((item) => {
                    images2.push(item.id)
                })
                params = {
                    company_name: form.unitName,
                    credit_code: form.creditName,
                    legal_rep: form.legalName,
                    mobile: form.legalMobile,
                    linkman: form.people,
                    linkman_mobile: form.mobile,
                    bank_name: form.bank,
                    bank_card: form.bankCard,
                    town_id: info.townId,
                    village_id: info.villageId,
                    bee_image: images1.join(','),
                    pro_image: images2.join(','),
                    user_type: type.value,
                }
            } else {
                if (
                    !form2.unitName ||
                    !form2.creditName ||
                    !form2.legalName ||
                    !form2.legalMobile ||
                    !form2.people ||
                    !form2.mobile ||
                    !form2.bank ||
                    !form2.bankCard ||
                    !form2.num ||
                    !form2.pic.length
                ) {
                    Toast('请完善信息后再提交申请')
                    return
                }
                let images3 = []
                form2.pic.map((item) => {
                    images3.push(item.id)
                })
                params = {
                    company_name: form2.unitName,
                    credit_code: form2.creditName,
                    legal_rep: form2.legalName,
                    mobile: form2.legalMobile,
                    linkman: form2.people,
                    linkman_mobile: form2.mobile,
                    bank_name: form2.bank,
                    bank_card: form2.bankCard,
                    user_num: form2.num,
                    town_id: info.townId,
                    village_id: info.villageId,
                    apply_image: images3.join(','),
                    user_type: type.value,
                }
            }
     
        }

        const onChange = (e) => {
            console.log(e, 'e')
            state.text = e.name
            state.value = e.value
        }

        const onConfirm = () => {
            type.value = state.value
            typeName.value = state.text
            state.show = false
        }

        const showPopup = () => {
        
        }

        const getTownList = () => {
          
        }
        const onTown = (e) => {
       
        }
        const selectTown = () => {
        
        }

        const onVillage = (e) => {
           
        }
        const selectVillage = () => {
            if (route.query.id) {
                return
            } else {
                villageState.show = true
            }
        }

        const getVillageList = () => {
     
        }

        return {
            form,
            form2,
            onChange,
            joinIn,
            route,
            choiceImg,
            upload,
            toDelete,
            type,
            typeName,
            state,
            onConfirm,
            route,
            showPopup,
            onTown,
            selectTown,
            townState,
            villageState,
            onVillage,
            selectVillage,
            info,
        }
    },
}
</script>

<style lang="less" scoped>
.outer {
    min-height: 100%;
    overflow: hidden;
    padding: 0 30px 160px;
    background: #fff;
}
.content {
    overflow: hidden;
}
.type {
    height: 86px;
    display: flex;
    align-items: center;
    border-bottom: 2px solid #ebebeb;
    span {
        font-size: 28px;
        color: #333;
        width: 246px;
    }
    span:nth-of-type(2) {
        width: auto;
        margin-left: auto;
    }
    .van-icon {
        font-size: 30px;
        margin-left: 16px;
        color: #666;
    }
}
.item {
    height: 86px;
    display: flex;
    align-items: center;
    border-bottom: 2px solid #ebebeb;
    span {
        font-size: 28px;
        color: #333;
        width: 246px;
    }
    span:nth-of-type(2) {
        width: auto;
        margin-left: auto;
    }
    input {
        width: 410px;
        height: 100%;
        text-align: right;
        font-size: 28px;
        color: #333;
        margin-left: auto;
    }
    .van-icon {
        font-size: 30px;
        margin-left: 16px;
        color: #666;
    }
}
.pic {
    border-bottom: 2px solid #ebebeb;
    p {
        font-size: 28px;
        color: #333;
        margin-top: 30px;
    }
    .pic-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding-bottom: 30px;
        .image-box {
            width: 200px;
            height: 200px;
            position: relative;
            margin: 30px 20px 0 0;
            .delete {
                position: absolute;
                font-size: 36px;
                top: -18px;
                right: -18px;
                color: #ccc;
            }
            img {
                width: 100%;
                height: 100%;
            }
        }
        .upload-btn {
            width: 200px;
            height: 200px;
            box-sizing: border-box;
            border: 2px dashed #ccc;
            text-align: center;
            overflow: hidden;
            border-radius: 10px;
            margin: 30px 20px 0 0;
            .van-icon {
                font-size: 80px;
                color: #ccc;
                margin-top: 45px;
            }
            span {
                font-size: 32px;
                color: #ccc;
                margin-top: 12px;
                display: block;
            }
        }
    }
}
.pic:nth-last-child(1) {
    border: 0;
}
.button {
    position: fixed;
    width: 550px;
    height: 70px;
    background: linear-gradient(#ff844e 0%, #fe6d56 100%);
    border-radius: 35px;
    font-size: 32px;
    color: #fff;
    text-align: center;
    line-height: 70px;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
}
</style>
