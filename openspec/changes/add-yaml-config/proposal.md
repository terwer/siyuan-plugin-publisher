# Change: 本地系统模式支持基于 yamlType 的 YAML 适配器选择

## Why
当前本地系统模式使用固定的 YAML 处理方式，无法利用已有的平台特定 YAML 适配器。通过支持基于 FsYamlType 的适配器选择，可以使本地系统模式能够根据用户配置使用不同平台的 YAML 生成规则，提高兼容性。

## What Changes
- 在 LocalSystemConfig 中新增 FsYamlType 配置项，用于指定使用的 YAML 类型，枚举值为 FsYamlType.Hexo="hexo"、FsYamlType.Hugo="hugo"等需要兼容所有的可能。
- 在 LocalSystemApiAdaptor 中根据 FsYamlType 动态选择合适的 YAML 适配器
- 例如：当 FsYamlType 为 FsYamlType.Hexo 时，使用 HexoYamlConvertAdaptor 生成 YAML
- 确保与现有 super.yamlLinkEnabled 功能兼容，其实这些再具体的 YamlAdapter 自己已经实现了

## Impact
- 涉及代码：src/adaptors/fs/LocalSystem/ 目录下的相关文件
- 不影响现有功能，属于功能增强
- 用户可以通过配置选择不同平台的 YAML 生成规则