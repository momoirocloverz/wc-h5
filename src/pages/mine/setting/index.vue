<template>
    <div class="mineSettingCon">
        <cell-group>
            <!-- <cell is-link
            @click="toProtocol1">
        <template #title>
          <span class="custom-title">服务协议</span>
        </template>
      </cell>
      <cell is-link
            @click="toProtocol2">
        <template #title>
          <span class="custom-title">隐私协议</span>
        </template>
            </cell>-->
            <cell>
                <template #title>
                    <span
                        class="custom-title"
                        :class="[state.ZLBFitForOld ? 'customTitleOld' : '']"
                    >版本号</span>
                </template>
                <template #default>
                    <span
                        class="custom-title"
                        :class="[state.ZLBFitForOld ? 'customTitleOld' : '']"
                    >v1.0.0</span>
                </template>
            </cell>
        </cell-group>
        <div class="buttonCon" v-if="!state.ZLBFLAG">
            <div class="fakeBtn ableBtn" @click="exit">退出登录</div>
        </div>
    </div>
</template>
<script >
import { Cell, CellGroup, Icon, Toast } from 'vant';
import { reactive } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { isZLB } from '@/util/index'
export default {
    components: {
        Cell, CellGroup, Icon
    },
    setup () {
        const state = reactive({
            ZLBFLAG: isZLB(),
            ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
        })
        const Store = useStore()
        const Router = useRouter()
        const toProtocol1 = () => {
            Router.push({
                name: 'mineService'
            })
        }
        const toProtocol2 = () => {
            Router.push({
                name: 'minePrivacy'
            })
        }
        const exit = () => {
            localStorage.removeItem('currentUserInfo')
            localStorage.removeItem('simpleUserInfo')
            localStorage.removeItem('phone')
            localStorage.removeItem('type')
            localStorage.removeItem('needTwiceAuth')
            Store.commit('initDataAction')
            localStorage.removeItem('hasChosen')
            localStorage.removeItem('nochoiceButIcon')
            localStorage.removeItem('chossenGuy')
            Toast('退出登录成功')
            Router.replace({
                name: 'home',
            })
        }
        return {
            toProtocol1,
            toProtocol2,
            exit,
            state,
        }
    }
}
</script>
<style lang="less" scoped>
.buttonCon {
    padding-left: 100px;
    padding-right: 100px;
    box-sizing: border-box;
    margin-top: 480px;
}
.fakeBtn {
    font-size: 32px;
    height: 70px;
    border-radius: 35px;
    background-color: #d1d1d1;
    text-align: center;
    line-height: 70px;
    color: #fff;
}
.ableBtn {
    background: linear-gradient(to right, #ff844e 0%, #fe6d56 100%);
}
.mineSettingCon {
    box-sizing: border-box;
    padding-top: 12px;
    .custom-title {
        font-size: 32px;
        color: #4d4d4d;
        font-weight: 500;
    }
    .customTitleOld {
        font-size: 40px;
    }
}
</style>