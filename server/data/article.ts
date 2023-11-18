import type { Pageable } from '~/server/utils/page'
import prisma from '~/server/data/prisma'

const pageSelect = {
  content: false,
  tags: true,
}

export function getArticlePage({ cursor, size, orderBy }: Pageable) {
  if (cursor) {
    return prisma.article.findMany({
      select: pageSelect,
      cursor: { id: cursor },
      take: size,
      orderBy,
    })
  }
  return prisma.article.findMany({ select: pageSelect, take: size })
}

const detailSelect = {
  tags: true,
}

export function getArticleByPath(path: string) {
  return prisma.article.findFirst({ select: detailSelect, where: { path } })
}

interface ArticleAddRequest {
  title: string
  path: string
  cover?: string | null
  content: string
  tagNames?: string[] | null
}

export function addArticle(article: ArticleAddRequest) {
  return prisma.article.create({
    data: {
      title: article.title,
      path: article.path,
      cover: article.cover,
      content: article.content,
    },
  })
}

interface ArticleModifyRequest {
  id: string
  title: string
  path: string
  cover?: string | null
  content: string
  tagNames?: string[] | null
}

export function modifyArticle(article: ArticleModifyRequest) {
  return prisma.article.update({
    where: { id: article.id },
    data: {
      ...article,
      tags: {
        createMany: article.tagNames?.map((name: string) => ({ name })),
      },
    },
  })
}

export function deleteArticle(id: string) {
  return prisma.article.delete({ where: { id } })
}
