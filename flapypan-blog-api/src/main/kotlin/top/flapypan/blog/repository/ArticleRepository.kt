package top.flapypan.blog.repository

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import top.flapypan.blog.entity.Article

@Repository
interface ArticleRepository : JpaRepository<Article, Long> {

    /**
     * 通过路径获取文章
     */
    fun findFirstByPath(path: String): Article?

    /**
     * 模糊查询标题和标签名
     */
    fun findAllByTitleContainingIgnoreCaseOrTagsNameContainingIgnoreCase(
        title: String,
        tagName: String,
        pageable: Pageable
    ): Page<Article>

    /**
     * 通过标签名获取文章分页
     */
    fun findAllByTagsName(tagName: String, pageable: Pageable): Page<Article>

    /**
     * 通过标签名获取文章数量
     */
    fun countByTagsId(tagId: Long): Long

}
