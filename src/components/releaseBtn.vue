<template>
    <div class="publishCircle" @click="goToPublish">
        <van-icon
            class="iconCircle"
            name="https://img.hzanchu.com/acimg/7f17ae6b5ce3b2822348154822303308.png"
        ></van-icon>
        <div class="publishText" :class="[state.ZLBFitForOld ? 'publishTextOld' : '']">发布</div>
    </div>
</template>

<script>
import { Toast } from 'vant';
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
export default {
    props: {
        url: ''
    },
    setup (props) {
        const state = reactive({
            ZLBFitForOld: localStorage.getItem('fitForOld') && localStorage.getItem('fitForOld') == 1 ? true : false,
        })
        const Router = useRouter();
        const goToPublish = () => {
            console.log(props.url, 'url')
            if (props.url) {
                Router.push(props.url);
            } else {
                Toast('即将开放，敬请期待');
            }
        }

        return {
            state,
            goToPublish
        }
    }
}
</script>

<style lang="less" scoped>
.publishCircle {
    position: fixed;
    right: 20px;
    bottom: 210px;
    width: 120px;
    height: 120px;
    background-color: #fff;
    border: 2px solid #ff844e;
    border-radius: 70px;
    box-shadow: 0px 0px 11px 0px rgba(7, 8, 7, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
    .publishText {
        height: 27px;
        font-size: 28px;
        font-weight: 500;
        text-align: center;
        color: #ff844e;
        line-height: 42px;
    }
    .iconCircle {
        font-size: 40px;
    }
    .publishTextOld {
        font-size: 40px;
    }
}
</style>