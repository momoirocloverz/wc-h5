import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { isZLB } from '../util/index.js'
const empty = () => import('@/components/empty')

const routes = [
  {
    path: '/',
    redirect: {
      //   name: 'home',
      name: isZLB() ? 'blank' : 'home'
    }
  },
  {
    path: '/blank',
    name: 'blank',
    component: () => import('../pages/blank'),
    meta: {
      title: '共富帮'
    }
  },
  {
    path: '/',
    name: 'Home',
    redirect: 'home',
    component: () => import('../pages/Home'),
    meta: {
      title: '共富帮'
    },
    children: [
      // 首页
      {
        path: 'home',
        name: 'home',

        component: () => import('../pages/submitCode'),
        meta: {
          title: '共富帮'
        }
      },
      {
        path: 'information',
        name: 'Information',
        component: () => import('../pages/information/index'),
        meta: {
          title: '信息动态'
        }
      },
      {
        path: 'mine',
        name: 'mine',
        component: () => import('../pages/mine/index'),
        meta: {
          title: '我的'
        }
      }
    ]
  },
  {
    path: '/tablist',
    name: 'TabList',
    component: () => import('../pages/tabList'),
    meta: {
      title: '结对帮扶'
    }
  },
  {
    path: '/mine/setting',
    name: 'mineSetting',
    component: () => import('@/pages/mine/setting/index'),
    meta: {
      title: '设置'
    }
  },
  {
    path: '/mine/avatar',
    name: 'mineAvatar',
    component: () => import('@/pages/mine/avatar/index'),
    meta: {
      title: '个人中心'
    }
  },
  {
    path: '/mine/editAvatar',
    name: 'editAvatar',
    component: () => import('@/pages/mine/avatar/editAvatar'),
    meta: {
      title: '修改头像'
    }
  },
  {
    path: '/mine/editName',
    name: 'editName',
    component: () => import('@/pages/mine/avatar/editName'),
    meta: {
      title: '修改名字'
    }
  },
  {
    path: '/mine/agriculture',
    name: 'mineAgriculture',
    component: () => import('@/pages/mine/agriculture/index'),
    meta: {
      title: '我的买卖'
    }
  },
  {
    path: '/mine/job',
    name: 'mineJob',
    component: () => import('@/pages/mine/job/index'),
    meta: {
      title: '我的劳务'
    }
  },
  {
    path: '/mine/asset',
    name: 'mineAsset',
    component: () => import('@/pages/mine/asset/index'),
    meta: {
      title: '我的资产'
    }
  },
  {
    path: '/protocol/privacy',
    name: 'minePrivacy',
    component: () => import('@/pages/mine/protocol/privacy'),
    meta: {
      title: '隐私协议'
    }
  },
  {
    path: '/protocol/service',
    name: 'mineService',
    component: () => import('@/pages/mine/protocol/service'),
    meta: {
      title: '服务协议'
    }
  },
  {
    path: '/mine/preOrder',
    name: 'minePre',
    component: () => import('@/pages/mine/preOrder/index'),
    meta: {
      title: '我的预约'
    }
  },
  {
    path: '/mine/subscribe',
    name: 'mineSubscribe',
    component: () => import('@/pages/mine/subscribe/index'),
    meta: {
      title: '我的认种'
    }
  },
  {
    path: '/agriculture',
    component: () => import('@/pages/publish/index'),
    children: [
      {
        path: '',
        name: 'agriculture',
        component: () => import('@/pages/publish/agriculture/verify'),
        meta: {
          title: '个人信息'
        }
      },
      {
        path: '/agriculture/list',
        name: 'agricultureList',
        component: () => import('@/pages/publish/agriculture/list'),
        meta: {
          title: '我要买卖'
        }
      },
      {
        path: '/agriculture/publish',
        name: 'agriculturePublish',
        component: () => import('@/pages/publish/agriculture/publish'),
        meta: {
          title: '发布'
        }
      },
      {
        path: '/agriculture/detail',
        name: 'agricultureDetail',
        component: () => import('@/pages/publish/agriculture/detail'),
        meta: {
          title: '详情'
        }
      }
    ]
  },
  {
    path: '/job',
    component: () => import('@/pages/publish/index'),
    children: [
      {
        path: '',
        name: 'job',
        component: () => import('@/pages/publish/job/verify'),
        meta: {
          title: '个人信息'
        }
      },
      {
        path: '/job/list',
        name: 'jobList',
        component: () => import('@/pages/publish/job/list'),
        meta: {
          title: '劳务大厅'
        }
      },
      {
        path: '/job/publish',
        name: 'jobPublish',
        component: () => import('@/pages/publish/job/publish'),
        meta: {
          title: '发布'
        }
      },
      {
        path: '/job/detail',
        name: 'jobDetail',
        component: () => import('@/pages/publish/job/detail'),
        meta: {
          title: '详情'
        }
      }
    ]
  },
  {
    path: '/suggestion',
    name: 'Suggestion',
    component: () => import('../pages/suggestions'),
    meta: {
      title: '意见反馈'
    }
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('../pages/index/index'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/information/detail',
    name: 'InformationDetail',
    component: () => import('../pages/information/detail'),
    meta: {
      title: '详情'
    }
  },
  {
    path: '/subsidy/policyDetail',
    name: 'subsidyPolicyDetail',
    component: () => import('../pages/subsidy/policyDetail'),
    meta: {
      title: '政策文件'
    }
  },
  {
    path: '/subsidy/index',
    name: 'subsidy',
    component: () => import('../pages/subsidy/index'),
    meta: {
      title: '我的申领'
    }
  },
  {
    path: '/subsidy/list',
    name: 'subsidyList',
    component: () => import('../pages/subsidy/subsidyList'),
    meta: {
      title: '我要申领'
    }
  },
  {
    path: '/subsidy/yulujihua',
    name: 'Yulujihua',
    component: () => import('../pages/subsidy/yulujihua'),
    meta: {
      title: '雨露计划申报文件'
    }
  },
  {
    path: '/subsidy/declare',
    name: 'Declare',
    component: () => import('../pages/subsidy/declare'),
    meta: {
      title: '填写申报信息'
    }
  },
  {
    path: '/subsidy/success',
    name: 'Success',
    component: () => import('../pages/subsidy//declareSuccess'),
    meta: {
      title: '提交成功'
    }
  },
  {
    path: '/main/publicAnnouncement',
    name: 'publicAnnouncement',
    component: () => import('../pages/publicExcel/index'),
    meta: {
      title: '公告公示'
    }
  },
  {
    path: '/main/publicAnnouncement/detail',
    name: 'publicAnnouncementDetail',
    component: () => import('../pages/publicExcel/detail'),
    meta: {
      title: '公告公示'
    }
  },
  {
    path: '/subsidy/specialHardshipDeclare',
    name: 'specialHardshipDeclare',
    component: () => import('../pages/subsidy/specialHardship/declare'),
    meta: {
      title: '填写申报信息'
    }
  },
  {
    path: '/subsidy/specialHardshipSuccess',
    name: 'specialHardshipSuccess',
    component: () => import('../pages/subsidy/specialHardship/declareSuccess'),
    meta: {
      title: '提交成功'
    }
  },
  {
    path: '/subsidy/subsistenceAllowanceDeclare',
    name: 'subsistenceAllowanceDeclare',
    component: () => import('../pages/subsidy/subsistenceAllowance/declare'),
    meta: {
      title: '填写申报信息'
    }
  },
  {
    path: '/subsidy/subsistenceAllowanceSuccess',
    name: 'subsistenceAllowanceSuccess',
    component: () => import('../pages/subsidy/subsistenceAllowance/declareSuccess'),
    meta: {
      title: '提交成功'
    }
  },
  {
    path: '/subsidy/record',
    name: 'record',
    component: () => import('../pages/subsidy/record'),
    meta: {
      title: '雨露计划申报记录'
    }
  },
  {
    path: '/skills-training',
    name: 'skills-training',
    component: () => import('../pages/skills-training/index'),
    meta: {
      title: '我要培训'
    }
  },
  {
    path: '/skills-training/detail',
    name: 'skills-training-detail',
    component: () => import('../pages/skills-training/detail'),
    meta: {
      title: '我要培训'
    }
  },
  {
    path: '/IndustryAllianceIndex',
    name: 'IndustryAllianceIndex',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/index'),
    meta: {
      title: '产业联盟'
    }
  },
  {
    path: '/IndustryAllianceCapitalistApply',
    name: 'IndustryAllianceCapitalistApply',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/capitalist/apply'),
    meta: {
      title: '企业认证'
    }
  },
  {
    path: '/IndustryAllianceCapSuccess',
    name: 'IndustryAllianceCapSuccess',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/capitalist/result/success'),
    meta: {
      title: '企业认证'
    }
  },

  {
    path: '/IndustryAllianceCapFailed',
    name: 'IndustryAllianceCapFailed',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/capitalist/result/failed'),
    meta: {
      title: '企业认证'
    }
  },

  {
    path: '/IndustryAllianceCapSubscribe',
    name: 'IndustryAllianceCapSubscribe',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/capitalist/Subscribe/index'),
    meta: {
      title: '土地认种'
    }
  },
  {
    path: '/IndustryAllianceCapApplyRecord',
    name: 'IndustryAllianceCapApplyRecord',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/capitalist/applyRecord'),
    meta: {
      title: '申请记录'
    }
  },
  {
    path: '/IndustryAllianceCapApplyRecorDetail',
    name: 'IndustryAllianceCapApplyRecorDetail',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/capitalist/applyDetail'),
    meta: {
      title: '详情'
    }
  },

  {
    path: '/IndustryAllianceFarmerApply',
    name: 'IndustryAllianceFarmerApply',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/farmer/apply'),
    meta: {
      title: '农户认证'
    }
  },

  {
    path: '/IndustryAllianceFarmerSuccess',
    name: 'IndustryAllianceFarmerSuccess',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/farmer/result/success'),
    meta: {
      title: '农户认证'
    }
  },

  {
    path: '/IndustryAllianceFarmerFailed',
    name: 'IndustryAllianceFarmerFailed',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/farmer/result/failed'),
    meta: {
      title: '农户认证'
    }
  },
  {
    path: '/IndustryAllianceFarmerSubscribe',
    name: 'IndustryAllianceFarmerSubscribe',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/farmer/Subscribe/index'),
    meta: {
      title: '土地认种'
    }
  },
  {
    path: '/IndustryAllianceFarmerSubDetail',
    name: 'IndustryAllianceFarmerSubDetail',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/farmer/Subscribe/detail'),
    meta: {
      title: '土地认种详情'
    }
  },
  {
    path: '/IndustryAllianceFarmerSubDetAction',
    name: 'IndustryAllianceFarmerSubDetAction',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/farmer/Subscribe/detailAction'),
    meta: {
      title: '我要认种'
    }
  },
  {
    path: '/IndustryAllianceFarmerApplyRecord',
    name: 'IndustryAllianceFarmerApplyRecord',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/farmer/applyRecord'),
    meta: {
      title: '申请记录'
    }
  },
  {
    path: '/IndustryAllianceFarmerApplyRecorDetail',
    name: 'IndustryAllianceFarmerApplyRecorDetail',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/farmer/applyDetail'),
    meta: {
      title: '详情'
    }
  },
  {
    path: '/IndustryAllianceFarmerAgreement',
    name: 'IndustryAllianceFarmerAgreement',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/farmer/agreement/index'),
    meta: {
      title: '签署协议'
    }
  },
  {
    path: '/IndustryAllianceFarmerAgreeSign',
    name: 'IndustryAllianceFarmerAgreeSign',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/farmer/agreement/sign'),
    meta: {
      title: '签署协议'
    }
  },
  {
    path: '/IndustryAllianceFarmerWorkShop',
    name: 'IndustryAllianceFarmerWorkShop',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/farmer/workShop/index'),
    meta: {
      title: '共富车间'
    }
  },

  {
    path: '/IndustryAllianceFarmerWorkCustomize',
    name: 'IndustryAllianceFarmerWorkCustomize',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/farmer/workShop/customize/index'),
    meta: {
      title: '定制加工'
    }
  },
  {
    path: '/IndustryAllianceFarmerWorkCraft',
    name: 'IndustryAllianceFarmerWorkCraft',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/farmer/workShop/craft/index'),
    meta: {
      title: '工艺学习'
    }
  },
  {
    path: '/IndustryAllianceFarmerWorkCraftDetail',
    name: 'IndustryAllianceFarmerWorkCraftDetail',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/farmer/workShop/craft/detail'),
    meta: {
      title: '详情'
    }
  },
  {
    path: '/IndustryAllianceFarmerWorkCraftapply',
    name: 'IndustryAllianceFarmerWorkCraftapply',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/farmer/workShop/craft/apply'),
    meta: {
      title: '我要预约'
    }
  },
  {
    path: '/IndustryAllianceFarmerWorkEntrust',
    name: 'IndustryAllianceFarmerWorkEntrust',
    component: () => import('../pages/cultural-propaganda/IndustryAlliance/farmer/workShop/entrust/index'),
    meta: {
      title: '委托加工'
    }
  },

  {
    path: '/cultural-propaganda',
    name: 'cultural-propaganda',
    component: () => import('../pages/cultural-propaganda/index'),
    meta: {
      title: '产业帮扶'
    }
  },
  {
    path: '/cultural-propaganda/detail',
    name: 'cultural-propaganda-detail',
    component: () => import('../pages/cultural-propaganda/detail'),
    meta: {
      title: '产业帮扶'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng',
    name: 'zhongfengEntrance',
    component: () => import('../pages/cultural-propaganda/zhongfeng/index'),
    meta: {
      title: '中蜂产业'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/groupIncrease',
    name: 'zhongfengGroupIncrease',
    component: () => import('../pages/cultural-propaganda/groupIncrease/index'),
    meta: {
      title: '抱团增收'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/toJoinGroupIncrease',
    name: 'zhongfengtoJoinGroup',
    component: () => import('../pages/cultural-propaganda/groupIncrease/toJoin'),
    meta: {
      title: '我要加入'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/GroupAgreement',
    name: 'zhongfengtoGroupAgreement',
    component: () => import('../pages/cultural-propaganda/groupIncrease/agreement'),
    meta: {
      title: '我要加入'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/groupSelect',
    name: 'zhongfengtoGroupSelect',
    component: () => import('../pages/cultural-propaganda/groupIncrease/select'),
    meta: {
      title: '抱团增收'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/groupMyDeclaration',
    name: 'zhongfengtoGroupMyDeclaration',
    component: () => import('../pages/cultural-propaganda/groupIncrease/myDeclaration'),
    meta: {
      title: '我的申报'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/groupMyEarning',
    name: 'zhongfengtoGroupMyEarning',
    component: () => import('../pages/cultural-propaganda/groupIncrease/myEarning'),
    meta: {
      title: '我的收益'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/groupToQuit',
    name: 'zhongfengtoGroupToQuit',
    component: () => import('../pages/cultural-propaganda/groupIncrease/toQuit'),
    meta: {
      title: '我要退出'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/groupAuditRes',
    name: 'zhongfengtoGroupAuditRes',
    component: () => import('../pages/cultural-propaganda/groupIncrease/auditRes'),
    meta: {
      title: '我要退出'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/zhegulianghua',
    name: 'zhegulianghua',
    component: () => import('../pages/cultural-propaganda/zhongfeng/zhegulianghua'),
    meta: {
      title: '中蜂养殖折股量化'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/apply',
    name: 'culturalPropagandaApply',
    component: () => import('../pages/cultural-propaganda/zhongfeng/apply'),
    meta: {
      title: '我要参与'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/normalFarmerApply',
    name: 'culturalProNormalFarmerApply',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/normalFarmerApply'),
    meta: {
      title: '低收入农户申领'
    }
  },
  // {
  //   path: '/cultural-propaganda/zhongfeng/normalFarmerLocationMap',
  //   name: 'culturalProNormalLocationMap',
  //   component: () => import('../pages/cultural-propaganda/zhongfeng/normal/normalLocationMap'),
  //   meta: {
  //     title: '低收入农户申领'
  //   }
  // },
  {
    path: '/cultural-propaganda/zhongfeng/normalPair',
    name: 'culturalProNormalPair',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/normalPair'),
    meta: {
      title: '低收入农户申领'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/normalMatchStatus',
    name: 'culturalProNormalMatchStatus',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/matchStatus'),
    meta: {
      title: '养殖大户申领'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/normalSign',
    name: 'culturalProNormalSign',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/normalSign'),
    meta: {
      title: '低收入农户申领'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/normalSignResult',
    name: 'culturalProNormalSignResult',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/normalSignResult'),
    meta: {
      title: '低收入农户申领'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/beekeepingSupport',
    name: 'beekeepingSupport',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/beekeepingSupport'),
    meta: {
      title: '中锋养殖折股量化'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/income',
    name: '/cultural-propaganda/zhongfeng/income',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/income'),
    meta: {
      title: '我的收益'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/training/farmersIndex',
    name: 'farmersIndex',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/training/farmersIndex'),
    meta: {
      title: '我要培训'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/training/standard',
    name: 'normalTrainingStandard',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/training/standard'),
    meta: {
      title: '我要培训'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/training/farmersIndex1',
    name: 'farmersIndex1',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/training/index1'),
    meta: {
      title: '我要培训'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/training/detail',
    name: 'farmersTrainingDetail',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/training/detail'),
    meta: {
      title: '培训详情'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/training/signUp',
    name: 'normalTrainingSignUp',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/training/signUp'),
    meta: {
      title: '培训报名'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/training/apply',
    name: 'apply',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/training/apply'),
    meta: {
      title: '培训申请'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/training/record',
    name: 'farmerTrainRecord',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/training/record'),
    meta: {
      title: '申请记录'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/work/index',
    name: 'workIndex',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/work/index'),
    meta: {
      title: '我要工作'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/work/detail',
    name: 'workDetail',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/work/detail'),
    meta: {
      title: '工作报名'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/work/index1',
    name: 'workIndex1',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/work/index1'),
    meta: {
      title: '我要工作'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/work/detail1',
    name: 'workDetail1',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/work/detail1'),
    meta: {
      title: '工作详情'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/hive/index',
    name: 'myHive',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/hive/index'),
    meta: {
      title: '我的蜂箱'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/hive/detail',
    name: 'myHiveDetail',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/hive/detail'),
    meta: {
      title: '我的蜂箱'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/hive/index1',
    name: 'myHive1',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/hive/index1'),
    meta: {
      title: '我的蜂箱'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/hive/myHiveMarkerMap',
    name: 'myHiveMarkerMap',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/hive/normalHiveMarkerMap'),
    meta: {
      title: '我的蜂箱'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/earning/index',
    name: 'earning',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/earnings/index'),
    meta: {
      title: '我的收益'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/protocol/index',
    name: 'protocol',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/protocol/index'),
    meta: {
      title: '代养协议'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/declare/detail',
    name: 'declare',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/declareDetail/index'),
    meta: {
      title: '申报详情'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigCommitment',
    name: 'culturalProBigCommitment',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/bigCommitment'),
    meta: {
      title: '养殖大户申领'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigFarmerApply',
    name: 'culturalProBigFarmerApply',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/bigFarmerApply'),
    meta: {
      title: '养殖大户申领'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigFarmerMapApply',
    name: 'culturalProBigFarmerMapApply',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/bigFarmerApplyMap'),
    meta: {
      title: '地址'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigPair',
    name: 'culturalProBigPair',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/bigPair'),
    meta: {
      title: '养殖大户申领'
    }
  },
  // {
  //   path: '/cultural-propaganda/zhongfeng/bigMap',
  //   name: 'culturalProBigMap',
  //   component: () => import('../pages/cultural-propaganda/zhongfeng/big/bigMap'),
  //   meta: {
  //     title: '养殖大户申领'
  //   }
  // },
  {
    path: '/cultural-propaganda/zhongfeng/bigSign',
    name: 'culturalProBigSign',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/bigSign'),
    meta: {
      title: '养殖大户申领'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/appStatus',
    name: 'culturalProBigAppStatus',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/appStatus'),
    meta: {
      title: '养殖大户申领'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigAgreement',
    name: 'culturalProBigAgreement',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/bigAgreement'),
    meta: {
      title: '养殖大户申领'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigSignResult',
    name: 'culturalProBigSignResult',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/bigSignResult'),
    meta: {
      title: '养殖大户申领'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigSignWaiting',
    name: 'culturalProBigSignWaiting',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/bigSignWaiting'),
    meta: {
      title: '审核申报'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigEntrance',
    name: 'culturalProBigEntrance',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/entrance/index'),
    meta: {
      title: '中蜂养殖折股量化'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigHelpObject',
    name: 'culturalProBigHelpObject',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/helpObject/index'),
    meta: {
      title: '帮扶对象'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigHelpMap1',
    name: 'culturalProBigHelpMap1',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/helpObject/helpMap1'),
    meta: {
      title: '位置选择'
    }
  },
  // {
  //   path: '/cultural-propaganda/zhongfeng/bigHelpMap2',
  //   name: 'culturalProBigHelpMap2',
  //   component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/helpObject/helpMap2'),
  //   meta: {
  //     title: '位置选择'
  //   }
  // },
  {
    path: '/cultural-propaganda/zhongfeng/bigBeeHiveNumber',
    name: 'culturalProBigBeeHiveNumber',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/helpObject/beehiveNumber'),
    meta: {
      title: '蜂箱编号上传'
    }
  },

  // {
  //   path: '/cultural-propaganda/zhongfeng/bigHelpObjectBeeMapMarker',
  //   name: 'culturalProBigHelpBeeMapMarker',
  //   component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/helpObject/beeMarkerMap'),
  //   meta: {
  //     title: '帮扶对象'
  //   }
  // },
  // {
  //   path: '/cultural-propaganda/zhongfeng/bigHelpObjectBeeMap',
  //   name: 'culturalProBigHelpBeeMap',
  //   component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/helpObject/beeMap'),
  //   meta: {
  //     title: '帮扶对象'
  //   }
  // },
  {
    path: '/cultural-propaganda/zhongfeng/bigCapitalGains',
    name: 'culturalProBigCapitalGains',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/capitalGains/index'),
    meta: {
      title: '资金收益'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigIncome',
    name: 'culturalProBigIncome',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/capitalGains/income/index'),
    meta: {
      title: '我的收益'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigOut',
    name: 'culturalProBigOut',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/capitalGains/out/index'),
    meta: {
      title: '我要打款'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigSubmit',
    name: 'culturalProBigSubmit',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/capitalGains/submit'),
    meta: {
      title: '上传打款凭证'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigBeeTraining',
    name: 'culturalProBigBeeTraining',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/beeTraining/index'),
    meta: {
      title: '养蜂培训'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigBeeTraining1',
    name: 'culturalProBigBeeTraining1',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/beeTraining/index1'),
    meta: {
      title: '养蜂培训'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigBeeTrainingPublish',
    name: 'culturalProBigBeeTrainingPublish',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/beeTraining/publish'),
    meta: {
      title: '发布培训'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigBeeTrainingDetail',
    name: 'culturalProBigBeeTrainingDetail',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/beeTraining/detail'),
    meta: {
      title: '培训详情'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigNewTraining',
    name: 'culturalProBigNewTraining',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/beeTraining/newTraining'),
    meta: {
      title: '新增培训'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigTrainingDetail',
    name: 'culturalProBigTrainingDetail',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/beeTraining/trainingDetail'),
    meta: {
      title: '新增培训'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigEmployAlleviation',
    name: 'culturalProBigEmployAlleviation',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/employAlleviation/index'),
    meta: {
      title: '就业增收'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigNewEmploy',
    name: 'culturalProBigNewEmploy',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/employAlleviation/newEmploy'),
    meta: {
      title: '就业增收'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigEmployDetail',
    name: 'culturalProBigEmployDetail',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/employAlleviation/employDetail'),
    meta: {
      title: '就业增收'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigEmployAlleviation1',
    name: 'culturalProBigEmployAlleviation1',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/employAlleviation/index1'),
    meta: {
      title: '就业增收'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigEmployAlleviationPublish',
    name: 'culturalProBigEmployAlleviationPublish',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/employAlleviation/publish'),
    meta: {
      title: '发布工作'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigEmployAlleviationDetail',
    name: 'culturalProBigEmployAlleviationDetail',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/employAlleviation/detail'),
    meta: {
      title: '发布工作'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigBeeReportPublish',
    name: 'culturalProBigBeeReportPublish',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/beeReport/publish'),
    meta: {
      title: '上传养蜂信息'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigBeeReport1',
    name: 'culturalProBigBeeReport1',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/beeReport/index1'),
    meta: {
      title: '养蜂信息'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigBeeReportDetail',
    name: 'culturalProBigBeeReportDetail',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/beeReport/detail'),
    meta: {
      title: '蜂箱详情'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/bigDeclaDetails',
    name: 'culturalProBigDeclaDetails',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/declaDetails/index'),
    meta: {
      title: '申报详情'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/capQuit',
    name: 'culturalProCapQuit',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/afterMath/capQuit/index'),
    meta: {
      title: '退出申请'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/auditStatus',
    name: 'auditStatus',
    component: () => import('../pages/cultural-propaganda/zhongfeng/auditStatus'),
    meta: {
      title: '审批结果'
    }
  },
  {
    path: '/social-assistance',
    name: 'social-assistance',
    component: () => import('../pages/social-assistance/index'),
    meta: {
      title: '公益帮扶'
    }
  },
  {
    path: '/social-assistance/activity',
    component: empty,
    meta: {
      title: '公益帮扶活动'
    },
    children: [
      {
        path: '',
        name: 'socialAssistanceActivity',
        component: () => import('../pages/social-assistance/activity'),
        meta: {
          title: '公益帮扶活动'
        }
      },
      {
        path: '/social-assistance/activity/detail',
        name: 'socialAssistanceDetail',
        component: () => import('../pages/social-assistance/detail'),
        meta: {
          title: '公益帮扶活动'
        }
      }
    ]
  },
  {
    path: '/social-assistance/temporary',
    name: 'socialAssistanceTemporary',
    component: () => import('../pages/social-assistance/temporary'),
    meta: {
      title: '临时救助'
    }
  },
  {
    path: '/social-assistance/basicLiving',
    name: 'socialAssistanceBasicLiving',
    component: () => import('../pages/social-assistance/basicLiving'),
    meta: {
      title: '低保救助'
    }
  },
  {
    path: '/social-assistance/emergency',
    name: 'socialAssistanceEmergency',
    component: () => import('../pages/social-assistance/emergency'),
    meta: {
      title: '紧急救助'
    }
  },
  {
    path: '/asset-utilization',
    name: 'asset-utilization',
    component: () => import('../pages/asset-utilization/index'),
    meta: {
      title: '资产出租'
    }
  },
  {
    path: '/assetUtilizationVerify',
    name: 'assetUtilizationVerify',
    component: () => import('../pages/asset-utilization/verify'),
    meta: {
      title: '资产出租'
    }
  },
  {
    path: '/asset-utilization/detail',
    name: 'asset-utilization-detail',
    component: () => import('../pages/asset-utilization/detail'),
    meta: {
      title: '资产出租'
    }
  },
  {
    path: '/asset-utilizationPublish',
    name: 'asset-utilizationPublish',
    component: () => import('../pages/asset-utilization/publish'),
    meta: {
      title: '资产出租'
    }
  },
  {
    path: '/partTime/list',
    name: 'partTimeList',
    component: () => import('../pages/partTime/list'),
    meta: {
      title: '传统工艺'
    }
  },
  {
    path: '/twoInBack/list',
    name: 'twoInBack',
    component: () => import('../pages/twoInBack/list'),
    meta: {
      title: '两进两回'
    }
  },
  {
    path: '/entrepreneurship',
    name: 'entrepreneurship',
    component: () => import('../pages/entrepreneurship/index'),
    meta: {
      title: '创业帮扶'
    }
  },
  {
    path: '/xkm',
    name: 'xkm',
    component: () => import('../pages/mine/xkm/index'),
    meta: {
      title: '我的小康码'
    }
  },
  {
    path: '/publicity',
    name: 'publicity',
    component: () => import('../pages/publicity/index'),
    meta: {
      title: '公示公告'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/big/evaluation',
    name: 'cultural-propaganda/zhongfeng/big/evaluation',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/evaluation'),
    meta: {
      title: '资格自评'
    }
  },
  {
    path: '/cultural-propaganda/zhongfeng/big/result',
    name: 'cultural-propaganda/zhongfeng/big/result',
    component: () => import('../pages/cultural-propaganda/zhongfeng/big/result'),
    meta: {
      title: '提交结果'
    }
  },

  // {
  //   path: '/map/map',
  //   name: 'map/map',
  //   component: () => import('../pages/map/map.vue'),
  //   meta: {
  //     title: '蜂箱定位'
  //   }
  // },

  {
    path: '/cultural-propaganda/zhongfeng/declare/choose',
    name: 'declareChoose',
    component: () => import('../pages/cultural-propaganda/zhongfeng/normal/help/declareDetail/choose'),
    meta: {
      title: '选择养殖大户'
    }
  }
]

const router = new createRouter({
  //   history: createWebHistory(),
  history: createWebHashHistory(),
  routes
})

/**
 * TODO 准备document
 */
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
