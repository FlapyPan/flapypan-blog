import type { IAccess, IArticle, IAttribute, IPicture } from '~/types/models'

type WithId<T> = T & { _id: string }

type Access = WithId<IAccess>
type AccessData = {
  today?: number
  all?: number
}

type Article = WithId<IArticle>
type ArticleWithoutContent = Omit<Article, 'content'>

type Attribute = WithId<IAttribute>

type Picture = WithId<IPicture>
