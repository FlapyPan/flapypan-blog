import { marked } from 'marked'

/**
 * 转换 markdown 为纯文本
 * @param {string} md
 * @return {string}
 */
export function md2text(md) {
  const htmlString = marked(md)
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  const walker = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT)

  const textList = []
  let currentNode = walker.currentNode

  while (currentNode) {
    textList.push(currentNode.textContent)
    currentNode = walker.nextNode()
  }

  return textList.join(' ')
}
