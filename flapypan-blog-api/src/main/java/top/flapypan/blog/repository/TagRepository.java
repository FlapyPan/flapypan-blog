package top.flapypan.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import top.flapypan.blog.dto.TagDTO;
import top.flapypan.blog.entity.Tag;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    List<Tag> findAllByNameIn(Collection<String> names);

    Optional<Tag> findByName(String name);

    @Query("""
            SELECT new top.flapypan.blog.dto.TagDTO(t.id, t.name, COUNT(a))
                FROM Tag t LEFT JOIN Article a ON t MEMBER OF a.tags
                GROUP BY t.id, t.name
            """)
    List<TagDTO> getTagDTOList();

    @Modifying
    @Query(value = """
            DELETE FROM t_article_tag t
                WHERE t.tag_id = :tagId
            """, nativeQuery = true)
    void deleteArticleTagByTagId(Long tagId);

    @Modifying
    @Query(value = """
            DELETE FROM t_article_tag t
                WHERE t.article_id = :articleId
            """, nativeQuery = true)
    void deleteArticleTagByArticleId(Long articleId);

}
