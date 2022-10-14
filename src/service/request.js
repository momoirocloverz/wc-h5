import Http from './http'
import { isZLB } from '../util/index'
const ISZLB = isZLB()
import MGOP from './mgop'
class Request {
  getBanner(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.BannerLists', data, 'POST')
    } else {
      return Http.post('/banner/lists', data)
    }
  }
  getList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.articleLists', data, 'POST')
    } else {
      return Http.post('/article/lists', data)
    }
  }
  upload(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.zlbUpload', data, 'POST')
    } else {
      return Http.post('/public/upload', data)
    }
    // return Http.post('/public/upload', data)
  }
  suggestion(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.suggest', data, 'POST')
    } else {
      return Http.post('/suggest', data)
    }
  }
  getUserInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.userInfo', data, 'POST')
    } else {
      return Http.post('/user/info', data)
    }
  }
  submitRecord(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.visit', data, 'POST')
    } else {
      return Http.post('/visit', data)
    }
  }
  getTown(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.publicTown', data, 'POST')
    } else {
      return Http.post('/public/town', data)
    }
  }
  getVillage(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.publicVillage', data, 'POST')
    } else {
      return Http.post('/public/village', data)
    }
  }
  planApply(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planApply', data, 'POST')
    } else {
      return Http.post('/plan/apply', data)
    }
  }
  planList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planList', data, 'POST')
    } else {
      return Http.post('/plan/list', data)
    }
  }
  match(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planMatch', data, 'POST')
    } else {
      return Http.post('/plan/match', data)
    }
  }
  applyRate(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planApplyRate', data, 'POST')
    } else {
      return Http.post('/plan/apply/rate', data)
    }
  }
  info(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planInfo', data, 'POST')
    } else {
      return Http.post('/plan/info', data)
    }
  }
  edit(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planApplyEdit', data, 'POST')
    } else {
      return Http.post('/plan/apply/edit', data)
    }
  }
  loginSms(data) {
    return Http.post('/login/sms', data)
  }
  loginAction(data) {
    return Http.post('/login', data)
  }
  userUpdate(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.userUpdate', data, 'POST')
    } else {
      return Http.post('/user/update', data)
    }
  }
  issueAdd(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.issueAdd', data, 'POST')
    } else {
      return Http.post('/issue/add', data)
    }
  }
  issueuserEditProperty(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.userEditProperty', data, 'POST')
    } else {
      return Http.post('/user/userEditProperty', data)
    }
  }
  issueList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.issueList', data, 'POST')
    } else {
      return Http.post('/issue/list', data)
    }
  }
  issueInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.issueInfo', data, 'POST')
    } else {
      return Http.post('/issue/info', data)
    }
  }
  issueDelete(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.issueDelete', data, 'POST')
    } else {
      return Http.post('/issue/delete', data)
    }
  }
  userIssue(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.userIssue', data, 'POST')
    } else {
      return Http.post('/user/issue', data)
    }
  }
  userFarmerInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.userFarmerInfo', data, 'POST')
    } else {
      return Http.post('/user/farmer/info', data)
    }
  }
  issueType(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.issueType', data, 'POST')
    } else {
      return Http.post('/issue/type', data)
    }
  }
  loginRedirect(data) {
    return Http.post('/login/redirect', data)
  }
  skillType(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.skillType', data, 'POST')
    } else {
      return Http.post('/skill/type', data)
    }
  }
  skillList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.skillList', data, 'POST')
    } else {
      return Http.post('/skill/list', data)
    }
  }
  skillInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.skillInfo', data, 'POST')
    } else {
      return Http.post('/skill/info', data)
    }
  }
  majorApply(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorApply', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/apply', data)
    }
  }

  beeMajorHiveInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorHiveInfo', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/hiveInfo', data)
    }
  }

  fetchFarmerList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerList', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/list', data)
    }
  }
  majorAgree(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorAgree', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/agree', data)
    }
  }
  majorReject(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorReject', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/reject', data)
    }
  }
  majorSign(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorSign', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/sign', data)
    }
  }
  groupApply(data) {
    return Http.post('/plan/bee/group/apply', data)
  }
  majorInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorInfo', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/info', data)
    }
  }
  groupInfo(data) {
    return Http.post('/plan/bee/group/info', data)
  }
  majorMatchInfo(data) {
    return Http.post('/plan/bee/major/match_info', data)
  }
  majorSubmitHive(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorSubmitHive', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/submit_hive', data)
    }
  }
  majorSubmitHiveReport(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorSubmitHiveReport', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/submit_hive_report', data)
    }
  }
  majorIncome(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorIncome', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/income', data)
    }
  }
  majorWorkList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorWorkList', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/work_list', data)
    }
  }
  majorWorkAdd(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorWorkAdd', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/work_add', data)
    }
  }
  majorWorkEdit(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorWorkEdit', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/work_edit', data)
    }
  }
  majorWorkDelete(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorWorkDelete', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/work_delete', data)
    }
  }
  majorWorkApplyList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorWorkApplyList', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/work_apply_list', data)
    }
  }
  majorWorkTrainList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorTrainList', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/train_list', data)
    }
  }
  majorWorkTrainAdd(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorTrainAdd', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/train_add', data)
    }
  }
  majorWorkTrainDelete(data) {
    return Http.post('/plan/bee/major/train_delete', data)
  }
  majorWorkTrainApplyList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorTrainApplyList', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/train_apply_list', data)
    }
  }
  majorWorkTrainApplyUpload(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorTrainApplyUpload', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/train_apply_upload', data)
    }
  }
  majorWorkTrainAudit(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorTrainAudit', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/train_audit', data)
    }
  }
  zhongfengInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeInfo', data, 'POST')
    } else {
      return Http.post('/plan/bee/info', data)
    }
  }
  zhongfengApply(data) {
    return Http.post('/plan/bee/apply', data)
  }
  zhongfengEdit(data) {
    return Http.post('/plan/bee/edit', data)
  }
  zhongfengIncome(data) {
    return Http.post('/plan/bee/income', data)
  }
  propertyType(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.propertyType', data, 'POST')
    } else {
      return Http.post('/property/type', data)
    }
  }
  propertyList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.propertyList', data, 'POST')
    } else {
      return Http.post('/property/list', data)
    }
  }
  propertyUserEditProperty(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.editProperty', data, 'POST')
    } else {
      return Http.post('/property/userEditProperty', data)
    }
  }
  userProperSetProperty(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.setProperty', data, 'POST')
    } else {
      return Http.post('/property/userSetProperty', data)
    }
  }
  userSetProperty(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.userSetProperty', data, 'POST')
    } else {
      return Http.post('/user/userSetProperty', data)
    }
  }
  propertyInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.propertyInfo', data, 'POST')
    } else {
      return Http.post('/property/info', data)
    }
  }
  propertyAdd(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.propertyAdd', data, 'POST')
    } else {
      return Http.post('/property/add', data)
    }
  }
  userProperty(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.userProperty', data, 'POST')
    } else {
      return Http.post('/user/property', data)
    }
  }
  propertyDelete(data) {
    return Http.post('/property/delete', data)
  }
  fetchBeeInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeInfo', data, 'POST')
    } else {
      return Http.post('/plan/bee/info', data)
    }
  }
  actionFarmerApply(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerApply', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/apply', data)
    }
  }
  actionFarmerMatch(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerMatch', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/match', data)
    }
  }
  fetchFarmerMatchInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerMatchInfo', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/match_info', data)
    }
  }
  fetchMajorList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorList', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/list', data)
    }
  }
  farmerSign(data) {
    return Http.post('/plan/bee/farmer/sign', data)
  }
  fetchFarmerTrainList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerTrainList', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/train_list', data)
    }
  }
  fetchFarmerTrainInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerTrainInfo', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/train_info', data)
    }
  }
  farmerTrainEnter(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerTrainEnter', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/train_enter', data)
    }
  }
  farmerTrainApply(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerTrainApply', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/train_apply', data)
    }
  }
  fetchFarmerTrainApplyInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerTrainApplyInfo', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/train_apply_info', data)
    }
  }
  fetchFarmerWorkList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerWorkList', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/work_list', data)
    }
  }
  fetchFarmerWorkinfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerWorkInfo', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/work_info', data)
    }
  }
  farmerWorkenter(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerWorkEnter', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/work_enter', data)
    }
  }
  fetchFarmerHive(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerHive', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/hive', data)
    }
  }
  fetchFarmerHivereport(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerHiveReport', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/hive_report', data)
    }
  }
  fetchFarmerIncome(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerIncome', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/income', data)
    }
  }
  fetchPublicTown(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.publicTown', data, 'POST')
    } else {
      return Http.post('/public/town', data)
    }
  }
  fetchFarmerBeeInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerInfo', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/info', data)
    }
  }
  fetchPublicVillage(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.publicVillage', data, 'POST')
    } else {
      return Http.post('/public/village', data)
    }
  }
  setBeeStage(data) {
    return Http.post('/plan/bee/stage', data)
  }
  fetchMajorProtocol(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorProtocol', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/protocol', data)
    }
  }
  fetchFarmerProtocol(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerProtocol', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/protocol', data)
    }
  }
  fetchMajorFarmerHiveList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorFarmerHiveList', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/farmer_hive_list', data)
    }
  }
  fetchMajorFarmerHiveReportList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorHiveReportList', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/hive_report_list', data)
    }
  }
  beeFarmerEdit(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerEdit', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/edit', data)
    }
  }
  beeFarmerTrainApplyCancel(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeFarmerTrainApplyCancel', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/train_apply_cancel', data)
    }
  }
  beeMajormatchList(data) {
    return Http.post('/plan/bee/major/match_list', data)
  }
  beeMajormessage(data) {
    return Http.post('/plan/bee/major/message', data)
  }
  beeMajorEditHive(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorEditHive', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/edit_hive', data)
    }
  }
  beeMajorEdit(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeMajorEdit', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/edit', data)
    }
  }
  planIncomeInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planIncomeInfo', data, 'POST')
    } else {
      return Http.post('/plan/income/info', data)
    }
  }
  planIncomeApply(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planIncomeApply', data, 'POST')
    } else {
      return Http.post('/plan/income/apply', data)
    }
  }
  planIncomeEdit(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planIncomeEdit', data, 'POST')
    } else {
      return Http.post('/plan/income/edit', data)
    }
  }
  planIncomeDrop(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planIncomeDrop', data, 'POST')
    } else {
      return Http.post('/plan/income/drop', data)
    }
  }
  planIncomeProfit(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planIncomeProfit', data, 'POST')
    } else {
      return Http.post('/plan/income/profit', data)
    }
  }
  // 用户协议/政策
  planBeeProtocol(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.planBeeProtocol', data, 'POST')
    } else {
      return Http.post('/plan/bee/protocol', data)
    }
  }

  // 大户申请中列表
  planBeeMajorMajorApplyList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorApplyList', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/majorApplyList', data)
    }
  }
  planBeeMajorWaitUpload(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorWaitUpload', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/majorWaitUpload', data)
    }
  }
  planBeeMajorWaitAudit(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorWaitAudit', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/majorWaitAudit ', data)
    }
  }
  planBeeMajorWaitSuc(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorWaitSuc', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/majorWaitSuc ', data)
    }
  }
  planBeeMajorOverWaitList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorOverWaitList', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/majorOverWaitList ', data)
    }
  }
  planBeeMajorOverEndList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorOverEndList', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/majorOverEndList ', data)
    }
  }
  planBeeMajorApplyRejectList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorApplyRejectList', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/majorApplyRejectList ', data)
    }
  }
  planBeeMajorApplyWaitList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorApplyWaitList', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/majorApplyWaitList ', data)
    }
  }

  // 大户已结对列表
  planBeeMajorMajorMatchList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorMatchList', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/majorMatchList', data)
    }
  }

  // 大户已结束列表
  planBeeMajorMajorOverList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorOverList', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/majorOverList', data)
    }
  }

  // 我的资金收益
  planBeeMajorMajorProfitList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorProfitList', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/profitList', data)
    }
  }

  // 我的打款收益
  planBeeMajorMajorRemitList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorRemitList', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/remitList', data)
    }
  }

  // 上传打款收益
  planBeeMajorMajorRemit(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorRemit', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/remit', data)
    }
  }

  // 新增培训
  planBeeMajorMajorTrainAdd(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorTrainAdd', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/train_add', data)
    }
  }

  // 编辑培训
  planBeeMajorMajorTrainEdit(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorTrainEdit', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/train_edit', data)
    }
  }

  // 培训详情
  planBeeMajorMajorTrainInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorTrainInfo', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/train_info', data)
    }
  }

  // 工作详情
  planBeeMajorMajorWorkInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorWorkInfo', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/work_info', data)
    }
  }

  // 工作招聘等信息提交
  planBeeMajorMajorWorkEditImg(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorWorkEditImg', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/work_edit_img', data)
    }
  }

  // 管理界面 - 统计
  planBeeMajorMajorIndex(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorIndex', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/index', data)
    }
  }

  // 农户 - 自己申请培训列表
  planBeeFarmerTrainApplyList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.trainApplyList', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/train_apply_list', data)
    }
  }

  // 农户 - 取消工作报名
  planBeeFarmerCancelWork(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.farmerCancelWork', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/work_cancel', data)
    }
  }

  // 农户 - 收益列表
  planBeeFarmerProfitList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.farmerProfitList', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/profitList', data)
    }
  }

  // 农户 - 取消报名
  planBeefarmerTrainCancel(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.farmerTrainCancel', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/train_cancel', data)
    }
  }

  // 农户 - 养殖大户列表
  planBeefarmerMajorList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.farmerMajorList', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/majorList', data)
    }
  }

  // 农户 - 取消申请自养
  planBeefarmerCancelDelivery(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.cancelDelivery', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/cancelDelivery', data)
    }
  }

  // 农户 - 申请自养
  planBeefarmerApplyDeliveryt(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.applyDelivery', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/applyDelivery', data)
    }
  }

  // 农户 - 确认收到蜂箱
  planBeefarmerConfirmDelivery(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.confirmDelivery', data, 'POST')
    } else {
      return Http.post('/plan/bee/farmer/confirmDelivery', data)
    }
  }

  //5-17日追加

  applyPolicyList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.applyPolicyList', data, 'POST')
    } else {
      return Http.post('/apply/policy/list', data)
    }
  }

  applyPolicyInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.applyPolicyInfo', data, 'POST')
    } else {
      return Http.post('/apply/policy/info', data)
    }
  }

  planBeeMajorDropDrop(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorDrop', data, 'POST')
    } else {
      return Http.post('/plan/bee/majorDrop/drop', data)
    }
  }

  planBeeMajorDropCancel(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorDropCancel', data, 'POST')
    } else {
      return Http.post('/plan/bee/majorDrop/cancel', data)
    }
  }

  majorMajorList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.majorList', data, 'POST')
    } else {
      return Http.post('/plan/bee/major/majorList', data)
    }
  }
  applyMe(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.applyMe', data, 'POST')
    } else {
      return Http.post('/apply/me', data)
    }
  }

  IndustryErpApply(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryErpApply', data, 'POST')
    } else {
      return Http.post('/industry/erp/apply', data)
    }
  }

  IndustryErpEdit(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryErpEdit', data, 'POST')
    } else {
      return Http.post('/industry/erp/edit', data)
    }
  }

  IndustryErpInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryErpInfo', data, 'POST')
    } else {
      return Http.post('/industry/erp/info', data)
    }
  }

  IndustryErpCancel(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryErpCancel', data, 'POST')
    } else {
      return Http.post('/industry/erp/cancel', data)
    }
  }

  IndustryErpApplyList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryErpApplyList', data, 'POST')
    } else {
      return Http.post('/industry/erp/applyList', data)
    }
  }

  IndustryIndex(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryIndex', data, 'POST')
    } else {
      return Http.post('/industry/index', data)
    }
  }

  IndustryFarapply(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryFarApply', data, 'POST')
    } else {
      return Http.post('/industry/far/apply', data)
    }
  }

  IndustryFarInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryFarInfo', data, 'POST')
    } else {
      return Http.post('/industry/far/info', data)
    }
  }

  IndustryFarApplyList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryFarApplyList', data, 'POST')
    } else {
      return Http.post('/industry/far/applyList', data)
    }
  }

  IndustryFarCancel(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryFarCancel', data, 'POST')
    } else {
      return Http.post('/industry/far/cancel', data)
    }
  }

  IndustryFarEdit(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryFarEdit', data, 'POST')
    } else {
      return Http.post('/industry/far/edit', data)
    }
  }

  IndustrySeedLists(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industrySeedLists', data, 'POST')
    } else {
      return Http.post('/industry/seed/lists', data)
    }
  }

  IndustrySeedUserApplyList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industrySeedUserApplyList', data, 'POST')
    } else {
      return Http.post('/industry/seed/userApplyList', data)
    }
  }

  IndustrySeedInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industrySeedInfo', data, 'POST')
    } else {
      return Http.post('/industry/seed/info', data)
    }
  }
  IndustrySeedSubmit(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industrySeedSubmit', data, 'POST')
    } else {
      return Http.post('/industry/seed/submit', data)
    }
  }

  IndustryPlantLists(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryPlantLists', data, 'POST')
    } else {
      return Http.post('/industry/plant/lists', data)
    }
  }

  IndustryPlantInfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryPlantInfo', data, 'POST')
    } else {
      return Http.post('/industry/plant/info', data)
    }
  }

  IndustryPlantApply(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryPlantApply', data, 'POST')
    } else {
      return Http.post('/industry/plant/apply', data)
    }
  }
  IndustryPlantEdit(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryPlantEdit', data, 'POST')
    } else {
      return Http.post('/industry/plant/edit', data)
    }
  }
  IndustryPlantApplyList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryPlantApplyList', data, 'POST')
    } else {
      return Http.post('/industry/plant/applyList', data)
    }
  }

  IndustryplantProcessApplyList(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryPlantProcessApplyList', data, 'POST')
    } else {
      return Http.post('/industry/plantProcess/applyList', data)
    }
  }

  IndustryplantProcessinfo(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryPlantProcessInfo', data, 'POST')
    } else {
      return Http.post('/industry/plantProcess/info', data)
    }
  }

  IndustryplantProcessApply(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryPlantProcessApply', data, 'POST')
    } else {
      return Http.post('/industry/plantProcess/apply', data)
    }
  }

  IndustryplantProcessEdit(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.industryPlantProcessEdit', data, 'POST')
    } else {
      return Http.post('/industry/plantProcess/edit', data)
    }
  }
  ssoToken(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.ssoToken', data, 'POST')
    } else {
      return Http.post('/sso/token', data)
    }
  }
  ssoLogin(data) {
    if (ISZLB) {
      return MGOP('mgop.zjanchu.gfb.ssoLogin', data, 'POST')
    } else {
      return Http.post('/sso/login', data)
    }
  }
}

export default new Request()
