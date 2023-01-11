<!--
  - Copyright (c) 2022-2023, Terwer . All rights reserved.
  - DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
  -
  - This code is free software; you can redistribute it and/or modify it
  - under the terms of the GNU General Public License version 2 only, as
  - published by the Free Software Foundation.  Terwer designates this
  - particular file as subject to the "Classpath" exception as provided
  - by Terwer in the LICENSE file that accompanied this code.
  -
  - This code is distributed in the hope that it will be useful, but WITHOUT
  - ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
  - FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
  - version 2 for more details (a copy is included in the LICENSE file that
  - accompanied this code).
  -
  - You should have received a copy of the GNU General Public License version
  - 2 along with this work; if not, write to the Free Software Foundation,
  - Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
  -
  - Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
  - or visit www.terwer.space if you need additional information or have any
  - questions.
  -->

<template>
  <common-blog-setting
    :api-type="apiType"
    :username-enabled="true"
    :password-enabled="true"
    :cfg="cfg"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { API_TYPE_CONSTANTS } from "~/utils/constants/apiTypeConstants"
import { KmsCfg } from "~/utils/platform/commonblog/kms/kmsCfg"
import CommonBlogSetting from "../CommonBlogSetting.vue"
import { CommonblogPlaceholder } from "~/utils/platform/commonblog/commonblogPlaceholder"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const apiType = ref(API_TYPE_CONSTANTS.API_TYPE_KMS)

const kmsCfg = new KmsCfg()
const kmsPlaceholder = new CommonblogPlaceholder()
kmsPlaceholder.homePlaceholder = t("setting.kms.home.tip")
kmsPlaceholder.usernamePlaceholder = t("setting.kms.username.tip")
kmsPlaceholder.passwordPlaceholder = t("setting.kms.password.tip")
kmsPlaceholder.apiUrlPlaceholder = t("setting.kms.apiurl.tip")
kmsCfg.placeholder = kmsPlaceholder
const cfg = ref(kmsCfg)
</script>
