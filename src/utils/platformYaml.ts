/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BlogConfig, Post, YamlConvertAdaptor, YamlFormatObj } from "zhi-blog-api"
import { StrUtil, YamlUtil } from "zhi-common"
import { applyDynYamlCfg } from "~/src/adaptors/api/base/dynYamlConfig.ts"

/**
 * 合并平台 YAML：以适配器重新生成的内容为准，保留已保存 YAML 里适配器不负责的字段。
 *
 * 各平台 YAML 适配器对「已有 YAML」的处理并不一致（有的重新生成、有的保留旧值），
 * 用户写在源码模式里的额外字段（如 sticky、cover、abbrlink）不该在再次发布或
 * 打开源码模式时消失（issue #2054）。
 *
 * @param generated 适配器生成的内容
 * @param stored 已保存的 YAML 内容
 */
export const mergeYamlObjs = (
  generated: Record<string, any>,
  stored: Record<string, any>
): Record<string, any> => {
  const merged: Record<string, any> = { ...(stored ?? {}) }
  Object.keys(generated ?? {}).forEach((key) => {
    if (generated[key] === undefined) {
      return
    }
    merged[key] = generated[key]
  })
  return merged
}

/**
 * 按平台适配器重建 YAML，并把已保存 YAML 里适配器不负责的字段合并回来。
 *
 * @param yamlAdaptor 平台 YAML 适配器
 * @param post 当前编辑模型
 * @param cfg 平台配置
 */
export const buildPlatformYamlFormatObj = async (
  yamlAdaptor: YamlConvertAdaptor,
  post: Post,
  cfg: BlogConfig
): Promise<YamlFormatObj> => {
  const storedYaml = post?.yaml ?? ""
  let storedYamlObj: Record<string, any> | undefined
  if (!StrUtil.isEmptyString(storedYaml)) {
    storedYamlObj = await YamlUtil.yaml2ObjAsync(storedYaml)
  }

  const baseYamlFormatObj = new YamlFormatObj()
  if (storedYamlObj) {
    baseYamlFormatObj.yamlObj = storedYamlObj
  }
  const generated = yamlAdaptor.convertToYaml(post, storedYamlObj ? baseYamlFormatObj : undefined, cfg)
  if (!storedYamlObj) {
    return generated
  }

  // 适配器只负责自己认识的字段，其余字段按已保存内容补齐后重新序列化
  const mergedYamlObj = mergeYamlObjs(generated.yamlObj, storedYamlObj)
  // 各平台适配器对「已有 YAML」的处理不一致：Hugo、Astro、Quartz、Docsify 等会保留
  // 原文且不应用预设。预设是平台级配置，只要重建 Front Matter 就应该逐键合并，
  // 否则重新发布或打开源码模式时，新配置的预设字段不会出现（issue #1667）。
  applyDynYamlCfg(mergedYamlObj, cfg?.dynYamlCfg, post)
  generated.yamlObj = mergedYamlObj
  generated.formatter = YamlUtil.obj2Yaml(mergedYamlObj)
  generated.mdFullContent = YamlUtil.addYamlToMd(generated.formatter, generated.mdContent)
  return generated
}

/**
 * 源码模式使用的有效 YAML。
 *
 * 源码模式展示与发布使用同一份内容：按平台适配器重建 YAML（含 YAML 预设），再把结果
 * 写回 Post。发布链路对源码模式以编辑器内容为准，不会再次重建，因此必须在这里同步，
 * 否则界面里看到的 YAML 与真正发布出去的 YAML 会不一致（issue #1667）。
 *
 * @param yamlAdaptor 平台 YAML 适配器
 * @param post 当前编辑模型
 * @param cfg 平台配置
 */
export const buildSourceModeYamlPost = async (
  yamlAdaptor: YamlConvertAdaptor,
  post: Post,
  cfg: BlogConfig
): Promise<{ yamlFormatObj: YamlFormatObj; post: Post }> => {
  const yamlFormatObj = await buildPlatformYamlFormatObj(yamlAdaptor, post, cfg)
  post.yaml = yamlFormatObj.formatter
  return { yamlFormatObj, post }
}
