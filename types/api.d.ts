import type { IAccess, IArticle, IAttribute, IPicture } from '~/types/models'

type WithId<T> = T & { _id: string }

type Access = WithId<IAccess>
interface AccessData {
  today?: number
  all?: number
}

type Article = WithId<IArticle>
type ArticleWithoutContent = Omit<Article, 'content'>
type ArticleDraft = Omit<(IArticle & { _id?: string }), 'createdAt' | 'updatedAt'>

type Attribute = WithId<IAttribute>

type Picture = WithId<IPicture>
