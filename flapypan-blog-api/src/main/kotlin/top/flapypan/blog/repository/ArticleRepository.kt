package top.flapypan.blog.repository

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import top.flapypan.blog.entity.Article

@Repository
interface ArticleRepository : JpaRepository<Article, Long> {

    fun findFirstByPath(path: String): Article?

    @Query(
        """
        SELECT a FROM Article a 
            WHERE LOWER(a.title) LIKE :keyword 
            OR EXISTS (SELECT t FROM a.tags t WHERE LOWER(t.name) LIKE :keyword)
        """
    )
    fun findByKeyword(keyword: String, pageable: Pageable): Page<Article>

    @Query(
        """
        SELECT a FROM Article a
            JOIN a.tags t
            WHERE t.name = :tagName
        """
    )
    fun findAllByTagsName(tagName: String, pageable: Pageable): Page<Article>

}
