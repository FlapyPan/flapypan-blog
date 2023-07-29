package top.flapypan.blog.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import top.flapypan.blog.dto.TagDTO
import top.flapypan.blog.entity.Tag

@Repository
interface TagRepository : JpaRepository<Tag, Long> {

    fun findAllByNameIn(names: Collection<String>): List<Tag>

    fun findByName(name: String): Tag?

    @Query(
        """
            SELECT new top.flapypan.blog.dto.TagDTO(t.id, t.name, COUNT(a))
                FROM Tag t LEFT JOIN Article a ON t MEMBER OF a.tags
                GROUP BY t.id, t.name
        """
    )
    fun getTagDTOList(): List<TagDTO>

    @Modifying
    @Query(
        value = """
            DELETE FROM t_article_tag t
                WHERE t.tag_id = :tagId
        """, nativeQuery = true
    )
    fun deleteArticleTagByTagId(tagId: Long)

    @Modifying
    @Query(
        value = """
            DELETE FROM t_article_tag t
                WHERE t.article_id = :articleId
            
        """, nativeQuery = true
    )
    fun deleteArticleTagByArticleId(articleId: Long)

}
