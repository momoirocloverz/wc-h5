

# 2.项目分支 dev/pre/master

# 3.关于上架平台说明，目前已经上线了网页端以及浙里办平台（浙里办 app、支付宝、微信小程序）

### hint: 浙里办平台会有老年适配化需要，之后部分说明会涉及到

# 4.关于部署发布

## 1.根据发布平台需要调整 vue.config.js 内 outputDir: 'build', publicPath: './',两个配置项。 outputDir: 'build'适用于于浙里办的平台打包与发布。outputDir 默认或者 'dist'适用于常规网页端。

![image](https://img.hzanchu.com/acimg/c37185836e0dd412c399e031fb95f49e.png)

## 2.发布时需要自行 build 并提交代码

# 5.关于文件结构

## 1.常规结构

### 总览

![image](https://img.hzanchu.com/acimg/8cee1b2a60fd11bef9c61b323d4fa210.png)

### postcss 配置页面适配

## 2.细分结构 public/index.html 内部说明

![image](https://img.hzanchu.com/acimg/afc3d78cbb291f7a4bc52c24d172db63.png)

### 1.浙里办适老化标记方式 1

---

![image](https://img.hzanchu.com/acimg/2072ea18e59d59d4512a3441635c85fb.png)

### 2.浙里办埋点

---

![image](https://img.hzanchu.com/acimg/a77f02b3c2675e45569a8feba928dfe4.png)
![image](https://img.hzanchu.com/acimg/3c66ea20e7f43356554e5fa2cabbbe74.png)

### 3.微信与浙里办调试插件

---

## 3.细分结构 src/main.js 内部说明

![image](https://img.hzanchu.com/acimg/47b4f52738a0f4be6ea757afb406baa4.png)

### 1 浙里办适老化标记方式 2

---

![image](https://img.hzanchu.com/acimg/fe7edec97e11984a41d3a82e01dacaf8.png)

### 2 业务层面用户登录相关标记

#### 用户手机号，判断用户类型，身份标记 type 1:农户 2:干部 3:医生 4:大户，是否需要在登录之后需要选择用户，当前登录用户相关信息

---

## 4.细分结构 src/app.vue 内部说明

### homeInformationIndex 初始化主页 tab 的序号

---

## 5.细分结构 util/index 内部说明

### 工具类

#### 1. isZLB 判断是否是浙里办环境（app,支付宝,微信小程序）

#### 2. fitForOld 判断是否需要启用浙里办适老化

#### localStorage.setItem('fitForOld' 方式 1

#### appId.style = '--size: 1.3;' 方式 2

#### 3. convert 浙里办环境下网络请求参数 key 驼峰化

#### 4. ZLBJump 浙里办环境下法人与普通单点登录跳转。 ZWJSBridge.getUserType 方法只适用于浙里办 app，其它环境都会出错。 userType == 2 则是浙里办法人身份标记。需要区分支付宝与浙里办 app、浙里办小程序 环境。

#### 5.法人测试账号 zjfrcszh 密码 Zjfrcszh123

---

## 5.细分结构 static/address 内部说明

### 部分页面地区选择使用

---

## 6.细分结构 router/index 内部说明

![image](https://img.hzanchu.com/acimg/f781c00f917a506437c8d1bfc7a45574.png)

### 浙里办与 h5 环境重定向页面有区别，浙里办首先重定向到空白页面

### 空白页面是为了解决浙里办 app/支付宝环境二次回退问题

---

## 7.细分结构 assets/css/fit 内部说明

### 浙里办适老化策略

---

## 8.细分结构 page/blank/index 内部说明

### 浙里办空白页

---

## 9.细分结构 service 内部说明

### mgop.js 封装了浙里办请求工具

### request.js 兼容 mgop 与 axios 请求

### mgop 相关接口查看 http://op.zjzwfw.gov.cn/mobile/gateway/api

### 账号：lisy

### 密码：15757107767lsy`

### 部门：市、县（市、区） - 温州市 - 县（市区）- 文成县 - 政府机构 - 文成县农业农村局

---

## 10.关于浙里办相关说明

### 浙里办环境需要脱敏处理，姓名，电话，身份证号

### 浙里办环境 isTestUrl 互相切换可以实现接口环境的切换

### 浙里办环境网络请求工具 mgop

### 浙里办环境 mgop 响应体与 axios 响应体有结构差异

---

## 11.关于图片上传

### lrz 插件压缩处理

---

# 6.备注

### 1. 浙里办的支付宝端与微信端不支持法人登录

### 2. 产业联盟模块，企业注册需要在浙里办环境下，以法人身份登录，农户注册无要求

### 3. util/index.js 测试环境示例适用于浙里办测试环境。 https://puser.zjzwfw.gov.cn/sso/alipay.do?action=ssoLogin&servicecode=gfb&redirectUrl=XXXX 浙里办测试环境调试方法 https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=gfb&redirectUrl=XXXX

### 4.摘自浙里办文档： "关于测试地址！（白名单需要我这边配置，不是你们那边配置的）白名单里配置域名例如https://mapi.zjzwfw.gov.cn/web/mgop/gov-open/的测试地址，我这边只需要配置https://mapi.zjzwfw.gov.cn 就能跳转这个域名的所有地址。所以测试地址不更改域名的情况下，你们都可以跳转你们具体的测试地址。 调试完成之后再发正式的地址给我放在默认的回调地址上，例如移动端请求如下https://puser.zjzwfw.gov.cn/sso/mobile.do?action=oauth&scope=1&servicecode=你的ak&redirectUrl=你的测试地址）切记不是goto参数不是goto参数。 不加&redirectUrl 字段，则跳转默认正式地址。"

### 5. 测试地址现在可以配置在白名单上(找浙里办进行配置)

### 6.浙里办 js 依赖于 ZWJSBridge
