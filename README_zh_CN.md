[English](README.md)

# SiYuan Publisher（发布插件）

将 SiYuan 笔记发布到外部平台和代码仓库。  
支持 Markdown + Front Matter、图片上传，并可与 CI/CD 流程结合使用。

- ✍️ 在 SiYuan 中写作
- 🔗 发布到 Git 系列仓库（GitHub、GitLab、Gitea 等）
- 🖼️ 图片处理（直传 / PicGo）
- ⚙️ 在插件界面通过 **`/#/manage`** 路由统一配置

---

## 功能

- 将笔记导出为 Markdown，带有 YAML Front Matter（与 Hugo/Hexo 等静态站点生成器兼容）
- 灵活的仓库 / 分支 / 内容路径配置
- 支持通过 REST API 直接上传（无需本地 git）
- 可选支持 PicGo 上传到对象存储或 CDN
- 可与常见平台的 CI/CD 流程配合

---

## 安装

1. 在 SiYuan 中安装插件（插件市场或手动）。
2. 打开插件面板 → **管理**（内部路由为 `/#/manage`）。
3. 选择发布平台并填写凭据。

---

## 使用方法

- **打开管理界面：** 在插件面板中（加载 SPA：`/#/manage`）
- **配置发布平台：** 填写 Token、仓库、分支、内容目录、图片目录
- **发布：** 在 SiYuan 中选择笔记 → 发布 → 选择目标平台

详细说明请参见：
- [docs/USER_GUIDE.zh-CN.md](docs/USER_GUIDE.zh-CN.md)
- [docs/CONFIGURATION.zh-CN.md](docs/CONFIGURATION.zh-CN.md)
- [docs/TROUBLESHOOTING.zh-CN.md](docs/TROUBLESHOOTING.zh-CN.md)

---

## 故障排查

见 [docs/TROUBLESHOOTING.zh-CN.md](docs/TROUBLESHOOTING.zh-CN.md)。  
常见问题：

- **401/403 错误：** Token 缺失或权限不足
- **路径错误：** 检查 `content/posts` 与 `static/img` 是否存在
- **图片不显示：** 确认图片上传方式（直传 vs PicGo）与路径是否一致

---

## 参与贡献

欢迎 PR！  
开发环境与贡献规范请参见：
- [DEVELOPMENT.zh-CN.md](DEVELOPMENT.zh-CN.md)

---

## 许可

MIT

---

## 致谢与支持

本项目由 **[原作者姓名/账号]** 创建并维护。  
感谢所有贡献者的支持与改进。

如果觉得插件有帮助，可以考虑支持开发工作：

<!-- ✍️ Paste the original Chinese credits / donation links here from the current README -->


## 更新历史

请直接查看 [CHANGELOG](https://github.com/terwer/siyuan-plugin-publisher/blob/main/CHANGELOG.md)

## 彩蛋

[作者开发的其他思源笔记插件](https://github.com/terwer/zhi/blob/main/README_zh_CN.md#%E6%8F%92%E4%BB%B6)

## 捐赠

如果您认可这个项目，请我喝一杯咖啡吧，这将鼓励我持续更新，并创作出更多好用的工具~

### 微信

<div>
<img src="https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/donate/wechat.jpg" alt="wechat" style="width:280px;height:375px;" />
</div>

### 支付宝

<div>
<img src="https://static-rs-terwer.oss-cn-beijing.aliyuncs.com/donate/alipay.jpg" alt="alipay" style="width:280px;height:375px;" />
</div>

### 爱发电

https://afdian.com/a/terwer

# 感谢

感谢第三方框架对本项目底层的支持

排名不分先后

|    Name     | version |  vendor   |
| :---------: | :-----: | :-------: |
|    turbo    |  1.9+   |  Vercel   |
|     Vue     | 3.3.4+  | Evan You  |
|    Vite     |  4.2+   | Evan You  |
| TypeScript  |  5.0+   | Microsoft |
| siyuan-note | 2.9.0+  |    D,V    |

- 感谢 [leolee9086](https://github.com/leolee9086) 和 [赐我一胖]() 提供的图标资源

- 感谢以下热心用户的支持，我会坚持一直持续更新维护下去！

    - 2024-03-31 *仁 捐赠到 [发布工具]
    
    - 2024-03-22 *铭 捐赠到 [发布工具]
    - 2024-03-05 *ruler 捐赠到 [发布工具]
    
    - 2024-03-12 *? 捐赠到 [发布工具]
    - 2024-03-04 *azar 捐赠到 [发布工具]
    - 2024-02-28 *昭 捐赠到 [发布工具]
    - 2024-01-15 自* 捐赠到 [发布工具]
    - 2024-01-09 自* 捐赠到 [发布工具]
    - 2023-11-12 S* 捐赠到 [发布工具]
    - 2023-10-15 *线 捐赠到 [发布工具]
    - 2023-09-04 \*霞 捐赠到 [发布工具]
    - 2023-08-31 \*成 捐赠到 [发布工具] 感谢提供笔记发布工具，催更
    - 2023-08-31 \*? 捐赠到 [发布工具] 感谢提供思源笔记发布工具
    - 2023-08-14 \*? 捐赠到 [发布工具]
    - 2023-08-10 \*f 捐赠到 [发布工具] 为发布插件点赞
    - 2023-08-10 \*2 捐赠到 [发布工具] 支持开发思源发布插件
    - 2023-07-13 \*亮 捐赠到 [文档别名] 有没有可能把功能扩展到 H1？
    - 2023-07-09 \*z 捐赠到 [在线分享] 在线分享插件好用，感谢
    - 2023-06-14 \*俊 捐赠到 [文档漫游] 感谢文档漫游这个功能
    - 2023-01-16 \*站 捐赠到 [导入工具] 终于可以导入 epub 了
    
      如果您不想展示捐赠信息，可直接发邮件到 youweics@163.com 。