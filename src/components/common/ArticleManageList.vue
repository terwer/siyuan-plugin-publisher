<!--
  -            GNU GENERAL PUBLIC LICENSE
  -               Version 3, 29 June 2007
  -
  -  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
  -  Everyone is permitted to copy and distribute verbatim copies
  -  of this license document, but changing it is not allowed.
  -->

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { useArticleManage, ArticleManageAction } from "~/src/composables/useArticleManage.ts"
import { svgIcons } from "~/src/utils/svgIcons.ts"
import MaterialSymbolsDriveFolderUpload from "~icons/material-symbols/drive-folder-upload"
import MaterialSymbolsAddPhotoAlternateOutline from "~icons/material-symbols/add-photo-alternate-outline"
import MaterialSymbolsRocketLaunch from "~icons/material-symbols/rocket-launch"
import MdiMinusBoxMultipleOutline from "~icons/mdi/minus-box-multiple-outline"
import Fa6SolidBookOpenReader from "~icons/fa6-solid/book-open-reader"
import Fa6SolidHouse from "~icons/fa6-solid/house"

const props = withDefaults(
  defineProps<{
    enableView?: boolean
    enablePicgo?: boolean
  }>(),
  {
    enableView: true,
    enablePicgo: true,
  }
)

const emit = defineEmits<{
  action: [payload: ArticleManageAction]
}>()

const { t } = useVueI18n()
const { state, isWidgetEmpty, reload, setKeyword, setShowPublished, setPage, setNotebooks } = useArticleManage()
const keywordRef = ref(state.keyword)

const dispatch = (type: ArticleManageAction["type"], row: any) => {
  emit("action", { type, row })
}

const dispatchPlatform = (type: ArticleManageAction["type"], row: any, platformKey: string) => {
  emit("action", { type, row, platformKey })
}

const onSearch = () => {
  setKeyword(keywordRef.value)
  void reload()
}

const onShowPublishedChange = (val: boolean) => {
  setShowPublished(val)
  void reload()
}

const onPageChange = async (page: number) => {
  await setPage(page)
}

const onNotebooksChange = async (ids: string[]) => {
  await setNotebooks(ids)
}

const handleWidgetEmpty = () => {
  emit("action", { type: "widget-empty" })
}

onMounted(async () => {
  await reload()
})
</script>

<template>
  <div class="article-manage-box">
    <!-- 过滤条 -->
    <div class="article-manage-filter">
      <div class="article-manage-filter__notebooks">
        <label class="article-manage-filter__label">{{ t("articleManage.notebookFilter") }}</label>
        <el-select
          v-model="state.selectedNotebookIds"
          multiple
          collapse-tags
          :placeholder="t('articleManage.notebookFilter.placeholder')"
          class="article-manage-filter__select"
          @change="onNotebooksChange"
        >
          <el-option
            v-for="nb in state.notebookOptions"
            :key="nb.id"
            :label="nb.name"
            :value="nb.id"
          />
        </el-select>
      </div>

      <div class="article-manage-filter__search">
        <el-input
          v-model="keywordRef"
          class="article-manage-filter__input"
          clearable
          :placeholder="t('articleManage.search.placeholder')"
          @keyup.enter="onSearch"
        />
        <el-button type="primary" class="article-manage-filter__btn" @click="onSearch">
          {{ t("articleManage.searchBtn") }}
        </el-button>
        <el-checkbox :model-value="state.showPublished" size="large" @change="onShowPublishedChange">
          {{ t("articleManage.publishedOnly") }}
        </el-checkbox>
      </div>
    </div>

    <!-- 挂件空态（当前文档无子文档） -->
    <div v-if="isWidgetEmpty" class="article-manage-widget-empty">
      <div class="article-manage-widget-empty__title">{{ t("articleManage.widget.empty.title") }}</div>
      <div class="article-manage-widget-empty__desc">{{ t("articleManage.widget.empty.desc") }}</div>
      <el-button type="primary" @click="handleWidgetEmpty">{{ t("articleManage.widget.empty.action") }}</el-button>
    </div>

    <!-- 加载态 -->
    <div v-else-if="state.isLoading" class="article-manage-empty">
      <el-skeleton :loading="state.isLoading" :rows="5" animated />
    </div>

    <!-- 表格 -->
    <div v-else class="article-manage-data">
      <el-table :data="state.rows" border stripe highlight-current-row empty-text=" " style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <div class="article-manage-extend">
              <p class="article-manage-extend__row">ID: {{ props.row.postid }}</p>
              <p class="article-manage-extend__row">{{ t("articleManage.extend.publishTime") }}: {{ props.row.dateCreated }}</p>
              <p class="article-manage-extend__row">{{ t("articleManage.extend.title") }}: {{ props.row.title }}</p>
              <p class="article-manage-extend__row">
                {{ t("articleManage.extend.tags") }}:
                {{ props.row.mt_keywords === "" ? t("articleManage.extend.noTags") : props.row.mt_keywords }}
              </p>
              <p class="article-manage-extend__row">{{ t("articleManage.extend.summary") }}: {{ props.row.shortDesc }}</p>
              <div class="article-manage-extend__row">
                {{ t("articleManage.extend.platform") }}:
                <span v-if="props.row.yamlCount > 0">
                  <span
                    v-for="(value, key) in props.row.yamlAttrs"
                    :key="key"
                    class="article-manage-extend__platform-item"
                  >
                    <a
                      class="article-manage-extend__platform-link"
                      @click="dispatchPlatform('platform-single', props.row, props.row.dynCfgs[key]?.platformKey ?? key)"
                    >
                      <el-text>
                        <i class="el-icon">
                          <span
                            v-html="
                              props.row.dynCfgs[key]?.platformIcon ?? svgIcons.iconOTRemove
                            "
                          ></span>
                        </i>
                        {{ props.row.dynCfgs[key]?.platformName ?? t("articleManage.platformDeleted") }}
                      </el-text>
                      <span class="article-manage-extend__platform-hint">
                        {{
                          props.row.yamlAttrs[key]
                            ? t("articleManage.extend.platformUpdate")
                            : t("articleManage.extend.platformPublish")
                        }}
                      </span>
                    </a>
                  </span>
                </span>
                <span v-else>{{ t("articleManage.extend.noPlatform") }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="title">
          <template #header>
            <div style="text-align: center">{{ t("articleManage.col.title") }}</div>
          </template>
          <template #default="scope">
            <el-tooltip
              :content="
                scope.row.yamlCount > 0
                  ? t('articleManage.tooltip.publishedTo') + Object.keys(scope.row.yamlAttrs).toString()
                  : t('articleManage.tooltip.notPublished')
              "
              class="article-manage-tooltip"
              effect="light"
              placement="right"
            >
              <span>{{ scope.row.title }}</span>
            </el-tooltip>
            <sup v-if="scope.row.yamlCount > 0" class="article-manage-yaml-sign">{{ scope.row.yamlCount }}</sup>
          </template>
        </el-table-column>

        <el-table-column align="center" width="420">
          <template #header>
            <div style="text-align: center">{{ t("articleManage.col.action") }}</div>
          </template>
          <template #default="scope">
            <el-button size="small" @click="dispatch('quick', scope.row)">
              <MaterialSymbolsRocketLaunch />&nbsp;{{ t("articleManage.action.quick") }}
            </el-button>
            <el-button size="small" @click="dispatch('single', scope.row)">
              <MaterialSymbolsDriveFolderUpload />&nbsp;{{ t("articleManage.action.single") }}
            </el-button>
            <el-button size="small" @click="dispatch('batch', scope.row)">
              <MdiMinusBoxMultipleOutline />&nbsp;{{ t("articleManage.action.batch") }}
            </el-button>
            <el-button
              v-if="enableView && scope.row.isShared"
              size="small"
              @click="dispatch('view', scope.row)"
            >
              <Fa6SolidBookOpenReader />&nbsp;{{ t("articleManage.action.view") }}
            </el-button>
            <el-button v-if="enablePicgo" size="small" @click="dispatch('picgo', scope.row)">
              <MaterialSymbolsAddPhotoAlternateOutline />&nbsp;{{ t("articleManage.action.picgo") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        small
        background
        layout="prev,pager,next"
        :total="state.total"
        class="article-manage-pagination"
        :page-size="state.pageSize"
        @prev-click="onPageChange"
        @next-click="onPageChange"
        :current-page="state.currentPage"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>

<style scoped lang="stylus">
.article-manage-box
  font-family var(--g-font-family, inherit)
  padding 0 10px

.article-manage-filter
  display flex
  flex-direction column
  gap 10px
  margin-top 12px

.article-manage-filter__notebooks
  display flex
  align-items center
  gap 8px

.article-manage-filter__label
  font-size 12px
  color var(--b3-theme-on-surface, inherit)
  white-space nowrap

.article-manage-filter__select
  flex 1
  min-width 200px

.article-manage-filter__search
  display flex
  align-items center
  gap 8px

.article-manage-filter__input
  flex 1

.article-manage-filter__btn
  flex-shrink 0

.article-manage-widget-empty,
.article-manage-empty
  margin 16px 0

.article-manage-widget-empty
  padding 20px
  border-radius 8px
  border 1px solid var(--b3-border-color, #e5e7eb)
  text-align center

.article-manage-widget-empty__title
  font-weight 600
  margin-bottom 6px

.article-manage-widget-empty__desc
  color var(--b3-theme-on-surface-light, #6b7280)
  margin-bottom 12px

.article-manage-data
  margin-top 10px

.article-manage-extend
  padding 4px 10px

.article-manage-extend__row
  margin 0 0 8px

.article-manage-extend__platform-item
  margin-right 10px

  a
    cursor pointer
    color var(--el-color-primary, #409eff)

.article-manage-extend__platform-link
  position relative
  display inline-flex
  align-items center
  gap 4px

.article-manage-extend__platform-hint
  position absolute
  top -24px
  left 0
  background #303133
  color #fff
  font-size 11px
  line-height 1
  padding 3px 8px
  border-radius 4px
  white-space nowrap
  opacity 0
  pointer-events none
  transition opacity 0.12s
  z-index 6

.article-manage-extend__platform-link:hover .article-manage-extend__platform-hint
  opacity 1

.article-manage-tooltip
  cursor default

.article-manage-yaml-sign
  color #f56c6c
  font-size 12px
  padding-left 2px

.article-manage-pagination
  text-align center
  margin-top 20px
  justify-content center
</style>
