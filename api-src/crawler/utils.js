export function getPageHtmlBase(page, selector = 'body') {
  return page.evaluate((selector) => {
    // Check if the selector is an XPath
    if (selector.startsWith('/')) {
      const elements = document.evaluate(
        selector,
        document,
        null,
        XPathResult.ANY_TYPE,
        null,
      );
      let result = elements.iterateNext();
      return result ? result.textContent || '' : '';
    }
    // Handle as a CSS selector
    const results = document.querySelectorAll(selector);
    if (results.length) {
      return Array.from(results).map(
        (el) => el?.innerText || el?.innerHtml || '',
      );
    }
    return '未匹配到元素：' + selector;
  }, selector);
}
