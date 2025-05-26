import { createRouter, createWebHistory } from 'vue-router'
import TestIndex from '../test/index.vue'
import ButtonTest from '../test/ButtonTest.vue'
import FormTest from '../test/FormTest.vue'
import TabTest from '../test/TabTest.vue'
import SettingPanelTest from '../test/SettingPanelTest.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/test',
      component: TestIndex,
      children: [
        {
          path: 'button',
          name: 'ButtonTest',
          component: ButtonTest
        },
        {
          path: 'form',
          name: 'FormTest',
          component: FormTest
        },
        {
          path: 'tab',
          name: 'TabTest',
          component: TabTest
        },
        {
          path: 'setting-panel',
          name: 'SettingPanelTest',
          component: SettingPanelTest
        }
      ]
    },
    {
      path: '/',
      redirect: '/test/button'
    }
  ]
})

export default router
