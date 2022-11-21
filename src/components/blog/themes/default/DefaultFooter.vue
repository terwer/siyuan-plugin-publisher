<template>
  <div>
    <div class="footer">
      <div>
        <span class="text"> &copy;2011-2022 </span>
        <span class="s-dark" @click="goGithub()"> sy-post-publisher </span>
        <span class="text"> v0.1.0. </span>
        <span class="text s-dark" @click="toggleDark()">{{
            isDark ? $t('theme.mode.light') : $t('theme.mode.dark')
          }}</span>
        <span class="text">.</span> <span class="text s-dark" @click="changeSuyuanApi()"> {{ $t('blog.change.siyuan.api') }} </span>
        <span class="text">.</span> <span class="text s-dark" @click="newWin()"> {{ $t('blog.newwin.open') }} </span>

        <el-dialog v-model="siyuanApiChangeFormVisible" :title="$t('blog.change.siyuan.api')">
          <el-form ref="siyuanApiSettingFormRef" :model="siyuanApiChangeForm" :rules="siyuanApiChangeRules">
            <el-form-item :label="$t('setting.blog.apiurl')" :label-width="formLabelWidth" prop="apiUrl">
              <el-input v-model="siyuanApiChangeForm.apiUrl" autocomplete="off" :placeholder="$t('setting.blog.siyuan.apiurl')"/>
            </el-form-item>
            <el-form-item :label="$t('setting.blog.password')" :label-width="formLabelWidth" prop="pwd">
              <el-input v-model="siyuanApiChangeForm.pwd" type="password" autocomplete="off" :placeholder="$t('setting.blog.siyuan.password')" show-password/>
            </el-form-item>
            <el-form-item :label="$t('setting.blog.middlewareUrl')" :label-width="formLabelWidth" prop="middlewareUrl">
              <el-input v-model="siyuanApiChangeForm.middlewareUrl" autocomplete="off" :placeholder="$t('setting.blog.middlewareUrl.tip')"/>
            </el-form-item>
            <el-form-item>
              <el-alert class="top-data-tip middleware-tip" :title="$t('setting.blog.middlewareUrl.my.tip')"
                        type="success" :closable="false"/>
            </el-form-item>
          </el-form>

          <template #footer>

            <span class="dialog-footer">
              <el-button @click="siyuanApiChangeFormVisible = false">{{ $t('main.opt.cancel') }}</el-button>
              <el-button type="primary" @click="handleSiyuanApiSetting(siyuanApiSettingFormRef)">{{
                  $t('main.opt.ok')
                }}</el-button>
            </span>
          </template>
        </el-dialog>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useDark, useToggle} from "@vueuse/core";
import {goToPage, goToPageWithTarget} from "../../../../utils/browser/ChromeUtil";
import {onMounted, reactive, ref} from "vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import logUtil from "../../../../utils/logUtil";
import {useI18n} from "vue-i18n";
import {getSiyuanCfg, SiYuanConfig} from "../../../../utils/platform/siyuan/siYuanConfig";
import {setJSONConf} from "../../../../utils/config";
import {SIYUAN_CONSTANTS} from "../../../../utils/constants/siyuanConstants";
import {inSiyuan} from "../../../../utils/platform/siyuan/siyuanUtil";

const {t} = useI18n()

const isDark = useDark()
const toggleDark = useToggle(isDark)

const isInSiyuan = ref(false)

const formLabelWidth = '140px'
const siyuanApiChangeFormVisible = ref(false)
const siyuanApiSettingFormRef = ref<FormInstance>()
const siyuanApiChangeForm = reactive({
  apiUrl: 'http://127.0.0.1:6806',
  pwd: '',
  middlewareUrl: ''
})
const siyuanApiChangeRules = reactive<FormRules>(
    {
      apiUrl: [
        {
          required: true,
          message: () => t('form.validate.name.required')
        }
      ],
      pwd: [
        {
          required: false,
          message: () => t('form.validate.name.required')
        }
      ],
    }
)

const goGithub = () => {
  window.open("https://github.com/terwer/src-sy-post-publisher")
}
const newWin = () => {
  goToPage("/blog/index.html")
}

const changeSuyuanApi = () => {
  siyuanApiChangeFormVisible.value = true
}

const handleSiyuanApiSetting = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  const result = await formEl.validate((valid, fields) => {
    if (valid) {
      logUtil.logInfo("校验成功")
    } else {
      logUtil.logError(t('main.opt.failure'), fields)
      // ElMessage.error(t('main.opt.failure'))
      return
    }
  })
  if (!result) {
    return
  }

  // 保存思源笔记配置数据
  try {
    const siyuanCfg = new SiYuanConfig(siyuanApiChangeForm.apiUrl, siyuanApiChangeForm.pwd, siyuanApiChangeForm.middlewareUrl)
    setJSONConf<SiYuanConfig>(SIYUAN_CONSTANTS.SIYUAN_CFG_KEY, siyuanCfg)
    logUtil.logInfo("保存思源配置", siyuanCfg)
    ElMessage.success(t('main.opt.success'))
    setTimeout(function () {
      // 关闭对话框
      siyuanApiChangeFormVisible.value = false
      goToPageWithTarget("/blog/index.html", "_self")

    }, 500);
  } catch (e) {
    siyuanApiChangeFormVisible.value = false

    ElMessage.error(t("main.opt.failure"));
    logUtil.logError(t("main.opt.failure"), e)
  }
}

const initConf = () => {
  const siyuanCfg = getSiyuanCfg();

  siyuanApiChangeForm.apiUrl = siyuanCfg.baseUrl
  siyuanApiChangeForm.pwd = siyuanCfg.token
  siyuanApiChangeForm.middlewareUrl = siyuanCfg.middlewareUrl

  logUtil.logInfo("初始化思源配置", siyuanCfg)
}

onMounted(async () => {
  initConf()

  isInSiyuan.value = await inSiyuan();
})
</script>

<script lang="ts">
export default {
  name: "DefaultFooter"
}
</script>

<style scoped>
.footer {
  font-size: 12px;
  color: #bbb;
  text-align: center;
}

.footer .text {
  vertical-align: middle;
}

.s-dark {
  color: var(--el-color-primary);
  cursor: pointer;
}

.middleware-tip {
  text-align: left;
}
</style>