import en_US from './en_US'
import zh_CN from './zh_CN'

const messages = {
  en_US,
  zh_CN
}

export type Language = "en_US" | "zh_CN"

const currentLanguage: Language = window?.pt?.api?.siyuan?.config?.lang || "zh_CN"

export function t(key: string): string {
  const keys = key.split('.')
  let value: any = messages[currentLanguage]

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k]
    } else {
      return key
    }
  }

  return typeof value === 'string' ? value : key
}