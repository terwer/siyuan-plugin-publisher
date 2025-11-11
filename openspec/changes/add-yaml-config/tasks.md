## 1. 实现准备
- [x] 1.1 定义 FsYamlType 枚举，包含支持的 YAML 类型
- [x] 1.2 确认 LocalSystemConfig 中需要添加的 FsYamlType 字段
- [x] 1.3 研究现有平台 YAML 适配器的使用方式

## 2. 核心功能实现
- [x] 2.1 在 LocalSystemConfig 中添加 fsYamlType 配置项
- [x] 2.2 创建 FsUtils 类封装 YAML 适配器选择逻辑，实现基于 fsYamlType 的动态适配器选择
- [x] 2.3 在 useLocalSystemApi 中使用 FsUtils 获取 YAML 适配器
- [x] 2.4 支持多种 YAML 类型，包括 Hexo、Hugo、Jekyll、Vuepress、Vitepress 等
- [x] 2.5 确保与 super.yamlLinkEnabled 功能的兼容性

## 3. 前端界面开发
- [x] 3.1 在 LocalSystemSetting.vue 中添加 YAML 类型选择下拉框
- [x] 3.2 添加相应的国际化翻译
- [x] 3.3 实现配置保存和加载逻辑

## 4. 测试与文档
- [x] 4.1 测试不同 fsYamlType 设置下的 YAML 生成
- [x] 4.2 验证与 yamlLinkEnabled 的兼容性
- [x] 4.3 更新使用文档，说明如何配置 YAML 类型