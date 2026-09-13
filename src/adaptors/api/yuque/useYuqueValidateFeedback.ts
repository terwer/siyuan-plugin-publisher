/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 */

import { ElMessage } from "element-plus"
import { formatYuqueValidateError, isYuqueQuotaOrMembershipError } from "~/src/adaptors/api/yuque/yuqueApiError.ts"

export interface YuqueValidateResult {
  ok?: boolean
  apiStatus?: boolean
  errorMessage?: string
}

/** 语雀 API 配置页专用：在通用验证 toast 之后补充醒目的会员/429 说明，不修改 CommonBlogSetting */
export const showYuqueValidateFeedback = (result: YuqueValidateResult) => {
  if (result?.ok || result?.apiStatus) {
    return
  }
  const raw = String(result?.errorMessage ?? "")
  if (!isYuqueQuotaOrMembershipError(raw)) {
    return
  }
  ElMessage({
    type: "error",
    message: formatYuqueValidateError(raw),
    duration: 12000,
    showClose: true,
    offset: 72,
  })
}
