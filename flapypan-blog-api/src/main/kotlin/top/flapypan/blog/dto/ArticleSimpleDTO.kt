package top.flapypan.blog.dto

import top.flapypan.blog.entity.Article
import top.flapypan.blog.entity.Tag
import java.time.LocalDateTime

data class ArticleSimpleDTO(
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
