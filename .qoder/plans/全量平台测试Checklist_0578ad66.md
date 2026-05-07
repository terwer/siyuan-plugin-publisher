# 全量平台测试 Checklist

> 更新：2026-05-07 | 共53项：T1(27) T2a(7) T2b(3) T3(16)

## 测试说明

- **T1**: Pub=发布 Upd=更新 Del=删除 Img=图片 V2C=V2配置
- **T2a**: Pub=发布 Upd=更新 V1C=V1配置 Inv=V2不可见
- **T2b**: Vis=可见性 Add=可添加性
- **T3**: 仅确认不可用

---

## T1 完整链路 (27)

- [ ] **Common (5)**
  - [ ] #1 语雀
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
