package top.flapypan.blog.vo

import top.flapypan.blog.entity.Article
import top.flapypan.blog.entity.Tag
import java.time.LocalDateTime

data class ArticleInfo(
    val id: Long,
    val title: String,
    val path: String,
    val cover: String?,
    val tags: List<Tag>,
    val createDate: LocalDateTime,
    val updateDate: LocalDateTime
) {

    constructor(article: Article) : this(
        id = article.id,
        title = article.title,
        path = article.path,
        cover = article.cover,
        tags = article.tags,
        createDate = article.createDate,
        updateDate = article.updateDate
    )

}

data class ArticleGroupByYear(
    val year: String,
    val list: List<ArticleInfo>
) {
    constructor(year: Int, list: List<Article>) : this(year.toString(), list.map(::ArticleInfo))
}

fun List<Article>.groupByYear() =
    groupBy { it.createDate.year }
        .map { (year, articles) -> ArticleGroupByYear(year, articles) }
