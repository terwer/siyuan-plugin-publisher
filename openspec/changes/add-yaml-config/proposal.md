# Change: 本地系统模式支持基于 yamlType 的 YAML 适配器选择

## Why
当前本地系统模式使用固定的 YAML 处理方式，无法利用已有的平台特定 YAML 适配器。通过支持基于 FsYamlType 的适配器选择，可以使本地系统模式能够根据用户配置使用不同平台的 YAML 生成规则，提高兼容性。

## What Changes
- 在 LocalSystemConfig 中新增 FsYamlType 配置项，用于指定使用的 YAML 类型，枚举值包括 Default、Hexo、Hugo、Jekyll、Vuepress、Vitepress 等
- 创建新的 FsUtils 工具类，封装基于 FsYamlType 的 YAML 适配器选择逻辑
- 在 useLocalSystemApi 中使用 FsUtils 替代直接创建 YAML 适配器的方式
- 当 fsYamlType 为 Hexo 时，使用 HexoYamlConvertAdaptor 生成 YAML；同理支持其他类型
- 使用延迟导入机制避免循环依赖问题
- 确保与现有 super.yamlLinkEnabled 功能兼容

## Impact
- 涉及代码：src/adaptors/fs/LocalSystem/ 目录下的相关文件，包括新增的 FsUtils.ts
- 不影响现有功能，属于功能增强
- 用户可以通过配置选择不同平台的 YAML 生成规则
- 代码结构更清晰，职责更单一