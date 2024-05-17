export function getPageHtml(page, selector = "body") {
  return page.evaluate((selector) => {
    // Check if the selector is an XPath
    if (selector.startsWith("/")) {
      const elements = document.evaluate(
        selector,
        document,
        null,
        XPathResult.ANY_TYPE,
        null
      );
      let result = elements.iterateNext();
      return result ? result.textContent || "" : "";
    } else {





      const contentSection = document.querySelector('.mw-body-content');
      const refLists = contentSection.querySelectorAll('.reflist');
      const navboxes = contentSection.querySelectorAll('.navbox');
      // 遍历所有的 .reflist 元素并将其内容置为空
      refLists.forEach(refList => refList.innerHTML = '');
      // 遍历所有的 .navbox 元素并将其内容置为空
      navboxes.forEach(navbox => navbox.innerHTML = '');
      // 返回 .mw-body-content 元素的 HTML 内容，但不包括 .reflist 和 .navbox
      return contentSection.innerText;




      // Handle as a CSS selector
      const el = document.querySelector(selector);

      return el?.innerText || "";
    }
  }, selector);
}