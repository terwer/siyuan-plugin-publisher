/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 页面工具类
 *
 * @author terwer
 * @version 2.0.0
 * @since 2.0.0
 */
export class PageUtils {
  /**
   * 滚动到发布工具的顶部
   */
  public static scrollTop() {
    // 找到发布工具的菜单容器并滚动到顶部
    const menuItems = document.querySelector('[data-name="publisherMenu"] .b3-menu__items')
    if (menuItems) {
      menuItems.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }
}
