# 全量平台测试 Checklist

> 更新：2026-05-07 | 共53项：T1(27) T2a(7) T2b(3) T3(16)

## 测试说明

- **T1**: Pub=发布 Upd=更新 Del=删除 Img=图片 V2C=V2配置
- **T2a**: Pub=发布 Upd=更新 V1C=V1配置 Inv=V2不可见
- **T2b**: Vis=可见性 Add=可添加性
- **T3**: 仅确认不可用

## 当前阻塞

- [ ] #1 语雀：阻塞，语雀官方 API 返回 `429 Too Many Requests`，`/api/v2/users/{login}/repos` 仓库列表接口在首次配置阶段即被限流；该接口是语雀 API 配置链路获取知识库的基础入口，历史长期可用但当前首次请求即失败，按回归口径判定为语雀官方 API 路径当前基本不可用/阻塞，非 V2 UI 返回链路问题，也不能仅靠跳过初始化请求解决。V2C/Pub/Upd/Del/Img 暂停验证，后续需确认语雀 API 政策/账号/token/限流状态，并做用户化 429 提示。

---

## T1 完整链路 (27)

- [ ] **Common (5)**
  - [ ] #1 语雀（不通过：首次配置即 API 429 Too Many Requests）
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #2 Notion
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #3 Halo
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #4 Confluence
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #5 Jvue
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C

- [ ] **Github (8)**
  - [ ] #6 Github
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #7 Hexo
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #8 Hugo
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #9 Jekyll
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #10 Vuepress
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #11 Vuepress2
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #12 Vitepress
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #13 Antora
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C

- [ ] **Gitlab (7)**
  - [ ] #15 Gitlab
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #16 Hexo
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #17 Hugo
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #18 Jekyll
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #19 Vuepress
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #20 Vuepress2
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #21 Vitepress
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C

- [ ] **Metaweblog (4)**
  - [ ] #25 博客园
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #26 51CTO
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #27 开源中国
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #28 Metaweblog
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C

- [ ] **Wordpress (2)**
  - [ ] #29 Wordpress
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C
  - [ ] #30 Typecho
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C

- [ ] **Fs (1)**
  - [ ] #44 本地系统
    - [ ] Pub
    - [ ] Upd
    - [ ] Del
    - [ ] Img
    - [ ] V2C

---

## T2a V1可配置 (7)

- [ ] #32 知乎
  - [ ] Pub
  - [ ] Upd
  - [ ] V1C
  - [ ] Inv
- [ ] #33 简书
  - [ ] Pub
  - [ ] Upd
  - [ ] V1C
  - [ ] Inv
- [ ] #34 CSDN
  - [ ] Pub
  - [ ] Upd
  - [ ] V1C
  - [ ] Inv
- [ ] #35 掘金
  - [ ] Pub
  - [ ] Upd
  - [ ] V1C
  - [ ] Inv
- [ ] #36 SegmentFault
  - [ ] Pub
  - [ ] Upd
  - [ ] V1C
  - [ ] Inv
- [ ] #37 腾讯云
  - [ ] Pub
  - [ ] Upd
  - [ ] V1C
  - [ ] Inv
- [ ] #38 阿里云
  - [ ] Pub
  - [ ] Upd
  - [ ] V1C
  - [ ] Inv

---

## T2b 仅adaptor (3)

- [ ] #14 Github Docsify
  - [ ] Vis
  - [ ] Add
- [ ] #22 Gitlab Docsify
  - [ ] Vis
  - [ ] Add
- [ ] #39 小红书
  - [ ] Vis
  - [ ] Add

---

## T3 存在性确认 (16)

- [ ] **api孤儿 (3)**
  - [ ] #23 Liandi
  - [ ] #24 Siyuan
  - [ ] #31 Yuque

- [ ] **web孤儿 (4)**
  - [ ] #40 Flowus
  - [ ] #41 Wechat
  - [ ] #42 Weibo
  - [ ] #43 Wuaipojie

- [ ] **Fs枚举占位 (9)**
  - [ ] #45 FTP
  - [ ] #46 SFTP
  - [ ] #47 百度网盘
  - [ ] #48 阿里云盘
  - [ ] #49 微云
  - [ ] #50 豆包
  - [ ] #51 OneDrive
  - [ ] #52 Google Drive
  - [ ] #53 夸克网盘
