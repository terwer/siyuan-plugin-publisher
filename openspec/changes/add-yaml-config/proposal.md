# Change: 本地系统模式新增 YAML 类型配置项

## Why
当前本地系统模式配置项类型有限，无法满足用户对各平台 YAML 规则配置的需求。添加 YAML 类型配置项可以使用户更灵活地为不同平台配置特定的 YAML 元数据格式。

## What Changes
- 在本地系统模式中新增 YAML 类型配置项
- 支持为不同平台定义 YAML 规则
- 利用已有的适配器架构实现平台特定的 YAML 处理
- 确保 YAML 配置与各平台的发布逻辑无缝集成

## Impact
- 新增 system-config 规范
- 涉及代码：src/adaptors/fs、src/platforms、src/components/set 等相关模块
- 不影响现有功能，属于功能增强