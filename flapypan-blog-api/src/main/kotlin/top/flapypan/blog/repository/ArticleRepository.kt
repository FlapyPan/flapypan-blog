package top.flapypan.blog.repository

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import top.flapypan.blog.entity.Article

@Repository
interface ArticleRepository : JpaRepository<Article, Long> {

    fun findFirstByPath(path: String): Article?

    fun findAllByTitleContainingIgnoreCaseOrTagsNameContainingIgnoreCase(
        title: String,
        tagName: String,
        pageable: Pageable
    ): Page<Article>

    fun findAllByTagsName(tagName: String, pageable: Pageable): Page<Article>

    fun countByTagsId(tagId: Long): Long

}
