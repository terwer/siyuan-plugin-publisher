import { WordPressPlugin } from './index'

declare global {
  interface Window {
    pt: {
      [key: string]: WordPressPlugin
    }
  }
} 