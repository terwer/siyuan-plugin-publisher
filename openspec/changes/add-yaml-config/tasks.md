## 1. 实现准备
- [ ] 1.1 定义 FsYamlType 枚举，包含支持的 YAML 类型
- [ ] 1.2 确认 LocalSystemConfig 中需要添加的 FsYamlType 字段
- [ ] 1.3 研究现有平台 YAML 适配器的使用方式

## 2. 核心功能实现
- [ ] 2.1 在 LocalSystemConfig 中添加 fsYamlType 配置项
- [ ] 2.2 修改 LocalSystemApiAdaptor 的 getYamlAdaptor 方法，实现基于 fsYamlType 的动态适配器选择
- [ ] 2.3 当 fsYamlType 为 Hexo 时，集成 HexoYamlConvertAdaptor
- [ ] 2.4 确保与 super.yamlLinkEnabled 功能的兼容性

## 3. 前端界面开发
- [ ] 3.1 在 LocalSystemSetting.vue 中添加 YAML 类型选择下拉框
- [ ] 3.2 添加相应的国际化翻译
- [ ] 3.3 实现配置保存和加载逻辑

## 4. 测试与文档
- [ ] 4.1 测试不同 fsYamlType 设置下的 YAML 生成
- [ ] 4.2 验证与 yamlLinkEnabled 的兼容性
- [ ] 4.3 更新使用文档，说明如何配置 YAML 类型