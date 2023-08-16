<!--
  - Copyright (c) 2023, Terwer . All rights reserved.
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

<script setup lang="ts">
import { PageEditMode } from "~/src/models/pageEditMode.ts"
import { reactive, watch } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"

const { t } = useVueI18n()

const props = defineProps({
  editType: {
    type: Number,
    default: PageEditMode.EditMode_simple,
  },
})

const formData = reactive({
  etype: props.editType,
})

watch(
  () => props.editType,
  (newValue) => {
    formData.etype = newValue
  }
)

const emit = defineEmits(["emitSyncEditMode"])

// methods
const onEditModeChange = (val: PageEditMode) => {
  formData.etype = val
  emit("emitSyncEditMode", val)
}
</script>

<template>
  <!-- 编辑模式 -->
  <div class="form-edit-mode">
    <el-form-item :label="t('main.publish.editmode')">
      <el-button-group>
        <el-button
          :type="formData.etype === PageEditMode.EditMode_simple ? 'primary' : 'default'"
          @click="onEditModeChange(PageEditMode.EditMode_simple)"
          >{{ t("main.publish.editmode.simple") }}
        </el-button>
        <el-button
          :type="formData.etype === PageEditMode.EditMode_complex ? 'primary' : 'default'"
          @click="onEditModeChange(PageEditMode.EditMode_complex)"
          >{{ t("main.publish.editmode.complex") }}
        </el-button>
        <el-button
          :type="formData.etype === PageEditMode.EditMode_source ? 'primary' : 'default'"
          @click="onEditModeChange(PageEditMode.EditMode_source)"
          >{{ t("main.publish.editmode.source") }}
        </el-button>
      </el-button-group>
    </el-form-item>
  </div>
</template>

<style scoped lang="stylus"></style>
